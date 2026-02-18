import { useMemo, useState } from 'react'
import { AppLayout } from './layout/AppLayout'
import { CreatorDiscoveryHome } from './components/CreatorDiscoveryHome'
import { CreatorSearch } from './components/CreatorSearch'
import { BrandMentions } from './components/BrandMentions'
import { ChooseTikTokMethod } from './components/ChooseTikTokMethod'
import { NetworkSelect } from './components/NetworkSelect'
import type { NetworkId } from './data/networks'
import type { TikTokMethodId } from './components/ChooseTikTokMethod'
import type { BreadcrumbItem } from './components/Breadcrumb'

type MainView = 'creator-discovery' | 'select-network' | 'choose-method' | 'creator-search' | 'brand-mentions'

const VIEW_ORDER: MainView[] = ['creator-discovery', 'select-network', 'choose-method']

const BREADCRUMB_LABELS_BY_VIEW: Record<MainView, { label: string; current?: boolean }[]> = {
  'creator-discovery': [{ label: 'Home', current: true }],
  'select-network': [{ label: 'Home' }, { label: 'Select your network', current: true }],
  'choose-method': [
    { label: 'Home' },
    { label: 'Select your network' },
    { label: 'Choose TikTok method', current: true },
  ],
  'creator-search': [
    { label: 'Home' },
    { label: 'Select your network' },
    { label: 'Choose TikTok method' },
    { label: 'Campaign collab', current: true },
  ],
  'brand-mentions': [
    { label: 'Home' },
    { label: 'Select your network' },
    { label: 'Choose TikTok method' },
    { label: 'Brand mentions', current: true },
  ],
}

function getBreadcrumbItems(view: MainView, setView: (v: MainView) => void): BreadcrumbItem[] {
  const rows = BREADCRUMB_LABELS_BY_VIEW[view]
  return rows.map((row, i) => ({
    ...row,
    onPress: row.current ? undefined : () => setView(i < VIEW_ORDER.length ? VIEW_ORDER[i] : view),
  }))
}

function App() {
  const [view, setView] = useState<MainView>('creator-discovery')

  const handleMethodNext = (methodId: TikTokMethodId) => {
    if (methodId === 'campaign') setView('creator-search')
    else setView('brand-mentions')
  }

  const breadcrumbItems = useMemo(() => getBreadcrumbItems(view, setView), [view])

  return (
    <AppLayout breadcrumbItems={breadcrumbItems}>
      {view === 'creator-discovery' && (
        <CreatorDiscoveryHome onFindCreators={() => setView('select-network')} />
      )}
      {view === 'select-network' && (
        <NetworkSelect
          onBack={() => setView('creator-discovery')}
          onNext={(_selectedId: NetworkId) => setView('creator-discovery')}
          onContinueToCreatorSearch={() => setView('choose-method')}
        />
      )}
      {view === 'choose-method' && (
        <ChooseTikTokMethod
          onBack={() => setView('select-network')}
          onNext={handleMethodNext}
        />
      )}
      {view === 'creator-search' && (
        <CreatorSearch onBack={() => setView('choose-method')} />
      )}
      {view === 'brand-mentions' && (
        <BrandMentions onBack={() => setView('choose-method')} />
      )}
    </AppLayout>
  )
}

export default App
