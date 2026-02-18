import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { TitanButton, TitanBorderlessTable, TitanIconButton } from 'titan-compositions'
import type { Campaign } from '../data/campaigns'
import { TikTokLogo } from './TikTokLogo'
import { CAMPAIGNS_SEED } from '../data/campaigns'
import type { TitanTableRow } from 'titan-compositions'

const NETWORK_LABELS: Record<Campaign['network'], string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  facebook: 'Facebook',
  x: 'X (Twitter)',
}

interface CreatorDiscoveryHomeProps {
  onFindCreators?: () => void
}

export function CreatorDiscoveryHome({ onFindCreators }: CreatorDiscoveryHomeProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS_SEED)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
    setDeleteConfirmId(null)
  }

  const rows: TitanTableRow[] = campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    network: c.network,
    creatorCount: c.creatorCount,
    adAccountName: c.adAccountName,
  }))

  const columns = [
    {
      key: 'report',
      header: 'Report',
      render: (row: TitanTableRow) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium" style={{ color: 'var(--copy-primary)' }}>
            {row.name}
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--copy-tertiary)' }}>
            <TikTokLogo className="w-5 h-5 [color:var(--copy-secondary)]" />
            {NETWORK_LABELS[row.network as Campaign['network']]}
          </span>
        </div>
      ),
    },
    {
      key: 'users',
      header: 'Users',
      render: (row: TitanTableRow) => `${row.creatorCount} creators`,
    },
    {
      key: 'network',
      header: 'Network',
      render: (row: TitanTableRow) => NETWORK_LABELS[row.network as Campaign['network']],
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
          Creator Discovery
        </h1>
        <TitanButton variant="primary" onPress={onFindCreators}>
          New report
        </TitanButton>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6 min-w-0" style={{ background: 'var(--surface-page)' }}>
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm" style={{ color: 'var(--copy-tertiary)' }}>
            No campaigns yet
          </p>
        ) : (
          <TitanBorderlessTable columns={columns} rows={rows} />
        )}
        <p className="mt-3 text-sm m-0" style={{ color: 'var(--copy-tertiary)' }}>
          {campaigns.length} {campaigns.length === 1 ? 'report' : 'reports'}
        </p>
      </div>

      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'var(--color-black-50)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className="rounded-xl shadow-lg p-6 max-w-sm w-full"
            style={{
              background: 'var(--surface-1)',
              padding: 'var(--spacing-l)',
            }}
          >
            <h2
              id="delete-dialog-title"
              className="text-lg font-semibold mb-2 m-0"
              style={{ color: 'var(--copy-primary)' }}
            >
              Delete campaign?
            </h2>
            <p className="text-sm mb-6 m-0" style={{ color: 'var(--copy-secondary)' }}>
              This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <TitanButton
                variant="secondary"
                onPress={() => setDeleteConfirmId(null)}
              >
                Cancel
              </TitanButton>
              <TitanButton
                variant="delete"
                onPress={() => handleDelete(deleteConfirmId)}
              >
                Delete
              </TitanButton>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
