import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { TitanButton, TitanIconButton } from 'titan-compositions'
import type { NetworkId } from '../data/networks'
import { networks } from '../data/networks'
import { AuthDialog } from './AuthDialog'
import { NetworkCard } from './NetworkCard'

/** Loader: Titan foundations (CDN) — misma idea que logos externos */
const LOADER_IMG_URL = 'https://cdn.jsdelivr.net/gh/angelcreative/titan-foundations@main/public/assets/logos/loader-l.gif'
const LOADING_MS = 400

type Phase = 'cards' | 'loading'

interface NetworkSelectProps {
  onBack?: () => void
  onNext?: (selectedId: NetworkId) => void
  onContinueToCreatorSearch?: () => void
}

export function NetworkSelect({ onBack, onNext, onContinueToCreatorSearch }: NetworkSelectProps) {
  const [selectedId, setSelectedId] = useState<NetworkId | null>(null)
  const [authDialogNetworkId, setAuthDialogNetworkId] = useState<NetworkId | null>(null)
  const [disconnectedIds, setDisconnectedIds] = useState<Set<NetworkId>>(() => new Set())
  const [connectedIds, setConnectedIds] = useState<Set<NetworkId>>(() => new Set())
  const [phase, setPhase] = useState<Phase>('cards')
  const [pendingAuthNetworkId, setPendingAuthNetworkId] = useState<NetworkId | null>(null)
  const [loaderImgError, setLoaderImgError] = useState(false)

  const isAuthenticated = (id: NetworkId) => {
    const net = networks.find((n) => n.id === id)
    if (!net) return false
    const baseAuth = net.authenticated || connectedIds.has(id)
    return baseAuth && !disconnectedIds.has(id)
  }

  const hasSelection = selectedId !== null && isAuthenticated(selectedId)

  const handleNext = () => {
    if (selectedId && onNext) onNext(selectedId)
  }

  const handleAuthorize = () => {
    if (!authDialogNetworkId) return
    setPendingAuthNetworkId(authDialogNetworkId)
    setAuthDialogNetworkId(null)
    setPhase('loading')
  }

  useEffect(() => {
    if (phase !== 'loading') return
    const networkIdToAdd = pendingAuthNetworkId
    const t = setTimeout(() => {
      if (networkIdToAdd) setConnectedIds((prev) => new Set(prev).add(networkIdToAdd))
      setPendingAuthNetworkId(null)
      setPhase('cards')
      setLoaderImgError(false)
      onContinueToCreatorSearch?.()
    }, LOADING_MS)
    return () => clearTimeout(t)
  }, [phase, pendingAuthNetworkId, onContinueToCreatorSearch])

  if (phase === 'loading') {
    return (
      <div className="flex-1 flex flex-col min-w-0 overflow-auto w-full">
        <div
          className="flex-shrink-0 flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-4"
          style={{ background: 'var(--surface-page)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <TitanIconButton variant="ghost" aria-label="Back" onPress={onBack}>
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </TitanIconButton>
            <h1 className="text-2xl font-semibold truncate m-0" style={{ color: 'var(--copy-primary)' }}>
              Select network
            </h1>
          </div>
        </div>
        <div
          className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-6"
          style={{ background: 'var(--surface-page)' }}
          aria-live="polite"
          aria-busy="true"
        >
          {loaderImgError ? (
            <span
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 48, height: 48, color: 'var(--copy-slot-secondary)' }}
              aria-hidden
            >
              <Loader2 className="w-8 h-8 animate-spin" strokeWidth={2} />
            </span>
          ) : (
            <img
              src={LOADER_IMG_URL}
              alt=""
              width={48}
              height={48}
              className="w-12 h-12 object-contain flex-shrink-0"
              onError={() => setLoaderImgError(true)}
            />
          )}
          <p className="text-sm m-0" style={{ color: 'var(--copy-secondary)' }}>
            Loading....
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-auto w-full">
      <div
        className="flex-shrink-0 flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-4"
        style={{ background: 'var(--surface-page)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <TitanIconButton variant="ghost" aria-label="Back" onPress={onBack}>
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </TitanIconButton>
          <h1 className="text-2xl font-semibold truncate m-0" style={{ color: 'var(--copy-primary)' }}>
            Select network
          </h1>
        </div>
        <TitanButton
          variant="primary"
          onPress={handleNext}
          isDisabled={!hasSelection}
          className="inline-flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.5} />
        </TitanButton>
      </div>
      <div className="flex-1 px-6 py-6 min-w-0" style={{ background: 'var(--surface-page)' }}>
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {networks.map((network) => (
            <NetworkCard
              key={network.id}
              network={network}
              selected={selectedId === network.id}
              onSelect={() => setSelectedId(network.id)}
              authenticated={isAuthenticated(network.id)}
              onConnect={
                isAuthenticated(network.id)
                  ? undefined
                  : () => setAuthDialogNetworkId(network.id)
              }
              onDisconnect={
                isAuthenticated(network.id)
                  ? () => setDisconnectedIds((prev) => new Set(prev).add(network.id))
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {authDialogNetworkId && (
        <AuthDialog
          networkName={networks.find((n) => n.id === authDialogNetworkId)?.name ?? authDialogNetworkId}
          onClose={() => setAuthDialogNetworkId(null)}
          onAuthorize={handleAuthorize}
        />
      )}
    </div>
  )
}
