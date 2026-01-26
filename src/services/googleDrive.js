// Google Drive API service for Sanctum PWA

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || ''
// Extended scopes: file for exports, readonly for browsing
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly'
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
const FOLDER_NAME = 'Sanctum Exports'

let tokenClient = null
let gapiInited = false
let gisInited = false

/**
 * Check if Google Drive is configured
 */
export function isGoogleDriveConfigured() {
  return Boolean(GOOGLE_CLIENT_ID && GOOGLE_API_KEY)
}

/**
 * Load the Google API scripts
 */
export function loadGoogleScripts() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.gapi && window.google) {
      resolve()
      return
    }

    // Load GAPI
    const gapiScript = document.createElement('script')
    gapiScript.src = 'https://apis.google.com/js/api.js'
    gapiScript.async = true
    gapiScript.defer = true

    // Load GIS (Google Identity Services)
    const gisScript = document.createElement('script')
    gisScript.src = 'https://accounts.google.com/gsi/client'
    gisScript.async = true
    gisScript.defer = true

    let gapiLoaded = false
    let gisLoaded = false

    const checkBothLoaded = () => {
      if (gapiLoaded && gisLoaded) {
        resolve()
      }
    }

    gapiScript.onload = () => {
      gapiLoaded = true
      checkBothLoaded()
    }

    gisScript.onload = () => {
      gisLoaded = true
      checkBothLoaded()
    }

    gapiScript.onerror = reject
    gisScript.onerror = reject

    document.head.appendChild(gapiScript)
    document.head.appendChild(gisScript)
  })
}

/**
 * Initialize the Google API client
 */
export async function initGoogleApi() {
  if (!isGoogleDriveConfigured()) {
    throw new Error('Google Drive is not configured. Please set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY.')
  }

  await loadGoogleScripts()

  // Initialize GAPI
  await new Promise((resolve, reject) => {
    window.gapi.load('client', { callback: resolve, onerror: reject })
  })

  await window.gapi.client.init({
    apiKey: GOOGLE_API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  })

  gapiInited = true

  // Initialize GIS token client
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    callback: '', // Will be set later
  })

  gisInited = true
}

/**
 * Check if user is connected to Google Drive
 */
export function isConnected() {
  const token = localStorage.getItem('sanctum-google-token')
  if (!token) return false

  try {
    const tokenData = JSON.parse(token)
    // Check if token is expired (with 5 min buffer)
    if (tokenData.expiresAt && Date.now() > tokenData.expiresAt - 300000) {
      localStorage.removeItem('sanctum-google-token')
      return false
    }
    return true
  } catch {
    return false
  }
}

/**
 * Get the stored access token
 */
export function getAccessToken() {
  const token = localStorage.getItem('sanctum-google-token')
  if (!token) return null

  try {
    const tokenData = JSON.parse(token)
    return tokenData.accessToken
  } catch {
    return null
  }
}

/**
 * Connect to Google Drive (OAuth flow)
 */
export function connectGoogleDrive() {
  return new Promise(async (resolve, reject) => {
    if (!gapiInited || !gisInited) {
      try {
        await initGoogleApi()
      } catch (error) {
        reject(error)
        return
      }
    }

    tokenClient.callback = (response) => {
      if (response.error) {
        reject(new Error(response.error))
        return
      }

      // Store token with expiration
      const tokenData = {
        accessToken: response.access_token,
        expiresAt: Date.now() + (response.expires_in * 1000)
      }
      localStorage.setItem('sanctum-google-token', JSON.stringify(tokenData))

      // Set the token for gapi
      window.gapi.client.setToken({ access_token: response.access_token })

      resolve(response)
    }

    // Check if we have a valid token
    if (isConnected()) {
      const token = getAccessToken()
      window.gapi.client.setToken({ access_token: token })
      resolve({ access_token: token })
    } else {
      // Request new token
      tokenClient.requestAccessToken({ prompt: 'consent' })
    }
  })
}

/**
 * Disconnect from Google Drive
 */
export function disconnectGoogleDrive() {
  const token = getAccessToken()
  if (token) {
    window.google?.accounts.oauth2.revoke(token)
  }
  localStorage.removeItem('sanctum-google-token')
  if (window.gapi?.client) {
    window.gapi.client.setToken(null)
  }
}

/**
 * Get or create the Sanctum folder in Google Drive
 */
async function getOrCreateFolder() {
  // Search for existing folder
  const searchResponse = await window.gapi.client.drive.files.list({
    q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  })

  if (searchResponse.result.files && searchResponse.result.files.length > 0) {
    return searchResponse.result.files[0].id
  }

  // Create new folder
  const createResponse = await window.gapi.client.drive.files.create({
    resource: {
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder'
    },
    fields: 'id'
  })

  return createResponse.result.id
}

/**
 * Upload a file to Google Drive
 */
