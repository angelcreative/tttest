import { useState, useRef, useEffect, useMemo } from 'react'
import { ArrowLeft, Video, MessageCircle, Heart, X, Check, User, RefreshCw } from 'lucide-react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from 'react-aria-components'
import { Button } from 'react-aria-components'
import { generateBrandMentionPosts, brandMentionPosts } from '../data/brandMentions'
import type { BrandMentionPost } from '../data/brandMentions'
import { usePexelsVideos } from '../hooks/usePexelsVideos'
import { CAMPAIGNS_SEED } from '../data/campaigns'

interface BrandMentionsProps {
  onBack: () => void
}

/** Placeholder con altura fija para no romper el layout antes de cargar. */
function CardPlaceholder() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex flex-col animate-pulse" style={{ minHeight: 420 }}>
      <div className="p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="aspect-[9/16] max-h-64 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-8 bg-gray-200 rounded w-full mt-2" />
      </div>
    </div>
  )
}

/** Solo renderiza el hijo cuando el elemento entra en viewport (lazy load). */
function LazyCard({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback: React.ReactNode
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { rootMargin: '200px', threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="min-h-[420px]">
      {isVisible ? children : fallback}
    </div>
  )
}

function MentionCard({
  post,
  onSendRequest,
}: {
  post: BrandMentionPost
  onSendRequest: () => void
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col h-full">
      <div className="p-3 flex items-center gap-3 flex-nowrap min-w-0">
        <img
          src={post.avatarUrl}
          alt=""
          className="w-10 h-10 rounded-full object-cover bg-gray-200 flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}&size=80&background=dee2e6`
          }}
        />
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-gray-900 truncate">{post.userName}</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium flex-shrink-0">
              <Video className="w-3.5 h-3.5" />
              {post.videoCount}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{post.handle}</p>
        </div>
      </div>

      <div className="relative aspect-[9/16] max-h-64 bg-gray-100">
        <video
          src={post.videoUrl}
          className="w-full h-full object-cover"
          controls
          playsInline
          poster={post.thumbnailUrl}
          preload="metadata"
        />
        <span className="absolute bottom-2 left-2 text-xs font-medium text-white drop-shadow bg-black/50 px-2 py-1 rounded pointer-events-none">
          {post.views}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-sm text-gray-700 line-clamp-2">{post.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {post.likes} Likes
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {post.comments} Comments
          </span>
        </div>
        <Button
          onPress={onSendRequest}
          className="mt-auto w-full py-2.5 text-sm font-semibold rounded-lg titan-btn-secondary justify-center"
        >
          Send request
        </Button>
      </div>
    </article>
  )
}

