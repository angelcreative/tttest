import { useMemo, useState } from 'react'
import { AppLayout } from './layout/AppLayout'
import { CreatorDiscoveryHome } from './components/CreatorDiscoveryHome'
import { CreatorSearch } from './components/CreatorSearch'
import { BrandMentions } from './components/BrandMentions'
import { ChooseTikTokMethod } from './components/ChooseTikTokMethod'
import { NetworkSelect } from './components/NetworkSelect'
import { ReportListHome } from './components/ReportListHome'
import type { NetworkId } from './data/networks'
import type { TikTokMethodId } from './components/ChooseTikTokMethod'
import type { BreadcrumbItem } from './components/Breadcrumb'
import type { SidebarItemId } from './components/Sidebar'

type MainView = 'all-reports' | 'creator-discovery' | 'select-network' | 'choose-method' | 'creator-search' | 'brand-mentions'

const VIEW_ORDER: MainView[] = ['creator-discovery', 'select-network', 'choose-method']

const BREADCRUMB_LABELS_BY_VIEW: Record<MainView, { label: string; current?: boolean }[]> = {
  'all-reports': [{ label: 'All reports', current: true }],
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
    { label: 'Adidas campaign', current: true },
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

function viewToSidebarId(view: MainView): SidebarItemId {
  if (view === 'all-reports') return 'all-reports'
  return 'creator-discovery'
}

function sidebarIdToView(id: SidebarItemId): MainView | null {
  if (id === 'all-reports') return 'all-reports'
  if (id === 'creator-discovery') return 'creator-discovery'
  if (id === 'home') return 'creator-discovery'
  return null
}

function App() {
  const [view, setView] = useState<MainView>('creator-discovery')

  const handleMethodNext = (methodId: TikTokMethodId) => {
    if (methodId === 'campaign') setView('creator-search')
    else setView('brand-mentions')
  }

  const breadcrumbItems = useMemo(() => getBreadcrumbItems(view, setView), [view])
  const sidebarActiveId = viewToSidebarId(view)
  const handleSidebarNavigate = (id: SidebarItemId) => {
    const nextView = sidebarIdToView(id)
    if (nextView != null) setView(nextView)
  }

  return (
    <AppLayout
      breadcrumbItems={breadcrumbItems}
      sidebarActiveId={sidebarActiveId}
      onSidebarNavigate={handleSidebarNavigate}
    >
      {view === 'all-reports' && (
        <ReportListHome onNewReport={() => setView('creator-discovery')} />
      )}
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
