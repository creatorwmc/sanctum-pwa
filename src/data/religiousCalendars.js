// Religious Calendars Data
// Includes major holidays for Christian, Buddhist, Islamic, Hindu, and Jewish traditions

// ============ CHRISTIAN HOLIDAYS ============
// Fixed dates (month is 0-indexed)
const CHRISTIAN_FIXED = [
  {
    month: 0, day: 1,
    name: 'Mary, Mother of God',
    type: 'christian',
    description: 'Celebrates Mary as the mother of Jesus Christ, honoring her role in salvation.',
    dateRule: 'Fixed: January 1',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican', 'Lutheran']
  },
  {
    month: 0, day: 6,
    name: 'Epiphany',
    type: 'christian',
    description: 'Commemorates the visit of the Magi to the infant Jesus, revealing Christ to the Gentiles.',
    dateRule: 'Fixed: January 6 (12 days after Christmas)',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican', 'Lutheran', 'Methodist', 'Presbyterian']
  },
  {
    month: 1, day: 2,
    name: 'Candlemas',
    type: 'christian',
    description: 'Celebrates the presentation of Jesus at the Temple and the purification of Mary.',
    dateRule: 'Fixed: February 2 (40 days after Christmas)',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican', 'Lutheran']
  },
  {
    month: 2, day: 19,
    name: "St. Joseph's Day",
    type: 'christian',
    description: 'Honors Joseph, husband of Mary and foster father of Jesus.',
    dateRule: 'Fixed: March 19',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Anglican']
  },
  {
    month: 2, day: 25,
    name: 'Annunciation',
    type: 'christian',
    description: 'Celebrates the angel Gabriel announcing to Mary that she would conceive Jesus.',
    dateRule: 'Fixed: March 25 (9 months before Christmas)',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican', 'Lutheran']
  },
  {
    month: 5, day: 24,
    name: 'Nativity of John the Baptist',
    type: 'christian',
    description: 'Celebrates the birth of John the Baptist, who prepared the way for Jesus.',
    dateRule: 'Fixed: June 24 (6 months before Christmas)',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican', 'Lutheran']
  },
  {
    month: 5, day: 29,
    name: 'Sts. Peter and Paul',
    type: 'christian',
    description: 'Honors the martyrdom of apostles Peter and Paul, pillars of the early Church.',
    dateRule: 'Fixed: June 29',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican']
  },
  {
    month: 7, day: 6,
    name: 'Transfiguration',
    type: 'christian',
    description: 'Commemorates Jesus revealing his divine glory to Peter, James, and John on the mountain.',
    dateRule: 'Fixed: August 6',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican', 'Lutheran']
  },
  {
    month: 7, day: 15,
    name: 'Assumption of Mary',
    type: 'christian',
    description: 'Celebrates Mary being taken body and soul into heavenly glory at the end of her earthly life.',
    dateRule: 'Fixed: August 15',
    traditions: ['Roman Catholic', 'Eastern Orthodox (as Dormition)', 'Oriental Orthodox']
  },
  {
    month: 8, day: 8,
    name: 'Nativity of Mary',
    type: 'christian',
    description: 'Celebrates the birth of the Virgin Mary.',
    dateRule: 'Fixed: September 8',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican']
  },
  {
    month: 8, day: 14,
    name: 'Exaltation of the Holy Cross',
    type: 'christian',
    description: 'Commemorates the discovery of the True Cross and honors the cross as symbol of salvation.',
    dateRule: 'Fixed: September 14',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican']
  },
  {
    month: 8, day: 29,
    name: 'Michaelmas',
    type: 'christian',
    description: 'Honors Archangel Michael and all angels, celebrating their protection and guidance.',
    dateRule: 'Fixed: September 29',
    traditions: ['Roman Catholic', 'Anglican', 'Lutheran', 'Eastern Orthodox (Nov 8)']
  },
  {
    month: 9, day: 31,
    name: 'Reformation Day',
    type: 'christian',
    description: 'Protestant commemoration of Martin Luther posting his 95 Theses in 1517.',
    dateRule: 'Fixed: October 31',
    traditions: ['Lutheran', 'Reformed/Calvinist', 'Presbyterian', 'Methodist', 'Baptist', 'Most Protestant denominations']
  },
  {
    month: 10, day: 1,
    name: 'All Saints Day',
    type: 'christian',
    description: 'Honors all saints, known and unknown, who have attained heavenly glory.',
    dateRule: 'Fixed: November 1',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Anglican', 'Lutheran', 'Methodist']
  },
  {
    month: 10, day: 2,
    name: 'All Souls Day',
    type: 'christian',
    description: 'Day of prayer for the faithful departed, remembering deceased loved ones.',
    dateRule: 'Fixed: November 2',
    traditions: ['Roman Catholic', 'Anglican', 'Lutheran']
  },
  {
    month: 11, day: 8,
    name: 'Immaculate Conception',
    type: 'christian',
    description: 'Celebrates Mary being conceived without original sin, preparing her to be mother of Jesus.',
    dateRule: 'Fixed: December 8',
    traditions: ['Roman Catholic']
  },
  {
    month: 11, day: 24,
    name: 'Christmas Eve',
    type: 'christian',
    description: 'Vigil of Christmas, often celebrated with midnight Mass and family gatherings.',
    dateRule: 'Fixed: December 24',
    traditions: ['All Christian traditions']
  },
  {
    month: 11, day: 25,
    name: 'Christmas Day',
    type: 'christian',
    description: 'Celebrates the birth of Jesus Christ in Bethlehem.',
    dateRule: 'Fixed: December 25',
    traditions: ['All Western Christians', 'Some Eastern Orthodox (Jan 7 for others)']
  },
  {
    month: 11, day: 26,
    name: "St. Stephen's Day",
    type: 'christian',
    description: 'Honors St. Stephen, the first Christian martyr, stoned for his faith.',
    dateRule: 'Fixed: December 26',
    traditions: ['Roman Catholic', 'Anglican', 'Lutheran', 'Eastern Orthodox']
  },
  {
    month: 11, day: 28,
    name: 'Holy Innocents',
    type: 'christian',
    description: 'Commemorates the infant boys killed by King Herod in his attempt to kill Jesus.',
    dateRule: 'Fixed: December 28',
    traditions: ['Roman Catholic', 'Anglican', 'Lutheran', 'Eastern Orthodox']
  }
]

