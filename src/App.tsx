import { useMemo, useState } from 'react'
import { AppLayout } from './layout/AppLayout'
import { CreatorDiscoveryHome } from './components/CreatorDiscoveryHome'
import { CreatorDiscoveryTable } from './components/CreatorDiscoveryTable'
import { CreatorSearch } from './components/CreatorSearch'
import { BrandMentions } from './components/BrandMentions'
import { ChooseTikTokMethod } from './components/ChooseTikTokMethod'
import { NetworkSelect } from './components/NetworkSelect'
import { ReportListHome } from './components/ReportListHome'
import { AudienceOverlapPage } from './components/AudienceOverlapPage'
import type { NetworkId } from './data/networks'
import type { TikTokMethodId } from './components/ChooseTikTokMethod'
import type { BreadcrumbItem } from './components/Breadcrumb'
import type { SidebarItemId } from './components/Sidebar'

type MainView = 'home' | 'all-reports' | 'audience-overlap' | 'creator-discovery' | 'select-network' | 'choose-method' | 'creator-search' | 'brand-mentions'

type BreadcrumbRow = { label: string; current?: boolean; navigateToView?: MainView }

const BREADCRUMB_LABELS_BY_VIEW: Record<MainView, BreadcrumbRow[]> = {
  'home': [{ label: 'Home', current: true }],
  'all-reports': [{ label: 'All reports', current: true }],
  'audience-overlap': [{ label: 'Audience overlap', current: true }],
  'creator-discovery': [{ label: 'Creator discovery', current: true }],
  'select-network': [
    { label: 'Creator discovery', navigateToView: 'creator-discovery' },
    { label: 'Select your network', current: true },
  ],
  'choose-method': [
    { label: 'Creator discovery', navigateToView: 'creator-discovery' },
    { label: 'Select your network', navigateToView: 'select-network' },
    { label: 'Choose TikTok method', current: true },
  ],
  'creator-search': [
    { label: 'Creator discovery', navigateToView: 'creator-discovery' },
    { label: 'Select your network', navigateToView: 'select-network' },
    { label: 'Choose TikTok method', navigateToView: 'choose-method' },
    { label: 'Collab campaign', current: true },
  ],
  'brand-mentions': [
    { label: 'Creator discovery', navigateToView: 'creator-discovery' },
    { label: 'Select your network', navigateToView: 'select-network' },
    { label: 'Choose TikTok method', navigateToView: 'choose-method' },
    { label: 'Brand mentions', current: true },
  ],
}

function getBreadcrumbItems(view: MainView, setView: (v: MainView) => void): BreadcrumbItem[] {
  const rows = BREADCRUMB_LABELS_BY_VIEW[view]
  return rows.map((row) => ({
    label: row.label,
    current: row.current,
    onPress: row.current ? undefined : row.navigateToView != null ? () => setView(row.navigateToView!) : undefined,
  }))
}

function viewToSidebarId(view: MainView): SidebarItemId {
  if (view === 'home') return 'home'
  if (view === 'all-reports') return 'all-reports'
  if (view === 'audience-overlap') return 'audience-overlap'
  if (view === 'creator-discovery') return 'creator-discovery'
  // Creator discovery flow: keep sidebar on Creator discovery
  if (view === 'select-network' || view === 'choose-method' || view === 'creator-search' || view === 'brand-mentions') return 'creator-discovery'
  return 'home'
}

function sidebarIdToView(id: SidebarItemId): MainView | null {
  if (id === 'home') return 'home'
  if (id === 'all-reports') return 'all-reports'
  if (id === 'audience-overlap') return 'audience-overlap'
  if (id === 'creator-discovery') return 'creator-discovery'
  return null
}

function App() {
  const [view, setView] = useState<MainView>('home')

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
      {view === 'home' && (
        <CreatorDiscoveryHome onFindCreators={() => setView('select-network')} />
      )}
      {view === 'all-reports' && (
        <ReportListHome onNewReport={() => setView('creator-discovery')} />
      )}
      {view === 'audience-overlap' && (
        <AudienceOverlapPage onNewReport={() => setView('creator-discovery')} />
      )}
      {view === 'creator-discovery' && (
        <CreatorDiscoveryTable
          onNewReport={() => setView('select-network')}
          onReportClick={(_reportId) => { /* TODO: navigate to report detail */ }}
        />
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
