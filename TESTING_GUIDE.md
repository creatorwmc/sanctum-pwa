# Practice Space - Testing & Debugging Guide
*100-Tester Panel Recommendations - Implementation Checklist*

## 🚨 CRITICAL ISSUES (Must Fix Before Wider Release)

### ✅ Issue #1: Add 3 Tradition Presets (Christian, Islamic, Buddhist)

**Current State:**
- Only Druidry has full preset (`src/data/traditions/druid.js`)
- Christianity (16 subgroups), Islam (8 subgroups), Buddhism (9 subgroups) have NO presets
- Default practices lean Western esoteric: Tarot, Ritual Bath, Ceremonial Work

**Files to Create/Modify:**
```
src/data/traditions/christian.js        (NEW - copy druid.js structure)
src/data/traditions/islamic.js          (NEW - copy druid.js structure)
src/data/traditions/buddhist.js         (NEW - copy druid.js structure)
src/data/traditions/index.js            (MODIFY - import new presets)
```

**Christian Contemplative Preset Structure:**
```javascript
export const christianPreset = {
  practices: [
    {
      name: "Morning Prayer (Lauds)",
      icon: "🌅",
      type: "prayer",
      frequency: "daily",
      duration: "10-20 min",
      description: "Traditional morning office or personal prayer",
      examples: ["Lauds", "Morning devotional", "Scripture + prayer"]
    },
    {
      name: "Evening Prayer (Vespers)",
      icon: "🌆",
      type: "prayer",
      frequency: "daily",
      duration: "10-20 min"
    },
    {
      name: "Lectio Divina",
      icon: "📖",
      type: "study",
      frequency: "daily",
      duration: "15-30 min",
      description: "Contemplative reading of Scripture"
    },
    {
      name: "Centering Prayer",
      icon: "🧘",
      type: "meditation",
      frequency: "daily",
      duration: "20 min",
      description: "Contemplative silent prayer"
    },
    {
      name: "The Examen",
      icon: "🔍",
      type: "reflection",
      frequency: "daily",
      duration: "10-15 min",
      description: "Ignatian prayer of examination"
    },
    {
      name: "Rosary / Prayer Beads",
      icon: "📿",
      type: "prayer",
      frequency: "optional",
      duration: "15-30 min"
    },
    {
      name: "Scripture Study",
      icon: "✝",
      type: "study",
      frequency: "daily",
      duration: "15-30 min"
    },
    {
      name: "Fasting",
      icon: "🕊",
      type: "discipline",
      frequency: "weekly",
      description: "Voluntary abstinence (food, media, etc.)"
    },
    {
      name: "Service / Charity",
      icon: "🤝",
      type: "service",
      frequency: "weekly",
      description: "Acts of mercy and service"
    },
    {
      name: "Liturgy / Worship",
      icon: "⛪",
      type: "communal",
      frequency: "weekly",
      description: "Sunday service or Mass attendance"
    }
  ],

  journalPrompts: [
    "How did I experience God's presence today?",
    "What Scripture passage spoke to me?",
    "How did I love my neighbor today?",
    "What am I grateful for in my walk with Christ?",
    "Where did I struggle with sin or temptation?",
    "How am I growing in faith, hope, and love?",
    "What is God inviting me to surrender?",
    // ... 43 more prompts
  ],

  libraryCategories: [
    "Scripture & Study Bibles",
    "Desert Fathers & Mothers",
    "Contemplative Classics (Merton, Teresa, John of the Cross)",
    "Liturgy & Prayer Books",
    "Theology & Doctrine",
    "Spiritual Formation",
    "Daily Devotionals"
  ]
}
```

**Islamic Preset Structure:**
```javascript
export const islamicPreset = {
  practices: [
    {
      name: "Fajr (Dawn Prayer)",
      icon: "🌅",
      type: "salah",
      frequency: "daily",
      isObligatory: true,
      rakats: 2
    },
    {
      name: "Dhuhr (Midday Prayer)",
      icon: "☀",
      type: "salah",
      frequency: "daily",
      isObligatory: true,
      rakats: 4
    },
    {
      name: "Asr (Afternoon Prayer)",
      icon: "🌤",
      type: "salah",
      frequency: "daily",
      isObligatory: true,
      rakats: 4
    },
    {
      name: "Maghrib (Sunset Prayer)",
      icon: "🌆",
      type: "salah",
      frequency: "daily",
      isObligatory: true,
      rakats: 3
    },
    {
      name: "Isha (Night Prayer)",
      icon: "🌙",
      type: "salah",
      frequency: "daily",
      isObligatory: true,
      rakats: 4
    },
    {
      name: "Quran Recitation",
      icon: "📖",
      type: "recitation",
      frequency: "daily",
      duration: "15-30 min"
    },
    {
      name: "Dhikr (Remembrance)",
      icon: "📿",
      type: "meditation",
      frequency: "daily",
      description: "Remembrance of Allah"
    },
    {
      name: "Dua (Supplication)",
      icon: "🤲",
      type: "prayer",
      frequency: "daily"
    },
    {
      name: "Islamic Studies",
      icon: "📚",
      type: "study",
      frequency: "daily"
    },
    {
      name: "Sadaqah (Charity)",
      icon: "💝",
      type: "service",
      frequency: "optional"
    },
    {
      name: "Fasting (Sawm)",
      icon: "🌙",
      type: "discipline",
      frequency: "ramadan",
      description: "Obligatory (Ramadan) or voluntary"
    }
  ],

  journalPrompts: [
    "How did my Salah deepen my connection with Allah today?",
    "What ayah from the Quran spoke to my heart?",
    "How did I practice patience (Sabr) today?",
    "In what ways did I strive (Jihad) against my nafs?",
    "How did I show mercy and compassion?",
    "What am I grateful to Allah for today?",
    // ... 44 more prompts
  ],

  prayerTimes: true, // Enable prayer time calculation
  prayerCalculationMethod: "MWL", // Muslim World League (user-selectable)

  libraryCategories: [
    "Quran & Tafsir",
    "Hadith Collections",
    "Fiqh (Islamic Jurisprudence)",
    "Seerah (Life of the Prophet)",
    "Tasawwuf (Sufism)",
    "Contemporary Islamic Thought",
    "Daily Wisdom & Reflection"
  ]
}
```

