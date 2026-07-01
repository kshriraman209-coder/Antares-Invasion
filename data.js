// data.js — Static astronomical data, bilingual content, and timeline stage definitions.
// Distances and sizes used for rendering are artistically scaled for visibility (see bodies.js),
// but all figures shown in the Info Panel are real (or, for the hypothetical Antares encounter,
// clearly-labelled scientific approximations).

export const LANG = { EN: 'en', TA: 'ta' };

// ---------------------------------------------------------------------------
// CELESTIAL BODY DATA
// ---------------------------------------------------------------------------
// renderRadius   : scene units, log-ish scaled for visibility
// orbitRadius    : scene units, compressed scale (not linear to real AU) so the whole
//                   system + Antares path fits in a navigable space
// orbitSpeed     : radians per simulated day (approx, derived from real orbital periods)
// rotSpeed       : radians per simulated day (derived from real rotation periods)
// color          : base procedural texture color
// realDiameterKm, realMassKg, realGravity (m/s^2), realTempC, realDistanceAU are REAL values.

export const BODIES = [
  {
    id: 'sun',
    type: 'star',
    renderRadius: 14,
    orbitRadius: 0,
    orbitSpeed: 0,
    rotSpeed: 0.001,
    color: 0xffcc33,
    emissive: true,
    realDiameterKm: 1391000,
    realMassKg: '1.989 × 10^30 kg',
    realGravity: 274,
    realTempC: '5,500 °C (surface) / 15,000,000 °C (core)',
    realDistanceAU: 0,
    name: { en: 'The Sun', ta: 'சூரியன்' },
    facts: {
      en: [
        'The Sun contains 99.86% of the mass of the entire Solar System.',
        'It is a G-type main-sequence star, about 4.6 billion years old.',
        'Light from the Sun takes about 8 minutes 20 seconds to reach Earth.'
      ],
      ta: [
        'சூரிய குடும்பத்தின் மொத்த நிறையில் 99.86% சூரியனிடமே உள்ளது.',
        'இது G-வகை முதன்மை வரிசை நட்சத்திரம், சுமார் 460 கோடி ஆண்டுகள் பழமையானது.',
        'சூரிய ஒளி பூமியை அடைய சுமார் 8 நிமிடம் 20 விநாடிகள் ஆகும்.'
      ]
    }
  },
  {
    id: 'mercury',
    type: 'planet',
    renderRadius: 0.9,
    orbitRadius: 22,
    orbitSpeed: 2 * Math.PI / 88,
    rotSpeed: 2 * Math.PI / 59,
    color: 0x9c9c94,
    realDiameterKm: 4879,
    realMassKg: '3.30 × 10^23 kg',
    realGravity: 3.7,
    realTempC: '-173 °C to 427 °C',
    realDistanceAU: 0.39,
    name: { en: 'Mercury', ta: 'புதன்' },
    facts: {
      en: [
        'Mercury is the smallest planet and closest to the Sun.',
        'A year on Mercury (88 Earth days) is shorter than its day (176 Earth days).',
        'It has almost no atmosphere, causing extreme temperature swings.'
      ],
      ta: [
        'புதன் சூரியனுக்கு மிக அருகில் உள்ள, மிகச் சிறிய கிரகமாகும்.',
        'புதனில் ஒரு ஆண்டு (88 பூமி நாட்கள்) அதன் ஒரு நாளை விட (176 நாட்கள்) குறைவானது.',
        'இதற்கு கிட்டத்தட்ட வளிமண்டலம் இல்லை, இதனால் வெப்பநிலை கடுமையாக மாறுகிறது.'
      ]
    }
  },
  {
    id: 'venus',
    type: 'planet',
    renderRadius: 1.3,
    orbitRadius: 30,
    orbitSpeed: 2 * Math.PI / 225,
    rotSpeed: -2 * Math.PI / 243,
    color: 0xe6c27a,
    atmosphere: 0xf0d9a0,
    realDiameterKm: 12104,
    realMassKg: '4.87 × 10^24 kg',
    realGravity: 8.87,
    realTempC: '464 °C (average)',
    realDistanceAU: 0.72,
    name: { en: 'Venus', ta: 'வெள்ளி' },
    facts: {
      en: [
        'Venus is the hottest planet due to a runaway greenhouse effect.',
        'It rotates backwards (retrograde) compared to most planets.',
        'Its thick CO2 atmosphere traps heat extremely effectively.'
      ],
      ta: [
        'மிகை பசுமை இல்ல விளைவின் காரணமாக வெள்ளி மிகவும் வெப்பமான கிரகமாகும்.',
        'பெரும்பாலான கிரகங்களைப் போலல்லாமல், இது தலைகீழ் திசையில் சுழல்கிறது.',
        'அதன் கனமான கார்பன் டை ஆக்சைடு வளிமண்டலம் வெப்பத்தை வெகுவாக தக்கவைக்கிறது.'
      ]
    }
  },
  {
    id: 'earth',
    type: 'planet',
    renderRadius: 1.4,
    orbitRadius: 38,
    orbitSpeed: 2 * Math.PI / 365.25,
    rotSpeed: 2 * Math.PI / 1,
    color: 0x2a5fb8,
    atmosphere: 0x6fa8ff,
    realDiameterKm: 12742,
    realMassKg: '5.97 × 10^24 kg',
    realGravity: 9.81,
    realTempC: '-88 °C to 58 °C (avg 15 °C)',
    realDistanceAU: 1.0,
    name: { en: 'Earth', ta: 'பூமி' },
    facts: {
      en: [
        'Earth is the only known planet with life.',
        '71% of its surface is covered by water.',
        'Its magnetic field protects it from harmful solar and cosmic radiation.'
      ],
      ta: [
        'உயிரினங்கள் இருப்பதாக அறியப்பட்ட ஒரே கிரகம் பூமி ஆகும்.',
        'அதன் மேற்பரப்பில் 71% நீரால் சூழப்பட்டுள்ளது.',
        'அதன் காந்தப்புலம் சூரிய மற்றும் பிரபஞ்ச கதிர்வீச்சில் இருந்து பாதுகாக்கிறது.'
      ]
    }
  },
  {
    id: 'moon',
    type: 'moon',
    parent: 'earth',
    renderRadius: 0.4,
    orbitRadius: 3.2,
    orbitSpeed: 2 * Math.PI / 27.3,
    rotSpeed: 2 * Math.PI / 27.3,
    color: 0xbbbbbb,
    realDiameterKm: 3474,
    realMassKg: '7.35 × 10^22 kg',
    realGravity: 1.62,
    realTempC: '-173 °C to 127 °C',
    realDistanceAU: 0.00257,
    name: { en: 'The Moon', ta: 'நிலா' },
    facts: {
      en: [
        "The Moon is Earth's only natural satellite.",
        'It is tidally locked, always showing the same face to Earth.',
        'It is slowly drifting away from Earth at about 3.8 cm per year.'
      ],
      ta: [
        'நிலா பூமியின் ஒரே இயற்கையான துணைக்கோள் ஆகும்.',
        'இது அலை-பூட்டப்பட்டுள்ளது, எப்போதும் பூமிக்கு ஒரே பக்கத்தைக் காட்டுகிறது.',
        'இது ஆண்டுக்கு சுமார் 3.8 செ.மீ வேகத்தில் பூமியில் இருந்து விலகிச் செல்கிறது.'
      ]
    }
  },
  {
    id: 'mars',
    type: 'planet',
    renderRadius: 1.0,
    orbitRadius: 48,
    orbitSpeed: 2 * Math.PI / 687,
    rotSpeed: 2 * Math.PI / 1.03,
    color: 0xc1440e,
    atmosphere: 0xd98c5f,
    realDiameterKm: 6779,
    realMassKg: '6.42 × 10^23 kg',
    realGravity: 3.71,
    realTempC: '-153 °C to 20 °C',
    realDistanceAU: 1.52,
    name: { en: 'Mars', ta: 'செவ்வாய்' },
    facts: {
      en: [
        'Mars is known as the Red Planet due to iron oxide on its surface.',
        'It hosts Olympus Mons, the largest volcano in the Solar System.',
        'Mars has two small moons: Phobos and Deimos.'
      ],
      ta: [
        'அதன் மேற்பரப்பில் உள்ள இரும்பு ஆக்சைடு காரணமாக செவ்வாய் "சிவப்பு கிரகம்" எனப்படுகிறது.',
        'சூரிய குடும்பத்திலேயே மிகப் பெரிய எரிமலையான ஒலிம்பஸ் மான்ஸ் இதில் உள்ளது.',
        'செவ்வாய்க்கு ஃபோபோஸ் மற்றும் டீமோஸ் என இரு சிறிய நிலவுகள் உள்ளன.'
      ]
    }
  },
  {
    id: 'asteroidBelt',
    type: 'belt',
    orbitRadiusInner: 56,
    orbitRadiusOuter: 66,
    count: 2200,
    color: 0x8a8a7a,
    name: { en: 'Asteroid Belt', ta: 'சிறுகோள் வளையம்' },
    realDiameterKm: 'Spans ~1 AU wide (between Mars & Jupiter)',
    realMassKg: '~3 × 10^21 kg (total, ~4% Moon mass)',
    realGravity: 'Negligible (varies per body)',
    realTempC: '-100 °C (average)',
    realDistanceAU: '2.2 – 3.2',
    facts: {
      en: [
        'Contains millions of rocky bodies, remnants from planet formation.',
        'Ceres, the largest object, is classified as a dwarf planet.',
        'Despite Hollywood depictions, asteroids are widely spaced — collisions are rare.'
      ],
      ta: [
        'கிரக உருவாக்கத்தின் எச்சங்களான பல லட்சம் பாறை உடல்களைக் கொண்டுள்ளது.',
        'மிகப் பெரிய பொருளான சீரிஸ், ஒரு குறுங்கிரகமாக வகைப்படுத்தப்பட்டுள்ளது.',
        'திரைப்படங்களில் காட்டப்படுவதற்கு மாறாக, சிறுகோள்கள் பெரிதும் இடைவெளியில் உள்ளன.'
      ]
    }
  },
  {
    id: 'jupiter',
    type: 'planet',
    renderRadius: 6.5,
    orbitRadius: 88,
    orbitSpeed: 2 * Math.PI / 4333,
    rotSpeed: 2 * Math.PI / 0.41,
    color: 0xd2b48c,
    atmosphere: 0xe0c9a6,
    realDiameterKm: 139820,
    realMassKg: '1.898 × 10^27 kg',
    realGravity: 24.79,
    realTempC: '-145 °C (cloud top average)',
    realDistanceAU: 5.2,
    name: { en: 'Jupiter', ta: 'வியாழன்' },
    facts: {
      en: [
        'Jupiter is the largest planet — more massive than all others combined.',
        'The Great Red Spot is a giant storm larger than Earth.',
        'It has at least 95 known moons, including giant Ganymede.'
      ],
      ta: [
        'வியாழன் மிகப் பெரிய கிரகம் — மற்ற அனைத்து கிரகங்களையும் விட நிறை அதிகம்.',
        '"பெரிய சிவப்புப் புள்ளி" பூமியை விட பெரிய ஒரு பெரும் புயலாகும்.',
        'இதற்கு குறைந்தது 95 நிலவுகள் உள்ளன, அதில் மாபெரும் கனிமீட் அடங்கும்.'
      ]
    }
  },
  {
    id: 'saturn',
    type: 'planet',
    renderRadius: 5.5,
    orbitRadius: 112,
    orbitSpeed: 2 * Math.PI / 10759,
    rotSpeed: 2 * Math.PI / 0.45,
    color: 0xead6a3,
    atmosphere: 0xf2e3bd,
    hasRings: true,
    realDiameterKm: 116460,
    realMassKg: '5.68 × 10^26 kg',
    realGravity: 10.44,
    realTempC: '-178 °C (average)',
    realDistanceAU: 9.58,
    name: { en: 'Saturn', ta: 'சனி' },
    facts: {
      en: [
        "Saturn's iconic rings are made mostly of ice and rock fragments.",
        'It is the least dense planet — it would float in water.',
        'It has 146 known moons, including Titan, larger than Mercury.'
      ],
      ta: [
        'சனியின் பிரபலமான வளையங்கள் பெரும்பாலும் பனி மற்றும் பாறை துகள்களால் ஆனவை.',
        'இது அடர்த்தி மிகக் குறைந்த கிரகம் — நீரில் மிதக்கும்.',
        'இதற்கு 146 நிலவுகள் உள்ளன, அதில் புதனை விட பெரிய டைட்டனும் அடங்கும்.'
      ]
    }
  },
  {
    id: 'uranus',
    type: 'planet',
    renderRadius: 3.4,
    orbitRadius: 134,
    orbitSpeed: 2 * Math.PI / 30687,
    rotSpeed: -2 * Math.PI / 0.72,
    color: 0x9fe3e6,
    atmosphere: 0xbdf0f2,
    hasRings: true,
    realDiameterKm: 50724,
    realMassKg: '8.68 × 10^25 kg',
    realGravity: 8.69,
    realTempC: '-224 °C (average)',
    realDistanceAU: 19.2,
    name: { en: 'Uranus', ta: 'யுரேனஸ்' },
    facts: {
      en: [
        'Uranus rotates on its side, with an axial tilt of about 98°.',
        'It is an "ice giant," composed of water, ammonia, and methane ices.',
        'It has faint rings, discovered in 1977.'
      ],
      ta: [
        'யுரேனஸ் சுமார் 98° சாய்வுடன், பக்கவாட்டில் சுழல்கிறது.',
        'இது நீர், அம்மோனியா, மீத்தேன் பனிகளால் ஆன "பனி ராட்சதன்" ஆகும்.',
        '1977 இல் கண்டுபிடிக்கப்பட்ட மங்கலான வளையங்களைக் கொண்டுள்ளது.'
      ]
    }
  },
  {
    id: 'neptune',
    type: 'planet',
    renderRadius: 3.3,
    orbitRadius: 154,
    orbitSpeed: 2 * Math.PI / 60190,
    rotSpeed: 2 * Math.PI / 0.67,
    color: 0x4169e1,
    atmosphere: 0x6a8de8,
    realDiameterKm: 49244,
    realMassKg: '1.02 × 10^26 kg',
    realGravity: 11.15,
    realTempC: '-218 °C (average)',
    realDistanceAU: 30.05,
    name: { en: 'Neptune', ta: 'நெப்டியூன்' },
    facts: {
      en: [
        'Neptune has the strongest winds in the Solar System, up to 2,100 km/h.',
        'It was the first planet located through mathematical prediction.',
        'Its moon Triton orbits backwards and is likely a captured object.'
      ],
      ta: [
        'நெப்டியூனில் சூரிய குடும்பத்திலேயே வேகமான காற்று உள்ளது, மணிக்கு 2,100 கி.மீ வரை.',
        'கணித கணிப்பின் மூலம் கண்டறியப்பட்ட முதல் கிரகம் இதுவே.',
        'அதன் நிலவு டிரைட்டன் தலைகீழாக சுற்றுகிறது, அது பிடிக்கப்பட்ட பொருளாக இருக்கலாம்.'
      ]
    }
  },
  {
    id: 'pluto',
    type: 'dwarf',
    renderRadius: 0.6,
    orbitRadius: 172,
    orbitSpeed: 2 * Math.PI / 90560,
    rotSpeed: 2 * Math.PI / 6.39,
    color: 0xcbb89d,
    realDiameterKm: 2377,
    realMassKg: '1.30 × 10^22 kg',
    realGravity: 0.62,
    realTempC: '-229 °C (average)',
    realDistanceAU: 39.5,
    name: { en: 'Pluto', ta: 'புளூட்டோ' },
    facts: {
      en: [
        'Pluto was reclassified as a dwarf planet in 2006.',
        'Its largest moon, Charon, is over half its own size.',
        'It takes 248 Earth years to orbit the Sun once.'
      ],
      ta: [
        '2006 இல் புளூட்டோ ஒரு குறுங்கிரகமாக மறுவகைப்படுத்தப்பட்டது.',
        'அதன் மிகப் பெரிய நிலவான கேரன், அதன் அளவில் பாதிக்கும் மேலாக உள்ளது.',
        'சூரியனை ஒரு முறை சுற்ற 248 பூமி ஆண்டுகள் ஆகும்.'
      ]
    }
  },
  {
    id: 'kuiperBelt',
    type: 'belt',
    orbitRadiusInner: 182,
    orbitRadiusOuter: 230,
    count: 2600,
    color: 0x8aa0c8,
    name: { en: 'Kuiper Belt', ta: 'க்யூபர் வளையம்' },
    realDiameterKm: 'Spans ~20 AU wide, beyond Neptune',
    realMassKg: 'Estimated ~0.1 Earth masses (total)',
    realGravity: 'Negligible (varies per body)',
    realTempC: '~ -230 °C (average)',
    realDistanceAU: '30 – 50',
    facts: {
      en: [
        'A disc of icy bodies beyond Neptune, including Pluto and Eris.',
        'Believed to be the source of many short-period comets.',
        'Named after astronomer Gerard Kuiper, who predicted it in 1951.'
      ],
      ta: [
        'நெப்டியூனுக்கு அப்பால் உள்ள பனி பொருட்களின் வட்டம், புளூட்டோ மற்றும் எரிஸ் உட்பட.',
        'பல குறுகிய-காலகட்ட வால் நட்சத்திரங்களின் மூலமாக இது கருதப்படுகிறது.',
        '1951 இல் இதை முன்னறிவித்த வானியலாளர் ஜெரார்ட் க்யூபர் பெயரால் அழைக்கப்படுகிறது.'
      ]
    }
  },
  {
    id: 'oortCloud',
    type: 'cloud',
    orbitRadiusInner: 260,
    orbitRadiusOuter: 340,
    count: 3500,
    color: 0xaad4ff,
    name: { en: 'Oort Cloud', ta: 'ஊர்ட் மேகம்' },
    realDiameterKm: 'Spans roughly 2,000 – 100,000 AU (spherical shell)',
    realMassKg: 'Estimated several Earth masses (total, uncertain)',
    realGravity: 'Negligible (varies per body)',
    realTempC: '~ -260 °C (average)',
    realDistanceAU: '2,000 – 100,000 (compressed for this simulation)',
    facts: {
      en: [
        'A vast spherical shell of icy debris thought to surround the Solar System.',
        'Believed to be the source of long-period comets.',
        'It has never been directly observed — its existence is inferred from comet orbits.',
        'NOTE: In this simulator the Oort Cloud radius is heavily compressed for visibility; in reality it would be far beyond the edge of this entire visible scene.'
      ],
      ta: [
        'சூரிய குடும்பத்தைச் சுற்றியுள்ளதாக கருதப்படும் பனி எச்சங்களின் பரந்த கோள வடிவ ஓடு.',
        'நீண்ட-காலகட்ட வால் நட்சத்திரங்களின் மூலமாக இது கருதப்படுகிறது.',
        'இது நேரடியாக கவனிக்கப்படவில்லை — வால் நட்சத்திரங்களின் பாதைகளில் இருந்து இதன் இருப்பு ஊகிக்கப்படுகிறது.',
        'குறிப்பு: இந்த சிமுலேட்டரில் ஊர்ட் மேகத்தின் ஆரம் காட்சிக்காக மிகவும் சுருக்கப்பட்டுள்ளது; உண்மையில் இது இந்த காட்சியின் முழு எல்லைக்கும் வெகு தொலைவில் இருக்கும்.'
      ]
    }
  },
  {
    id: 'antares',
    type: 'star',
    renderRadius: 18,
    color: 0xff4422,
    emissive: true,
    realDiameterKm: '~1.7 billion km (≈680× the Sun\'s diameter)',
    realMassKg: '~2.38 × 10^31 kg (≈12× the Sun\'s mass)',
    realGravity: '~70 (surface, approx., low due to its vast size)',
    realTempC: '~3,400 °C (surface, cooler than the Sun)',
    realDistanceAU: '≈ 33,900,000,000,000 AU (550 light-years) in reality — HYPOTHETICAL approach simulated here',
    name: { en: 'Antares', ta: 'அந்தாரிஸ்' },
    facts: {
      en: [
        'Antares is a real red supergiant star in the constellation Scorpius, about 550 light-years from Earth.',
        'It is roughly 680 times the diameter of the Sun and about 10,000–15,000 times more luminous.',
        'Antares is nearing the end of its life and is expected to explode as a supernova in the astronomically near future (within roughly the next million years).',
        'IMPORTANT (Hypothetical Scenario): In real life, Antares is NOT moving toward the Solar System and poses no danger. Its proper motion across the sky is far too slow and misaligned for any approach. This simulator presents a fictional "what-if" scenario for educational purposes, exploring stellar dynamics, tidal forces, and orbital perturbation in a fun, visual way.'
      ],
      ta: [
        'அந்தாரிஸ் என்பது விருச்சிகம் நட்சத்திரக்கூட்டத்தில் உள்ள ஒரு உண்மையான சிவப்பு மாபெரும் நட்சத்திரம், பூமியில் இருந்து சுமார் 550 ஒளி ஆண்டுகள் தொலைவில் உள்ளது.',
        'இது சூரியனின் விட்டத்தை விட சுமார் 680 மடங்கு பெரியது, மற்றும் சுமார் 10,000–15,000 மடங்கு பிரகாசமானது.',
        'அந்தாரிஸ் தனது வாழ்க்கையின் இறுதிக் கட்டத்தை நெருங்கி வருகிறது, வானியல் அளவில் அண்மையில் (சுமார் அடுத்த பத்து லட்சம் ஆண்டுகளுக்குள்) இது ஒரு சூப்பர்நோவாவாக வெடிக்கும் என எதிர்பார்க்கப்படுகிறது.',
        'முக்கியம் (கற்பனைக் காட்சி): உண்மையில் அந்தாரிஸ் சூரிய குடும்பத்தை நோக்கி நகரவில்லை, எந்த ஆபத்தும் இல்லை. இந்த சிமுலேட்டர் ஒரு கற்பனை "என்ன-நடந்தால்" காட்சியை, கல்வி நோக்கங்களுக்காக, நட்சத்திர இயக்கவியல் மற்றும் ஈர்ப்பு தாக்கங்களை அறிய வழங்குகிறது.'
      ]
    }
  }
];

