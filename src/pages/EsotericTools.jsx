import { useState } from 'react'
import { db, queries } from '../db'
import { getLocalDateString } from '../utils/dateUtils'
import './EsotericTools.css'

// ============ GEMATRIA DATA ============
const HEBREW_VALUES = {
  'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
  'j': 10, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 'o': 60, 'p': 70, 'q': 80, 'r': 90,
  's': 100, 't': 200, 'u': 300, 'v': 400, 'w': 500, 'x': 600, 'y': 700, 'z': 800
}

const GREEK_VALUES = {
  'a': 1, 'b': 2, 'g': 3, 'd': 4, 'e': 5, 'f': 6, 'z': 7, 'h': 8, 'i': 9,
  'k': 10, 'l': 20, 'm': 30, 'n': 40, 'o': 50, 'p': 60, 'q': 70, 'r': 80, 's': 90,
  't': 100, 'u': 200, 'v': 300, 'w': 400, 'x': 500, 'y': 600, 'c': 700, 'j': 800
}

const ENGLISH_VALUES = {
  'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
  'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
  's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
}

// ============ TAROT DATA ============
const MAJOR_ARCANA = [
  { number: 0, name: 'The Fool', hebrew: 'Aleph', element: 'Air', astro: null },
  { number: 1, name: 'The Magician', hebrew: 'Beth', element: null, astro: 'Mercury' },
  { number: 2, name: 'The High Priestess', hebrew: 'Gimel', element: null, astro: 'Moon' },
  { number: 3, name: 'The Empress', hebrew: 'Daleth', element: null, astro: 'Venus' },
  { number: 4, name: 'The Emperor', hebrew: 'Heh', element: null, astro: 'Aries' },
  { number: 5, name: 'The Hierophant', hebrew: 'Vav', element: null, astro: 'Taurus' },
  { number: 6, name: 'The Lovers', hebrew: 'Zain', element: null, astro: 'Gemini' },
  { number: 7, name: 'The Chariot', hebrew: 'Cheth', element: null, astro: 'Cancer' },
  { number: 8, name: 'Strength', hebrew: 'Teth', element: null, astro: 'Leo' },
  { number: 9, name: 'The Hermit', hebrew: 'Yod', element: null, astro: 'Virgo' },
  { number: 10, name: 'Wheel of Fortune', hebrew: 'Kaph', element: null, astro: 'Jupiter' },
  { number: 11, name: 'Justice', hebrew: 'Lamed', element: null, astro: 'Libra' },
  { number: 12, name: 'The Hanged Man', hebrew: 'Mem', element: 'Water', astro: null },
  { number: 13, name: 'Death', hebrew: 'Nun', element: null, astro: 'Scorpio' },
  { number: 14, name: 'Temperance', hebrew: 'Samekh', element: null, astro: 'Sagittarius' },
  { number: 15, name: 'The Devil', hebrew: 'Ayin', element: null, astro: 'Capricorn' },
  { number: 16, name: 'The Tower', hebrew: 'Peh', element: null, astro: 'Mars' },
  { number: 17, name: 'The Star', hebrew: 'Tzaddi', element: null, astro: 'Aquarius' },
  { number: 18, name: 'The Moon', hebrew: 'Qoph', element: null, astro: 'Pisces' },
  { number: 19, name: 'The Sun', hebrew: 'Resh', element: null, astro: 'Sun' },
  { number: 20, name: 'Judgement', hebrew: 'Shin', element: 'Fire', astro: null },
  { number: 21, name: 'The World', hebrew: 'Tav', element: null, astro: 'Saturn' }
]

