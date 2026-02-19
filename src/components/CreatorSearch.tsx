import { useState, useRef, useEffect, useMemo } from 'react'
import { Button, MenuTrigger, Menu, MenuItem, Popover, SubmenuTrigger, RadioGroup, Radio, Checkbox, Select, Label as SelectLabel, SelectValue, ListBox, ListBoxItem } from 'react-aria-components'
import { ArrowLeft, Plus, X, User, Globe, TrendingUp, ChevronRight, ChevronDown, Check, Pencil, Bookmark, FolderOpen, MoreVertical, Search, Users, UserPlus, Video, Heart, Eye, BarChart2, Shirt, Smile, Smartphone, DollarSign } from 'lucide-react'
import { TitanButton, TitanIconButton, TitanInputField, TitanPagination, TitanTag, TitanTextareaField } from 'titan-compositions'
import { getCreatorSearchResults } from '../data/creatorSearch'
import type { CreatorCard as CreatorCardType, CreatorFilterState } from '../data/creatorSearch'
import type { SavedSearch, SavedSearchPayload } from '../data/savedSearches'
import { SAVED_SEARCHES_SEED } from '../data/savedSearches'
import { usePexelsVideosLoadMore, type PexelsVideoEntry } from '../hooks/usePexelsVideos'

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
    <Button
      onPress={onToggle}
      className={`network-card relative flex flex-col h-full overflow-hidden text-left rounded-xl border p-0 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 ${checked ? 'network-card--selected' : ''}`}
      style={{
        borderWidth: '1px',
        borderColor: 'var(--divider)',
        ...(checked ? { background: 'var(--tab-selected-background)' } : {}),
        boxShadow: 'var(--elevation-shadow-s, none)',
      }}
    >
      {/* Titan-compliant checkbox indicator (same as MethodCard/NetworkCard) */}
      <div
        className="checkbox-root absolute top-4 right-4 pointer-events-none flex items-center justify-center z-10"
        data-selected={checked ? true : undefined}
        aria-hidden
      >
        <span className="checkbox-box">
          <Check className="checkbox-mark" strokeWidth={3} />
        </span>
      </div>

      <div className="p-4 flex gap-3 flex-nowrap min-w-0">
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
          <p className="font-semibold truncate text-sm m-0" style={{ color: 'var(--copy-primary)' }}>{creator.userName}</p>
          <p className="text-sm truncate m-0 mt-0.5" style={{ color: 'var(--copy-tertiary)' }}>{creator.handle}</p>
          <p className="text-xs truncate m-0 mt-0.5" style={{ color: 'var(--copy-tertiary)' }}>{creator.location}</p>
        </div>
      </div>
      <div className="px-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-semibold m-0" style={{ color: 'var(--copy-primary)' }}>{creator.followers}</p>
          <p className="text-xs m-0" style={{ color: 'var(--copy-tertiary)' }}>Followers</p>
        </div>
        <div>
          <p className="text-lg font-semibold m-0" style={{ color: 'var(--copy-primary)' }}>{creator.engagement}</p>
          <p className="text-xs m-0" style={{ color: 'var(--copy-tertiary)' }}>Engagement</p>
        </div>
        <div>
          <p className="text-lg font-semibold m-0" style={{ color: 'var(--copy-primary)' }}>{creator.likes}</p>
          <p className="text-xs m-0" style={{ color: 'var(--copy-tertiary)' }}>Likes</p>
        </div>
      </div>
      <div className="px-4 pb-4 pt-4 flex justify-end" onClick={(e) => e.stopPropagation()}>
        <TitanButton variant="tertiary" onPress={onSeeInsights} className="inline-flex items-center gap-1 text-sm">
          See profile insights
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </TitanButton>
      </div>
    </Button>
  )
}

/** Grid de vídeos Pexels (presentacional). Recibe estado para poder poner Load more en footer del dialog. */
function CreatorDetailVideosContent({
  videos,
  loading,
  error,
  loadMore,
  loadingMore,
  hasMore,
  hideLoadMoreInBody = false,
}: {
  videos: PexelsVideoEntry[]
  loading: boolean
  error: string | null
  loadMore: () => void
  loadingMore: boolean
  hasMore: boolean
  hideLoadMoreInBody?: boolean
}) {
  const [playingUrl, setPlayingUrl] = useState<string | null>(null)

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
      <p className="text-sm py-4 m-0" style={{ color: 'var(--copy-tertiary)' }}>
        {error ?? 'No videos available.'}
      </p>
    )
  }
  return (
    <div className="space-y-4">
      {playingUrl && (
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--divider)', background: 'var(--surface-0)' }}>
          <video src={playingUrl} controls autoPlay className="w-full aspect-video" />
          <div className="p-2 flex justify-end">
            <TitanButton variant="secondary" onPress={() => setPlayingUrl(null)}>
              Close video
            </TitanButton>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {videos.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPlayingUrl(v.videoUrl)}
            className="relative aspect-video rounded-lg overflow-hidden border cursor-pointer group text-left w-full"
            style={{ borderColor: 'var(--divider)' }}
          >
            <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'var(--overlay-backdrop)' }}>
              <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-0)' }}>
                <ChevronRight className="w-6 h-6 ml-0.5" style={{ color: 'var(--copy-primary)' }} strokeWidth={2} />
              </span>
            </span>
            <span className="absolute top-2 right-2 p-1 rounded" style={{ background: 'var(--surface-0)' }}>
              <MoreVertical className="w-4 h-4" style={{ color: 'var(--copy-primary)' }} strokeWidth={1.5} />
            </span>
          </button>
        ))}
      </div>
      {!hideLoadMoreInBody && hasMore && (
        <div className="flex justify-center pt-2">
          <TitanButton variant="secondary" onPress={loadMore} isDisabled={loadingMore}>
            {loadingMore ? 'Cargando…' : 'Load more'}
          </TitanButton>
        </div>
      )}
    </div>
  )
}

