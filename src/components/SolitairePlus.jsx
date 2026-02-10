import { useState } from 'react';
import Solitaire from './Solitaire';
import SpiderSolitaire from './SpiderSolitaire';
import './SolitairePlus.css';

function SolitairePlus({ isOpen, onClose }) {
  const [gameType, setGameType] = useState(null); // null = menu, 'klondike', 'spider'

  function handleBack() {
    setGameType(null);
  }

  function handleClose() {
    setGameType(null);
    onClose();
  }

  function handleSwitchGame(newGameType) {
    setGameType(newGameType === 'klondike' ? 'klondike' : 'spider');
  }

  if (!isOpen) return null;

  // Show game selection menu
  if (gameType === null) {
    return (
      <div className="solitaire-plus-overlay" onClick={handleClose}>
        <div className="solitaire-plus-menu" onClick={e => e.stopPropagation()}>
          <button className="solitaire-plus-close" onClick={handleClose}>×</button>
          <h2 className="solitaire-plus-title">Solitaire</h2>
          <p className="solitaire-plus-subtitle">Choose your game</p>

          <div className="solitaire-plus-options">
            <button
              className="solitaire-plus-option"
              onClick={() => setGameType('klondike')}
            >
              <div className="solitaire-option-icon klondike-icon">
                <span className="card-stack">🂡</span>
              </div>
              <div className="solitaire-option-info">
                <h3>Klondike</h3>
                <p>Classic solitaire with tableau and foundations</p>
              </div>
            </button>

            <button
              className="solitaire-plus-option"
              onClick={() => setGameType('spider')}
            >
              <div className="solitaire-option-icon spider-icon">
                <span className="spider-cards">🕷️</span>
              </div>
              <div className="solitaire-option-info">
                <h3>Spider</h3>
                <p>Build sequences of same-suit cards</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the selected game
  return (
    <div className="solitaire-plus-game-wrapper">
      <button className="solitaire-plus-back" onClick={handleBack}>
        ← Back
      </button>
      {gameType === 'klondike' && (
        <Solitaire onSwitchGame={handleSwitchGame} />
      )}
      {gameType === 'spider' && (
        <SpiderSolitaire onSwitchGame={handleSwitchGame} />
      )}
    </div>
  );
}

export default SolitairePlus;