// ============ I CHING DATA ============
const HEXAGRAMS = [
  { number: 1, name: 'The Creative', keyword: 'Pure creative energy. Initiate action with confidence.' },
  { number: 2, name: 'The Receptive', keyword: 'Yielding strength. Success through acceptance and support.' },
  { number: 3, name: 'Difficulty at the Beginning', keyword: 'Birth pangs of the new. Persist through initial chaos.' },
  { number: 4, name: 'Youthful Folly', keyword: 'Inexperience seeking guidance. Remain open to learning.' },
  { number: 5, name: 'Waiting', keyword: 'Nourishment through patience. Trust in timing.' },
  { number: 6, name: 'Conflict', keyword: 'Opposition and tension. Seek mediation, avoid extremes.' },
  { number: 7, name: 'The Army', keyword: 'Organized discipline. Leadership through integrity.' },
  { number: 8, name: 'Holding Together', keyword: 'Union and alliance. Seek common ground.' },
  { number: 9, name: 'Small Taming', keyword: 'Gentle restraint. Small efforts accumulate.' },
  { number: 10, name: 'Treading', keyword: 'Careful conduct. Walk mindfully among dangers.' },
  { number: 11, name: 'Peace', keyword: 'Harmony of heaven and earth. Prosperity flows.' },
  { number: 12, name: 'Standstill', keyword: 'Stagnation and withdrawal. Conserve energy.' },
  { number: 13, name: 'Fellowship', keyword: 'Community and shared purpose. Unite with others.' },
  { number: 14, name: 'Great Possession', keyword: 'Abundance and success. Share generously.' },
  { number: 15, name: 'Modesty', keyword: 'Humble restraint brings good fortune. Stay grounded.' },
  { number: 16, name: 'Enthusiasm', keyword: 'Joyful movement. Inspire and be inspired.' },
  { number: 17, name: 'Following', keyword: 'Adaptation to circumstances. Know when to lead or follow.' },
  { number: 18, name: 'Work on the Decayed', keyword: 'Repair what has been spoiled. Restore order.' },
  { number: 19, name: 'Approach', keyword: 'Drawing near. Opportunity approaches.' },
  { number: 20, name: 'Contemplation', keyword: 'Observation and insight. Look deeply.' },
  { number: 21, name: 'Biting Through', keyword: 'Decisive action removes obstacles. Cut through.' },
  { number: 22, name: 'Grace', keyword: 'Beauty and form. Attend to appearances.' },
  { number: 23, name: 'Splitting Apart', keyword: 'Decay and dissolution. Accept endings.' },
  { number: 24, name: 'Return', keyword: 'The turning point. Light returns after darkness.' },
  { number: 25, name: 'Innocence', keyword: 'Natural spontaneity. Act without ulterior motives.' },
  { number: 26, name: 'Great Taming', keyword: 'Accumulated power. Build reserves.' },
  { number: 27, name: 'Nourishment', keyword: 'Proper sustenance. Mind what you consume.' },
  { number: 28, name: 'Great Excess', keyword: 'Extraordinary pressure. The ridgepole sags.' },
  { number: 29, name: 'The Abysmal', keyword: 'Repeated danger. Flow like water through obstacles.' },
  { number: 30, name: 'The Clinging', keyword: 'Radiance and clarity. Depend on what endures.' },
  { number: 31, name: 'Influence', keyword: 'Mutual attraction. Receptivity creates connection.' },
  { number: 32, name: 'Duration', keyword: 'Endurance and constancy. Maintain your course.' },
  { number: 33, name: 'Retreat', keyword: 'Strategic withdrawal. Preserve strength.' },
  { number: 34, name: 'Great Power', keyword: 'Strength advancing. Use power wisely.' },
  { number: 35, name: 'Progress', keyword: 'Advancement and recognition. The sun rises.' },
  { number: 36, name: 'Darkening of the Light', keyword: 'Intelligence hidden. Protect your inner light.' },
  { number: 37, name: 'The Family', keyword: 'Domestic order. Cultivate inner circles.' },
  { number: 38, name: 'Opposition', keyword: 'Estrangement and difference. Find unity in diversity.' },
  { number: 39, name: 'Obstruction', keyword: 'Difficulty ahead. Pause and gather strength.' },
  { number: 40, name: 'Deliverance', keyword: 'Release from tension. Liberation comes.' },
  { number: 41, name: 'Decrease', keyword: 'Sacrifice and simplification. Less becomes more.' },
  { number: 42, name: 'Increase', keyword: 'Gain and expansion. Favorable time to act.' },
  { number: 43, name: 'Breakthrough', keyword: 'Resoluteness. Proclaim truth clearly.' },
  { number: 44, name: 'Coming to Meet', keyword: 'Unexpected encounter. Be wary of temptation.' },
  { number: 45, name: 'Gathering Together', keyword: 'Assembly and congregation. Unite for purpose.' },
  { number: 46, name: 'Pushing Upward', keyword: 'Gradual ascent. Effort brings advancement.' },
  { number: 47, name: 'Oppression', keyword: 'Exhaustion and confinement. Endure with grace.' },
  { number: 48, name: 'The Well', keyword: 'Unchanging source. Draw from deep wisdom.' },
  { number: 49, name: 'Revolution', keyword: 'Radical change. Transform when the time is right.' },
  { number: 50, name: 'The Cauldron', keyword: 'Nourishing transformation. Refine and cultivate.' },
  { number: 51, name: 'The Arousing', keyword: 'Shock and thunder. Startling events bring awareness.' },
  { number: 52, name: 'Keeping Still', keyword: 'Meditation and rest. Find stillness within.' },
  { number: 53, name: 'Development', keyword: 'Gradual progress. Like a tree growing.' },
  { number: 54, name: 'The Marrying Maiden', keyword: 'Subordinate position. Accept limitations.' },
  { number: 55, name: 'Abundance', keyword: 'Fullness and peak. Appreciate the zenith.' },
  { number: 56, name: 'The Wanderer', keyword: 'Travel and transition. Move lightly.' },
  { number: 57, name: 'The Gentle', keyword: 'Penetrating influence. Gentle persistence.' },
  { number: 58, name: 'The Joyous', keyword: 'Joy and openness. Share gladness.' },
  { number: 59, name: 'Dispersion', keyword: 'Dissolution of barriers. Let go of rigidity.' },
  { number: 60, name: 'Limitation', keyword: 'Healthy boundaries. Know your limits.' },
  { number: 61, name: 'Inner Truth', keyword: 'Sincerity at the center. Trust your heart.' },
  { number: 62, name: 'Small Exceeding', keyword: 'Exceed in small matters. Attend to details.' },
  { number: 63, name: 'After Completion', keyword: 'Order achieved. Maintain vigilance.' },
  { number: 64, name: 'Before Completion', keyword: 'Almost there. Final effort needed.' }
]

