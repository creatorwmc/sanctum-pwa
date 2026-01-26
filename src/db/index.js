import { openDB } from 'idb'
import { getLocalDateString, getYesterdayDateString, getLocalMonthString } from '../utils/dateUtils'

const DB_NAME = 'sanctum-db'
const DB_VERSION = 5

// Database schema definition
const stores = {
  sessions: 'id, date, type, duration',
  documents: 'id, title, tradition, createdAt',
  links: 'id, title, url, *tags, createdAt',
  dailyLogs: 'id, date, *practices',
  ceremonies: 'id, date, type, title',
  journal: 'id, date, type, createdAt',
  feedback: 'id, category, createdAt',
  milestones: 'id, date, title, annual, createdAt',
  practiceStats: 'id'
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

      // Milestones store (annual personal milestones)
      if (!db.objectStoreNames.contains('milestones')) {
        const milestoneStore = db.createObjectStore('milestones', { keyPath: 'id' })
        milestoneStore.createIndex('date', 'date')
        milestoneStore.createIndex('annual', 'annual')
        milestoneStore.createIndex('createdAt', 'createdAt')
      }

      // Practice stats store (streak tracking, bonus points, stored practices)
      if (!db.objectStoreNames.contains('practiceStats')) {
        db.createObjectStore('practiceStats', { keyPath: 'id' })
      }

      // Resources store (Google Drive files and manual links)
      if (!db.objectStoreNames.contains('resources')) {
        const resourceStore = db.createObjectStore('resources', { keyPath: 'id' })
        resourceStore.createIndex('category', 'category')
        resourceStore.createIndex('sourceType', 'sourceType') // 'drive' or 'manual'
        resourceStore.createIndex('tags', 'tags', { multiEntry: true })
        resourceStore.createIndex('createdAt', 'createdAt')
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
    const today = getLocalDateString()
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

  // Get practice streak (with stored practice support)
  async getPracticeStreak() {
    const database = await getDB()
    const logs = await database.getAll('dailyLogs')
    const stats = await this.getPracticeStats()

    // Get all dates with practices (including stored practice uses)
    const practiceDates = new Set(logs.filter(l => l.practices?.length > 0).map(l => l.date))

    // Add dates where stored practices were used
    if (stats.storedPracticeUses) {
      stats.storedPracticeUses.forEach(date => practiceDates.add(date))
    }

    if (practiceDates.size === 0) return 0

    const sortedDates = Array.from(practiceDates).sort((a, b) => new Date(b) - new Date(a))

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
  },

  // Get practice stats (bonus points, stored practices, etc.)
  async getPracticeStats() {
    const database = await getDB()
    let stats = await database.get('practiceStats', 'user-stats')

    if (!stats) {
      stats = {
        id: 'user-stats',
        longestStreak: 0,
        bonusPoints: 0,
        storedPractices: 1, // Start with 1
        lastStoredPracticeRefresh: getLocalMonthString(), // YYYY-MM (local timezone)
        storedPracticeUses: [], // dates where stored practices were used
        lastCheckedDate: getLocalDateString() // Track last date app was used
      }
      await database.put('practiceStats', stats)
    }

    // Check if we need to refresh stored practice (monthly)
    const currentMonth = getLocalMonthString()
    if (stats.lastStoredPracticeRefresh !== currentMonth) {
      stats.storedPractices = Math.min(stats.storedPractices + 1, 3) // Max 3 stored
      stats.lastStoredPracticeRefresh = currentMonth
      await database.put('practiceStats', stats)
    }

    return stats
  },

  // Update practice stats
  async updatePracticeStats(updates) {
    const database = await getDB()
    const stats = await this.getPracticeStats()
    const updatedStats = { ...stats, ...updates }
    await database.put('practiceStats', updatedStats)
    return updatedStats
  },

  // Calculate bonus points for a day
  calculateBonusPoints(practiceCount) {
    if (practiceCount < 2) return 0
    // 2 practices = 1 point, 4 = 2, 6 = 3, 8 = 4, 10 = 5
    return Math.min(Math.floor(practiceCount / 2), 5)
  },

  // Use a stored practice for a specific date
  async useStoredPractice(dateString = null) {
    const stats = await this.getPracticeStats()
    if (stats.storedPractices <= 0) return false

    const targetDate = dateString || getLocalDateString()
    const uses = stats.storedPracticeUses || []

    if (uses.includes(targetDate)) return false // Already used for this date

    await this.updatePracticeStats({
      storedPractices: stats.storedPractices - 1,
      storedPracticeUses: [...uses, targetDate]
    })
    return true
  },

  // Check for missed days and auto-use stored practices
  // Called on app load to maintain streak
  async checkAndAutoUseStoredPractice() {
    const stats = await this.getPracticeStats()
    const today = getLocalDateString()
    const yesterday = getYesterdayDateString()

    // If we already checked today, skip
    if (stats.lastCheckedDate === today) {
      return { autoUsed: false, date: null }
    }

    // Update the last checked date
    await this.updatePracticeStats({ lastCheckedDate: today })

    // Check if yesterday had any practices
    const database = await getDB()
    const yesterdayLogs = await database.getAllFromIndex('dailyLogs', 'date', yesterday)
    const yesterdayLog = yesterdayLogs[0]
    const yesterdayHadPractices = yesterdayLog?.practices?.length > 0

    // Check if stored practice was already used yesterday
    const storedUsedYesterday = stats.storedPracticeUses?.includes(yesterday)

    // If yesterday was missed and we have stored practices, auto-use one
    if (!yesterdayHadPractices && !storedUsedYesterday && stats.storedPractices > 0) {
      const success = await this.useStoredPractice(yesterday)
      if (success) {
        return { autoUsed: true, date: yesterday }
      }
    }

    return { autoUsed: false, date: null }
  },

  // Convert bonus points to stored practice
  async convertBonusToStored() {
    const stats = await this.getPracticeStats()
    if (stats.bonusPoints < 10) return false

    await this.updatePracticeStats({
      bonusPoints: stats.bonusPoints - 10,
      storedPractices: stats.storedPractices + 1
    })
    return true
  }
}

export default db
