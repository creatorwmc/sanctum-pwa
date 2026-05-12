// Broadcast Messaging — satellite read endpoint for Practice Space.
//
// Reads broadcasts from Kairos's Firestore via a read-only SA. The local
// admin app (for verifying caller ID tokens) reuses Sanctum's existing
// three-env-var pattern (FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL +
// FIREBASE_PRIVATE_KEY) so no new local SA needs to be provisioned.
//
// Required:
//   .service-accounts/kairos-broadcasts-reader.json — read-only on kairos-f555f
//   KAIROS_ADMIN_EMAILS env var (default: zacharyrpaige@gmail.com)
//   FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY
//     — already set on Sanctum's Netlify site for existing functions

import admin from 'firebase-admin'
import { readFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const APP_ID = 'practice-space'
const SANCTUM_APP_NAME = '__sanctum_admin__'
const KAIROS_READER_APP_NAME = '__kairos_broadcasts_reader__'

const HERE = dirname(fileURLToPath(import.meta.url))

const ALLOWED_ORIGINS = [
  'https://practicespace.netlify.app',
  'http://localhost:5173',
  'http://localhost:8888',
]

function corsHeaders(origin) {
  const o = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function candidateSaDirs() {
  const dirs = [
    join(HERE, '..', '..', '.service-accounts'),
    join(process.cwd(), '.service-accounts'),
  ]
  if (process.env.LAMBDA_TASK_ROOT) {
    dirs.push(join(process.env.LAMBDA_TASK_ROOT, '.service-accounts'))
  }
  return dirs
}

function loadSaFile(filename) {
  for (const dir of candidateSaDirs()) {
    const p = join(dir, filename)
    if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf8'))
  }
  throw new Error(`Service account ${filename} not found`)
}

function getSanctumAdminApp() {
  const existing = admin.apps.find((a) => a?.name === SANCTUM_APP_NAME)
  if (existing) return existing
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    projectId: process.env.FIREBASE_PROJECT_ID,
  }, SANCTUM_APP_NAME)
}

function getKairosReaderApp() {
  const existing = admin.apps.find((a) => a?.name === KAIROS_READER_APP_NAME)
  if (existing) return existing
  const sa = loadSaFile('kairos-broadcasts-reader.json')
  return admin.initializeApp({ credential: admin.credential.cert(sa) }, KAIROS_READER_APP_NAME)
}

function isAdminEmail(email) {
  if (!email) return false
  const list = (process.env.KAIROS_ADMIN_EMAILS || 'zacharyrpaige@gmail.com')
    .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  return list.includes(email.toLowerCase())
}

async function resolveSegmentMembership({ segment, callerEmail }) {
  if (segment === 'all') return true
  if (segment === 'admins') return isAdminEmail(callerEmail)
  return false
}

export default async function handler(req) {
  const origin = req.headers.get('origin') || ''
  const cors = corsHeaders(origin)

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  const authHeader = req.headers.get('authorization') || ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!idToken) {
    return new Response(JSON.stringify({ error: 'Missing ID token' }), {
      status: 401, headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  let decoded
  try {
    const localApp = getSanctumAdminApp()
    decoded = await localApp.auth().verifyIdToken(idToken)
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401, headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  try {
    const kairos = getKairosReaderApp()
    const db = kairos.firestore()
    const now = new Date()
    const snap = await db.collection('broadcasts')
      .where('app_id', 'in', [APP_ID, '__all__'])
      .where('retracted', '==', false)
      .where('expires_at', '>', admin.firestore.Timestamp.fromDate(now))
      .get()

    const items = []
    for (const d of snap.docs) {
      const data = d.data()
      const ok = await resolveSegmentMembership({
        segment: data.segment,
        callerEmail: decoded.email,
        callerUid: decoded.uid,
      })
      if (!ok) continue
      items.push({
        id: d.id,
        app_id: data.app_id,
        segment: data.segment,
        body: data.body,
        created_at: data.created_at?.toDate?.()?.toISOString() || null,
        expires_at: data.expires_at?.toDate?.()?.toISOString() || null,
      })
    }
    items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))

    return new Response(JSON.stringify({ items }), {
      status: 200, headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('get-broadcasts failed:', err)
    return new Response(JSON.stringify({ error: err.message || 'Read failed' }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
}

export const config = {
  path: '/.netlify/functions/get-broadcasts',
}