**Buddhist Preset Structure:**
```javascript
export const buddhistPreset = {
  practices: [
    {
      name: "Sitting Meditation (Shamatha)",
      icon: "🧘",
      type: "meditation",
      frequency: "daily",
      duration: "20-40 min"
    },
    {
      name: "Walking Meditation",
      icon: "🚶",
      type: "meditation",
      frequency: "daily",
      duration: "10-20 min"
    },
    {
      name: "Metta (Loving-Kindness)",
      icon: "💗",
      type: "meditation",
      frequency: "daily",
      duration: "15-30 min"
    },
    {
      name: "Vipassana (Insight)",
      icon: "👁",
      type: "meditation",
      frequency: "daily",
      duration: "30-60 min"
    },
    {
      name: "Sutra Study",
      icon: "📖",
      type: "study",
      frequency: "daily",
      duration: "15-30 min"
    },
    {
      name: "Chanting / Mantra",
      icon: "🔉",
      type: "practice",
      frequency: "optional"
    },
    {
      name: "Precepts Reflection",
      icon: "🛡",
      type: "reflection",
      frequency: "daily",
      description: "Reflecting on the Five Precepts"
    },
    {
      name: "Dana (Generosity)",
      icon: "🎁",
      type: "service",
      frequency: "optional"
    },
    {
      name: "Mindful Eating",
      icon: "🍵",
      type: "practice",
      frequency: "daily"
    },
    {
      name: "Sangha Practice",
      icon: "👥",
      type: "communal",
      frequency: "weekly",
      description: "Group meditation or Dharma talk"
    }
  ],

  journalPrompts: [
    "What did I notice about impermanence (anicca) today?",
    "How did I experience dukkha (unsatisfactoriness)?",
    "Where did I observe the arising of craving (tanha)?",
    "How did I practice Right Speech today?",
    "What did I let go of?",
    "How did I respond to the Five Hindrances?",
    "What insights arose during meditation?",
    // ... 43 more prompts
  ],

  libraryCategories: [
    "Suttas & Sutras",
    "Buddhist Philosophy",
    "Meditation Instructions",
    "Dharma Talks",
    "Commentaries & Abhidhamma",
    "Contemporary Teachers",
    "Tradition-Specific (Zen, Tibetan, Theravada)"
  ]
}
```

**Testing Protocol:**
```bash
# 1. Create the three preset files
# 2. Import them in src/data/traditions/index.js
# 3. Test tradition selection in Settings > Tradition Settings

# Test Cases:
- [ ] Select "Christianity" → See 10 Christian practices appear
- [ ] Select "Islam" → See 11 Islamic practices (5 Salah + 6 others)
- [ ] Select "Buddhism" → See 10 Buddhist practices
- [ ] Journal prompts update to tradition-specific questions
- [ ] Library categories reflect tradition
- [ ] Can switch between traditions without data loss
```

**Acceptance Criteria:**
- [ ] Christian users see Lectio Divina, Examen, Liturgy
- [ ] Muslim users see 5 daily Salah prominently
- [ ] Buddhist users see meditation types, not "ritual work"
- [ ] No "Tarot/Divination" in Christian/Islamic/Buddhist presets
- [ ] Each preset has 50+ journal prompts
- [ ] Each preset has 7+ library categories

---

### ✅ Issue #2: Make Streaks Opt-In

**Current State:**
- Streak counter displays by default on Dashboard and Daily Log
- Shows "Current streak: 0 days" on first use (demoralizing)
- Bonus points and stored practices gamify spirituality

**Files to Modify:**
```
src/pages/DailyLog.jsx                  (Add opt-in modal on first use)
src/pages/Dashboard.jsx                 (Conditionally show streak)
src/contexts/SettingsContext.jsx        (NEW - add streaksEnabled setting)
src/pages/Settings.jsx                  (Add toggle in Settings)
```

**Implementation:**

```javascript
// src/contexts/SettingsContext.jsx (NEW FILE)
import React, { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sanctum-user-settings')
    return saved ? JSON.parse(saved) : {
      streaksEnabled: null, // null = not yet asked, true/false = user choice
      showBonusPoints: null,
      theme: 'dark-gray'
    }
  })

  useEffect(() => {
    localStorage.setItem('sanctum-user-settings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
```

