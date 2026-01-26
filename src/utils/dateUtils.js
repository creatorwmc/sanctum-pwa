// Date utilities for local timezone handling

/**
 * Get today's date in YYYY-MM-DD format using LOCAL timezone
 * This is critical for daily tracking to reset at midnight local time
 */
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get yesterday's date in YYYY-MM-DD format using LOCAL timezone
 */
export function getYesterdayDateString() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return getLocalDateString(yesterday)
}

/**
 * Get current month in YYYY-MM format using LOCAL timezone
 */
export function getLocalMonthString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Check if a date string is today (local timezone)
 */
export function isToday(dateString) {
  return dateString === getLocalDateString()
}

/**
 * Check if a date string is yesterday (local timezone)
 */
export function isYesterday(dateString) {
  return dateString === getYesterdayDateString()
}