// ============ BUDDHIST HOLIDAYS ============
// Many Buddhist holidays follow lunar calendars - these are approximate
const BUDDHIST_FIXED = [
  {
    month: 0, day: 25,
    name: 'Mahayana New Year',
    type: 'buddhist',
    description: 'New Year celebration in Mahayana traditions, a time for reflection and renewal.',
    dateRule: 'Varies by tradition: often mid-January to mid-February',
    traditions: ['Mahayana', 'Zen', 'Pure Land', 'Chinese Buddhism', 'Korean Buddhism', 'Vietnamese Buddhism']
  },
  {
    month: 1, day: 15,
    name: 'Nirvana Day (Parinirvana)',
    type: 'buddhist',
    description: "Commemorates Buddha's death and entry into final nirvana, ending the cycle of rebirth.",
    dateRule: 'Lunar: 15th day of 2nd lunar month (Feb 15 approximate)',
    traditions: ['Mahayana', 'Zen', 'Theravada (as Vesak)', 'Tibetan']
  },
  {
    month: 2, day: 9,
    name: "Magha Puja (Sangha Day)",
    type: 'buddhist',
    description: "Celebrates the spontaneous gathering of 1,250 enlightened monks before Buddha.",
    dateRule: 'Lunar: Full moon of 3rd lunar month',
    traditions: ['Theravada', 'Thai Buddhism', 'Sri Lankan Buddhism', 'Cambodian Buddhism', 'Laotian Buddhism']
  },
  {
    month: 3, day: 8,
    name: "Buddha's Birthday",
    type: 'buddhist',
    description: "Celebrates the birth of Siddhartha Gautama, who became the Buddha.",
    dateRule: 'Varies: April 8 (Japan), May full moon (Theravada)',
    traditions: ['Mahayana (April 8)', 'Japanese Buddhism', 'Korean Buddhism']
  },
  {
    month: 4, day: 15,
    name: 'Vesak (Buddha Day)',
    type: 'buddhist',
    description: "Most important Buddhist holiday, celebrating Buddha's birth, enlightenment, and death.",
    dateRule: 'Lunar: Full moon of Vesakha month (April/May)',
    traditions: ['Theravada', 'Mahayana', 'All Buddhist traditions', 'UN-recognized']
  },
  {
    month: 6, day: 19,
    name: 'Asalha Puja (Dharma Day)',
    type: 'buddhist',
    description: "Commemorates Buddha's first sermon, setting the Wheel of Dharma in motion.",
    dateRule: 'Lunar: Full moon of 8th lunar month (July)',
    traditions: ['Theravada', 'Thai Buddhism', 'Sri Lankan Buddhism', 'Cambodian Buddhism']
  },
  {
    month: 6, day: 20,
    name: 'Vassa Begins (Rains Retreat)',
    type: 'buddhist',
    description: 'Start of the 3-month monastic retreat during the rainy season.',
    dateRule: 'Lunar: Day after Asalha Puja full moon',
    traditions: ['Theravada', 'Thai Buddhism', 'Burmese Buddhism', 'Sri Lankan Buddhism']
  },
  {
    month: 9, day: 17,
    name: 'Vassa Ends (Pavarana)',
    type: 'buddhist',
    description: 'End of the rains retreat, monks confess any transgressions to each other.',
    dateRule: 'Lunar: Full moon of 11th lunar month (October)',
    traditions: ['Theravada', 'Thai Buddhism', 'Burmese Buddhism', 'Sri Lankan Buddhism']
  },
  {
    month: 9, day: 18,
    name: 'Kathina (Robe Offering)',
    type: 'buddhist',
    description: 'Laity offer cloth for robes to monks after the rains retreat, earning great merit.',
    dateRule: 'Lunar: One month period after Vassa ends',
    traditions: ['Theravada', 'Thai Buddhism', 'Burmese Buddhism', 'Sri Lankan Buddhism', 'Cambodian Buddhism']
  },
  {
    month: 10, day: 8,
    name: 'Loy Krathong',
    type: 'buddhist',
    description: 'Festival of lights where floating lanterns are released to honor water spirits and Buddha.',
    dateRule: 'Lunar: Full moon of 12th Thai lunar month (November)',
    traditions: ['Thai Buddhism', 'Laotian Buddhism (as Boun Lai Heua Fai)']
  },
  {
    month: 11, day: 8,
    name: 'Bodhi Day (Enlightenment)',
    type: 'buddhist',
    description: "Celebrates Buddha's enlightenment under the Bodhi tree after 49 days of meditation.",
    dateRule: 'Fixed: December 8 (Mahayana traditions)',
    traditions: ['Mahayana', 'Zen', 'Pure Land', 'Japanese Buddhism', 'Chinese Buddhism']
  }
]

