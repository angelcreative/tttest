import { useState, useRef, useEffect, useMemo } from 'react'
import { ArrowLeft, Plus, X, User, Globe, TrendingUp, ChevronRight, Video, Check, ChevronLeft } from 'lucide-react'
import { getCreatorSearchResults } from '../data/creatorSearch'
import type { CreatorCard as CreatorCardType } from '../data/creatorSearch'

const PAGE_SIZE = 24

interface CreatorSearchProps {
  onBack: () => void
}

/** Placeholder de altura fija para lazy load. */
function CardPlaceholder() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden animate-pulse" style={{ minHeight: 180 }}>
      <div className="p-4 flex gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <div className="h-10 flex-1 bg-gray-200 rounded" />
        <div className="h-10 flex-1 bg-gray-200 rounded" />
        <div className="h-10 flex-1 bg-gray-200 rounded" />
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
}: {
  creator: CreatorCardType
  checked: boolean
  onToggle: () => void
}) {
  return (
    <article
      className={`rounded-xl border overflow-hidden flex flex-col h-full transition-colors ${
        checked
          ? 'border-emerald-500 bg-emerald-50/80'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="p-4 flex gap-3 flex-nowrap min-w-0">
        <img
          src={creator.avatarUrl}
          alt=""
          className="w-12 h-12 rounded-full object-cover bg-gray-200 flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.userName)}&size=96&background=dee2e6`
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 truncate">{creator.userName}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 border border-teal-200 text-xs font-medium flex-shrink-0">
                  <Video className="w-3.5 h-3.5" />
                  {creator.videoCount}
                </span>
              </div>
              <p className="text-sm text-primary-600 font-medium truncate">{creator.handle}</p>
              <p className="text-xs text-gray-500 truncate">{creator.location}</p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                checked
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              aria-label={checked ? 'Deselect creator' : 'Select creator'}
            >
              {checked && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-semibold text-gray-900">{creator.followers}</p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{creator.engagement}</p>
          <p className="text-xs text-gray-500">Engagement</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{creator.likes}</p>
          <p className="text-xs text-gray-500">Likes</p>
        </div>
      </div>
    </article>
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
    sectionTitle: 'Creator price range',
    children: ['Followers', 'Average views', 'Median views', 'Engagement rate'],
  },
] as const

export function CreatorSearch({ onBack }: CreatorSearchProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<Set<string>>(new Set())
  const menuRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)

  const creatorResults = useMemo(
    () => getCreatorSearchResults(activeFilters),
    [activeFilters]
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

  const addFilter = (label: string) => {
    if (activeFilters.includes(label)) return
    setActiveFilters((prev) => [...prev, label])
  }

  const removeFilter = (label: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== label))
  }

  const toggleCreatorSelection = (id: string) => {
    setSelectedCreatorIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
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

  const baseUrl = import.meta.env.BASE_URL

  return (
    <div className="p-6 flex-1 min-w-0 relative">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 flex-shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 truncate">Creators search</h1>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {creatorResults.length > 0 && (
            <span className="text-sm text-gray-600">
              {selectedCreatorIds.size} selected
            </span>
          )}
          <button
            type="button"
            disabled={creatorResults.length === 0}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Add to campaign
          </button>
        </div>
      </div>

      {/* FAB + menu flotan sobre el contenido (no desplazan el empty state) */}
      <div className="absolute left-6 top-24 z-20 flex flex-col items-start gap-0">
        <button
          ref={fabRef}
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-lg transition-colors"
          aria-label={menuOpen ? 'Close filters' : 'Filters'}
          aria-expanded={menuOpen}
          title={menuOpen ? 'Close' : 'Filters'}
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
        </button>
        {menuOpen && (
          <div
            ref={menuRef}
            className="mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
            role="menu"
          >
            {FAB_MENU_ITEMS.map((item) => {
              const isExpanded = expandedId === item.id
              const Icon = item.icon
              return (
                <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-900 hover:bg-gray-50 transition-colors"
                    role="menuitem"
                  >
                    <Icon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="flex-1 font-medium text-sm">{item.label}</span>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-100 py-2">
                      {'sectionTitle' in item && item.sectionTitle && (
                        <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {item.sectionTitle}
                        </div>
                      )}
                      {item.children.map((child) => (
                        <button
                          key={child}
                          type="button"
                          onClick={() => addFilter(child)}
                          className="w-full px-4 py-2 pl-12 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {child}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Zona de contenido con margen para no solaparse con el FAB */}
      <div className="ml-24">
        {/* Pills de filtros activos */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm font-medium border border-gray-200"
              >
                {filter}
                <button
                  type="button"
                  onClick={() => removeFilter(filter)}
                  className="p-0.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                  aria-label={`Remove ${filter}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Resultados: grid con lazy load y paginación */}
        {creatorResults.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {paginatedResults.map((creator) => (
                <LazyCreatorCard key={creator.id} fallback={<CardPlaceholder />}>
                  <CreatorCard
                    creator={creator}
                    checked={selectedCreatorIds.has(creator.id)}
                    onToggle={() => toggleCreatorSelection(creator.id)}
                  />
                </LazyCreatorCard>
              ))}
            </div>
            {/* Paginación */}
            <nav
              className="flex items-center justify-center gap-2 flex-wrap"
              aria-label="Pagination"
            >
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <p className="text-lg font-medium text-gray-700 mb-6">Nothing to show right now</p>
            <div
              className="w-full max-w-sm h-[250px] bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: `url(${baseUrl}creator-search-empty.png)` }}
              aria-hidden
            />
          </div>
        )}
      </div>
    </div>
  )
}
