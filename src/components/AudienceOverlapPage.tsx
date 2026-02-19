import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button as AriaButton } from 'react-aria-components'
import { IconBrandTiktok, IconBrandFacebook, IconBrandInstagram, IconBrandX } from '@tabler/icons-react'
import { TitanButton, TitanBorderlessTable, TitanIconButton } from 'titan-compositions'
import type { TitanTableRow } from 'titan-compositions'
import { AUDIENCE_OVERLAP_SEED, type AudienceOverlapReport, type AudienceOverlapNetwork } from '../data/audienceOverlap'

const NETWORK_LABELS: Record<AudienceOverlapNetwork, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  facebook: 'Facebook',
  x: 'X (Twitter)',
}

const NETWORK_ICONS: Record<AudienceOverlapNetwork, React.ComponentType<{ className?: string; size?: number }>> = {
  tiktok: IconBrandTiktok,
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  x: IconBrandX,
}

interface AudienceOverlapPageProps {
  onNewReport?: () => void
  onReportClick?: (reportId: string) => void
}

export function AudienceOverlapPage({ onNewReport, onReportClick }: AudienceOverlapPageProps) {
  const [reports, setReports] = useState<AudienceOverlapReport[]>(AUDIENCE_OVERLAP_SEED)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id))
    setDeleteConfirmId(null)
  }

  const rows: TitanTableRow[] = reports.map((r) => ({
    id: r.id,
    name: r.name,
    network: r.network,
    audienceCount: r.audienceCount,
    adAccountName: r.adAccountName,
  }))

  const columns = [
    {
      key: 'report',
      header: 'Report',
      render: (row: TitanTableRow) => {
        const NetworkIcon = NETWORK_ICONS[row.network as AudienceOverlapNetwork]
        return (
          <div className="flex flex-col gap-0.5">
            <AriaButton
              className="outline-none border-0 bg-transparent p-0 text-left font-medium cursor-pointer underline decoration-solid underline-offset-2 hover:no-underline"
              style={{ color: 'var(--link-color)' }}
              onPress={() => onReportClick?.(String(row.id))}
            >
              {row.name}
            </AriaButton>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--copy-tertiary)' }}>
              {NetworkIcon && (
                <NetworkIcon
                  className="w-4 h-4 shrink-0"
                  style={{ color: 'var(--copy-secondary)' }}
                  aria-hidden
                />
              )}
              {NETWORK_LABELS[row.network as AudienceOverlapNetwork]}
            </span>
          </div>
        )
      },
    },
    {
      key: 'users',
      header: 'Users',
      render: (row: TitanTableRow) => `${row.audienceCount} audiences`,
    },
    {
      key: 'network',
      header: 'Network',
      render: (row: TitanTableRow) => NETWORK_LABELS[row.network as AudienceOverlapNetwork],
    },
    { key: 'adAccountName', header: 'Ad account' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: TitanTableRow) => (
        <TitanIconButton
          variant="ghost"
          aria-label={`Delete ${row.name}`}
          onPress={() => setDeleteConfirmId(row.id as string)}
        >
          <Trash2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
        </TitanIconButton>
      ),
    },
  ]

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-auto w-full">
      <div
        className="flex-shrink-0 px-6 pt-6 pb-4 flex items-start justify-between gap-4"
        style={{ background: 'var(--surface-page)' }}
      >
        <h1 className="text-xl font-semibold m-0" style={{ color: 'var(--copy-primary)' }}>
          Audience Overlap
        </h1>
        <TitanButton variant="primary" onPress={onNewReport}>
          New report
        </TitanButton>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6 min-w-0" style={{ background: 'var(--surface-page)' }}>
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm" style={{ color: 'var(--copy-tertiary)' }}>
            No overlap reports yet. Create one to compare audiences on a single network.
          </p>
        ) : (
          <TitanBorderlessTable columns={columns} rows={rows} />
        )}
        <p className="mt-3 text-sm m-0" style={{ color: 'var(--copy-tertiary)' }}>
          {reports.length} {reports.length === 1 ? 'report' : 'reports'}
        </p>
      </div>

      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'var(--color-black-50)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-overlap-dialog-title"
        >
          <div
            className="rounded-xl shadow-lg p-6 max-w-sm w-full"
            style={{
              background: 'var(--surface-1)',
              padding: 'var(--spacing-l)',
            }}
          >
            <h2
              id="delete-overlap-dialog-title"
              className="text-lg font-semibold mb-2 m-0"
              style={{ color: 'var(--copy-primary)' }}
            >
              Delete report?
            </h2>
            <p className="text-sm mb-6 m-0" style={{ color: 'var(--copy-secondary)' }}>
              This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <TitanButton variant="secondary" onPress={() => setDeleteConfirmId(null)}>
                Cancel
              </TitanButton>
              <TitanButton variant="delete" onPress={() => handleDelete(deleteConfirmId)}>
                Delete
              </TitanButton>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