// ============ HINDU HOLIDAYS ============
// Hindu holidays vary by lunar calendar - these are common approximate dates
const HINDU_FIXED = [
  {
    month: 0, day: 14,
    name: 'Makar Sankranti',
    type: 'hindu',
    description: 'Celebrates the sun entering Capricorn, marking longer days. Harvest festival.',
    dateRule: 'Solar: When sun enters Capricorn (January 14-15)',
    traditions: ['All Hindu traditions', 'Pongal (Tamil)', 'Lohri (Punjabi)', 'Bihu (Assamese)', 'Uttarayan (Gujarati)']
  },
  {
    month: 0, day: 26,
    name: 'Vasant Panchami',
    type: 'hindu',
    description: 'Spring festival honoring Saraswati, goddess of knowledge, music, and arts.',
    dateRule: 'Lunar: 5th day of Magha month (Jan/Feb)',
    traditions: ['All Hindu traditions', 'Particularly North India', 'Bengali Hindus', 'Students and artists']
  },
  {
    month: 1, day: 26,
    name: 'Maha Shivaratri',
    type: 'hindu',
    description: 'Great Night of Shiva, celebrating the union of Shiva and Shakti. Night-long vigil.',
    dateRule: 'Lunar: 14th night of dark half of Phalguna (Feb/Mar)',
    traditions: ['Shaivites', 'All Hindu traditions', 'Kashmiri Shaivism', 'Lingayats', 'Nepali Hindus']
  },
  {
    month: 2, day: 17,
    name: 'Holi',
    type: 'hindu',
    description: 'Festival of colors celebrating spring, love, and the triumph of good over evil.',
    dateRule: 'Lunar: Full moon of Phalguna month (March)',
    traditions: ['All Hindu traditions', 'Vaishnavites (Krishna worship)', 'North India primarily', 'Sikhs (as Hola Mohalla)']
  },
  {
    month: 2, day: 25,
    name: 'Ugadi/Gudi Padwa',
    type: 'hindu',
    description: 'New Year celebration in several regions, marking the start of a new cycle.',
    dateRule: 'Lunar: 1st day of Chaitra month (March/April)',
    traditions: ['Telugu Hindus (Ugadi)', 'Kannada Hindus (Ugadi)', 'Marathi Hindus (Gudi Padwa)', 'Konkani Hindus']
  },
  {
    month: 3, day: 14,
    name: 'Ram Navami',
    type: 'hindu',
    description: 'Celebrates the birth of Lord Rama, hero of the Ramayana epic.',
    dateRule: 'Lunar: 9th day of Chaitra month (March/April)',
    traditions: ['Vaishnavites', 'All Hindu traditions', 'Ram bhakti movements', 'ISKCON']
  },
  {
    month: 3, day: 21,
    name: 'Hanuman Jayanti',
    type: 'hindu',
    description: 'Celebrates the birth of Hanuman, the devoted monkey god and servant of Rama.',
    dateRule: 'Lunar: Full moon of Chaitra month (April)',
    traditions: ['All Hindu traditions', 'Particularly North India', 'Hanuman devotees', 'Wrestlers and athletes']
  },
  {
    month: 7, day: 15,
    name: 'Raksha Bandhan',
    type: 'hindu',
    description: 'Sisters tie protective threads on brothers\' wrists, celebrating sibling love.',
    dateRule: 'Lunar: Full moon of Shravana month (August)',
    traditions: ['All Hindu traditions', 'North India primarily', 'Jains', 'Some Sikhs']
  },
  {
    month: 7, day: 26,
    name: 'Krishna Janmashtami',
    type: 'hindu',
    description: 'Celebrates the birth of Lord Krishna at midnight. Fasting and night vigils.',
    dateRule: 'Lunar: 8th day of dark half of Bhadrapada (Aug/Sep)',
    traditions: ['Vaishnavites', 'ISKCON', 'Pushtimarg', 'Gaudiya Vaishnavism', 'All Hindu traditions']
  },
  {
    month: 8, day: 7,
    name: 'Ganesh Chaturthi',
    type: 'hindu',
    description: 'Birthday of elephant-headed Ganesha, remover of obstacles. 10-day celebration.',
    dateRule: 'Lunar: 4th day of bright half of Bhadrapada (Aug/Sep)',
    traditions: ['All Hindu traditions', 'Particularly Maharashtra', 'Ganapatya sect', 'South India']
  },
  {
    month: 9, day: 12,
    name: 'Navaratri Begins',
    type: 'hindu',
    description: 'Nine nights honoring the Divine Feminine, especially Durga, Lakshmi, and Saraswati.',
    dateRule: 'Lunar: 1st day of bright half of Ashwin (Sep/Oct)',
    traditions: ['Shaktism', 'All Hindu traditions', 'Bengali (Durga Puja)', 'Gujarati (Garba)', 'South Indian']
  },
  {
    month: 9, day: 21,
    name: 'Dussehra (Vijayadashami)',
    type: 'hindu',
    description: "Victory of good over evil: Rama's defeat of Ravana, Durga's slaying of Mahishasura.",
    dateRule: 'Lunar: 10th day of bright half of Ashwin (Sep/Oct)',
    traditions: ['All Hindu traditions', 'North India (Ramlila)', 'Bengal (Durga Puja end)', 'Mysore celebration']
  },
  {
    month: 9, day: 24,
    name: 'Karwa Chauth',
    type: 'hindu',
    description: 'Married women fast from sunrise to moonrise for their husbands\' well-being.',
    dateRule: 'Lunar: 4th day after full moon in Kartik (Oct/Nov)',
    traditions: ['North Indian Hindus', 'Punjabi', 'Rajasthani', 'Uttar Pradesh', 'Some Sikhs']
  },
  {
    month: 10, day: 1,
    name: 'Diwali',
    type: 'hindu',
    description: 'Festival of Lights celebrating victory of light over darkness, knowledge over ignorance.',
    dateRule: 'Lunar: New moon of Kartik month (Oct/Nov)',
    traditions: ['All Hindu traditions', 'Jains (Mahavir Nirvana)', 'Sikhs (Bandi Chhor Divas)', 'Some Buddhists']
  },
  {
    month: 10, day: 15,
    name: 'Kartik Purnima',
    type: 'hindu',
    description: 'Full moon of Kartik, sacred for ritual bathing and lighting lamps.',
    dateRule: 'Lunar: Full moon of Kartik month (November)',
    traditions: ['All Hindu traditions', 'Sikhs (Guru Nanak Jayanti often near)', 'Jains', 'Varanasi pilgrims']
  }
]

