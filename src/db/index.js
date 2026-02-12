import { openDB } from 'idb'
import { getLocalDateString, getYesterdayDateString, getLocalMonthString } from '../utils/dateUtils'
import { DEFAULT_PRACTICES } from '../data/defaultPractices'

const DB_NAME = 'sanctum-db'
const DB_VERSION = 7

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

      // Practices store (user's customized practice list)
      if (!db.objectStoreNames.contains('practices')) {
        const practiceStore = db.createObjectStore('practices', { keyPath: 'id' })
        practiceStore.createIndex('order', 'order')
        practiceStore.createIndex('enabled', 'enabled')
      }

      // Meter readings store (MMR Test)
      if (!db.objectStoreNames.contains('meterReadings')) {
        const meterStore = db.createObjectStore('meterReadings', { keyPath: 'id' })
        meterStore.createIndex('meterId', 'meterId')
        meterStore.createIndex('timestamp', 'timestamp')
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

// Lazy-load sync functions to avoid circular dependencies
let syncModule = null
async function getSyncModule() {
  if (!syncModule) {
    syncModule = await import('../services/syncService')
  }
  return syncModule
}

// Queue a change for auto-sync (non-blocking)
function triggerSync(storeName, itemId) {
  getSyncModule().then(sync => {
    sync.queueSync(storeName, itemId)
  }).catch(() => {
    // Sync not available, ignore
  })
}

// Queue a deletion for auto-sync (non-blocking)
function triggerDelete(storeName, itemId) {
  getSyncModule().then(sync => {
    sync.queueDelete(storeName, itemId)
  }).catch(() => {
    // Sync not available, ignore
  })
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
    triggerSync(storeName, item.id)
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
    triggerSync(storeName, item.id)
    return item
  },

  // Delete
  async delete(storeName, id) {
    const database = await getDB()
    await database.delete(storeName, id)
    triggerDelete(storeName, id)
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

    // Sort dates descending (most recent first)
    const sortedDates = Array.from(practiceDates).sort((a, b) => b.localeCompare(a))

    // Helper to parse YYYY-MM-DD as local date (not UTC)
    function parseLocalDate(dateStr) {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day)
    }

    // Get today's date at local midnight
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if most recent log is today or yesterday
    const mostRecentDate = parseLocalDate(sortedDates[0])
    const daysSinceMostRecent = Math.round((today - mostRecentDate) / (1000 * 60 * 60 * 24))

    // If most recent log is more than 1 day ago, streak is broken
    if (daysSinceMostRecent > 1) return 0

    // Count consecutive days
    let streak = 1
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = parseLocalDate(sortedDates[i - 1])
      const previousDate = parseLocalDate(sortedDates[i])
      const daysBetween = Math.round((currentDate - previousDate) / (1000 * 60 * 60 * 24))

      if (daysBetween === 1) {
        streak++
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
    let needsSave = false

    if (!stats) {
      stats = {
        id: 'user-stats',
        longestStreak: 0,
        bonusPoints: 0,
        storedPractices: 1, // Start with 1
        lastStoredPracticeRefresh: getLocalMonthString(), // YYYY-MM (local timezone)
        storedPracticeUses: [], // dates where stored practices were used
        lastCheckedDate: getLocalDateString(), // Track last date app was used
        updatedAt: new Date().toISOString()
      }
      needsSave = true
    }

    // Migrate: ensure updatedAt exists for older stats
    if (!stats.updatedAt) {
      stats.updatedAt = new Date().toISOString()
      needsSave = true
    }

    // Check if we need to refresh stored practice (monthly)
    const currentMonth = getLocalMonthString()
    if (stats.lastStoredPracticeRefresh !== currentMonth) {
      stats.storedPractices = Math.min(stats.storedPractices + 1, 3) // Max 3 stored
      stats.lastStoredPracticeRefresh = currentMonth
      stats.updatedAt = new Date().toISOString()
      needsSave = true
    }

    if (needsSave) {
      await database.put('practiceStats', stats)
      triggerSync('practiceStats', stats.id)
    }

    return stats
  },

  // Update practice stats
  async updatePracticeStats(updates) {
    const database = await getDB()
    const stats = await this.getPracticeStats()
    const updatedStats = {
      ...stats,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await database.put('practiceStats', updatedStats)
    triggerSync('practiceStats', updatedStats.id)
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
  },

  // Get practice history for a time period (days back from today)
  async getPracticeHistory(daysBack) {
    const database = await getDB()
    const logs = await database.getAll('dailyLogs')

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - daysBack)

    // Filter logs within the date range
    const filteredLogs = logs.filter(log => {
      const logDate = new Date(log.date)
      return logDate >= startDate && logDate <= today
    })

    // Count practices by ID
    const practiceCounts = {}
    let totalDaysWithPractice = 0

    filteredLogs.forEach(log => {
      if (log.practices && log.practices.length > 0) {
        totalDaysWithPractice++
        log.practices.forEach(practiceId => {
          practiceCounts[practiceId] = (practiceCounts[practiceId] || 0) + 1
        })
      }
    })

    return {
      daysBack,
      totalDays: daysBack,
      daysWithPractice: totalDaysWithPractice,
      practiceCounts,
      logs: filteredLogs
    }
  },

  // Get all practice logs for calendar display (returns map of date -> practices)
  async getPracticeLogsForMonth(year, month) {
    const database = await getDB()
    const logs = await database.getAll('dailyLogs')

    // Filter to the specified month
    return logs.filter(log => {
      const [logYear, logMonth] = log.date.split('-').map(Number)
      return logYear === year && logMonth === month + 1 // month is 0-indexed in JS
    })
  },

  // Get practice completion stats for each practice type
  async getPracticeCompletionStats(periods = [7, 30, 60, 180, 360]) {
    const stats = {}

    for (const days of periods) {
      stats[days] = await this.getPracticeHistory(days)
    }

    return stats
  },

  // Get all practices (merges defaults with user customizations)
  async getPractices() {
    const database = await getDB()
    const userPractices = await database.getAll('practices')

    // If user has no customizations, initialize from defaults
    if (userPractices.length === 0) {
      // Return defaults with enabled flag
      return DEFAULT_PRACTICES.map(p => ({ ...p, enabled: true }))
    }

    // Return user's customized list, sorted by order
    return userPractices.sort((a, b) => (a.order || 0) - (b.order || 0))
  },

  // Get only enabled practices
  async getEnabledPractices() {
    const practices = await this.getPractices()
    return practices.filter(p => p.enabled !== false)
  },

  // Initialize practices from defaults or custom list (called when user first customizes or selects a tradition)
  async initializePractices(customPractices = null) {
    const database = await getDB()
    const existing = await database.getAll('practices')

    // If no custom practices provided and we have existing ones, return them
    if (!customPractices && existing.length > 0) return existing

    // Use custom practices if provided, otherwise use defaults
    const practicesToLoad = customPractices || DEFAULT_PRACTICES

    // Copy practices to user's practice store
    for (let i = 0; i < practicesToLoad.length; i++) {
      const practice = practicesToLoad[i]
      const practiceData = {
        ...practice,
        enabled: true,
        isDefault: !customPractices, // Mark as default only if using DEFAULT_PRACTICES
        order: practice.order ?? i
      }
      await database.put('practices', practiceData)
      triggerSync('practices', practiceData.id)
    }

    return database.getAll('practices')
  },

  // Add a new practice
  async addPractice(practice) {
    await this.initializePractices() // Ensure practices are initialized

    const database = await getDB()
    const allPractices = await database.getAll('practices')
    const maxOrder = Math.max(...allPractices.map(p => p.order || 0), -1)

    const newPractice = {
      id: `custom-${Date.now()}`,
      ...practice,
      isDefault: false,
      enabled: true,
      order: maxOrder + 1,
      createdAt: new Date().toISOString()
    }

    await database.put('practices', newPractice)
    triggerSync('practices', newPractice.id)
    return newPractice
  },

  // Update a practice
  async updatePractice(id, updates) {
    await this.initializePractices() // Ensure practices are initialized

    const database = await getDB()
    const practice = await database.get('practices', id)

    if (!practice) return null

    const updatedPractice = {
      ...practice,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await database.put('practices', updatedPractice)
    triggerSync('practices', updatedPractice.id)
    return updatedPractice
  },

  // Toggle practice enabled/disabled
  async togglePractice(id) {
    await this.initializePractices() // Ensure practices are initialized

    const database = await getDB()
    const practice = await database.get('practices', id)

    if (!practice) return null

    const updatedPractice = {
      ...practice,
      enabled: !practice.enabled,
      updatedAt: new Date().toISOString()
    }

    await database.put('practices', updatedPractice)
    triggerSync('practices', updatedPractice.id)
    return updatedPractice
  },

  // Delete a practice (only custom ones can be fully deleted)
  async deletePractice(id) {
    await this.initializePractices() // Ensure practices are initialized

    const database = await getDB()
    const practice = await database.get('practices', id)

    if (!practice) return false

    // If it's a default practice, just disable it instead
    if (practice.isDefault) {
      await this.togglePractice(id)
      return true
    }

    // Delete custom practice
    await database.delete('practices', id)
    triggerDelete('practices', id)
    return true
  },

  // Reorder practices
  async reorderPractices(orderedIds) {
    await this.initializePractices() // Ensure practices are initialized

    const database = await getDB()

    for (let i = 0; i < orderedIds.length; i++) {
      const practice = await database.get('practices', orderedIds[i])
      if (practice) {
        await database.put('practices', { ...practice, order: i })
        triggerSync('practices', practice.id)
      }
    }

    return this.getPractices()
  },

  // Reset practices to defaults or load tradition-specific practices
  async resetPractices(customPractices = null) {
    const database = await getDB()

    // Get existing practice IDs to delete from cloud
    const existingPractices = await database.getAll('practices')

    // Clear local practices
    await database.clear('practices')

    // Delete each practice from cloud sync
    for (const practice of existingPractices) {
      triggerDelete('practices', practice.id)
    }

    // Initialize with new practices (which will sync)
    return this.initializePractices(customPractices)
  },

  // Auto-log a practice to today's daily log (used by Timer and Journal)
  async autoLogPractice(practiceId, notes = '') {
    const database = await getDB()
    const today = getLocalDateString()
    const timestamp = new Date().toISOString()

    // Get or create today's log
    let todayLog = await this.getTodayLog()

    const newEntry = {
      id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      practiceId,
      timestamp,
      notes: notes.trim(),
      autoLogged: true
    }

    if (todayLog) {
      // Add to existing log
      const existingEntries = todayLog.entries || []
      const allEntries = [...existingEntries, newEntry]

      const logData = {
        ...todayLog,
        entries: allEntries,
        practices: [...new Set(allEntries.map(e => e.practiceId))],
        updatedAt: timestamp
      }

      await database.put('dailyLogs', logData)
      triggerSync('dailyLogs', logData.id)
    } else {
      // Create new log
      const logData = {
        id: `log-${today}-${Date.now()}`,
        date: today,
        entries: [newEntry],
        practices: [practiceId],
        createdAt: timestamp,
        updatedAt: timestamp
      }

      await database.put('dailyLogs', logData)
      triggerSync('dailyLogs', logData.id)
    }

    // Update bonus points if needed
    const updatedLog = await this.getTodayLog()
    const uniquePractices = [...new Set(updatedLog.entries.map(e => e.practiceId))]
    const bonusPoints = uniquePractices.length >= 2 ? Math.min(Math.floor(uniquePractices.length / 2), 5) : 0

    // Get current stats and update if bonus changed
    const stats = await this.getPracticeStats()
    const previousUnique = todayLog ? [...new Set((todayLog.entries || []).map(e => e.practiceId))].length : 0
    const previousBonus = previousUnique >= 2 ? Math.min(Math.floor(previousUnique / 2), 5) : 0

    if (bonusPoints > previousBonus) {
      await this.updatePracticeStats({
        bonusPoints: stats.bonusPoints + (bonusPoints - previousBonus)
      })
    }

    return newEntry
  }
}

export default db
