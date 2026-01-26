import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const versionPath = path.join(__dirname, '..', 'src', 'version.json')

// Read current version
const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf-8'))

// Increment build number
versionData.build += 1

// Format: YYYY.MM.DD.XXX.XXX where last 6 digits are padded build number
const today = new Date()
const datePrefix = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`
const buildPadded = String(versionData.build).padStart(6, '0')
const buildPart1 = buildPadded.slice(0, 3)
const buildPart2 = buildPadded.slice(3)
versionData.version = `${datePrefix}.${buildPart1}.${buildPart2}`

// Write back
fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2) + '\n')

console.log(`Version incremented to ${versionData.version}`)