// Binary to hexagram number mapping (bottom to top, 0=yin, 1=yang)
const BINARY_TO_HEXAGRAM = {
  '111111': 1, '000000': 2, '100010': 3, '010001': 4, '111010': 5, '010111': 6,
  '010000': 7, '000010': 8, '111011': 9, '110111': 10, '111000': 11, '000111': 12,
  '101111': 13, '111101': 14, '001000': 15, '000100': 16, '100110': 17, '011001': 18,
  '110000': 19, '000011': 20, '100101': 21, '101001': 22, '000001': 23, '100000': 24,
  '100111': 25, '111001': 26, '100001': 27, '011110': 28, '010010': 29, '101101': 30,
  '001110': 31, '011100': 32, '001111': 33, '111100': 34, '000101': 35, '101000': 36,
  '101011': 37, '110101': 38, '001010': 39, '010100': 40, '110001': 41, '100011': 42,
  '111110': 43, '011111': 44, '000110': 45, '011000': 46, '010110': 47, '011010': 48,
  '101110': 49, '011101': 50, '100100': 51, '001001': 52, '001011': 53, '110100': 54,
  '101100': 55, '001101': 56, '011011': 57, '110110': 58, '010011': 59, '110010': 60,
  '110011': 61, '001100': 62, '101010': 63, '010101': 64
}