// ============ JEWISH HOLIDAYS ============
// Jewish holidays follow Hebrew calendar - approximate Gregorian dates
const JEWISH_FIXED = [
  {
    month: 2, day: 14,
    name: 'Purim',
    type: 'jewish',
    description: 'Celebrates salvation of Jews in Persia as told in the Book of Esther.',
    dateRule: 'Hebrew: 14th of Adar (Feb/March)',
    traditions: ['Orthodox', 'Conservative', 'Reform', 'Reconstructionist', 'All Jewish movements']
  },
  {
    month: 3, day: 13,
    name: 'Pesach (Passover) Begins',
    type: 'jewish',
    description: 'Commemorates the Exodus from Egypt. Seder meal and unleavened bread.',
    dateRule: 'Hebrew: 15th of Nisan (March/April)',
    traditions: ['Orthodox', 'Conservative', 'Reform', 'Reconstructionist', 'Karaite', 'Samaritan', 'All Jewish movements']
  },
  {
    month: 3, day: 20,
    name: 'Pesach Ends',
    type: 'jewish',
    description: 'Final day of Passover, commemorating the crossing of the Red Sea.',
    dateRule: 'Hebrew: 22nd of Nisan (8 days after start)',
    traditions: ['Orthodox (8 days)', 'Conservative (8 days)', 'Reform (7 days)', 'Israeli Jews (7 days)']
  },
  {
    month: 4, day: 6,
    name: "Yom HaShoah (Holocaust Day)",
    type: 'jewish',
    description: 'Holocaust Remembrance Day honoring the six million Jews killed by Nazis.',
    dateRule: 'Hebrew: 27th of Nisan (April/May)',
    traditions: ['Orthodox', 'Conservative', 'Reform', 'Secular Jews', 'State of Israel', 'All Jewish movements']
  },
  {
    month: 4, day: 14,
    name: "Yom Ha'atzmaut (Israel Independence)",
    type: 'jewish',
    description: 'Celebrates the establishment of the State of Israel in 1948.',
    dateRule: 'Hebrew: 5th of Iyar (April/May)',
    traditions: ['Religious Zionists', 'Conservative', 'Reform', 'State of Israel', 'Most Jewish movements']
  },
  {
    month: 5, day: 2,
    name: 'Shavuot',
    type: 'jewish',
    description: 'Festival of Weeks celebrating the giving of the Torah at Mount Sinai.',
    dateRule: 'Hebrew: 6th of Sivan (50 days after Passover)',
    traditions: ['Orthodox', 'Conservative', 'Reform', 'Reconstructionist', 'Karaite', 'All Jewish movements']
  },
  {
    month: 6, day: 17,
    name: "Tisha B'Av",
    type: 'jewish',
    description: 'Day of mourning for the destruction of both Temples in Jerusalem.',
    dateRule: 'Hebrew: 9th of Av (July/August)',
    traditions: ['Orthodox', 'Conservative', 'Some Reform', 'Traditional Jews']
  },
  {
    month: 8, day: 16,
    name: 'Rosh Hashanah',
    type: 'jewish',
    description: 'Jewish New Year, beginning the High Holy Days. Shofar blown.',
    dateRule: 'Hebrew: 1st-2nd of Tishrei (Sep/Oct)',
    traditions: ['Orthodox (2 days)', 'Conservative (2 days)', 'Reform (1-2 days)', 'All Jewish movements']
  },
  {
    month: 8, day: 25,
    name: 'Yom Kippur',
    type: 'jewish',
    description: 'Day of Atonement, holiest day of the year. 25-hour fast and prayer.',
    dateRule: 'Hebrew: 10th of Tishrei (10 days after Rosh Hashanah)',
    traditions: ['Orthodox', 'Conservative', 'Reform', 'Reconstructionist', 'Secular Jews', 'All Jewish movements']
  },
  {
    month: 8, day: 30,
    name: 'Sukkot Begins',
    type: 'jewish',
    description: 'Feast of Tabernacles, dwelling in temporary booths for 7 days.',
    dateRule: 'Hebrew: 15th of Tishrei (5 days after Yom Kippur)',
    traditions: ['Orthodox', 'Conservative', 'Reform', 'Reconstructionist', 'Karaite', 'Samaritan']
  },
  {
    month: 9, day: 7,
    name: 'Simchat Torah',
    type: 'jewish',
    description: 'Rejoicing in the Torah, completing and restarting the annual reading cycle.',
    dateRule: 'Hebrew: 23rd of Tishrei (after Sukkot)',
    traditions: ['Orthodox', 'Conservative', 'Reform', 'Reconstructionist', 'All Jewish movements']
  },
  {
    month: 11, day: 7,
    name: 'Hanukkah Begins',
    type: 'jewish',
    description: 'Festival of Lights celebrating the rededication of the Temple and miracle of oil.',
    dateRule: 'Hebrew: 25th of Kislev (Nov/Dec)',
    traditions: ['Orthodox', 'Conservative', 'Reform', 'Reconstructionist', 'Secular Jews', 'All Jewish movements']
  },
  {
    month: 11, day: 15,
    name: 'Hanukkah Ends',
    type: 'jewish',
    description: 'Eighth and final day of Hanukkah, all eight candles lit.',
    dateRule: 'Hebrew: 2nd or 3rd of Tevet (8 days after start)',
    traditions: ['Orthodox', 'Conservative', 'Reform', 'Reconstructionist', 'All Jewish movements']
  }
]

// ============ ISLAMIC HOLIDAYS ============
// Islamic holidays follow lunar Hijri calendar - these shift ~11 days earlier each year
// These are approximate for 2025-2026
const ISLAMIC_FIXED = [
  {
    month: 0, day: 7,
    name: 'Mawlid (Prophet Birthday)',
    type: 'islamic',
    description: "Celebrates the birth of Prophet Muhammad. Recitations, processions, and charity.",
    dateRule: 'Hijri: 12th of Rabi al-Awwal (shifts ~11 days earlier yearly)',
    traditions: ['Sunni (most)', 'Sufi orders', 'Shia (some)', 'Barelvi', 'Not observed by Salafi/Wahhabi']
  },
  {
    month: 2, day: 1,
    name: 'Ramadan Begins (2025)',
    type: 'islamic',
    description: 'Start of the holy month of fasting from dawn to sunset, increased prayer and charity.',
    dateRule: 'Hijri: 1st of Ramadan (determined by moon sighting)',
    traditions: ['Sunni', 'Shia', 'Sufi', 'Ibadi', 'All Islamic traditions']
  },
  {
    month: 2, day: 30,
    name: 'Eid al-Fitr (2025)',
    type: 'islamic',
    description: 'Festival of Breaking the Fast, celebrating the end of Ramadan.',
    dateRule: 'Hijri: 1st of Shawwal (after Ramadan)',
    traditions: ['Sunni', 'Shia', 'Sufi', 'Ibadi', 'All Islamic traditions']
  },
  {
    month: 5, day: 7,
    name: 'Eid al-Adha (2025)',
    type: 'islamic',
    description: "Festival of Sacrifice, commemorating Ibrahim's willingness to sacrifice his son.",
    dateRule: 'Hijri: 10th of Dhul Hijjah (during Hajj pilgrimage)',
    traditions: ['Sunni', 'Shia', 'Sufi', 'Ibadi', 'All Islamic traditions']
  },
  {
    month: 5, day: 27,
    name: 'Islamic New Year (2025)',
    type: 'islamic',
    description: "Marks the Hijra, Prophet Muhammad's migration from Mecca to Medina in 622 CE.",
    dateRule: 'Hijri: 1st of Muharram',
    traditions: ['Sunni', 'Shia', 'Sufi', 'All Islamic traditions']
  },
  {
    month: 8, day: 5,
    name: 'Ashura (2025)',
    type: 'islamic',
    description: "Day of fasting. For Shia, mourning Hussein's martyrdom at Karbala.",
    dateRule: 'Hijri: 10th of Muharram',
    traditions: ['Shia (major mourning)', 'Sunni (voluntary fast)', 'Sufi', 'Alevi']
  }
]