```javascript
// src/components/StreakOptInModal.jsx (NEW FILE)
import React from 'react'
import './Modal.css'

export default function StreakOptInModal({ onClose, onChoose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Track your consistency?</h2>
        <p>
          Some practitioners find streak tracking motivating.<br />
          Others find it creates unhelpful pressure.
        </p>

        <div className="streak-opt-in-options">
          <button
            className="btn-primary"
            onClick={() => onChoose(true)}
          >
            ✓ Yes, show my streak
            <small>Current: 3 days 🔥</small>
          </button>

          <button
            className="btn-secondary"
            onClick={() => onChoose(false)}
          >
            ○ No, just show completion
            <small>Today: ✓ or ○</small>
          </button>
        </div>

        <button className="btn-link" onClick={() => onChoose(null)}>
          Ask me later
        </button>

        <p className="fine-print">
          You can change this anytime in Settings.
        </p>
      </div>
    </div>
  )
}
```

```javascript
// src/pages/DailyLog.jsx (MODIFY)
// Add modal trigger on first use
import { useSettings } from '../contexts/SettingsContext'
import StreakOptInModal from '../components/StreakOptInModal'

// Inside component:
const { settings, updateSetting } = useSettings()
const [showStreakModal, setShowStreakModal] = useState(false)

useEffect(() => {
  // Show modal on first log entry if not yet answered
  if (settings.streaksEnabled === null && allDailyLogs.length === 0) {
    setShowStreakModal(true)
  }
}, [])

// Conditionally render streak
{settings.streaksEnabled && (
  <div className="streak-display">
    <div className="streak-stat">
      Current: {currentStreak} days 🔥
    </div>
    <div className="streak-stat">
      Best: {bestStreak} days
    </div>
  </div>
)}

{settings.streaksEnabled === false && (
  <div className="completion-display">
    Today: {completedToday ? '✓' : '○'}
  </div>
)}
```

**Testing Protocol:**
```bash
# Clear localStorage to simulate first-time user
localStorage.clear()

# Test Cases:
- [ ] First time opening Daily Log → Modal appears
- [ ] Click "Yes, show my streak" → Streak counter appears
- [ ] Click "No, just show completion" → Only ✓/○ appears
- [ ] Click "Ask me later" → Modal closes, no streak shown
- [ ] Go to Settings → Can toggle streak on/off
- [ ] Refresh page → Setting persists
- [ ] Dashboard respects streak setting
```

**Acceptance Criteria:**
- [ ] No streak shown until user explicitly enables
- [ ] Modal language is supportive, not judgmental
- [ ] "Ask me later" option available
- [ ] Can toggle in Settings at any time
- [ ] Dashboard and Daily Log both respect setting

---

### ✅ Issue #3: Fix Christian Calendar (Easter, Liturgical Seasons, Orthodox)

**Current State:**
- Christian calendar uses fixed dates (January 6 = Epiphany)
- No Easter calculation (Easter is movable, different in East vs. West)
- No liturgical seasons (Advent, Lent, Eastertide, Ordinary Time)
- Orthodox calendar not accounted for (Julian calendar, 13 days offset)

**Files to Modify:**
```
src/data/religiousCalendars.js          (MODIFY - add Easter calculation)
src/utils/liturgicalCalendar.js         (NEW - Easter + season calculations)
src/components/Calendar/ChristianCalendar.jsx  (NEW - dedicated component)
```

**Implementation:**

