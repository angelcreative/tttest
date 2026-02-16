import { useEffect, useState } from 'react'
import { Button } from 'react-aria-components'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import type { NetworkId } from '../data/networks'
import { networks } from '../data/networks'
import { AuthDialog } from './AuthDialog'
import { NetworkCard } from './NetworkCard'

const LOADER_URL = 'https://angelcreative.github.io/tttest/loader.png'
const LOADING_MS = 400

type Phase = 'cards' | 'loading' | 'success'

interface NetworkSelectProps {
  onBack?: () => void
  onNext?: (selectedId: NetworkId) => void
  /** Llamado al pulsar Continue en la pantalla de éxito (cuenta conectada). Navega a Creators search. */
  onContinueToCreatorSearch?: () => void
}

export function NetworkSelect({ onBack, onNext, onContinueToCreatorSearch }: NetworkSelectProps) {
  const [selectedId, setSelectedId] = useState<NetworkId | null>(null)
  const [authDialogNetworkId, setAuthDialogNetworkId] = useState<NetworkId | null>(null)
  const [disconnectedIds, setDisconnectedIds] = useState<Set<NetworkId>>(() => new Set())
  const [connectedIds, setConnectedIds] = useState<Set<NetworkId>>(() => new Set())
  const [phase, setPhase] = useState<Phase>('cards')
  const [pendingAuthNetworkId, setPendingAuthNetworkId] = useState<NetworkId | null>(null)

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
    const t = setTimeout(() => setPhase('success'), LOADING_MS)
    return () => clearTimeout(t)
  }, [phase])

  const handleSuccessContinue = () => {
    if (pendingAuthNetworkId) {
      setConnectedIds((prev) => new Set(prev).add(pendingAuthNetworkId))
    }
    setPendingAuthNetworkId(null)
    setPhase('cards')
    onContinueToCreatorSearch?.()
  }

  const handleSuccessBack = () => {
    setPendingAuthNetworkId(null)
    setPhase('cards')
  }

  const pendingNetwork = pendingAuthNetworkId
    ? networks.find((n) => n.id === pendingAuthNetworkId)
    : null

  if (phase === 'loading') {
    return (
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <div
          className="flex-shrink-0 flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-4"
          style={{ background: 'var(--surface-page)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Button
              onPress={onBack}
              className="titan-sidebar-icon-btn shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </Button>
            <h1 className="text-2xl font-semibold truncate" style={{ color: 'var(--copy-primary)' }}>
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
          <img
            src={LOADER_URL}
            alt=""
            width={120}
            height={120}
            className="w-[120px] h-[120px] object-contain"
          />
          <p className="text-sm" style={{ color: 'var(--copy-secondary)' }}>
            Loading....
          </p>
        </div>
      </div>
    )
  }

  if (phase === 'success' && pendingNetwork) {
    return (
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <div
          className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-md mx-auto"
          style={{ background: 'var(--surface-page)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'var(--color-teal-100)' }}
            aria-hidden
          >
            <CheckCircle
              className="w-10 h-10"
              style={{ color: 'var(--color-teal-600)' }}
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--copy-primary)' }}>
            Account connected!
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--copy-secondary)' }}>
            Your {pendingNetwork.name} account is now linked.
          </p>
          <Button
            onPress={handleSuccessContinue}
            className="titan-btn-primary mt-6 inline-flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Button>
          <Button
            onPress={handleSuccessBack}
            className="titan-btn-tertiary mt-3 text-sm"
          >
            ← Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-auto">
      <div
        className="flex-shrink-0 flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-4"
        style={{ background: 'var(--surface-page)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Button
            onPress={onBack}
            className="titan-sidebar-icon-btn shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </Button>
          <h1 className="text-2xl font-semibold truncate" style={{ color: 'var(--copy-primary)' }}>
            Select network
          </h1>
        </div>
        <Button
          onPress={handleNext}
          isDisabled={!hasSelection}
          className="titan-btn-primary shrink-0 inline-flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>
      <div className="flex-1 px-6 py-6" style={{ background: 'var(--surface-page)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
