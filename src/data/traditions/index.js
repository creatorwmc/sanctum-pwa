// Traditions Index
// Central registry for all spiritual tradition presets

import { DRUID_PRESET } from './druid'
import { CHRISTIAN_PRESET } from './christian'
import { ISLAMIC_PRESET } from './islamic'
import { BUDDHIST_PRESET } from './buddhist'

// Registry of all available tradition presets
export const TRADITION_PRESETS = {
  druid: DRUID_PRESET,
  christian: CHRISTIAN_PRESET,
  islamic: ISLAMIC_PRESET,
  buddhist: BUDDHIST_PRESET
}

// List of all available traditions for selection
export const AVAILABLE_TRADITIONS = [
  {
    id: 'druid',
    name: 'Druidry',
    description: 'Traditional Druidry based on John Michael Greer\'s teachings',
    icon: '🌳',
    color: '#228b22',
    hasPreset: true,
    libraryCategories: [
      'Sacred Texts & Lore',
      'John Michael Greer Works',
      'Ritual & Ceremony',
      'Tree Lore & Ogham',
      'Nature Practice',
      'Druid Philosophy',
      'Daily Practice'
    ],
    journalingPrompts: [
      'What wisdom did nature offer today?',
      'How am I experiencing this season in my own life?',
      'What does this month\'s tree teach about my current situation?',
      'Where did I see Wisdom, Love, and Power (Three Rays) today?',
      'How am I connecting with the spirits of this place?',
      'What patterns do I notice as the Wheel turns?',
      'How does today\'s element (Earth/Air/Fire/Water) show up for me?',
      'What did I learn from my discursive meditation today?',
      'How did the Sphere of Protection ritual affect my day?',
      'What messages came through in my nature observation?',
      'How am I embodying the virtues of the Druid path?',
      'What sacrifice or offering did I make today?',
      'How is my relationship with the land spirits developing?',
      'What Ogham symbol speaks to my current journey?',
      'How did I practice the art of memory today?',
      'What ancestors am I connecting with in my practice?',
      'How is the current holy day influencing my inner work?',
      'What did I learn about myself through contemplation?',
      'How am I serving my community as a Druid?',
      'What natural cycles am I aligning with?',
      'How did I honor the three worlds (Land, Sea, Sky) today?',
      'What bardic inspiration came to me?',
      'How am I developing my connection to Awen?',
      'What challenges am I facing on the Druid path?',
      'How did I practice reverence for nature today?',
      'What growth am I noticing in my spiritual practice?',
      'How am I balancing study and direct experience?',
      'What did the weather teach me today?',
      'How am I incorporating Druid ethics into daily choices?',
      'What plants or animals appeared as teachers today?',
      'How is my grove practice (solitary or group) evolving?',
      'What divination insights did I receive?',
      'How am I honoring the turning of the year?',
      'What sacred geometry do I notice in nature?',
      'How did I practice hospitality today?',
      'What myths or legends speak to my current situation?',
      'How am I cultivating inner stillness?',
      'What ecological awareness am I developing?',
      'How did I practice gratitude in the Druid way?',
      'What lunar influences am I noticing?',
      'How is my relationship with the elements deepening?',
      'What did dawn or dusk teach me today?',
      'How am I integrating Revival Druidry with ancient wisdom?',
      'What creative expression flowed through me today?',
      'How did I honor the spirits of place?',
      'What transformation is the current season bringing?',
      'How am I walking the path of the wise?',
      'What healing did I offer or receive today?',
      'How is my understanding of the Mysteries deepening?',
      'What does it mean to be a Druid in the modern world?'
    ]
  },
  {
    id: 'wiccan',
    name: 'Wicca / Paganism',
    description: 'Modern Wiccan and Neopagan traditions',
    icon: '⛤',
    color: '#7b68ee',
    hasPreset: false,
    libraryCategories: [
      'Foundational Texts',
      'Wheel of the Year',
      'Deity Work',
      'Magic & Spellwork',
      'Tools & Herbs',
      'Practice Styles',
      'Modern Traditions'
    ],
    journalingPrompts: [
      'How did I honor the divine feminine and masculine today?',
      'What moon phase energy am I feeling?',
      'What kind of change am I creating through my choices?',
      'How does this sabbat\'s theme connect to my life right now?',
      'What correspondences (colors, herbs, timing) am I noticing?',
      'How is my relationship with deity growing?',
      'What did my sacred space tell me today?',
      'What magical working am I contemplating?',
      'How did I connect with the Goddess today?',
      'How did I connect with the God today?',
      'What spell or ritual would serve my highest good right now?',
      'How am I honoring the ancestors in my practice?',
      'What herbs or plants called to me today?',
      'How is my Book of Shadows evolving?',
      'What did I learn about magical ethics today?',
      'How am I developing my intuition?',
      'What crystals or stones am I working with?',
      'How did I practice grounding and centering?',
      'What altar arrangement feels right for this time?',
      'How am I connecting with my coven or solitary practice?',
      'What tarot or oracle message did I receive?',
      'How am I honoring the full moon energy?',
      'What new moon intentions am I setting?',
      'How did I work with candle magic today?',
      'What protection practices do I need right now?',
      'How am I developing my relationship with familiars or animal spirits?',
      'What does the current esbat mean for my practice?',
      'How am I incorporating the elements into my work?',
      'What magical tools am I called to work with?',
      'How did I practice gratitude in a magical way?',
      'What shadow work is arising for me?',
      'How am I balancing light and dark in my practice?',
      'What seasonal energies am I harvesting?',
      'How did I honor the land spirits today?',
      'What divination practice served me today?',
      'How am I developing my visualization skills?',
      'What energy work did I practice?',
      'How is my understanding of the Craft deepening?',
      'What magical traditions am I drawn to explore?',
      'How did I practice self-care as a magical act?',
      'What offerings did I make today?',
      'How am I weaving magic into everyday life?',
      'What transformation is my practice bringing?',
      'How did I honor the cycles of birth, death, and rebirth?',
      'What wisdom from the Mighty Ones guides me now?',
      'How am I growing as a witch/practitioner?',
      'What magical boundaries do I need to set?',
      'How did I celebrate being a child of the Goddess and God?',
      'What does "Blessed Be" mean to me today?',
      'How am I living the Wiccan Rede in my choices?'
    ],
    subgroups: [
      {
        id: 'gardnerian',
        name: 'Gardnerian Wicca',
        description: 'Traditional initiatory Wicca founded by Gerald Gardner',
        icon: '🌙',
        color: '#4a0080',
        hasPreset: false
      },
      {
        id: 'alexandrian',
        name: 'Alexandrian Wicca',
        description: 'Initiatory tradition founded by Alex and Maxine Sanders',
        icon: '⭐',
        color: '#6a0dad',
        hasPreset: false
      },
      {
        id: 'dianic',
        name: 'Dianic Wicca',
        description: 'Goddess-focused feminist Wiccan tradition',
        icon: '🌕',
        color: '#c71585',
        hasPreset: false
      },
      {
        id: 'eclectic-wicca',
        name: 'Eclectic Wicca',
        description: 'Non-traditional Wicca drawing from multiple sources',
        icon: '✨',
        color: '#9370db',
        hasPreset: false
      },
      {
        id: 'asatru',
        name: 'Asatru / Heathenry',
        description: 'Norse and Germanic polytheistic reconstructionism',
        icon: '⚡',
        color: '#1e3a5f',
        hasPreset: false
      },
      {
        id: 'hellenism',
        name: 'Hellenism',
        description: 'Greek polytheistic reconstructionism honoring Olympian gods',
        icon: '🏛',
        color: '#daa520',
        hasPreset: false
      },
      {
        id: 'celtic-recon',
        name: 'Celtic Reconstructionism',
        description: 'Historical Celtic polytheism and practices',
        icon: '☘',
        color: '#228b22',
        hasPreset: false
      },
      {
        id: 'kemetic',
        name: 'Kemetic / Egyptian',
        description: 'Ancient Egyptian religious reconstructionism',
        icon: '𓂀',
        color: '#b8860b',
        hasPreset: false
      },
      {
        id: 'roman-recon',
        name: 'Roman Reconstructionism',
        description: 'Roman polytheistic tradition (Religio Romana)',
        icon: '🦅',
        color: '#8b0000',
        hasPreset: false
      },
      {
        id: 'eclectic-pagan',
        name: 'Eclectic Paganism',
        description: 'Personal paganism drawing from multiple traditions',
        icon: '🌿',
        color: '#2e8b57',
        hasPreset: false
      }
    ]
  },
  {
    id: 'buddhist',
    name: 'Buddhism',
    description: 'Buddhist meditation and mindfulness traditions',
    icon: '☸',
    color: '#ff9500',
    hasPreset: true,
    libraryCategories: [
      'Core Texts',
      'Meditation Practice',
      'Central Teachings',
      'Different Traditions',
      'Contemporary Teachers',
      'Ethics & Daily Life',
      'Working with Mind'
    ],
    journalingPrompts: [
      'Where did I notice things changing (impermanence) today?',
      'What am I holding onto that causes suffering?',
      'How did I practice mindful speech and action today?',
      'What difficulty arose, and what was feeding it?',
      'Where did I find opportunities for kindness (to myself and others)?',
      'How am I relating to my breath, body, and thoughts in meditation?',
      'What does "letting go" mean in this specific moment?',
      'How did I practice Right View today?',
      'What cravings or aversions arose and how did I respond?',
      'How am I cultivating equanimity?',
      'What insights arose during sitting practice?',
      'How did I practice loving-kindness (metta) today?',
      'What attachments am I beginning to see more clearly?',
      'How is my understanding of not-self (anatta) developing?',
      'What wholesome qualities did I cultivate today?',
      'How did I practice generosity (dana)?',
      'What unwholesome habits am I working to transform?',
      'How am I applying the Four Noble Truths to daily life?',
      'What aspect of the Eightfold Path needs attention?',
      'How did I practice patience today?',
      'What triggers my reactivity and how can I respond differently?',
      'How is my concentration (samadhi) developing?',
      'What wisdom (prajna) arose today?',
      'How did I practice ethical conduct (sila)?',
      'What am I learning about the nature of mind?',
      'How did I balance effort and relaxation in practice?',
      'What sangha connections supported me today?',
      'How am I working with difficult emotions?',
      'What does refuge in Buddha, Dharma, and Sangha mean today?',
      'How did I practice compassion (karuna)?',
      'What mental formations did I observe arising?',
      'How am I developing mindfulness in daily activities?',
      'What conditions gave rise to peace today?',
      'How did I practice Right Livelihood?',
      'What am I learning about cause and effect (karma)?',
      'How is my relationship with physical sensations changing?',
      'What does "beginner\'s mind" look like for me today?',
      'How did I practice sympathetic joy (mudita)?',
      'What am I learning about the middle way?',
      'How is my understanding of emptiness (sunyata) developing?',
      'What skillful means did I employ today?',
      'How did I transform obstacles into opportunities for practice?',
      'What does liberation look like in this moment?',
      'How am I serving others through my practice?',
      'What teachings am I studying and how do they apply?',
      'How did I maintain awareness during transitions today?',
      'What is my practice teaching me about identity?',
      'How am I cultivating the perfections (paramitas)?',
      'What does the present moment contain right now?',
      'How is my practice changing my relationship with the world?'
    ],
    subgroups: [
      {
        id: 'theravada',
        name: 'Theravada',
        description: 'Oldest surviving Buddhist school, emphasis on Pali Canon and monastic practice',
        icon: '🪷',
        color: '#ff8c00',
        hasPreset: false
      },
      {
        id: 'zen',
        name: 'Zen / Chan',
        description: 'Meditation-focused tradition emphasizing direct insight and koans',
        icon: '🎋',
        color: '#2f4f4f',
        hasPreset: false
      },
      {
        id: 'tibetan',
        name: 'Tibetan / Vajrayana',
        description: 'Tantric Buddhism with visualization, mantras, and deity practice',
        icon: '🏔',
        color: '#800020',
        hasPreset: false
      },
      {
        id: 'pure-land',
        name: 'Pure Land',
        description: 'Devotional Buddhism centered on Amitabha Buddha',
        icon: '🌸',
        color: '#ff69b4',
        hasPreset: false
      },
      {
        id: 'nichiren',
        name: 'Nichiren',
        description: 'Japanese Buddhism focused on Lotus Sutra and chanting',
        icon: '📿',
        color: '#ff4500',
        hasPreset: false
      },
      {
        id: 'soka-gakkai',
        name: 'Soka Gakkai (SGI)',
        description: 'Lay Nichiren Buddhist organization focused on peace and human revolution',
        icon: '🌏',
        color: '#0066cc',
        hasPreset: false
      },
      {
        id: 'vipassana',
        name: 'Vipassana / Insight',
        description: 'Insight meditation tradition, often secular-friendly',
        icon: '👁',
        color: '#daa520',
        hasPreset: false
      },
      {
        id: 'secular-buddhism',
        name: 'Secular Buddhism',
        description: 'Non-religious approach focusing on meditation and ethics',
        icon: '🧘',
        color: '#708090',
        hasPreset: false
      },
      {
        id: 'thich-nhat-hanh',
        name: 'Plum Village / Thich Nhat Hanh',
        description: 'Engaged Buddhism emphasizing mindfulness in daily life',
        icon: '🍑',
        color: '#da70d6',
        hasPreset: false
      }
    ]
  },
  {
    id: 'christian',
    name: 'Christianity',
    description: 'Christian contemplative and mystical traditions',
    icon: '✝',
    color: '#c9a227',
    hasPreset: true,
    libraryCategories: [
      'Scripture',
      'Prayer Life',
      'Christian Thought',
      'Mystics & Contemplatives',
      'Church History',
      'Living the Faith',
      'Your Tradition'
    ],
    journalingPrompts: [
      'Where did I experience God\'s love or presence today?',
      'What might God be inviting me toward in this situation?',
      'How am I living Jesus\'s teachings about love and justice?',
      'What Scripture spoke to me today, and why?',
      'Where do I need to offer or receive forgiveness?',
      'How did I serve others, especially the vulnerable?',
      'What does "taking up my cross" look like in my actual life?',
      'How did I practice Lectio Divina or contemplative reading?',
      'What fruit of the Spirit am I cultivating?',
      'How am I growing in faith, hope, and love?',
      'What did my prayer time reveal today?',
      'How am I practicing humility in my relationships?',
      'What am I learning about God\'s grace?',
      'How did I witness to my faith today?',
      'What spiritual discipline is calling me right now?',
      'How am I loving my neighbor as myself?',
      'What does "Thy will be done" mean in my current situation?',
      'How am I participating in the Body of Christ?',
      'What gifts am I using to serve the Church?',
      'How did I practice gratitude for God\'s blessings?',
      'What is the Holy Spirit teaching me?',
      'How am I growing in my understanding of the Trinity?',
      'What beatitude speaks to my life right now?',
      'How did I practice the corporal or spiritual works of mercy?',
      'What does dying to self look like today?',
      'How am I preparing my heart for worship?',
      'What does Christian community mean to me?',
      'How am I practicing stewardship of my gifts?',
      'What is God pruning in my life for greater fruitfulness?',
      'How did I resist temptation today?',
      'What does it mean to be salt and light in my context?',
      'How am I growing in trust during uncertainty?',
      'What prayer practice deepened my relationship with God?',
      'How did I seek first the Kingdom of God today?',
      'What is God\'s word for me in this season?',
      'How am I practicing sabbath rest?',
      'What does Christian hope look like in difficulty?',
      'How am I being transformed by the renewal of my mind?',
      'What does faithfulness look like in small things?',
      'How did I practice discernment today?',
      'What sacrifice of praise did I offer?',
      'How am I walking in the light?',
      'What does abiding in Christ mean practically?',
      'How am I caring for the least of these?',
      'What does it mean to put on the armor of God today?',
      'How is God working all things for good in my life?',
      'What confession or repentance is needed?',
      'How am I being a peacemaker?',
      'What does Christ-like character look like for me?'
    ],
    subgroups: [
      {
        id: 'catholic',
        name: 'Catholic',
        description: 'Roman Catholic tradition with sacraments, saints, and liturgical practices',
        icon: '⛪',
        color: '#8b0000',
        hasPreset: false
      },
      {
        id: 'orthodox',
        name: 'Eastern Orthodox',
        description: 'Orthodox Christian tradition with icons, hesychasm, and Divine Liturgy',
        icon: '☦',
        color: '#4a0080',
        hasPreset: false
      },
      {
        id: 'protestant',
        name: 'Protestant (General)',
        description: 'General Protestant tradition emphasizing Scripture and personal faith',
        icon: '✝',
        color: '#2e5a1c',
        hasPreset: false
      },
      {
        id: 'lutheran',
        name: 'Lutheran',
        description: 'Lutheran tradition with emphasis on grace, faith, and Scripture',
        icon: '🌹',
        color: '#1e3a5f',
        hasPreset: false
      },
      {
        id: 'anglican',
        name: 'Anglican / Episcopal',
        description: 'Anglican tradition blending Catholic and Protestant elements',
        icon: '🏰',
        color: '#6b2d5b',
        hasPreset: false
      },
      {
        id: 'methodist',
        name: 'Methodist',
        description: 'Methodist tradition with emphasis on personal holiness and social action',
        icon: '🔥',
        color: '#c41e3a',
        hasPreset: false
      },
      {
        id: 'baptist',
        name: 'Baptist',
        description: 'Baptist tradition emphasizing believer\'s baptism and congregational governance',
        icon: '💧',
        color: '#003366',
        hasPreset: false
      },
      {
        id: 'presbyterian',
        name: 'Presbyterian / Reformed',
        description: 'Reformed tradition with Calvinist theology and elder governance',
        icon: '📜',
        color: '#2c3e50',
        hasPreset: false
      },
      {
        id: 'pentecostal',
        name: 'Pentecostal / Charismatic',
        description: 'Spirit-filled tradition with gifts of the Spirit and expressive worship',
        icon: '🕊',
        color: '#ff6600',
        hasPreset: false
      },
      {
        id: 'quaker',
        name: 'Quaker (Friends)',
        description: 'Society of Friends with silent worship and Inner Light',
        icon: '🕯',
        color: '#708090',
        hasPreset: false
      },
      {
        id: 'mennonite',
        name: 'Mennonite / Anabaptist',
        description: 'Anabaptist tradition with pacifism and simple living',
        icon: '🌾',
        color: '#556b2f',
        hasPreset: false
      },
      {
        id: 'lds',
        name: 'Latter-day Saints (Mormon)',
        description: 'LDS tradition with Book of Mormon and temple practices',
        icon: '🏛',
        color: '#0047ab',
        hasPreset: false
      },
      {
        id: 'adventist',
        name: 'Seventh-day Adventist',
        description: 'Adventist tradition with Sabbath observance and health emphasis',
        icon: '🌅',
        color: '#006400',
        hasPreset: false
      },
      {
        id: 'mystical-christian',
        name: 'Christian Mysticism',
        description: 'Contemplative Christianity drawing from mystics like Meister Eckhart, Julian of Norwich',
        icon: '✨',
        color: '#9370db',
        hasPreset: false
      },
      {
        id: 'gnostic',
        name: 'Gnostic Christian',
        description: 'Gnostic tradition with emphasis on spiritual knowledge and divine spark',
        icon: '🔮',
        color: '#4b0082',
        hasPreset: false
      },
      {
        id: 'nondenominational',
        name: 'Non-denominational',
        description: 'Independent Christian practice not affiliated with specific denomination',
        icon: '🙏',
        color: '#696969',
        hasPreset: false
      }
    ]
  },
  {
    id: 'jewish',
    name: 'Judaism',
    description: 'Jewish spiritual practice and Kabbalah',
    icon: '✡',
    color: '#4a90d9',
    hasPreset: false,
    libraryCategories: [
      'Torah & Tanakh',
      'Rabbinic Wisdom',
      'Jewish Prayer',
      'Jewish Mysticism',
      'Jewish Calendar',
      'Jewish Ethics',
      'Jewish Thought'
    ],
    journalingPrompts: [
      'How did I honor rest and holiness (Shabbat spirit) today?',
      'What good deeds (mitzvot) did I do?',
      'Where did I sense the Divine Presence?',
      'How am I helping repair the world (Tikkun Olam)?',
      'What does this week\'s Torah portion teach about my situation?',
      'How does this holiday\'s meaning apply to me now?',
      'What blessings did I speak, and did I pause to really mean them?',
      'How did I practice tzedakah (righteous giving) today?',
      'What ethical teaching from the Talmud applies to my life?',
      'How am I honoring my parents and elders?',
      'What does teshuvah (return/repentance) look like for me now?',
      'How did I study Torah today?',
      'What does it mean to be a light unto the nations?',
      'How am I keeping the covenant in daily life?',
      'What middot (character traits) am I working to improve?',
      'How did I practice hospitality (hachnasat orchim)?',
      'What does the Shema mean to me today?',
      'How am I balancing din (judgment) and rachamim (mercy)?',
      'What wisdom from Pirkei Avot guides me now?',
      'How did I sanctify the ordinary today?',
      'What does l\'chaim (to life) mean in this moment?',
      'How am I connecting with Jewish community?',
      'What role does memory play in my Jewish practice?',
      'How did I honor the dead and comfort mourners?',
      'What does it mean to be created b\'tselem Elohim (in God\'s image)?',
      'How am I practicing shmirat halashon (guarding speech)?',
      'What questions am I wrestling with in my learning?',
      'How did I bring more light into the world today?',
      'What does the Havdalah separation teach about boundaries?',
      'How am I balancing particularism and universalism?',
      'What Jewish values guided my choices today?',
      'How did I practice gemilut chasadim (loving-kindness)?',
      'What does emunah (faith/trust) look like in uncertainty?',
      'How am I preparing for the next holy day?',
      'What does Jewish resilience teach me about my challenges?',
      'How did I make time holy today?',
      'What aspect of Jewish history speaks to my experience?',
      'How am I transmitting tradition to the next generation?',
      'What does it mean to walk in God\'s ways?',
      'How did I practice hakarat hatov (gratitude)?',
      'What does the mezuzah remind me of daily?',
      'How am I growing in yirat shamayim (awe of heaven)?',
      'What does my prayer practice need right now?',
      'How did I honor the sanctity of life today?',
      'What does Jewish joy (simcha) look like in my life?',
      'How am I being a mensch in my interactions?',
      'What does "justice, justice you shall pursue" require of me?'
    ],
    subgroups: [
      {
        id: 'orthodox-jewish',
        name: 'Orthodox',
        description: 'Traditional observance of halakha and Torah',
        icon: '📜',
        color: '#1a1a2e',
        hasPreset: false
      },
      {
        id: 'hasidic',
        name: 'Hasidic',
        description: 'Mystical Orthodox movement emphasizing joy and devekut',
        icon: '🕯',
        color: '#2c2c54',
        hasPreset: false
      },
      {
        id: 'conservative-jewish',
        name: 'Conservative / Masorti',
        description: 'Traditional practice with modern scholarship',
        icon: '⚖',
        color: '#3d5a80',
        hasPreset: false
      },
      {
        id: 'reform-jewish',
        name: 'Reform / Progressive',
        description: 'Liberal Judaism emphasizing ethics and personal autonomy',
        icon: '🌅',
        color: '#6a9fb5',
        hasPreset: false
      },
      {
        id: 'reconstructionist',
        name: 'Reconstructionist',
        description: 'Judaism as evolving civilization and culture',
        icon: '🔄',
        color: '#4a90d9',
        hasPreset: false
      },
      {
        id: 'jewish-renewal',
        name: 'Jewish Renewal',
        description: 'Neo-Hasidic movement blending mysticism and progressivism',
        icon: '✨',
        color: '#9b59b6',
        hasPreset: false
      },
      {
        id: 'kabbalistic',
        name: 'Kabbalistic Practice',
        description: 'Focus on Jewish mysticism and Tree of Life',
        icon: '🌳',
        color: '#3f51b5',
        hasPreset: false
      },
      {
        id: 'secular-jewish',
        name: 'Secular / Cultural',
        description: 'Cultural Jewish identity with humanistic values',
        icon: '📚',
        color: '#607d8b',
        hasPreset: false
      }
    ]
  },
  {
    id: 'hindu',
    name: 'Hinduism',
    description: 'Hindu spiritual practices and yoga traditions',
    icon: '🕉',
    color: '#ff6b35',
    hasPreset: false,
    libraryCategories: [
      'Vedas & Upanishads',
      'Bhagavad Gita',
      'Stories & Epics',
      'Yoga Paths',
      'Hindu Philosophy',
      'Devotional Practice',
      'Modern Teachers'
    ],
    journalingPrompts: [
      'How did I practice union (yoga) with the divine today?',
      'Which path calls to me: devotion (Bhakti), service (Karma), or wisdom (Jnana)?',
      'Where did I see the divine in everyday moments?',
      'How is my chosen form of God guiding me?',
      'What does right action (dharma) look like here?',
      'How am I working with the consequences of my actions (karma)?',
      'What does "You are That" (divine nature) mean for me today?',
      'How did I practice mantra repetition (japa)?',
      'What did my meditation reveal about the Self (Atman)?',
      'How am I cultivating detachment (vairagya)?',
      'What aspect of the Bhagavad Gita speaks to my situation?',
      'How did I offer my actions to the Divine?',
      'What maya (illusion) am I beginning to see through?',
      'How am I practicing ahimsa (non-violence) in thought, word, and deed?',
      'What devotional practice (puja) did I engage in?',
      'How is my understanding of the gunas (qualities) deepening?',
      'What teaching from my guru or lineage guides me now?',
      'How did I practice satsang (keeping holy company)?',
      'What samskaras (impressions) am I working to transform?',
      'How am I developing viveka (discrimination)?',
      'What does surrender (Ishvara pranidhana) look like today?',
      'How did I honor the sacred in my body through asana?',
      'What does the concept of lila (divine play) reveal?',
      'How am I practicing satya (truthfulness)?',
      'What insights arose during pranayama practice?',
      'How is my understanding of the chakras developing?',
      'What does santosha (contentment) mean in difficulty?',
      'How did I practice seva (selfless service)?',
      'What does the Upanishadic teaching reveal to me?',
      'How am I cultivating shanti (peace)?',
      'What aspect of deity worship draws my heart?',
      'How did I practice tapas (austerity/discipline)?',
      'What does liberation (moksha) mean in daily life?',
      'How am I honoring my teachers and the tradition?',
      'What does "Tat Tvam Asi" mean for how I treat others?',
      'How did I practice svadhyaya (self-study)?',
      'What festival or observance is shaping my practice?',
      'How am I balancing pravritti (action) and nivritti (withdrawal)?',
      'What does the teaching of the koshas reveal about my experience?',
      'How did I maintain awareness of the Divine throughout the day?',
      'What samskara (rite of passage) is relevant to my life stage?',
      'How is my relationship with my ishta devata (chosen deity) deepening?',
      'What does "Sarvam Khalvidam Brahman" (All is Brahman) mean practically?',
      'How am I integrating the wisdom of the Vedas?'
    ],
    subgroups: [
      {
        id: 'shaivism',
        name: 'Shaivism',
        description: 'Devotion to Shiva as supreme deity',
        icon: '🔱',
        color: '#1e3799',
        hasPreset: false
      },
      {
        id: 'vaishnavism',
        name: 'Vaishnavism',
        description: 'Devotion to Vishnu/Krishna/Rama as supreme',
        icon: '🪈',
        color: '#0652dd',
        hasPreset: false
      },
      {
        id: 'shaktism',
        name: 'Shaktism',
        description: 'Devotion to the Divine Feminine (Shakti/Devi)',
        icon: '🌺',
        color: '#e84393',
        hasPreset: false
      },
      {
        id: 'smartism',
        name: 'Smartism',
        description: 'Liberal tradition honoring multiple deities equally',
        icon: '🕉',
        color: '#ff9f43',
        hasPreset: false
      },
      {
        id: 'advaita',
        name: 'Advaita Vedanta',
        description: 'Non-dual philosophy emphasizing unity of Atman and Brahman',
        icon: '☀',
        color: '#ffd32a',
        hasPreset: false
      },
      {
        id: 'bhakti',
        name: 'Bhakti Yoga',
        description: 'Path of loving devotion to personal deity',
        icon: '💗',
        color: '#ff6b6b',
        hasPreset: false
      },
      {
        id: 'hatha-yoga',
        name: 'Hatha Yoga / Tantra',
        description: 'Physical and energetic practices, kundalini',
        icon: '🧘',
        color: '#6c5ce7',
        hasPreset: false
      },
      {
        id: 'iskcon',
        name: 'ISKCON / Hare Krishna',
        description: 'Gaudiya Vaishnavism with Krishna devotion',
        icon: '🪷',
        color: '#f39c12',
        hasPreset: false
      },
      {
        id: 'kriya-yoga',
        name: 'Kriya Yoga / SRF',
        description: 'Yogananda lineage emphasizing kriya techniques',
        icon: '🌟',
        color: '#00cec9',
        hasPreset: false
      }
    ]
  },
  {
    id: 'islamic',
    name: 'Islam',
    description: 'Islamic spiritual practice and Sufism',
    icon: '☪',
    color: '#2d8b5a',
    hasPreset: true,
    libraryCategories: [
      'Qur\'an',
      'Hadith Collections',
      'Five Pillars',
      'Sufi Mysticism',
      'Islamic Ethics',
      'Prayer & Practice',
      'Islamic Thought'
    ],
    journalingPrompts: [
      'How did I remember God throughout my day?',
      'Where did I practice excellence and beauty (ihsan) in my actions?',
      'What did prayer teach me today?',
      'How am I embodying God\'s attributes (the 99 Names)?',
      'Where do I need to practice patience (sabr)?',
      'How did I serve others through my actions?',
      'What does God-consciousness (taqwa) look like in this decision?',
      'How did I prepare my heart for salah today?',
      'What did I learn from reading Qur\'an?',
      'How am I practicing shukr (gratitude) to Allah?',
      'What does submission (islam) mean in this situation?',
      'How did I fulfill my obligations to family and community?',
      'What aspect of the Prophet\'s example (Sunnah) guides me?',
      'How am I growing in tawakkul (trust in God)?',
      'What dhikr (remembrance) practice deepened my connection?',
      'How did I practice istighfar (seeking forgiveness)?',
      'What does it mean to be a khalifah (steward) of the earth?',
      'How am I avoiding haram and pursuing halal?',
      'What did Jummah (Friday prayer) mean to me?',
      'How am I practicing hayaa (modesty and dignity)?',
      'What does the concept of ihtiram (respect) require today?',
      'How did I control my nafs (ego/desires)?',
      'What does Ramadan\'s spirit teach outside the month?',
      'How am I growing in ilm (knowledge)?',
      'What does it mean to have a sound heart (qalb salim)?',
      'How did I practice adab (proper conduct)?',
      'What charitable act (sadaqa) did I offer?',
      'How am I strengthening my iman (faith)?',
      'What does amanah (trustworthiness) require of me?',
      'How did I seek knowledge today?',
      'What does it mean to enjoin good and forbid wrong?',
      'How am I practicing haya (shyness before God)?',
      'What du\'a (supplication) is in my heart?',
      'How did I maintain wudu throughout the day?',
      'What does husn al-khuluq (good character) look like?',
      'How am I working toward ihsan in my worship?',
      'What does the ummah need from me today?',
      'How did I practice zuhd (detachment from worldly things)?',
      'What does muhasaba (self-accounting) reveal?',
      'How am I preparing for the akhirah (hereafter)?',
      'What does Rumi or other Sufi poetry teach me today?',
      'How did I practice muraqaba (meditation/watchfulness)?',
      'What does it mean that Allah is closer than my jugular vein?',
      'How am I expressing my love for the Prophet?'
    ],
    subgroups: [
      {
        id: 'sunni',
        name: 'Sunni',
        description: 'Largest branch following the Sunnah and consensus',
        icon: '☪',
        color: '#27ae60',
        hasPreset: false
      },
      {
        id: 'shia',
        name: 'Shia',
        description: 'Tradition following the Ahl al-Bayt (family of the Prophet)',
        icon: '🕌',
        color: '#2ecc71',
        hasPreset: false
      },
      {
        id: 'sufi',
        name: 'Sufism (General)',
        description: 'Islamic mysticism emphasizing inner purification',
        icon: '💫',
        color: '#1abc9c',
        hasPreset: false
      },
      {
        id: 'naqshbandi',
        name: 'Naqshbandi Order',
        description: 'Sufi order emphasizing silent dhikr and sobriety',
        icon: '🤍',
        color: '#16a085',
        hasPreset: false
      },
      {
        id: 'qadiri',
        name: 'Qadiri Order',
        description: 'Sufi order founded by Abdul-Qadir Gilani',
        icon: '🌙',
        color: '#1e8449',
        hasPreset: false
      },
      {
        id: 'mevlevi',
        name: 'Mevlevi Order (Whirling)',
        description: 'Rumi\'s lineage known for whirling meditation',
        icon: '🌀',
        color: '#17a589',
        hasPreset: false
      },
      {
        id: 'chishti',
        name: 'Chishti Order',
        description: 'South Asian Sufi order emphasizing love and music',
        icon: '🎵',
        color: '#45b39d',
        hasPreset: false
      },
      {
        id: 'progressive-islam',
        name: 'Progressive Islam',
        description: 'Liberal interpretations emphasizing ethics and reform',
        icon: '📖',
        color: '#3498db',
        hasPreset: false
      }
    ]
  },
  {
    id: 'taoist',
    name: 'Taoism',
    description: 'Taoist philosophy and practices',
    icon: '☯',
    color: '#5c6bc0',
    hasPreset: false,
    libraryCategories: [
      'Core Texts',
      'Taoist Philosophy',
      'Practice & Cultivation',
      'Classical Texts',
      'Religious Taoism',
      'Health Practices',
      'Modern Applications'
    ],
    journalingPrompts: [
      'Where did I practice non-forcing (wu wei) today?',
      'How am I flowing with life rather than struggling against it?',
      'What does "returning to simplicity" mean for me now?',
      'Where am I making things more complicated than they need to be?',
      'How did opposite forces (yin and yang) balance in my day?',
      'What wisdom does water teach about adapting?',
      'Where did I find the Way in ordinary moments?',
      'How did I cultivate stillness and inner quiet?',
      'What verse from the Tao Te Ching speaks to my situation?',
      'How am I practicing p\'u (the uncarved block)?',
      'What does yielding to overcome mean in this context?',
      'How did I embrace emptiness as fullness?',
      'What does the valley spirit teach about receptivity?',
      'How am I practicing te (virtue/power)?',
      'What did my qigong or tai chi practice reveal?',
      'How am I balancing activity and rest?',
      'What does "knowing when to stop" mean today?',
      'How did I practice tzu-jan (naturalness/spontaneity)?',
      'What attachments to outcomes am I releasing?',
      'How am I becoming like water today?',
      'What does the teaching of the uncarved block mean for my ambitions?',
      'How did I practice contentment with "enough"?',
      'What does "the Tao that can be spoken is not the eternal Tao" reveal?',
      'How am I letting things take their natural course?',
      'What inner alchemy is occurring in my practice?',
      'How did I maintain the "spirit of the valley"?',
      'What does softness overcoming hardness mean practically?',
      'How am I nourishing my life force (jing, qi, shen)?',
      'What does "governing a great country is like cooking a small fish" teach?',
      'How did I practice non-contention today?',
      'What does the concept of "reverse" teach about achievement?',
      'How am I cultivating ming (clarity/understanding)?',
      'What does Chuang Tzu\'s teaching illuminate for me?',
      'How did I let go of the need to control?',
      'What does "the usefulness of nothing" reveal?',
      'How am I honoring the feminine principle today?',
      'What does "acting without acting" look like in my situation?',
      'How did I practice observing without judging?',
      'What does longevity practice mean beyond physical health?',
      'How am I aligning with the rhythms of heaven and earth?',
      'What teaching about the "ten thousand things" applies today?',
      'How did I find the center amidst change?',
      'What does "return to the root" mean for my spiritual practice?'
    ],
    subgroups: [
      {
        id: 'philosophical-taoism',
        name: 'Philosophical Taoism',
        description: 'Focus on Tao Te Ching and Chuang Tzu teachings',
        icon: '📜',
        color: '#34495e',
        hasPreset: false
      },
      {
        id: 'religious-taoism',
        name: 'Religious Taoism',
        description: 'Liturgical tradition with deities and rituals',
        icon: '🏯',
        color: '#8e44ad',
        hasPreset: false
      },
      {
        id: 'quanzhen',
        name: 'Quanzhen (Complete Reality)',
        description: 'Monastic tradition emphasizing internal alchemy',
        icon: '⛰',
        color: '#2c3e50',
        hasPreset: false
      },
      {
        id: 'zhengyi',
        name: 'Zhengyi (Orthodox Unity)',
        description: 'Hereditary priesthood tradition with talismans',
        icon: '🎴',
        color: '#c0392b',
        hasPreset: false
      },
      {
        id: 'qigong',
        name: 'Qigong / Neigong',
        description: 'Energy cultivation and internal practices',
        icon: '🌬',
        color: '#3498db',
        hasPreset: false
      },
      {
        id: 'taiji',
        name: 'Tai Chi / Internal Arts',
        description: 'Moving meditation and martial cultivation',
        icon: '🥋',
        color: '#1abc9c',
        hasPreset: false
      }
    ]
  },
  {
    id: 'western-mystery',
    name: 'Western Mystery Tradition',
    description: 'Western esoteric and occult traditions',
    icon: '🔺',
    color: '#9c27b0',
    hasPreset: false,
    libraryCategories: [
      'Hermetic Philosophy',
      'Ceremonial Magic Systems',
      'Rosicrucian Teachings',
      'Hermetic Qabalah',
      'Esoteric Tarot',
      'Ritual Practice',
      'Modern Teachers'
    ],
    journalingPrompts: [
      'How did "As above, so below" show up today?',
      'Which sphere (sephirah) on the Tree of Life am I working with?',
      'What did today\'s tarot card reveal?',
      'How are the four elements (Earth/Air/Fire/Water) balanced in my life?',
      'What does the Great Work (self-transformation) require today?',
      'Where am I in my alchemical process?',
      'How is my Higher Self guiding me?',
      'What planetary influence is dominant in my life right now?',
      'How did I practice the Lesser Banishing Ritual of the Pentagram?',
      'What path on the Tree of Life am I traversing?',
      'How am I balancing the pillars of Mercy and Severity?',
      'What did my magical journal reveal about patterns in my practice?',
      'How am I developing my astral senses?',
      'What ceremonial work is calling to me?',
      'How did I invoke or banish energies today?',
      'What is my current understanding of the grades of initiation?',
      'How am I working with the archangels of the quarters?',
      'What Hebrew letter am I meditating on?',
      'How is my understanding of the Emerald Tablet deepening?',
      'What magical weapons am I developing proficiency with?',
      'How did I practice vibration of divine names?',
      'What aspect of the Middle Pillar am I strengthening?',
      'How am I integrating Neoplatonic philosophy into my practice?',
      'What skrying or vision work have I undertaken?',
      'How did I work with talismans or sigils today?',
      'What Enochian work am I studying or practicing?',
      'How am I developing knowledge and conversation with my Holy Guardian Angel?',
      'What does crossing the Abyss mean for my current stage?',
      'How am I applying the Hermetic principles in daily life?',
      'What magical correspondences am I learning?',
      'How did I practice assumption of god-forms?',
      'What astral temple work have I done?',
      'How is my dream practice developing?',
      'What does the symbolism of the Rose Cross reveal?',
      'How am I working with the tattwas?',
      'What geomantic insights have I received?',
      'How did I practice ritual purification?',
      'What is my relationship with my magical lineage?',
      'How am I developing my magical memory?',
      'What tests and trials am I facing on the path?',
      'How did I practice circumambulation or other ritual movement?',
      'What does the symbolism of the Vault reveal?',
      'How am I balancing the work of the inner and outer orders?',
      'What magical oaths or commitments guide my practice?',
      'How did I practice the Middle Pillar exercise?',
      'What does the Lightning Flash mean for manifestation?',
      'How am I developing proficiency in ritual construction?',
      'What mysteries are being unveiled in my current grade work?',
      'How did I honor the Western Mystery tradition today?'
    ],
    subgroups: [
      {
        id: 'golden-dawn',
        name: 'Golden Dawn',
        description: 'Hermetic Order of the Golden Dawn ceremonial magic system',
        icon: '☀',
        color: '#ffd700',
        hasPreset: false
      },
      {
        id: 'thelema',
        name: 'Thelema',
        description: 'Aleister Crowley\'s magical philosophy - "Do what thou wilt"',
        icon: '⭐',
        color: '#e74c3c',
        hasPreset: false
      },
      {
        id: 'bota',
        name: 'BOTA (Builders of the Adytum)',
        description: 'Paul Foster Case\'s Tarot and Qabalah school',
        icon: '🏛',
        color: '#9b59b6',
        hasPreset: false
      },
      {
        id: 'rosicrucian',
        name: 'Rosicrucianism',
        description: 'Rosicrucian orders (AMORC, Rosicrucian Fellowship, etc.)',
        icon: '🌹',
        color: '#c0392b',
        hasPreset: false
      },
      {
        id: 'hermetic',
        name: 'Hermeticism',
        description: 'Classical Hermetic philosophy and Corpus Hermeticum',
        icon: '⚚',
        color: '#2ecc71',
        hasPreset: false
      },
      {
        id: 'martinism',
        name: 'Martinism',
        description: 'Christian mystical tradition from Louis-Claude de Saint-Martin',
        icon: '💜',
        color: '#8e44ad',
        hasPreset: false
      },
      {
        id: 'esoteric-freemasonry',
        name: 'Esoteric Freemasonry',
        description: 'Mystical and initiatory aspects of Masonic tradition',
        icon: '📐',
        color: '#34495e',
        hasPreset: false
      },
      {
        id: 'chaos-magic',
        name: 'Chaos Magic',
        description: 'Postmodern results-based magical practice',
        icon: '🌀',
        color: '#1abc9c',
        hasPreset: false
      },
      {
        id: 'enochian',
        name: 'Enochian Magic',
        description: 'Angelic magic system from Dee and Kelley',
        icon: '👼',
        color: '#3498db',
        hasPreset: false
      },
      {
        id: 'solomonic',
        name: 'Solomonic / Grimoire',
        description: 'Traditional grimoire magic and spirit work',
        icon: '📕',
        color: '#2c3e50',
        hasPreset: false
      },
      {
        id: 'wiccan-ceremonial',
        name: 'Ceremonial Witchcraft',
        description: 'Blend of Wiccan and ceremonial magical practices',
        icon: '🌙',
        color: '#6c5ce7',
        hasPreset: false
      }
    ]
  },
  {
    id: 'kabbalah',
    name: 'Kabbalah',
    description: 'Jewish mysticism and Tree of Life work',
    icon: '🌲',
    color: '#3f51b5',
    hasPreset: false,
    libraryCategories: [
      'Hermetic Qabalah Texts',
      'Tree of Life Studies',
      'Meditation Practices',
      'Gematria & Symbolism',
      'Tarot Integration',
      'Practical Application',
      'Modern Teachers'
    ],
    journalingPrompts: [
      'Which sphere (sephirah) is most present in my life now?',
      'What holy sparks (hidden potential) did I discover today?',
      'How is divine energy flowing through me?',
      'What does this Hebrew letter teach me?',
      'How am I balancing mercy (Chesed) and strength (Gevurah)?',
      'What needs repair or restoration in my life?',
      'Where did I sense the divine presence today?',
      'How am I working with the path between two sephiroth?',
      'What does the Tree of Life reveal about my current situation?',
      'How am I experiencing Kether (Crown) in meditation?',
      'What wisdom (Chokmah) is trying to emerge?',
      'How is understanding (Binah) developing in my practice?',
      'What does Da\'at (Knowledge) teach about the Abyss?',
      'How am I expressing Chesed (Loving-kindness) today?',
      'What boundaries does Gevurah (Strength) require?',
      'How is Tiphereth (Beauty) bringing balance?',
      'What victories is Netzach (Eternity) bringing?',
      'How is Hod (Splendor) supporting my intellectual understanding?',
      'What dreams or visions came through Yesod (Foundation)?',
      'How am I grounding through Malkuth (Kingdom)?',
      'What partzuf (divine face) am I contemplating?',
      'How am I working with the four worlds (Atziluth, Briah, Yetzirah, Assiah)?',
      'What qliphothic shadows am I encountering?',
      'How is the Shekinah (divine presence) manifesting?',
      'What does the concept of tzimtzum (contraction) teach me?',
      'How am I practicing tikkun (repair)?',
      'What vessels are breaking and reforming in my life?',
      'How am I contemplating Ein Sof (the Infinite)?',
      'What does the Zohar teaching illuminate?',
      'How is my understanding of the sefirot deepening?',
      'What are the three pillars teaching me about balance?',
      'How am I working with the Hebrew letters as creative forces?',
      'What gematria insights have come through?',
      'How is my relationship with angelic forces developing?',
      'What does the Bahir teaching reveal?',
      'How am I meditating on the divine names?',
      'What aspect of Lurianic Kabbalah speaks to me now?',
      'How am I raising the sparks through mindful action?',
      'What does devekut (cleaving to God) feel like today?',
      'How is hitbonenut (contemplation) developing?',
      'What does the doctrine of gilgul (reincarnation) suggest?',
      'How am I working with the 72 names of God?',
      'What does the merkavah (chariot) vision teach?',
      'How is the Tree reflected in my body?',
      'What does the concept of ratzo v\'shov (running and returning) mean?',
      'How am I balancing study and practice in Kabbalah?',
      'What traditional teacher\'s interpretation guides me now?',
      'How is my understanding of the sefirot as divine attributes growing?',
      'What does it mean to walk the paths of the Tree today?'
    ],
    subgroups: [
      {
        id: 'jewish-kabbalah',
        name: 'Traditional Jewish Kabbalah',
        description: 'Authentic Jewish mystical tradition (Zohar, Lurianic)',
        icon: '✡',
        color: '#1a237e',
        hasPreset: false
      },
      {
        id: 'hermetic-qabalah',
        name: 'Hermetic Qabalah',
        description: 'Western occult adaptation used in ceremonial magic',
        icon: '🔺',
        color: '#7b1fa2',
        hasPreset: false
      },
      {
        id: 'christian-cabala',
        name: 'Christian Cabala',
        description: 'Renaissance Christian mystical interpretation',
        icon: '✝',
        color: '#c62828',
        hasPreset: false
      },
      {
        id: 'kabbalah-centre',
        name: 'Kabbalah Centre',
        description: 'Modern popularized Kabbalah teachings',
        icon: '💫',
        color: '#e65100',
        hasPreset: false
      }
    ]
  },
  {
    id: 'alchemy',
    name: 'Alchemy',
    description: 'Hermetic and alchemical traditions',
    icon: '⚗',
    color: '#ffc107',
    hasPreset: false,
    libraryCategories: [
      'Classical Alchemy',
      'Spiritual/Inner Alchemy',
      'Laboratory Practice',
      'Alchemical Symbolism',
      'Hermetic Foundation',
      'Contemporary Practice',
      'Life Application'
    ],
    journalingPrompts: [
      'What transformation stage am I in: Breaking down (Nigredo), Purifying (Albedo), Awakening (Citrinitas), or Integrating (Rubedo)?',
      'What needs to dissolve or break down in my life right now?',
      'How am I purifying my intentions and clarifying my path?',
      'What is becoming conscious that was hidden?',
      'Where is full integration and wholeness happening?',
      'What is my raw material (prima materia) for transformation?',
      'How am I turning difficulties (lead) into wisdom (gold)?',
      'What does "solve et coagula" (dissolve and coagulate) mean in my current situation?',
      'How is the philosopher\'s stone forming within me?',
      'What is my mercury (mind/spirit) doing today?',
      'How is my sulfur (soul/desire) expressing itself?',
      'What does my salt (body/manifestation) need?',
      'How am I working with the conjunction of opposites?',
      'What calcination is burning away the false?',
      'How is dissolution releasing old patterns?',
      'What is separating out through the separation stage?',
      'What is joining together in conjunction?',
      'How is fermentation bringing new life?',
      'What is distilling to its essence through distillation?',
      'What is solidifying through coagulation?',
      'How am I working with the alchemical vessel (vas)?',
      'What does the hermetically sealed container teach about boundaries?',
      'How is the fire of transformation being regulated?',
      'What peacock\'s tail (cauda pavonis) colors am I seeing?',
      'How is the white stone (albedo achievement) manifesting?',
      'What does the red king and white queen represent in my life?',
      'How am I working with the philosophical mercury?',
      'What uroboros (serpent eating its tail) patterns do I notice?',
      'How is the green lion (raw vital force) expressing?',
      'What does the black crow (nigredo symbol) represent now?',
      'How am I working with the white swan (purification)?',
      'What does the phoenix (rebirth) mean for my transformation?',
      'How is the union of sun and moon occurring within?',
      'What laboratory work mirrors my inner work?',
      'How am I studying the classic alchemical texts?',
      'What does Maria Prophetissa\'s axiom ("One becomes Two...") reveal?',
      'How is my understanding of the Emerald Tablet deepening?',
      'What spagyric work am I drawn to?',
      'How am I working with plant alchemy?',
      'What does the quintessence (fifth element) represent?',
      'How is the alchemical marriage (coniunctio) progressing?',
      'What does the alchemical child (filius philosophorum) symbolize?',
      'How am I serving as my own alchemist?',
      'What patience is the Great Work requiring?',
      'How is Nature guiding my transformation?',
      'What does "Ora et Labora" (pray and work) mean for my practice?',
      'How am I integrating alchemical wisdom into daily life?',
      'What is the gold that my soul is becoming?'
    ],
    subgroups: [
      {
        id: 'spiritual-alchemy',
        name: 'Spiritual Alchemy',
        description: 'Inner transformation and psychological work',
        icon: '🔥',
        color: '#ff9800',
        hasPreset: false
      },
      {
        id: 'laboratory-alchemy',
        name: 'Laboratory Alchemy',
        description: 'Practical spagyric and laboratory work',
        icon: '⚗',
        color: '#4caf50',
        hasPreset: false
      },
      {
        id: 'jungian-alchemy',
        name: 'Jungian / Psychological',
        description: 'Alchemical symbolism in depth psychology',
        icon: '🧠',
        color: '#9c27b0',
        hasPreset: false
      }
    ]
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    description: 'Secular philosophical and contemplative practices',
    icon: '📚',
    color: '#607d8b',
    hasPreset: false,
    libraryCategories: [
      'Ancient Philosophy',
      'Medieval Thought',
      'Modern Philosophy',
      'Contemporary Ideas',
      'Ethics & Virtue',
      'Knowledge & Truth',
      'Critical Thinking'
    ],
    journalingPrompts: [
      'What assumptions am I making that I should question?',
      'How do I really know what I think I know?',
      'What does a good life look like for me?',
      'What quality or virtue do I need to develop right now?',
      'What would a Stoic philosopher suggest in this situation?',
      'How am I practicing practical wisdom (phronesis)?',
      'What philosophical questions showed up in ordinary life today?',
      'What is within my control and what is not?',
      'How am I practicing negative visualization (premeditatio malorum)?',
      'What does eudaimonia (flourishing) look like today?',
      'How am I distinguishing appearance from reality?',
      'What would Socrates ask about my current beliefs?',
      'How am I practicing the examined life?',
      'What logical fallacies am I prone to?',
      'How is my understanding of virtue ethics developing?',
      'What does Aristotle\'s mean between extremes reveal?',
      'How am I practicing amor fati (love of fate)?',
      'What attachment to outcomes is causing suffering?',
      'How did I practice memento mori (remembrance of death)?',
      'What would Marcus Aurelius write about my day?',
      'How am I developing temperance today?',
      'What does courage look like in small moments?',
      'How am I practicing justice in my relationships?',
      'What does wisdom require in this situation?',
      'How am I balancing pleasure and meaning?',
      'What would Epicurus say about my desires?',
      'How am I cultivating ataraxia (tranquility)?',
      'What role does friendship play in my good life?',
      'How am I engaging with philosophical texts?',
      'What Platonic Forms am I perceiving shadows of?',
      'How is my understanding of the allegory of the cave deepening?',
      'What does Plotinus teach about the One?',
      'How am I practicing ascent to higher understanding?',
      'What does Sartre\'s radical freedom mean for my choices?',
      'How am I creating meaning in a seemingly meaningless universe?',
      'What does authenticity require of me today?',
      'How am I facing existential anxiety?',
      'What would Camus say about my struggles?',
      'How am I embracing the absurd while persevering?',
      'What does Nietzsche\'s will to power illuminate?',
      'How am I becoming who I am?',
      'What values am I creating rather than inheriting?',
      'How did I practice intellectual humility today?',
      'What cognitive biases did I notice in myself?',
      'How am I balancing skepticism with commitment?',
      'What does suspension of judgment offer in this situation?',
      'How is philosophy changing how I live, not just think?',
      'What philosopher would I want as a life guide?',
      'How am I integrating contemplation with action?',
      'What does philosophy teach about my mortality today?'
    ],
    subgroups: [
      {
        id: 'stoicism',
        name: 'Stoicism',
        description: 'Ancient Greco-Roman philosophy of virtue and resilience',
        icon: '🏛',
        color: '#455a64',
        hasPreset: false
      },
      {
        id: 'epicureanism',
        name: 'Epicureanism',
        description: 'Philosophy of pleasure, friendship, and ataraxia',
        icon: '🍃',
        color: '#4caf50',
        hasPreset: false
      },
      {
        id: 'platonism',
        name: 'Platonism / Neoplatonism',
        description: 'Philosophy of Forms and spiritual ascent',
        icon: '💎',
        color: '#3f51b5',
        hasPreset: false
      },
      {
        id: 'existentialism',
        name: 'Existentialism',
        description: 'Philosophy of authentic existence and meaning-making',
        icon: '🎭',
        color: '#37474f',
        hasPreset: false
      },
      {
        id: 'secular-humanism',
        name: 'Secular Humanism',
        description: 'Human-centered ethics without supernatural beliefs',
        icon: '🌍',
        color: '#2196f3',
        hasPreset: false
      },
      {
        id: 'naturalism',
        name: 'Naturalism / Pantheism',
        description: 'Nature-centered spirituality without deities',
        icon: '🌳',
        color: '#388e3c',
        hasPreset: false
      },
      {
        id: 'absurdism',
        name: 'Absurdism',
        description: 'Camus-inspired embrace of life\'s absurdity',
        icon: '🎪',
        color: '#ff5722',
        hasPreset: false
      },
      {
        id: 'pyrrhonism',
        name: 'Pyrrhonism / Skepticism',
        description: 'Ancient skeptical practice of suspension of judgment',
        icon: '⚖',
        color: '#78909c',
        hasPreset: false
      }
    ]
  },
  {
    id: 'jedi',
    name: 'Jediism',
    description: 'Jedi-inspired spiritual practice',
    icon: '⚔',
    color: '#00bcd4',
    hasPreset: false,
    libraryCategories: [
      'Star Wars as Mythology',
      'Jedi Philosophy',
      'Practice Methods',
      'Jedi Ethics',
      'Real-World Communities',
      'Comparative Studies',
      'Character Teachings'
    ],
    journalingPrompts: [
      'How did I serve life (the Living Force) today?',
      'Where did I feel connected to the flow of life (the Force)?',
      'What does "do or do not, there is no try" mean for my current challenge?',
      'How am I balancing compassion with healthy boundaries?',
      'What would Qui-Gon suggest I do here?',
      'Where am I letting fear create suffering?',
      'How did I practice being present in each moment?',
      'What attachments am I clinging to that I need to release?',
      'How did I practice the Jedi path of service today?',
      'What does "peace over anger" mean in this situation?',
      'How am I developing serenity in chaos?',
      'What would Yoda teach about patience in my current struggle?',
      'How is the Force flowing through my decisions?',
      'What does "there is no emotion, there is peace" teach me?',
      'How am I balancing passion with discipline?',
      'What would Obi-Wan say about my current perspective?',
      'How did I practice mindfulness like a Jedi today?',
      'What does the balance between light and dark teach?',
      'How am I being a guardian of peace and justice?',
      'What training or study am I pursuing?',
      'How did I practice non-attachment while still caring?',
      'What does "there is no death, there is the Force" mean for me?',
      'How am I developing my intuition and inner knowing?',
      'What would Luke\'s journey teach about my own path?',
      'How did I resist the temptation of the dark side today?',
      'What does mastery of self look like in practice?',
      'How am I letting go of the need to control outcomes?',
      'What aspect of Jedi philosophy needs more reflection?',
      'How did I practice diplomacy before conflict?',
      'What would Mace Windu say about clarity of purpose?',
      'How am I living the Jedi Code in practical ways?',
      'What sacrifice or selflessness did I practice?',
      'How did I demonstrate courage without aggression?',
      'What does the Jedi path teach about ego?',
      'How am I being a student as well as a teacher?',
      'What symbolic meaning in Star Wars applies to my life?',
      'How did I practice "letting go of everything I fear to lose"?',
      'What does the relationship between master and apprentice teach?',
      'How am I developing focus and concentration?',
      'What real-world philosophy does Jediism draw from that I can study?',
      'How did I protect those who cannot protect themselves?',
      'What does redemption and transformation mean on my path?',
      'How am I being a "luminous being"?',
      'What does trusting my feelings reveal?',
      'How did I practice Jedi values in my community?',
      'What aspect of mythology and archetypal wisdom speaks to me?',
      'How am I walking the path of the Jedi today?'
    ]
  },
  {
    id: 'native-american',
    name: 'Native American',
    description: 'Indigenous traditions of North America',
    icon: '🦅',
    color: '#8B4513',
    hasPreset: false,
    libraryCategories: [
      'Books by Indigenous Authors',
      'Tribal-Specific Teachings',
      'Cultural Understanding',
      'Respectful Study',
      'Supporting Indigenous Voices',
      'Nature Relationship',
      'Decolonization Resources'
    ],
    journalingPrompts: [
      'What am I learning about the original peoples of this land?',
      'How can I support Indigenous sovereignty and rights?',
      'What does respectful learning (vs. appropriation) look like?',
      'How am I honoring that this land has Indigenous stewards?',
      'What Indigenous voices am I listening to and supporting?',
      'How does Indigenous wisdom challenge my assumptions about nature?',
      'What does decolonization mean in my context?',
      'What books by Indigenous authors am I studying?',
      'How am I learning the history of the tribes whose land I occupy?',
      'What does "all my relations" teach about interconnection?',
      'How am I supporting Indigenous-led organizations?',
      'What does walking in balance mean in my life?',
      'How am I learning to listen to the land?',
      'What does the teaching of the seven generations mean for my choices?',
      'How am I examining my own settler privilege?',
      'What Indigenous artists or creators am I supporting?',
      'How does the concept of land back challenge my assumptions?',
      'What does reciprocity with the earth look like?',
      'How am I learning without appropriating or consuming?',
      'What treaties affect the land where I live?',
      'How does Indigenous resistance inspire my own activism?',
      'What does it mean to be a good ancestor?',
      'How am I teaching others about respectful engagement?',
      'What medicine teachings can I learn about (not practice) respectfully?',
      'How does circular thinking differ from linear Western thought?',
      'What does the concept of time in Indigenous worldviews teach?',
      'How am I supporting tribal sovereignty politically?',
      'What role does storytelling play in Indigenous cultures I\'m learning about?',
      'How does Indigenous knowledge challenge academic hierarchies?',
      'What Native podcasts, films, or media am I engaging with?',
      'How am I being accountable to Indigenous communities?',
      'What does sacred mean in Indigenous contexts versus my own?',
      'How am I learning about specific tribal traditions rather than generalizing?',
      'What does water protector activism teach about sacred duty?',
      'How am I examining the impact of colonization on my own worldview?',
      'What Indigenous language revitalization efforts can I support?',
      'How does Indigenous feminism inform my understanding?',
      'What does two-spirit identity teach about gender?',
      'How am I contributing to Indigenous futures?',
      'What ceremonies can I participate in if invited (vs. closed practices)?',
      'How am I building genuine relationships rather than extracting knowledge?',
      'What does environmental justice mean in an Indigenous framework?',
      'How am I honoring rather than romanticizing Indigenous peoples?',
      'What does healing colonial trauma require of non-Indigenous people?',
      'How am I being a respectful learner and ally?',
      'What does it mean to be in right relationship with this land?'
    ],
    culturalNote: 'Many Native practices are closed (not for non-Native people). Study ABOUT traditions respectfully, learn from Indigenous authors only, and support Indigenous sovereignty.',
    subgroups: [
      {
        id: 'red-road',
        name: 'Red Road / Pan-Indian',
        description: 'Intertribal spiritual path emphasizing harmony with all creation',
        icon: '🌄',
        color: '#8B0000',
        hasPreset: false
      },
      {
        id: 'lakota',
        name: 'Lakota / Sioux',
        description: 'Lakota spiritual tradition including sweat lodge, vision quest, and sun dance',
        icon: '🦬',
        color: '#654321',
        hasPreset: false
      },
      {
        id: 'navajo',
        name: 'Diné (Navajo)',
        description: 'Navajo Way emphasizing hózhó (beauty, balance, harmony)',
        icon: '🌅',
        color: '#CD853F',
        hasPreset: false
      },
      {
        id: 'cherokee',
        name: 'Cherokee',
        description: 'Cherokee spiritual tradition and medicine ways',
        icon: '🍂',
        color: '#8B4513',
        hasPreset: false
      },
      {
        id: 'choctaw',
        name: 'Choctaw',
        description: 'Choctaw spiritual practices and ceremonial traditions',
        icon: '🌾',
        color: '#A0522D',
        hasPreset: false
      },
      {
        id: 'ojibwe',
        name: 'Ojibwe / Anishinaabe',
        description: 'Anishinaabe spiritual tradition including Midewiwin',
        icon: '🐢',
        color: '#2F4F4F',
        hasPreset: false
      },
      {
        id: 'hopi',
        name: 'Hopi',
        description: 'Hopi ceremonial tradition and kachina spirituality',
        icon: '🏜',
        color: '#DAA520',
        hasPreset: false
      },
      {
        id: 'apache',
        name: 'Apache',
        description: 'Apache spiritual traditions including Sunrise Ceremony',
        icon: '⛰',
        color: '#704214',
        hasPreset: false
      },
      {
        id: 'iroquois',
        name: 'Haudenosaunee (Iroquois)',
        description: 'Iroquois Confederacy spiritual traditions and Longhouse religion',
        icon: '🌲',
        color: '#228B22',
        hasPreset: false
      },
      {
        id: 'creek',
        name: 'Muscogee (Creek)',
        description: 'Muscogee ceremonial traditions including Green Corn Ceremony',
        icon: '🌽',
        color: '#B8860B',
        hasPreset: false
      },
      {
        id: 'pueblo',
        name: 'Pueblo',
        description: 'Pueblo peoples\' kiva traditions and seasonal ceremonies',
        icon: '🏛',
        color: '#D2691E',
        hasPreset: false
      },
      {
        id: 'pacific-northwest',
        name: 'Pacific Northwest Coast',
        description: 'Traditions of Pacific Northwest tribes including potlatch',
        icon: '🐋',
        color: '#4682B4',
        hasPreset: false
      },
      {
        id: 'native-american-church',
        name: 'Native American Church',
        description: 'Pan-Indian peyote religion blending indigenous and Christian elements',
        icon: '🌵',
        color: '#556B2F',
        hasPreset: false
      },
      {
        id: 'native-general',
        name: 'General / Unspecified',
        description: 'General Native American spirituality or multi-tribal practice',
        icon: '🪶',
        color: '#8B4513',
        hasPreset: false
      }
    ]
  },
  {
    id: 'shinto',
    name: 'Shinto',
    description: 'Japanese indigenous spiritual tradition',
    icon: '⛩',
    color: '#e91e63',
    hasPreset: false,
    libraryCategories: [
      'Core Texts',
      'Kami Understanding',
      'Shrine Culture',
      'Purity & Practice',
      'Festivals & Seasons',
      'Shinto-Buddhism Relationship',
      'Cultural Context'
    ],
    journalingPrompts: [
      'Where did I notice the sacred in nature today?',
      'How did I practice cleanliness (physical and spiritual)?',
      'What am I genuinely grateful for right now?',
      'How am I honoring my ancestors in my actions?',
      'What does harmony in relationships look like today?',
      'What natural place feels sacred to me?',
      'How can I maintain purity of intention in my choices?',
      'What kami (sacred spirit) am I sensing in nature?',
      'How did I practice misogi (purification)?',
      'What does makoto (sincerity of heart) mean in my actions?',
      'How am I cultivating kannagara (living in harmony with kami)?',
      'What seasonal festival energy am I feeling?',
      'How did I show reverence at a sacred site or altar?',
      'What does the teaching of musubi (creative interconnection) reveal?',
      'How am I honoring the kami of my home?',
      'What natural object holds sacred presence for me?',
      'How did I practice harae (ritual purification)?',
      'What does the concept of kegare (impurity) teach about boundaries?',
      'How am I maintaining my kamidana (home shrine) or sacred space?',
      'What offerings did I make with sincere heart?',
      'How does the torii gate symbolism apply to my transitions?',
      'What does shimenawa (sacred rope) teach about marking the sacred?',
      'How am I living with awareness of kami presence?',
      'What ancestor spirit am I connecting with?',
      'How did I clap hands and bow with presence?',
      'What does the mirror symbol teach about self-reflection?',
      'How am I studying the Kojiki or Nihongi teachings?',
      'What matsuri (festival) energy am I cultivating?',
      'How does the concept of en (fate/connection) apply today?',
      'What does Amaterasu (sun goddess) energy illuminate?',
      'How am I honoring the mountains, rivers, or sea?',
      'What tree holds sacred presence in my environment?',
      'How did I practice mindful eating with gratitude?',
      'What does the teaching of agatsu (self-victory) mean?',
      'How am I embodying the warrior\'s reverence for nature?',
      'What children or young people teach me about wonder?',
      'How did I practice aesthetic appreciation (mono no aware)?',
      'What does the simplicity of shrine architecture teach?',
      'How am I integrating Shinto with Buddhist practice (if applicable)?',
      'What rock, waterfall, or tree seems to be a dwelling of kami?',
      'How did I begin the day with ritual purity?',
      'What does wabi-sabi (imperfect beauty) reveal?',
      'How am I honoring the four seasons in my practice?',
      'What local kami of place am I coming to know?',
      'How did I express gratitude before eating today?',
      'What does the red sun symbolize for new beginnings?',
      'How am I walking the way of the kami in daily life?'
    ],
    subgroups: [
      {
        id: 'shrine-shinto',
        name: 'Shrine Shinto',
        description: 'Traditional shrine-based practice and kami worship',
        icon: '⛩',
        color: '#c2185b',
        hasPreset: false
      },
      {
        id: 'folk-shinto',
        name: 'Folk Shinto',
        description: 'Popular folk practices, festivals, and local kami',
        icon: '🎏',
        color: '#d81b60',
        hasPreset: false
      },
      {
        id: 'sect-shinto',
        name: 'Sect Shinto',
        description: 'Organized Shinto movements (Tenrikyo, Konkokyo, etc.)',
        icon: '🏔',
        color: '#ad1457',
        hasPreset: false
      },
      {
        id: 'shinto-buddhist',
        name: 'Shinbutsu-shūgō',
        description: 'Syncretic Shinto-Buddhist practice',
        icon: '☯',
        color: '#880e4f',
        hasPreset: false
      }
    ]
  },
  {
    id: 'indigenous',
    name: 'Indigenous / Earth-Based',
    description: 'Various indigenous and earth-based traditions',
    icon: '🌍',
    color: '#8d6e63',
    hasPreset: false,
    libraryCategories: [
      'Animism & Spirit Work',
      'Your Bioregion',
      'Ancestral Practices',
      'Modern Earth-Based Paths',
      'Cultural Respect',
      'Land Relationship',
      'Earth-Centered Ethics'
    ],
    journalingPrompts: [
      'How did I connect with the land I actually live on today?',
      'What spirits or energies do I sense in this place?',
      'How am I honoring the Indigenous peoples whose land this is?',
      'What is this season teaching me in my own experience?',
      'How did I practice give-and-take (reciprocity) with the earth?',
      'What earth-based traditions did MY ancestors practice?',
      'Where did I feel most connected to the living world?',
      'What animal appeared as a messenger today?',
      'How am I listening to the voice of the wind?',
      'What do the stones and crystals have to teach?',
      'How am I honoring the spirit of water?',
      'What plant ally is calling for my attention?',
      'How did I practice sacred reciprocity today?',
      'What ancestor wisdom am I reconnecting with?',
      'How is the moon affecting my energy?',
      'What does the sunrise or sunset reveal?',
      'How am I developing relationship with the spirits of place?',
      'What shamanic journey or vision work is calling me?',
      'How did I make an offering to the land?',
      'What fire teachings am I working with?',
      'How am I learning about my own ancestral earth traditions?',
      'What sacred site wants to be visited or honored?',
      'How did I commune with trees today?',
      'What does the weather teach about my inner state?',
      'How am I practicing ethical animism?',
      'What boundaries exist around closed practices I should respect?',
      'How did I honor the directions (North, South, East, West)?',
      'What underworld or otherworld journey is relevant?',
      'How am I relating to death and the ancestors?',
      'What power animal or spirit guide is present?',
      'How did I practice earth-healing or land tending?',
      'What ceremony or ritual did I create from authentic connection?',
      'How am I walking between worlds?',
      'What dreams are bringing messages from the spirits?',
      'How did I practice gratitude to the earth mother?',
      'What sky father or celestial energies am I aware of?',
      'How am I developing my ability to sense subtle energies?',
      'What taboos or sacred prohibitions am I respecting?',
      'How did I connect with the genius loci (spirit of place)?',
      'What traditional healing modalities am I called to study?',
      'How am I integrating animist awareness into modern life?',
      'What does biodiversity teach about spiritual diversity?',
      'How did I practice ecological spirituality?',
      'What indigenous knowledge holders am I learning from respectfully?',
      'How am I being a voice for the more-than-human world?',
      'What does my own body, as part of earth, need today?',
      'How am I walking in sacred relationship with all beings?'
    ],
    subgroups: [
      {
        id: 'african-traditional',
        name: 'African Traditional Religions',
        description: 'Indigenous African spiritual traditions',
        icon: '🌍',
        color: '#5d4037',
        hasPreset: false
      },
      {
        id: 'afro-diasporic',
        name: 'Afro-Diasporic',
        description: 'Vodou, Santería, Candomblé, Umbanda, etc.',
        icon: '🥁',
        color: '#6d4c41',
        hasPreset: false
      },
      {
        id: 'polynesian',
        name: 'Polynesian / Pacific Islander',
        description: 'Hawaiian, Maori, and Pacific Island traditions',
        icon: '🌺',
        color: '#00838f',
        hasPreset: false
      },
      {
        id: 'australian-aboriginal',
        name: 'Australian Aboriginal',
        description: 'Indigenous Australian Dreaming traditions',
        icon: '🪃',
        color: '#bf360c',
        hasPreset: false
      },
      {
        id: 'mesoamerican',
        name: 'Mesoamerican',
        description: 'Aztec, Maya, and Central American indigenous traditions',
        icon: '🌽',
        color: '#827717',
        hasPreset: false
      },
      {
        id: 'south-american',
        name: 'South American Indigenous',
        description: 'Andean, Amazonian, and South American traditions',
        icon: '🏔',
        color: '#33691e',
        hasPreset: false
      },
      {
        id: 'siberian-shamanism',
        name: 'Siberian / Central Asian',
        description: 'Siberian and Central Asian shamanic traditions',
        icon: '🦌',
        color: '#4e342e',
        hasPreset: false
      },
      {
        id: 'neo-shamanism',
        name: 'Neo-Shamanism',
        description: 'Modern core shamanism and shamanic revival',
        icon: '🔮',
        color: '#7b1fa2',
        hasPreset: false
      },
      {
        id: 'animism',
        name: 'Animism (General)',
        description: 'General animist worldview and spirit relationships',
        icon: '🌿',
        color: '#2e7d32',
        hasPreset: false
      }
    ]
  },
  {
    id: 'unsure',
    name: 'Exploring / Unsure',
    description: 'Still exploring or combining multiple traditions',
    icon: '🔍',
    color: '#9e9e9e',
    hasPreset: false,
    libraryCategories: [
      'World Religions Overview',
      'Spiritual Journeys',
      'Beginner-Friendly Guides',
      'Universal Practices',
      'Big Questions',
      'Multiple Traditions',
      'Exploration Methods'
    ],
    journalingPrompts: [
      'What spiritual questions am I holding right now?',
      'Which tradition\'s practices feel most natural to me, and why?',
      'What do I believe about the sacred, divine, or ultimate reality?',
      'What practices help me feel most connected or centered?',
      'What am I really looking for in spiritual practice?',
      'Which teachers or ideas speak to my actual experience?',
      'What would a meaningful spiritual life look like for ME?',
      'What drew me to start exploring spirituality?',
      'What tradition am I most curious about and why?',
      'What religious or spiritual background did I come from?',
      'How has my view of spirituality changed over time?',
      'What practices have I tried, and what did I learn?',
      'What would I want from a spiritual community?',
      'What ethical values are non-negotiable for me?',
      'What do I think happens after death?',
      'How do I experience the sacred, if at all?',
      'What prevents me from committing to one path?',
      'What attracts me about multiple traditions?',
      'How do I feel about religious institutions?',
      'What books or teachers have influenced my seeking?',
      'What practices do I do already, even informally?',
      'How do I want to grow as a person?',
      'What wounds or fears affect my spiritual exploration?',
      'What would I lose if I chose a specific path?',
      'What would I gain from deeper commitment?',
      'How does my intellect relate to my spiritual life?',
      'What experiences have felt genuinely transcendent?',
      'How do I define "spiritual" for myself?',
      'What role does nature play in my sense of the sacred?',
      'How do I feel about prayer or meditation?',
      'What myths or stories resonate deeply with me?',
      'How do I handle doubt and uncertainty?',
      'What do I think about the existence of God or gods?',
      'How does my culture shape my spiritual options?',
      'What family expectations affect my exploration?',
      'How comfortable am I with mystery and not-knowing?',
      'What daily practice could I experiment with?',
      'How do I want to mark sacred time (if at all)?',
      'What communities or groups might I explore?',
      'How do I feel about ritual and ceremony?',
      'What holds me back from starting a regular practice?',
      'How do I distinguish genuine spirituality from wishful thinking?',
      'What teachers seem trustworthy to me?',
      'How do I balance openness with discernment?',
      'What traditions have I dismissed too quickly?',
      'What would help me take the next step?',
      'How am I integrating what I\'m learning into daily life?',
      'What does my heart say, beneath all the thinking?'
    ]
  },
  {
    id: 'none',
    name: 'Secular / None',
    description: 'Non-religious or secular spiritual practice',
    icon: '🌟',
    color: '#757575',
    hasPreset: false,
    libraryCategories: [
      'Secular Mindfulness',
      'Ethics Without Religion',
      'Psychology & Well-being',
      'Practical Philosophy',
      'Nature & Wonder',
      'Community & Values',
      'Critical Thinking'
    ],
    journalingPrompts: [
      'What values guided my choices today?',
      'How did I practice awareness and presence without religious framework?',
      'Where did I find meaning, purpose, or connection?',
      'What did I do that contributes to human well-being?',
      'How am I developing good character and wisdom?',
      'What inspired wonder or awe in my day?',
      'How did I practice self-compassion and growth?',
      'How am I living according to my ethical principles?',
      'What evidence-based practices support my well-being?',
      'How did I contribute to others\' flourishing?',
      'What did I learn today that challenged my assumptions?',
      'How am I cultivating emotional intelligence?',
      'What relationships did I nurture?',
      'How did I practice gratitude from a secular perspective?',
      'What cognitive biases did I notice in myself?',
      'How am I developing resilience without supernatural beliefs?',
      'What scientific understanding inspires wonder in me?',
      'How did I act with integrity today?',
      'What habits am I building for long-term flourishing?',
      'How am I contributing to my community?',
      'What creative expression emerged today?',
      'How did I balance self-interest with care for others?',
      'What meaning-making activities fulfill me?',
      'How am I facing mortality without religious comfort?',
      'What philosophical ideas guide my life?',
      'How did I practice mindfulness without spiritual overlay?',
      'What secular rituals or routines support me?',
      'How am I dealing with existential concerns?',
      'What naturalistic explanations inspire awe?',
      'How did I demonstrate compassion today?',
      'What humanist values am I embodying?',
      'How am I contributing to progress and justice?',
      'What moments of flow or peak experience did I have?',
      'How did I rest and recover effectively?',
      'What boundaries am I maintaining for well-being?',
      'How am I pursuing truth and avoiding self-deception?',
      'What education or learning am I engaging in?',
      'How did I practice acceptance of what I cannot change?',
      'What secular community or connection supports me?',
      'How am I leaving things better than I found them?',
      'What brings me genuine joy without needing justification?',
      'How did I act courageously today?',
      'What legacy am I building through my actions?',
      'How am I balancing pleasure and responsibility?',
      'What does a good day look like by my own standards?',
      'How did I demonstrate care for the natural world?',
      'What makes life worth living for me, specifically?',
      'How am I growing as a person through reflection and action?'
    ]
  },
  {
    id: 'custom',
    name: 'Custom / Other',
    description: 'Define your own tradition',
    icon: '✨',
    color: '#795548',
    hasPreset: false,
    libraryCategories: [
      'Your Foundation',
      'Your Practices',
      'Your Worldview',
      'Your Teachers',
      'Your Rituals',
      'Your Integration',
      'Your Growth'
    ],
    journalingPrompts: [
      'What practices actually worked for me today?',
      'How am I blending different traditions authentically?',
      'What does "sacred" mean to ME personally?',
      'How is my unique path unfolding?',
      'What am I drawing from right now, and why?',
      'Where do I need to trust my own experience instead of following others?',
      'How am I staying true to what feels real for me?',
      'What traditions am I synthesizing in my practice?',
      'How do I know when something is right for me?',
      'What aspects of different paths resonate most?',
      'How am I creating my own rituals or ceremonies?',
      'What do I believe that defies easy categorization?',
      'How am I honoring multiple lineages respectfully?',
      'What makes my path authentically mine?',
      'How do I handle others not understanding my approach?',
      'What teacher or teaching changed everything for me?',
      'How am I integrating seeming contradictions?',
      'What do I practice daily that reflects my unique path?',
      'How do I decide what to adopt and what to leave?',
      'What label, if any, fits my spirituality?',
      'How am I documenting my evolving practice?',
      'What sacred texts from various sources guide me?',
      'How do I honor my past while creating something new?',
      'What unique insight has my path given me?',
      'How am I building community with my approach?',
      'What do I wish I had known when I started?',
      'How has my custom path evolved over time?',
      'What practices did I create versus inherit?',
      'How do I handle appropriation concerns consciously?',
      'What holds my practice together into coherence?',
      'How am I teaching or sharing what I\'ve learned?',
      'What new practice am I experimenting with?',
      'How do I balance depth with breadth in my path?',
      'What seasonal or cyclical practices do I observe?',
      'How am I creating sacred space in my own way?',
      'What divine or ultimate reality do I perceive?',
      'How does my path serve others, not just myself?',
      'What discipline or consistency does my path require?',
      'How am I growing into my own authority?',
      'What risks or edges am I exploring?',
      'How do I renew my practice when it goes stale?',
      'What would I tell someone starting a similar journey?',
      'How am I honoring my own mystical experiences?',
      'What does commitment look like in an eclectic path?',
      'How is my custom tradition becoming tradition?',
      'What am I learning about myself through this path?',
      'How am I walking my unique way today?'
    ]
  }
]

