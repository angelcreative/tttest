export type NetworkId = 'tiktok' | 'x' | 'instagram' | 'facebook'

export interface Network {
  id: NetworkId
  name: string
  subtitle: string
  logo: string
}

export const networks: Network[] = [
  { id: 'tiktok', name: 'Tik Tok', subtitle: 'Followers, following, sources', logo: 'tiktok' },
  { id: 'x', name: 'X (formerly Twitter)', subtitle: 'Followers, following, sources', logo: 'x' },
  { id: 'instagram', name: 'Instagram', subtitle: 'Followers, following, sources', logo: 'instagram' },
  { id: 'facebook', name: 'Facebook', subtitle: 'Subscribers, sources', logo: 'facebook' },
]
