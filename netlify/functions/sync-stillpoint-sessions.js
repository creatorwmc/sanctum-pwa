// Reads Stillpoint sessions tagged source_app='practice_space' for the
// authenticated PS user, joining by user_email since Firebase Auth UIDs are
// per-project (PS UID ≠ Stillpoint UID for the same Google account).
//
// Required env vars:
//   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
//     — PS's own admin SDK creds (used to verify the caller's ID token)
//   FIREBASE_STILLPOINT_SA_JSON
//     — Stillpoint's service account JSON (full JSON as a single env var string)

import admin from 'firebase-admin'

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
const DEFAULT_ORIGIN = 'https://practicespace.netlify.app'

function corsHeaders(event) {
  const origin = event.headers?.origin || event.headers?.Origin || ''
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : DEFAULT_ORIGIN
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

// PS auth admin app — used to verify the caller's ID token
function getPSAdmin() {
  const existing = admin.apps.find((a) => a?.name === '[DEFAULT]')
  if (existing) return existing
  return admin.initializeApp(
    {
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    },
    '[DEFAULT]',
  )
}

// Stillpoint admin app — used to read Stillpoint Firestore
function getStillpointAdmin() {
  const existing = admin.apps.find((a) => a?.name === 'stillpoint')
  if (existing) return existing
  const raw = process.env.FIREBASE_STILLPOINT_SA_JSON
  if (!raw) throw new Error('FIREBASE_STILLPOINT_SA_JSON env var not set')
  const sa = typeof raw === 'string' ? JSON.parse(raw) : raw
  return admin.initializeApp(
    {
      credential: admin.credential.cert({
        projectId: sa.project_id,
        clientEmail: sa.client_email,
        privateKey: sa.private_key,
      }),
      projectId: sa.project_id,
    },
    'stillpoint',
  )
}

export const handler = async (event) => {
  const cors = corsHeaders(event)

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  // 1. Verify ID token from PS
  const authHeader = event.headers?.authorization || event.headers?.Authorization || ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!idToken) {
    return {
      statusCode: 401,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing ID token' }),
    }
  }

  let email
  try {
    getPSAdmin()
    const decoded = await admin.auth().verifyIdToken(idToken)
    email = decoded.email
    if (!email) {
      return {
        statusCode: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No email on token' }),
      }
    }
  } catch (err) {
    console.error('Token verify failed:', err)
    return {
      statusCode: 401,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid token' }),
    }
  }

  // 2. Query Stillpoint sessions for this user, sourced from PS
  try {
    const sp = getStillpointAdmin()
    const sinceParam = event.queryStringParameters?.since
    let q = sp
      .firestore()
      .collection('sessions')
      .where('user_email', '==', email)
      .where('source_app', '==', 'practice_space')
      .limit(200)
    if (sinceParam) q = q.where('started_at', '>', sinceParam)
    const snap = await q.get()
    const sessions = snap.docs.map((d) => d.data())
    sessions.sort((a, b) => (b.started_at || '').localeCompare(a.started_at || ''))
    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessions }),
    }
  } catch (err) {
    console.error('Stillpoint read failed:', err)
    return {
      statusCode: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Stillpoint read failed' }),
    }
  }
}