```javascript
// src/utils/liturgicalCalendar.js (NEW FILE)

// Computus algorithm for Easter date calculation
export function calculateEaster(year, orthodox = false) {
  // Western Easter (Gregorian calendar)
  if (!orthodox) {
    const a = year % 19
    const b = Math.floor(year / 100)
    const c = year % 100
    const d = Math.floor(b / 4)
    const e = b % 4
    const f = Math.floor((b + 8) / 25)
    const g = Math.floor((b - f + 1) / 3)
    const h = (19 * a + b - d - g + 15) % 30
    const i = Math.floor(c / 4)
    const k = c % 4
    const l = (32 + 2 * e + 2 * i - h - k) % 7
    const m = Math.floor((a + 11 * h + 22 * l) / 451)
    const month = Math.floor((h + l - 7 * m + 114) / 31)
    const day = ((h + l - 7 * m + 114) % 31) + 1
    return new Date(year, month - 1, day)
  }

  // Orthodox Easter (Julian calendar + 13-day offset)
  // Uses older calculation method
  const a = year % 4
  const b = year % 7
  const c = year % 19
  const d = (19 * c + 15) % 30
  const e = (2 * a + 4 * b - d + 34) % 7
  const month = Math.floor((d + e + 114) / 31)
  const day = ((d + e + 114) % 31) + 1

  // Add 13-day offset for Julian → Gregorian conversion
  const julianDate = new Date(year, month - 1, day)
  julianDate.setDate(julianDate.getDate() + 13)
  return julianDate
}

// Calculate liturgical season for a given date
export function getLiturgicalSeason(date, orthodox = false) {
  const year = date.getFullYear()
  const easter = calculateEaster(year, orthodox)

  // Calculate key dates based on Easter
  const ashWednesday = new Date(easter)
  ashWednesday.setDate(easter.getDate() - 46)

  const pentecost = new Date(easter)
  pentecost.setDate(easter.getDate() + 49)

  const advent = getAdventStart(year)
  const christmasDay = new Date(year, 11, 25) // December 25
  const epiphany = new Date(year, 0, 6) // January 6
  const baptismOfLord = getFirstSundayAfter(epiphany)

  // Determine season
  if (date >= advent && date < christmasDay) {
    return { season: 'Advent', color: 'purple', week: getWeekInSeason(date, advent) }
  }
  if (date >= christmasDay && date < epiphany) {
    return { season: 'Christmas', color: 'white' }
  }
  if (date >= epiphany && date < baptismOfLord) {
    return { season: 'Epiphany', color: 'white' }
  }
  if (date >= ashWednesday && date < easter) {
    const week = Math.floor((date - ashWednesday) / (7 * 24 * 60 * 60 * 1000)) + 1
    return { season: 'Lent', color: 'purple', week }
  }
  if (date >= easter && date < pentecost) {
    return { season: 'Easter', color: 'white', week: getWeekInSeason(date, easter) }
  }

  return { season: 'Ordinary Time', color: 'green' }
}

function getAdventStart(year) {
  // Advent starts 4 Sundays before Christmas
  const christmas = new Date(year, 11, 25)
  const dayOfWeek = christmas.getDay()
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const advent = new Date(christmas)
  advent.setDate(christmas.getDate() - (28 - daysUntilSunday))
  return advent
}

function getFirstSundayAfter(date) {
  const result = new Date(date)
  const dayOfWeek = date.getDay()
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek
  result.setDate(date.getDate() + daysUntilSunday)
  return result
}

function getWeekInSeason(date, seasonStart) {
  return Math.floor((date - seasonStart) / (7 * 24 * 60 * 60 * 1000)) + 1
}

// Sunday Lectionary (3-year cycle: A, B, C)
export function getLectionaryCycle(year) {
  // Year A: Matthew, Year B: Mark, Year C: Luke
  // Cycle starts First Sunday of Advent
  const cycleStart = 2023 // Year A started in Advent 2023
  const yearsSince = year - cycleStart
  const cycle = ['A', 'B', 'C'][yearsSince % 3]
  return cycle
}

// Daily lectionary readings (simplified - full implementation would need database)
export function getDailyReadings(date, orthodox = false) {
  // This would need a full lectionary database
  // For now, return placeholder
  return {
    firstReading: 'See daily lectionary',
    psalm: 'Psalm of the day',
    gospel: 'Gospel reading',
    optional: 'Optional readings'
  }
}
```

```javascript
// src/data/religiousCalendars.js (MODIFY)
import { calculateEaster, getLiturgicalSeason } from '../utils/liturgicalCalendar'

// Add to exports
export const christianCalendarEnhanced = {
  // ... existing fixed holidays ...

  // Dynamic holidays (calculated each year)
  getDynamicHolidays: (year, orthodox = false) => {
    const easter = calculateEaster(year, orthodox)

    const holidays = [
      {
        name: 'Easter Sunday',
        date: easter,
        description: 'Resurrection of Jesus Christ',
        significance: 'Highest holy day in Christianity',
        traditions: orthodox
          ? ['Eastern Orthodox', 'Oriental Orthodox']
          : ['Roman Catholic', 'Protestant', 'Anglican']
      }
    ]

    // Ash Wednesday (46 days before Easter)
    const ashWednesday = new Date(easter)
    ashWednesday.setDate(easter.getDate() - 46)
    holidays.push({
      name: 'Ash Wednesday',
      date: ashWednesday,
      description: 'Beginning of Lent',
      traditions: ['Roman Catholic', 'Anglican', 'Lutheran', 'Methodist']
    })

    // Palm Sunday (7 days before Easter)
    const palmSunday = new Date(easter)
    palmSunday.setDate(easter.getDate() - 7)
    holidays.push({
      name: 'Palm Sunday',
      date: palmSunday,
      description: 'Beginning of Holy Week'
    })

    // Good Friday (2 days before Easter)
    const goodFriday = new Date(easter)
    goodFriday.setDate(easter.getDate() - 2)
    holidays.push({
      name: 'Good Friday',
      date: goodFriday,
      description: 'Crucifixion of Jesus'
    })

    // Ascension Thursday (39 days after Easter)
    const ascension = new Date(easter)
    ascension.setDate(easter.getDate() + 39)
    holidays.push({
      name: 'Ascension Thursday',
      date: ascension,
      description: 'Ascension of Christ into heaven'
    })

    // Pentecost (49 days after Easter)
    const pentecost = new Date(easter)
    pentecost.setDate(easter.getDate() + 49)
    holidays.push({
      name: 'Pentecost',
      date: pentecost,
      description: 'Descent of the Holy Spirit'
    })

    return holidays
  },

  getLiturgicalInfo: (date, orthodox = false) => {
    return getLiturgicalSeason(date, orthodox)
  }
}
```

