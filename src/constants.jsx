export const SOCIAL_INFO_MAPPING = {
  youtube: 'Instagram: https://instagram.com/phrakture​\nTwitch: https://twitch.tv/phrakturemusic​\nSpotify: https://open.spotify.com/artist/4AlnX...​\nBandcamp: https://phrakture.bandcamp.com'
}

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