// ============ WICCAN/PAGAN HOLIDAYS (Wheel of the Year) ============
const WICCAN_FIXED = [
  {
    month: 1, day: 1,
    name: 'Imbolc',
    type: 'wiccan',
    description: 'Festival of light celebrating the first stirrings of spring. Sacred to Brigid, goddess of healing, poetry, and smithcraft.',
    dateRule: 'Fixed: February 1-2 (Cross-quarter day)',
    traditions: ['Wiccan', 'Celtic Reconstructionist', 'Druidry', 'Neopagan']
  },
  {
    month: 1, day: 2,
    name: 'Imbolc (Day 2)',
    type: 'wiccan',
    description: 'Second day of Imbolc celebrations. Candle lighting, milk offerings, and Brigid crosses.',
    dateRule: 'Fixed: February 2',
    traditions: ['Wiccan', 'Celtic Reconstructionist', 'Druidry']
  },
  {
    month: 4, day: 1,
    name: 'Beltane',
    type: 'wiccan',
    description: 'Fire festival celebrating fertility, passion, and the height of spring. Maypole dancing, bonfires, and handfasting.',
    dateRule: 'Fixed: May 1 (Cross-quarter day)',
    traditions: ['Wiccan', 'Celtic Reconstructionist', 'Druidry', 'Neopagan']
  },
  {
    month: 7, day: 1,
    name: 'Lughnasadh / Lammas',
    type: 'wiccan',
    description: 'First harvest festival honoring the grain harvest. Named for the god Lugh. Bread-making and games.',
    dateRule: 'Fixed: August 1 (Cross-quarter day)',
    traditions: ['Wiccan', 'Celtic Reconstructionist', 'Druidry', 'Neopagan']
  },
  {
    month: 9, day: 31,
    name: 'Samhain',
    type: 'wiccan',
    description: 'Festival marking the end of harvest and beginning of winter. The veil between worlds is thin. Honor ancestors.',
    dateRule: 'Fixed: October 31 - November 1',
    traditions: ['Wiccan', 'Celtic Reconstructionist', 'Druidry', 'Neopagan']
  },
  {
    month: 10, day: 1,
    name: 'Samhain (Day 2)',
    type: 'wiccan',
    description: 'Second day of Samhain. Traditional new year in Celtic calendars. Divination and ancestor communion.',
    dateRule: 'Fixed: November 1',
    traditions: ['Wiccan', 'Celtic Reconstructionist', 'Druidry']
  }
]

// ============ DRUIDIC HOLIDAYS ============
// Based on John Michael Greer's work and Traditional Druidry
// Fire Festivals (Cross-Quarter Days)
const DRUIDIC_FIXED = [
  {
    month: 10, day: 1,
    name: 'Samhain',
    type: 'druidic',
    description: "Summer's End - The Druidic new year when the veil between worlds is thinnest. A time to honor ancestors, embrace endings, and commune with the Otherworld. Silent suppers, ancestor altars, and divination.",
    dateRule: 'Fixed: November 1 (begins sunset Oct 31)',
    traditions: ['OBOD', 'ADF', 'Celtic Reconstructionist', 'Reformed Druids', 'JMG Druidry'],
    practices: ['Ancestor altar', 'Silent supper', 'Scrying', 'Final harvest', 'Otherworld communion'],
    themes: ['Death', 'Endings', 'Ancestor honor', 'Divination', 'Veil thinning']
  },
  {
    month: 1, day: 1,
    name: 'Imbolc',
    type: 'druidic',
    description: "In the Belly - First stirrings of spring within the earth. Sacred to Brigid, goddess of healing, poetry, and smithcraft. Candle lighting, poetry, and purification rituals.",
    dateRule: 'Fixed: February 1',
    traditions: ['OBOD', 'ADF', 'Celtic Reconstructionist', 'Reformed Druids', 'JMG Druidry'],
    practices: ['Candle lighting for Brigid', 'Poetry and creativity', 'Spring cleaning', 'Hearthfire rituals', 'Seed blessing'],
    themes: ['Purification', 'Inspiration', "Brigid's fire", 'First stirrings', 'Quickening']
  },
  {
    month: 4, day: 1,
    name: 'Beltane',
    type: 'druidic',
    description: "Bright Fire - The great fire festival celebrating fertility, passion, and the life force. Cattle driven between twin fires. May Day celebrations, flower crowns, and sacred marriage rites.",
    dateRule: 'Fixed: May 1',
    traditions: ['OBOD', 'ADF', 'Celtic Reconstructionist', 'Reformed Druids', 'JMG Druidry'],
    practices: ['Bonfire rituals', 'May Day celebration', 'Flower crowns', 'Sacred marriage rites', 'Dancing'],
    themes: ['Fertility', 'Life force', 'Passion', 'Joy', 'Vitality']
  },
  {
    month: 7, day: 1,
    name: 'Lughnasadh',
    type: 'druidic',
    description: "Lugh's Assembly - Festival of Lugh the Many-Skilled, celebrating the first grain harvest. Athletic games, craft competitions, bread baking, and honoring skill mastery.",
    dateRule: 'Fixed: August 1',
    traditions: ['OBOD', 'ADF', 'Celtic Reconstructionist', 'Reformed Druids', 'JMG Druidry'],
    practices: ['Bread baking', 'Games and competitions', 'First fruits gratitude', 'Skill honoring', 'Athletic activities'],
    themes: ['First harvest', 'Skill mastery', 'Games', 'Sacrifice', 'Grain festival']
  }
]

// Druidic Solar Festivals are in getSolarFestivals() function below

// Function to calculate solstices and equinoxes (approximate)
function getSolarFestivals(year) {
  // Approximate dates - actual astronomical dates vary by 1-2 days
  return [
    // Wiccan solar festivals
    {
      month: 2, day: 20,
      name: 'Ostara (Spring Equinox)',
      type: 'wiccan',
      description: 'Celebration of balance and renewal as day equals night. Eggs, rabbits, and planting seeds.',
      dateRule: 'Moveable: Spring Equinox (March 19-22)',
      traditions: ['Wiccan', 'Neopagan', 'Eclectic Pagan']
    },
    {
      month: 5, day: 21,
      name: 'Litha (Summer Solstice)',
      type: 'wiccan',
      description: 'Midsummer celebration of the sun at peak power. Bonfires, herbs, and honoring the Oak King.',
      dateRule: 'Moveable: Summer Solstice (June 20-22)',
      traditions: ['Wiccan', 'Neopagan', 'Eclectic Pagan']
    },
    {
      month: 8, day: 22,
      name: 'Mabon (Autumn Equinox)',
      type: 'wiccan',
      description: 'Second harvest festival of thanksgiving. Balance of light and dark before descent into winter.',
      dateRule: 'Moveable: Autumn Equinox (September 21-24)',
      traditions: ['Wiccan', 'Neopagan', 'Eclectic Pagan']
    },
    {
      month: 11, day: 21,
      name: 'Yule (Winter Solstice)',
      type: 'wiccan',
      description: 'Rebirth of the sun. Longest night gives way to returning light. Yule log, evergreens, and gift-giving.',
      dateRule: 'Moveable: Winter Solstice (December 20-23)',
      traditions: ['Wiccan', 'Neopagan', 'Eclectic Pagan']
    },
    // Druidic solar festivals (The Four Albans)
    {
      month: 11, day: 21,
      name: 'Alban Arthan (Winter Solstice)',
      type: 'druidic',
      description: 'Light of Arthur/the Bear - Rebirth of the Sun after the longest night. A time of hope in darkness, inner light, and the turning point. Vigil through the longest night, candle lighting at dawn, holly and ivy rituals.',
      dateRule: 'Moveable: Winter Solstice (December 20-23)',
      traditions: ['OBOD', 'ADF', 'Celtic Reconstructionist', 'JMG Druidry'],
      practices: ['Light candles at dawn', 'Vigil through longest night', 'Honor returning light', 'Holly and ivy rituals'],
      themes: ['Hope in darkness', 'Turning point', 'Inner light', 'Sun rebirth']
    },
    {
      month: 2, day: 20,
      name: 'Alban Eilir (Spring Equinox)',
      type: 'druidic',
      description: 'Light of the Earth - Balance and renewal as day equals night. The earth awakens with new growth. Planting seeds (literal and metaphorical), dawn meditation, egg rituals, and nature walks.',
      dateRule: 'Moveable: Spring Equinox (March 19-22)',
      traditions: ['OBOD', 'ADF', 'Celtic Reconstructionist', 'JMG Druidry'],
      practices: ['Plant something', 'Clean sacred space', 'Dawn meditation', 'Egg rituals', 'Nature walks'],
      themes: ['Balance', 'Renewal', 'New growth', 'Planting seeds', 'Equilibrium']
    },
    {
      month: 5, day: 21,
      name: 'Alban Hefin (Summer Solstice)',
      type: 'druidic',
      description: 'Light of the Shore - Peak of solar power and abundance. The sun at its height, a time of full expression and celebration. All-day outdoor practice, solar meditation, oak and mistletoe rites, stone circle gatherings.',
      dateRule: 'Moveable: Summer Solstice (June 20-22)',
      traditions: ['OBOD', 'ADF', 'Celtic Reconstructionist', 'JMG Druidry'],
      practices: ['All-day outdoor practice', 'Solar meditation', 'Gratitude ceremonies', 'Oak and mistletoe rites'],
      themes: ['Peak solar power', 'Abundance', 'Full expression', 'Celebration']
    },
    {
      month: 8, day: 22,
      name: 'Alban Elfed (Autumn Equinox)',
      type: 'druidic',
      description: 'Light of the Water - Harvest and balance as day again equals night. Time to reap what was sown and prepare for the coming darkness. Harvest rituals, thanksgiving offerings, preservation work.',
      dateRule: 'Moveable: Autumn Equinox (September 21-24)',
      traditions: ['OBOD', 'ADF', 'Celtic Reconstructionist', 'JMG Druidry'],
      practices: ['Harvest ritual', 'Thanksgiving offerings', 'Preservation work', 'Balance meditation'],
      themes: ['Harvest', 'Balance', 'Gratitude', 'Reaping', 'Preparation']
    }
  ]
}