**Testing Protocol:**
```bash
# Test Easter calculation
calculateEaster(2026, false)  // Should return April 5, 2026
calculateEaster(2026, true)   // Should return April 12, 2026 (Orthodox)
calculateEaster(2027, false)  // Should return March 28, 2027

# Test liturgical seasons
getLiturgicalSeason(new Date('2026-12-01'))  // Should return Advent
getLiturgicalSeason(new Date('2026-12-25'))  // Should return Christmas
getLiturgicalSeason(new Date('2026-02-18'))  // Should return Lent (Ash Wed 2026)
getLiturgicalSeason(new Date('2026-04-05'))  // Should return Easter

# Test Cases:
- [ ] Easter date changes each year (movable feast)
- [ ] Orthodox Easter is 1 week later (usually) than Western
- [ ] Ash Wednesday is exactly 46 days before Easter
- [ ] Pentecost is 49 days after Easter
- [ ] Liturgical seasons show correct colors (purple, white, green)
- [ ] Advent starts 4 Sundays before Christmas
- [ ] Lectionary cycle rotates A → B → C
```

**Acceptance Criteria:**
- [ ] Easter calculates correctly for Western Christianity
- [ ] Orthodox Easter calculates separately (Julian calendar + 13 days)
- [ ] User can toggle "Western" vs. "Orthodox" calendar in Settings
- [ ] Liturgical season displays on Calendar page (e.g., "Week 3 of Lent")
- [ ] All movable feasts calculate from Easter (Ash Wednesday, Pentecost, etc.)
- [ ] Existing fixed holidays (Christmas, Epiphany) remain

---

### ✅ Issue #4: Add Privacy Mode / Encrypted Storage

**Current State:**
- Religious identity stored in `localStorage` as plaintext JSON
- IndexedDB data is unencrypted
- No "private mode" for users in hostile environments

**Files to Modify:**
```
src/utils/encryption.js                 (NEW - Web Crypto API wrapper)
src/contexts/PrivacyContext.jsx         (NEW - privacy mode management)
src/pages/Settings.jsx                  (Add privacy settings section)
src/components/PanicButton.jsx          (NEW - instant data wipe)
```

**Implementation:**

```javascript
// src/utils/encryption.js (NEW FILE)

// Generate encryption key from user passphrase
export async function generateKey(passphrase) {
  const enc = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('sanctum-salt-v1'), // In production, use random salt per user
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )

  return key
}

// Encrypt data
export async function encryptData(data, key) {
  const enc = new TextEncoder()
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(JSON.stringify(data))
  )

  // Return IV + encrypted data as base64
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)

  return btoa(String.fromCharCode(...combined))
}

// Decrypt data
export async function decryptData(encryptedBase64, key) {
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0))
  const iv = combined.slice(0, 12)
  const encrypted = combined.slice(12)

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  )

  const dec = new TextDecoder()
  return JSON.parse(dec.decode(decrypted))
}
```

```javascript
// src/contexts/PrivacyContext.jsx (NEW FILE)
import React, { createContext, useContext, useState, useEffect } from 'react'
import { generateKey, encryptData, decryptData } from '../utils/encryption'

const PrivacyContext = createContext()

export function PrivacyProvider({ children }) {
  const [privacyMode, setPrivacyMode] = useState('normal') // 'normal', 'private', 'encrypted'
  const [encryptionKey, setEncryptionKey] = useState(null)
  const [isUnlocked, setIsUnlocked] = useState(true)

  // Load privacy mode from localStorage
  useEffect(() => {
    const mode = localStorage.getItem('sanctum-privacy-mode')
    if (mode) setPrivacyMode(mode)
  }, [])

  // Save privacy mode
  useEffect(() => {
    localStorage.setItem('sanctum-privacy-mode', privacyMode)
  }, [privacyMode])

  // Private mode: data only in sessionStorage, cleared on close
  const enablePrivateMode = () => {
    setPrivacyMode('private')
    // Move localStorage data to sessionStorage
    const traditionSettings = localStorage.getItem('sanctum-tradition-settings')
    if (traditionSettings) {
      sessionStorage.setItem('sanctum-tradition-settings', traditionSettings)
      localStorage.removeItem('sanctum-tradition-settings')
    }
  }

  // Encrypted mode: require passphrase to unlock
  const enableEncryptedMode = async (passphrase) => {
    const key = await generateKey(passphrase)
    setEncryptionKey(key)
    setPrivacyMode('encrypted')
    setIsUnlocked(true)
  }

  // Lock app (encrypted mode only)
  const lockApp = () => {
    setIsUnlocked(false)
    setEncryptionKey(null)
  }

  // Unlock app with passphrase
  const unlockApp = async (passphrase) => {
    try {
      const key = await generateKey(passphrase)
      // Test decryption with stored test value
      const testEncrypted = localStorage.getItem('sanctum-encryption-test')
      if (testEncrypted) {
        await decryptData(testEncrypted, key)
      }
      setEncryptionKey(key)
      setIsUnlocked(true)
      return true
    } catch (err) {
      return false // Wrong passphrase
    }
  }

  // Panic button: instant wipe
  const panicWipe = () => {
    // Clear all localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sanctum-')) {
        localStorage.removeItem(key)
      }
    })

    // Clear all sessionStorage
    sessionStorage.clear()

    // Clear IndexedDB
    indexedDB.deleteDatabase('sanctum-db')

    // Redirect to blank page
    window.location.href = 'about:blank'
  }

  return (
    <PrivacyContext.Provider value={{
      privacyMode,
      isUnlocked,
      encryptionKey,
      enablePrivateMode,
      enableEncryptedMode,
      lockApp,
      unlockApp,
      panicWipe
    }}>
      {children}
    </PrivacyContext.Provider>
  )
}

export const usePrivacy = () => useContext(PrivacyContext)
```