function RequestPermissionDialog({
  post,
  sent,
  onClose,
  onSend,
}: {
  post: BrandMentionPost
  sent: boolean
  onClose: () => void
  onSend: (campaignId: string) => void
}) {
  const [campaignId, setCampaignId] = useState('')

  const handleSend = () => {
    if (campaignId) onSend(campaignId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="relative flex w-full max-w-4xl max-h-[90vh] rounded-xl bg-white shadow-xl overflow-hidden"
        role="dialog"
        aria-labelledby="request-dialog-title"
      >
        {/* Izquierda: vídeo (reutiliza caja de video, se reproduce en su misma cajita) */}
        <div className="flex-shrink-0 w-[min(40%,320px)] min-w-0 bg-gray-900 aspect-[9/16] max-h-[90vh]">
          <video
            src={post.videoUrl}
            poster={post.thumbnailUrl}
            className="w-full h-full object-cover"
            playsInline
            preload="metadata"
            controls
          />
        </div>

        {/* Derecha: cabecera + Select campaign + Send request / confirmación en el mismo diálogo */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start gap-3 p-4 border-b border-gray-100 flex-shrink-0">
            <img
              src={post.avatarUrl}
              alt=""
              className="w-12 h-12 rounded-full object-cover bg-gray-200 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}&size=96&background=dee2e6`
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{post.userName}</p>
              <p className="text-sm text-gray-500 truncate">{post.handle}</p>
              <h2 id="request-dialog-title" className="text-lg font-semibold text-gray-900 mt-1">
                Request permission
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 -m-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col min-h-0 overflow-auto">
            {sent ? (
              <>
                <div className="flex flex-col items-center text-center py-6 flex-1">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4" aria-hidden>
                    <Check className="w-8 h-8 text-green-600" strokeWidth={2.5} />
                  </div>
                  <p className="font-semibold text-lg" style={{ color: 'var(--copy-primary)' }}>Request sent!</p>
                  <p className="text-sm mt-2" style={{ color: 'var(--copy-secondary)' }}>
                    We&apos;ve notified {post.userName}. You&apos;ll be alerted when they approve the link.
                  </p>
                </div>
                <Button
                  onPress={onClose}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold flex-shrink-0 titan-btn-primary justify-center"
                >
                  Done
                </Button>
              </>
            ) : (
              <>
                <label htmlFor="request-campaign" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--copy-primary)' }}>
                  Select campaign
                </label>
                <select
                  id="request-campaign"
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus-visible:ring-2 mb-6"
                  style={{ borderColor: 'var(--input-border)', background: 'var(--surface-0)', color: 'var(--copy-primary)' }}
                >
                  <option value="">Choose a campaign</option>
                  {CAMPAIGNS_SEED.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="flex gap-3 flex-shrink-0">
                  <Button
                    onPress={onClose}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold titan-btn-secondary justify-center"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={handleSend}
                    isDisabled={!campaignId}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold titan-btn-primary justify-center"
                  >
                    Send request
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function BrandMentions({ onBack }: BrandMentionsProps) {
  const { videos, loading, error } = usePexelsVideos('sport', 30)
  const posts = useMemo(
    () => (videos.length > 0 ? generateBrandMentionPosts(videos) : brandMentionPosts),
    [videos]
  )
  const [activeTab, setActiveTab] = useState<'mention' | 'hashtag'>('mention')
  const [sortBy, setSortBy] = useState('recent')
  const [timePeriod, setTimePeriod] = useState('30')
  const [selectedPost, setSelectedPost] = useState<BrandMentionPost | null>(null)
  const [requestSent, setRequestSent] = useState(false)

  const openRequestDialog = (post: BrandMentionPost) => {
    setSelectedPost(post)
    setRequestSent(false)
  }

  const closeRequestDialog = () => {
    setSelectedPost(null)
    setRequestSent(false)
  }

  const handleRequestSent = () => {
    setRequestSent(true)
  }

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => p.source === activeTab)
  }, [posts, activeTab])

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0" style={{ background: 'var(--surface-page)' }}>
      {/* Header + Connected: fixed height */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button onPress={onBack} className="titan-sidebar-icon-btn shrink-0" aria-label="Back">
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold truncate" style={{ color: 'var(--copy-primary)' }}>Brand mentions</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--copy-tertiary)' }}>Discover and monitor videos that mention your brand on TikTok</p>
            </div>
          </div>
        </div>

        {/* Connected Account */}
        <div
          className="flex items-center gap-4 rounded-xl border px-4 py-3 mb-4"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--divider)' }}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--color-black-100)' }}>
            <User className="h-5 w-5" style={{ color: 'var(--copy-secondary)' }} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium" style={{ color: 'var(--copy-tertiary)' }}>Connected Account:</p>
            <p className="truncate text-sm font-semibold" style={{ color: 'var(--copy-primary)' }}>@adidas</p>
          </div>
        </div>
      </div>

      {/* Tabs + content: takes remaining space and scrolls */}
      <Tabs selectedKey={activeTab} onSelectionChange={(k) => setActiveTab(k as 'mention' | 'hashtag')} className="flex-1 flex flex-col min-h-0 px-6">
        <TabList className="titan-tab-list flex-shrink-0">
          <Tab id="mention" className="titan-tab">
            @ Mentions
          </Tab>
          <Tab id="hashtag" className="titan-tab">
            # Hashtag Mentions
          </Tab>
        </TabList>

        {/* Sort by, Time period, Refresh — spacing respecto a tabs */}
        <div className="flex flex-wrap items-center gap-4 mb-4 flex-shrink-0">
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--copy-secondary)' }}>
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1.5 border rounded-lg text-sm focus:outline-none focus-visible:ring-2"
                style={{ borderColor: 'var(--input-border)', background: 'var(--surface-0)', color: 'var(--copy-primary)' }}
              >
                <option value="recent">Most Recent</option>
                <option value="views">Most Views</option>
                <option value="likes">Most Likes</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--copy-secondary)' }}>
              Time period:
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="px-2 py-1.5 border rounded-lg text-sm focus:outline-none focus-visible:ring-2"
                style={{ borderColor: 'var(--input-border)', background: 'var(--surface-0)', color: 'var(--copy-primary)' }}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </label>
            <Button onPress={() => {}} className="titan-btn-secondary inline-flex items-center gap-2 text-sm py-1.5 px-3">
              <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
              Refresh
            </Button>
          </div>

          <TabPanels className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-6">
            <TabPanel id="mention" className="outline-none py-2">
              {error && (
                <div className="mb-4 p-4 rounded-lg text-sm" style={{ background: 'var(--color-amber-100)', border: '1px solid var(--color-amber-300)', color: 'var(--color-amber-800)' }}>{error}</div>
              )}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <CardPlaceholder key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredPosts.map((post) => (
                    <LazyCard key={post.id} fallback={<CardPlaceholder />}>
                      <MentionCard post={post} onSendRequest={() => openRequestDialog(post)} />
                    </LazyCard>
                  ))}
                </div>
              )}
            </TabPanel>
            <TabPanel id="hashtag" className="outline-none py-2">
              {error && (
                <div className="mb-4 p-4 rounded-lg text-sm" style={{ background: 'var(--color-amber-100)', border: '1px solid var(--color-amber-300)', color: 'var(--color-amber-800)' }}>{error}</div>
              )}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <CardPlaceholder key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredPosts.map((post) => (
                    <LazyCard key={post.id} fallback={<CardPlaceholder />}>
                      <MentionCard post={post} onSendRequest={() => openRequestDialog(post)} />
                    </LazyCard>
                  ))}
                </div>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>

      {selectedPost && (
        <RequestPermissionDialog
          post={selectedPost}
          sent={requestSent}
          onClose={closeRequestDialog}
          onSend={handleRequestSent}
        />
      )}
    </div>
  )
}
