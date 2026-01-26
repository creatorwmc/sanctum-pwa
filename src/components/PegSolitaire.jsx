import { useState, useEffect } from 'react'
import './PegSolitaire.css'

const PEG_SCORES_KEY = 'sanctum-peg-scores'

function getStoredScores() {
  try {
    const saved = localStorage.getItem(PEG_SCORES_KEY)
    return saved ? JSON.parse(saved) : { bestScore: null, gamesPlayed: 0, genius: 0 }
  } catch {
    return { bestScore: null, gamesPlayed: 0, genius: 0 }
  }
}

// Triangle board positions (15 holes in 5 rows)
// Row 0:         0
// Row 1:       1   2
// Row 2:      3   4   5
// Row 3:    6   7   8   9
// Row 4:  10  11  12  13  14

const BOARD_LAYOUT = [
  [0],
  [1, 2],
  [3, 4, 5],
  [6, 7, 8, 9],
  [10, 11, 12, 13, 14]
]

// All possible jumps: [from, over, to]
const POSSIBLE_JUMPS = [
  // Horizontal jumps
  [0, 1, 3], [3, 1, 0],
  [1, 3, 6], [6, 3, 1],
  [2, 4, 7], [7, 4, 2],
  [3, 4, 5], [5, 4, 3],
  [6, 7, 8], [8, 7, 6],
  [7, 8, 9], [9, 8, 7],
  [10, 11, 12], [12, 11, 10],
  [11, 12, 13], [13, 12, 11],
  [12, 13, 14], [14, 13, 12],
  // Right diagonal jumps
  [0, 2, 5], [5, 2, 0],
  [1, 4, 8], [8, 4, 1],
  [2, 5, 9], [9, 5, 2],
  [3, 7, 12], [12, 7, 3],
  [4, 8, 13], [13, 8, 4],
  [5, 9, 14], [14, 9, 5],
  // Left diagonal jumps
  [0, 1, 3], [3, 1, 0],  // Already covered
  [1, 3, 6], [6, 3, 1],  // Already covered
  [2, 4, 7], [7, 4, 2],  // Already covered
  [3, 6, 10], [10, 6, 3],
  [4, 7, 11], [11, 7, 4],
  [5, 8, 12], [12, 8, 5],
]

// Remove duplicates from jumps
const UNIQUE_JUMPS = POSSIBLE_JUMPS.filter((jump, index, self) =>
  index === self.findIndex(j =>
    j[0] === jump[0] && j[1] === jump[1] && j[2] === jump[2]
  )
)

function getScoreRating(pegsLeft) {
  if (pegsLeft === 1) return { rating: 'Genius', emoji: '🌟' }
  if (pegsLeft === 2) return { rating: 'Very Smart', emoji: '✨' }
  if (pegsLeft === 3) return { rating: 'Smart', emoji: '💫' }
  if (pegsLeft === 4) return { rating: 'Not Bad', emoji: '👍' }
  return { rating: 'Try Again', emoji: '🔄' }
}

