/** 100 posts para Brand mentions – thumbnails Unsplash (sports), avatares reales, vídeos reales MP4. */
export interface BrandMentionPost {
  id: string
  userName: string
  handle: string
  avatarUrl: string
  videoCount: number
  thumbnailUrl: string
  videoUrl: string
  views: string
  description: string
  likes: string
  comments: string
}

const UNSPLASH = (id: string, w = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`

/** DiceBear: avatares únicos por seed, varios estilos rotando. https://www.dicebear.com/how-to-use/http-api/ */
const DICEBEAR_STYLES = [
  'lorelei',
  'avataaars',
  'notionists',
  'pixel-art',
  'bottts',
  'fun-emoji',
  'lorelei-neutral',
  'micah',
] as const

function dicebearAvatar(index: number): string {
  const style = DICEBEAR_STYLES[index % DICEBEAR_STYLES.length]
  const seed = index + 1
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`
}

/** Unsplash: deportes, running, gym, fitness (IDs conocidos). */
const UNSPLASH_IDS = [
  '1476480862126-209bfaa8edc8',
  '1549060276-7f3b8c79d0da',
  '1571019614242-c5c5dee9f50b',
  '1518611012118-696072aa579a',
  '1519046904884-53103b34b206',
  '1541625602330-2277a4c46182',
  '1534438327276-14e5300c3a48',
  '1517836357043-0047f6127c51',
  '1571003123894-1f0594d2b5d9',
  '1547448415-e9f5b28e570d',
  '1517836357043-0047f6127c51',
  '1534438327276-14e5300c3a48',
  '1571019614242-c5c5dee9f50b',
  '1476480862126-209bfaa8edc8',
  '1518611012118-696072aa579a',
  '1541625602330-2277a4c46182',
  '1519046904884-53103b34b206',
  '1549060276-7f3b8c79d0da',
  '1571003123894-1f0594d2b5d9',
  '1547448415-e9f5b28e570d',
]

/** Vídeos reales (MP4 públicos, reproducibles en <video>). */
const VIDEO_URLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Volleyball.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
]

const FIRST_NAMES = [
  'Janisha', 'BoyZ', 'Mary', 'Tiana', 'Bryce', 'Matthew', 'Brianna', 'Alex', 'Jordan', 'Sam',
  'Morgan', 'Casey', 'Riley', 'Quinn', 'Dakota', 'Skyler', 'Parker', 'Avery', 'Reese', 'Cameron',
  'Drew', 'Emery', 'Finley', 'Harper', 'Jamie', 'Kai', 'Logan', 'Marley', 'Nico', 'Oakley',
  'Payton', 'River', 'Sage', 'Taylor', 'Uma', 'Val', 'Winter', 'Xander', 'Yael', 'Zion',
  'Addison', 'Blake', 'Charlie', 'Dylan', 'Ellis', 'Frankie', 'Gray', 'Hayden', 'Indigo', 'Jesse',
]
const LAST_NAMES = [
  'Walt', 'Cepeda', 'Kenter', 'Phil', 'Leavitt', 'Smith', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore',
  'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Hall', 'Allen', 'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson',
  'Hill', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Torres', 'Parker',
]
const DESCRIPTIONS = [
  'Loving my new Adidas Ultraboosts for the morning run! #adidas #running',
  'Skate park vibes. Adidas skateboarding line is underrated. #adidas #skateboarding',
  'Jogging practice today. This kit breathes so well. Thanks Adidas! #adidas #fitness',
  'Series of lifting. New tutorial #adidas #gym',
  'Beach workout with the crew. Adidas never disappoints. #adidas #sports',
  'Cycling season. Adidas cycling gear is top. #adidas #cycling',
  'Gym day. Adidas training collection. #adidas #gym #fitness',
  'Morning run in the new Adidas. So light! #adidas #running',
  'New Adidas drop is fire. #adidas #sneakers',
  'Training session. Adidas performance wear. #adidas #training',
]

function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

function formatViews() {
  const n = randomInt(900) + 100
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K views`
  return `${n} views`
}

function formatLikes() {
  return `${randomInt(5) + 1} ${randomInt(9000) + 500}`
}

/** Entrada de vídeo Pexels para generar posts (videoUrl + thumbnailUrl). */
export interface PexelsVideoEntry {
  videoUrl: string
  thumbnailUrl: string
}

/**
 * Genera 100 posts.
 * - pexelsVideos: si se pasa, usa videoUrl/thumbnailUrl rotando; si no, fallback (VIDEO_URLS + Unsplash).
 * - Avatares: siempre DiceBear (único por índice), fallback por nombre en onError del <img>.
 */
export function generateBrandMentionPosts(
  pexelsVideos?: PexelsVideoEntry[]
): BrandMentionPost[] {
  const posts: BrandMentionPost[] = []
  const usedHandles = new Set<string>()
  const hasPexels = pexelsVideos && pexelsVideos.length > 0

  for (let i = 0; i < 100; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length]
    const last = LAST_NAMES[i % LAST_NAMES.length]
    const userName = `${first} ${last}`
    let handle = `@${first.toLowerCase().replace(/\s/g, '')}${randomInt(999)}`
    while (usedHandles.has(handle)) {
      handle = `@${first.toLowerCase()}${randomInt(9999)}`
    }
    usedHandles.add(handle)

    const videoIndex = i % (hasPexels ? pexelsVideos!.length : VIDEO_URLS.length)
    const videoUrl = hasPexels ? pexelsVideos![videoIndex].videoUrl : VIDEO_URLS[videoIndex]
    const thumbnailUrl = hasPexels
      ? pexelsVideos![videoIndex].thumbnailUrl
      : UNSPLASH(UNSPLASH_IDS[i % UNSPLASH_IDS.length])

    posts.push({
      id: String(i + 1),
      userName,
      handle,
      avatarUrl: dicebearAvatar(i),
      videoCount: randomInt(3000) + 500,
      thumbnailUrl,
      videoUrl,
      views: formatViews(),
      description: DESCRIPTIONS[i % DESCRIPTIONS.length],
      likes: formatLikes(),
      comments: String(randomInt(500) + 50),
    })
  }

  return posts
}

/** Fallback estático cuando no se usa Pexels (p. ej. SSR o sin API key). */
export const brandMentionPosts: BrandMentionPost[] = generateBrandMentionPosts()