// Get a tradition preset by ID
export function getTraditionPreset(traditionId) {
  return TRADITION_PRESETS[traditionId] || null
}

// Get tradition info by ID
export function getTraditionInfo(traditionId) {
  return AVAILABLE_TRADITIONS.find(t => t.id === traditionId) || null
}

// Get practices for a tradition (returns default if no preset exists)
export function getTraditionPractices(traditionId) {
  const preset = TRADITION_PRESETS[traditionId]
  if (preset?.practices) {
    return preset.practices
  }
  // Return default practices if no preset
  return null
}

// Get enabled calendars for a tradition
export function getTraditionCalendars(traditionId) {
  const preset = TRADITION_PRESETS[traditionId]
  if (preset?.enabledCalendars) {
    return preset.enabledCalendars
  }
  // Default calendars
  return ['moon']
}

// Get journaling prompts for a tradition
export function getTraditionJournalingPrompts(traditionId, frequency = 'daily') {
  const preset = TRADITION_PRESETS[traditionId]
  if (preset?.journalingPrompts?.[frequency]) {
    return preset.journalingPrompts[frequency]
  }
  // Default prompts
  return [
    'What did I practice today?',
    'What insights arose?',
    'What am I grateful for?'
  ]
}

// Get terminology mapping for a tradition
export function getTraditionTerminology(traditionId) {
  const preset = TRADITION_PRESETS[traditionId]
  return preset?.correspondences || {}
}

