import SunCalc from 'suncalc'

// Moon phase icons
const MOON_ICONS = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']

// Zodiac signs with symbols and info
const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire', quality: 'Cardinal' },
  { name: 'Taurus', symbol: '♉', element: 'Earth', quality: 'Fixed' },
  { name: 'Gemini', symbol: '♊', element: 'Air', quality: 'Mutable' },
  { name: 'Cancer', symbol: '♋', element: 'Water', quality: 'Cardinal' },
  { name: 'Leo', symbol: '♌', element: 'Fire', quality: 'Fixed' },
  { name: 'Virgo', symbol: '♍', element: 'Earth', quality: 'Mutable' },
  { name: 'Libra', symbol: '♎', element: 'Air', quality: 'Cardinal' },
  { name: 'Scorpio', symbol: '♏', element: 'Water', quality: 'Fixed' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', quality: 'Mutable' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', quality: 'Cardinal' },
  { name: 'Aquarius', symbol: '♒', element: 'Air', quality: 'Fixed' },
  { name: 'Pisces', symbol: '♓', element: 'Water', quality: 'Mutable' }
]

// Zodiac sign descriptions for moon
const MOON_SIGN_DESCRIPTIONS = {
  Aries: 'Emotional energy, impulsive feelings, need for action',
  Taurus: 'Grounded emotions, desire for comfort and stability',
  Gemini: 'Mental restlessness, need for communication and variety',
  Cancer: 'Deep sensitivity, nurturing instincts, home-focused',
  Leo: 'Warm-hearted emotions, creative expression, need to shine',
  Virgo: 'Analytical feelings, desire to help and improve',
  Libra: 'Need for harmony, relationship-focused, seeking balance',
  Scorpio: 'Intense emotions, transformative energy, deep feelings',
  Sagittarius: 'Optimistic mood, need for freedom and adventure',
  Capricorn: 'Reserved emotions, focus on goals and achievement',
  Aquarius: 'Detached feelings, humanitarian concerns, originality',
  Pisces: 'Dreamy emotions, compassion, spiritual sensitivity'
}

// Seasonal markers and quarterly ceremonies
const SEASONAL_EVENTS = {
  spring_equinox: { name: 'Spring Equinox', ceremony: 'Emergence/Renewal', quarter: 'Q1' },
  summer_solstice: { name: 'Summer Solstice', ceremony: 'Growth/Radiance', quarter: 'Q2' },
  fall_equinox: { name: 'Fall Equinox', ceremony: 'Harvest/Integration', quarter: 'Q3' },
  winter_solstice: { name: 'Winter Solstice', ceremony: 'Descent/Restoration', quarter: 'Q4' }
}

/**
 * Get moon illumination data for a date
 */
export function getMoonData(date) {
  const illumination = SunCalc.getMoonIllumination(date)

  return {
    phase: illumination.phase,           // 0-1 (0=new, 0.5=full)
    fraction: illumination.fraction,     // 0-1 (illuminated fraction)
    angle: illumination.angle            // Moon angle
  }
}

/**
 * Get moon phase icon for a date
 */
export function getMoonPhaseIcon(date) {
  const { phase } = getMoonData(date)
  const index = Math.round(phase * 8) % 8
  return MOON_ICONS[index]
}

/**
 * Get detailed moon phase name
 */
export function getMoonPhaseName(date) {
  const { phase } = getMoonData(date)

  if (phase < 0.03 || phase > 0.97) return 'New Moon'
  if (phase < 0.22) return 'Waxing Crescent'
  if (phase < 0.28) return 'First Quarter'
  if (phase < 0.47) return 'Waxing Gibbous'
  if (phase < 0.53) return 'Full Moon'
  if (phase < 0.72) return 'Waning Gibbous'
  if (phase < 0.78) return 'Last Quarter'
  return 'Waning Crescent'
}

/**
 * Check if date is a major moon phase
 */
