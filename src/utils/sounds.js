// Meditation interval sounds using Web Audio API

let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Bell - bright, clear tone
export function playBell(ctx = getAudioContext()) {
  const now = ctx.currentTime

  // Main tone
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.frequency.value = 880
  osc.type = 'sine'
  gain.gain.setValueAtTime(0.4, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5)

  osc.start(now)
  osc.stop(now + 1.5)

  // Harmonic
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.connect(gain2)
  gain2.connect(ctx.destination)

  osc2.frequency.value = 1760
  osc2.type = 'sine'
  gain2.gain.setValueAtTime(0.15, now)
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 1)

  osc2.start(now)
  osc2.stop(now + 1)
}

// Tibetan Singing Bowl - rich, resonant
export function playSingingBowl(ctx = getAudioContext()) {
  const now = ctx.currentTime
  const baseFreq = 220

  // Multiple harmonics for rich sound
  const harmonics = [1, 2.5, 3.8, 5.2]
  const gains = [0.35, 0.2, 0.12, 0.08]
  const durations = [4, 3.5, 3, 2.5]

  harmonics.forEach((mult, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = baseFreq * mult
    osc.type = 'sine'

    gain.gain.setValueAtTime(gains[i], now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + durations[i])

    osc.start(now)
    osc.stop(now + durations[i])
  })
}

// Gong - deep, resonant
export function playGong(ctx = getAudioContext()) {
  const now = ctx.currentTime

  // Low fundamental
  const osc1 = ctx.createOscillator()
  const gain1 = ctx.createGain()
  osc1.connect(gain1)
  gain1.connect(ctx.destination)

  osc1.frequency.setValueAtTime(110, now)
  osc1.frequency.exponentialRampToValueAtTime(100, now + 3)
  osc1.type = 'sine'
  gain1.gain.setValueAtTime(0.5, now)
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 4)

  osc1.start(now)
  osc1.stop(now + 4)

  // Shimmer harmonics
  for (let i = 2; i <= 6; i++) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = 110 * i + Math.random() * 10
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.15 / i, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3 - i * 0.3)

    osc.start(now)
    osc.stop(now + 3)
  }
}

// Chimes - light, airy
export function playChimes(ctx = getAudioContext()) {
  const now = ctx.currentTime
  const notes = [523, 659, 784, 1047] // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const delay = i * 0.08

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = freq
    osc.type = 'sine'

    gain.gain.setValueAtTime(0, now + delay)
    gain.gain.linearRampToValueAtTime(0.25, now + delay + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 1.5)

    osc.start(now + delay)
    osc.stop(now + delay + 1.5)
  })
}

// Tingsha (Tibetan cymbals) - bright, piercing
export function playTingsha(ctx = getAudioContext()) {
  const now = ctx.currentTime

  // Two slightly detuned tones for beating effect
  const freqs = [2093, 2110] // slightly detuned C7

  freqs.forEach(freq => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = freq
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5)

    osc.start(now)
    osc.stop(now + 2.5)
  })

  // Add some higher harmonics
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.connect(gain2)
  gain2.connect(ctx.destination)

  osc2.frequency.value = 4186
  osc2.type = 'sine'
  gain2.gain.setValueAtTime(0.08, now)
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5)

  osc2.start(now)
  osc2.stop(now + 1.5)
}

// Wood block - percussive, grounding
export function playWoodBlock(ctx = getAudioContext()) {
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.frequency.setValueAtTime(800, now)
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.1)
  osc.type = 'triangle'

  gain.gain.setValueAtTime(0.5, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

  osc.start(now)
  osc.stop(now + 0.15)
}

// Sound registry
export const SOUNDS = {
  bell: { name: 'Bell', play: playBell, duration: 1500 },
  singing_bowl: { name: 'Singing Bowl', play: playSingingBowl, duration: 4000 },
  gong: { name: 'Gong', play: playGong, duration: 4000 },
  chimes: { name: 'Chimes', play: playChimes, duration: 1500 },
  tingsha: { name: 'Tingsha', play: playTingsha, duration: 2500 },
  wood_block: { name: 'Wood Block', play: playWoodBlock, duration: 150 }
}

// Play a sound by key
export function playSound(soundKey) {
  const sound = SOUNDS[soundKey]
  if (sound) {
    try {
      sound.play()
    } catch (e) {
      console.log('Audio not supported:', e)
    }
  }
}

// Play a sound multiple times with spacing
export function playSoundRepeated(soundKey, times, spacingMs = 800) {
  const sound = SOUNDS[soundKey]
  if (!sound) return

  for (let i = 0; i < times; i++) {
    setTimeout(() => {
      try {
        sound.play()
      } catch (e) {
        console.log('Audio not supported:', e)
      }
    }, i * spacingMs)
  }
}

// Resume audio context (needed after user interaction)
export function resumeAudio() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
}
