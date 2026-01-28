import { useState } from 'react'
import { DRUID_PRESET } from '../data/traditions/druid'
import './DruidGuide.css'

function DruidGuide() {
  const [activeSection, setActiveSection] = useState('sphere')
  const [expandedRitual, setExpandedRitual] = useState(null)

  const { rituals, holyDays, elementalWork, oghamCalendar, studyCurriculum, philosophy } = DRUID_PRESET

  const sections = [
    { id: 'sphere', label: 'Sphere of Protection', icon: '🔮' },
    { id: 'meditation', label: 'Discursive Meditation', icon: '🧘' },
    { id: 'wheel', label: 'Wheel of the Year', icon: '☀' },
    { id: 'elements', label: 'Elemental Work', icon: '🜁' },
    { id: 'ogham', label: 'Ogham Calendar', icon: '᚛' },
    { id: 'ceremonies', label: 'Ceremonies', icon: '🕯' },
    { id: 'study', label: 'Study Path', icon: '📖' },
    { id: 'philosophy', label: 'Philosophy', icon: '🌳' }
  ]

  return (
    <div className="druid-guide">
      <header className="guide-header">
        <h1>🌳 Druid Practice Guide</h1>
        <p>Based on John Michael Greer's teachings and Traditional Druidry</p>
      </header>

      <div className="druid-teaser">
        Full integration coming soon...
      </div>

      <nav className="guide-nav">
        {sections.map(section => (
          <button
            key={section.id}
            className={`druid-nav-btn ${activeSection === section.id ? 'druid-nav-btn--active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="druid-nav-icon">{section.icon}</span>
            <span className="druid-nav-label">{section.label}</span>
          </button>
        ))}
      </nav>

      <main className="guide-content">
        {/* Sphere of Protection */}
        {activeSection === 'sphere' && (
          <section className="guide-section">
            <h2>{rituals.sphereOfProtection.name}</h2>
            <p className="section-description">{rituals.sphereOfProtection.description}</p>
            <p className="timing-note">
              <strong>Timing:</strong> {rituals.sphereOfProtection.timing}
            </p>

            <div className="ritual-steps">
              {rituals.sphereOfProtection.steps.map((step, idx) => (
                <div key={idx} className="ritual-step">
                  <div className="step-header">
                    <span className="step-direction">{step.direction}</span>
                    {step.element && <span className="step-element">{step.element}</span>}
                    <span className="step-quality">{step.quality}</span>
                  </div>
                  <pre className="step-text">{step.text}</pre>
                </div>
              ))}
            </div>

            <div className="ritual-note">
              <strong>Evening Closing:</strong> {rituals.sphereOfProtection.closing}
            </div>
          </section>
        )}

        {/* Discursive Meditation */}
        {activeSection === 'meditation' && (
          <section className="guide-section">
            <h2>{rituals.discursiveMeditation.name}</h2>
            <p className="section-description">{rituals.discursiveMeditation.description}</p>
            <p className="timing-note">
              <strong>Duration:</strong> {rituals.discursiveMeditation.duration}
            </p>

            <div className="meditation-steps">
              {rituals.discursiveMeditation.steps.map((step, idx) => (
                <div key={idx} className="meditation-step">
                  <div className="step-number">{idx + 1}</div>
                  <div className="step-content">
                    <h4>{step.name} <span className="step-duration">({step.duration})</span></h4>
                    <p className="step-instruction">{step.instruction}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="suggested-topics">
              <h4>Suggested Topics for Reflection</h4>
              <ul>
                {rituals.discursiveMeditation.suggestedTopics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Wheel of the Year */}
        {activeSection === 'wheel' && (
          <section className="guide-section">
            <h2>The Druid Wheel of the Year</h2>
            <p className="section-description">
              Eight holy days marking the turning of the seasons - four solar festivals (solstices and equinoxes)
              and four fire festivals (cross-quarter days).
            </p>

            <h3>Solar Festivals (The Four Albans)</h3>
            <div className="holy-days-grid">
              {holyDays.solarFestivals.map(day => (
                <article
                  key={day.id}
                  className={`holy-day-card ${expandedRitual === day.id ? 'expanded' : ''}`}
                  onClick={() => setExpandedRitual(expandedRitual === day.id ? null : day.id)}
                >
                  <div className="holy-day-header">
                    <h4>{day.name}</h4>
                    <span className="holy-day-meaning">{day.meaning}</span>
                  </div>
                  <p className="holy-day-date">{day.approximateDate}</p>

                  {expandedRitual === day.id && (
                    <div className="holy-day-details">
                      <p>{day.description}</p>
                      <div className="themes">
                        <strong>Themes:</strong>
                        <div className="theme-tags">
                          {day.themes.map((theme, i) => (
                            <span key={i} className="theme-tag">{theme}</span>
                          ))}
                        </div>
                      </div>
                      <div className="practices">
                        <strong>Practices:</strong>
                        <ul>
                          {day.practices.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                      <div className="journal-prompts">
                        <strong>Journal Prompts:</strong>
                        <ul>
                          {day.journalPrompts.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>

            <h3>Fire Festivals (Cross-Quarter Days)</h3>
            <div className="holy-days-grid">
              {holyDays.fireFestivals.map(day => (
                <article
                  key={day.id}
                  className={`holy-day-card fire-festival ${expandedRitual === day.id ? 'expanded' : ''}`}
                  onClick={() => setExpandedRitual(expandedRitual === day.id ? null : day.id)}
                >
                  <div className="holy-day-header">
                    <h4>{day.name}</h4>
                    <span className="holy-day-meaning">{day.meaning}</span>
                  </div>
                  <p className="holy-day-date">{day.approximateDate}</p>

                  {expandedRitual === day.id && (
                    <div className="holy-day-details">
                      <p>{day.description}</p>
                      <div className="themes">
                        <strong>Themes:</strong>
                        <div className="theme-tags">
                          {day.themes.map((theme, i) => (
                            <span key={i} className="theme-tag">{theme}</span>
                          ))}
                        </div>
                      </div>
                      <div className="practices">
                        <strong>Practices:</strong>
                        <ul>
                          {day.practices.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                      <div className="journal-prompts">
                        <strong>Journal Prompts:</strong>
                        <ul>
                          {day.journalPrompts.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Elemental Work */}
        {activeSection === 'elements' && (
          <section className="guide-section">
            <h2>Elemental Work</h2>
            <p className="section-description">{elementalWork.description}</p>

            <div className="elements-grid">
              {elementalWork.schedule.map((el, idx) => (
                <div key={idx} className={`element-card element-${el.element.toLowerCase()}`}>
                  <h3>{el.element}</h3>
                  <ul className="element-practices">
                    {el.practices.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                  <div className="element-prompt">
                    <strong>Journal:</strong> "{el.journalPrompt}"
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ogham Calendar */}
        {activeSection === 'ogham' && (
          <section className="guide-section">
            <h2>Ogham Tree Calendar</h2>
            <p className="section-description">
              The Celtic tree alphabet, with each letter corresponding to a tree and a lunar month.
            </p>

            <div className="ogham-grid">
              {oghamCalendar.map((tree, idx) => (
                <div key={idx} className="ogham-card">
                  <div className="ogham-header">
                    <span className="ogham-symbol">{tree.symbol}</span>
                    <div className="ogham-names">
                      <h4>{tree.tree}</h4>
                      <span className="ogham-letter">{tree.letter}</span>
                    </div>
                  </div>
                  <p className="ogham-period">{tree.period}</p>
                  <div className="ogham-themes">
                    {tree.themes.map((t, i) => (
                      <span key={i} className="theme-tag">{t}</span>
                    ))}
                  </div>
                  <ul className="ogham-practices">
                    {tree.practices.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ceremonies */}
        {activeSection === 'ceremonies' && (
          <section className="guide-section">
            <h2>Ceremony Structures</h2>

            <article className="ceremony-guide">
              <h3>{rituals.basicCeremony.name}</h3>

              <div className="ceremony-section">
                <h4>Opening</h4>
                <ol>
                  {rituals.basicCeremony.sections.opening.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="ceremony-section">
                <h4>Working</h4>
                <ol>
                  {rituals.basicCeremony.sections.working.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="ceremony-section">
                <h4>Closing</h4>
                <ol>
                  {rituals.basicCeremony.sections.closing.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </article>

            <article className="ceremony-guide">
              <h3>{rituals.holyDayCeremony.name}</h3>

              {Object.entries(rituals.holyDayCeremony.sections).map(([key, value]) => (
                <div key={key} className="ceremony-section">
                  <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                  {typeof value === 'string' ? (
                    <p>{value}</p>
                  ) : (
                    <ol>
                      {value.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  )}
                </div>
              ))}
            </article>
          </section>
        )}

        {/* Study Path */}
        {activeSection === 'study' && (
          <section className="guide-section">
            <h2>Study Curriculum</h2>

            <h3>Foundation Texts</h3>
            <div className="books-list">
              {studyCurriculum.foundationTexts.map((book, idx) => (
                <div key={idx} className="book-card">
                  <span className="book-order">{book.order}</span>
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p className="book-author">by {book.author}</p>
                    <p className="book-focus">{book.focus}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3>Progression Path</h3>
            <div className="progression-timeline">
              {studyCurriculum.progressionPath.map((phase, idx) => (
                <div key={idx} className="progression-phase">
                  <div className="phase-period">{phase.period}</div>
                  <div className="phase-content">
                    <h4>{phase.focus}</h4>
                    <ul>
                      {phase.goals.map((goal, i) => <li key={i}>{goal}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Philosophy */}
        {activeSection === 'philosophy' && (
          <section className="guide-section">
            <h2>Druid Philosophy</h2>

            <article className="philosophy-card">
              <h3>The Three Rays of Light</h3>
              <div className="three-rays">
                {philosophy.threeRays.map((ray, idx) => (
                  <div key={idx} className="ray">
                    <h4>{ray.name}</h4>
                    <p className="ray-description">{ray.description}</p>
                    <p className="ray-direction">{ray.direction}</p>
                    <ul>
                      {ray.practices.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </article>

            <article className="philosophy-card">
              <h3>The Sacred Center</h3>
              <p>{philosophy.sacredCenter.description}</p>
              <ul>
                {philosophy.sacredCenter.principles.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </article>

            <article className="philosophy-card">
              <h3>Relationship with Nature</h3>
              <p>{philosophy.relationshipWithNature.description}</p>
              <ul>
                {philosophy.relationshipWithNature.principles.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </article>

            <article className="philosophy-card">
              <h3>The Mysteries</h3>
              <p>{philosophy.mysteries.description}</p>
              <ul>
                {philosophy.mysteries.principles.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </article>
          </section>
        )}
      </main>
    </div>
  )
}

export default DruidGuide