```javascript
// src/components/PanicButton.jsx (NEW FILE)
import React, { useState } from 'react'
import { usePrivacy } from '../contexts/PrivacyContext'
import './PanicButton.css'

export default function PanicButton() {
  const { panicWipe } = usePrivacy()
  const [confirmPhrase, setConfirmPhrase] = useState('')

  const handlePanic = () => {
    if (confirmPhrase === 'DELETE EVERYTHING') {
      panicWipe()
    }
  }

  return (
    <div className="panic-button-section">
      <h3>⚠ Panic Button</h3>
      <p>
        Instantly delete ALL Practice Space data from this device.
        <br />
        <strong>This cannot be undone.</strong>
      </p>

      <input
        type="text"
        placeholder="Type: DELETE EVERYTHING"
        value={confirmPhrase}
        onChange={e => setConfirmPhrase(e.target.value)}
        className="panic-confirm-input"
      />

      <button
        className="btn-danger"
        onClick={handlePanic}
        disabled={confirmPhrase !== 'DELETE EVERYTHING'}
      >
        🚨 Wipe All Data Now
      </button>

      <p className="fine-print">
        Use this if you need to immediately remove all traces of this app
        (e.g., device seizure risk, hostile environment).
      </p>
    </div>
  )
}
```

**Testing Protocol:**
```bash
# Test encryption
const key = await generateKey('test-passphrase-123')
const encrypted = await encryptData({ test: 'data' }, key)
const decrypted = await decryptData(encrypted, key)
console.assert(decrypted.test === 'data')

# Test private mode
- [ ] Enable private mode
- [ ] Close browser
- [ ] Reopen browser
- [ ] Tradition settings should be cleared (sessionStorage only)

# Test encrypted mode
- [ ] Set passphrase "MySecurePass123"
- [ ] Close app
- [ ] Reopen → Should prompt for passphrase
- [ ] Enter wrong passphrase → Denied
- [ ] Enter correct passphrase → Access granted

# Test panic button
- [ ] Type "DELETE EVERYTHING"
- [ ] Click panic button
- [ ] Verify all localStorage cleared
- [ ] Verify IndexedDB deleted
- [ ] Verify redirect to about:blank
```

**Acceptance Criteria:**
- [ ] Normal mode: Data in localStorage + IndexedDB (current behavior)
- [ ] Private mode: Data in sessionStorage only, clears on browser close
- [ ] Encrypted mode: Data encrypted with user passphrase, requires unlock
- [ ] Panic button: Instant wipe with confirmation phrase
- [ ] Privacy mode selector in Settings
- [ ] Clear UI explanation of each mode's security level

---

### ✅ Issue #5: Clarify Data Storage (Local vs Cloud) in First-Run

**Current State:**
- App is offline-first with optional cloud sync
- Not clearly communicated to new users
- Users may assume data auto-uploads to cloud

**Files to Modify:**
```
src/pages/Splash.jsx                    (Add data privacy message)
src/pages/Onboarding.jsx                (Add privacy screen)
src/components/DataPrivacyBanner.jsx    (NEW - persistent banner)
```

**Implementation:**

```javascript
// src/pages/Splash.jsx (MODIFY)
// Add before "Continue" button

<div className="data-privacy-notice">
  <div className="privacy-icon">🔒</div>
  <h3>Your data stays on YOUR device</h3>
  <p>
    Practice Space stores everything locally (offline-first).<br />
    <strong>No account required.</strong> No automatic uploads.
  </p>
  <p className="fine-print">
    You can optionally enable cloud backup later in Settings.
  </p>
</div>
```

```javascript
// src/components/DataPrivacyBanner.jsx (NEW FILE)
import React, { useState, useEffect } from 'react'
import './DataPrivacyBanner.css'

export default function DataPrivacyBanner() {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const wasDismissed = localStorage.getItem('sanctum-privacy-banner-dismissed')
    if (wasDismissed) setDismissed(true)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('sanctum-privacy-banner-dismissed', 'true')
  }

  if (dismissed) return null

  return (
    <div className="data-privacy-banner">
      <div className="banner-content">
        <span className="banner-icon">🔒</span>
        <span className="banner-text">
          Your practices are stored locally on this device.
          Cloud sync is optional and off by default.
        </span>
        <button className="banner-dismiss" onClick={handleDismiss}>
          Got it
        </button>
      </div>
    </div>
  )
}
```

**Testing Protocol:**
```bash
# Test splash screen message
- [ ] Open app for first time
- [ ] See clear "Your data stays on YOUR device" message
- [ ] Message appears before onboarding

# Test banner
- [ ] Banner appears on Dashboard on first visit
- [ ] Click "Got it" → Banner disappears
- [ ] Refresh page → Banner stays dismissed
- [ ] Clear localStorage → Banner reappears

# Test Settings sync section
- [ ] Go to Settings
- [ ] Find "Cloud Sync" section
- [ ] Default: "Off" with clear toggle
- [ ] Explanation: "When enabled, your data syncs to Firebase"
```

