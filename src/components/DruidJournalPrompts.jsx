import { useState, useEffect } from 'react'
import { DRUID_PRESET } from '../data/traditions/druid'
import './DruidJournalPrompts.css'

// Get current element based on week of year
function getCurrentElement() {
  const weekOfYear = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000))
  const elements = ['Earth', 'Air', 'Fire', 'Water']
  return elements[weekOfYear % 4]
}

// Get current Ogham tree month
function getCurrentTreeMonth() {
  const today = new Date()
  const month = today.getMonth()
  const day = today.getDate()

  const ogham = DRUID_PRESET.oghamCalendar

  // Simplified mapping based on approximate dates
  // In a full implementation, you'd parse the period strings
  const treeMonths = [
    { start: [11, 24], end: [0, 20], tree: ogham[0] },  // Birch
    { start: [0, 21], end: [1, 17], tree: ogham[1] },   // Rowan
    { start: [1, 18], end: [2, 17], tree: ogham[2] },   // Ash
    { start: [2, 18], end: [3, 14], tree: ogham[3] },   // Alder
    { start: [3, 15], end: [4, 12], tree: ogham[4] },   // Willow
    { start: [4, 13], end: [5, 9], tree: ogham[5] },    // Hawthorn
    { start: [5, 10], end: [6, 7], tree: ogham[6] },    // Oak
    { start: [6, 8], end: [7, 4], tree: ogham[7] },     // Holly
    { start: [7, 5], end: [8, 1], tree: ogham[8] },     // Hazel
    { start: [8, 2], end: [8, 29], tree: ogham[9] },    // Apple
    { start: [8, 30], end: [9, 27], tree: ogham[10] },  // Vine
    { start: [9, 28], end: [10, 24], tree: ogham[11] }, // Ivy
    { start: [10, 25], end: [11, 23], tree: ogham[12] } // Reed
  ]

  for (const tm of treeMonths) {
    const [startMonth, startDay] = tm.start
    const [endMonth, endDay] = tm.end

    // Handle year wrap (Birch spans Dec-Jan)
    if (startMonth > endMonth) {
      if (month === startMonth && day >= startDay) return tm.tree
      if (month === endMonth && day <= endDay) return tm.tree
      if (month > startMonth || month < endMonth) return tm.tree
    } else {
      if (month === startMonth && day >= startDay) return tm.tree
      if (month === endMonth && day <= endDay) return tm.tree
      if (month > startMonth && month < endMonth) return tm.tree
    }
  }

  return ogham[0] // Default to Birch
}

// Get the current or upcoming holy day
function getSeasonalContext() {
  const today = new Date()
  const month = today.getMonth()
  const day = today.getDate()

  // Approximate holy day dates
  const holyDays = [
    { name: 'Alban Arthan', month: 11, day: 21, season: 'winter' },
    { name: 'Imbolc', month: 1, day: 1, season: 'late winter' },
    { name: 'Alban Eilir', month: 2, day: 20, season: 'spring' },
    { name: 'Beltane', month: 4, day: 1, season: 'late spring' },
    { name: 'Alban Hefin', month: 5, day: 21, season: 'summer' },
    { name: 'Lughnasadh', month: 7, day: 1, season: 'late summer' },
    { name: 'Alban Elfed', month: 8, day: 22, season: 'autumn' },
    { name: 'Samhain', month: 10, day: 1, season: 'late autumn' }
  ]

  // Find current season and next holy day
  let current = holyDays[holyDays.length - 1]
  let next = holyDays[0]

  for (let i = 0; i < holyDays.length; i++) {
    const hd = holyDays[i]
    if (month < hd.month || (month === hd.month && day < hd.day)) {
      next = hd
      current = holyDays[i === 0 ? holyDays.length - 1 : i - 1]
      break
    }
  }

  // Check if we're within 3 days of a holy day
  const daysUntilNext = Math.ceil((new Date(today.getFullYear(), next.month, next.day) - today) / (24 * 60 * 60 * 1000))
  const isNearHolyDay = daysUntilNext <= 3 && daysUntilNext >= 0

  return { current, next, isNearHolyDay, daysUntilNext }
}

