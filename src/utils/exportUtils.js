// Export utility functions for Practice Space PWA

/**
 * Generate a filename with timestamp
 */
export function generateFilename(dataType, extension) {
  const date = new Date().toISOString().split('T')[0]
  return `PracticeSpace_${dataType}_${date}.${extension}`
}

/**
 * Download a file to the user's device
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Convert journal entry to markdown
 */
export function journalEntryToMarkdown(entry) {
  const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const typeLabels = {
    insight: 'Insight',
    breakthrough: 'Breakthrough',
    stumble: 'Stumble',
    general: 'Journal Entry'
  }

  const typeEmoji = {
    insight: '💡',
    breakthrough: '⚡',
    stumble: '🌱',
    general: '📝'
  }

  return `# ${typeEmoji[entry.type] || '📝'} ${typeLabels[entry.type] || 'Journal Entry'}

**Date:** ${date}

---

${entry.content}

---
*Exported from Practice Space*
`
}

/**
 * Convert all journal entries to markdown
 */
export function allJournalEntriesToMarkdown(entries) {
  const sorted = [...entries].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  )

  let markdown = `# Practice Space Integration Journal

Exported on ${new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

Total entries: ${entries.length}

---

`

  for (const entry of sorted) {
    markdown += journalEntryToMarkdown(entry) + '\n\n'
  }

  return markdown
}

/**
 * Convert meditation session to text
 */
export function sessionToText(session) {
  const date = new Date(session.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const duration = session.duration >= 60
    ? `${Math.floor(session.duration / 60)}h ${session.duration % 60}m`
    : `${session.duration} minutes`

  let text = `MEDITATION SESSION
==================

Date: ${date}
Duration: ${duration}
Type: ${session.type || 'General Meditation'}
`

  if (session.notes) {
    text += `
Notes:
------
${session.notes}
`
  }

  text += `
---
Exported from Practice Space
`

  return text
}

/**
 * Convert sessions to CSV
 */
export function sessionsToCSV(sessions) {
  const sorted = [...sessions].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  )

  const headers = ['Date', 'Duration (minutes)', 'Type', 'Notes']
  const rows = sorted.map(s => [
    s.date,
    s.duration,
    s.type || 'General',
    `"${(s.notes || '').replace(/"/g, '""')}"`
  ])

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

/**
 * Convert daily practice logs to CSV
 */
export function practiceLogsToCSV(logs, startDate = null, endDate = null) {
  let filtered = [...logs]

  if (startDate) {
    filtered = filtered.filter(l => l.date >= startDate)
  }
  if (endDate) {
    filtered = filtered.filter(l => l.date <= endDate)
  }

  const sorted = filtered.sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  )

  // All possible practices
  const allPractices = [
    'ritualBath', 'meditation', 'vessel', 'breathwork', 'study',
    'journaling', 'sacredUnion', 'tending', 'tarot', 'ceremonial'
  ]

  const practiceLabels = {
    ritualBath: 'Ritual Bath',
    meditation: 'Meditation',
    vessel: 'Vessel Work',
    breathwork: 'Breathwork',
    study: 'Study/Reading',
    journaling: 'Integration Journaling',
    sacredUnion: 'Sacred Union',
    tending: 'Tending',
    tarot: 'Tarot/Divination',
    ceremonial: 'Ceremonial Work'
  }

  const headers = ['Date', ...allPractices.map(p => practiceLabels[p])]
  const rows = sorted.map(log => {
    const practices = log.practices || []
    return [
      log.date,
      ...allPractices.map(p => practices.includes(p) ? 'Yes' : '')
    ]
  })

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

/**
 * Export everything as JSON
 */
export function exportAllToJSON(data) {
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '1.0',
    appName: 'Practice Space',
    ...data
  }, null, 2)
}

/**
 * Format date for display
 */
export function formatDateForExport(date) {
  return new Date(date).toISOString().split('T')[0]
}
