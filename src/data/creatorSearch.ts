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

const POOL_SIZE = 100

/** Datos deterministas por índice (0..POOL_SIZE-1) para que el mismo id tenga siempre los mismos datos. */
function getCreatorDataByIndex(index: number): Omit<CreatorCard, 'id'> {
  const i = index % POOL_SIZE
  const first = FIRST_NAMES[i % FIRST_NAMES.length]
  const last = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length]
  const userName = `${first} ${last}`
  const handle = `@${first.toLowerCase()}${(i * 17) % 1000}`
  const videoCount = 50 + ((i * 31) % 950)
  const followersK = 50 + ((i * 17) % 950)
  const followers = followersK >= 1000 ? `${(followersK / 1000).toFixed(1)}M` : `${followersK}K`
  const engagement = (8 + (i % 22) + (i % 10) / 10).toFixed(2) + '%'
  const likesTenths = 10 + (i * 7) % 90
  const likes = `${(likesTenths / 10).toFixed(1)}M`
  const location = LOCATIONS[i % LOCATIONS.length]
  return {
    userName,
    handle,
    avatarUrl: dicebearAvatar(i * 13),
    location,
    videoCount,
    followers,
    engagement,
    likes,
  }
}

/**
 * Genera una lista de creadores según los filtros activos.
 * IDs estables (creator-0..creator-99): al quitar un filtro la selección se mantiene para los que sigan en la lista.
 * Entre 50 y 100 cards; qué índices aparecen depende del seed de los filtros.
 */
export function getCreatorSearchResults(activeFilters: string[]): CreatorCard[] {
  if (activeFilters.length === 0) return []
  const key = activeFilters.slice().sort().join('|')
  const seed = hash(key)
  const count = 50 + (seed % 51) // 50–100 cards
  const results: CreatorCard[] = []
  const usedIndices = new Set<number>()

  for (let k = 0; k < count; k++) {
    const index = (seed + k * 7) % POOL_SIZE
    let idx = index
    let tries = 0
    while (usedIndices.has(idx) && tries < POOL_SIZE) {
      idx = (idx + 1) % POOL_SIZE
      tries++
    }
    usedIndices.add(idx)
    const data = getCreatorDataByIndex(idx)
    results.push({ id: `creator-${idx}`, ...data })
  }

  return results
}
