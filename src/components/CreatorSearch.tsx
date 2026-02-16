import { useState, useRef, useEffect, useMemo } from 'react'
import { Button, MenuTrigger, Menu, MenuItem, Popover, RadioGroup, Radio, SelectionIndicator } from 'react-aria-components'
import { ArrowLeft, Plus, X, User, Globe, TrendingUp, ChevronRight, ChevronDown, Check, ChevronLeft, Pencil, Bookmark, FolderOpen, MoreVertical } from 'lucide-react'
import { getCreatorSearchResults } from '../data/creatorSearch'
import type { CreatorCard as CreatorCardType, CreatorFilterState } from '../data/creatorSearch'
import type { SavedSearch, SavedSearchPayload } from '../data/savedSearches'
import { SAVED_SEARCHES_SEED } from '../data/savedSearches'
import { usePexelsVideosLoadMore } from '../hooks/usePexelsVideos'

const PAGE_SIZE = 24

const MOCK_CAMPAIGNS = [
  { id: '1', name: 'Summer 2025' },
  { id: '2', name: 'Product Launch' },
  { id: '3', name: 'Influencer Collab' },
]

interface CreatorSearchProps {
  onBack: () => void
}

/** Placeholder de altura fija para lazy load. */
function CardPlaceholder() {
  return (
    <div
      className="rounded-xl border overflow-hidden animate-pulse"
      style={{ minHeight: 180, borderColor: 'var(--divider)', background: 'var(--surface-0)' }}
    >
      <div className="p-4 flex gap-3">
        <div className="w-12 h-12 rounded-full opacity-40" style={{ background: 'var(--copy-tertiary)' }} />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded w-2/3 opacity-40" style={{ background: 'var(--copy-tertiary)' }} />
          <div className="h-3 rounded w-1/2 opacity-40" style={{ background: 'var(--copy-tertiary)' }} />
        </div>
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <div className="h-10 flex-1 rounded opacity-40" style={{ background: 'var(--copy-tertiary)' }} />
        <div className="h-10 flex-1 rounded opacity-40" style={{ background: 'var(--copy-tertiary)' }} />
        <div className="h-10 flex-1 rounded opacity-40" style={{ background: 'var(--copy-tertiary)' }} />
      </div>
    </div>
  )
}

