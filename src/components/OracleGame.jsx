import { useState, useEffect } from 'react'
import './OracleGame.css'

const ORACLE_SCORES_KEY = 'sanctum-oracle-scores'

function getStoredScores() {
  try {
    const saved = localStorage.getItem(ORACLE_SCORES_KEY)
    return saved ? JSON.parse(saved) : { wins: 0, losses: 0, streak: 0, bestStreak: 0 }
  } catch {
    return { wins: 0, losses: 0, streak: 0, bestStreak: 0 }
  }
}

const AI_MODES = {
  master: {
    name: 'Master Oracle',
    description: 'Plays perfectly. Can you find the winning strategy?',
    icon: '🔮'
  },
  playful: {
    name: 'Playful Oracle',
    description: 'Makes random moves. Good for learning.',
    icon: '✨'
  },
  patient: {
    name: 'Patient Oracle',
    description: 'Subtly guides you toward discovery.',
    icon: '🌙'
  }
}

function OracleGame({ isOpen, onClose }) {
  // Game settings
  const [startingObjects, setStartingObjects] = useState(15)
  const [maxPerTurn, setMaxPerTurn] = useState(3)
  const [takeLastWins, setTakeLastWins] = useState(true)
  const [playerFirst, setPlayerFirst] = useState(true)
  const [aiMode, setAiMode] = useState('patient')

  // Game state
  const [objects, setObjects] = useState(15)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [playerWon, setPlayerWon] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(1)
  const [lastMove, setLastMove] = useState(null)
  const [showSettings, setShowSettings] = useState(true)
  const [scores, setScores] = useState(getStoredScores)
  const [hint, setHint] = useState('')
  const [moveHistory, setMoveHistory] = useState([])

  // Initialize game
  function startGame() {
    setObjects(startingObjects)
    setIsPlayerTurn(playerFirst)
    setGameOver(false)
    setPlayerWon(false)
    setSelectedAmount(1)
    setLastMove(null)
    setShowSettings(false)
    setHint('')
    setMoveHistory([])
  }

  // Calculate optimal move (Nim strategy)
  function getOptimalMove(current, max, lastWins) {
    // In Nim, you want to leave opponent with (max+1)*k objects
    // If take-last-wins, leave them at (max+1)*k
    // If take-last-loses, leave them at (max+1)*k + 1
    const target = lastWins ? 0 : 1
    const mod = current % (max + 1)

    if (lastWins) {
      // We want to leave opponent at a multiple of (max+1)
      if (mod === 0) return null // Losing position, take minimum
      return mod
    } else {
      // We want to leave opponent at (multiple of max+1) + 1
      const adjustedMod = (current - 1) % (max + 1)
      if (adjustedMod === 0) return null // Losing position
      return adjustedMod
    }
  }

  // AI move logic
  function getAIMove() {
    const optimal = getOptimalMove(objects, maxPerTurn, takeLastWins)

    switch (aiMode) {
      case 'master':
        // Always play optimally
        if (optimal !== null && optimal <= maxPerTurn && optimal > 0) {
          return optimal
        }
        return 1 // Take minimum if in losing position

      case 'playful':
        // Random move
        return Math.floor(Math.random() * Math.min(maxPerTurn, objects)) + 1

      case 'patient':
        // Play optimally 60% of the time, otherwise make a subtle mistake
        if (Math.random() < 0.6 && optimal !== null && optimal <= maxPerTurn && optimal > 0) {
          return optimal
        }
        // Make a "reasonable" but not optimal move
        const maxTake = Math.min(maxPerTurn, objects)
        if (maxTake === 1) return 1
        // Avoid taking all if that would be a clear mistake
        if (objects <= maxPerTurn) {
          return takeLastWins ? 1 : objects // Subtle mistake
        }
        return Math.floor(Math.random() * (maxTake - 1)) + 1

      default:
        return 1
    }
  }

  // Handle player move
  function handlePlayerMove() {
    if (!isPlayerTurn || gameOver) return

    const amount = Math.min(selectedAmount, objects)
    const remaining = objects - amount

    setObjects(remaining)
    setLastMove({ player: 'You', amount })
    setMoveHistory(prev => [...prev, { player: 'You', amount, remaining }])

    if (remaining === 0) {
      const won = takeLastWins
      setGameOver(true)
      setPlayerWon(won)
      updateScores(won)
      generateHint(won)
    } else {
      setIsPlayerTurn(false)
      setSelectedAmount(1)
    }
  }

  // AI turn
  useEffect(() => {
    if (!isPlayerTurn && !gameOver && !showSettings) {
      const timer = setTimeout(() => {
        const aiAmount = getAIMove()
        const remaining = objects - aiAmount

        setObjects(remaining)
        setLastMove({ player: 'Oracle', amount: aiAmount })
        setMoveHistory(prev => [...prev, { player: 'Oracle', amount: aiAmount, remaining }])

        if (remaining === 0) {
          const won = !takeLastWins
          setGameOver(true)
          setPlayerWon(won)
          updateScores(won)
          generateHint(won)
        } else {
          setIsPlayerTurn(true)
        }
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, gameOver, showSettings, objects])

  function updateScores(won) {
    setScores(prev => {
      const newScores = { ...prev }
      if (won) {
        newScores.wins = prev.wins + 1
        newScores.streak = prev.streak + 1
        if (newScores.streak > prev.bestStreak) {
          newScores.bestStreak = newScores.streak
        }
      } else {
        newScores.losses = prev.losses + 1
        newScores.streak = 0
      }
      localStorage.setItem(ORACLE_SCORES_KEY, JSON.stringify(newScores))
      return newScores
    })
  }

  function generateHint(won) {
    const hints = {
      win: [
        'You have discovered the pattern. The key lies in the rhythm of numbers.',
        'Well played. True mastery comes from understanding why, not just how.',
        'Victory reveals itself to those who see the structure beneath the surface.'
      ],
      loss: [
        `Consider this: what if you could always leave the Oracle with a specific number?`,
        `Hint: Try to leave your opponent with a multiple of ${maxPerTurn + 1} objects.`,
        `The secret lies in ${maxPerTurn + 1}. Think about why this number matters.`
      ]
    }

    const category = won ? 'win' : 'loss'
    setHint(hints[category][Math.floor(Math.random() * hints[category].length)])
  }

  function resetScores() {
    const newScores = { wins: 0, losses: 0, streak: 0, bestStreak: 0 }
    setScores(newScores)
    localStorage.setItem(ORACLE_SCORES_KEY, JSON.stringify(newScores))
  }

  if (!isOpen) return null

  return (
    <div className="oracle-overlay" onClick={onClose}>
      <div className="oracle-modal" onClick={e => e.stopPropagation()}>
        <button className="oracle-close" onClick={onClose}>×</button>

        {showSettings ? (
          <div className="oracle-settings">
            <h2>The Oracle's Game</h2>
            <p className="oracle-intro">
              An ancient game of strategy. Take turns removing objects.
              {takeLastWins ? ' The one who takes the last object wins.' : ' The one who takes the last object loses.'}
            </p>

            <div className="oracle-setting">
              <label>Starting Objects</label>
              <div className="setting-slider">
                <input
                  type="range"
                  min="10"
                  max="30"
                  value={startingObjects}
                  onChange={e => setStartingObjects(Number(e.target.value))}
                />
                <span>{startingObjects}</span>
              </div>
            </div>

            <div className="oracle-setting">
              <label>Max Per Turn</label>
              <div className="setting-slider">
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={maxPerTurn}
                  onChange={e => setMaxPerTurn(Number(e.target.value))}
                />
                <span>{maxPerTurn}</span>
              </div>
            </div>

            <div className="oracle-setting">
              <label>Win Condition</label>
              <div className="setting-toggle">
                <button
                  className={takeLastWins ? 'active' : ''}
                  onClick={() => setTakeLastWins(true)}
                >
                  Take Last Wins
                </button>
                <button
                  className={!takeLastWins ? 'active' : ''}
                  onClick={() => setTakeLastWins(false)}
                >
                  Take Last Loses
                </button>
              </div>
            </div>

            <div className="oracle-setting">
              <label>Who Goes First</label>
              <div className="setting-toggle">
                <button
                  className={playerFirst ? 'active' : ''}
                  onClick={() => setPlayerFirst(true)}
                >
                  You
                </button>
                <button
                  className={!playerFirst ? 'active' : ''}
                  onClick={() => setPlayerFirst(false)}
                >
                  Oracle
                </button>
              </div>
            </div>

            <div className="oracle-setting">
              <label>Oracle Difficulty</label>
              <div className="ai-modes">
                {Object.entries(AI_MODES).map(([key, mode]) => (
                  <button
                    key={key}
                    className={`ai-mode ${aiMode === key ? 'active' : ''}`}
                    onClick={() => setAiMode(key)}
                  >
                    <span className="ai-icon">{mode.icon}</span>
                    <span className="ai-name">{mode.name}</span>
                    <span className="ai-desc">{mode.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {(scores.wins > 0 || scores.losses > 0) && (
              <div className="oracle-record">
                <span>Record: {scores.wins}W - {scores.losses}L</span>
                {scores.bestStreak > 0 && <span>Best Streak: {scores.bestStreak}</span>}
              </div>
            )}

            <button className="oracle-start" onClick={startGame}>
              Begin the Game
            </button>

            {(scores.wins > 0 || scores.losses > 0) && (
              <button className="oracle-reset-scores" onClick={resetScores}>
                Reset Scores
              </button>
            )}
          </div>
        ) : (
          <div className="oracle-game">
            <div className="oracle-header">
              <h2>The Oracle's Game</h2>
              <div className="oracle-info">
                <span className="oracle-remaining">{objects} remaining</span>
                <span className="oracle-rules">Take 1-{maxPerTurn} • {takeLastWins ? 'Last wins' : 'Last loses'}</span>
              </div>
            </div>

            <div className="oracle-objects">
              {Array(objects).fill(0).map((_, i) => (
                <span key={i} className="oracle-object">◆</span>
              ))}
            </div>

            {lastMove && !gameOver && (
              <div className="oracle-last-move">
                {lastMove.player} took {lastMove.amount}
              </div>
            )}

            {gameOver ? (
              <div className={`oracle-result ${playerWon ? 'oracle-result--win' : 'oracle-result--loss'}`}>
                <p className="result-text">{playerWon ? 'You have won!' : 'The Oracle prevails.'}</p>
                {hint && <p className="result-hint">{hint}</p>}
                <div className="result-actions">
                  <button className="btn btn-primary" onClick={startGame}>
                    Play Again
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowSettings(true)}>
                    Settings
                  </button>
                </div>
              </div>
            ) : (
              <div className="oracle-controls">
                {isPlayerTurn ? (
                  <>
                    <div className="oracle-select">
                      <label>Take:</label>
                      <div className="amount-buttons">
                        {Array(Math.min(maxPerTurn, objects)).fill(0).map((_, i) => (
                          <button
                            key={i + 1}
                            className={`amount-btn ${selectedAmount === i + 1 ? 'active' : ''}`}
                            onClick={() => setSelectedAmount(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="oracle-take" onClick={handlePlayerMove}>
                      Take {selectedAmount}
                    </button>
                  </>
                ) : (
                  <div className="oracle-thinking">
                    The Oracle contemplates...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OracleGame
