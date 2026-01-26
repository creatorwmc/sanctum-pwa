import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Guide.css'

const SECTIONS = [
  {
    id: 'overview',
    title: 'What is Sanctum?',
    icon: '🌳',
    content: `Sanctum is your personal space for tracking spiritual practices. Think of it like a fitness app, but for your inner growth instead of your body.

Everything you save stays on your device. Your private thoughts and practices are never sent to any server or company. Only you can see your data.

You can use Sanctum to:
- Time your meditation sessions
- Track which practices you do each day
- Write in a private journal
- Save notes and documents you're studying
- Keep track of important dates and ceremonies
- Save links to helpful websites`
  },
  {
    id: 'dashboard',
    title: 'Dashboard (Home)',
    icon: '🏠',
    content: `The Dashboard is the first screen you see when you open the app. It shows you a quick summary of your practice.

**What you'll see:**
- Today's date and a welcome message
- Quick buttons to start a practice, log your day, or write in your journal
- Your current streak (how many days in a row you've practiced)
- Your longest streak ever
- Whether you've logged practices today
- Your bonus points and stored practices
- Recent journal entries
- Quick links to different study traditions

**Streaks explained:**
A streak counts how many days in a row you've done at least one practice. If you practice today and yesterday, your streak is 2. Miss a day, and it resets to 0 (unless you use a stored practice).`
  },
  {
    id: 'timer',
    title: 'Meditation Timer',
    icon: '◷',
    content: `The Timer helps you time meditation sessions or any practice that needs a set duration.

**Setting the time:**
You have three ways to set how long you want to practice:
- **Quick Add**: Tap +1, +5, or +10 to add minutes
- **Type**: Enter an exact number of minutes
- **Dial**: Drag your finger around the circle to set the time

**Practice types:**
Before starting, pick what kind of practice you're doing (Meditation, Breathwork, Visualization, etc.). This helps you track different practices separately.

**Interval sounds:**
You can have the app play a gentle sound at regular times during your session to help you stay focused.

**Two sound modes:**
1. **Simple Repeating**: Pick one sound that plays at regular intervals (like every 5 minutes)
2. **Custom Schedule**: Create your own pattern with different sounds at specific times

**Sound options:**
- Bell, Singing Bowl, Gong, Chimes, Tingsha, Wood Block
- Set how many times each sound repeats (1x, 2x, or 3x)

**Custom schedule tips:**
- Add sounds at "Start" to begin your session
- Add sounds at "End" for a closing bell
- Save your favorite patterns to reuse later

**When you finish:**
After your timer ends, you can write notes about your session and save it to your history.`
  },
  {
    id: 'daily',
    title: 'Daily Practice Log',
    icon: '☀',
    content: `The Daily Log is where you track what practices you did today. This is different from the timer - here you're just checking off what you completed.

**Available practices:**
- Ritual Bath (color therapy, integration)
- Meditation (sitting, walking, visualization)
- Vessel Work (physical practices for the body)
- Breathwork (pranayama, conscious breathing)
- Study/Reading (spiritual texts, philosophy)
- Integration Journaling (documenting insights)
- Sacred Union (relationship care)
- Tending (service to others, animals, land)
- Tarot/Divination (guidance, symbol work)
- Ceremonial Work (rituals, moon ceremonies)

**How to use it:**
Tap any practice you did today to highlight it. Tap again to remove it. You can add notes about your day in the text box below.

**Bonus points:**
The more practices you do in one day, the more bonus points you earn:
- 2 practices = 1 point
- 4 practices = 2 points
- 6 practices = 3 points
- 8 practices = 4 points
- 10 practices = 5 points

**Stored practices:**
These are like "rest day passes." You get one free stored practice at the start of each month. If you have a day where you can't practice, you can use a stored practice to keep your streak alive.

You can also convert 10 bonus points into 1 stored practice.

**Tip:** Long-press or right-click any practice button to see a description of what counts for that practice.`
  },
  {
    id: 'journal',
    title: 'Journal',
    icon: '✎',
    content: `The Journal is your private space to write down thoughts, insights, and experiences.

**Entry types:**
When you create an entry, you pick a type that best fits what you're writing about:
- **Insight** (lightbulb) - A new understanding or realization
- **Breakthrough** (lightning) - A major shift or accomplishment
- **Stumble** (dark moon) - Challenges or difficulties to learn from
- **Dream** (crescent moon) - Dream experiences or interpretations
- **Gratitude** (prayer hands) - Things you're thankful for
- **Reflection** (crystal ball) - General thoughts and contemplation

**Creating an entry:**
1. Tap "+ New Entry"
2. Choose the type that fits
3. Add a title (optional)
4. Write your thoughts
5. Tap "Save Entry"

**Viewing entries:**
All your entries show up in a list, newest first. Each entry shows its type, date, and a preview of what you wrote. Tap the X to delete an entry you don't want anymore.`
  },
  {
    id: 'library',
    title: 'Document Library',
    icon: '📖',
    content: `The Library is where you save documents, notes, excerpts, and study materials.

**Traditions (categories):**
Documents are organized by tradition or study path:
- BOTA (Builders of the Adytum)
- Kabbalah
- Buddhism
- Alchemy
- Philosophy
- Jedi/Metaphor

You can rename these categories by tapping "Edit" next to the tabs.

**Creating a document:**
1. Tap "+ Add Document"
2. Enter a title
3. Pick which tradition it belongs to
4. Add a description (optional)
5. Write or paste the content
6. Tap "Save"

**Viewing documents:**
- Use the tabs at the top to filter by tradition
- Tap any document to edit it
- Tap the X to delete it

**Use this for:**
- Notes from books you're reading
- Excerpts from teachings
- Your own written reflections on specific topics
- Study guides and references`
  },
  {
    id: 'resources',
    title: 'Resource Library',
    icon: '☁',
    content: `The Resource Library stores links to files and websites. You have two ways to add resources.

**Method 1: Manual Links**
Add links to anything on the web:
1. Tap "+ Add Link"
2. Enter a title and paste the URL
3. Pick a category (Study Materials, Reference, Practice Guides, Media, Other)
4. Add tags to help you find it later
5. Add notes about what the resource is
6. Tap "Save"

This works for any link: websites, YouTube videos, PDFs, Dropbox files, iCloud links, Google Docs, and more.

**Method 2: Google Drive (optional)**
If you use Google Drive, you can connect it to browse and add files directly:
1. Tap "Connect" in the Drive status bar
2. Sign in with your Google account
3. Tap "Browse Drive" to see your files
4. Navigate folders or search for files
5. Tap + to add a file with category and tags

**Viewing resources:**
- Filter by category using the tabs
- Filter by source (Drive files vs manual links)
- Search by title, notes, or tags
- Tap any tag to filter by it
- Sort by date, title, or category

**Icons explained:**
- ☁ = File from Google Drive
- 🔗 = Manually added link

**Note:** Connecting Google Drive is optional. Manual links work for everyone and can link to files stored anywhere.`
  },
  {
    id: 'links',
    title: 'Research Links',
    icon: '🔗',
    content: `The Links page is your bookmark collection for helpful websites and online resources.

**Saving a link:**
1. Tap "+ Add Link"
2. Paste the URL (web address)
3. Give it a title you'll remember
4. Add a description of why it's useful (optional)
5. Add tags separated by commas (like: "meditation, beginner, youtube")
6. Tap "Save Link"

**Finding links:**
- All your links show up in a list
- Tap any tag button at the top to filter by that tag
- Tap a link's title to open it in a new tab
- Tap the X to delete a link

**Tags explained:**
Tags are like labels. A link can have multiple tags. For example, a YouTube video about Kabbalah meditation might have tags like: "kabbalah, meditation, video, beginner". This makes it easy to find later.`
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: '📅',
    content: `The Calendar helps you track ceremonies, special dates, and see moon phases.

**Moon information:**
Each day shows:
- The moon phase (new, full, waxing, waning)
- What zodiac sign the moon is in
- Special indicators: E = Eclipse, B = Blue Moon, S = Solstice/Equinox

Tap any day to see detailed information about:
- Moon phase name and how full it is
- Zodiac sign with its element and meaning
- Any special astronomical events

**Adding events:**
1. Tap a day on the calendar
2. Tap "+ Add"
3. Enter a title
4. Pick the type:
   - Quarterly Ceremony (major rituals)
   - Moon Phase (new/full moon work)
   - Personal Milestone (anniversaries, dates to remember)
   - Holiday/Festival
   - Other
5. Add notes if you want
6. Tap "Save"

**Annual milestones:**
For personal milestones, you can check "Repeat annually." This is perfect for:
- Sobriety anniversaries
- Important life events
- Tattoo dates
- Spiritual "birthdays"

These will show up on the same date every year.

**Viewing the month:**
- Use the arrows to move between months
- Colored dots on days show you have events
- The list below the calendar shows all events for the current month`
  },
  {
    id: 'settings',
    title: 'Settings & Backup',
    icon: '⚙',
    content: `The Settings page lets you export your data and customize the app.

**Exporting your data:**
You can save copies of your information in different formats:
- **Export Journal**: Creates a text file of all your journal entries
- **Export Meditation History**: Creates a spreadsheet of your timer sessions
- **Export Practice History**: Creates a spreadsheet of your daily practice logs
- **Export Everything**: Creates one complete backup file with all your data

**Cloud backup:**
If Google Drive is set up, you can connect it to save your exports directly to a "Sanctum Exports" folder in your Drive.

**Navigation settings:**
In the main menu, you can hide pages you don't use. Hidden pages will appear in a "Hidden Pages" section in the menu so you can still access them when needed.

**Why export matters:**
Since all your data stays on your device, it's smart to make backups regularly. If you get a new phone or clear your browser data, you could lose everything. Exporting creates a copy you can keep safe.`
  },
  {
    id: 'tips',
    title: 'Tips for Success',
    icon: '💡',
    content: `**Start small:**
Don't try to do all 10 practices every day. Pick 1-2 that feel right and build from there.

**Be consistent:**
A short daily practice beats a long practice once a week. Even 5 minutes counts.

**Use the streak system:**
Watching your streak grow is motivating. If you need a rest day, use a stored practice to keep it going.

**Journal regularly:**
Writing helps you process experiences. Even a few sentences can be valuable.

**Review your history:**
Check your Dashboard and Calendar to see patterns. Notice which practices help you most.

**Make it a habit:**
Try practicing at the same time each day. Morning often works well before the day gets busy.

**Be honest:**
Only log practices you actually did. This tool works best when your data is real.

**Back up your data:**
Use the Export feature every week or month to save a copy of your progress.`
  }
]

