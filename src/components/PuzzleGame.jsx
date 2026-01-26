import { useState, useEffect, useCallback } from 'react'
import './PuzzleGame.css'

// Generate lighthouse image
function generateLighthouseImage(size) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const centerX = size / 2

  // Night sky background
  const skyGradient = ctx.createLinearGradient(0, 0, 0, size)
  skyGradient.addColorStop(0, '#1a2535')
  skyGradient.addColorStop(0.6, '#2d3a4a')
  skyGradient.addColorStop(1, '#3a4555')
  ctx.fillStyle = skyGradient
  ctx.fillRect(0, 0, size, size)

  // Stars
  ctx.fillStyle = '#ffffff'
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * size
    const y = Math.random() * size * 0.5
    const starSize = Math.random() * 1.5 + 0.5
    ctx.beginPath()
    ctx.arc(x, y, starSize, 0, Math.PI * 2)
    ctx.fill()
  }

  // Light beam glow
  const beamGlow = ctx.createRadialGradient(centerX, size * 0.22, 0, centerX, size * 0.22, size * 0.5)
  beamGlow.addColorStop(0, 'rgba(255, 240, 150, 0.6)')
  beamGlow.addColorStop(0.3, 'rgba(255, 220, 100, 0.3)')
  beamGlow.addColorStop(0.6, 'rgba(255, 200, 50, 0.1)')
  beamGlow.addColorStop(1, 'rgba(255, 200, 50, 0)')
  ctx.fillStyle = beamGlow
  ctx.fillRect(0, 0, size, size * 0.6)

  // Water/ocean at bottom
  const waterGradient = ctx.createLinearGradient(0, size * 0.85, 0, size)
  waterGradient.addColorStop(0, '#2a3a4a')
  waterGradient.addColorStop(1, '#1a2a3a')
  ctx.fillStyle = waterGradient
  ctx.fillRect(0, size * 0.85, size, size * 0.15)

  // Water waves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(0, size * 0.88 + i * 12)
    for (let x = 0; x < size; x += 20) {
      ctx.quadraticCurveTo(x + 10, size * 0.86 + i * 12, x + 20, size * 0.88 + i * 12)
    }
    ctx.stroke()
  }

  // Rocky base
  ctx.fillStyle = '#3a3530'
  ctx.beginPath()
  ctx.moveTo(size * 0.15, size * 0.85)
  ctx.lineTo(size * 0.25, size * 0.75)
  ctx.lineTo(size * 0.35, size * 0.78)
  ctx.lineTo(size * 0.45, size * 0.72)
  ctx.lineTo(size * 0.55, size * 0.72)
  ctx.lineTo(size * 0.65, size * 0.78)
  ctx.lineTo(size * 0.75, size * 0.75)
  ctx.lineTo(size * 0.85, size * 0.85)
  ctx.lineTo(size * 0.85, size)
  ctx.lineTo(size * 0.15, size)
  ctx.closePath()
  ctx.fill()

  // Rock texture
  ctx.fillStyle = '#4a4540'
  ctx.beginPath()
  ctx.ellipse(size * 0.3, size * 0.82, 15, 8, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(size * 0.7, size * 0.8, 12, 6, 0.3, 0, Math.PI * 2)
  ctx.fill()

  // Lighthouse tower
  const towerLeft = centerX - size * 0.12
  const towerRight = centerX + size * 0.12
  const towerTop = size * 0.18
  const towerBottom = size * 0.72

  // Tower body with stripes
  const stripeHeight = (towerBottom - towerTop) / 8
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#e8e0d8' : '#c44040'
    ctx.beginPath()
    const topWidth = size * 0.10
    const bottomWidth = size * 0.12
    const progress = i / 8
    const nextProgress = (i + 1) / 8
    const leftTop = centerX - (topWidth + (bottomWidth - topWidth) * progress)
    const rightTop = centerX + (topWidth + (bottomWidth - topWidth) * progress)
    const leftBottom = centerX - (topWidth + (bottomWidth - topWidth) * nextProgress)
    const rightBottom = centerX + (topWidth + (bottomWidth - topWidth) * nextProgress)
    ctx.moveTo(leftTop, towerTop + stripeHeight * i)
    ctx.lineTo(rightTop, towerTop + stripeHeight * i)
    ctx.lineTo(rightBottom, towerTop + stripeHeight * (i + 1))
    ctx.lineTo(leftBottom, towerTop + stripeHeight * (i + 1))
    ctx.closePath()
    ctx.fill()
  }

  // Tower outline
  ctx.strokeStyle = '#5a5550'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(centerX - size * 0.10, towerTop)
  ctx.lineTo(centerX - size * 0.12, towerBottom)
  ctx.moveTo(centerX + size * 0.10, towerTop)
  ctx.lineTo(centerX + size * 0.12, towerBottom)
  ctx.stroke()

  // Lantern room base
  ctx.fillStyle = '#4a4540'
  ctx.fillRect(centerX - size * 0.14, towerTop - size * 0.02, size * 0.28, size * 0.04)

  // Lantern room
  ctx.fillStyle = '#3a3530'
  ctx.fillRect(centerX - size * 0.12, towerTop - size * 0.12, size * 0.24, size * 0.10)

  // Lantern glass with glow
  const lanternGlow = ctx.createRadialGradient(centerX, towerTop - size * 0.07, 0, centerX, towerTop - size * 0.07, size * 0.1)
  lanternGlow.addColorStop(0, 'rgba(255, 255, 200, 1)')
  lanternGlow.addColorStop(0.5, 'rgba(255, 220, 100, 0.8)')
  lanternGlow.addColorStop(1, 'rgba(255, 180, 50, 0.4)')
  ctx.fillStyle = lanternGlow
  ctx.fillRect(centerX - size * 0.08, towerTop - size * 0.11, size * 0.16, size * 0.08)

  // Lantern room frame
  ctx.strokeStyle = '#2a2520'
  ctx.lineWidth = 2
  ctx.strokeRect(centerX - size * 0.12, towerTop - size * 0.12, size * 0.24, size * 0.10)

  // Vertical bars on lantern
  ctx.lineWidth = 1
  for (let i = 1; i < 4; i++) {
    const x = centerX - size * 0.08 + (size * 0.16 / 4) * i
    ctx.beginPath()
    ctx.moveTo(x, towerTop - size * 0.11)
    ctx.lineTo(x, towerTop - size * 0.03)
    ctx.stroke()
  }

  // Roof/dome
  ctx.fillStyle = '#3a3530'
  ctx.beginPath()
  ctx.moveTo(centerX - size * 0.14, towerTop - size * 0.12)
  ctx.quadraticCurveTo(centerX, towerTop - size * 0.22, centerX + size * 0.14, towerTop - size * 0.12)
  ctx.closePath()
  ctx.fill()

  // Roof outline
  ctx.strokeStyle = '#2a2520'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(centerX - size * 0.14, towerTop - size * 0.12)
  ctx.quadraticCurveTo(centerX, towerTop - size * 0.22, centerX + size * 0.14, towerTop - size * 0.12)
  ctx.stroke()

  // Top finial
  ctx.fillStyle = '#4a4540'
  ctx.beginPath()
  ctx.moveTo(centerX - size * 0.02, towerTop - size * 0.18)
  ctx.lineTo(centerX + size * 0.02, towerTop - size * 0.18)
  ctx.lineTo(centerX, towerTop - size * 0.24)
  ctx.closePath()
  ctx.fill()

  // Door
  ctx.fillStyle = '#2a2520'
  ctx.beginPath()
  ctx.roundRect(centerX - size * 0.05, towerBottom - size * 0.12, size * 0.10, size * 0.12, [4, 4, 0, 0])
  ctx.fill()

  // Windows
  ctx.fillStyle = 'rgba(255, 220, 150, 0.6)'
  ctx.fillRect(centerX - size * 0.03, towerTop + stripeHeight * 2 + 5, size * 0.06, size * 0.04)
  ctx.fillRect(centerX - size * 0.03, towerTop + stripeHeight * 5 + 5, size * 0.06, size * 0.04)

  return canvas.toDataURL()
}

