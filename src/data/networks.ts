export type NetworkId = 'tiktok' | 'x' | 'instagram' | 'facebook'

export interface Network {
  id: NetworkId
  name: string
  subtitle: string
  logo: string
  /** Si la red ya está conectada/autenticada, el usuario puede seleccionarla y dar Next */
  authenticated: boolean
}

export const networks: Network[] = [
  { id: 'tiktok', name: 'Tik Tok', subtitle: 'Followers, following, sources', logo: 'tiktok', authenticated: false },
  { id: 'x', name: 'X (formerly Twitter)', subtitle: 'Followers, following, sources', logo: 'x', authenticated: false },
  { id: 'instagram', name: 'Instagram', subtitle: 'Followers, following, sources', logo: 'instagram', authenticated: true },
  { id: 'facebook', name: 'Facebook', subtitle: 'Subscribers, sources', logo: 'facebook', authenticated: false },
]
