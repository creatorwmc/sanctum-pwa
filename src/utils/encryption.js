// Encryption utilities using Web Crypto API
// Provides AES-GCM encryption for privacy mode

const SALT = 'sanctum-salt-v1'
const ITERATIONS = 100000

/**
 * Generate an encryption key from a user passphrase using PBKDF2
 * @param {string} passphrase - User's passphrase
 * @returns {Promise<CryptoKey>} - Derived encryption key
 */
export async function generateKey(passphrase) {
  const encoder = new TextEncoder()

  // Import passphrase as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  // Derive AES-GCM key from passphrase
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(SALT),
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )

  return key
}

/**
 * Encrypt data with AES-GCM
 * @param {any} data - Data to encrypt (will be JSON serialized)
 * @param {CryptoKey} key - Encryption key
 * @returns {Promise<{iv: number[], data: number[]}>} - Encrypted package
 */
export async function encryptData(data, key) {
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(JSON.stringify(data))
  )

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  }
}

/**
 * Decrypt data with AES-GCM
 * @param {{iv: number[], data: number[]}} encryptedPackage - Encrypted data package
 * @param {CryptoKey} key - Decryption key
 * @returns {Promise<any>} - Decrypted data
 */
export async function decryptData(encryptedPackage, key) {
  const iv = new Uint8Array(encryptedPackage.iv)
  const data = new Uint8Array(encryptedPackage.data)

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  )

  const decoder = new TextDecoder()
  return JSON.parse(decoder.decode(decrypted))
}

/**
 * Test if a passphrase is correct by attempting to decrypt test data
 * @param {string} passphrase - Passphrase to test
 * @returns {Promise<boolean>} - True if passphrase is correct
 */
export async function verifyPassphrase(passphrase) {
  try {
    const testData = localStorage.getItem('sanctum-encryption-test')
    if (!testData) return true // No encrypted data yet, any passphrase is valid

    const key = await generateKey(passphrase)
    const encrypted = JSON.parse(testData)
    await decryptData(encrypted, key)
    return true
  } catch (err) {
    return false
  }
}

/**
 * Store a test value to verify passphrase later
 * @param {CryptoKey} key - Encryption key
 */
export async function storeTestValue(key) {
  const testValue = { test: 'sanctum-encryption-verification', timestamp: Date.now() }
  const encrypted = await encryptData(testValue, key)
  localStorage.setItem('sanctum-encryption-test', JSON.stringify(encrypted))
}

/**
 * Check if encryption is set up
 * @returns {boolean}
 */
export function isEncryptionSetUp() {
  return !!localStorage.getItem('sanctum-encryption-test')
}