// Generate lantern image
function generateLanternImage(size) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const centerX = size / 2
  const centerY = size / 2

  // Lighter background
  const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.8)
  bgGradient.addColorStop(0, '#3d4a3d')
  bgGradient.addColorStop(1, '#2a352a')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, size, size)

  // Lantern glow (outer) - bigger and brighter
  const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.6)
  glowGradient.addColorStop(0, 'rgba(255, 220, 150, 0.4)')
  glowGradient.addColorStop(0.4, 'rgba(212, 162, 89, 0.2)')
  glowGradient.addColorStop(1, 'rgba(212, 162, 89, 0)')
  ctx.fillStyle = glowGradient
  ctx.fillRect(0, 0, size, size)

  // Lantern dimensions - much bigger
  const lanternWidth = size * 0.65
  const lanternHeight = size * 0.85
  const lanternTop = size * 0.05
  const lanternLeft = centerX - lanternWidth / 2

  // Hanging hook
  ctx.strokeStyle = '#8b7355'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(centerX, 0)
  ctx.lineTo(centerX, lanternTop + size * 0.02)
  ctx.stroke()

  // Top cap
  ctx.fillStyle = '#6b5545'
  ctx.strokeStyle = '#4a3a2a'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(lanternLeft - 8, lanternTop + size * 0.02)
  ctx.lineTo(lanternLeft + lanternWidth + 8, lanternTop + size * 0.02)
  ctx.lineTo(lanternLeft + lanternWidth, lanternTop + size * 0.08)
  ctx.lineTo(lanternLeft, lanternTop + size * 0.08)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Top knob/ring
  ctx.fillStyle = '#7b6555'
  ctx.beginPath()
  ctx.arc(centerX, lanternTop + size * 0.02, size * 0.05, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Main lantern body (glass area)
  const bodyTop = lanternTop + size * 0.08
  const bodyHeight = size * 0.68

  // Glass glow - warm light
  const glassGlow = ctx.createRadialGradient(centerX, bodyTop + bodyHeight * 0.45, 0, centerX, bodyTop + bodyHeight * 0.45, lanternWidth * 0.5)
  glassGlow.addColorStop(0, 'rgba(255, 240, 180, 1)')
  glassGlow.addColorStop(0.2, 'rgba(255, 210, 120, 0.95)')
  glassGlow.addColorStop(0.5, 'rgba(212, 162, 89, 0.8)')
  glassGlow.addColorStop(0.8, 'rgba(180, 130, 60, 0.6)')
  glassGlow.addColorStop(1, 'rgba(140, 100, 40, 0.4)')

  ctx.fillStyle = glassGlow
  ctx.beginPath()
  ctx.roundRect(lanternLeft + 4, bodyTop, lanternWidth - 8, bodyHeight, 6)
  ctx.fill()

  // Glass frame outline
  ctx.strokeStyle = '#4a3a2a'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(lanternLeft + 4, bodyTop, lanternWidth - 8, bodyHeight, 6)
  ctx.stroke()

  // Vertical frame bars
  ctx.lineWidth = 2
  for (let i = 1; i < 4; i++) {
    const x = lanternLeft + 4 + (lanternWidth - 8) * (i / 4)
    ctx.beginPath()
    ctx.moveTo(x, bodyTop + 4)
    ctx.lineTo(x, bodyTop + bodyHeight - 4)
    ctx.stroke()
  }

  // Horizontal frame bars
  ctx.beginPath()
  ctx.moveTo(lanternLeft + 8, bodyTop + bodyHeight * 0.33)
  ctx.lineTo(lanternLeft + lanternWidth - 8, bodyTop + bodyHeight * 0.33)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(lanternLeft + 8, bodyTop + bodyHeight * 0.66)
  ctx.lineTo(lanternLeft + lanternWidth - 8, bodyTop + bodyHeight * 0.66)
  ctx.stroke()

  // Flame inside - bigger
  const flameX = centerX
  const flameY = bodyTop + bodyHeight * 0.45

  // Flame glow
  const flameGlow = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, size * 0.15)
  flameGlow.addColorStop(0, 'rgba(255, 255, 220, 1)')
  flameGlow.addColorStop(0.4, 'rgba(255, 200, 80, 0.8)')
  flameGlow.addColorStop(1, 'rgba(255, 150, 0, 0)')
  ctx.fillStyle = flameGlow
  ctx.beginPath()
  ctx.arc(flameX, flameY, size * 0.15, 0, Math.PI * 2)
  ctx.fill()

  // Flame shape - bigger
  ctx.fillStyle = '#fffbe8'
  ctx.beginPath()
  ctx.moveTo(flameX, flameY - size * 0.1)
  ctx.quadraticCurveTo(flameX + size * 0.05, flameY - size * 0.03, flameX + size * 0.035, flameY + size * 0.03)
  ctx.quadraticCurveTo(flameX, flameY + size * 0.05, flameX - size * 0.035, flameY + size * 0.03)
  ctx.quadraticCurveTo(flameX - size * 0.05, flameY - size * 0.03, flameX, flameY - size * 0.1)
  ctx.fill()

  // Inner flame
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.moveTo(flameX, flameY - size * 0.05)
  ctx.quadraticCurveTo(flameX + size * 0.02, flameY, flameX + size * 0.015, flameY + size * 0.02)
  ctx.quadraticCurveTo(flameX, flameY + size * 0.03, flameX - size * 0.015, flameY + size * 0.02)
  ctx.quadraticCurveTo(flameX - size * 0.02, flameY, flameX, flameY - size * 0.05)
  ctx.fill()

  // Bottom cap
  const bottomTop = bodyTop + bodyHeight
  ctx.fillStyle = '#6b5545'
  ctx.strokeStyle = '#4a3a2a'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(lanternLeft, bottomTop)
  ctx.lineTo(lanternLeft + lanternWidth, bottomTop)
  ctx.lineTo(lanternLeft + lanternWidth + 8, bottomTop + size * 0.06)
  ctx.lineTo(lanternLeft - 8, bottomTop + size * 0.06)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Bottom finial
  ctx.fillStyle = '#7b6555'
  ctx.beginPath()
  ctx.moveTo(centerX - size * 0.04, bottomTop + size * 0.06)
  ctx.lineTo(centerX + size * 0.04, bottomTop + size * 0.06)
  ctx.lineTo(centerX, size - 2)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  return canvas.toDataURL()
}