export async function uploadToGoogleDrive(content, filename, mimeType = 'text/plain') {
  if (!isConnected()) {
    throw new Error('Not connected to Google Drive')
  }

  // Ensure we have a valid token set
  const token = getAccessToken()
  if (!token) {
    throw new Error('No access token available')
  }

  // Make sure gapi client has the token
  if (!window.gapi.client.getToken()) {
    window.gapi.client.setToken({ access_token: token })
  }

  // Get or create the folder
  const folderId = await getOrCreateFolder()

  // Create file metadata
  const metadata = {
    name: filename,
    mimeType: mimeType,
    parents: [folderId]
  }

  // Create multipart request body
  const boundary = '-------314159265358979323846'
  const delimiter = '\r\n--' + boundary + '\r\n'
  const closeDelimiter = '\r\n--' + boundary + '--'

  const multipartBody =
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: ' + mimeType + '\r\n\r\n' +
    content +
    closeDelimiter

  // Upload file
  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/related; boundary=' + boundary
    },
    body: multipartBody
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Upload failed')
  }

  const result = await response.json()

  return {
    id: result.id,
    name: result.name,
    webViewLink: result.webViewLink || `https://drive.google.com/file/d/${result.id}/view`
  }
}

/**
 * Get mime type for file extension
 */
export function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  const mimeTypes = {
    'json': 'application/json',
    'csv': 'text/csv',
    'md': 'text/markdown',
    'txt': 'text/plain'
  }
  return mimeTypes[ext] || 'text/plain'
}

/**
 * Get user's email from Google
 */
export async function getUserEmail() {
  if (!isConnected()) return null

  try {
    const token = getAccessToken()
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!response.ok) return null
    const data = await response.json()
    return data.email
  } catch {
    return null
  }
}

/**
 * List files from Google Drive
 * @param {string} folderId - Optional folder ID to list from (null for root)
 * @param {string} pageToken - For pagination
 */
export async function listDriveFiles(folderId = null, pageToken = null) {
  if (!isConnected()) {
    throw new Error('Not connected to Google Drive')
  }

  const token = getAccessToken()
  if (!token) {
    throw new Error('No access token available')
  }

  // Build query - show files and folders, not trashed
  let query = 'trashed=false'
  if (folderId) {
    query += ` and '${folderId}' in parents`
  } else {
    query += ` and 'root' in parents`
  }

  const params = new URLSearchParams({
    q: query,
    fields: 'nextPageToken,files(id,name,mimeType,webViewLink,iconLink,thumbnailLink,modifiedTime,size)',
    orderBy: 'folder,name',
    pageSize: '50'
  })

  if (pageToken) {
    params.append('pageToken', pageToken)
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to list files')
  }

  const data = await response.json()

  // Process files to add useful info
  const files = data.files.map(file => ({
    ...file,
    isFolder: file.mimeType === 'application/vnd.google-apps.folder',
    fileType: getFileTypeFromMime(file.mimeType),
    webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`
  }))

  return {
    files,
    nextPageToken: data.nextPageToken
  }
}

/**
 * Search files in Google Drive
 */
export async function searchDriveFiles(searchTerm) {
  if (!isConnected()) {
    throw new Error('Not connected to Google Drive')
  }

  const token = getAccessToken()
  if (!token) {
    throw new Error('No access token available')
  }

  const query = `name contains '${searchTerm.replace(/'/g, "\\'")}' and trashed=false`

  const params = new URLSearchParams({
    q: query,
    fields: 'files(id,name,mimeType,webViewLink,iconLink,thumbnailLink,modifiedTime,size)',
    orderBy: 'modifiedTime desc',
    pageSize: '30'
  })

  const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to search files')
  }

  const data = await response.json()

  return data.files.map(file => ({
    ...file,
    isFolder: file.mimeType === 'application/vnd.google-apps.folder',
    fileType: getFileTypeFromMime(file.mimeType),
    webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`
  }))
}

/**
 * Get file type category from MIME type
 */
function getFileTypeFromMime(mimeType) {
  if (!mimeType) return 'file'

  if (mimeType === 'application/vnd.google-apps.folder') return 'folder'
  if (mimeType === 'application/vnd.google-apps.document') return 'doc'
  if (mimeType === 'application/vnd.google-apps.spreadsheet') return 'sheet'
  if (mimeType === 'application/vnd.google-apps.presentation') return 'slides'
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.startsWith('text/')) return 'text'

  return 'file'
}

/**
 * Get icon for file type
 */
export function getFileTypeIcon(fileType) {
  const icons = {
    folder: '📁',
    doc: '📄',
    sheet: '📊',
    slides: '📽',
    pdf: '📕',
    image: '🖼',
    video: '🎬',
    audio: '🎵',
    text: '📝',
    file: '📎'
  }
  return icons[fileType] || icons.file
}