function EsotericTools() {
  const [activeTab, setActiveTab] = useState('gematria')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')

  // Gematria state
  const [gematriaInput, setGematriaInput] = useState('')
  const [gematriaSystem, setGematriaSystem] = useState('hebrew')
  const [gematriaResult, setGematriaResult] = useState(null)

  // Tarot state
  const [tarotCard, setTarotCard] = useState(null)

  // I Ching state
  const [hexagram, setHexagram] = useState(null)
  const [lines, setLines] = useState([])
  const [changingLines, setChangingLines] = useState([])

  // Numerology state
  const [numInput, setNumInput] = useState('')
  const [numResult, setNumResult] = useState(null)

  // ============ SAVE TO JOURNAL ============
  async function saveToJournal(title, content) {
    setSaving(true)
    try {
      // Save to journal
      const today = getLocalDateString()
      await db.add('journal', {
        type: 'reflection',
        title,
        content,
        date: today,
        tags: ['esoteric-tools', 'divination']
      })

      // Log Integration Journaling as today's practice
      const todayLog = await queries.getTodayLog()

      if (todayLog) {
        if (!todayLog.practices?.includes('journaling')) {
          await db.update('dailyLogs', {
            ...todayLog,
            practices: [...(todayLog.practices || []), 'journaling']
          })
        }
      } else {
        await db.add('dailyLogs', {
          date: today,
          practices: ['journaling'],
          notes: ''
        })
      }

      setSaveSuccess('Saved to journal!')
      setTimeout(() => setSaveSuccess(''), 2000)
    } catch (error) {
      console.error('Error saving to journal:', error)
    } finally {
      setSaving(false)
    }
  }

  // ============ GEMATRIA ============
  function calculateGematria() {
    if (!gematriaInput.trim()) return

    const text = gematriaInput.toLowerCase().replace(/[^a-z]/g, '')
    let values
    switch (gematriaSystem) {
      case 'greek': values = GREEK_VALUES; break
      case 'english': values = ENGLISH_VALUES; break
      default: values = HEBREW_VALUES
    }

    let total = 0
    for (const char of text) {
      total += values[char] || 0
    }

    setGematriaResult({
      input: gematriaInput,
      system: gematriaSystem,
      value: total
    })
  }

  function saveGematria() {
    if (!gematriaResult) return
    const content = `Word/Phrase: "${gematriaResult.input}"\nSystem: ${gematriaResult.system.charAt(0).toUpperCase() + gematriaResult.system.slice(1)}\nNumerical Value: ${gematriaResult.value}`
    saveToJournal('Gematria Calculation', content)
  }

  // ============ TAROT ============
  function drawTarotCard() {
    const randomIndex = Math.floor(Math.random() * MAJOR_ARCANA.length)
    setTarotCard(MAJOR_ARCANA[randomIndex])
  }

  function saveTarot() {
    if (!tarotCard) return
    let content = `Card: ${tarotCard.number} - ${tarotCard.name}\nHebrew Letter: ${tarotCard.hebrew}`
    if (tarotCard.element) content += `\nElement: ${tarotCard.element}`
    if (tarotCard.astro) content += `\nAstrological: ${tarotCard.astro}`
    saveToJournal('Tarot Daily Draw', content)
  }

  // ============ I CHING ============
  function castHexagram() {
    const newLines = []
    const newChanging = []

    for (let i = 0; i < 6; i++) {
      // Simulate 3-coin toss (heads=3, tails=2)
      let total = 0
      for (let j = 0; j < 3; j++) {
        total += Math.random() < 0.5 ? 2 : 3
      }
      // 6 = old yin (changing), 7 = young yang, 8 = young yin, 9 = old yang (changing)
      const isYang = total === 7 || total === 9
      const isChanging = total === 6 || total === 9
      newLines.push(isYang ? 1 : 0)
      if (isChanging) newChanging.push(i)
    }

    const binary = newLines.join('')
    const hexNum = BINARY_TO_HEXAGRAM[binary] || 1
    const hexData = HEXAGRAMS.find(h => h.number === hexNum) || HEXAGRAMS[0]

    setLines(newLines)
    setChangingLines(newChanging)
    setHexagram(hexData)
  }

  function saveIChing() {
    if (!hexagram) return
    const lineDisplay = lines.map((l, i) => {
      const changing = changingLines.includes(i) ? ' (changing)' : ''
      return l === 1 ? `Line ${i + 1}: Yang ———${changing}` : `Line ${i + 1}: Yin — —${changing}`
    }).join('\n')
    const content = `Hexagram ${hexagram.number}: ${hexagram.name}\n\n${lineDisplay}\n\n${hexagram.keyword}`
    saveToJournal('I Ching Casting', content)
  }

  // ============ NUMEROLOGY ============
  function reduceNumber() {
    if (!numInput.trim()) return

    // Extract digits from input (handles dates, names converted to numbers, etc.)
    let digits = numInput.replace(/[^0-9]/g, '')
    if (!digits) {
      // If no numbers, convert letters to numbers (A=1, B=2, etc.)
      const letters = numInput.toLowerCase().replace(/[^a-z]/g, '')
      digits = letters.split('').map(c => ((c.charCodeAt(0) - 96) % 9) || 9).join('')
    }

    const steps = [digits]
    let current = digits

    while (current.length > 1) {
      const sum = current.split('').reduce((acc, d) => acc + parseInt(d, 10), 0)
      // Check for master numbers
      if (sum === 11 || sum === 22 || sum === 33) {
        steps.push(`${sum} (Master Number)`)
        setNumResult({ input: numInput, steps, final: sum, isMaster: true })
        return
      }
      current = sum.toString()
      steps.push(current)
    }

    setNumResult({ input: numInput, steps, final: parseInt(current, 10), isMaster: false })
  }

  function saveNumerology() {
    if (!numResult) return
    const process = numResult.steps.map((s, i) => {
      if (i === 0) return `Start: ${s}`
      if (i === numResult.steps.length - 1) return `Final: ${s}`
      return `Step ${i}: ${s}`
    }).join('\n')
    const content = `Input: "${numResult.input}"\n\nReduction Process:\n${process}\n\nResult: ${numResult.final}${numResult.isMaster ? ' (Master Number)' : ''}`
    saveToJournal('Numerology Reduction', content)
  }

  return (
    <div className="esoteric-tools">
      <div className="tools-tabs">
        <button
          className={`tools-tab ${activeTab === 'gematria' ? 'tools-tab--active' : ''}`}
          onClick={() => setActiveTab('gematria')}
        >
          Gematria
        </button>
        <button
          className={`tools-tab ${activeTab === 'tarot' ? 'tools-tab--active' : ''}`}
          onClick={() => setActiveTab('tarot')}
        >
          Tarot
        </button>
        <button
          className={`tools-tab ${activeTab === 'iching' ? 'tools-tab--active' : ''}`}
          onClick={() => setActiveTab('iching')}
        >
          I Ching
        </button>
        <button
          className={`tools-tab ${activeTab === 'numerology' ? 'tools-tab--active' : ''}`}
          onClick={() => setActiveTab('numerology')}
        >
          Numbers
        </button>
      </div>

      {saveSuccess && <div className="save-toast">{saveSuccess}</div>}

      {/* GEMATRIA */}
      {activeTab === 'gematria' && (
        <div className="tool-panel">
          <h2 className="tool-title">Gematria Calculator</h2>
          <div className="tool-form">
            <input
              type="text"
              className="input"
              placeholder="Enter word or phrase"
              value={gematriaInput}
              onChange={(e) => setGematriaInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && calculateGematria()}
            />
            <select
              className="input"
              value={gematriaSystem}
              onChange={(e) => setGematriaSystem(e.target.value)}
            >
              <option value="hebrew">Hebrew (ALW)</option>
              <option value="greek">Greek Isopsephy</option>
              <option value="english">English Ordinal</option>
            </select>
            <button className="btn btn-primary" onClick={calculateGematria}>
              Calculate
            </button>
          </div>

          {gematriaResult && (
            <div className="tool-result">
              <div className="result-main">{gematriaResult.value}</div>
              <div className="result-detail">
                "{gematriaResult.input}" in {gematriaResult.system}
              </div>
              <button
                className="btn btn-secondary save-btn"
                onClick={saveGematria}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save to Journal'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAROT */}
      {activeTab === 'tarot' && (
        <div className="tool-panel">
          <h2 className="tool-title">Tarot Daily Draw</h2>

          {!tarotCard ? (
            <button className="btn btn-primary draw-btn" onClick={drawTarotCard}>
              Draw Card
            </button>
          ) : (
            <div className="tool-result tarot-result">
              <div className="tarot-number">{tarotCard.number}</div>
              <div className="tarot-name">{tarotCard.name}</div>
              <div className="tarot-details">
                <div className="tarot-detail">
                  <span className="detail-label">Hebrew</span>
                  <span className="detail-value">{tarotCard.hebrew}</span>
                </div>
                {tarotCard.element && (
                  <div className="tarot-detail">
                    <span className="detail-label">Element</span>
                    <span className="detail-value">{tarotCard.element}</span>
                  </div>
                )}
                {tarotCard.astro && (
                  <div className="tarot-detail">
                    <span className="detail-label">Astrology</span>
                    <span className="detail-value">{tarotCard.astro}</span>
                  </div>
                )}
              </div>
              <div className="tarot-actions">
                <button className="btn btn-secondary" onClick={drawTarotCard}>
                  Draw Again
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saveTarot}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save to Journal'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* I CHING */}
      {activeTab === 'iching' && (
        <div className="tool-panel">
          <h2 className="tool-title">I Ching Hexagram</h2>

          {!hexagram ? (
            <button className="btn btn-primary draw-btn" onClick={castHexagram}>
              Cast Hexagram
            </button>
          ) : (
            <div className="tool-result iching-result">
              <div className="hexagram-visual">
                {[...lines].reverse().map((line, i) => {
                  const lineIndex = 5 - i
                  const isChanging = changingLines.includes(lineIndex)
                  return (
                    <div
                      key={i}
                      className={`hexagram-line ${line === 1 ? 'yang' : 'yin'} ${isChanging ? 'changing' : ''}`}
                    >
                      {line === 1 ? (
                        <div className="line-solid"></div>
                      ) : (
                        <>
                          <div className="line-broken"></div>
                          <div className="line-gap"></div>
                          <div className="line-broken"></div>
                        </>
                      )}
                      {isChanging && <span className="changing-marker">*</span>}
                    </div>
                  )
                })}
              </div>
              <div className="hexagram-number">{hexagram.number}</div>
              <div className="hexagram-name">{hexagram.name}</div>
              <p className="hexagram-keyword">{hexagram.keyword}</p>
              {changingLines.length > 0 && (
                <div className="changing-note">
                  Changing lines: {changingLines.map(l => l + 1).join(', ')}
                </div>
              )}
              <div className="iching-actions">
                <button className="btn btn-secondary" onClick={castHexagram}>
                  Cast Again
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saveIChing}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save to Journal'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* NUMEROLOGY */}
      {activeTab === 'numerology' && (
        <div className="tool-panel">
          <h2 className="tool-title">Numerology Reducer</h2>
          <div className="tool-form">
            <input
              type="text"
              className="input"
              placeholder="Enter number, date, or name"
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && reduceNumber()}
            />
            <button className="btn btn-primary" onClick={reduceNumber}>
              Reduce
            </button>
          </div>

          {numResult && (
            <div className="tool-result numerology-result">
              <div className="reduction-steps">
                {numResult.steps.map((step, i) => (
                  <span key={i} className="reduction-step">
                    {step}
                    {i < numResult.steps.length - 1 && <span className="reduction-arrow">→</span>}
                  </span>
                ))}
              </div>
              <div className={`result-main ${numResult.isMaster ? 'master-number' : ''}`}>
                {numResult.final}
              </div>
              {numResult.isMaster && (
                <div className="master-badge">Master Number</div>
              )}
              <button
                className="btn btn-secondary save-btn"
                onClick={saveNumerology}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save to Journal'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EsotericTools