export function getMajorMoonPhase(date) {
  const { phase } = getMoonData(date)

  if (phase < 0.02 || phase > 0.98) return { type: 'new', name: 'New Moon', icon: '🌑' }
  if (phase > 0.23 && phase < 0.27) return { type: 'first', name: 'First Quarter', icon: '🌓' }
  if (phase > 0.48 && phase < 0.52) return { type: 'full', name: 'Full Moon', icon: '🌕' }
  if (phase > 0.73 && phase < 0.77) return { type: 'last', name: 'Last Quarter', icon: '🌗' }

  return null
}

/**
 * Check if waxing or waning
 */
export function isWaxing(date) {
  const { phase } = getMoonData(date)
  return phase < 0.5
}

/**
 * Calculate moon's zodiac sign
 * This uses a simplified astronomical calculation
 */
export function getMoonSign(date) {
  // Get moon position
  const moonPos = SunCalc.getMoonPosition(date, 0, 0)

  // Convert moon's ecliptic longitude to zodiac sign
  // This is a simplified calculation - for precise results use a full ephemeris
  const jd = getJulianDate(date)
  const T = (jd - 2451545.0) / 36525

  // Moon's mean longitude
  let L = 218.3164477 + 481267.88123421 * T
  L = L % 360
  if (L < 0) L += 360

  // Adjust for perturbations (simplified)
  const D = 297.8501921 + 445267.1114034 * T  // Mean elongation
  const M = 357.5291092 + 35999.0502909 * T   // Sun's mean anomaly
  const Mp = 134.9633964 + 477198.8675055 * T // Moon's mean anomaly

  // Major perturbation
  L += 6.289 * Math.sin(Mp * Math.PI / 180)
  L += 1.274 * Math.sin((2 * D - Mp) * Math.PI / 180)
  L = L % 360
  if (L < 0) L += 360

  // Get zodiac sign index (0-11)
  const signIndex = Math.floor(L / 30)
  const signDegree = L % 30

  return {
    ...ZODIAC_SIGNS[signIndex],
    degree: signDegree,
    description: MOON_SIGN_DESCRIPTIONS[ZODIAC_SIGNS[signIndex].name]
  }
}

/**
 * Get Julian date from JavaScript Date
 */
function getJulianDate(date) {
  return date.getTime() / 86400000 + 2440587.5
}

/**
 * Get seasonal event for a date (equinoxes, solstices)
 */
export function getSeasonalEvent(date) {
  const month = date.getMonth()
  const day = date.getDate()

  // Approximate dates (vary by 1-2 days each year)
  if (month === 2 && day >= 19 && day <= 21) {
    return { ...SEASONAL_EVENTS.spring_equinox, type: 'equinox' }
  }
  if (month === 5 && day >= 20 && day <= 22) {
    return { ...SEASONAL_EVENTS.summer_solstice, type: 'solstice' }
  }
  if (month === 8 && day >= 21 && day <= 23) {
    return { ...SEASONAL_EVENTS.fall_equinox, type: 'equinox' }
  }
  if (month === 11 && day >= 20 && day <= 22) {
    return { ...SEASONAL_EVENTS.winter_solstice, type: 'solstice' }
  }

  return null
}

/**
 * Check for special lunar events
 */
export function getSpecialLunarEvent(date, monthFullMoons = []) {
  const events = []
  const majorPhase = getMajorMoonPhase(date)

  if (majorPhase?.type === 'full') {
    // Check for supermoon (moon at perigee during full moon)
    const moonTimes = SunCalc.getMoonTimes(date, 0, 0)
    const moonPos = SunCalc.getMoonPosition(date, 0, 0)
    const distance = moonPos.distance

    // Supermoon threshold: closer than 360,000 km
    if (distance < 360000) {
      events.push({ type: 'supermoon', name: 'Supermoon', icon: '🌕✨' })
    }

    // Check for blue moon (second full moon in month)
    const dateStr = date.toISOString().split('T')[0]
    if (monthFullMoons.length > 0 && !monthFullMoons.includes(dateStr) && monthFullMoons.length >= 1) {
      // This is handled in calendar component
    }
  }

  return events
}