// ---------------------------------------------------------------------------
// UI STRING TRANSLATIONS
// ---------------------------------------------------------------------------
export const UI_STRINGS = {
  en: {
    title: 'Antares Invades the Solar System',
    play: 'Play', pause: 'Pause', restart: 'Restart', speed: 'Speed',
    stage: 'Stage', of: 'of', close: 'Close',
    name: 'Name', type: 'Type', diameter: 'Diameter', mass: 'Mass',
    gravity: 'Gravity', temperature: 'Temperature', distance: 'Distance',
    facts: 'Interesting Facts', distFromSun: 'Distance from Sun',
    controlsHintDesktop: 'WASD to move · Mouse to look · Scroll to zoom · Click any object for info',
    controlsHintMobile: 'Joystick to move · Drag to look · Pinch to zoom · Tap any object for info',
    typeStar: 'Star', typePlanet: 'Planet', typeMoon: 'Moon', typeDwarf: 'Dwarf Planet',
    typeBelt: 'Belt', typeCloud: 'Cloud Region',
    science: 'Established Science', hypo: 'Hypothetical Simulation Assumption',
    lang: 'தமிழ்'
  },
  ta: {
    title: 'அந்தாரிஸ் சூரிய குடும்பத்தைத் தாக்குதல்',
    play: 'இயக்கு', pause: 'இடைநிறுத்து', restart: 'மீண்டும் தொடங்கு', speed: 'வேகம்',
    stage: 'நிலை', of: 'இல்', close: 'மூடு',
    name: 'பெயர்', type: 'வகை', diameter: 'விட்டம்', mass: 'நிறை',
    gravity: 'ஈர்ப்பு', temperature: 'வெப்பநிலை', distance: 'தூரம்',
    facts: 'சுவாரஸ்யமான தகவல்கள்', distFromSun: 'சூரியனில் இருந்து தூரம்',
    controlsHintDesktop: 'நகர WASD · பார்க்க சுட்டி · பெரிதாக்க ஸ்க்ரோல் · தகவலுக்கு பொருளை கிளிக் செய்க',
    controlsHintMobile: 'நகர ஜாய்ஸ்டிக் · பார்க்க இழுக்கவும் · பெரிதாக்க பிஞ்ச் செய்க · தகவலுக்கு பொருளைத் தொடவும்',
    typeStar: 'நட்சத்திரம்', typePlanet: 'கிரகம்', typeMoon: 'நிலவு', typeDwarf: 'குறுங்கிரகம்',
    typeBelt: 'வளையம்', typeCloud: 'மேக பகுதி',
    science: 'நிறுவப்பட்ட அறிவியல்', hypo: 'கற்பனை சிமுலேஷன் அனுமானம்',
    lang: 'English'
  }
};

