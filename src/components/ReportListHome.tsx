import { useState, useMemo, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import {
  Filter,
  ChevronDown,
  MoreVertical,
  Info,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Check,
  Pencil,
  Copy,
  Share2,
  Trash2,
} from 'lucide-react'
import {
  IconBrandX,
  IconBrandThreads,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandMeta,
  IconBrandGoogle,
  IconBrandYoutube,
  IconBrandTiktok,
  IconGlobe,
} from '@tabler/icons-react'
import { ICON_SIZE_M, ICON_STROKE } from '../constants/icons'
import {
  Select,
  Button as AriaButton,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
  Tooltip,
  TooltipTrigger,
  Checkbox,
  MenuTrigger,
  Menu,
  MenuItem,
} from 'react-aria-components'
import {
  TitanIconButton,
  TitanInputField,
  TitanMenuDropdown,
  TitanPagination,
} from 'titan-compositions'
import type { TitanTableRow, TitanMenuOption } from 'titan-compositions'
import type { Report, DataSourceType, ReportDataSource } from '../data/reports'
import { REPORTS_SEED, AUDIENCE_TYPE_OPTIONS } from '../data/reports'

const PAGE_SIZE = 10

/** Shades 200 for avatars (Titan tokens); label = copy default */
const AVATAR_COLORS_200: string[] = [
  'var(--color-teal-200)',
  'var(--color-ocean-200)',
  'var(--color-red-200)',
  'var(--color-purple-200)',
  'var(--color-avocado-200)',
  'var(--color-magenta-200)',
  'var(--color-blueberry-200)',
  'var(--color-indigo-200)',
  'var(--color-violet-200)',
  'var(--color-tomato-200)',
  'var(--color-turquoise-200)',
  'var(--color-brown-200)',
]

function formatAudienceSize(n: number): string {
  return n.toLocaleString('en-US').replace(/,/g, ' ')
}

function getAvatarStyle(avatarColor?: string, index?: number): React.CSSProperties {
  const bg = avatarColor
    ? `var(--color-${avatarColor}-200)`
    : AVATAR_COLORS_200[((index ?? 0) % AVATAR_COLORS_200.length)]
  return {
    background: bg,
    color: 'var(--copy-primary)',
    border: 'none',
  }
}

function CreatorCell({
  initials,
  email,
  avatarColor,
  index,
}: {
  initials: string
  email: string
  avatarColor?: string
  index?: number
}) {
  return (
    <TooltipTrigger delay={300}>
      <span
        className="inline-flex flex-shrink-0 items-center justify-center rounded-full"
        style={{
          ...getAvatarStyle(avatarColor, index),
          width: 'var(--spacing-l)',
          height: 'var(--spacing-l)',
          fontSize: 'var(--font-size-s)',
          lineHeight: 'var(--font-leading-s)',
          fontWeight: 'var(--font-weight-500)',
        }}
      >
        {initials}
      </span>
      <Tooltip
        className="rounded-md"
        style={{
          background: 'var(--tooltip-background)',
          color: 'var(--tooltip-color)',
          borderRadius: 'var(--tooltip-radius)',
          padding: 'var(--spacing-2xs) var(--spacing-s)',
          fontSize: 'var(--font-size-s)',
          lineHeight: 'var(--font-leading-s)',
        }}
      >
        Owner {email}
      </Tooltip>
    </TooltipTrigger>
  )
}

/** Data source icon by type (Tabler brand icons; mismo tamaño y stroke) */
function DataSourceIcon({ type }: { type: DataSourceType }) {
  const style = { color: 'var(--copy-secondary)' as React.CSSProperties['color'] }
  const tablerProps = { size: ICON_SIZE_M, stroke: ICON_STROKE, className: 'shrink-0', style, 'aria-hidden': true as const }
  switch (type) {
    case 'linkedin':
      return <IconBrandLinkedin {...tablerProps} />
    case 'xmeta':
      return <IconBrandX {...tablerProps} />
    case 'facebook':
      return <IconBrandFacebook {...tablerProps} />
    case 'instagram':
      return <IconBrandInstagram {...tablerProps} />
    case 'threads':
      return <IconBrandThreads {...tablerProps} />
    case 'meta':
      return <IconBrandMeta {...tablerProps} />
    case 'google':
      return <IconBrandGoogle {...tablerProps} />
    case 'youtube':
      return <IconBrandYoutube {...tablerProps} />
    case 'web':
      return <IconGlobe {...tablerProps} />
    case 'tiktok':
      return <IconBrandTiktok {...tablerProps} />
    default:
      return null
  }
}

/** Data sources bajo el título: iconos + texto (sin tag) para + N segments/sources */
function DataSourcesUnderTitle({ sources }: { sources?: ReportDataSource[] }) {
  if (!sources || sources.length === 0) return null
  return (
    <div className="flex flex-wrap items-center" style={{ color: 'var(--copy-tertiary)', fontSize: 'var(--font-size-s)', lineHeight: 'var(--font-leading-s)', marginTop: 'var(--spacing-2xs)', gap: 'var(--spacing-3xs)' }}>
      {sources.map((s, i) => (
        <span key={i} className="inline-flex items-center" style={{ gap: 'var(--spacing-2xs)' }}>
          <DataSourceIcon type={s.type} />
          {s.tag && <span>{s.tag.text}</span>}
        </span>
      ))}
    </div>
  )
}

type SortKey = 'audienceType' | 'date'
type SortDir = 'asc' | 'desc'

/** Submenú X: tipos de reporte (Titan: hover/selected con tokens, sin amarillo literal) */
const NEW_REPORT_SUBMENU_X: TitanMenuOption[] = [
  { id: 'report-x-audience-profile', label: 'By audience profile' },
  { id: 'report-x-conversations', label: 'By conversations' },
  { id: 'report-x-upload', label: 'By upload' },
  { id: 'report-x-engagement', label: 'By engagement' },
  { id: 'report-x-follower-growth', label: 'By follower growth' },
  { id: 'report-x-overlap', label: 'By overlap' },
  { id: 'report-x-popularity', label: 'By popularity' },
  { id: 'report-x-creator-discovery', label: 'By creator discovery' },
]

/** Submenú Facebook (Titan: tokens para hover/selected) */
const NEW_REPORT_SUBMENU_FACEBOOK: TitanMenuOption[] = [
  { id: 'report-facebook-audience-profile', label: 'By audience profile' },
  { id: 'report-facebook-saved-audience', label: 'By saved audience' },
  { id: 'report-facebook-fan-page', label: 'By fan page' },
  { id: 'report-facebook-creator-discovery', label: 'By creator discovery' },
]

/** Submenú Instagram (Titan: tokens hover/selected) */
const NEW_REPORT_SUBMENU_INSTAGRAM: TitanMenuOption[] = [
  { id: 'report-instagram-audience-profile', label: 'By audience profile' },
  { id: 'report-instagram-saved-audience', label: 'By saved audience' },
  { id: 'report-instagram-account-profile', label: 'By account profile' },
  { id: 'report-instagram-overlap', label: 'By overlap' },
  { id: 'report-instagram-popularity', label: 'By popularity' },
  { id: 'report-instagram-creator-discovery', label: 'By creator discovery' },
]

/** Submenú Threads (Titan: tokens hover/selected) */
const NEW_REPORT_SUBMENU_THREADS: TitanMenuOption[] = [
  { id: 'report-threads-audience-profile', label: 'By audience profile' },
  { id: 'report-threads-saved-audience', label: 'By saved audience' },
]

/** Submenú LinkedIn (Titan: tokens hover/selected) */
const NEW_REPORT_SUBMENU_LINKEDIN: TitanMenuOption[] = [
  { id: 'report-linkedin-audience-profile', label: 'By audience profile' },
  { id: 'report-linkedin-saved-audience', label: 'By saved audience' },
]

/** Submenú TikTok (Titan: tokens hover/selected) */
const NEW_REPORT_SUBMENU_TIKTOK: TitanMenuOption[] = [
  { id: 'report-tiktok-audience-profile', label: 'By audience profile' },
  { id: 'report-tiktok-account-profile', label: 'By account profile' },
  { id: 'report-tiktok-overlap', label: 'By overlap' },
  { id: 'report-tiktok-creator-discovery', label: 'By creator discovery' },
  { id: 'report-tiktok-popularity', label: 'By popularity' },
]

/** Submenú YouTube (Titan: tokens hover/selected) */
const NEW_REPORT_SUBMENU_YOUTUBE: TitanMenuOption[] = [
  { id: 'report-youtube-account-profile', label: 'By account profile' },
  { id: 'report-youtube-overlap', label: 'By overlap' },
  { id: 'report-youtube-popularity', label: 'By popularity' },
]

/** Primer nivel: plataformas con submenú en cascada (Titan compliant) */
const NEW_REPORT_MENU_ITEMS: TitanMenuOption[] = [
  { id: 'x', label: 'X', children: NEW_REPORT_SUBMENU_X },
  { id: 'facebook', label: 'Facebook', children: NEW_REPORT_SUBMENU_FACEBOOK },
  { id: 'instagram', label: 'Instagram', children: NEW_REPORT_SUBMENU_INSTAGRAM },
  { id: 'threads', label: 'Threads', children: NEW_REPORT_SUBMENU_THREADS },
  { id: 'linkedin', label: 'LinkedIn', children: NEW_REPORT_SUBMENU_LINKEDIN },
  { id: 'tiktok', label: 'TikTok', children: NEW_REPORT_SUBMENU_TIKTOK },
  { id: 'youtube', label: 'YouTube', children: NEW_REPORT_SUBMENU_YOUTUBE },
]

interface ReportListHomeProps {
  onNewReport?: () => void
  onReportClick?: (reportId: string) => void
}

export function ReportListHome({ onNewReport, onReportClick }: ReportListHomeProps) {
  const [reports] = useState<Report[]>(REPORTS_SEED)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterKey, setFilterKey] = useState('all')
  const [showDataSources, setShowDataSources] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const filteredReports = useMemo(() => {
    let list = reports.filter(
      (r) =>
        !searchQuery.trim() ||
        r.reportName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filterKey !== 'all') {
      list = list.filter((r) => r.audienceType === filterKey)
    }
    return list
  }, [reports, searchQuery, filterKey])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterKey])

  const handleShowDataSourcesChange = (value: boolean) => {
    const el = scrollContainerRef.current
    const saved = el ? el.scrollTop : 0
    flushSync(() => setShowDataSources(value))
    if (el) el.scrollTop = saved
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = saved
    })
  }

  const sortedReports = useMemo(() => {
    if (!sortKey) return filteredReports
    return [...filteredReports].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'audienceType') {
        cmp = a.audienceType.localeCompare(b.audienceType)
      } else {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime()
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filteredReports, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sortedReports.length / PAGE_SIZE))
  const paginationPages = useMemo((): (number | 'ellipsis')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 4) return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
    if (currentPage >= totalPages - 3)
      return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
  }, [totalPages, currentPage])
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedReports.slice(start, start + PAGE_SIZE)
  }, [sortedReports, currentPage])

  const rows: TitanTableRow[] = useMemo(
    () =>
      paginatedReports.map((r, idx) => ({
        id: r.id,
        reportName: r.reportName,
        audienceType: r.audienceType,
        audienceSize: r.audienceSize,
        date: r.date,
        creatorInitials: r.creatorInitials,
        creatorEmail: r.creatorEmail,
        avatarColor: r.avatarColor,
        hasError: r.hasError,
        _index: idx,
      })),
    [paginatedReports]
  )

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const columns = useMemo(() => {
    const base = [
      {
        key: 'reportName',
        header: 'Report or Project name',
        render: (row: TitanTableRow) => {
          const report = paginatedReports.find((r) => r.id === row.id)
          return (
            <div className="flex flex-col gap-0">
              <AriaButton
                className="outline-none border-0 bg-transparent p-0 text-left font-medium cursor-pointer underline decoration-solid underline-offset-2 hover:no-underline"
                style={{ color: 'var(--link-color)' }}
                onPress={() => onReportClick?.(String(row.id))}
              >
                {row.reportName}
              </AriaButton>
              {showDataSources && report && (() => {
                const sources = report.dataSources && report.dataSources.length > 0
                  ? report.dataSources.map((s) => {
                      if (s.type === 'xmeta' && report.audienceType === 'Audience profile') {
                        return { ...s, tag: s.tag ?? { text: '+ 12 segments' } }
                      }
                      return s
                    })
                  : []
                return sources.length > 0 ? <DataSourcesUnderTitle sources={sources} /> : null
              })()}
            </div>
          )
        },
      },
      {
        key: 'audienceType',
        header: 'Audience type',
        render: (row: TitanTableRow) => <span style={{ color: 'var(--table-slot-cell-color)' }}>{row.audienceType}</span>,
      },
      {
        key: 'audienceSize',
        header: 'Audience size',
        render: (row: TitanTableRow) => (
          <span style={{ color: 'var(--table-slot-cell-color)' }}>{formatAudienceSize(Number(row.audienceSize))}</span>
        ),
      },
      {
        key: 'date',
        header: 'Date',
        render: (row: TitanTableRow) => <span style={{ color: 'var(--table-slot-cell-color)' }}>{row.date}</span>,
      },
      {
        key: 'creator',
        header: 'Creator',
        render: (row: TitanTableRow) => (
          <CreatorCell
            initials={String(row.creatorInitials)}
            email={String(row.creatorEmail)}
            avatarColor={row.avatarColor as string | undefined}
            index={row._index as number}
          />
        ),
      },
      {
        key: 'actions',
        header: '',
        render: (row: TitanTableRow) => (
          <div className="flex items-center" style={{ gap: 'var(--spacing-2xs)' }}>
            {row.hasError && (
              <span className="flex-shrink-0" style={{ color: 'var(--copy-slot-secondary)' }} aria-hidden>
                <Info className="shrink-0" style={{ width: 'var(--spacing-m)', height: 'var(--spacing-m)' }} strokeWidth={1.5} />
              </span>
            )}
            <MenuTrigger>
              <TitanIconButton
                variant="ghost"
                aria-label={`Actions for ${row.reportName}`}
              >
                <MoreVertical className="shrink-0" style={{ width: 'var(--spacing-m)', height: 'var(--spacing-m)' }} strokeWidth={1.5} />
              </TitanIconButton>
              <Popover className="menu-popover" placement="bottom end" offset={4}>
                <Menu className="menu-list" onAction={() => {}}>
                  <MenuItem id="edit" className="menu-item" textValue="Edit">
                    <span className="menu-item-start">
                      <span className="menu-item-icon">
                        <Pencil className="shrink-0" style={{ width: 'var(--spacing-m)', height: 'var(--spacing-m)' }} strokeWidth={1.5} aria-hidden />
                      </span>
                      <span>Edit</span>
                    </span>
                  </MenuItem>
                  <MenuItem id="clone" className="menu-item" textValue="Clone">
                    <span className="menu-item-start">
                      <span className="menu-item-icon">
                        <Copy className="shrink-0" style={{ width: 'var(--spacing-m)', height: 'var(--spacing-m)' }} strokeWidth={1.5} aria-hidden />
                      </span>
                      <span>Clone</span>
                    </span>
                  </MenuItem>
                  <MenuItem id="share" className="menu-item" textValue="Share">
                    <span className="menu-item-start">
                      <span className="menu-item-icon">
                        <Share2 className="shrink-0" style={{ width: 'var(--spacing-m)', height: 'var(--spacing-m)' }} strokeWidth={1.5} aria-hidden />
                      </span>
                      <span>Share</span>
                    </span>
                  </MenuItem>
                  <MenuItem id="delete" className="menu-item menu-item-destructive" textValue="Delete">
                    <span className="menu-item-start">
                      <span className="menu-item-icon">
                        <Trash2 className="shrink-0" style={{ width: 'var(--spacing-m)', height: 'var(--spacing-m)' }} strokeWidth={1.5} aria-hidden />
                      </span>
                      <span>Delete</span>
                    </span>
                  </MenuItem>
                </Menu>
              </Popover>
            </MenuTrigger>
          </div>
        ),
      },
    ]
    return base
  }, [sortKey, sortDir, showDataSources, onReportClick, paginatedReports])

  const filterOptions = useMemo(
    () => [
      { id: 'all', label: 'All reports' },
      ...AUDIENCE_TYPE_OPTIONS.map((t) => ({ id: t, label: t })),
    ],
    []
  )

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
      <div
        className="flex-shrink-0 flex flex-col"
        style={{ background: 'var(--surface-page)', padding: 'var(--spacing-l) var(--spacing-l) var(--spacing-m)', gap: 'var(--spacing-m)' }}
      >
        <div>
          <h1 className="m-0" style={{ color: 'var(--copy-primary)', fontSize: 'var(--font-size-l)', lineHeight: 'var(--font-leading-l)', fontWeight: 'var(--text-weight-semibold)' }}>
            My generated reports
          </h1>
          <p className="m-0" style={{ color: 'var(--copy-tertiary)', fontSize: 'var(--font-size-s)', lineHeight: 'var(--font-leading-s)', marginTop: 'var(--spacing-2xs)' }}>
            View all the reports you have generated across all your Audiense products.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between min-w-0" style={{ gap: 'var(--spacing-m)' }}>
          <div className="flex flex-wrap items-center min-w-0" style={{ gap: 'var(--spacing-m)' }}>
            <div style={{ minWidth: 200, maxWidth: '24rem' }}>
              <TitanInputField
                placeholder="Search by report name..."
                value={searchQuery}
                onChange={setSearchQuery}
                aria-label="Search by report name"
              />
            </div>
            <Select
              className="select-root"
              selectedKey={filterKey}
              onSelectionChange={(k) => k != null && setFilterKey(String(k))}
              aria-label="Filter reports"
            >
              <AriaButton className="select-trigger">
                <Filter className="shrink-0" style={{ color: 'var(--copy-secondary)', width: 'var(--spacing-m)', height: 'var(--spacing-m)' }} aria-hidden />
                <SelectValue />
                <span className="select-trigger-chevron" aria-hidden>
                  <ChevronDown />
                </span>
              </AriaButton>
              <Popover className="select-popover" placement="bottom start">
                <ListBox className="select-list">
                  {filterOptions.map((opt) => (
                    <ListBoxItem key={opt.id} id={opt.id} className="select-item" textValue={opt.label}>
                      <span className="select-item-start">
                        <span>{opt.label}</span>
                      </span>
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </Select>
            {rows.length > 0 && (
              <Checkbox
                isSelected={showDataSources}
                onChange={handleShowDataSourcesChange}
                className="checkbox-root"
                aria-label="Show data sources"
              >
                <span className="checkbox-box">
                  <Check className="checkbox-mark" aria-hidden />
                </span>
                <span className="choice-text">Show data sources</span>
              </Checkbox>
            )}
          </div>
          <div className="new-report-menu-wrap">
              <TitanMenuDropdown
                triggerLabel="New report"
                placement="bottom end"
                items={NEW_REPORT_MENU_ITEMS}
                onAction={(id) => {
                  if (id.startsWith('report-')) onNewReport?.()
                }}
              />
            </div>
          </div>
        </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-auto min-w-0" style={{ background: 'var(--surface-page)', padding: '0 var(--spacing-l) var(--spacing-l)' }}>
        {rows.length === 0 ? (
          <p className="text-center m-0" style={{ color: 'var(--copy-tertiary)', fontSize: 'var(--font-size-s)', lineHeight: 'var(--font-leading-s)', padding: 'var(--spacing-xl) 0' }}>
            No reports match your filters
          </p>
        ) : (
          <>
            <div className="layout-table-wrap">
              <table className="table-borderless">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key} scope="col">
                        {col.key === 'audienceType' ? (
                          <button
                            type="button"
                            className="border-0 bg-transparent p-0 text-left cursor-pointer w-full flex items-center"
                            style={{ color: 'var(--table-slot-header-color)', fontWeight: 'var(--text-weight-semibold)', gap: 'var(--spacing-2xs)' }}
                            onClick={() => toggleSort('audienceType')}
                          >
                            Audience type
                            <span className="inline-flex items-center" style={{ color: sortKey === 'audienceType' ? 'var(--table-slot-header-color)' : 'var(--copy-tertiary)', gap: 'var(--spacing-5xs)' }}>
                              {sortKey === 'audienceType' ? (
                                sortDir === 'asc' ? (
                                  <ArrowUp className="shrink-0" style={{ width: 'var(--spacing-m)', height: 'var(--spacing-m)' }} strokeWidth={2} aria-hidden />
                                ) : (
                                  <ArrowDown className="shrink-0" style={{ width: 'var(--spacing-m)', height: 'var(--spacing-m)' }} strokeWidth={2} aria-hidden />
                                )
                              ) : (
                                <ArrowUpDown className="shrink-0" style={{ width: 'var(--spacing-s)', height: 'var(--spacing-s)' }} strokeWidth={2} aria-hidden />
                              )}
                            </span>
                          </button>
                        ) : col.key === 'date' ? (
                          <button
                            type="button"
                            className="border-0 bg-transparent p-0 text-left cursor-pointer w-full flex items-center"
                            style={{ color: 'var(--table-slot-header-color)', fontWeight: 'var(--text-weight-semibold)', gap: 'var(--spacing-2xs)' }}
                            onClick={() => toggleSort('date')}
                          >
                            Date
                            <span className="inline-flex items-center" style={{ color: sortKey === 'date' ? 'var(--table-slot-header-color)' : 'var(--copy-tertiary)', gap: 'var(--spacing-5xs)' }}>
                              {sortKey === 'date' ? (
                                sortDir === 'asc' ? (
                                  <ArrowUp className="shrink-0" style={{ width: 'var(--spacing-m)', height: 'var(--spacing-m)' }} strokeWidth={2} aria-hidden />
                                ) : (
                                  <ArrowDown className="shrink-0" style={{ width: 'var(--spacing-m)', height: 'var(--spacing-m)' }} strokeWidth={2} aria-hidden />
                                )
                              ) : (
                                <ArrowUpDown className="shrink-0" style={{ width: 'var(--spacing-s)', height: 'var(--spacing-s)' }} strokeWidth={2} aria-hidden />
                              )}
                            </span>
                          </button>
                        ) : (
                          col.header
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      {columns.map((col) => (
                        <td key={col.key}>{col.render(row)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {rows.length > 0 && (
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{ background: 'var(--surface-page)', padding: 'var(--spacing-s) var(--spacing-l)' }}
        >
          <TitanPagination
            ariaLabel="Reports pagination"
            pages={paginationPages}
            currentPage={currentPage}
            previousDisabled={currentPage <= 1}
            nextDisabled={currentPage >= totalPages}
            onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </main>
  )
}
