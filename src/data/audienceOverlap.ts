/**
 * Seed data for Audience Overlap reports (invented).
 * One report = one network only (never mixed).
 */

export type AudienceOverlapNetwork = 'tiktok' | 'instagram' | 'facebook' | 'x'

export interface AudienceOverlapReport {
  id: string
  name: string
  network: AudienceOverlapNetwork
  adAccountName: string
  /** Number of audiences compared in this overlap report (e.g. 2) */
  audienceCount: number
}

export const AUDIENCE_OVERLAP_SEED: AudienceOverlapReport[] = [
  { id: '1', name: 'Q1 Overlap Report', network: 'instagram', adAccountName: 'Ads Account 1', audienceCount: 2 },
  { id: '2', name: 'X and Facebook overlap', network: 'x', adAccountName: 'Ads Account 1', audienceCount: 2 },
  { id: '3', name: 'Cross-platform creators', network: 'tiktok', adAccountName: 'Ads Account 2', audienceCount: 2 },
  { id: '4', name: 'Facebook audience overlap', network: 'facebook', adAccountName: 'Ads Account 1', audienceCount: 2 },
  { id: '5', name: 'Instagram reach overlap', network: 'instagram', adAccountName: 'Ads Account 2', audienceCount: 2 },
]
