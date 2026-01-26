import { useState, useEffect } from 'react'
import './TicTacToe.css'

const TTT_SCORES_KEY = 'sanctum-ttt-scores'

function getStoredScores() {
  try {
    const saved = localStorage.getItem(TTT_SCORES_KEY)
    return saved ? JSON.parse(saved) : { x: 0, o: 0, ties: 0, xStreak: 0, bestStreak: 0 }
  } catch {
    return { x: 0, o: 0, ties: 0, xStreak: 0, bestStreak: 0 }
  }
}

function TicTacToe({ isOpen, onClose }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState(null)
  const [scores, setScores] = useState(getStoredScores)
  const [gameMode, setGameMode] = useState('ai') // 'ai' or 'local'

  const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6] // diagonals
  ]

  function checkWinner(squares) {
    for (const [a, b, c] of WINNING_LINES) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] }
      }
    }
    return null
  }

  function isBoardFull(squares) {
    return squares.every(cell => cell !== null)
  }

  function handleClick(index) {
    if (board[index] || winner) return
    if (gameMode === 'ai' && !isXNext) return // Don't allow clicks during AI turn

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)

    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)
      updateScores(result.winner)
    } else if (isBoardFull(newBoard)) {
      setWinner('tie')
      updateScores('tie')
    } else {
      setIsXNext(!isXNext)
    }
  }

  function updateScores(result) {
    setScores(prev => {
      const newScores = { ...prev }
      if (result === 'tie') {
        newScores.ties = prev.ties + 1
        newScores.xStreak = 0
      } else if (result === 'X') {
        newScores.x = prev.x + 1
        newScores.xStreak = prev.xStreak + 1
        if (newScores.xStreak > prev.bestStreak) {
          newScores.bestStreak = newScores.xStreak
        }
      } else {
        newScores.o = prev.o + 1
        newScores.xStreak = 0
      }
      localStorage.setItem(TTT_SCORES_KEY, JSON.stringify(newScores))
      return newScores
    })
  }

  // AI Move
  useEffect(() => {
    if (gameMode === 'ai' && !isXNext && !winner) {
      const timer = setTimeout(() => {
        makeAIMove()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isXNext, winner, gameMode])

  function makeAIMove() {
    const availableMoves = board
      .map((cell, idx) => cell === null ? idx : null)
      .filter(idx => idx !== null)

    if (availableMoves.length === 0) return

    // Simple AI: Try to win, then block, then random
    let move = findWinningMove(board, 'O') // Try to win
    if (move === null) move = findWinningMove(board, 'X') // Block player
    if (move === null) {
      // Prefer center, then corners, then edges
      const preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7]
      move = preferred.find(idx => availableMoves.includes(idx))
    }

    if (move !== null) {
      const newBoard = [...board]
      newBoard[move] = 'O'
      setBoard(newBoard)

      const result = checkWinner(newBoard)
      if (result) {
        setWinner(result.winner)
        setWinningLine(result.line)
        updateScores(result.winner)
      } else if (isBoardFull(newBoard)) {
        setWinner('tie')
        updateScores('tie')
      } else {
        setIsXNext(true)
      }
    }
  }

  function findWinningMove(squares, player) {
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        const test = [...squares]
        test[i] = player
        if (checkWinner(test)) return i
      }
    }
    return null
  }

  function resetGame() {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setWinningLine(null)
  }

  function resetScores() {
    const newScores = { x: 0, o: 0, ties: 0, xStreak: 0, bestStreak: 0 }
    setScores(newScores)
    localStorage.setItem(TTT_SCORES_KEY, JSON.stringify(newScores))
    resetGame()
  }

  function toggleGameMode() {
    setGameMode(prev => prev === 'ai' ? 'local' : 'ai')
    resetGame()
  }

  if (!isOpen) return null

  const status = winner
    ? winner === 'tie'
      ? "It's a tie!"
      : `${winner} wins!`
    : `${isXNext ? 'X' : 'O'}'s turn${gameMode === 'ai' && !isXNext ? ' (thinking...)' : ''}`

  return (
    <div className="ttt-overlay" onClick={onClose}>
      <div className="ttt-modal" onClick={e => e.stopPropagation()}>
        <button className="ttt-close" onClick={onClose} aria-label="Close">×</button>

        <div className="ttt-header">
          <h2>Tic Tac Toe</h2>
          <button className="ttt-mode-toggle" onClick={toggleGameMode}>
            {gameMode === 'ai' ? '🤖 vs AI' : '👥 2 Players'}
          </button>
        </div>

        <div className="ttt-scores">
          <div className="ttt-score">
            <span className="ttt-score-label">X</span>
            <span className="ttt-score-value">{scores.x}</span>
          </div>
          <div className="ttt-score ttt-score--ties">
            <span className="ttt-score-label">Ties</span>
            <span className="ttt-score-value">{scores.ties}</span>
          </div>
          <div className="ttt-score">
            <span className="ttt-score-label">O</span>
            <span className="ttt-score-value">{scores.o}</span>
          </div>
        </div>
        {scores.bestStreak > 0 && (
          <div className="ttt-best-streak">
            Best X Streak: {scores.bestStreak} {scores.xStreak > 0 && `(Current: ${scores.xStreak})`}
          </div>
        )}

        <div className={`ttt-status ${winner ? 'ttt-status--winner' : ''}`}>
          {status}
        </div>

        <div className="ttt-board">
          {board.map((cell, idx) => (
            <button
              key={idx}
              className={`ttt-cell ${cell ? 'ttt-cell--filled' : ''} ${winningLine?.includes(idx) ? 'ttt-cell--winner' : ''}`}
              onClick={() => handleClick(idx)}
              disabled={!!cell || !!winner || (gameMode === 'ai' && !isXNext)}
            >
              {cell && <span className={`ttt-mark ttt-mark--${cell.toLowerCase()}`}>{cell}</span>}
            </button>
          ))}
        </div>

        <div className="ttt-actions">
          <button className="btn btn-primary" onClick={resetGame}>
            New Game
          </button>
          <button className="btn btn-secondary" onClick={resetScores}>
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  )
}

export default TicTacToe
