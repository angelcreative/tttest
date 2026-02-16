/**
 * Saved creator search (mock). Payload matches CreatorSearch applied state for restore.
 */
export interface SavedSearchPayload {
  keywordChips: string[]
  countries: string[]
  statesProvinces: string[]
  contentCategories: string[]
  industryCategories: string[]
  languages: string[]
  genderRatios: string[]
  ageGroups: string[]
  creatorPriceRanges: string[]
  followersRanges: string[]
  averageViewsRanges: string[]
  medianViewsRanges: string[]
  engagementRateRanges: string[]
}

export interface SavedSearch {
  id: string
  name: string
  createdAt: string
  summary: string
  payload: SavedSearchPayload
}

function emptyPayload(): SavedSearchPayload {
  return {
    keywordChips: [],
    countries: [],
    statesProvinces: [],
    contentCategories: [],
    industryCategories: [],
    languages: [],
    genderRatios: [],
    ageGroups: [],
    creatorPriceRanges: [],
    followersRanges: [],
    averageViewsRanges: [],
    medianViewsRanges: [],
    engagementRateRanges: [],
  }
}

/** Seed data so the "Load search" list is never empty in the mock. */
export const SAVED_SEARCHES_SEED: SavedSearch[] = [
  {
    id: 'seed-1',
    name: 'Fitness creators US',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    summary: 'Followers, Follower country, States/Provinces',
    payload: {
      ...emptyPayload(),
      followersRanges: ['10K - 100K'],
      countries: ['United States'],
      statesProvinces: ['California', 'Texas'],
    },
  },
  {
    id: 'seed-2',
    name: 'Beauty & lifestyle',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    summary: 'Content categories, Engagement rate, Average views',
    payload: {
      ...emptyPayload(),
      contentCategories: ['Beauty & Care', 'Lifestyle & Leisure'],
      engagementRateRanges: ['3% - 5%'],
      averageViewsRanges: ['10K - 100K'],
    },
  },
]