**Acceptance Criteria:**
- [ ] First-run splash screen mentions local storage
- [ ] "No account required" stated clearly
- [ ] Banner appears once, dismissible
- [ ] Settings page has dedicated "Cloud Sync" section with toggle
- [ ] Sync status visible (Off, Connected, Syncing, Error)

---

## 🔧 SHOULD FIX (Next 3 Months)

### Issue #6: Add Islamic Prayer Times

**Files to Create:**
```
src/utils/prayerTimes.js                (NEW - Adhan calculation)
src/components/PrayerTimesWidget.jsx    (NEW - Dashboard widget)
src/pages/Dashboard.jsx                 (MODIFY - add widget)
```

**Implementation:**
```javascript
// Install package: npm install adhan

// src/utils/prayerTimes.js
import { CalculationMethod, PrayerTimes, Coordinates } from 'adhan'

export async function getPrayerTimes(latitude, longitude, date = new Date()) {
  const coordinates = new Coordinates(latitude, longitude)
  const params = CalculationMethod.MuslimWorldLeague() // User-selectable in Settings
  const prayerTimes = new PrayerTimes(coordinates, date, params)

  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha
  }
}

export function getNextPrayer(prayerTimes) {
  const now = new Date()
  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']

  for (const prayer of prayers) {
    if (now < prayerTimes[prayer]) {
      return { name: prayer, time: prayerTimes[prayer] }
    }
  }

  // If all prayers passed, return tomorrow's Fajr
  return { name: 'fajr', time: 'tomorrow' }
}
```

**Testing:**
```bash
# Test with known location
- [ ] New York: 40.7128°N, 74.0060°W
- [ ] Mecca: 21.4225°N, 39.8262°E
- [ ] Verify times match IslamicFinder.org
- [ ] Test different calculation methods (MWL, ISNA, Umm al-Qura)
- [ ] Verify DST handling
```

---

### Issue #7: Add Non-Daily Practice Tracking

**Files to Modify:**
```
src/pages/DailyLog.jsx                  (Rename to PracticeLog.jsx)
src/components/PracticeFrequencyPicker.jsx (NEW)
src/db/index.js                         (Add frequency field)
```

**Implementation:**
```javascript
// src/components/PracticeFrequencyPicker.jsx
export default function PracticeFrequencyPicker({ value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="lunar">Lunar (New/Full Moon)</option>
      <option value="seasonal">Seasonal (Solstices/Equinoxes)</option>
      <option value="custom">Custom...</option>
    </select>
  )
}
```

**Testing:**
```bash
- [ ] Create weekly practice (e.g., Jumu'ah Friday prayer)
- [ ] Practice Log shows weekly calendar view
- [ ] Lunar practice appears on new/full moon dates
- [ ] Seasonal practice appears on solstices/equinoxes
- [ ] Streak calculation respects frequency (weekly streak = 4 consecutive weeks)
```

---

## 📋 COMPREHENSIVE TEST SCENARIOS

### Persona: Sunni Muslim User

**Setup:**
1. First-time user
2. Selects "Islam" tradition
3. Selects "Sunni" subgroup

**Expected Behavior:**
- [ ] Sees 5 Salah practices + Quran + Dhikr + Dua
- [ ] Dashboard shows prayer times widget (if location enabled)
- [ ] Journal prompts reference Quran, Hadith, Allah
- [ ] Calendar shows Ramadan, Eid al-Fitr, Eid al-Adha
- [ ] Library has Quran, Tafsir, Hadith categories
- [ ] NO "Tarot/Divination" practice offered
- [ ] Timer has Arabic calligraphy option (aesthetic)

---

### Persona: Catholic User

**Setup:**
1. First-time user
2. Selects "Christianity" → "Catholic"

**Expected Behavior:**
- [ ] Sees Lectio Divina, Rosary, Mass, Examen practices
- [ ] Calendar shows liturgical season (e.g., "Week 3 of Lent")
- [ ] Sunday readings displayed (Year A/B/C cycle)
- [ ] Journal prompts reference Scripture, saints, sacraments
- [ ] Library has Church Fathers, Catechism, Papal documents
- [ ] NO "Sacred Union" practice (not Catholic terminology)

---

### Persona: Buddhist User (Zen Tradition)

**Setup:**
1. Selects "Buddhism" → "Zen"

**Expected Behavior:**
- [ ] Sees Zazen (sitting), Kinhin (walking), Sutra study
- [ ] Journal prompts avoid "achievement" language (no "progress")
- [ ] Timer has optional bells (mokugyo, inkin)
- [ ] NO streak system (or opted out)
- [ ] Calendar shows Rohatsu, Parinirvana, Vesak
- [ ] Library has koans, Dogen, Hakuin

---

### Persona: Religious Trauma Survivor

**Setup:**
1. First-time user
2. Answers onboarding: "Just beginning" spiritual journey
3. Opts OUT of streak tracking

