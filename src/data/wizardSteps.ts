export type WizardStep = 'select-network' | 'choose-tiktok-method' | 'connect-tiktok' | 'brand-mentions' | 'creator-search'

export const WIZARD_STEPS: { id: WizardStep; label: string }[] = [
  { id: 'select-network', label: 'Select your network' },
  { id: 'choose-tiktok-method', label: 'Choose TikTok method' },
  { id: 'connect-tiktok', label: 'Connect TikTok account' },
  { id: 'brand-mentions', label: 'Brand mentions' },
  { id: 'creator-search', label: 'Creators search' },
]

export function getStepsUpTo(current: WizardStep): { id: WizardStep; label: string }[] {
  const idx = WIZARD_STEPS.findIndex((s) => s.id === current)
  return WIZARD_STEPS.slice(0, idx + 1)
}
