/**
 * Datos para Creators search: resultados según filtros activos.
 * Distinto número y orden de cards por filtro para simular búsqueda.
 */

const DICEBEAR_STYLES = [
  'lorelei', 'avataaars', 'notionists', 'pixel-art', 'bottts', 'fun-emoji', 'lorelei-neutral', 'micah',
] as const

function dicebearAvatar(seed: number): string {
  const style = DICEBEAR_STYLES[seed % DICEBEAR_STYLES.length]
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`
}

const FIRST_NAMES = [
  'Janisha', 'Mary', 'Tiana', 'Bryce', 'Matthew', 'Brianna', 'Alex', 'Jordan', 'Morgan', 'Casey',
  'Riley', 'Quinn', 'Dakota', 'Skyler', 'Parker', 'Avery', 'Reese', 'Cameron', 'Drew', 'Emery',
  'Finley', 'Harper', 'Jamie', 'Kai', 'Logan', 'Marley', 'Nico', 'Oakley', 'Payton', 'River',
]
const LAST_NAMES = [
  'Walt', 'Cepeda', 'Kenter', 'Smith', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Lee',
  'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Hall', 'Allen', 'King',
]

const LOCATIONS = [
  'United States', 'United Kingdom', 'Spain', 'Mexico', 'Canada', 'Germany', 'France', 'Brazil',
  'Australia', 'India', 'Italy', 'Argentina', 'Colombia', 'Netherlands', 'Japan',
]

export interface CreatorCard {
  id: string
  userName: string
  handle: string
  avatarUrl: string
  location: string
  videoCount: number
  followers: string   // e.g. "723K"
  engagement: string // e.g. "18.35%"
  likes: string      // e.g. "21.6M"
}

/** Hash simple para derivar seed y count desde los filtros. */
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/**
 * Genera una lista de creadores según los filtros activos.
 * Entre 50 y 100 cards; distinto orden/avatar por filtros.
 */
export function getCreatorSearchResults(activeFilters: string[]): CreatorCard[] {
  if (activeFilters.length === 0) return []
  const key = activeFilters.slice().sort().join('|')
  const seed = hash(key)
  const count = 50 + (seed % 51) // 50–100 cards
  const usedHandles = new Set<string>()
  const results: CreatorCard[] = []

  for (let i = 0; i < count; i++) {
    const idx = (seed + i * 7) % (FIRST_NAMES.length * LAST_NAMES.length)
    const first = FIRST_NAMES[idx % FIRST_NAMES.length]
    const last = LAST_NAMES[Math.floor(idx / FIRST_NAMES.length) % LAST_NAMES.length]
    const userName = `${first} ${last}`
    let handle = `@${first.toLowerCase()}${(seed + i) % 1000}`
    while (usedHandles.has(handle)) handle = `@${first.toLowerCase()}${(seed + i + 1) % 1000}`
    usedHandles.add(handle)

    const avatarSeed = seed + i * 13
    const videoCount = 50 + ((avatarSeed * 31) % 950)
    const followersK = 50 + ((avatarSeed * 17) % 950) // 50K–1000K
    const followers = followersK >= 1000 ? `${(followersK / 1000).toFixed(1)}M` : `${followersK}K`
    const engagement = (8 + (avatarSeed % 22) + (avatarSeed % 10) / 10).toFixed(2) + '%'
    const likesTenths = 10 + (avatarSeed * 7) % 90 // 10–99 → 1.0M–9.9M
    const likes = `${(likesTenths / 10).toFixed(1)}M`
    const location = LOCATIONS[(seed + i) % LOCATIONS.length]

    results.push({
      id: `creator-${seed}-${i}`,
      userName,
      handle,
      avatarUrl: dicebearAvatar(avatarSeed),
      location,
      videoCount,
      followers,
      engagement,
      likes,
    })
  }

  return results
}
