export const SOCIAL_INFO = [
  {
    key: 'youtube',
    label: 'YouTube',
    text: 'Instagram: https://instagram.com/phrakture​\nTwitch: https://twitch.tv/phrakturemusic​\nSpotify: https://open.spotify.com/artist/4AlnXoFGT5zl3v85ScIOzK?si=22xhtuLNSROYPdpVvuUglQ\nBandcamp: https://phrakture.bandcamp.com'
  },
  {
    key: 'instagram',
    label: 'Instagram',
    text: 'Link in bio!'
  }
]

export const IMAGE_OPTIONS = [
  {
    id: 'Youtube - 1280x720',
    width: 1280,
    height: 720
  },
  {
    id: 'Instagram Post - 1080x1080',
    width: 1080,
    height: 1080
  },
  {
    id: 'Instagram Landscape Photo - 1080x608',
    width: 1080,
    height: 608
  },
  {
    id: 'Instagram Portrait - 1080x1350',
    width: 1080,
    height: 1350
  },
  {
    id: 'Instagram Story - 1080x1920',
    width: 1080,
    height: 1920
  },
  {
    id: 'IGTV Cover Photo - 420x654',
    width: 420,
    height: 654
  }
]

export const IMAGE_OPTIONS_MAPPING = IMAGE_OPTIONS.reduce(
  (accumulator, option) => ({
    ...accumulator,
    [option.id]: option
  }),
  {}
);

const AREAS = [
  'music',
  'dev',
  'performance',
  'gaming'
];

const MEDIA_TYPE_NOUN_PHRASE = [
  'A photo',
  'A video',
  'A streaming session',
  'A presentation',
  'A blog post'
];

const VERB_SUBJECT_PHRASE = {
  'dev': [
    'scaffolding front-ends',
    'automating invoices',
    'automating image generation',
    'automating blogs'
  ],
  'music': [
    'making melodies',
    'making atmospheres',
    'making drum patterns',
    'making progressive breaks',
    'making drum & bass',
    'making progressive house',
    'making drone music',
    'making study music',
    'making interesting samples',
    'making bass tones',
    'making FX',
    'using a vocoder',
    'creating glitch effects',
    'using sidechain',
    'exploring tooling',
    'a setup tutorial'
  ],
  'performance': [
    'live looping',
    'finger drumming with the MPKmini',
    'finger drumming with the MPD20'
  ],
  'gaming': [
    'playing VR',
    'playing a competitive shooter'
  ],
};

const PREPOSITION_OBJECT_PHRASE = {
  'dev': [
    'with react',
    'with nodejs',
    'with some JavaScript library',
    'with deno'
  ],
  'music': [
    'with a free VST in Cubase',
    'with a single sample in Cubase',
    'with a single instrument in Cubase',
    'with limited VSTs in Cubase',
    'with a specific VST in Cubase',
    'with Cubase',
    'with the Volca and Cubase',
    'with the electric guitar and Cubase',
    'chopping samples'
  ],
  'performance': [
    'with ableton',
    'with cubase'
  ],
  'gaming': [
    'on the PC',
    'with the Quest 2',
    'with the Rift S'
  ]
};

export const IDEA_GENERATOR_MAPPINGS = {
  AREAS,
  MEDIA_TYPE_NOUN_PHRASE,
  VERB_SUBJECT_PHRASE,
  PREPOSITION_OBJECT_PHRASE
}

export const ONE_SECOND = 1000;
export const FIRST_ITEM = 0;