// Translate a term using tradition-specific terminology
export function translateTerm(term, traditionId) {
  const correspondences = getTraditionTerminology(traditionId)
  return correspondences[term] || term
}

// Get all correspondences (for "show other traditions" feature)
export function getAllCorrespondences(term) {
  const result = []
  for (const [tradId, preset] of Object.entries(TRADITION_PRESETS)) {
    if (preset.correspondences?.[term]) {
      result.push({
        tradition: preset.name,
        term: preset.correspondences[term],
        icon: preset.icon
      })
    }
  }
  return result
}

// Check if a tradition has subgroups
export function hasSubgroups(traditionId) {
  const tradition = AVAILABLE_TRADITIONS.find(t => t.id === traditionId)
  return tradition?.subgroups?.length > 0
}

// Get subgroups for a tradition
export function getSubgroups(traditionId) {
  const tradition = AVAILABLE_TRADITIONS.find(t => t.id === traditionId)
  return tradition?.subgroups || []
}

// Get a specific subgroup by tradition and subgroup ID
export function getSubgroup(traditionId, subgroupId) {
  const subgroups = getSubgroups(traditionId)
  return subgroups.find(s => s.id === subgroupId) || null
}

// Get tradition info by ID, including subgroup lookup
// Supports both "christian" and "christian:catholic" format
export function getTraditionOrSubgroup(fullId) {
  if (fullId.includes(':')) {
    const [traditionId, subgroupId] = fullId.split(':')
    const subgroup = getSubgroup(traditionId, subgroupId)
    if (subgroup) {
      return {
        ...subgroup,
        parentId: traditionId,
        fullId: fullId
      }
    }
  }
  return getTraditionInfo(fullId)
}

// Get all traditions flattened (including subgroups as separate entries)
export function getAllTraditionsFlattened() {
  const result = []
  for (const tradition of AVAILABLE_TRADITIONS) {
    result.push(tradition)
    if (tradition.subgroups) {
      for (const subgroup of tradition.subgroups) {
        result.push({
          ...subgroup,
          parentId: tradition.id,
          parentName: tradition.name,
          fullId: `${tradition.id}:${subgroup.id}`
        })
      }
    }
  }
  return result
}

export default TRADITION_PRESETS