function LazyCreatorCard({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback: React.ReactNode
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { rootMargin: '200px', threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className="min-h-[180px]">{visible ? children : fallback}</div>
}

function CreatorCard({
  creator,
  checked,
  onToggle,
  onSeeInsights,
}: {
  creator: CreatorCardType
  checked: boolean
  onToggle: () => void
  onSeeInsights: () => void
}) {
  return (
    <article
      className={`network-card flex flex-col h-full overflow-hidden transition-colors border rounded-xl ${checked ? 'network-card--selected' : ''}`}
      style={{
        borderWidth: '1px',
        borderColor: 'var(--border)',
        ...(checked ? { background: 'var(--color-teal-100)' } : { background: 'var(--card-background)', boxShadow: 'var(--card-shadow)' }),
      }}
    >
      <div className="p-4 flex gap-3 flex-nowrap min-w-0 relative">
        <img
          src={creator.avatarUrl}
          alt=""
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          style={{ background: 'var(--surface-1)' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.userName)}&size=96&background=dee2e6`
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold truncate text-sm" style={{ color: 'var(--text-body)' }}>{creator.userName}</p>
              <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>{creator.handle}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{creator.location}</p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                background: checked ? 'var(--button-primary)' : 'var(--surface-0)',
                borderColor: checked ? 'var(--button-primary)' : 'var(--input-border)',
              }}
              aria-label={checked ? 'Deselect creator' : 'Select creator'}
            >
              {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-semibold" style={{ color: 'var(--text-body)' }}>{creator.followers}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Followers</p>
        </div>
        <div>
          <p className="text-lg font-semibold" style={{ color: 'var(--text-body)' }}>{creator.engagement}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Engagement</p>
        </div>
        <div>
          <p className="text-lg font-semibold" style={{ color: 'var(--text-body)' }}>{creator.likes}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Likes</p>
        </div>
      </div>
      <div className="px-4 pb-4 pt-4 flex justify-end">
        <button
          type="button"
          onClick={onSeeInsights}
          className="inline-flex items-center gap-1 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded"
          style={{ color: 'var(--text-link)' }}
        >
          See profile insights
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </article>
  )
}

/** Grid de vídeos Pexels para el modal de detalle del creador. Reproduce en el mismo espacio y permite cargar más. */
function CreatorDetailVideos({ query = 'lifestyle' }: { query?: string }) {
  const [playingUrl, setPlayingUrl] = useState<string | null>(null)
  const { videos, loading, error, loadMore, loadingMore, hasMore } = usePexelsVideosLoadMore(query)

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-video rounded-lg animate-pulse" style={{ background: 'var(--surface-1)' }} />
        ))}
      </div>
    )
  }
  if (error || videos.length === 0) {
    return (
      <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>
        {error ?? 'No videos available.'}
      </p>
    )
  }
  return (
    <div className="space-y-4">
      {playingUrl && (
        <div className="rounded-lg overflow-hidden border bg-black" style={{ borderColor: 'var(--divider)' }}>
          <video src={playingUrl} controls autoPlay className="w-full aspect-video" />
          <div className="p-2 flex justify-end">
            <Button
              onPress={() => setPlayingUrl(null)}
              className="text-sm px-3 py-1.5 rounded-md"
              style={{ background: 'var(--button-secondary)', color: 'var(--button-secondary-text)' }}
            >
              Close video
            </Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {videos.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPlayingUrl(v.videoUrl)}
            className="relative aspect-video rounded-lg overflow-hidden border border-[var(--divider)] group text-left w-full"
          >
            <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="w-12 h-12 rounded-full flex items-center justify-center bg-white/90">
                <ChevronRight className="w-6 h-6 ml-0.5" style={{ color: 'var(--copy-primary)' }} strokeWidth={2} />
              </span>
            </span>
            <span className="absolute top-2 right-2 p-1 rounded bg-black/50">
              <MoreVertical className="w-4 h-4 text-white" strokeWidth={1.5} />
            </span>
          </button>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            onPress={loadMore}
            isDisabled={loadingMore}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'var(--button-secondary)', color: 'var(--button-secondary-text)' }}
          >
            {loadingMore ? 'Cargando…' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  )
}

const FAB_MENU_ITEMS = [
  {
    id: 'creator-demographics',
    label: 'Creator demographics',
    icon: User,
    children: [
      'Keyword search',
      'Content categories',
      'Industry categories',
      'Countries',
      'States/Provinces',
      'Languages',
    ],
  },
  {
    id: 'audience-demographics',
    label: 'Audience creator demographics',
    icon: Globe,
    children: ['Follower country', 'Age group', 'Gender ratio'],
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: TrendingUp,
    children: ['Creator price range', 'Followers', 'Average views', 'Median views', 'Engagement rate'],
  },
] as const

const CONTENT_CATEGORIES = [
  'Adult Content', 'Advertising/Marketing', 'Agriculture', 'Animals', 'Architecture', 'Art & Design',
  'Automotive', 'Beauty & Fashion', 'Books & Literature', 'Business & Finance', 'Celebrities & Gossip',
  "Children's Content", 'Comedy', 'Community & Social', 'Computers & Electronics', 'Construction',
  'Cooking & Food', 'Crafts & Hobbies', 'Culture & Heritage', 'Current Events', 'DIY & Home Improvement',
  'Education', 'Environment & Nature', 'Family & Parenting', 'Fashion & Style', 'Film & TV',
  'Finance & Investment', 'Fitness & Wellness', 'Gaming', 'Gardening', 'Health', 'History',
  'Home & Garden', 'Humor', 'Industrial', 'Inspirational', 'Internet & Web', 'Jobs & Careers',
  'Kids & Family', 'Language Learning', 'Legal', 'Lifestyle', 'Luxury', 'Marketing & Sales',
  'Medical', "Men's Interests", 'Mental Health', 'Military', 'Movies', 'Music & Dance',
  'News', 'Non-Profit', 'Parenting', 'Personal Development', 'Pets', 'Photography', 'Politics',
  'Pop Culture', 'Productivity', 'Psychology', 'Real Estate', 'Religion & Spirituality',
  'Relationships', 'Science', 'Science & Technology', 'Self-Improvement', 'Shopping & Deals',
  'Small Business', 'Social Issues', 'Software', 'Space & Astronomy', 'Spirituality',
  'Sports', 'Sports & Outdoors', 'Sustainable Living', 'Technology', 'Technology & Gadgets',
  'Theater', 'Travel', 'Travel & Tourism', 'Vehicles', 'Video Games', 'Vlog',
  'Web Development', 'Wedding', "Women's Interests", 'Work & Career', 'Writing & Blogging',
]

const INDUSTRY_CATEGORIES = [
  'Education', 'Vehicle & Transportation', 'Baby, Kids & Maternity', 'Financial Services',
  'Beauty & Personal Care', 'Oral Care', 'Haircare', 'Wig & Hair Styling', 'Skincare', 'Cosmetics',
  'Aesthetic Medicine', 'Fragrances & Perfumes', 'Feminine Care', 'Other Beauty & Personal Care',
  'Tech & Electronics', 'Appliances', 'Travel', 'Household Products', 'Pets', 'Apps', 'Home Improvement',
  'Apparel & Accessories', 'Clothing Accessories', 'Bags', 'Watches', 'Ordinary Jewelry', 'High-end Jewelry',
  "Men's Clothing", "Men's Shoes", "Women's Clothing", "Women's Shoes", 'Traditional & Ceremonial Clothing',
  'Wearable Tech Devices', 'Other Apparel & Accessories', 'Shoes Accessories', 'News & Entertainment',
  'Business Services', 'Games', 'Simulation Games', 'Strategy Games', 'Shooting Games', 'Sports Games',
  'Action Games', 'Racing Games', 'Puzzle Games', 'Casino Games', 'Match Games', 'RPG Games', 'Party Games',
  'Tabletop Games', 'Kids Games', 'Life Services', 'Food & Beverage', 'Sports & Outdoor', 'Health',
  'E-Commerce (Non-app)',
]

const COUNTRIES = [
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
]

const STATES_PROVINCES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'District of Columbia',
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
  'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories',
  'Nunavut', 'Yukon',
]

const AGE_GROUPS = ['Any', '18-24', '25-34', '35-44', '45-54', '55+']

const GENDER_RATIOS = ['Any', 'Female >50%', 'Female >60%', 'Female >70%', 'Male >50%', 'Male >60%', 'Male >70%']

const CREATOR_PRICE_RANGES = ['$0 - $10', '$10 - $100', '$100 - $500', '$500 - $1,000', '$1,000 - $5,000', '$5,000 - $10,000', '$10,000+']
const FOLLOWERS_RANGES = ['0 - 1K', '1K - 10K', '10K - 100K', '100K - 1M', '1M - 10M', '10M+']
const AVERAGE_VIEWS_RANGES = ['0 - 1K', '1K - 10K', '10K - 100K', '100K - 1M', '1M - 10M', '10M+']
const MEDIAN_VIEWS_RANGES = ['0 - 1K', '1K - 10K', '10K - 100K', '100K - 1M', '1M - 10M', '10M+']
const ENGAGEMENT_RATE_RANGES = ['0% - 1%', '1% - 3%', '3% - 5%', '5% - 10%', '10% - 20%', '20%+']

const LANGUAGES = [
  'Arabic', 'German', 'English', 'Spanish', 'French', 'Indonesian', 'Italian', 'Japanese',
  'Korean', 'Malay', 'Portuguese', 'Thai', 'Tagalog', 'Turkish', 'Vietnamese', 'Chinese',
  'Hindi', 'Russian', 'Dutch', 'Polish', 'Swedish', 'Greek', 'Czech', 'Romanian', 'Hungarian',
  'Danish', 'Finnish', 'Norwegian', 'Hebrew', 'Bengali', 'Urdu', 'Persian', 'Swahili',
  'Amharic', 'Afrikaans', 'Catalan', 'Ukrainian', 'Serbian', 'Croatian', 'Bulgarian',
]

export function CreatorSearch({ onBack }: CreatorSearchProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<Set<string>>(new Set())
  const [isResultsLoading, setIsResultsLoading] = useState(false)
  const [drawer, setDrawer] = useState<null | 'new' | 'existing'>(null)
  const [success, setSuccess] = useState<null | { type: 'created'; name: string } | { type: 'added' }>(null)
  const [campaignName, setCampaignName] = useState('')
  const [brandOption, setBrandOption] = useState<'custom' | 'profiles' | null>(null)
  const [brandName, setBrandName] = useState('')
  const [campaignDescription, setCampaignDescription] = useState('')
  const [sendNotification, setSendNotification] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState('')
  const [sendNotificationExisting, setSendNotificationExisting] = useState(false)
  const [adsAccountId, setAdsAccountId] = useState('6')
  const [filterDrawer, setFilterDrawer] = useState<string | null>(null)
  const [isFilterDrawerClosing, setIsFilterDrawerClosing] = useState(false)
  const [keywordChips, setKeywordChips] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [contentCategorySearch, setContentCategorySearch] = useState('')
  const [selectedContentCategories, setSelectedContentCategories] = useState<Set<string>>(new Set())
  const [industryCategorySearch, setIndustryCategorySearch] = useState('')
  const [selectedIndustryCategories, setSelectedIndustryCategories] = useState<Set<string>>(new Set())
  const [countrySearch, setCountrySearch] = useState('')
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set())
  const [statesProvincesSearch, setStatesProvincesSearch] = useState('')
  const [selectedStatesProvinces, setSelectedStatesProvinces] = useState<Set<string>>(new Set())
  const [languageSearch, setLanguageSearch] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set())
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<Set<string>>(new Set())
  const [selectedGenderRatios, setSelectedGenderRatios] = useState<Set<string>>(new Set())
  const [selectedCreatorPriceRanges, setSelectedCreatorPriceRanges] = useState<Set<string>>(new Set())
  const [selectedFollowersRanges, setSelectedFollowersRanges] = useState<Set<string>>(new Set())
  const [selectedAverageViewsRanges, setSelectedAverageViewsRanges] = useState<Set<string>>(new Set())
  const [selectedMedianViewsRanges, setSelectedMedianViewsRanges] = useState<Set<string>>(new Set())
  const [selectedEngagementRateRanges, setSelectedEngagementRateRanges] = useState<Set<string>>(new Set())
  const [appliedKeywordChips, setAppliedKeywordChips] = useState<string[]>([])
  const [appliedCountries, setAppliedCountries] = useState<Set<string>>(new Set())
  const [appliedStatesProvinces, setAppliedStatesProvinces] = useState<Set<string>>(new Set())
  const [appliedContentCategories, setAppliedContentCategories] = useState<Set<string>>(new Set())
  const [appliedIndustryCategories, setAppliedIndustryCategories] = useState<Set<string>>(new Set())
  const [appliedLanguages, setAppliedLanguages] = useState<Set<string>>(new Set())
  const [appliedGenderRatios, setAppliedGenderRatios] = useState<Set<string>>(new Set())
  const [appliedAgeGroups, setAppliedAgeGroups] = useState<Set<string>>(new Set())
  const [appliedFollowersRanges, setAppliedFollowersRanges] = useState<Set<string>>(new Set())
  const [appliedEngagementRateRanges, setAppliedEngagementRateRanges] = useState<Set<string>>(new Set())
  const [appliedCreatorPriceRanges, setAppliedCreatorPriceRanges] = useState<Set<string>>(new Set())
  const [appliedAverageViewsRanges, setAppliedAverageViewsRanges] = useState<Set<string>>(new Set())
  const [appliedMedianViewsRanges, setAppliedMedianViewsRanges] = useState<Set<string>>(new Set())
  const [insightsCreator, setInsightsCreator] = useState<CreatorCardType | null>(null)
  const [saveSearchOpen, setSaveSearchOpen] = useState(false)
  const [saveSearchName, setSaveSearchName] = useState('')
  const [saveSearchConfirmed, setSaveSearchConfirmed] = useState(false)
  const [loadSearchOpen, setLoadSearchOpen] = useState(false)
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(SAVED_SEARCHES_SEED)
  const menuRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)

  const filterState = useMemo<CreatorFilterState>(
    () => ({
      keywordChips: appliedKeywordChips.length > 0 ? appliedKeywordChips : undefined,
      countries: appliedCountries.size > 0 ? appliedCountries : undefined,
      statesProvinces: appliedStatesProvinces.size > 0 ? appliedStatesProvinces : undefined,
      contentCategories: appliedContentCategories.size > 0 ? appliedContentCategories : undefined,
      industryCategories: appliedIndustryCategories.size > 0 ? appliedIndustryCategories : undefined,
      languages: appliedLanguages.size > 0 ? appliedLanguages : undefined,
      genderRatios: appliedGenderRatios.size > 0 ? appliedGenderRatios : undefined,
      ageGroups: appliedAgeGroups.size > 0 ? appliedAgeGroups : undefined,
      followersRanges: appliedFollowersRanges.size > 0 ? appliedFollowersRanges : undefined,
      engagementRateRanges: appliedEngagementRateRanges.size > 0 ? appliedEngagementRateRanges : undefined,
      creatorPriceRanges: appliedCreatorPriceRanges.size > 0 ? appliedCreatorPriceRanges : undefined,
      averageViewsRanges: appliedAverageViewsRanges.size > 0 ? appliedAverageViewsRanges : undefined,
      medianViewsRanges: appliedMedianViewsRanges.size > 0 ? appliedMedianViewsRanges : undefined,
    }),
    [
      appliedKeywordChips,
      appliedCountries,
      appliedStatesProvinces,
      appliedContentCategories,
      appliedIndustryCategories,
      appliedLanguages,
      appliedGenderRatios,
      appliedAgeGroups,
      appliedFollowersRanges,
      appliedEngagementRateRanges,
      appliedCreatorPriceRanges,
      appliedAverageViewsRanges,
      appliedMedianViewsRanges,
    ]
  )

  type ActiveFilterEntry = { id: string; label: string }
  const activeFilters = useMemo((): ActiveFilterEntry[] => {
    const list: ActiveFilterEntry[] = []
    const fmt = (values: string[] | Set<string>, max = 2) => {
      const arr = values instanceof Set ? [...values] : values
      if (arr.length <= max) return arr.join(', ')
      return arr.slice(0, max).join(', ') + ` (+${arr.length - max})`
    }
    if (appliedKeywordChips.length > 0) list.push({ id: 'Keyword search', label: `Keyword search: ${appliedKeywordChips.join(', ')}` })
    if (appliedContentCategories.size > 0) list.push({ id: 'Content categories', label: `Content categories: ${fmt(appliedContentCategories)}` })
    if (appliedIndustryCategories.size > 0) list.push({ id: 'Industry categories', label: `Industry categories: ${fmt(appliedIndustryCategories)}` })
    if (appliedCountries.size > 0) list.push({ id: 'Follower country', label: `Follower country: ${fmt(appliedCountries)}` })
    if (appliedStatesProvinces.size > 0) list.push({ id: 'States/Provinces', label: `States/Provinces: ${fmt(appliedStatesProvinces)}` })
    if (appliedLanguages.size > 0) list.push({ id: 'Languages', label: `Languages: ${fmt(appliedLanguages)}` })
    if (appliedGenderRatios.size > 0) list.push({ id: 'Gender ratio', label: `Gender ratio: ${fmt(appliedGenderRatios)}` })
    if (appliedAgeGroups.size > 0) list.push({ id: 'Age group', label: `Age group: ${fmt(appliedAgeGroups)}` })
    if (appliedCreatorPriceRanges.size > 0) list.push({ id: 'Creator price range', label: `Creator price range: ${fmt(appliedCreatorPriceRanges)}` })
    if (appliedFollowersRanges.size > 0) list.push({ id: 'Followers', label: `Followers: ${fmt(appliedFollowersRanges)}` })
    if (appliedAverageViewsRanges.size > 0) list.push({ id: 'Average views', label: `Average views: ${fmt(appliedAverageViewsRanges)}` })
    if (appliedMedianViewsRanges.size > 0) list.push({ id: 'Median views', label: `Median views: ${fmt(appliedMedianViewsRanges)}` })
    if (appliedEngagementRateRanges.size > 0) list.push({ id: 'Engagement rate', label: `Engagement rate: ${fmt(appliedEngagementRateRanges)}` })
    return list
  }, [
    appliedKeywordChips,
    appliedContentCategories,
    appliedIndustryCategories,
    appliedCountries,
    appliedStatesProvinces,
    appliedLanguages,
    appliedGenderRatios,
    appliedAgeGroups,
    appliedCreatorPriceRanges,
    appliedFollowersRanges,
    appliedAverageViewsRanges,
    appliedMedianViewsRanges,
    appliedEngagementRateRanges,
  ])

  const creatorResults = useMemo(
    () => getCreatorSearchResults(filterState),
    [filterState]
  )

  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(creatorResults.length / PAGE_SIZE))
  const paginatedResults = useMemo(
    () =>
      creatorResults.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [creatorResults, currentPage]
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilters])

  useEffect(() => {
    if (activeFilters.length === 0) setSelectedCreatorIds(new Set())
  }, [activeFilters.length])

  const removeFilter = (filterId: string) => {
    if (filterId === 'Keyword search') setAppliedKeywordChips([])
    else if (filterId === 'Content categories') setAppliedContentCategories(new Set())
    else if (filterId === 'Industry categories') setAppliedIndustryCategories(new Set())
    else if (filterId === 'Follower country') setAppliedCountries(new Set())
    else if (filterId === 'States/Provinces') setAppliedStatesProvinces(new Set())
    else if (filterId === 'Languages') setAppliedLanguages(new Set())
    else if (filterId === 'Gender ratio') setAppliedGenderRatios(new Set())
    else if (filterId === 'Age group') setAppliedAgeGroups(new Set())
    else if (filterId === 'Creator price range') setAppliedCreatorPriceRanges(new Set())
    else if (filterId === 'Followers') setAppliedFollowersRanges(new Set())
    else if (filterId === 'Average views') setAppliedAverageViewsRanges(new Set())
    else if (filterId === 'Median views') setAppliedMedianViewsRanges(new Set())
    else if (filterId === 'Engagement rate') setAppliedEngagementRateRanges(new Set())
  }

  const applyFilterDrawerAndSearch = () => {
    if (filterDrawer === 'Keyword search') setAppliedKeywordChips([...keywordChips])
    else if (filterDrawer === 'Follower country' || filterDrawer === 'Countries') setAppliedCountries(new Set(selectedCountries))
    else if (filterDrawer === 'States/Provinces') setAppliedStatesProvinces(new Set(selectedStatesProvinces))
    else if (filterDrawer === 'Content categories') setAppliedContentCategories(new Set(selectedContentCategories))
    else if (filterDrawer === 'Industry categories') setAppliedIndustryCategories(new Set(selectedIndustryCategories))
    else if (filterDrawer === 'Languages') setAppliedLanguages(new Set(selectedLanguages))
    else if (filterDrawer === 'Gender ratio') setAppliedGenderRatios(new Set(selectedGenderRatios))
    else if (filterDrawer === 'Age group') setAppliedAgeGroups(new Set(selectedAgeGroups))
    else if (filterDrawer === 'Creator price range') setAppliedCreatorPriceRanges(new Set(selectedCreatorPriceRanges))
    else if (filterDrawer === 'Followers') setAppliedFollowersRanges(new Set(selectedFollowersRanges))
    else if (filterDrawer === 'Average views') setAppliedAverageViewsRanges(new Set(selectedAverageViewsRanges))
    else if (filterDrawer === 'Median views') setAppliedMedianViewsRanges(new Set(selectedMedianViewsRanges))
    else if (filterDrawer === 'Engagement rate') setAppliedEngagementRateRanges(new Set(selectedEngagementRateRanges))
    closeFilterDrawer()
    setIsResultsLoading(true)
    setTimeout(() => setIsResultsLoading(false), 100)
  }

  const toggleCreatorSelection = (id: string) => {
    setSelectedCreatorIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const applyPayload = (payload: SavedSearchPayload) => {
    setAppliedKeywordChips(payload.keywordChips ?? [])
    setAppliedCountries(new Set(payload.countries ?? []))
    setAppliedStatesProvinces(new Set(payload.statesProvinces ?? []))
    setAppliedContentCategories(new Set(payload.contentCategories ?? []))
    setAppliedIndustryCategories(new Set(payload.industryCategories ?? []))
    setAppliedLanguages(new Set(payload.languages ?? []))
    setAppliedGenderRatios(new Set(payload.genderRatios ?? []))
    setAppliedAgeGroups(new Set(payload.ageGroups ?? []))
    setAppliedCreatorPriceRanges(new Set(payload.creatorPriceRanges ?? []))
    setAppliedFollowersRanges(new Set(payload.followersRanges ?? []))
    setAppliedAverageViewsRanges(new Set(payload.averageViewsRanges ?? []))
    setAppliedMedianViewsRanges(new Set(payload.medianViewsRanges ?? []))
    setAppliedEngagementRateRanges(new Set(payload.engagementRateRanges ?? []))
    setIsResultsLoading(true)
    setTimeout(() => setIsResultsLoading(false), 100)
  }

  const handleSaveSearch = () => {
    const name = saveSearchName.trim()
    if (!name) return
    const payload: SavedSearchPayload = {
      keywordChips: [...appliedKeywordChips],
      countries: [...appliedCountries],
      statesProvinces: [...appliedStatesProvinces],
      contentCategories: [...appliedContentCategories],
      industryCategories: [...appliedIndustryCategories],
      languages: [...appliedLanguages],
      genderRatios: [...appliedGenderRatios],
      ageGroups: [...appliedAgeGroups],
      creatorPriceRanges: [...appliedCreatorPriceRanges],
      followersRanges: [...appliedFollowersRanges],
      averageViewsRanges: [...appliedAverageViewsRanges],
      medianViewsRanges: [...appliedMedianViewsRanges],
      engagementRateRanges: [...appliedEngagementRateRanges],
    }
    const summary = activeFilters.length > 0 ? activeFilters.map((f) => f.id).join(', ') : 'No filters'
    setSavedSearches((prev) => [
      ...prev,
      {
        id: `saved-${Date.now()}`,
        name,
        createdAt: new Date().toISOString(),
        summary,
        payload,
      },
    ])
    setSaveSearchConfirmed(true)
  }

  const handleLoadSearch = (item: SavedSearch) => {
    applyPayload(item.payload)
    setLoadSearchOpen(false)
  }

  const formatSavedDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        fabRef.current &&
        !fabRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const openFilterDrawer = (title: string) => {
    if (title === 'Keyword search') setKeywordChips([...appliedKeywordChips])
    else if (title === 'Follower country' || title === 'Countries') setSelectedCountries(new Set(appliedCountries))
    else if (title === 'States/Provinces') setSelectedStatesProvinces(new Set(appliedStatesProvinces))
    else if (title === 'Content categories') setSelectedContentCategories(new Set(appliedContentCategories))
    else if (title === 'Industry categories') setSelectedIndustryCategories(new Set(appliedIndustryCategories))
    else if (title === 'Languages') setSelectedLanguages(new Set(appliedLanguages))
    else if (title === 'Gender ratio') setSelectedGenderRatios(new Set(appliedGenderRatios))
    else if (title === 'Age group') setSelectedAgeGroups(new Set(appliedAgeGroups))
    else if (title === 'Creator price range') setSelectedCreatorPriceRanges(new Set(appliedCreatorPriceRanges))
    else if (title === 'Followers') setSelectedFollowersRanges(new Set(appliedFollowersRanges))
    else if (title === 'Average views') setSelectedAverageViewsRanges(new Set(appliedAverageViewsRanges))
    else if (title === 'Median views') setSelectedMedianViewsRanges(new Set(appliedMedianViewsRanges))
    else if (title === 'Engagement rate') setSelectedEngagementRateRanges(new Set(appliedEngagementRateRanges))
    setFilterDrawer(title)
    setMenuOpen(false)
  }

  const closeFilterDrawer = () => {
    if (!filterDrawer) return
    setIsFilterDrawerClosing(true)
  }

  useEffect(() => {
    if (!isFilterDrawerClosing) return
    const t = setTimeout(() => {
      setFilterDrawer(null)
      setIsFilterDrawerClosing(false)
    }, 300)
    return () => clearTimeout(t)
  }, [isFilterDrawerClosing])

  const addKeywordChip = () => {
    const value = keywordInput.trim()
    if (value && !keywordChips.includes(value)) {
      setKeywordChips((prev) => [...prev, value])
      setKeywordInput('')
    }
  }

  const removeKeywordChip = (chip: string) => {
    setKeywordChips((prev) => prev.filter((c) => c !== chip))
  }

  const baseUrl = import.meta.env.BASE_URL

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-auto" style={{ background: 'var(--surface-page)' }}>
      <div
        className="flex-shrink-0 flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-4"
        style={{ background: 'var(--surface-page)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Button onPress={onBack} className="titan-sidebar-icon-btn shrink-0" aria-label="Back">
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </Button>
          <h1 className="text-2xl font-semibold truncate" style={{ color: 'var(--copy-primary)' }}>
            Campaign collab
          </h1>
          <MenuTrigger>
            <Button
              aria-label="Ads account"
              className="titan-btn-secondary ml-2 min-w-0 max-w-[180px] inline-flex items-center gap-2"
            >
              {adsAccountId === '6' ? 'Ads Account 6' : adsAccountId === '1' ? 'Ads Account 1' : 'Ads Account 2'}
              <ChevronDown className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            </Button>
            <Popover className="titan-menu" placement="bottom start" offset={4}>
              <Menu
                className="min-w-[180px] p-0 outline-none bg-transparent border-0 shadow-none"
                onAction={(key) => setAdsAccountId(String(key))}
              >
                <MenuItem id="6" className="titan-menu-item">Ads Account 6</MenuItem>
                <MenuItem id="1" className="titan-menu-item">Ads Account 1</MenuItem>
                <MenuItem id="2" className="titan-menu-item">Ads Account 2</MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm px-2" style={{ color: 'var(--copy-secondary)' }}>
            {selectedCreatorIds.size} selected
          </span>
          <Button
            onPress={() => {
              setSaveSearchOpen(true)
              setSaveSearchConfirmed(false)
              setSaveSearchName('')
            }}
            className="titan-btn-secondary inline-flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4" strokeWidth={1.5} />
            Save search
          </Button>
          <Button onPress={() => setLoadSearchOpen(true)} className="titan-btn-secondary inline-flex items-center gap-2">
            <FolderOpen className="w-4 h-4" strokeWidth={1.5} />
            Load search
          </Button>
          <MenuTrigger>
            <Button
              isDisabled={creatorResults.length === 0}
              className="titan-btn-primary inline-flex items-center gap-2"
              aria-label="Add to campaign"
            >
              Add to campaign
              <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
            </Button>
            <Popover
              className="titan-popover w-56 rounded-xl py-1"
              style={{
                background: 'var(--surface-1, #ffffff)',
                border: '1px solid var(--divider)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              }}
            >
              <Menu
                className="outline-none"
                onAction={(key) => {
                  if (key === 'new') setDrawer('new')
                  else if (key === 'existing') setDrawer('existing')
                }}
              >
                <MenuItem id="new" className="titan-menu-item">New campaign</MenuItem>
                <MenuItem id="existing" className="titan-menu-item">Add to existing campaign</MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        </div>
      </div>

      {/* Bloque Connected Account entre título y FAB */}
      <div
        className="flex-shrink-0 mx-6 mb-4 flex items-center gap-4 rounded-xl border px-4 py-3"
        style={{
          background: 'var(--surface-1)',
          borderColor: 'var(--divider)',
        }}
      >
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
          style={{ background: 'var(--color-black-100)' }}
        >
          <User className="h-5 w-5" style={{ color: 'var(--copy-secondary)' }} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium" style={{ color: 'var(--copy-tertiary)' }}>Connected Account:</p>
          <p className="truncate text-sm font-semibold" style={{ color: 'var(--copy-primary)' }}>@adidas</p>
        </div>
      </div>

      {/* Fila: columna FAB fija 72px + contenido fijo (el menú abre en overlay, no desplaza nada) */}
      <div className="flex-1 flex min-h-0 min-w-0 px-6 pb-6 overflow-hidden w-full">
        <div ref={menuRef} className="flex-shrink-0 w-[72px] min-w-[72px] pt-4 relative" onMouseLeave={() => setExpandedId(null)}>
          <button
            ref={fabRef}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 flex-shrink-0"
            style={{ background: 'var(--button-primary)' }}
            aria-label={menuOpen ? 'Close filters' : 'Open search criteria'}
            aria-expanded={menuOpen}
            title={menuOpen ? 'Close' : 'Search criteria'}
          >
            {menuOpen ? (
              <X className="w-7 h-7" strokeWidth={1.5} style={{ color: 'var(--color-white-900)' }} />
            ) : (
              <Plus className="w-7 h-7" strokeWidth={1.5} style={{ color: 'var(--color-white-900)' }} />
            )}
            {activeFilters.length > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ background: 'var(--button-primary)', color: 'var(--button-primary-label)', border: '2px solid var(--surface-page)' }}
              >
                {activeFilters.length}
              </span>
            )}
          </button>
          {menuOpen && (
            <div className="absolute left-full top-0 pt-4 pl-2 flex items-start z-20">
              <div className="titan-menu titan-popover w-72 overflow-hidden flex-shrink-0" role="menu">
                {FAB_MENU_ITEMS.map((item) => {
                  const isHovered = expandedId === item.id
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setExpandedId(item.id)}
                      className="titan-menu-item w-full flex items-center gap-3 font-medium text-sm rounded-none min-h-[40px]"
                      style={{ background: isHovered ? 'var(--menu-item-slot-bg-hover)' : undefined }}
                      role="menuitem"
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--menu-item-slot-icon, var(--copy-tertiary))' }} strokeWidth={1.5} />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--menu-item-slot-icon, var(--copy-tertiary))' }} strokeWidth={1.5} />
                    </button>
                  )
                })}
              </div>
              {expandedId && (() => {
                const item = FAB_MENU_ITEMS.find((i) => i.id === expandedId)
                if (!item) return null
                return (
                  <div className="titan-menu titan-popover w-56 overflow-hidden flex-shrink-0 ml-2" role="menu">
                    {item.children.map((child) => (
                      <button
                        key={child}
                        type="button"
                        onClick={() => openFilterDrawer(child)}
                        className="titan-menu-item w-full text-left text-sm rounded-none"
                        role="menuitem"
                      >
                        {child}
                      </button>
                    ))}
                  </div>
                )
              })()}
            </div>
          )}
        </div>

        {/* Zona de contenido: ancho fijo, nunca se desplaza al abrir el menú FAB */}
        <div className="flex-1 min-w-0 pt-4 overflow-auto pl-4">
          <div className="w-full min-w-0">
        {/* Pills de filtros activos */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {activeFilters.map((filter) => (
              <span key={filter.id} className="titan-pill">
                {filter.label}
                <button
                  type="button"
                  onClick={() => removeFilter(filter.id)}
                  className="titan-pill-remove"
                  aria-label={`Remove ${filter.label}`}
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Resultados: loading 100ms al Apply, luego grid + paginación */}
        {isResultsLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4" style={{ color: 'var(--text-muted)' }}>
            <div className="w-10 h-10 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden />
            <p className="text-sm font-medium">Loading results…</p>
          </div>
        ) : creatorResults.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {paginatedResults.map((creator) => (
                <LazyCreatorCard key={creator.id} fallback={<CardPlaceholder />}>
                  <CreatorCard
                    creator={creator}
                    checked={selectedCreatorIds.has(creator.id)}
                    onToggle={() => toggleCreatorSelection(creator.id)}
                    onSeeInsights={() => setInsightsCreator(creator)}
                  />
                </LazyCreatorCard>
              ))}
            </div>
            {/* Paginación Titan */}
            <nav
              className="flex items-center justify-center gap-2 flex-wrap"
              aria-label="Pagination"
            >
              <Button
                onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                isDisabled={currentPage === 1}
                className="titan-btn-secondary rounded-full p-2"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </Button>
              <span className="px-4 py-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                isDisabled={currentPage === totalPages}
                className="titan-btn-secondary rounded-full p-2"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
              </Button>
            </nav>
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 w-full"
            style={{ color: 'var(--copy-primary)' }}
          >
            <p className="text-lg font-semibold mb-2">Nothing selected yet</p>
            <p className="text-sm" style={{ color: 'var(--copy-secondary)' }}>
              Use Search above to select criteria and see creator results.
            </p>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* Drawer: filtros del FAB (Keyword search, etc.) — misma shell, contenido por voz */}
      {filterDrawer !== null && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <div
            className="absolute inset-0 bg-black/30 pointer-events-auto transition-opacity duration-300 ease-out"
            style={{ opacity: isFilterDrawerClosing ? 0 : 1 }}
            aria-hidden
            onClick={closeFilterDrawer}
          />
          <div
            className="relative w-full max-w-md flex flex-col max-h-full overflow-hidden pointer-events-auto bg-[var(--surface-page)] border-l border-[var(--divider)] shadow-xl transition-transform duration-300 ease-out"
            style={{
              transform: isFilterDrawerClosing ? 'translateX(100%)' : 'translateX(0)',
              boxShadow: isFilterDrawerClosing ? 'none' : 'var(--elevation-2, 0 10px 40px rgba(0,0,0,0.12))',
            }}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--copy-primary)' }}>
                {filterDrawer}
              </h2>
              <Button
                onPress={closeFilterDrawer}
                className="rounded-full p-2 transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ color: 'var(--copy-secondary)' }}
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6 flex flex-col min-h-0">
              {filterDrawer === 'Keyword search' ? (
                <div className="space-y-5">
                  <p className="text-sm" style={{ color: 'var(--copy-secondary)' }}>
                    Optional. Search for specific creators by name or username.
                  </p>
                  <div>
                    {keywordChips.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {keywordChips.map((chip) => (
                          <span key={chip} className="titan-pill">
                            {chip}
                            <button
                              type="button"
                              onClick={() => removeKeywordChip(chip)}
                              className="titan-pill-remove"
                              aria-label={`Remove ${chip}`}
                            >
                              <X className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault()
                          addKeywordChip()
                        }
                      }}
                      placeholder="Type a keyword and press comma or Enter to add"
                      className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                      style={{
                        background: 'var(--input-background)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--copy-primary)',
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)]">
                    <Button
                      onPress={() => {
                        setKeywordChips([])
                        setKeywordInput('')
                        closeFilterDrawer()
                      }}
                      className="titan-btn-secondary"
                    >
                      Cancel
                    </Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">
                      Apply
                    </Button>
                  </div>
                </div>
              ) : filterDrawer === 'Content categories' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <input
                    type="search"
                    value={contentCategorySearch}
                    onChange={(e) => setContentCategorySearch(e.target.value)}
                    placeholder="Search content categories..."
                    className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors flex-shrink-0"
                    style={{
                      background: 'var(--input-background)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--copy-primary)',
                    }}
                  />
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {CONTENT_CATEGORIES.filter((cat) =>
                        !contentCategorySearch.trim() || cat.toLowerCase().includes(contentCategorySearch.trim().toLowerCase())
                      ).map((category) => (
                        <li key={category}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedContentCategories.has(category)}
                              onChange={(e) => {
                                setSelectedContentCategories((prev) => {
                                  const next = new Set(prev)
                                  if (e.target.checked) next.add(category)
                                  else next.delete(category)
                                  return next
                                })
                              }}
                              className="rounded border-[var(--input-border)]"
                              style={{ accentColor: 'var(--button-primary)' }}
                            />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{category}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button
                      onPress={() => {
                        setSelectedContentCategories(new Set())
                        closeFilterDrawer()
                      }}
                      className="titan-btn-secondary"
                    >
                      Cancel
                    </Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">
                      Apply
                    </Button>
                  </div>
                </div>
              ) : filterDrawer === 'Industry categories' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <input
                    type="search"
                    value={industryCategorySearch}
                    onChange={(e) => setIndustryCategorySearch(e.target.value)}
                    placeholder="Search industry categories..."
                    className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors flex-shrink-0"
                    style={{
                      background: 'var(--input-background)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--copy-primary)',
                    }}
                  />
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {INDUSTRY_CATEGORIES.filter((cat) =>
                        !industryCategorySearch.trim() || cat.toLowerCase().includes(industryCategorySearch.trim().toLowerCase())
                      ).map((category) => (
                        <li key={category}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedIndustryCategories.has(category)}
                              onChange={(e) => {
                                setSelectedIndustryCategories((prev) => {
                                  const next = new Set(prev)
                                  if (e.target.checked) next.add(category)
                                  else next.delete(category)
                                  return next
                                })
                              }}
                              className="rounded border-[var(--input-border)]"
                              style={{ accentColor: 'var(--button-primary)' }}
                            />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{category}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button
                      onPress={() => {
                        setSelectedIndustryCategories(new Set())
                        closeFilterDrawer()
                      }}
                      className="titan-btn-secondary"
                    >
                      Cancel
                    </Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">
                      Apply
                    </Button>
                  </div>
                </div>
              ) : filterDrawer === 'Countries' || filterDrawer === 'Follower country' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <input
                    type="search"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search countries..."
                    className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors flex-shrink-0"
                    style={{
                      background: 'var(--input-background)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--copy-primary)',
                    }}
                  />
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {COUNTRIES.filter((country) =>
                        !countrySearch.trim() || country.toLowerCase().includes(countrySearch.trim().toLowerCase())
                      ).map((country) => (
                        <li key={country}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedCountries.has(country)}
                              onChange={(e) => {
                                setSelectedCountries((prev) => {
                                  const next = new Set(prev)
                                  if (e.target.checked) next.add(country)
                                  else next.delete(country)
                                  return next
                                })
                              }}
                              className="rounded border-[var(--input-border)]"
                              style={{ accentColor: 'var(--button-primary)' }}
                            />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{country}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button
                      onPress={() => {
                        setSelectedCountries(new Set())
                        closeFilterDrawer()
                      }}
                      className="titan-btn-secondary"
                    >
                      Cancel
                    </Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">
                      Apply
                    </Button>
                  </div>
                </div>
              ) : filterDrawer === 'States/Provinces' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <input
                    type="search"
                    value={statesProvincesSearch}
                    onChange={(e) => setStatesProvincesSearch(e.target.value)}
                    placeholder="Search states..."
                    className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors flex-shrink-0"
                    style={{
                      background: 'var(--input-background)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--copy-primary)',
                    }}
                  />
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {STATES_PROVINCES.filter((item) =>
                        !statesProvincesSearch.trim() || item.toLowerCase().includes(statesProvincesSearch.trim().toLowerCase())
                      ).map((item) => (
                        <li key={item}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedStatesProvinces.has(item)}
                              onChange={(e) => {
                                setSelectedStatesProvinces((prev) => {
                                  const next = new Set(prev)
                                  if (e.target.checked) next.add(item)
                                  else next.delete(item)
                                  return next
                                })
                              }}
                              className="rounded border-[var(--input-border)]"
                              style={{ accentColor: 'var(--button-primary)' }}
                            />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{item}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button
                      onPress={() => {
                        setSelectedStatesProvinces(new Set())
                        closeFilterDrawer()
                      }}
                      className="titan-btn-secondary"
                    >
                      Cancel
                    </Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">
                      Apply
                    </Button>
                  </div>
                </div>
              ) : filterDrawer === 'Age group' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {AGE_GROUPS.map((age) => (
                        <li key={age}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedAgeGroups.has(age)}
                              onChange={(e) => {
                                setSelectedAgeGroups((prev) => {
                                  const next = new Set(prev)
                                  if (e.target.checked) next.add(age)
                                  else next.delete(age)
                                  return next
                                })
                              }}
                              className="rounded border-[var(--input-border)]"
                              style={{ accentColor: 'var(--button-primary)' }}
                            />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{age}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button
                      onPress={() => {
                        setSelectedAgeGroups(new Set())
                        closeFilterDrawer()
                      }}
                      className="titan-btn-secondary"
                    >
                      Cancel
                    </Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">
                      Apply
                    </Button>
                  </div>
                </div>
              ) : filterDrawer === 'Gender ratio' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {GENDER_RATIOS.map((ratio) => (
                        <li key={ratio}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedGenderRatios.has(ratio)}
                              onChange={(e) => {
                                setSelectedGenderRatios((prev) => {
                                  const next = new Set(prev)
                                  if (e.target.checked) next.add(ratio)
                                  else next.delete(ratio)
                                  return next
                                })
                              }}
                              className="rounded border-[var(--input-border)]"
                              style={{ accentColor: 'var(--button-primary)' }}
                            />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{ratio}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button
                      onPress={() => {
                        setSelectedGenderRatios(new Set())
                        closeFilterDrawer()
                      }}
                      className="titan-btn-secondary"
                    >
                      Cancel
                    </Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">
                      Apply
                    </Button>
                  </div>
                </div>
              ) : filterDrawer === 'Creator price range' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {CREATOR_PRICE_RANGES.map((opt) => (
                        <li key={opt}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input type="checkbox" checked={selectedCreatorPriceRanges.has(opt)} onChange={(e) => { setSelectedCreatorPriceRanges((p) => { const n = new Set(p); if (e.target.checked) n.add(opt); else n.delete(opt); return n }) }} className="rounded border-[var(--input-border)]" style={{ accentColor: 'var(--button-primary)' }} />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{opt}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button onPress={() => { setSelectedCreatorPriceRanges(new Set()); closeFilterDrawer() }} className="titan-btn-secondary">Cancel</Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">Apply</Button>
                  </div>
                </div>
              ) : filterDrawer === 'Followers' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {FOLLOWERS_RANGES.map((opt) => (
                        <li key={opt}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input type="checkbox" checked={selectedFollowersRanges.has(opt)} onChange={(e) => { setSelectedFollowersRanges((p) => { const n = new Set(p); if (e.target.checked) n.add(opt); else n.delete(opt); return n }) }} className="rounded border-[var(--input-border)]" style={{ accentColor: 'var(--button-primary)' }} />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{opt}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button onPress={() => { setSelectedFollowersRanges(new Set()); closeFilterDrawer() }} className="titan-btn-secondary">Cancel</Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">Apply</Button>
                  </div>
                </div>
              ) : filterDrawer === 'Average views' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {AVERAGE_VIEWS_RANGES.map((opt) => (
                        <li key={opt}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input type="checkbox" checked={selectedAverageViewsRanges.has(opt)} onChange={(e) => { setSelectedAverageViewsRanges((p) => { const n = new Set(p); if (e.target.checked) n.add(opt); else n.delete(opt); return n }) }} className="rounded border-[var(--input-border)]" style={{ accentColor: 'var(--button-primary)' }} />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{opt}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button onPress={() => { setSelectedAverageViewsRanges(new Set()); closeFilterDrawer() }} className="titan-btn-secondary">Cancel</Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">Apply</Button>
                  </div>
                </div>
              ) : filterDrawer === 'Median views' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {MEDIAN_VIEWS_RANGES.map((opt) => (
                        <li key={opt}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input type="checkbox" checked={selectedMedianViewsRanges.has(opt)} onChange={(e) => { setSelectedMedianViewsRanges((p) => { const n = new Set(p); if (e.target.checked) n.add(opt); else n.delete(opt); return n }) }} className="rounded border-[var(--input-border)]" style={{ accentColor: 'var(--button-primary)' }} />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{opt}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button onPress={() => { setSelectedMedianViewsRanges(new Set()); closeFilterDrawer() }} className="titan-btn-secondary">Cancel</Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">Apply</Button>
                  </div>
                </div>
              ) : filterDrawer === 'Engagement rate' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {ENGAGEMENT_RATE_RANGES.map((opt) => (
                        <li key={opt}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input type="checkbox" checked={selectedEngagementRateRanges.has(opt)} onChange={(e) => { setSelectedEngagementRateRanges((p) => { const n = new Set(p); if (e.target.checked) n.add(opt); else n.delete(opt); return n }) }} className="rounded border-[var(--input-border)]" style={{ accentColor: 'var(--button-primary)' }} />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{opt}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button onPress={() => { setSelectedEngagementRateRanges(new Set()); closeFilterDrawer() }} className="titan-btn-secondary">Cancel</Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">Apply</Button>
                  </div>
                </div>
              ) : filterDrawer === 'Languages' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <input
                    type="search"
                    value={languageSearch}
                    onChange={(e) => setLanguageSearch(e.target.value)}
                    placeholder="Search languages..."
                    className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors flex-shrink-0"
                    style={{
                      background: 'var(--input-background)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--copy-primary)',
                    }}
                  />
                  <div className="flex-1 min-h-0 overflow-auto border border-[var(--divider)] rounded-lg flex-shrink" style={{ background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {LANGUAGES.filter((lang) =>
                        !languageSearch.trim() || lang.toLowerCase().includes(languageSearch.trim().toLowerCase())
                      ).map((lang) => (
                        <li key={lang}>
                          <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedLanguages.has(lang)}
                              onChange={(e) => {
                                setSelectedLanguages((prev) => {
                                  const next = new Set(prev)
                                  if (e.target.checked) next.add(lang)
                                  else next.delete(lang)
                                  return next
                                })
                              }}
                              className="rounded border-[var(--input-border)]"
                              style={{ accentColor: 'var(--button-primary)' }}
                            />
                            <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>{lang}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)] flex-shrink-0">
                    <Button
                      onPress={() => {
                        setSelectedLanguages(new Set())
                        closeFilterDrawer()
                      }}
                      className="titan-btn-secondary"
                    >
                      Cancel
                    </Button>
                    <Button onPress={applyFilterDrawerAndSearch} className="titan-btn-primary">
                      Apply
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm" style={{ color: 'var(--copy-secondary)' }}>
                    Content for &quot;{filterDrawer}&quot; — to be defined.
                  </p>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[var(--divider)]">
                    <Button onPress={closeFilterDrawer} className="titan-btn-secondary">
                      Cancel
                    </Button>
                    <Button onPress={closeFilterDrawer} className="titan-btn-primary">
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Creator insights — vídeos Pexels */}
      {insightsCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => setInsightsCreator(null)} />
          <div
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl overflow-hidden border shadow-xl z-10"
            style={{ background: 'var(--surface-page)', borderColor: 'var(--divider)' }}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--divider)' }}>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--copy-primary)' }}>Creator insights</h2>
              <Button
                onPress={() => setInsightsCreator(null)}
                className="rounded-full p-2"
                style={{ color: 'var(--copy-secondary)' }}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-6">
              <div className="rounded-xl border p-4 flex gap-4" style={{ borderColor: 'var(--divider)', background: 'var(--surface-0)' }}>
                <img
                  src={insightsCreator.avatarUrl}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  style={{ background: 'var(--surface-1)' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base" style={{ color: 'var(--text-body)' }}>{insightsCreator.userName}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{insightsCreator.handle}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{insightsCreator.location}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{insightsCreator.videoCount} videos</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold" style={{ color: 'var(--text-body)' }}>{insightsCreator.followers}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Followers</p>
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ color: 'var(--text-body)' }}>{insightsCreator.engagement}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Engagement</p>
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ color: 'var(--text-body)' }}>{insightsCreator.likes}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Likes</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--copy-primary)' }}>Videos</h3>
                <CreatorDetailVideos query="lifestyle" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer: New campaign — Titan/brown, radio sin default, checkbox Titan, aviso Info */}
      {drawer === 'new' && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" aria-hidden onClick={() => setDrawer(null)} />
          <div
            className="relative w-full max-w-md shadow-xl flex flex-col max-h-full overflow-auto rounded-l-xl"
            style={{ background: 'var(--surface-page)', borderLeft: '1px solid var(--divider)' }}
          >
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--divider)' }}>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--copy-primary)' }}>New campaign</h2>
              <Button onPress={() => setDrawer(null)} className="p-2 rounded-lg" style={{ color: 'var(--copy-secondary)' }} aria-label="Close">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form
              className="p-6 space-y-5 flex-1 overflow-auto"
              onSubmit={(e) => {
                e.preventDefault()
                setDrawer(null)
                setSuccess({ type: 'created', name: campaignName || 'Campaign' })
                setCampaignName('')
                setBrandName('')
                setCampaignDescription('')
                setSendNotification(false)
                setBrandOption(null)
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--copy-primary)' }}>Campaign name</label>
                <div className="relative">
                  <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--copy-tertiary)' }} />
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Name your campaign"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-lg focus:outline-none focus-visible:ring-2"
                    style={{
                      borderColor: 'var(--input-border)',
                      background: 'var(--surface-0)',
                      color: 'var(--copy-primary)',
                    }}
                  />
                </div>
              </div>
              <div>
                <span className="block text-sm font-medium mb-2" style={{ color: 'var(--copy-primary)' }}>Brand</span>
                <RadioGroup
                  value={brandOption ?? undefined}
                  onChange={(v) => setBrandOption(v as 'custom' | 'profiles')}
                  className="titan-radio-group flex flex-col gap-3"
                  aria-label="Brand"
                >
                  <Radio value="custom" className="titan-radio flex items-center gap-3 cursor-pointer">
                    <span className="titan-radio-indicator flex-shrink-0">
                      <span className="titan-radio-ring" aria-hidden />
                      <SelectionIndicator className="titan-radio-dot" />
                    </span>
                    <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>Enter custom brand name</span>
                  </Radio>
                  <Radio value="profiles" className="titan-radio flex items-center gap-3 cursor-pointer">
                    <span className="titan-radio-indicator flex-shrink-0">
                      <span className="titan-radio-ring" aria-hidden />
                      <SelectionIndicator className="titan-radio-dot" />
                    </span>
                    <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>Select from brand profiles</span>
                  </Radio>
                </RadioGroup>
              </div>
              {brandOption === 'custom' && (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value.slice(0, 60))}
                    placeholder="Enter brand name"
                    maxLength={60}
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus-visible:ring-2"
                    style={{ borderColor: 'var(--input-border)', background: 'var(--surface-0)', color: 'var(--copy-primary)' }}
                  />
                  <p className="text-xs" style={{ color: 'var(--copy-tertiary)' }}>{brandName.length}/60 characters</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--copy-primary)' }}>Campaign description</label>
                <textarea
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value.slice(0, 1000))}
                  placeholder="Enter campaign description"
                  rows={4}
                  maxLength={1000}
                  className="w-full px-3 py-2.5 border rounded-lg resize-none focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: 'var(--input-border)', background: 'var(--surface-0)', color: 'var(--copy-primary)' }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--copy-tertiary)' }}>{campaignDescription.length}/1000 characters</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                  className="rounded border-2 w-5 h-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{ borderColor: 'var(--input-border)', accentColor: 'var(--checkbox-selected-background)' }}
                />
                <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>Send notification to creators</span>
              </label>
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{
                  background: 'var(--color-information-100, var(--color-blue-20))',
                  color: 'var(--color-information-800, var(--color-blue-800))',
                  border: '1px solid var(--color-information-200, var(--color-blue-30))',
                }}
              >
                {selectedCreatorIds.size} creators will be added
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" className="titan-btn-primary px-4 py-2.5 text-sm font-semibold rounded-lg">
                  Create campaign
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer: Add to existing campaign — Titan/brown, checkbox Titan, aviso Info */}
      {drawer === 'existing' && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" aria-hidden onClick={() => setDrawer(null)} />
          <div
            className="relative w-full max-w-md shadow-xl flex flex-col max-h-full overflow-auto rounded-l-xl"
            style={{ background: 'var(--surface-page)', borderLeft: '1px solid var(--divider)' }}
          >
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--divider)' }}>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--copy-primary)' }}>Add to existing campaign</h2>
              <Button onPress={() => setDrawer(null)} className="p-2 rounded-lg" style={{ color: 'var(--copy-secondary)' }} aria-label="Close">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form
              className="p-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                setDrawer(null)
                setSuccess({ type: 'added' })
                setSelectedCampaignId('')
                setSendNotificationExisting(false)
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--copy-primary)' }}>Select campaign</label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: 'var(--input-border)', background: 'var(--surface-0)', color: 'var(--copy-primary)' }}
                >
                  <option value="">Select an already creating campaign</option>
                  {MOCK_CAMPAIGNS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendNotificationExisting}
                  onChange={(e) => setSendNotificationExisting(e.target.checked)}
                  className="rounded border-2 w-5 h-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{ borderColor: 'var(--input-border)', accentColor: 'var(--checkbox-selected-background)' }}
                />
                <span className="text-sm" style={{ color: 'var(--copy-primary)' }}>Send notification to creators</span>
              </label>
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{
                  background: 'var(--color-information-100, var(--color-blue-20))',
                  color: 'var(--color-information-800, var(--color-blue-800))',
                  border: '1px solid var(--color-information-200, var(--color-blue-30))',
                }}
              >
                {selectedCreatorIds.size} creators will be added
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" className="titan-btn-primary px-4 py-2.5 text-sm font-semibold rounded-lg">
                  Add to campaign
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Save search — formulario y confirmación en el mismo modal */}
      {saveSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30" aria-hidden onClick={() => { setSaveSearchOpen(false); setSaveSearchConfirmed(false) }} />
          <div
            className="relative rounded-xl shadow-xl w-full max-w-md p-6"
            style={{ background: 'var(--surface-page)', border: '1px solid var(--divider)' }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--copy-primary)' }}>Save search</h2>
            {saveSearchConfirmed ? (
              <>
                <p className="text-sm mb-6" style={{ color: 'var(--copy-secondary)' }}>
                  Search saved successfully.
                </p>
                <div className="flex justify-end">
                  <Button
                    onPress={() => { setSaveSearchOpen(false); setSaveSearchConfirmed(false) }}
                    className="titan-btn-primary px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Done
                  </Button>
                </div>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--copy-primary)' }}>Name</label>
                <input
                  type="text"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  placeholder="e.g. Fitness US"
                  className="w-full px-3 py-2.5 border rounded-lg mb-6 focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: 'var(--input-border)', background: 'var(--surface-0)', color: 'var(--copy-primary)' }}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    onPress={() => { setSaveSearchOpen(false); setSaveSearchName('') }}
                    className="titan-btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={handleSaveSearch}
                    isDisabled={!saveSearchName.trim()}
                    className="titan-btn-primary px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal: Load search — tabla Name, Saved, Criteria, Load */}
      {loadSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30" aria-hidden onClick={() => setLoadSearchOpen(false)} />
          <div
            className="relative rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            style={{ background: 'var(--surface-page)', border: '1px solid var(--divider)' }}
          >
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0" style={{ borderColor: 'var(--divider)' }}>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--copy-primary)' }}>Load search</h2>
              <Button onPress={() => setLoadSearchOpen(false)} className="p-2 rounded-lg" style={{ color: 'var(--copy-secondary)' }} aria-label="Close">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <table className="w-full border-collapse" style={{ borderColor: 'var(--divider)' }}>
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-4 font-semibold text-sm" style={{ color: 'var(--copy-primary)' }}>Name</th>
                    <th className="text-left py-2 pr-4 font-semibold text-sm" style={{ color: 'var(--copy-primary)' }}>Saved</th>
                    <th className="text-left py-2 pr-4 font-semibold text-sm" style={{ color: 'var(--copy-primary)' }}>Criteria</th>
                    <th className="text-left py-2 font-semibold text-sm" style={{ color: 'var(--copy-primary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedSearches.map((item) => (
                    <tr key={item.id} className="border-b" style={{ borderColor: 'var(--divider)' }}>
                      <td className="py-3 pr-4 text-sm" style={{ color: 'var(--copy-primary)' }}>{item.name}</td>
                      <td className="py-3 pr-4 text-sm" style={{ color: 'var(--copy-secondary)' }}>{formatSavedDate(item.createdAt)}</td>
                      <td className="py-3 pr-4 text-sm max-w-[200px] truncate" style={{ color: 'var(--copy-secondary)' }} title={item.summary}>{item.summary}</td>
                      <td className="py-3">
                        <Button
                          onPress={() => handleLoadSearch(item)}
                          className="text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded"
                          style={{ color: 'var(--link-color, var(--button-primary))' }}
                        >
                          Load
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Success overlay (campaign created / users added) */}
      {success && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30" aria-hidden onClick={() => setSuccess(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center">
            <button type="button" onClick={() => setSuccess(null)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 rounded-lg" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {success.type === 'created' ? `Campaign "${success.name}" created!` : 'Users added to campaign successfully!'}
            </p>
            {success.type === 'added' && (
              <p className="text-sm text-gray-600 mb-4">The selected creators have been added to the campaign.</p>
            )}
            <img src={`${baseUrl}campaign-success.png`} alt="" className="w-full max-w-[200px] mx-auto object-contain mb-6" />
            <Button
              onPress={() => setSuccess(null)}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'var(--button-primary)' }}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
