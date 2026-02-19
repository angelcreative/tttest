import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, MessageCircle, Heart, Bookmark, ChevronDown } from 'lucide-react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Select, Label, Button as AriaButton, SelectValue, Popover, ListBox, ListBoxItem } from 'react-aria-components'
import { TitanButton, TitanIconButton, TitanInputField } from 'titan-compositions'
import { generateBrandMentionPosts, brandMentionPosts } from '../data/brandMentions'
import type { BrandMentionPost } from '../data/brandMentions'
import { usePexelsVideos } from '../hooks/usePexelsVideos'
import { CAMPAIGNS_SEED } from '../data/campaigns'

interface BrandMentionsProps {
  onBack: () => void
}

/** Placeholder con altura fija — Titan (surface, card-radius, copy-slot). */
function CardPlaceholder() {
  return (
    <div
      className="overflow-hidden flex flex-col animate-pulse"
      style={{
        minHeight: 420,
        background: 'var(--card-background)',
        border: 'var(--stroke-slot-width) solid var(--card-border)',
        borderRadius: 'var(--card-radius)',
      }}
    >
      <div className="p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: 'var(--surface-1)' }} />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 rounded w-2/3" style={{ background: 'var(--surface-1)' }} />
          <div className="h-3 rounded w-1/2" style={{ background: 'var(--surface-1)' }} />
        </div>
      </div>
      <div className="aspect-[9/16] max-h-64" style={{ background: 'var(--surface-1)' }} />
      <div className="p-3 space-y-2">
        <div className="h-3 rounded w-full" style={{ background: 'var(--surface-1)' }} />
        <div className="h-3 rounded w-3/4" style={{ background: 'var(--surface-1)' }} />
        <div className="h-8 rounded w-full mt-2" style={{ background: 'var(--surface-1)' }} />
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
    <article
      className="overflow-hidden flex flex-col h-full"
      style={{
        background: 'var(--card-background)',
        border: 'var(--stroke-slot-width) solid var(--card-border)',
        borderRadius: 'var(--card-radius)',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      <div className="p-3 flex items-center gap-3 flex-nowrap min-w-0">
        <img
          src={post.avatarUrl}
          alt=""
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          style={{ background: 'var(--surface-1)' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}&size=80&background=dee2e6`
          }}
        />
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="font-semibold truncate" style={{ color: 'var(--copy-slot-primary)', fontSize: 'var(--font-size-s)' }}>{post.userName}</span>
          </div>
          <p className="text-sm truncate" style={{ color: 'var(--copy-slot-secondary)' }}>{post.handle}</p>
        </div>
      </div>

      <div className="relative aspect-[9/16] max-h-64" style={{ background: 'var(--surface-1)' }}>
        <video
          src={post.videoUrl}
          className="w-full h-full object-cover"
          controls
          playsInline
          poster={post.thumbnailUrl}
          preload="metadata"
        />
        <span
          className="absolute bottom-2 left-2 text-xs font-medium px-2 py-1 rounded pointer-events-none"
          style={{ color: 'var(--copy-slot-primary)', background: 'var(--surface-1)', boxShadow: 'var(--card-shadow)' }}
        >
          {post.views}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-sm line-clamp-2" style={{ color: 'var(--copy-slot-body)' }}>{post.description}</p>
        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--copy-slot-secondary)' }}>
          <span className="flex items-center gap-1">
            <Heart style={{ width: 'var(--icon-size-s)', height: 'var(--icon-size-s)' }} />
            {post.likes} Likes
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle style={{ width: 'var(--icon-size-s)', height: 'var(--icon-size-s)' }} />
            {post.comments} Comments
          </span>
        </div>
        <TitanButton variant="secondary" onPress={onSendRequest} className="mt-auto w-full justify-center">
          Send request
        </TitanButton>
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
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'var(--overlay-backdrop, rgba(0,0,0,0.4))' }}
        aria-hidden
        onClick={onClose}
      />
      <div
        className="relative flex max-h-[90vh] rounded-xl overflow-hidden"
        style={{
          background: 'var(--dialog-background, var(--surface-0))',
          boxShadow: 'var(--dialog-shadow, var(--elevation-shadow-l))',
          border: 'var(--stroke-slot-width) solid var(--dialog-border, var(--card-border))',
        }}
        role="dialog"
        aria-labelledby="request-dialog-title"
      >
        {/* Izquierda: vídeo */}
        <div className="flex-shrink-0 w-[min(40%,320px)] min-w-0 aspect-[9/16] max-h-[90vh]" style={{ background: 'var(--surface-1)' }}>
          <video
            src={post.videoUrl}
            poster={post.thumbnailUrl}
            className="w-full h-full object-cover"
            playsInline
            preload="metadata"
            controls
          />
        </div>

        {/* Derecha: ancho justo para el form (cabecera + select + botones) */}
        <div className="flex flex-col flex-shrink-0" style={{ width: 360 }}>
          <header
            className="flex items-start gap-3 flex-shrink-0"
            style={{
              padding: 'var(--spacing-m, 16px)',
              borderBottom: 'var(--stroke-slot-width) solid var(--divider)',
            }}
          >
            <img
              src={post.avatarUrl}
              alt=""
              className="w-11 h-11 rounded-full object-cover flex-shrink-0"
              style={{ background: 'var(--surface-1)' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}&size=96&background=dee2e6`
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate m-0" style={{ color: 'var(--copy-primary)', fontSize: 'var(--font-size-m)' }}>{post.userName}</p>
              <p className="truncate m-0 mt-0.5" style={{ color: 'var(--copy-slot-secondary)', fontSize: 'var(--font-size-s)' }}>{post.handle}</p>
              <h2 id="request-dialog-title" className="m-0 mt-1 font-medium" style={{ color: 'var(--copy-primary)', fontSize: 'var(--font-size-m)' }}>
                Request permission
              </h2>
            </div>
          </header>

          <div className="flex-1 flex flex-col min-h-0 overflow-auto" style={{ padding: 'var(--spacing-m, 16px)' }}>
            {sent ? (
              <>
                <div className="flex flex-col items-center text-center flex-1" style={{ paddingBlock: 'var(--spacing-l, 24px)' }}>
                  <p className="font-medium m-0" style={{ color: 'var(--copy-primary)', fontSize: 'var(--font-size-m)' }}>Request sent!</p>
                  <p className="m-0 mt-2" style={{ color: 'var(--copy-slot-secondary)', fontSize: 'var(--font-size-s)' }}>
                    We&apos;ve notified {post.userName}. You&apos;ll be alerted when they approve the link.
                  </p>
                </div>
                <div className="flex-shrink-0 flex justify-center" style={{ marginTop: 'var(--spacing-m, 16px)' }}>
                  <TitanButton variant="primary" onPress={onClose}>
                    Done
                  </TitanButton>
                </div>
              </>
            ) : (
              <div className="flex flex-col" style={{ maxWidth: 'min(100%, 320px)' }}>
                <Select
                  className="select-root"
                  selectedKey={campaignId || '__none'}
                  onSelectionChange={(k) => setCampaignId(k === '__none' || k == null ? '' : String(k))}
                  aria-label="Select campaign"
                >
                  <Label className="select-label">Select campaign</Label>
                  <AriaButton className="select-trigger">
                    <SelectValue />
                    <span className="select-trigger-chevron" aria-hidden><ChevronDown /></span>
                  </AriaButton>
                  <Popover className="select-popover" placement="bottom start">
                    <ListBox className="select-list">
                      <ListBoxItem id="__none" className="select-item" textValue="Choose a campaign">
                        Choose a campaign
                      </ListBoxItem>
                      {CAMPAIGNS_SEED.map((c) => (
                        <ListBoxItem key={c.id} id={c.id} className="select-item" textValue={c.name}>
                          {c.name}
                        </ListBoxItem>
                      ))}
                    </ListBox>
                  </Popover>
                </Select>
                <div className="flex justify-between gap-3 flex-shrink-0" style={{ marginTop: 'var(--spacing-l, 24px)' }}>
                  <TitanButton variant="secondary" onPress={onClose}>
                    Cancel
                  </TitanButton>
                  <TitanButton variant="primary" onPress={handleSend} isDisabled={!campaignId}>
                    Send request
                  </TitanButton>
                </div>
              </div>
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
  const [saveSearchOpen, setSaveSearchOpen] = useState(false)
  const [saveSearchName, setSaveSearchName] = useState('')
  const [saveSearchConfirmed, setSaveSearchConfirmed] = useState(false)
  const selectsSlotRef = useRef<HTMLDivElement | null>(null) as React.MutableRefObject<HTMLDivElement | null>
  const [selectsSlotReady, setSelectsSlotReady] = useState(false)

  useEffect(() => {
    if (selectsSlotRef.current) setSelectsSlotReady(true)
  }, [])

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

  const handleSaveSearch = () => {
    if (!saveSearchName.trim()) return
    setSaveSearchConfirmed(true)
  }

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => p.source === activeTab)
  }, [posts, activeTab])

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0" style={{ background: 'var(--surface-page)' }}>
      <div className="flex-shrink-0 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <TitanIconButton variant="ghost" aria-label="Back" onPress={onBack} className="shrink-0">
              <ArrowLeft />
            </TitanIconButton>
            <div>
              <h1 className="text-2xl font-semibold truncate" style={{ color: 'var(--copy-primary)' }}>Adidas mentions</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--copy-tertiary)' }}>Discover and monitor videos that mention Adidas on TikTok</p>
            </div>
          </div>
          <TitanButton variant="secondary" icon={<Bookmark />} onPress={() => { setSaveSearchOpen(true); setSaveSearchConfirmed(false); setSaveSearchName('') }} className="flex-shrink-0">
            Save search
          </TitanButton>
        </div>
      </div>

      {/* Tabs + content: takes remaining space and scrolls. Selects se renderan por portal fuera de Tabs para evitar selectionManager. */}
      <Tabs selectedKey={activeTab} onSelectionChange={(k) => setActiveTab(k as 'mention' | 'hashtag')} className="tabs-root flex-1 flex flex-col min-h-0 px-6" style={{ background: 'transparent' }}>
        {/* Fila: tabs a la izquierda; slot para Sort by + Time period (portaled) a la derecha */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 flex-shrink-0">
          <TabList className="tabs-list flex-shrink-0" style={{ background: 'transparent' }}>
            <Tab id="mention" className="tab-trigger">
              @ Mentions
            </Tab>
            <Tab id="hashtag" className="tab-trigger">
              # Hashtag Mentions
            </Tab>
          </TabList>
          <div
            ref={(el) => {
              selectsSlotRef.current = el
              if (el) setSelectsSlotReady(true)
            }}
            className="flex flex-wrap items-center gap-4"
          />
        </div>

          <TabPanels className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-6">
            <TabPanel id="mention" className="outline-none py-2">
              {error && (
                <div className="mb-4 p-4 rounded-lg text-sm" style={{ background: 'var(--surface-1)', border: 'var(--stroke-slot-width) solid var(--card-border)', color: 'var(--copy-slot-primary)' }}>{error}</div>
              )}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" style={{ columnGap: 'var(--spacing-s)', rowGap: 'var(--spacing-m)' }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <CardPlaceholder key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" style={{ columnGap: 'var(--spacing-s)', rowGap: 'var(--spacing-m)' }}>
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
                <div className="mb-4 p-4 rounded-lg text-sm" style={{ background: 'var(--surface-1)', border: 'var(--stroke-slot-width) solid var(--card-border)', color: 'var(--copy-slot-primary)' }}>{error}</div>
              )}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" style={{ columnGap: 'var(--spacing-s)', rowGap: 'var(--spacing-m)' }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <CardPlaceholder key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" style={{ columnGap: 'var(--spacing-s)', rowGap: 'var(--spacing-m)' }}>
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

      {/* Sort by + Time period: renderizados fuera del árbol Tabs (portal al slot) para evitar selectionManager */}
      {selectsSlotReady && selectsSlotRef.current &&
        createPortal(
          <>
            <Select
              className="select-root"
              selectedKey={sortBy}
              onSelectionChange={(k) => k != null && setSortBy(String(k))}
              aria-label="Sort by"
              isDisabled={false}
            >
              <Label className="select-label">Sort by</Label>
              <AriaButton className="select-trigger">
                <SelectValue />
                <span className="select-trigger-chevron" aria-hidden><ChevronDown /></span>
              </AriaButton>
              <Popover className="select-popover" placement="bottom start">
                <ListBox className="select-list">
                  {[
                    { id: 'recent', label: 'Most Recent' },
                    { id: 'views', label: 'Most Views' },
                    { id: 'likes', label: 'Most Likes' },
                  ].map((option) => (
                    <ListBoxItem key={option.id} id={option.id} className="select-item" textValue={option.label}>
                      <span className="select-item-start"><span>{option.label}</span></span>
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </Select>
            <Select
              className="select-root"
              selectedKey={timePeriod}
              onSelectionChange={(k) => k != null && setTimePeriod(String(k))}
              aria-label="Time period"
              isDisabled={false}
            >
              <Label className="select-label">Time period</Label>
              <AriaButton className="select-trigger">
                <SelectValue />
                <span className="select-trigger-chevron" aria-hidden><ChevronDown /></span>
              </AriaButton>
              <Popover className="select-popover" placement="bottom start">
                <ListBox className="select-list">
                  {[
                    { id: '1', label: '1 day' },
                    { id: '7', label: '7 days' },
                    { id: '30', label: '30 days' },
                    { id: '60', label: '60 days' },
                    { id: '90', label: '90 days' },
                    { id: 'custom', label: 'Custom' },
                  ].map((option) => (
                    <ListBoxItem key={option.id} id={option.id} className="select-item" textValue={option.label}>
                      <span className="select-item-start"><span>{option.label}</span></span>
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </Select>
          </>,
          selectsSlotRef.current
        )}

      {selectedPost && (
        <RequestPermissionDialog
          post={selectedPost}
          sent={requestSent}
          onClose={closeRequestDialog}
          onSend={handleRequestSent}
        />
      )}

      {/* Dialog: Save search — 100% Titan (sin X, footer Close + Save/Done) */}
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
                    <TitanButton variant="secondary" onPress={() => { setSaveSearchOpen(false); setSaveSearchConfirmed(false); setSaveSearchName('') }}>Close</TitanButton>
                    <TitanButton variant="primary" onPress={() => { setSaveSearchOpen(false); setSaveSearchConfirmed(false); setSaveSearchName('') }}>Done</TitanButton>
                  </footer>
                </>
              ) : (
                <>
                  <div className="dialog-body text-left">
                    <TitanInputField label="Name" placeholder="e.g. Adidas mentions Q1" value={saveSearchName} onChange={setSaveSearchName} />
                  </div>
                  <footer className="dialog-footer">
                    <TitanButton variant="secondary" onPress={() => { setSaveSearchOpen(false); setSaveSearchName('') }}>Close</TitanButton>
                    <TitanButton variant="primary" onPress={handleSaveSearch} isDisabled={!saveSearchName.trim()}>Save</TitanButton>
                  </footer>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