export const TYPE_LABEL_KEY = {
  star: 'typeStar', planet: 'typePlanet', moon: 'typeMoon',
  dwarf: 'typeDwarf', belt: 'typeBelt', cloud: 'typeCloud'
};

// ---------------------------------------------------------------------------
// EVENT TIMELINE — 13 STAGES
// ---------------------------------------------------------------------------
// Each stage has a normalized time range [0..1] over the full simulation,
// an Antares distance (in scene units along its approach path) at start/end,
// and bilingual descriptions tagged as 'science' (established astrophysics)
// or 'hypo' (assumption made for this fictional simulation).
export const STAGES = [
  {
    id: 1,
    title: { en: 'Normal Solar System', ta: 'இயல்பான சூரிய குடும்பம்' },
    antaresDist: 5000, // far outside visible scene
    tag: 'science',
    desc: {
      en: 'The Solar System orbits peacefully. All planets follow their well-established, stable elliptical orbits around the Sun, as they have for roughly 4.6 billion years.',
      ta: 'சூரிய குடும்பம் அமைதியாக சுற்றுகிறது. அனைத்து கிரகங்களும் சுமார் 460 கோடி ஆண்டுகளாக, சூரியனைச் சுற்றி நிலையான நீள்வட்ட பாதைகளில் சுற்றி வருகின்றன.'
    }
  },
  {
    id: 2,
    title: { en: 'Antares Detected Far Away', ta: 'தொலைவில் அந்தாரிஸ் கண்டறியப்படுகிறது' },
    antaresDist: 900,
    tag: 'hypo',
    desc: {
      en: 'In this hypothetical scenario, astronomers detect the red supergiant Antares on an unusual trajectory, still trillions of kilometers away. Real Antares shows no such motion — this is a fictional premise to explore stellar encounter physics.',
      ta: 'இந்த கற்பனைக் காட்சியில், வானியலாளர்கள் சிவப்பு மாபெரும் நட்சத்திரமான அந்தாரிஸ் ஒரு அசாதாரண பாதையில் இருப்பதை கண்டறிகின்றனர், இன்னும் டிரில்லியன் கணக்கான கி.மீ தொலைவில். உண்மையான அந்தாரிஸுக்கு இத்தகைய இயக்கம் இல்லை — இது நட்சத்திர சந்திப்பு இயற்பியலை ஆராய்வதற்கான ஒரு கற்பனைக் கருதுகோள்.'
    }
  },
  {
    id: 3,
    title: { en: 'Antares Slowly Approaches', ta: 'அந்தாரிஸ் மெதுவாக நெருங்குகிறது' },
    antaresDist: 600,
    tag: 'hypo',
    desc: {
      en: "Antares's apparent brightness begins increasing as it closes the (simulated) distance. Its luminosity, around 10,000–15,000 times the Sun's, means it would become visible at extreme range long before arrival.",
      ta: 'அந்தாரிஸ் (சிமுலேஷன் செய்யப்பட்ட) தூரத்தை குறைக்கும்போது அதன் தோற்ற பிரகாசம் அதிகரிக்கத் தொடங்குகிறது. சூரியனை விட சுமார் 10,000–15,000 மடங்கு பிரகாசம் கொண்டதால், வருகைக்கு வெகு காலத்திற்கு முன்பே இது தெரியும்.'
    }
  },
  {
    id: 4,
    title: { en: 'Night Sky Brightens and Reddens', ta: 'இரவு வானம் பிரகாசமாகி சிவப்பாகிறது' },
    antaresDist: 420,
    tag: 'hypo',
    desc: {
      en: "As Antares nears, its red light (surface temperature ~3,400°C, cooler and redder than the Sun) increasingly dominates the night sky, casting a deep crimson ambient glow across the Solar System.",
      ta: 'அந்தாரிஸ் நெருங்கும்போது, அதன் சிவப்பு ஒளி (மேற்பரப்பு வெப்பநிலை ~3,400°C, சூரியனை விட குளிர்ந்தது மற்றும் சிவப்பானது) இரவு வானத்தில் ஆதிக்கம் செலுத்தத் தொடங்குகிறது, சூரிய குடும்பம் முழுவதும் ஆழமான சிவப்பு ஒளியை வீசுகிறது.'
    }
  },
  {
    id: 5,
    title: { en: 'Oort Cloud Disturbed', ta: 'ஊர்ட் மேகம் கலக்கப்படுகிறது' },
    antaresDist: 340,
    tag: 'science',
    desc: {
      en: "This part is grounded in real astrophysics: passing stars are a known mechanism for perturbing the Oort Cloud. Antares's immense mass (~12 solar masses) would gravitationally stir icy bodies in the outer cloud, nudging some onto new trajectories.",
      ta: 'இந்த பகுதி உண்மையான வானியற்பியலில் அடிப்படையாகக் கொண்டது: கடந்து செல்லும் நட்சத்திரங்கள் ஊர்ட் மேகத்தை கலக்கும் அறியப்பட்ட காரணியாகும். அந்தாரிஸின் மிகப் பெரிய நிறை (~12 சூரிய நிறைகள்) வெளிப் பகுதி பனி பொருட்களை ஈர்ப்பு மூலம் கலைத்து, புதிய பாதைகளுக்குத் தள்ளும்.'
    }
  },
  {
    id: 6,
    title: { en: 'Long-Period Comets Begin Entering', ta: 'நீண்ட-காலகட்ட வால் நட்சத்திரங்கள் நுழையத் தொடங்குகின்றன' },
    antaresDist: 300,
    tag: 'science',
    desc: {
      en: 'Perturbed Oort Cloud objects fall inward as long-period comets, a process astronomers believe has happened many times in Solar System history due to passing stars and galactic tides.',
      ta: 'கலக்கப்பட்ட ஊர்ட் மேக பொருட்கள் நீண்ட-காலகட்ட வால் நட்சத்திரங்களாக உள்நோக்கி விழுகின்றன — இது கடந்து செல்லும் நட்சத்திரங்கள் மற்றும் கேலக்ஸி அலைகளால் சூரிய குடும்ப வரலாற்றில் பலமுறை நிகழ்ந்திருக்கலாம் என வானியலாளர்கள் கருதுகின்றனர்.'
    }
  },
  {
    id: 7,
    title: { en: 'Kuiper Belt Becomes Unstable', ta: 'க்யூபர் வளையம் நிலையற்றதாகிறது' },
    antaresDist: 250,
    tag: 'hypo',
    desc: {
      en: "As Antares's simulated path crosses closer, its gravity begins to measurably perturb Kuiper Belt orbits — a scaled-up, faster version of the slow gravitational shuffling real passing stars can cause over millions of years.",
      ta: 'அந்தாரிஸின் சிமுலேஷன் பாதை நெருங்கும்போது, அதன் ஈர்ப்பு க்யூபர் வளைய பாதைகளை அளவிடத்தக்க அளவில் கலைக்கத் தொடங்குகிறது — உண்மையான நட்சத்திரங்கள் லட்சக்கணக்கான ஆண்டுகளில் ஏற்படுத்தும் மெதுவான ஈர்ப்பு மாற்றத்தின் வேகப்படுத்தப்பட்ட பதிப்பு.'
    }
  },
  {
    id: 8,
    title: { en: 'Outer Planets Experience Perturbations', ta: 'வெளிக் கிரகங்கள் சீர்குலைவை அனுபவிக்கின்றன' },
    antaresDist: 190,
    tag: 'hypo',
    desc: {
      en: "Neptune, Uranus, Saturn, and Jupiter begin showing small but visible orbital wobbles as Antares's gravitational influence reaches the outer planets. In reality, an object of this mass would need to pass within a few hundred AU to cause noticeable effects.",
      ta: 'அந்தாரிஸின் ஈர்ப்பு செல்வாக்கு வெளிக் கிரகங்களை அடையும்போது, நெப்டியூன், யுரேனஸ், சனி, வியாழன் ஆகியவை சிறிய ஆனால் காணக்கூடிய பாதை அசைவுகளைக் காட்டத் தொடங்குகின்றன. உண்மையில், இந்த நிறை கொண்ட ஒரு பொருள் கவனிக்கத்தக்க விளைவை ஏற்படுத்த நூற்றுக்கணக்கான AU தூரத்திற்குள் வர வேண்டும்.'
    }
  },
  {
    id: 9,
    title: { en: 'Inner Planets Feel Growing Effects', ta: 'உள் கிரகங்கள் அதிகரிக்கும் தாக்கங்களை உணர்கின்றன' },
    antaresDist: 130,
    tag: 'hypo',
    desc: {
      en: 'Mars, Earth, Venus, and Mercury begin to show subtle orbital perturbations and slightly elongated paths as Antares draws nearer in the simulation, its tidal influence growing with the inverse cube of distance.',
      ta: 'சிமுலேஷனில் அந்தாரிஸ் நெருங்கும்போது, செவ்வாய், பூமி, வெள்ளி, புதன் ஆகியவை நுட்பமான பாதை சீர்குலைவுகளையும் சற்று நீண்ட பாதைகளையும் காட்டத் தொடங்குகின்றன, அதன் அலை தாக்கம் தூரத்தின் தலைகீழ் கனசதுரத்துடன் அதிகரிக்கிறது.'
    }
  },
  {
    id: 10,
    title: { en: 'Earth: Tides, Climate, Comet Risk', ta: 'பூமி: அலைகள், காலநிலை, வால் நட்சத்திர ஆபத்து' },
    antaresDist: 95,
    tag: 'hypo',
    desc: {
      en: "If the encounter is close enough, Earth would experience amplified tides, disrupted seasonal patterns from orbital changes, and a rising risk of comet/asteroid impacts from disturbed belts. Tidal force scales with mass and the inverse cube of distance — real physics applied to a fictional scenario.",
      ta: 'சந்திப்பு போதுமான அளவு நெருக்கமாக இருந்தால், பூமி அதிகரித்த அலைகள், பாதை மாற்றங்களால் சீர்குலைந்த பருவகால முறைகள், கலக்கப்பட்ட வளையங்களில் இருந்து வால்நட்சத்திரம்/சிறுகோள் தாக்கம் ஏற்படும் ஆபத்து அதிகரிப்பு ஆகியவற்றை அனுபவிக்கும். அலை விசை நிறை மற்றும் தூரத்தின் தலைகீழ் கனசதுரத்துடன் அளவிடப்படுகிறது — உண்மையான இயற்பியல் ஒரு கற்பனைக் காட்சியில் பயன்படுத்தப்பட்டுள்ளது.'
    }
  },
  {
    id: 11,
    title: { en: 'Closest Approach', ta: 'மிக நெருக்கமான அணுகுமுறை' },
    antaresDist: 55,
    tag: 'hypo',
    desc: {
      en: "At closest approach, the chosen trajectory determines the outcome: a distant flyby causes lasting but survivable orbital disruption, while a very close pass could theoretically destabilize planetary orbits entirely. This simulator models a flyby scenario — not a direct collision — to keep outcomes scientifically describable.",
      ta: 'மிக நெருக்கமான அணுகலின் போது, தேர்ந்தெடுக்கப்பட்ட பாதை விளைவை தீர்மானிக்கிறது: தொலைவான கடந்துசெல்லல் நீடித்த ஆனால் தப்பிக்கக்கூடிய பாதை சீர்குலைவை ஏற்படுத்தும், மிக நெருக்கமான கடந்துசெல்லல் கோட்பாட்டளவில் கிரக பாதைகளை முற்றிலும் நிலையற்றதாக்கக்கூடும். இந்த சிமுலேட்டர் ஒரு "கடந்துசெல்லல்" காட்சியை மாதிரியாக்குகிறது — நேரடி மோதல் அல்ல — விளைவுகளை அறிவியல் ரீதியாக விளக்கக்கூடியதாக வைத்திருக்க.'
    }
  },
  {
    id: 12,
    title: { en: 'Antares Leaves the Solar System', ta: 'அந்தாரிஸ் சூரிய குடும்பத்தை விட்டு வெளியேறுகிறது' },
    antaresDist: 400,
    tag: 'hypo',
    desc: {
      en: 'Having completed its hyperbolic flyby, Antares recedes back into interstellar space, its gravity no longer dominant. The red glow in the sky gradually fades as distance increases.',
      ta: 'தனது ஹைப்பர்போலிக் கடந்துசெல்லலை முடித்த அந்தாரிஸ், விண்மீன்களுக்கு இடையேயான வெளியில் மீண்டும் பின்வாங்குகிறது, அதன் ஈர்ப்பு இனி ஆதிக்கம் செலுத்தாது. தூரம் அதிகரிக்கும்போது வானத்தில் சிவப்பு ஒளி படிப்படியாக மங்குகிறது.'
    }
  },
  {
    id: 13,
    title: { en: 'New Orbital Configurations Settle', ta: 'புதிய பாதை அமைப்புகள் நிலைபெறுகின்றன' },
    antaresDist: 2000,
    tag: 'hypo',
    desc: {
      en: 'Surviving planets settle into new, slightly altered stable orbits. In real orbital mechanics, perturbed n-body systems generally relax into new quasi-stable configurations over many orbital periods — this final stage compresses that process for demonstration.',
      ta: 'தப்பிய கிரகங்கள் புதிய, சற்று மாற்றப்பட்ட நிலையான பாதைகளில் அமைகின்றன. உண்மையான பாதை இயக்கவியலில், சீர்குலைந்த n-உடல் அமைப்புகள் பொதுவாக பல பாதைக் காலங்களில் புதிய அரை-நிலையான அமைப்புகளுக்கு தளர்வடைகின்றன — இந்த இறுதி நிலை அந்த செயல்முறையை விளக்கத்திற்காக சுருக்குகிறது.'
    }
  }
];