// ============ EASTER CALCULATION ============
// Computus algorithm for Western Easter
function calculateEaster(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return { month, day }
}

// Orthodox Easter - Julian calendar calculation with Gregorian offset
// Uses the Meeus Julian algorithm
function calculateOrthodoxEaster(year) {
  const a = year % 4
  const b = year % 7
  const c = year % 19
  const d = (19 * c + 15) % 30
  const e = (2 * a + 4 * b - d + 34) % 7
  const month = Math.floor((d + e + 114) / 31) - 1
  const day = ((d + e + 114) % 31) + 1

  // Convert from Julian to Gregorian calendar
  // Add 13 days offset (valid for 1900-2099)
  const julianDate = new Date(year, month, day)
  julianDate.setDate(julianDate.getDate() + 13)

  return { month: julianDate.getMonth(), day: julianDate.getDate() }
}

// ============ LITURGICAL SEASONS ============
export const LITURGICAL_SEASONS = {
  advent: {
    id: 'advent',
    name: 'Advent',
    color: '#800080',
    colorName: 'purple',
    description: 'Season of preparation for Christmas, beginning 4 Sundays before Christmas Day'
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas',
    color: '#ffffff',
    colorName: 'white',
    description: 'Celebration of the Nativity, from Christmas Day through Epiphany'
  },
  epiphany: {
    id: 'epiphany',
    name: 'Epiphany',
    color: '#228b22',
    colorName: 'green',
    description: 'Season after Epiphany, Ordinary Time in winter'
  },
  lent: {
    id: 'lent',
    name: 'Lent',
    color: '#800080',
    colorName: 'purple',
    description: '40 days of preparation for Easter, beginning on Ash Wednesday'
  },
  holyWeek: {
    id: 'holyWeek',
    name: 'Holy Week',
    color: '#800080',
    colorName: 'purple/red',
    description: 'The week before Easter, commemorating the Passion of Christ'
  },
  easter: {
    id: 'easter',
    name: 'Easter',
    color: '#ffffff',
    colorName: 'white',
    description: 'Celebration of the Resurrection, 50 days from Easter to Pentecost'
  },
  ordinaryTime: {
    id: 'ordinaryTime',
    name: 'Ordinary Time',
    color: '#228b22',
    colorName: 'green',
    description: 'Weeks of growth in faith outside major seasons'
  }
}

// Get liturgical season for a given date
export function getLiturgicalSeason(date, isOrthodox = false) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  // Get Easter date for this year
  const easter = isOrthodox ? calculateOrthodoxEaster(year) : calculateEaster(year)
  const easterDate = new Date(year, easter.month, easter.day)

  // Calculate key dates
  // Ash Wednesday: 46 days before Easter
  const ashWednesday = new Date(easterDate)
  ashWednesday.setDate(ashWednesday.getDate() - 46)

  // Palm Sunday: 7 days before Easter
  const palmSunday = new Date(easterDate)
  palmSunday.setDate(palmSunday.getDate() - 7)

  // Pentecost: 49 days after Easter
  const pentecost = new Date(easterDate)
  pentecost.setDate(pentecost.getDate() + 49)

  // Advent: 4th Sunday before Christmas
  const christmas = new Date(year, 11, 25)
  const christmasDay = christmas.getDay()
  // Find the Sunday closest to Nov 30
  const daysBeforeChristmas = christmasDay === 0 ? 28 : 21 + christmasDay
  const adventStart = new Date(year, 11, 25 - daysBeforeChristmas)

  // Epiphany: January 6
  const epiphany = new Date(year, 0, 6)
  // First Sunday after Epiphany (Baptism of the Lord)
  const epiphanyDay = epiphany.getDay()
  const baptismOfLord = new Date(year, 0, 6 + (epiphanyDay === 0 ? 7 : 7 - epiphanyDay))

  const currentDate = new Date(year, month, day)

  // Determine the season
  // Check Advent (starts ~Nov 27-Dec 3)
  if (currentDate >= adventStart && currentDate < christmas) {
    const weekNum = Math.floor((currentDate - adventStart) / (7 * 24 * 60 * 60 * 1000)) + 1
    return { ...LITURGICAL_SEASONS.advent, week: weekNum }
  }

  // Check Christmas season (Dec 25 - Jan 5)
  if ((month === 11 && day >= 25) || (month === 0 && day < 6)) {
    return LITURGICAL_SEASONS.christmas
  }

  // Check Epiphany / early Ordinary Time (Jan 6 - Ash Wednesday)
  if (currentDate >= epiphany && currentDate < ashWednesday) {
    if (currentDate < baptismOfLord) {
      return LITURGICAL_SEASONS.epiphany
    }
    const weekNum = Math.floor((currentDate - baptismOfLord) / (7 * 24 * 60 * 60 * 1000)) + 1
    return { ...LITURGICAL_SEASONS.ordinaryTime, week: weekNum, period: 'winter' }
  }

  // Check Lent (Ash Wednesday - Palm Sunday)
  if (currentDate >= ashWednesday && currentDate < palmSunday) {
    const weekNum = Math.floor((currentDate - ashWednesday) / (7 * 24 * 60 * 60 * 1000)) + 1
    return { ...LITURGICAL_SEASONS.lent, week: weekNum }
  }

  // Check Holy Week (Palm Sunday - Easter)
  if (currentDate >= palmSunday && currentDate < easterDate) {
    return LITURGICAL_SEASONS.holyWeek
  }

  // Check Easter season (Easter - Pentecost)
  if (currentDate >= easterDate && currentDate <= pentecost) {
    const weekNum = Math.floor((currentDate - easterDate) / (7 * 24 * 60 * 60 * 1000)) + 1
    return { ...LITURGICAL_SEASONS.easter, week: weekNum }
  }

  // Otherwise, Ordinary Time (summer/fall)
  const weekNum = Math.floor((currentDate - pentecost) / (7 * 24 * 60 * 60 * 1000)) + 1
  return { ...LITURGICAL_SEASONS.ordinaryTime, week: weekNum, period: 'summer' }
}

