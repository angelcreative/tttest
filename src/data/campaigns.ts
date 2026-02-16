export type Network = 'tiktok' | 'instagram' | 'facebook' | 'x'

export interface Campaign {
  id: string
  name: string
  network: Network
  adAccountName: string
  creatorCount: number
  description: string
}

export const CAMPAIGNS_SEED: Campaign[] = [
  {
    id: '1',
    name: 'Summer 2025',
    network: 'tiktok',
    adAccountName: 'Ads Account 1',
    creatorCount: 12,
    description: 'Influencer campaign for summer product launch',
  },
  {
    id: '2',
    name: 'Product Launch',
    network: 'tiktok',
    adAccountName: 'Ads Account 1',
    creatorCount: 8,
    description: 'New product announcement with creators',
  },
  {
    id: '3',
    name: 'Influencer Collab',
    network: 'tiktok',
    adAccountName: 'Ads Account 2',
    creatorCount: 5,
    description: '',
  },
]
