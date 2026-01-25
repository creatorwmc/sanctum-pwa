import { openDB } from 'idb'

const DB_NAME = 'sanctum-db'
const DB_VERSION = 2

// Database schema definition
const stores = {
  sessions: 'id, date, type, duration',
  documents: 'id, title, tradition, createdAt',
  links: 'id, title, url, *tags, createdAt',
  dailyLogs: 'id, date, *practices',
  ceremonies: 'id, date, type, title',
  journal: 'id, date, type, createdAt',
  feedback: 'id, category, createdAt'
}

// Initialize the database
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Sessions store (meditation/practice sessions)
      if (!db.objectStoreNames.contains('sessions')) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' })
        sessionStore.createIndex('date', 'date')
        sessionStore.createIndex('type', 'type')
      }

      // Documents store (document library)
      if (!db.objectStoreNames.contains('documents')) {
        const docStore = db.createObjectStore('documents', { keyPath: 'id' })
        docStore.createIndex('tradition', 'tradition')
        docStore.createIndex('createdAt', 'createdAt')
      }

      // Links store (research links)
      if (!db.objectStoreNames.contains('links')) {
        const linkStore = db.createObjectStore('links', { keyPath: 'id' })
        linkStore.createIndex('tags', 'tags', { multiEntry: true })
        linkStore.createIndex('createdAt', 'createdAt')
      }

      // Daily logs store
      if (!db.objectStoreNames.contains('dailyLogs')) {
        const logStore = db.createObjectStore('dailyLogs', { keyPath: 'id' })
        logStore.createIndex('date', 'date', { unique: true })
      }

      // Ceremonies store (calendar events)
      if (!db.objectStoreNames.contains('ceremonies')) {
        const ceremonyStore = db.createObjectStore('ceremonies', { keyPath: 'id' })
        ceremonyStore.createIndex('date', 'date')
        ceremonyStore.createIndex('type', 'type')
      }

      // Journal store (integration journal)
      if (!db.objectStoreNames.contains('journal')) {
        const journalStore = db.createObjectStore('journal', { keyPath: 'id' })
        journalStore.createIndex('date', 'date')
        journalStore.createIndex('type', 'type')
        journalStore.createIndex('createdAt', 'createdAt')
      }

      // Feedback store (whispers to the oracle)
      if (!db.objectStoreNames.contains('feedback')) {
        const feedbackStore = db.createObjectStore('feedback', { keyPath: 'id' })
        feedbackStore.createIndex('category', 'category')
        feedbackStore.createIndex('createdAt', 'createdAt')
      }
    }
  })
}

// Database singleton
let dbInstance = null

async function getDB() {
  if (!dbInstance) {
    dbInstance = await initDB()
  }
  return dbInstance
}

// Generate unique ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Generic CRUD operations
export const db = {
  // Create
  async add(storeName, data) {
    const database = await getDB()
    const item = {
      ...data,
      id: data.id || generateId(),
      createdAt: data.createdAt || new Date().toISOString()
    }
    await database.add(storeName, item)
    return item
  },

  // Read one
  async get(storeName, id) {
    const database = await getDB()
    return database.get(storeName, id)
  },

  // Read all
  async getAll(storeName) {
    const database = await getDB()
    return database.getAll(storeName)
  },

  // Read by index
  async getByIndex(storeName, indexName, value) {
    const database = await getDB()
    return database.getAllFromIndex(storeName, indexName, value)
  },

  // Update
  async update(storeName, data) {
    const database = await getDB()
    const item = {
      ...data,
      updatedAt: new Date().toISOString()
    }
    await database.put(storeName, item)
    return item
  },

  // Delete
  async delete(storeName, id) {
    const database = await getDB()
    await database.delete(storeName, id)
  },

  // Clear store
  async clear(storeName) {
    const database = await getDB()
    await database.clear(storeName)
  },

  // Count
  async count(storeName) {
    const database = await getDB()
    return database.count(storeName)
  }
}

// Specialized queries
export const queries = {
  // Get today's daily log
  async getTodayLog() {
    const today = new Date().toISOString().split('T')[0]
    const logs = await db.getByIndex('dailyLogs', 'date', today)
    return logs[0] || null
  },

  // Get sessions for date range
  async getSessionsInRange(startDate, endDate) {
    const database = await getDB()
    const sessions = await database.getAll('sessions')
    return sessions.filter(s => s.date >= startDate && s.date <= endDate)
  },

  // Get documents by tradition
  async getDocumentsByTradition(tradition) {
    return db.getByIndex('documents', 'tradition', tradition)
  },

  // Get links by tag
  async getLinksByTag(tag) {
    return db.getByIndex('links', 'tags', tag)
  },

  // Get ceremonies for month
  async getCeremoniesForMonth(year, month) {
    const database = await getDB()
    const ceremonies = await database.getAll('ceremonies')
    return ceremonies.filter(c => {
      const date = new Date(c.date)
      return date.getFullYear() === year && date.getMonth() === month
    })
  },

  // Get recent journal entries
  async getRecentJournalEntries(limit = 10) {
    const database = await getDB()
    const entries = await database.getAll('journal')
    return entries
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  },

  // Get practice streak
  async getPracticeStreak() {
    const database = await getDB()
    const logs = await database.getAll('dailyLogs')

    if (logs.length === 0) return 0

    const sortedDates = logs
      .map(l => l.date)
      .sort((a, b) => new Date(b) - new Date(a))

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const dateStr of sortedDates) {
      const logDate = new Date(dateStr)
      logDate.setHours(0, 0, 0, 0)

      const diffDays = Math.round((currentDate - logDate) / (1000 * 60 * 60 * 24))

      if (diffDays === streak || diffDays === streak + 1) {
        streak++
        currentDate = logDate
      } else {
        break
      }
    }

    return streak
  }
}

export default db
