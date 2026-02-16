/**
 * Datos fake para Creator search demo.
 * Pool con país (filtrable), género (por nombre), métricas numéricas (filtrables).
 * COUNTRIES = lista usada en filtros (US + Europa + resto).
 */

const DICEBEAR_STYLES = [
  'lorelei', 'avataaars', 'notionists', 'pixel-art', 'bottts', 'fun-emoji', 'lorelei-neutral', 'micah',
] as const

function dicebearAvatar(seed: number): string {
  const style = DICEBEAR_STYLES[seed % DICEBEAR_STYLES.length]
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`
}

/** US + Europa prioritarios + resto (misma lista que filtro Follower country). */
export const COUNTRIES_FOR_FILTER = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy',
  'Netherlands', 'Brazil', 'Mexico', 'Argentina', 'India', 'Japan', 'South Korea', 'China',
  'Indonesia', 'Philippines', 'Thailand', 'Vietnam', 'Turkey', 'Poland', 'Sweden', 'Belgium',
  'Austria', 'Switzerland', 'Portugal', 'Colombia', 'Chile', 'Peru', 'South Africa', 'Nigeria',
  'Egypt', 'Kenya', 'Saudi Arabia', 'United Arab Emirates', 'Israel', 'Russia', 'Ukraine',
  'Greece', 'Romania', 'Czech Republic', 'Hungary', 'Ireland', 'Denmark', 'Norway', 'Finland',
  'New Zealand', 'Singapore', 'Malaysia', 'Hong Kong', 'Taiwan', 'Pakistan', 'Bangladesh',
  'Morocco', 'Algeria', 'Tunisia', 'Ghana', 'Ethiopia', 'Tanzania', 'Uganda', 'Costa Rica',
  'Panama', 'Ecuador', 'Venezuela', 'Bolivia', 'Paraguay', 'Uruguay', 'Guatemala', 'Dominican Republic',
  'Puerto Rico', 'Cuba', 'Jamaica', 'Trinidad and Tobago', 'Honduras', 'El Salvador', 'Nicaragua',
  'Croatia', 'Serbia', 'Bulgaria', 'Slovakia', 'Slovenia', 'Lithuania', 'Latvia', 'Estonia',
  'Iceland', 'Luxembourg', 'Malta', 'Cyprus', 'Kazakhstan', 'Uzbekistan', 'Georgia', 'Armenia',
  'Azerbaijan', 'Lebanon', 'Jordan', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Iraq', 'Iran',
  'Sri Lanka', 'Nepal', 'Myanmar', 'Cambodia', 'Laos', 'Mongolia', 'Afghanistan', 'Syria',
  'Yemen', 'Libya', 'Sudan', 'Senegal', 'Ivory Coast', 'Cameroon', 'Zimbabwe', 'Zambia',
  'Botswana', 'Namibia', 'Mozambique', 'Angola', 'Madagascar', 'Rwanda', 'Malawi', 'Mali',
  'Burkina Faso', 'Niger', 'Chad', 'Mauritius', 'Togo', 'Benin', 'Sierra Leone', 'Liberia',
  'Guinea', 'Bhutan', 'Maldives', 'Brunei', 'Papua New Guinea', 'Fiji', 'Samoa',
] as const

const FEMALE_FIRST_NAMES = [
  'Janisha', 'Mary', 'Tiana', 'Brianna', 'Harper', 'Avery', 'Reese', 'Emery', 'Morgan', 'Skyler',
  'Cameron', 'Jamie', 'River', 'Finley', 'Quinn', 'Dakota', 'Casey', 'Riley', 'Parker', 'Logan',
]
const MALE_FIRST_NAMES = [
  'Bryce', 'Matthew', 'Alex', 'Jordan', 'Drew', 'Kai', 'Marley', 'Nico', 'Oakley', 'Payton',
  'James', 'Liam', 'Noah', 'Oliver', 'Elijah', 'Lucas', 'Mason', 'Ethan', 'Henry', 'Sebastian',
]
const LAST_NAMES = [
  'Walt', 'Cepeda', 'Kenter', 'Smith', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Lee',
  'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Hall', 'Allen', 'King',
]

export interface CreatorCard {
  id: string
  userName: string
  handle: string
  avatarUrl: string
  location: string
  videoCount: number
  followers: string
  engagement: string
  likes: string
}

const AGE_GROUPS = ['Any', '18-24', '25-34', '35-44', '45-54', '55+'] as const
type AgeGroup = (typeof AGE_GROUPS)[number]

const LANGUAGES_POOL = [
  'English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese', 'Korean',
  'Arabic', 'Chinese', 'Hindi', 'Dutch', 'Turkish', 'Vietnamese', 'Indonesian', 'Thai',
] as const

/** Interno para filtrado (no exportado en UI). */
interface CreatorInternal extends CreatorCard {
  country: string
  gender: 'female' | 'male'
  ageGroup: AgeGroup
  languages: readonly string[]
  followersNum: number
  engagementNum: number
  likesNum: number
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

const POOL_SIZE = 100

function getCreatorInternal(index: number): CreatorInternal {
  const i = index % POOL_SIZE
  const firstNames = i % 2 === 0 ? FEMALE_FIRST_NAMES : MALE_FIRST_NAMES
  const first = firstNames[i % firstNames.length]
  const last = LAST_NAMES[Math.floor(i / firstNames.length) % LAST_NAMES.length]
  const userName = `${first} ${last}`
  const handle = `@${first.toLowerCase()}${(i * 17) % 1000}`
  const videoCount = 50 + ((i * 31) % 950)
  const country = COUNTRIES_FOR_FILTER[i % COUNTRIES_FOR_FILTER.length]
  const gender: 'female' | 'male' = i % 2 === 0 ? 'female' : 'male'
  const ageGroup = AGE_GROUPS[1 + (i % (AGE_GROUPS.length - 1))]
  const langIdx = i % LANGUAGES_POOL.length
  const languages = [LANGUAGES_POOL[langIdx], LANGUAGES_POOL[(langIdx + 3) % LANGUAGES_POOL.length]]

  const followersNum = 50000 + ((i * 17) % 9500000)
  const followers = followersNum >= 1e6 ? `${(followersNum / 1e6).toFixed(1)}M` : `${(followersNum / 1000).toFixed(0)}K`
  const engagementNum = 5 + (i % 25) + (i % 10) / 10
  const engagement = engagementNum.toFixed(2) + '%'
  const likesNum = (1 + (i * 7) % 99) * 100000
  const likes = likesNum >= 1e6 ? `${(likesNum / 1e6).toFixed(1)}M` : `${(likesNum / 1000).toFixed(0)}K`

  return {
    id: `creator-${i}`,
    userName,
    handle,
    avatarUrl: dicebearAvatar(i * 13),
    location: country,
    videoCount,
    followers,
    engagement,
    likes,
    country,
    gender,
    ageGroup,
    languages,
    followersNum,
    engagementNum,
    likesNum,
  }
}

/** Convierte rango "1K - 10K" a [min, max] en unidades. */
function parseFollowersRange(r: string): [number, number] {
  if (r === '0 - 1K') return [0, 1000]
  if (r === '1K - 10K') return [1000, 10000]
  if (r === '10K - 100K') return [10000, 100000]
  if (r === '100K - 1M') return [100000, 1e6]
  if (r === '1M - 10M') return [1e6, 10e6]
  if (r === '10M+') return [10e6, Infinity]
  return [0, Infinity]
}

function parseEngagementRange(r: string): [number, number] {
  if (r === '0% - 1%') return [0, 1]
  if (r === '1% - 3%') return [1, 3]
  if (r === '3% - 5%') return [3, 5]
  if (r === '5% - 10%') return [5, 10]
  if (r === '10% - 20%') return [10, 20]
  if (r === '20%+') return [20, 100]
  return [0, 100]
}

function matchesGenderRatio(gender: 'female' | 'male', ratio: string): boolean {
  if (ratio === 'Any') return true
  if (ratio.startsWith('Female')) return gender === 'female'
  if (ratio.startsWith('Male')) return gender === 'male'
  return true
}

export interface CreatorFilterState {
  keywordChips?: string[]
  countries?: Set<string>
  statesProvinces?: Set<string>
  contentCategories?: Set<string>
  industryCategories?: Set<string>
  languages?: Set<string>
  genderRatios?: Set<string>
  ageGroups?: Set<string>
  followersRanges?: Set<string>
  engagementRateRanges?: Set<string>
  creatorPriceRanges?: Set<string>
  averageViewsRanges?: Set<string>
  medianViewsRanges?: Set<string>
}

function hasAnySelection(state: CreatorFilterState): boolean {
  return !!(
    (state.keywordChips && state.keywordChips.length > 0) ||
    (state.countries && state.countries.size > 0) ||
    (state.statesProvinces && state.statesProvinces.size > 0) ||
    (state.contentCategories && state.contentCategories.size > 0) ||
    (state.industryCategories && state.industryCategories.size > 0) ||
    (state.languages && state.languages.size > 0) ||
    (state.genderRatios && state.genderRatios.size > 0) ||
    (state.ageGroups && state.ageGroups.size > 0) ||
    (state.followersRanges && state.followersRanges.size > 0) ||
    (state.engagementRateRanges && state.engagementRateRanges.size > 0) ||
    (state.creatorPriceRanges && state.creatorPriceRanges.size > 0) ||
    (state.averageViewsRanges && state.averageViewsRanges.size > 0) ||
    (state.medianViewsRanges && state.medianViewsRanges.size > 0)
  )
}

const DEFAULT_RESULT_COUNT = 60

function toCreatorCards(internals: CreatorInternal[]): CreatorCard[] {
  return internals.map((c) => ({
    id: c.id,
    userName: c.userName,
    handle: c.handle,
    avatarUrl: c.avatarUrl,
    location: c.location,
    videoCount: c.videoCount,
    followers: c.followers,
    engagement: c.engagement,
    likes: c.likes,
  }))
}

/**
 * Sin filtros aplicados: devuelve [] (pantalla vacía "Nothing selected yet"; no sabemos qué pedirá el usuario).
 * Con filtros: devuelve creadores que cumplan; si 0 coincidencias, devuelve conjunto por defecto.
 * Todas las voces del menú (Keyword search, Content categories, etc.) muestran siempre usuarios.
 */
export function getCreatorSearchResults(state: CreatorFilterState): CreatorCard[] {
  const pool: CreatorInternal[] = []
  for (let i = 0; i < POOL_SIZE; i++) pool.push(getCreatorInternal(i))

  const defaultResults = toCreatorCards(
    pool.slice(0, Math.min(pool.length, DEFAULT_RESULT_COUNT))
  )

  if (!hasAnySelection(state)) {
    return []
  }

  let filtered = pool

  if (state.countries && state.countries.size > 0) {
    const set = state.countries
    filtered = filtered.filter((c) => set.has(c.country))
  }
  if (state.genderRatios && state.genderRatios.size > 0) {
    filtered = filtered.filter((c) => [...state.genderRatios!].some((r) => matchesGenderRatio(c.gender, r)))
  }
  if (state.ageGroups && state.ageGroups.size > 0) {
    const set = state.ageGroups
    filtered = filtered.filter((c) => set.has(c.ageGroup) || set.has('Any'))
  }
  if (state.followersRanges && state.followersRanges.size > 0) {
    filtered = filtered.filter((c) => {
      return [...state.followersRanges!].some((r) => {
        const [min, max] = parseFollowersRange(r)
        return c.followersNum >= min && c.followersNum < max
      })
    })
  }
  if (state.engagementRateRanges && state.engagementRateRanges.size > 0) {
    filtered = filtered.filter((c) => {
      return [...state.engagementRateRanges!].some((r) => {
        const [min, max] = parseEngagementRange(r)
        return c.engagementNum >= min && c.engagementNum < max
      })
    })
  }
  if (state.languages && state.languages.size > 0) {
    const set = state.languages
    filtered = filtered.filter((c) => c.languages.some((lang) => set.has(lang)))
  }

  if (filtered.length === 0) {
    return defaultResults
  }

  const key = JSON.stringify({
    c: state.countries ? [...state.countries].sort() : [],
    g: state.genderRatios ? [...state.genderRatios].sort() : [],
    a: state.ageGroups ? [...state.ageGroups].sort() : [],
    l: state.languages ? [...state.languages].sort() : [],
    f: state.followersRanges ? [...state.followersRanges].sort() : [],
    e: state.engagementRateRanges ? [...state.engagementRateRanges].sort() : [],
  })
  const seed = hash(key)
  const count = Math.min(filtered.length, Math.max(20, 50 + (seed % 51)))
  const results: CreatorCard[] = []
  const used = new Set<number>()
  for (let k = 0; k < count; k++) {
    const idx = (seed + k * 7) % filtered.length
    let j = idx
    let tries = 0
    while (used.has(j) && tries < filtered.length) {
      j = (j + 1) % filtered.length
      tries++
    }
    used.add(j)
    const c = filtered[j]
    results.push({
      id: c.id,
      userName: c.userName,
      handle: c.handle,
      avatarUrl: c.avatarUrl,
      location: c.location,
      videoCount: c.videoCount,
      followers: c.followers,
      engagement: c.engagement,
      likes: c.likes,
    })
  }
  return results.length > 0 ? results : defaultResults
}