function Guide() {
  const [expandedSection, setExpandedSection] = useState('overview')

  function toggleSection(id) {
    setExpandedSection(expandedSection === id ? null : id)
  }

  return (
    <div className="guide-page">
      <div className="guide-header">
        <Link to="/settings" className="back-link">← Settings</Link>
        <h1 className="guide-title">App Guide</h1>
        <p className="guide-subtitle">Learn how to use Sanctum</p>
      </div>

      <div className="guide-sections">
        {SECTIONS.map(section => (
          <div key={section.id} className="guide-section">
            <button
              className={`section-header ${expandedSection === section.id ? 'section-header--active' : ''}`}
              onClick={() => toggleSection(section.id)}
            >
              <span className="section-icon">{section.icon}</span>
              <span className="section-title">{section.title}</span>
              <span className="section-arrow">{expandedSection === section.id ? '▲' : '▼'}</span>
            </button>

            {expandedSection === section.id && (
              <div className="section-content">
                {section.content.split('\n\n').map((paragraph, idx) => {
                  // Handle bold text
                  const parts = paragraph.split(/(\*\*[^*]+\*\*)/g)
                  return (
                    <p key={idx} className="content-paragraph">
                      {parts.map((part, partIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={partIdx}>{part.slice(2, -2)}</strong>
                        }
                        // Handle list items
                        if (part.includes('\n-')) {
                          const lines = part.split('\n')
                          return lines.map((line, lineIdx) => {
                            if (line.startsWith('-')) {
                              return <span key={lineIdx} className="list-item">{line}</span>
                            }
                            return <span key={lineIdx}>{line}</span>
                          })
                        }
                        return part
                      })}
                    </p>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="guide-footer">
        <p>Your data is private and stored only on this device.</p>
      </div>
    </div>
  )
}

export default Guide