// Get moveable Christian holidays based on Easter
function getChristianMoveableHolidays(year) {
  const easter = calculateEaster(year)
  const easterDate = new Date(year, easter.month, easter.day)

  const holidays = []

  // Ash Wednesday (46 days before Easter)
  const ashWed = new Date(easterDate)
  ashWed.setDate(ashWed.getDate() - 46)
  holidays.push({
    month: ashWed.getMonth(), day: ashWed.getDate(),
    name: 'Ash Wednesday',
    type: 'christian',
    description: 'Beginning of Lent, 40 days of fasting and penance before Easter.',
    dateRule: 'Moveable: 46 days before Easter',
    traditions: ['Roman Catholic', 'Anglican', 'Lutheran', 'Methodist', 'Presbyterian', 'Some Orthodox (Clean Monday instead)']
  })

  // Palm Sunday (7 days before Easter)
  const palmSun = new Date(easterDate)
  palmSun.setDate(palmSun.getDate() - 7)
  holidays.push({
    month: palmSun.getMonth(), day: palmSun.getDate(),
    name: 'Palm Sunday',
    type: 'christian',
    description: "Commemorates Jesus' triumphal entry into Jerusalem, beginning Holy Week.",
    dateRule: 'Moveable: Sunday before Easter',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican', 'Lutheran', 'Methodist', 'Most Protestant']
  })

  // Holy Thursday
  const holyThurs = new Date(easterDate)
  holyThurs.setDate(holyThurs.getDate() - 3)
  holidays.push({
    month: holyThurs.getMonth(), day: holyThurs.getDate(),
    name: 'Holy Thursday',
    type: 'christian',
    description: "Commemorates the Last Supper, Jesus washing disciples' feet, institution of Eucharist.",
    dateRule: 'Moveable: Thursday before Easter',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican', 'Lutheran', 'Methodist']
  })

  // Good Friday
  const goodFri = new Date(easterDate)
  goodFri.setDate(goodFri.getDate() - 2)
  holidays.push({
    month: goodFri.getMonth(), day: goodFri.getDate(),
    name: 'Good Friday',
    type: 'christian',
    description: 'Commemorates the crucifixion of Jesus. Day of fasting and solemnity.',
    dateRule: 'Moveable: Friday before Easter',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican', 'Lutheran', 'Methodist', 'Baptist', 'All Christian traditions']
  })

  // Easter Sunday
  holidays.push({
    month: easter.month, day: easter.day,
    name: 'Easter Sunday',
    type: 'christian',
    description: 'Celebrates the resurrection of Jesus from the dead. Most important Christian feast.',
    dateRule: 'Moveable: First Sunday after the first full moon on or after March 21',
    traditions: ['All Western Christians', 'Eastern Orthodox (may differ by 1-5 weeks)', 'Oriental Orthodox']
  })

  // Easter Monday
  const easterMon = new Date(easterDate)
  easterMon.setDate(easterMon.getDate() + 1)
  holidays.push({
    month: easterMon.getMonth(), day: easterMon.getDate(),
    name: 'Easter Monday',
    type: 'christian',
    description: 'Continuation of Easter celebration, traditional day of rest and family gathering.',
    dateRule: 'Moveable: Monday after Easter',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Anglican', 'Lutheran', 'Many European countries']
  })

  // Ascension (39 days after Easter)
  const ascension = new Date(easterDate)
  ascension.setDate(ascension.getDate() + 39)
  holidays.push({
    month: ascension.getMonth(), day: ascension.getDate(),
    name: 'Ascension',
    type: 'christian',
    description: "Celebrates Jesus' ascension into heaven 40 days after the resurrection.",
    dateRule: 'Moveable: 39 days after Easter (Thursday)',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican', 'Lutheran', 'Methodist']
  })

  // Pentecost (49 days after Easter)
  const pentecost = new Date(easterDate)
  pentecost.setDate(pentecost.getDate() + 49)
  holidays.push({
    month: pentecost.getMonth(), day: pentecost.getDate(),
    name: 'Pentecost',
    type: 'christian',
    description: 'Celebrates the descent of the Holy Spirit upon the apostles, birth of the Church.',
    dateRule: 'Moveable: 7th Sunday after Easter (50 days)',
    traditions: ['Roman Catholic', 'Eastern Orthodox', 'Oriental Orthodox', 'Anglican', 'Lutheran', 'Methodist', 'Pentecostal', 'All Christian traditions']
  })

  // Trinity Sunday (56 days after Easter)
  const trinity = new Date(easterDate)
  trinity.setDate(trinity.getDate() + 56)
  holidays.push({
    month: trinity.getMonth(), day: trinity.getDate(),
    name: 'Trinity Sunday',
    type: 'christian',
    description: 'Honors the Holy Trinity: Father, Son, and Holy Spirit as one God.',
    dateRule: 'Moveable: Sunday after Pentecost',
    traditions: ['Roman Catholic', 'Anglican', 'Lutheran', 'Methodist', 'Presbyterian']
  })

  // Corpus Christi (60 days after Easter)
  const corpus = new Date(easterDate)
  corpus.setDate(corpus.getDate() + 60)
  holidays.push({
    month: corpus.getMonth(), day: corpus.getDate(),
    name: 'Corpus Christi',
    type: 'christian',
    description: "Celebrates the Real Presence of Christ in the Eucharist. Processions with the Host.",
    dateRule: 'Moveable: Thursday after Trinity Sunday (60 days after Easter)',
    traditions: ['Roman Catholic', 'Anglo-Catholic', 'Some Lutheran', 'Old Catholic']
  })

  // Advent (4th Sunday before Christmas)
  const christmas = new Date(year, 11, 25)
  const christmasDay = christmas.getDay()
  const advent = new Date(year, 11, 25 - christmasDay - 21)
  holidays.push({
    month: advent.getMonth(), day: advent.getDate(),
    name: 'First Sunday of Advent',
    type: 'christian',
    description: 'Beginning of the liturgical year, 4-week preparation for Christmas.',
    dateRule: 'Moveable: 4th Sunday before Christmas',
    traditions: ['Roman Catholic', 'Anglican', 'Lutheran', 'Methodist', 'Presbyterian', 'Eastern Orthodox (Nov 15 start)']
  })

  return holidays
}