function DruidJournalPrompts({ onSelectPrompt, compact = false }) {
  const [promptType, setPromptType] = useState('daily')
  const [currentPrompts, setCurrentPrompts] = useState([])
  const [contextInfo, setContextInfo] = useState({})

  useEffect(() => {
    updatePrompts()
  }, [promptType])

  function updatePrompts() {
    const element = getCurrentElement()
    const treeMonth = getCurrentTreeMonth()
    const seasonal = getSeasonalContext()

    setContextInfo({ element, treeMonth, seasonal })

    let prompts = [...(DRUID_PRESET.journalingPrompts[promptType] || [])]

    // Add contextual prompts
    if (promptType === 'daily') {
      // Add element-specific prompt
      const elementWork = DRUID_PRESET.elementalWork.schedule.find(e => e.element === element)
      if (elementWork) {
        prompts.push(elementWork.journalPrompt)
      }
    }

    if (promptType === 'weekly') {
      // Add tree month prompt
      prompts.push(`What does ${treeMonth.tree} (${treeMonth.letter}) teach me this month?`)
    }

    if (promptType === 'monthly' && treeMonth) {
      prompts.push(`How do the themes of ${treeMonth.themes.join(', ')} appear in my life?`)
    }

    // Add holy day prompts if near one
    if (seasonal.isNearHolyDay) {
      const holyDay = DRUID_PRESET.holyDays.solarFestivals.find(h => h.name === seasonal.next.name) ||
                      DRUID_PRESET.holyDays.fireFestivals.find(h => h.name === seasonal.next.name)
      if (holyDay?.journalPrompts) {
        prompts = [...holyDay.journalPrompts, ...prompts]
      }
    }

    setCurrentPrompts(prompts)
  }

  if (compact) {
    return (
      <div className="druid-prompts-compact">
        <div className="prompt-context">
          <span className="context-item" title={`Element: ${contextInfo.element}`}>
            🜁 {contextInfo.element}
          </span>
          <span className="context-item" title={`Tree: ${contextInfo.treeMonth?.tree}`}>
            {contextInfo.treeMonth?.symbol} {contextInfo.treeMonth?.tree}
          </span>
          {contextInfo.seasonal?.isNearHolyDay && (
            <span className="context-item context-highlight">
              ☀ {contextInfo.seasonal.next.name} in {contextInfo.seasonal.daysUntilNext} days
            </span>
          )}
        </div>
        <div className="prompt-suggestion">
          <em>"{currentPrompts[0]}"</em>
          {onSelectPrompt && (
            <button
              className="use-prompt-btn"
              onClick={() => onSelectPrompt(currentPrompts[0])}
            >
              Use
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="druid-prompts">
      <div className="prompts-header">
        <h4>Druid Journal Prompts</h4>
        <div className="prompt-context-bar">
          <span className="context-badge" title={`Current element focus: ${contextInfo.element}`}>
            🜁 {contextInfo.element} Week
          </span>
          <span className="context-badge" title={`Ogham tree month: ${contextInfo.treeMonth?.tree}`}>
            {contextInfo.treeMonth?.symbol} {contextInfo.treeMonth?.tree} Month
          </span>
          {contextInfo.seasonal?.isNearHolyDay && (
            <span className="context-badge context-highlight">
              ☀ {contextInfo.seasonal.next.name} approaching
            </span>
          )}
        </div>
      </div>

      <div className="prompt-type-tabs">
        {['daily', 'weekly', 'monthly', 'quarterly'].map(type => (
          <button
            key={type}
            className={`prompt-tab ${promptType === type ? 'prompt-tab--active' : ''}`}
            onClick={() => setPromptType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <ul className="prompts-list">
        {currentPrompts.map((prompt, idx) => (
          <li key={idx} className="prompt-item">
            <span className="prompt-text">{prompt}</span>
            {onSelectPrompt && (
              <button
                className="use-prompt-btn"
                onClick={() => onSelectPrompt(prompt)}
                title="Use this prompt"
              >
                Use
              </button>
            )}
          </li>
        ))}
      </ul>

      {contextInfo.treeMonth && (
        <div className="tree-month-info">
          <h5>{contextInfo.treeMonth.symbol} {contextInfo.treeMonth.tree} ({contextInfo.treeMonth.letter})</h5>
          <p className="tree-period">{contextInfo.treeMonth.period}</p>
          <p className="tree-themes">
            <strong>Themes:</strong> {contextInfo.treeMonth.themes.join(' • ')}
          </p>
        </div>
      )}
    </div>
  )
}

export default DruidJournalPrompts