// Datos extendidos para Creator insights (mock/derivados hasta tener API)
function getCreatorInsightsExt(creator: CreatorCardType) {
  const handleBase = creator.handle.replace('@', '')
  return {
    creatorId: '712824486752367417',
    bio: 'Business collabs',
    email: `${handleBase}4@gmail.com`,
    following: '46',
    totalLikes: creator.likes,
    medianViews: '169.7K',
    contentLabels: ['Outfits', 'Comedy'] as const,
    industryLabels: ['Apps', "Men's Clothing"] as const,
    startingPrice: '$600',
  }
}

const STAT_ICON_SIZE = 20

/** Drawer Titan: Creator insights. Header con título + X; body con perfil (ID, Bio, email), Statistics (6), Categories, Pricing, Videos (2 filas × 3 cols) + Load more secondary. */
function CreatorInsightsDrawer({
  creator,
  onClose,
}: {
  creator: CreatorCardType
  onClose: () => void
}) {
  const { videos, loading, error, loadMore, loadingMore, hasMore } = usePexelsVideosLoadMore('lifestyle')
  const [playingUrl, setPlayingUrl] = useState<string | null>(null)
  const ext = getCreatorInsightsExt(creator)
  const videosTwoRows = videos.slice(0, 6) // solo 2 filas × 3 cols

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="drawer-overlay absolute inset-0" aria-hidden onClick={onClose} />
      <div className="drawer-modal relative flex-shrink-0">
        <div className="drawer-panel flex flex-col max-h-full overflow-hidden">
          <header className="drawer-header">
            <h3 className="drawer-title">Creator insights</h3>
            <TitanIconButton variant="ghost" className="drawer-close-button shrink-0 flex items-center justify-center" aria-label="Close drawer" onPress={onClose}>
              <X />
            </TitanIconButton>
          </header>
          <div className="drawer-body flex flex-col min-h-0 p-6 overflow-auto text-left space-y-5">
            {/* Profile: arriba avatar + handle + Creator ID; abajo Bio + email */}
            <div className="rounded-xl border px-4 py-3.5 flex flex-col gap-3 flex-shrink-0" style={{ borderColor: 'var(--divider)', background: 'var(--surface-0)' }}>
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={creator.avatarUrl}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  style={{ background: 'var(--surface-1)' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-base m-0" style={{ color: 'var(--copy-primary)' }}>{creator.userName}</p>
                  <p className="text-sm m-0 mt-0.5" style={{ color: 'var(--copy-tertiary)' }}>{creator.handle}</p>
                  <p className="text-xs m-0 mt-1 tracking-tight" style={{ color: 'var(--copy-tertiary)' }}>Creator ID: {ext.creatorId}</p>
                </div>
              </div>
              <div className="border-t pt-3 min-w-0" style={{ borderColor: 'var(--divider)' }}>
                <p className="text-xs font-medium m-0 mb-0.5" style={{ color: 'var(--copy-tertiary)' }}>Bio</p>
                <p className="text-sm m-0" style={{ color: 'var(--copy-primary)' }}>{ext.bio}</p>
                <p className="text-sm m-0 mt-1 break-all" style={{ color: 'var(--copy-tertiary)' }}>{ext.email}</p>
              </div>
            </div>

            {/* Statistics: 6 cards with icons */}
            <div className="flex-shrink-0">
              <h3 className="text-sm font-medium mb-2 m-0" style={{ color: 'var(--copy-primary)' }}>Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" style={{ gap: 'var(--spacing-m)' }}>
                <div className="rounded-lg border px-3 py-3 flex flex-col items-center text-center" style={{ borderColor: 'var(--divider)', background: 'var(--surface-0)' }}>
                  <Users className="shrink-0 mb-1.5" size={STAT_ICON_SIZE} style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                  <p className="text-sm font-medium m-0 truncate w-full" style={{ color: 'var(--copy-primary)' }}>{creator.followers}</p>
                  <p className="text-xs m-0 mt-0.5 font-normal normal-case" style={{ color: 'var(--copy-tertiary)' }}>Followers</p>
                </div>
                <div className="rounded-lg border px-3 py-3 flex flex-col items-center text-center" style={{ borderColor: 'var(--divider)', background: 'var(--surface-0)' }}>
                  <UserPlus className="shrink-0 mb-1.5" size={STAT_ICON_SIZE} style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                  <p className="text-sm font-medium m-0 truncate w-full" style={{ color: 'var(--copy-primary)' }}>{ext.following}</p>
                  <p className="text-xs m-0 mt-0.5 font-normal normal-case" style={{ color: 'var(--copy-tertiary)' }}>Following</p>
                </div>
                <div className="rounded-lg border px-3 py-3 flex flex-col items-center text-center" style={{ borderColor: 'var(--divider)', background: 'var(--surface-0)' }}>
                  <Video className="shrink-0 mb-1.5" size={STAT_ICON_SIZE} style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                  <p className="text-sm font-medium m-0 truncate w-full" style={{ color: 'var(--copy-primary)' }}>1.7K</p>
                  <p className="text-xs m-0 mt-0.5 font-normal normal-case" style={{ color: 'var(--copy-tertiary)' }}>Videos</p>
                </div>
                <div className="rounded-lg border px-3 py-3 flex flex-col items-center text-center" style={{ borderColor: 'var(--divider)', background: 'var(--surface-0)' }}>
                  <Heart className="shrink-0 mb-1.5" size={STAT_ICON_SIZE} style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                  <p className="text-sm font-medium m-0 truncate w-full" style={{ color: 'var(--copy-primary)' }}>{ext.totalLikes}</p>
                  <p className="text-xs m-0 mt-0.5 font-normal normal-case" style={{ color: 'var(--copy-tertiary)' }}>Total Likes</p>
                </div>
                <div className="rounded-lg border px-3 py-3 flex flex-col items-center text-center" style={{ borderColor: 'var(--divider)', background: 'var(--surface-0)' }}>
                  <Eye className="shrink-0 mb-1.5" size={STAT_ICON_SIZE} style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                  <p className="text-sm font-medium m-0 truncate w-full" style={{ color: 'var(--copy-primary)' }}>{ext.medianViews}</p>
                  <p className="text-xs m-0 mt-0.5 font-normal normal-case" style={{ color: 'var(--copy-tertiary)' }}>Median Views</p>
                </div>
                <div className="rounded-lg border px-3 py-3 flex flex-col items-center text-center" style={{ borderColor: 'var(--divider)', background: 'var(--surface-0)' }}>
                  <BarChart2 className="shrink-0 mb-1.5" size={STAT_ICON_SIZE} style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                  <p className="text-sm font-medium m-0 truncate w-full" style={{ color: 'var(--copy-primary)' }}>{creator.engagement}</p>
                  <p className="text-xs m-0 mt-0.5 font-normal normal-case" style={{ color: 'var(--copy-tertiary)' }}>Engagement Rate</p>
                </div>
              </div>
            </div>

            {/* Categories: Content Labels + Industry Labels */}
            <div className="flex-shrink-0">
              <h3 className="text-sm font-medium mb-2 m-0" style={{ color: 'var(--copy-primary)' }}>Categories</h3>
              <div className="space-y-2.5">
                <div>
                  <p className="text-xs font-medium mb-1.5 m-0" style={{ color: 'var(--copy-tertiary)' }}>Content Labels</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-normal" style={{ background: 'var(--surface-1)', color: 'var(--copy-secondary)' }}>
                      <Shirt className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                      {ext.contentLabels[0]}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-normal" style={{ background: 'var(--surface-1)', color: 'var(--copy-secondary)' }}>
                      <Smile className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                      {ext.contentLabels[1]}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1.5 m-0" style={{ color: 'var(--copy-tertiary)' }}>Industry Labels</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-normal" style={{ background: 'var(--surface-1)', color: 'var(--copy-secondary)' }}>
                      <Smartphone className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                      {ext.industryLabels[0]}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-normal" style={{ background: 'var(--surface-1)', color: 'var(--copy-secondary)' }}>
                      <Shirt className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                      {ext.industryLabels[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="flex-shrink-0">
              <h3 className="text-sm font-medium mb-2 m-0" style={{ color: 'var(--copy-primary)' }}>Pricing Information</h3>
              <div className="rounded-lg border px-4 py-3 flex items-center gap-3" style={{ borderColor: 'var(--divider)', background: 'var(--surface-0)' }}>
                <DollarSign className="w-5 h-5 shrink-0" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                <div>
                  <p className="text-xs font-normal m-0 normal-case" style={{ color: 'var(--copy-tertiary)' }}>Starting Price</p>
                  <p className="text-xl font-semibold m-0 mt-0.5 tracking-tight" style={{ color: 'var(--status-positive, #16a34a)' }}>{ext.startingPrice}</p>
                </div>
              </div>
            </div>

            {/* Videos: solo 2 filas × 3 cols + Load more secondary */}
            <div className="flex-shrink-0">
              <h3 className="text-sm font-medium mb-2 m-0" style={{ color: 'var(--copy-primary)' }}>Videos</h3>
              {loading ? (
                <div className="grid grid-cols-3 gap-3" style={{ gap: 'var(--spacing-m)' }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-video rounded-lg animate-pulse" style={{ background: 'var(--surface-1)' }} />
                  ))}
                </div>
              ) : error || videos.length === 0 ? (
                <p className="text-sm py-4 m-0" style={{ color: 'var(--copy-tertiary)' }}>
                  {error ?? 'No videos available.'}
                </p>
              ) : (
                <>
                  {playingUrl && (
                    <div className="rounded-lg overflow-hidden border mb-4" style={{ borderColor: 'var(--divider)', background: 'var(--surface-0)' }}>
                      <video src={playingUrl} controls autoPlay className="w-full aspect-video" />
                      <div className="p-2 flex justify-end">
                        <TitanButton variant="secondary" onPress={() => setPlayingUrl(null)}>
                          Close video
                        </TitanButton>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-3" style={{ gap: 'var(--spacing-m)', gridTemplateRows: 'repeat(2, 1fr)' }}>
                    {videosTwoRows.map((v, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPlayingUrl(v.videoUrl)}
                        className="relative aspect-video rounded-lg overflow-hidden border cursor-pointer group text-left w-full"
                        style={{ borderColor: 'var(--divider)' }}
                      >
                        <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'var(--overlay-backdrop)' }}>
                          <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-0)' }}>
                            <ChevronRight className="w-6 h-6 ml-0.5" style={{ color: 'var(--copy-primary)' }} strokeWidth={2} />
                          </span>
                        </span>
                        <span className="absolute top-2 right-2 p-1 rounded" style={{ background: 'var(--surface-0)' }}>
                          <MoreVertical className="w-4 h-4" style={{ color: 'var(--copy-primary)' }} strokeWidth={1.5} />
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <TitanButton variant="secondary" onPress={loadMore} isDisabled={!hasMore || loadingMore}>
                      {loadingMore ? 'Loading…' : 'Load more'}
                    </TitanButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
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
  const paginationPages = useMemo((): (number | 'ellipsis')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 4) return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
    if (currentPage >= totalPages - 3) return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
  }, [totalPages, currentPage])
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
        className="flex-shrink-0 px-6 pt-6 pb-4"
        style={{ background: 'var(--surface-page)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <TitanIconButton variant="ghost" aria-label="Back" onPress={onBack} className="shrink-0">
              <ArrowLeft />
            </TitanIconButton>
            <h1 className="text-2xl font-semibold truncate" style={{ color: 'var(--copy-primary)' }}>
              Adidas campaign
            </h1>
          <div className="ml-2 min-w-0 max-w-[180px]">
            <MenuTrigger>
              <TitanButton
                variant="secondary"
                aria-label="Ads account"
                className="min-w-0 w-full justify-between"
              >
                <span className="truncate">{adsAccountId === '6' ? 'Ads Account 6' : adsAccountId === '1' ? 'Ads Account 1' : 'Ads Account 2'}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </TitanButton>
              <Popover className="menu-popover" placement="bottom start" offset={4}>
                <Menu className="menu-list" onAction={(key) => setAdsAccountId(String(key))}>
                  <MenuItem id="6" className="menu-item" textValue="Ads Account 6">Ads Account 6</MenuItem>
                  <MenuItem id="1" className="menu-item" textValue="Ads Account 1">Ads Account 1</MenuItem>
                  <MenuItem id="2" className="menu-item" textValue="Ads Account 2">Ads Account 2</MenuItem>
                </Menu>
              </Popover>
            </MenuTrigger>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm px-2" style={{ color: 'var(--copy-secondary)' }}>
            {selectedCreatorIds.size} selected
          </span>
          <TitanButton
            variant="secondary"
            icon={<Bookmark />}
            onPress={() => {
              setSaveSearchOpen(true)
              setSaveSearchConfirmed(false)
              setSaveSearchName('')
            }}
          >
            Save search
          </TitanButton>
          <TitanButton variant="secondary" icon={<FolderOpen />} onPress={() => setLoadSearchOpen(true)}>
            Load search
          </TitanButton>
          <MenuTrigger>
            <TitanButton
              variant="primary"
              isDisabled={creatorResults.length === 0}
              aria-label="Add to campaign"
              className="inline-flex items-center gap-2"
            >
              Add to campaign
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </TitanButton>
            <Popover className="menu-popover" placement="bottom end" offset={4}>
              <Menu
                className="menu-list"
                onAction={(key) => {
                  if (key === 'new') setDrawer('new')
                  else if (key === 'existing') setDrawer('existing')
                }}
              >
                <MenuItem id="new" className="menu-item" textValue="New campaign">
                  New campaign
                </MenuItem>
                <MenuItem id="existing" className="menu-item" textValue="Add to existing campaign">
                  Add to existing campaign
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        </div>
        </div>
      </div>

      {/* Fila: columna FAB fija 72px + contenido (menú en cascada Titan compliant) */}
      <div className="flex-1 flex min-h-0 min-w-0 pb-6 overflow-hidden w-full" style={{ paddingInline: 'var(--spacing-m)' }}>
        <div className="flex-shrink-0 w-[72px] min-w-[72px] pt-4 relative">
          <MenuTrigger>
            <Button
              className="fab-primary relative flex-shrink-0"
              aria-label="Open search criteria"
            >
              <Plus />
              {activeFilters.length > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{
                    background: 'var(--button-primary-slot-bg)',
                    color: 'var(--button-primary-slot-label)',
                    border: '2px solid var(--surface-page)',
                  }}
                >
                  {activeFilters.length}
                </span>
              )}
            </Button>
            <Popover className="menu-popover" placement="right" offset={8}>
              <Menu
                className="menu-list"
                onAction={(key) => openFilterDrawer(String(key))}
                style={{ minWidth: '18rem' }}
              >
                {FAB_MENU_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <SubmenuTrigger key={item.id}>
                      <MenuItem className="menu-item" textValue={item.label}>
                        <span className="menu-item-start">
                          <span className="menu-item-icon" aria-hidden>
                            <Icon />
                          </span>
                          <span>{item.label}</span>
                        </span>
                        <span className="menu-item-end" aria-hidden>
                          <ChevronRight />
                        </span>
                      </MenuItem>
                      <Popover className="menu-popover menu-popover-submenu" placement="end top">
                        <Menu
                          className="menu-list"
                          onAction={(key) => openFilterDrawer(String(key))}
                          style={{ minWidth: '14rem' }}
                        >
                          {item.children.map((child) => (
                            <MenuItem
                              key={child}
                              id={child}
                              className="menu-item"
                              textValue={child}
                              onAction={() => openFilterDrawer(child)}
                            >
                              {child}
                            </MenuItem>
                          ))}
                        </Menu>
                      </Popover>
                    </SubmenuTrigger>
                  )
                })}
              </Menu>
            </Popover>
          </MenuTrigger>
        </div>

        {/* Zona de contenido: ancho fijo, nunca se desplaza al abrir el menú FAB */}
        <div className="flex-1 min-w-0 pt-4 overflow-auto">
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
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8"
              style={{ columnGap: 'var(--spacing-m)', rowGap: 'var(--spacing-m)' }}
            >
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
            <div className="flex justify-center w-full">
              <TitanPagination
                ariaLabel="Pagination"
                pages={paginationPages}
                currentPage={currentPage}
                previousDisabled={currentPage === 1}
                nextDisabled={currentPage === totalPages}
                onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
                onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
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

      {/* Drawer: filtros del FAB — Titan compliant (drawer-overlay, drawer-panel, TitanIconButton, TitanInputField, TitanCheckbox, TitanButton) */}
      {filterDrawer !== null && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <div
            className="drawer-overlay absolute inset-0 pointer-events-auto transition-opacity duration-300 ease-out"
            style={{ opacity: isFilterDrawerClosing ? 0 : 1 }}
            aria-hidden
            onClick={closeFilterDrawer}
          />
          <div
            className="drawer-modal relative flex-shrink-0 pointer-events-auto transition-transform duration-300 ease-out"
            style={{ transform: isFilterDrawerClosing ? 'translateX(100%)' : 'translateX(0)' }}
          >
            <div className="drawer-panel flex flex-col max-h-full overflow-hidden">
              <header className="drawer-header">
                <h3 className="drawer-title">{filterDrawer}</h3>
                <TitanIconButton variant="ghost" aria-label="Close drawer" onPress={closeFilterDrawer}>
                  <X />
                </TitanIconButton>
              </header>
              <div className="drawer-body flex flex-col min-h-0 p-6">
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
                    <TitanInputField
                      placeholder="Type a keyword and press comma or Enter to add"
                      value={keywordInput}
                      onChange={setKeywordInput}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault()
                          addKeywordChip()
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setKeywordChips([]); setKeywordInput(''); closeFilterDrawer() }}>
                      Cancel
                    </TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>
                      Apply
                    </TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'Content categories' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <TitanInputField
                    label="Search"
                    placeholder="Search content categories..."
                    value={contentCategorySearch}
                    onChange={setContentCategorySearch}
                    leadingIcon={<Search />}
                  />
                  <div
                    className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border"
                    style={{
                      borderColor: 'var(--input-slot-border)',
                      background: 'var(--surface-0)',
                    }}
                  >
                    <ul className="py-1">
                      {CONTENT_CATEGORIES.filter((cat) =>
                        !contentCategorySearch.trim() || cat.toLowerCase().includes(contentCategorySearch.trim().toLowerCase())
                      ).map((category) => (
                        <li key={category}>
                          <Checkbox
                            className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]"
                            style={{ cursor: 'pointer' }}
                            isSelected={selectedContentCategories.has(category)}
                            onChange={(selected: boolean) => {
                              setSelectedContentCategories((prev) => {
                                const next = new Set(prev)
                                if (selected) next.add(category)
                                else next.delete(category)
                                return next
                              })
                            }}
                          >
                            <span className="checkbox-box" aria-hidden>
                              <Check className="checkbox-mark" />
                            </span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{category}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedContentCategories(new Set()); closeFilterDrawer() }}>
                      Cancel
                    </TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>
                      Apply
                    </TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'Industry categories' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <TitanInputField
                    label="Search"
                    placeholder="Search industry categories..."
                    value={industryCategorySearch}
                    onChange={setIndustryCategorySearch}
                    leadingIcon={<Search />}
                  />
                  <div className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border" style={{ borderColor: 'var(--input-slot-border)', background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {INDUSTRY_CATEGORIES.filter((cat) =>
                        !industryCategorySearch.trim() || cat.toLowerCase().includes(industryCategorySearch.trim().toLowerCase())
                      ).map((category) => (
                        <li key={category}>
                          <Checkbox
                            className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]"
                            style={{ cursor: 'pointer' }}
                            isSelected={selectedIndustryCategories.has(category)}
                            onChange={(selected: boolean) => {
                              setSelectedIndustryCategories((prev) => {
                                const next = new Set(prev)
                                if (selected) next.add(category)
                                else next.delete(category)
                                return next
                              })
                            }}
                          >
                            <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" /></span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{category}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedIndustryCategories(new Set()); closeFilterDrawer() }}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>Apply</TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'Countries' || filterDrawer === 'Follower country' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <TitanInputField
                    label="Search"
                    placeholder="Search countries..."
                    value={countrySearch}
                    onChange={setCountrySearch}
                    leadingIcon={<Search />}
                  />
                  <div className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border" style={{ borderColor: 'var(--input-slot-border)', background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {COUNTRIES.filter((country) =>
                        !countrySearch.trim() || country.toLowerCase().includes(countrySearch.trim().toLowerCase())
                      ).map((country) => (
                        <li key={country}>
                          <Checkbox
                            className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]"
                            style={{ cursor: 'pointer' }}
                            isSelected={selectedCountries.has(country)}
                            onChange={(selected: boolean) => {
                              setSelectedCountries((prev) => {
                                const next = new Set(prev)
                                if (selected) next.add(country)
                                else next.delete(country)
                                return next
                              })
                            }}
                          >
                            <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" /></span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{country}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedCountries(new Set()); closeFilterDrawer() }}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>Apply</TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'States/Provinces' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <TitanInputField
                    label="Search"
                    placeholder="Search states..."
                    value={statesProvincesSearch}
                    onChange={setStatesProvincesSearch}
                    leadingIcon={<Search />}
                  />
                  <div className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border" style={{ borderColor: 'var(--input-slot-border)', background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {STATES_PROVINCES.filter((item) =>
                        !statesProvincesSearch.trim() || item.toLowerCase().includes(statesProvincesSearch.trim().toLowerCase())
                      ).map((item) => (
                        <li key={item}>
                          <Checkbox
                            className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]"
                            style={{ cursor: 'pointer' }}
                            isSelected={selectedStatesProvinces.has(item)}
                            onChange={(selected: boolean) => {
                              setSelectedStatesProvinces((prev) => {
                                const next = new Set(prev)
                                if (selected) next.add(item)
                                else next.delete(item)
                                return next
                              })
                            }}
                          >
                            <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" /></span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{item}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedStatesProvinces(new Set()); closeFilterDrawer() }}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>Apply</TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'Age group' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border" style={{ borderColor: 'var(--input-slot-border)', background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {AGE_GROUPS.map((age) => (
                        <li key={age}>
                          <Checkbox
                            className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]"
                            style={{ cursor: 'pointer' }}
                            isSelected={selectedAgeGroups.has(age)}
                            onChange={(selected: boolean) => {
                              setSelectedAgeGroups((prev) => {
                                const next = new Set(prev)
                                if (selected) next.add(age)
                                else next.delete(age)
                                return next
                              })
                            }}
                          >
                            <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" /></span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{age}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedAgeGroups(new Set()); closeFilterDrawer() }}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>Apply</TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'Gender ratio' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border" style={{ borderColor: 'var(--input-slot-border)', background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {GENDER_RATIOS.map((ratio) => (
                        <li key={ratio}>
                          <Checkbox
                            className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]"
                            style={{ cursor: 'pointer' }}
                            isSelected={selectedGenderRatios.has(ratio)}
                            onChange={(selected: boolean) => {
                              setSelectedGenderRatios((prev) => {
                                const next = new Set(prev)
                                if (selected) next.add(ratio)
                                else next.delete(ratio)
                                return next
                              })
                            }}
                          >
                            <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" /></span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{ratio}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedGenderRatios(new Set()); closeFilterDrawer() }}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>Apply</TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'Creator price range' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border" style={{ borderColor: 'var(--input-slot-border)', background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {CREATOR_PRICE_RANGES.map((opt) => (
                        <li key={opt}>
                          <Checkbox className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]" style={{ cursor: 'pointer' }} isSelected={selectedCreatorPriceRanges.has(opt)} onChange={(selected: boolean) => { setSelectedCreatorPriceRanges((p) => { const n = new Set(p); if (selected) n.add(opt); else n.delete(opt); return n }) }}>
                            <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" /></span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{opt}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedCreatorPriceRanges(new Set()); closeFilterDrawer() }}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>Apply</TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'Followers' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border" style={{ borderColor: 'var(--input-slot-border)', background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {FOLLOWERS_RANGES.map((opt) => (
                        <li key={opt}>
                          <Checkbox className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]" style={{ cursor: 'pointer' }} isSelected={selectedFollowersRanges.has(opt)} onChange={(selected: boolean) => { setSelectedFollowersRanges((p) => { const n = new Set(p); if (selected) n.add(opt); else n.delete(opt); return n }) }}>
                            <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" /></span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{opt}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedFollowersRanges(new Set()); closeFilterDrawer() }}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>Apply</TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'Average views' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border" style={{ borderColor: 'var(--input-slot-border)', background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {AVERAGE_VIEWS_RANGES.map((opt) => (
                        <li key={opt}>
                          <Checkbox className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]" style={{ cursor: 'pointer' }} isSelected={selectedAverageViewsRanges.has(opt)} onChange={(selected: boolean) => { setSelectedAverageViewsRanges((p) => { const n = new Set(p); if (selected) n.add(opt); else n.delete(opt); return n }) }}>
                            <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" /></span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{opt}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedAverageViewsRanges(new Set()); closeFilterDrawer() }}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>Apply</TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'Median views' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border" style={{ borderColor: 'var(--input-slot-border)', background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {MEDIAN_VIEWS_RANGES.map((opt) => (
                        <li key={opt}>
                          <Checkbox className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]" style={{ cursor: 'pointer' }} isSelected={selectedMedianViewsRanges.has(opt)} onChange={(selected: boolean) => { setSelectedMedianViewsRanges((p) => { const n = new Set(p); if (selected) n.add(opt); else n.delete(opt); return n }) }}>
                            <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" /></span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{opt}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedMedianViewsRanges(new Set()); closeFilterDrawer() }}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>Apply</TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'Engagement rate' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <div className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border" style={{ borderColor: 'var(--input-slot-border)', background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {ENGAGEMENT_RATE_RANGES.map((opt) => (
                        <li key={opt}>
                          <Checkbox className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]" style={{ cursor: 'pointer' }} isSelected={selectedEngagementRateRanges.has(opt)} onChange={(selected: boolean) => { setSelectedEngagementRateRanges((p) => { const n = new Set(p); if (selected) n.add(opt); else n.delete(opt); return n }) }}>
                            <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" /></span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{opt}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedEngagementRateRanges(new Set()); closeFilterDrawer() }}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>Apply</TitanButton>
                  </div>
                </div>
              ) : filterDrawer === 'Languages' ? (
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                  <TitanInputField
                    label="Search"
                    placeholder="Search languages..."
                    value={languageSearch}
                    onChange={setLanguageSearch}
                    leadingIcon={<Search />}
                  />
                  <div className="flex-1 min-h-0 overflow-auto flex-shrink rounded-lg border" style={{ borderColor: 'var(--input-slot-border)', background: 'var(--surface-0)' }}>
                    <ul className="py-1">
                      {LANGUAGES.filter((lang) =>
                        !languageSearch.trim() || lang.toLowerCase().includes(languageSearch.trim().toLowerCase())
                      ).map((lang) => (
                        <li key={lang}>
                          <Checkbox
                            className="checkbox-root w-full cursor-pointer px-4 py-2.5 rounded-none min-h-[40px]"
                            style={{ cursor: 'pointer' }}
                            isSelected={selectedLanguages.has(lang)}
                            onChange={(selected: boolean) => {
                              setSelectedLanguages((prev) => {
                                const next = new Set(prev)
                                if (selected) next.add(lang)
                                else next.delete(lang)
                                return next
                              })
                            }}
                          >
                            <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" /></span>
                            <span className="choice-text" style={{ color: 'var(--copy-primary)' }}>{lang}</span>
                          </Checkbox>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={() => { setSelectedLanguages(new Set()); closeFilterDrawer() }}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={applyFilterDrawerAndSearch}>Apply</TitanButton>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm" style={{ color: 'var(--copy-secondary)' }}>
                    Content for &quot;{filterDrawer}&quot; — to be defined.
                  </p>
                  <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--drawer-header-border-bottom)' }}>
                    <TitanButton variant="secondary" onPress={closeFilterDrawer}>Cancel</TitanButton>
                    <TitanButton variant="primary" onPress={closeFilterDrawer}>Apply</TitanButton>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer: Creator insights — título + X; body perfil, stats, videos (2 filas) + Load more (secondary) */}
      {insightsCreator && (
        <CreatorInsightsDrawer creator={insightsCreator} onClose={() => setInsightsCreator(null)} />
      )}

      {/* Drawer: New campaign — 100% Titan (shell = overlay + modal + panel; drawer-close-button; form = drawer-body) */}
      {drawer === 'new' && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="drawer-overlay absolute inset-0" aria-hidden onClick={() => setDrawer(null)} />
          <div className="drawer-modal relative flex-shrink-0">
            <div className="drawer-panel">
              <header className="drawer-header">
                <h3 className="drawer-title">New campaign</h3>
                <TitanIconButton variant="ghost" className="drawer-close-button shrink-0 flex items-center justify-center" aria-label="Close drawer" onPress={() => setDrawer(null)}>
                  <X className="shrink-0" />
                </TitanIconButton>
              </header>
              <form
                className="drawer-body flex flex-col gap-5 min-h-0"
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
                <TitanInputField
                  label="Campaign name"
                  placeholder="Name your campaign"
                  value={campaignName}
                  onChange={setCampaignName}
                  leadingIcon={<Pencil />}
                />
                <div>
                  <RadioGroup
                    value={brandOption ?? undefined}
                    onChange={(v) => setBrandOption(v as 'custom' | 'profiles')}
                    className="choice-group"
                    aria-label="Brand"
                  >
                    <label className="choice-group-label">Brand</label>
                    <div className="choice-list">
                      <Radio value="custom" className="radio-root cursor-pointer">
                        <span className="radio-box" aria-hidden><span className="radio-dot" /></span>
                        <span className="choice-text">Enter custom brand name</span>
                      </Radio>
                      <Radio value="profiles" className="radio-root cursor-pointer">
                        <span className="radio-box" aria-hidden><span className="radio-dot" /></span>
                        <span className="choice-text">Select from brand profiles</span>
                      </Radio>
                    </div>
                  </RadioGroup>
                </div>
                {brandOption === 'custom' && (
                  <TitanInputField
                    label="Brand name"
                    placeholder="Enter brand name"
                    value={brandName}
                    onChange={(v) => setBrandName(v.slice(0, 60))}
                    counter={`${brandName.length}/60`}
                  />
                )}
                <TitanTextareaField
                  label="Campaign description"
                  placeholder="Enter campaign description"
                  value={campaignDescription}
                  onChange={(v) => setCampaignDescription(v.slice(0, 1000))}
                  counter={`${campaignDescription.length}/1000`}
                />
                <Checkbox
                  className="checkbox-root cursor-pointer"
                  isSelected={sendNotification}
                  onChange={setSendNotification}
                >
                  <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" strokeWidth={3} /></span>
                  <span className="choice-text">Send notification to creators</span>
                </Checkbox>
                <TitanTag
                  label={`${selectedCreatorIds.size} creators will be added`}
                  tone="ocean"
                />
                <div className="flex justify-end pt-2">
                  <TitanButton type="submit" variant="primary">
                    Create campaign
                  </TitanButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Drawer: Add to existing campaign — 100% Titan (misma shell que New campaign, TitanSelect, Checkbox Titan, TitanTag, TitanButton) */}
      {drawer === 'existing' && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="drawer-overlay absolute inset-0" aria-hidden onClick={() => setDrawer(null)} />
          <div className="drawer-modal relative flex-shrink-0">
            <div className="drawer-panel">
              <header className="drawer-header">
                <h3 className="drawer-title">Add to existing campaign</h3>
                <TitanIconButton variant="ghost" className="drawer-close-button shrink-0 flex items-center justify-center" aria-label="Close drawer" onPress={() => setDrawer(null)}>
                  <X className="shrink-0" />
                </TitanIconButton>
              </header>
              <form
                className="drawer-body flex flex-col gap-5 min-h-0"
                onSubmit={(e) => {
                  e.preventDefault()
                  setDrawer(null)
                  setSuccess({ type: 'added' })
                  setSelectedCampaignId('')
                  setSendNotificationExisting(false)
                }}
              >
                <Select
                  className="select-root"
                  selectedKey={selectedCampaignId || '__none'}
                  onSelectionChange={(key) => setSelectedCampaignId(key === '__none' ? '' : String(key))}
                  aria-label="Select campaign"
                >
                  <SelectLabel className="select-label">Select campaign</SelectLabel>
                  <Button className="select-trigger">
                    <SelectValue />
                    <span className="select-trigger-chevron" aria-hidden><ChevronDown /></span>
                  </Button>
                  <Popover className="select-popover" placement="bottom start">
                    <ListBox className="select-list">
                      <ListBoxItem id="__none" className="select-item" textValue="Select an already creating campaign">
                        <span className="select-item-start">Select an already creating campaign</span>
                      </ListBoxItem>
                      {MOCK_CAMPAIGNS.map((c) => (
                        <ListBoxItem key={c.id} id={c.id} className="select-item" textValue={c.name}>
                          <span className="select-item-start">{c.name}</span>
                        </ListBoxItem>
                      ))}
                    </ListBox>
                  </Popover>
                </Select>
                <Checkbox
                  className="checkbox-root cursor-pointer"
                  isSelected={sendNotificationExisting}
                  onChange={setSendNotificationExisting}
                >
                  <span className="checkbox-box" aria-hidden><Check className="checkbox-mark" strokeWidth={3} /></span>
                  <span className="choice-text">Send notification to creators</span>
                </Checkbox>
                <TitanTag label={`${selectedCreatorIds.size} creators will be added`} tone="ocean" />
                <div className="flex justify-end pt-2">
                  <TitanButton type="submit" variant="primary">
                    Add to campaign
                  </TitanButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Save search — 100% Titan, sin X, footer Close (secondary) izquierda */}
      {saveSearchOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-6" role="presentation">
          <div className="dialog-overlay absolute inset-0" aria-hidden onClick={() => { setSaveSearchOpen(false); setSaveSearchConfirmed(false); setSaveSearchName('') }} />
          <div className="dialog-modal relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-panel">
              <header className="dialog-header">
                <h3 className="dialog-title">Save search</h3>
              </header>
              {saveSearchConfirmed ? (
                <>
                  <div className="dialog-body text-left">
                    <p className="text-sm">Search saved successfully.</p>
                  </div>
                  <footer className="dialog-footer">
                    <TitanButton variant="secondary" onPress={() => { setSaveSearchOpen(false); setSaveSearchConfirmed(false); setSaveSearchName('') }}>
                      Close
                    </TitanButton>
                    <TitanButton variant="primary" onPress={() => { setSaveSearchOpen(false); setSaveSearchConfirmed(false); setSaveSearchName('') }}>
                      Done
                    </TitanButton>
                  </footer>
                </>
              ) : (
                <>
                  <div className="dialog-body text-left">
                    <TitanInputField
                      label="Name"
                      placeholder="e.g. Fitness US"
                      value={saveSearchName}
                      onChange={setSaveSearchName}
                    />
                  </div>
                  <footer className="dialog-footer">
                    <TitanButton variant="secondary" onPress={() => { setSaveSearchOpen(false); setSaveSearchName('') }}>
                      Close
                    </TitanButton>
                    <TitanButton variant="primary" onPress={handleSaveSearch} isDisabled={!saveSearchName.trim()}>
                      Save
                    </TitanButton>
                  </footer>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Load search — 100% Titan, sin X, footer Close (secondary) izquierda */}
      {loadSearchOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-6" role="presentation">
          <div className="dialog-overlay absolute inset-0" aria-hidden onClick={() => setLoadSearchOpen(false)} />
          <div className="dialog-modal relative w-full max-w-2xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-panel flex flex-col max-h-full overflow-hidden">
              <header className="dialog-header">
                <h3 className="dialog-title">Load search</h3>
              </header>
              <div className="dialog-body flex-1 overflow-auto text-left min-h-0">
                <table className="w-full border-collapse" style={{ borderColor: 'var(--table-border-bottom)' }}>
                  <thead>
                    <tr>
                      <th className="text-left py-2 pr-4 font-semibold text-sm" style={{ color: 'var(--dialog-body-slot-color)' }}>Name</th>
                      <th className="text-left py-2 pr-4 font-semibold text-sm" style={{ color: 'var(--dialog-body-slot-color)' }}>Saved</th>
                      <th className="text-left py-2 pr-4 font-semibold text-sm" style={{ color: 'var(--dialog-body-slot-color)' }}>Criteria</th>
                      <th className="text-left py-2 font-semibold text-sm" style={{ color: 'var(--dialog-body-slot-color)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedSearches.map((item) => (
                      <tr key={item.id} className="border-b" style={{ borderColor: 'var(--table-border-bottom)' }}>
                        <td className="py-3 pr-4 text-sm" style={{ color: 'var(--dialog-body-slot-color)' }}>{item.name}</td>
                        <td className="py-3 pr-4 text-sm" style={{ color: 'var(--copy-slot-secondary)' }}>{formatSavedDate(item.createdAt)}</td>
                        <td className="py-3 pr-4 text-sm max-w-[200px] truncate" style={{ color: 'var(--copy-slot-secondary)' }} title={item.summary}>{item.summary}</td>
                        <td className="py-3">
                          <TitanButton variant="tertiary" onPress={() => handleLoadSearch(item)}>
                            Load
                          </TitanButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <footer className="dialog-footer flex-shrink-0">
                <TitanButton variant="secondary" onPress={() => setLoadSearchOpen(false)}>
                  Close
                </TitanButton>
              </footer>
            </div>
          </div>
        </div>
      )}

      {/* Success dialog — Titan: header (título) + body (subtitle + ilustración) + footer (Done centrado); espaciado con tokens */}
      {success && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-6" role="presentation">
          <div className="dialog-overlay absolute inset-0" aria-hidden onClick={() => setSuccess(null)} />
          <div className="dialog-modal relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-panel">
              <header className="dialog-header">
                <h3 className="dialog-title">
                  {success.type === 'created' ? `Campaign "${success.name}" created!` : 'Users added to campaign successfully!'}
                </h3>
              </header>
              <div className="dialog-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-m)' }}>
                {success.type === 'added' && (
                  <p style={{ margin: 0, fontSize: 'var(--font-size-s)', lineHeight: 'var(--font-leading-s)', color: 'var(--copy-slot-secondary)' }}>
                    The selected creators have been added to the campaign.
                  </p>
                )}
                <img
                  src={`${baseUrl}campaign-success.png`}
                  alt=""
                  style={{ maxWidth: '200px', width: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>
              <footer className="dialog-footer success-dialog-footer">
                <TitanButton variant="primary" onPress={() => setSuccess(null)}>
                  Done
                </TitanButton>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
