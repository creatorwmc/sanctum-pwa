import { useState } from 'react'
import PuzzleGame from '../components/PuzzleGame'
import TicTacToe from '../components/TicTacToe'
import OracleGame from '../components/OracleGame'
import PegSolitaire from '../components/PegSolitaire'
import './Play.css'

function Play() {
  const [activeGame, setActiveGame] = useState(null)

  function closeGame() {
    setActiveGame(null)
  }

  return (
    <div className="play-page">
      <div className="play-header">
        <p className="play-subtitle">Take a mindful break</p>
      </div>

      <div className="games-list">
        <button
          className="game-card"
          onClick={() => setActiveGame('puzzle')}
        >
          <span className="game-icon">✧</span>
          <div className="game-info">
            <h3>Mindful Puzzle</h3>
            <p>A meditative sliding puzzle to calm the mind</p>
          </div>
          <span className="game-arrow">→</span>
        </button>

        <button
          className="game-card"
          onClick={() => setActiveGame('tictactoe')}
        >
          <span className="game-icon">⊞</span>
          <div className="game-info">
            <h3>Tic Tac Toe</h3>
            <p>Classic game of strategy and patience</p>
          </div>
          <span className="game-arrow">→</span>
        </button>

        <button
          className="game-card"
          onClick={() => setActiveGame('oracle')}
        >
          <span className="game-icon">🔮</span>
          <div className="game-info">
            <h3>Oracle's Game</h3>
            <p>An ancient game of strategy and wisdom</p>
          </div>
          <span className="game-arrow">→</span>
        </button>

        <button
          className="game-card"
          onClick={() => setActiveGame('peg')}
        >
          <span className="game-icon">◆</span>
          <div className="game-info">
            <h3>Peg Solitaire</h3>
            <p>Jump pegs until only one remains</p>
          </div>
          <span className="game-arrow">→</span>
        </button>
      </div>

      {activeGame === 'puzzle' && (
        <PuzzleGame isOpen={true} onClose={closeGame} />
      )}

      {activeGame === 'tictactoe' && (
        <TicTacToe isOpen={true} onClose={closeGame} />
      )}

      {activeGame === 'oracle' && (
        <OracleGame isOpen={true} onClose={closeGame} />
      )}

      {activeGame === 'peg' && (
        <PegSolitaire isOpen={true} onClose={closeGame} />
      )}
    </div>
  )
}

export default Play