function PuzzleGame({ isOpen, onClose }) {
  const [gridSize, setGridSize] = useState(3) // 3x3 or 4x4
  const [puzzleImage, setPuzzleImage] = useState('lantern') // lantern or lighthouse
  const [tiles, setTiles] = useState([])
  const [emptyIndex, setEmptyIndex] = useState(0)
  const [moves, setMoves] = useState(0)
  const [solved, setSolved] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const totalTiles = gridSize * gridSize

  // Generate image when puzzle image type changes
  useEffect(() => {
    if (puzzleImage === 'lighthouse') {
      setImageUrl(generateLighthouseImage(300))
    } else {
      setImageUrl(generateLanternImage(300))
    }
  }, [puzzleImage])

  // Initialize puzzle
  const initPuzzle = useCallback(() => {
    const newTiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1)
    newTiles.push(0) // Empty tile
    setTiles(newTiles)
    setEmptyIndex(totalTiles - 1)
    setMoves(0)
    setSolved(false)
  }, [totalTiles])

  // Shuffle puzzle
  const shufflePuzzle = useCallback(() => {
    let currentTiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1)
    currentTiles.push(0)
    let currentEmpty = totalTiles - 1

    // Perform random valid moves
    const numMoves = gridSize === 3 ? 50 : 100

    for (let i = 0; i < numMoves; i++) {
      const neighbors = getNeighbors(currentEmpty, gridSize)
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)]

      // Swap
      currentTiles[currentEmpty] = currentTiles[randomNeighbor]
      currentTiles[randomNeighbor] = 0
      currentEmpty = randomNeighbor
    }

    setTiles(currentTiles)
    setEmptyIndex(currentEmpty)
    setMoves(0)
    setSolved(false)
  }, [totalTiles, gridSize])

  // Get valid neighbor indices
  function getNeighbors(index, size) {
    const neighbors = []
    const row = Math.floor(index / size)
    const col = index % size

    if (row > 0) neighbors.push(index - size) // Up
    if (row < size - 1) neighbors.push(index + size) // Down
    if (col > 0) neighbors.push(index - 1) // Left
    if (col < size - 1) neighbors.push(index + 1) // Right

    return neighbors
  }

  // Check if puzzle is solved
  function checkSolved(currentTiles) {
    for (let i = 0; i < currentTiles.length - 1; i++) {
      if (currentTiles[i] !== i + 1) return false
    }
    return currentTiles[currentTiles.length - 1] === 0
  }

  // Handle tile click
  function handleTileClick(index) {
    if (solved) return
    if (tiles[index] === 0) return

    const neighbors = getNeighbors(emptyIndex, gridSize)
    if (!neighbors.includes(index)) return

    // Swap tiles
    const newTiles = [...tiles]
    newTiles[emptyIndex] = newTiles[index]
    newTiles[index] = 0

    setTiles(newTiles)
    setEmptyIndex(index)
    setMoves(m => m + 1)

    if (checkSolved(newTiles)) {
      setSolved(true)
    }
  }

  // Change difficulty
  function handleDifficultyChange(newSize) {
    setGridSize(newSize)
  }

  // Reset when grid size changes
  useEffect(() => {
    initPuzzle()
  }, [gridSize, initPuzzle])

  // Start shuffled on open
  useEffect(() => {
    if (isOpen && tiles.length > 0) {
      shufflePuzzle()
    }
  }, [isOpen])

  if (!isOpen) return null

  const tileSize = 100 / gridSize

  return (
    <div className="puzzle-overlay" onClick={onClose}>
      <div className="puzzle-modal" onClick={e => e.stopPropagation()}>
        <button className="puzzle-close" onClick={onClose}>×</button>

        <div className="puzzle-header">
          <h2>Mindful Puzzle</h2>
          <p className="puzzle-moves">{moves} moves</p>
        </div>

        <div className="puzzle-options">
          <div className="puzzle-difficulty">
            <button
              className={`difficulty-btn ${gridSize === 3 ? 'active' : ''}`}
              onClick={() => handleDifficultyChange(3)}
            >
              Easy (3×3)
            </button>
            <button
              className={`difficulty-btn ${gridSize === 4 ? 'active' : ''}`}
              onClick={() => handleDifficultyChange(4)}
            >
              Classic (4×4)
            </button>
          </div>
          <div className="puzzle-image-select">
            <button
              className={`image-btn ${puzzleImage === 'lantern' ? 'active' : ''}`}
              onClick={() => setPuzzleImage('lantern')}
              title="Lantern"
            >
              🏮
            </button>
            <button
              className={`image-btn ${puzzleImage === 'lighthouse' ? 'active' : ''}`}
              onClick={() => setPuzzleImage('lighthouse')}
              title="Lighthouse"
            >
              🗼
            </button>
          </div>
        </div>

        <div
          className="puzzle-board"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            backgroundImage: `url(${imageUrl})`
          }}
        >
          {tiles.map((tile, index) => {
            if (tile === 0) {
              return <div key={index} className="puzzle-tile puzzle-tile--empty" />
            }

            const originalRow = Math.floor((tile - 1) / gridSize)
            const originalCol = (tile - 1) % gridSize

            return (
              <div
                key={index}
                className="puzzle-tile"
                onClick={() => handleTileClick(index)}
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${gridSize * 100}%`,
                  backgroundPosition: `${originalCol * tileSize * (100 / (100 - tileSize))}% ${originalRow * tileSize * (100 / (100 - tileSize))}%`
                }}
              >
                <span className="tile-number">{tile}</span>
              </div>
            )
          })}
        </div>

        {solved && (
          <div className="puzzle-solved">
            <span className="solved-icon">✦</span>
            <p>Solved in {moves} moves!</p>
          </div>
        )}

        <button className="puzzle-shuffle" onClick={shufflePuzzle}>
          {solved ? 'Play Again' : 'Shuffle'}
        </button>
      </div>
    </div>
  )
}

export default PuzzleGame