// ============ CALENDAR TYPES ============
export const CALENDAR_TYPES = [
  { id: 'moon', name: 'Moon Phases', icon: '🌙', color: '#a8b4c4' },
  { id: 'moonSign', name: 'Moon Signs', icon: '♈', color: '#9b87b2' },
  { id: 'dailyPractices', name: 'Daily Practices', icon: '☀', color: '#5cb85c' },
  { id: 'wiccan', name: 'Wiccan / Pagan', icon: '⛤', color: '#7b68ee' },
  { id: 'druidic', name: 'Druidic', icon: '🌳', color: '#228b22' },
  { id: 'christian', name: 'Christian', icon: '✝', color: '#c9a227' },
  { id: 'buddhist', name: 'Buddhist', icon: '☸', color: '#ff9500' },
  { id: 'hindu', name: 'Hindu', icon: '🕉', color: '#ff6b35' },
  { id: 'jewish', name: 'Jewish', icon: '✡', color: '#4a90d9' },
  { id: 'islamic', name: 'Islamic', icon: '☪', color: '#2d8b5a' }
]

// ============ GET HOLIDAYS FOR YEAR ============
export function getHolidaysForYear(year) {
  const all = [
    ...CHRISTIAN_FIXED,
    ...getChristianMoveableHolidays(year),
    ...BUDDHIST_FIXED,
    ...HINDU_FIXED,
    ...JEWISH_FIXED,
    ...ISLAMIC_FIXED,
    ...WICCAN_FIXED,
    ...DRUIDIC_FIXED,
    ...getSolarFestivals(year)
  ]

  return all
}

// ============ GET HOLIDAYS FOR DATE ============
export function getHolidaysForDate(year, month, day, enabledCalendars = []) {
  const holidays = getHolidaysForYear(year)

  return holidays.filter(h =>
    h.month === month &&
    h.day === day &&
    enabledCalendars.includes(h.type)
  )
}

// ============ GET HOLIDAYS FOR MONTH ============
export function getHolidaysForMonth(year, month, enabledCalendars = []) {
  const holidays = getHolidaysForYear(year)

  return holidays.filter(h =>
    h.month === month &&
    enabledCalendars.includes(h.type)
  )
}

// Get color for calendar type
export function getCalendarColor(type) {
  return CALENDAR_TYPES.find(c => c.id === type)?.color || '#6b7280'
}

// Export Easter calculation functions for external use
export function getEasterDate(year, isOrthodox = false) {
  const easter = isOrthodox ? calculateOrthodoxEaster(year) : calculateEaster(year)
  return new Date(year, easter.month, easter.day)
}

// Get Orthodox moveable holidays (separate from Western)
export function getOrthodoxMoveableHolidays(year) {
  const easter = calculateOrthodoxEaster(year)
  const easterDate = new Date(year, easter.month, easter.day)

  const holidays = []

  // Orthodox Easter (Pascha)
  holidays.push({
    month: easter.month, day: easter.day,
    name: 'Orthodox Pascha (Easter)',
    type: 'christian',
    description: 'The Feast of Feasts celebrating the Resurrection of Christ. Most important day in the Orthodox calendar.',
    dateRule: 'Moveable: Julian calendar calculation',
    traditions: ['Eastern Orthodox', 'Oriental Orthodox']
  })

  // Clean Monday (48 days before Easter - Orthodox Ash Wednesday equivalent)
  const cleanMonday = new Date(easterDate)
  cleanMonday.setDate(cleanMonday.getDate() - 48)
  holidays.push({
    month: cleanMonday.getMonth(), day: cleanMonday.getDate(),
    name: 'Clean Monday (Orthodox Lent begins)',
    type: 'christian',
    description: 'First day of Great Lent in Orthodox tradition. Day of strict fasting and spiritual cleansing.',
    dateRule: 'Moveable: 48 days before Orthodox Easter',
    traditions: ['Eastern Orthodox', 'Oriental Orthodox']
  })

  // Orthodox Palm Sunday
  const palmSunday = new Date(easterDate)
  palmSunday.setDate(palmSunday.getDate() - 7)
  holidays.push({
    month: palmSunday.getMonth(), day: palmSunday.getDate(),
    name: 'Orthodox Palm Sunday',
    type: 'christian',
    description: "Entry of the Lord into Jerusalem. Blessing of palms and willows.",
    dateRule: 'Moveable: Sunday before Orthodox Easter',
    traditions: ['Eastern Orthodox', 'Oriental Orthodox']
  })

  // Orthodox Great and Holy Friday
  const holyFriday = new Date(easterDate)
  holyFriday.setDate(holyFriday.getDate() - 2)
  holidays.push({
    month: holyFriday.getMonth(), day: holyFriday.getDate(),
    name: 'Orthodox Great and Holy Friday',
    type: 'christian',
    description: 'Commemoration of the Crucifixion. Strictest fast day of the year.',
    dateRule: 'Moveable: Friday before Orthodox Easter',
    traditions: ['Eastern Orthodox', 'Oriental Orthodox']
  })

  // Orthodox Pentecost
  const pentecost = new Date(easterDate)
  pentecost.setDate(pentecost.getDate() + 49)
  holidays.push({
    month: pentecost.getMonth(), day: pentecost.getDate(),
    name: 'Orthodox Pentecost',
    type: 'christian',
    description: 'Descent of the Holy Spirit. One of the Great Feasts of Orthodoxy.',
    dateRule: 'Moveable: 50 days after Orthodox Easter',
    traditions: ['Eastern Orthodox', 'Oriental Orthodox']
  })

  return holidays
}