**Expected Behavior:**
- [ ] NO streak counter visible
- [ ] NO "failure" or shame language
- [ ] Journal has "Stumble" category (not "Sin")
- [ ] Practices are invitations, not obligations
- [ ] Can skip days without guilt messaging
- [ ] Clear "You can change your mind" messaging throughout

---

### Persona: Privacy-Conscious User (Iran)

**Setup:**
1. Selects "Private Mode" in Settings
2. Practices Christianity (illegal in Iran)

**Expected Behavior:**
- [ ] Data stored in sessionStorage only
- [ ] Clears on browser close
- [ ] Panic button visible in Settings
- [ ] NO cloud sync option available
- [ ] NO Firebase Auth required
- [ ] Can use app fully offline

---

## 🎯 ACCEPTANCE CRITERIA SUMMARY

### Before Public Launch:
- [ ] 3 tradition presets exist (Christian, Islamic, Buddhist)
- [ ] Streaks are opt-in, not default
- [ ] Easter calculates correctly (Western + Orthodox)
- [ ] Privacy mode available
- [ ] Splash screen clarifies local storage

### Before Marketing to Major Traditions:
- [ ] Islamic prayer times functional
- [ ] Christian liturgical calendar complete
- [ ] Buddhist practices don't gamify
- [ ] Non-daily practice tracking works
- [ ] Accessibility audit passed (WCAG 2.1 AA)

### Long-Term Vision:
- [ ] 10+ tradition presets
- [ ] Community-contributed content system
- [ ] Multi-language support (Arabic, Hebrew, Sanskrit, etc.)
- [ ] Integration with external services (BibleGateway, Quran.com)
- [ ] iOS/Android native apps (not just PWA)

---

## 🐛 DEBUGGING CHECKLIST

### When Testing Tradition Presets:
```javascript
// src/data/traditions/index.js
// Ensure imports are correct:
import { druidPreset } from './druid'
import { christianPreset } from './christian'  // ← ADD THIS
import { islamicPreset } from './islamic'      // ← ADD THIS
import { buddhistPreset } from './buddhist'    // ← ADD THIS

// Ensure export:
export const traditionPresets = {
  druid: druidPreset,
  christian: christianPreset,     // ← ADD THIS
  islam: islamicPreset,           // ← ADD THIS
  buddhism: buddhistPreset        // ← ADD THIS
}
```

### When Testing Streaks Opt-In:
```javascript
// Verify localStorage key
const settings = JSON.parse(localStorage.getItem('sanctum-user-settings'))
console.log('Streaks enabled:', settings.streaksEnabled) // Should be null, true, or false

// If stuck, clear and retry:
localStorage.removeItem('sanctum-user-settings')
```

### When Testing Easter Calculation:
```javascript
// Test in browser console:
import { calculateEaster } from './src/utils/liturgicalCalendar'

// Known Easter dates:
calculateEaster(2026) // Should be April 5, 2026
calculateEaster(2027) // Should be March 28, 2027
calculateEaster(2030) // Should be April 21, 2030
```

### When Testing Encryption:
```javascript
// Test in browser console:
const { generateKey, encryptData, decryptData } = await import('./src/utils/encryption')

const key = await generateKey('test-password')
const encrypted = await encryptData({ secret: 'my practice data' }, key)
console.log('Encrypted:', encrypted)

const decrypted = await decryptData(encrypted, key)
console.log('Decrypted:', decrypted) // Should match original
```

---

## 📞 SUPPORT RESOURCES

### For Religious Accuracy:
- **Christianity**: Consult Catholic Catechism, Orthodox Typikon, Protestant liturgical resources
- **Islam**: Reference IslamicFinder.org for prayer times, Quran.com for ayah references
- **Buddhism**: Access Access to Insight (Theravada), Tricycle (general), FPMT (Tibetan)
- **Hinduism**: Hindu American Foundation resources, Vedanta Society
- **Judaism**: Sefaria.org (texts), OU Torah (Orthodox), Reform Judaism resources

### For Liturgical Calendars:
- **Catholic**: USCCB.org (daily readings, calendar)
- **Orthodox**: OrthodoxCalendar.com
- **Jewish**: Hebcal.com (Hebrew calendar API)
- **Islamic**: IslamicFinder.org, Fiqh Council of North America

### For Accessibility:
- **WCAG Guidelines**: W3.org/WAI/WCAG21/quickref
- **Screen Reader Testing**: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)
- **Color Contrast**: WebAIM Contrast Checker

---

## ✅ FINAL VALIDATION

Before marking this testing guide complete, verify:

- [ ] All 5 Critical Issues have implementation plans
- [ ] All 7 Should Fix issues are documented
- [ ] Test cases are specific and measurable
- [ ] Acceptance criteria are clear
- [ ] Code examples are syntactically valid
- [ ] File paths match actual project structure
- [ ] Religious content has been fact-checked
- [ ] No tradition is privileged over others in final state

---

**Last Updated:** 2026-02-10
**Testing Panel Size:** 100 simulated testers across 4 panels
**Estimated Implementation Time:** 120-160 hours for Critical Issues
**Estimated Implementation Time:** 200-300 hours for Should Fix items

**License:** This testing guide is provided for the Practice Space project. Religious content should be reviewed by practitioners of each tradition before public release.