function PegSolitaire({ isOpen, onClose }) {
  const [board, setBoard] = useState(Array(15).fill(true))
  const [selectedPeg, setSelectedPeg] = useState(null)
  const [validMoves, setValidMoves] = useState([])
  const [moveCount, setMoveCount] = useState(0)
  const [history, setHistory] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [selectingStart, setSelectingStart] = useState(true)
  const [scores, setScores] = useState(getStoredScores)

  // Get valid jumps from a position
  function getValidJumpsFrom(pos, currentBoard) {
    return UNIQUE_JUMPS.filter(([from, over, to]) =>
      from === pos &&
      currentBoard[from] &&
      currentBoard[over] &&
      !currentBoard[to]
    )
  }

  // Get all valid jumps for current board
  function getAllValidJumps(currentBoard) {
    return UNIQUE_JUMPS.filter(([from, over, to]) =>
      currentBoard[from] &&
      currentBoard[over] &&
      !currentBoard[to]
    )
  }

  // Select starting empty hole
  function selectStartingHole(pos) {
    const newBoard = Array(15).fill(true)
    newBoard[pos] = false
    setBoard(newBoard)
    setSelectingStart(false)
    setHistory([newBoard])
    setMoveCount(0)
    setGameOver(false)
    setSelectedPeg(null)
  }

  // Handle peg click
  function handlePegClick(pos) {
    if (selectingStart) {
      selectStartingHole(pos)
      return
    }

    if (gameOver) return

    // If clicking on a peg
    if (board[pos]) {
      const jumps = getValidJumpsFrom(pos, board)
      if (jumps.length > 0) {
        setSelectedPeg(pos)
        setValidMoves(jumps.map(j => j[2]))
      } else {
        setSelectedPeg(null)
        setValidMoves([])
      }
    }
    // If clicking on empty hole (valid move target)
    else if (selectedPeg !== null && validMoves.includes(pos)) {
      executeJump(selectedPeg, pos)
    }
    // Clicking elsewhere
    else {
      setSelectedPeg(null)
      setValidMoves([])
    }
  }

  // Execute a jump
  function executeJump(from, to) {
    // Find the jump
    const jump = UNIQUE_JUMPS.find(([f, , t]) => f === from && t === to)
    if (!jump) return

    const [, over] = jump
    const newBoard = [...board]
    newBoard[from] = false
    newBoard[over] = false
    newBoard[to] = true

    setBoard(newBoard)
    setHistory(prev => [...prev, newBoard])
    setMoveCount(prev => prev + 1)
    setSelectedPeg(null)
    setValidMoves([])

    // Check if game is over
    const remainingJumps = getAllValidJumps(newBoard)
    if (remainingJumps.length === 0) {
      setGameOver(true)
      const pegsLeft = newBoard.filter(p => p).length
      updateScores(pegsLeft)
    }
  }

  // Undo last move
  function undoMove() {
    if (history.length <= 1) return
    const newHistory = history.slice(0, -1)
    setBoard(newHistory[newHistory.length - 1])
    setHistory(newHistory)
    setMoveCount(prev => prev - 1)
    setGameOver(false)
    setSelectedPeg(null)
    setValidMoves([])
  }

  // Reset game
  function resetGame() {
    setBoard(Array(15).fill(true))
    setSelectedPeg(null)
    setValidMoves([])
    setMoveCount(0)
    setHistory([])
    setGameOver(false)
    setSelectingStart(true)
  }

  // Update scores
  function updateScores(pegsLeft) {
    setScores(prev => {
      const newScores = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1
      }
      if (prev.bestScore === null || pegsLeft < prev.bestScore) {
        newScores.bestScore = pegsLeft
      }
      if (pegsLeft === 1) {
        newScores.genius = prev.genius + 1
      }
      localStorage.setItem(PEG_SCORES_KEY, JSON.stringify(newScores))
      return newScores
    })
  }

  // Reset scores
  function resetScores() {
    const newScores = { bestScore: null, gamesPlayed: 0, genius: 0 }
    setScores(newScores)
    localStorage.setItem(PEG_SCORES_KEY, JSON.stringify(newScores))
  }

  // Calculate pegs remaining
  const pegsRemaining = board.filter(p => p).length
  const { rating, emoji } = gameOver ? getScoreRating(pegsRemaining) : { rating: '', emoji: '' }

  // Highlight positions that have valid moves available
  const hasValidMoveFrom = (pos) => {
    if (!board[pos]) return false
    return getValidJumpsFrom(pos, board).length > 0
  }

  if (!isOpen) return null

  return (
    <div className="peg-overlay" onClick={onClose}>
      <div className="peg-modal" onClick={e => e.stopPropagation()}>
        <button className="peg-close" onClick={onClose}>×</button>

        <div className="peg-header">
          <h2>Peg Solitaire</h2>
          {selectingStart ? (
            <p className="peg-instruction">Select the starting empty hole</p>
          ) : (
            <div className="peg-stats">
              <span>Moves: {moveCount}</span>
              <span>Pegs: {pegsRemaining}</span>
            </div>
          )}
        </div>

        {scores.bestScore !== null && !selectingStart && (
          <div className="peg-best">
            Best: {scores.bestScore} peg{scores.bestScore !== 1 ? 's' : ''} remaining
            {scores.genius > 0 && ` • Genius: ${scores.genius}x`}
          </div>
        )}

        <div className="peg-board">
          {BOARD_LAYOUT.map((row, rowIdx) => (
            <div key={rowIdx} className="peg-row">
              {row.map(pos => (
                <button
                  key={pos}
                  className={`peg-hole
                    ${board[pos] ? 'peg-hole--filled' : 'peg-hole--empty'}
                    ${selectedPeg === pos ? 'peg-hole--selected' : ''}
                    ${validMoves.includes(pos) ? 'peg-hole--valid-target' : ''}
                    ${!selectingStart && !gameOver && board[pos] && hasValidMoveFrom(pos) ? 'peg-hole--has-moves' : ''}
                    ${selectingStart ? 'peg-hole--selectable' : ''}
                  `}
                  onClick={() => handlePegClick(pos)}
                  disabled={gameOver && !selectingStart}
                >
                  {board[pos] && <span className="peg">●</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        {gameOver && (
          <div className={`peg-result ${pegsRemaining === 1 ? 'peg-result--genius' : ''}`}>
            <span className="result-emoji">{emoji}</span>
            <p className="result-rating">{rating}!</p>
            <p className="result-detail">{pegsRemaining} peg{pegsRemaining !== 1 ? 's' : ''} remaining</p>
          </div>
        )}

        {!selectingStart && (
          <div className="peg-actions">
            <button
              className="btn btn-secondary"
              onClick={undoMove}
              disabled={history.length <= 1}
            >
              Undo
            </button>
            <button className="btn btn-primary" onClick={resetGame}>
              {gameOver ? 'Play Again' : 'Reset'}
            </button>
          </div>
        )}

        {(scores.gamesPlayed > 0) && (
          <button className="peg-reset-scores" onClick={resetScores}>
            Reset Scores
          </button>
        )}
      </div>
    </div>
  )
}

export default PegSolitaire
