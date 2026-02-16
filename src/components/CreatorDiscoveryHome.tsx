import { useState } from 'react'
import { Button } from 'react-aria-components'
import { ArrowRight, Trash2 } from 'lucide-react'
import type { Campaign } from '../data/campaigns'
import { TikTokLogo } from './TikTokLogo'
import { CAMPAIGNS_SEED } from '../data/campaigns'

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

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[var(--surface-page)]">
      <div className="flex-shrink-0 px-6 pt-6 pb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--copy-primary)' }}>
          Creator Discovery
        </h1>
        <Button className="titan-btn-primary" onPress={onFindCreators}>
          Find creators
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="titan-table-wrap">
          <table className="titan-table">
            <thead>
              <tr>
                <th>Campaign name</th>
                <th>Users</th>
                <th>Network</th>
                <th>Ad account</th>
                <th>Campaign description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8" style={{ color: 'var(--copy-tertiary)' }}>
                    No campaigns yet
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium" style={{ color: 'var(--copy-primary)' }}>
                          {c.name}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--copy-tertiary)' }}>
                          <TikTokLogo className="w-5 h-5 [color:var(--copy-secondary)]" />
                          {NETWORK_LABELS[c.network]}
                        </span>
                      </div>
                    </td>
                    <td>{c.creatorCount} creators</td>
                    <td>{NETWORK_LABELS[c.network]}</td>
                    <td>{c.adAccountName}</td>
                    <td className="max-w-[200px] truncate">{c.description || '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="titan-link-destructive"
                        onClick={() => setDeleteConfirmId(c.id)}
                        aria-label={`Delete ${c.name}`}
                      >
                        <Trash2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm" style={{ color: 'var(--copy-tertiary)' }}>
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
            <h2 id="delete-dialog-title" className="text-lg font-semibold mb-2" style={{ color: 'var(--copy-primary)' }}>
              Delete campaign?
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--copy-secondary)' }}>
              This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onPress={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg border text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  borderColor: 'var(--input-border)',
                  color: 'var(--copy-primary)',
                  background: 'var(--surface-0)',
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => handleDelete(deleteConfirmId)}
                className="titan-link-destructive px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-red-100)] hover:bg-[var(--color-red-200)]"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