/**
 * Get eclipse data for a date (simplified - real eclipses are complex to calculate)
 * This uses known eclipse dates for 2024-2027
 */
export function getEclipse(date) {
  const dateStr = date.toISOString().split('T')[0]

  // Known eclipse dates (add more as needed)
  const eclipses = {
    // 2024
    '2024-03-25': { type: 'lunar', name: 'Penumbral Lunar Eclipse' },
    '2024-04-08': { type: 'solar', name: 'Total Solar Eclipse' },
    '2024-09-18': { type: 'lunar', name: 'Partial Lunar Eclipse' },
    '2024-10-02': { type: 'solar', name: 'Annular Solar Eclipse' },
    // 2025
    '2025-03-14': { type: 'lunar', name: 'Total Lunar Eclipse' },
    '2025-03-29': { type: 'solar', name: 'Partial Solar Eclipse' },
    '2025-09-07': { type: 'lunar', name: 'Total Lunar Eclipse' },
    '2025-09-21': { type: 'solar', name: 'Partial Solar Eclipse' },
    // 2026
    '2026-02-17': { type: 'solar', name: 'Annular Solar Eclipse' },
    '2026-03-03': { type: 'lunar', name: 'Total Lunar Eclipse' },
    '2026-08-12': { type: 'solar', name: 'Total Solar Eclipse' },
    '2026-08-28': { type: 'lunar', name: 'Partial Lunar Eclipse' },
    // 2027
    '2027-02-06': { type: 'solar', name: 'Annular Solar Eclipse' },
    '2027-02-20': { type: 'lunar', name: 'Penumbral Lunar Eclipse' },
    '2027-07-18': { type: 'lunar', name: 'Penumbral Lunar Eclipse' },
    '2027-08-02': { type: 'solar', name: 'Total Solar Eclipse' },
    '2027-08-17': { type: 'lunar', name: 'Penumbral Lunar Eclipse' }
  }

  return eclipses[dateStr] || null
}

/**
 * Get all lunar data for a single date
 */
export function getDayLunarData(date) {
  const moonData = getMoonData(date)
  const moonSign = getMoonSign(date)
  const majorPhase = getMajorMoonPhase(date)
  const eclipse = getEclipse(date)
  const seasonalEvent = getSeasonalEvent(date)

  return {
    phase: moonData.phase,
    illumination: Math.round(moonData.fraction * 100),
    phaseName: getMoonPhaseName(date),
    phaseIcon: getMoonPhaseIcon(date),
    majorPhase,
    isWaxing: isWaxing(date),
    moonSign,
    eclipse,
    seasonalEvent
  }
}

/**
 * Find all full moons in a month (for blue moon detection)
 */
export function getMonthFullMoons(year, month) {
  const fullMoons = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12) // noon
    const majorPhase = getMajorMoonPhase(date)
    if (majorPhase?.type === 'full') {
      fullMoons.push(date.toISOString().split('T')[0])
    }
  }

  return fullMoons
}

/**
 * Check if a full moon is a blue moon
 */
export function isBlueMoon(date, monthFullMoons) {
  const dateStr = date.toISOString().split('T')[0]
  return monthFullMoons.length >= 2 && monthFullMoons[1] === dateStr
}

/**
 * Get lunar data for an entire month
 */
export function getMonthLunarData(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const fullMoons = getMonthFullMoons(year, month)
  const data = {}

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12) // Use noon to avoid timezone issues
    const dateStr = date.toISOString().split('T')[0]
    const dayData = getDayLunarData(date)

    // Check for blue moon
    if (dayData.majorPhase?.type === 'full' && isBlueMoon(date, fullMoons)) {
      dayData.blueMoon = true
    }

    data[dateStr] = dayData
  }

  return { data, fullMoons }
}

export { ZODIAC_SIGNS, MOON_SIGN_DESCRIPTIONS, SEASONAL_EVENTS }
