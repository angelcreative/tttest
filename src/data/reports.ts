/**
 * Consolidated report list (My generated reports).
 * dataSources: icons shown when "Show data sources" is on (linkedin, xmeta, facebook, instagram, meta, google, youtube, web, tiktok + optional tag).
 */

import { CAMPAIGNS_SEED } from './campaigns'

/** Valores = voces del submenú "New report" (By X → "X"). Listado para select/filtro All reports. */
export const AUDIENCE_TYPE_OPTIONS: readonly string[] = [
  'Audience profile',
  'Saved audience',
  'Account profile',
  'Fan page',
  'Conversations',
  'Upload',
  'Engagement',
  'Follower growth',
  'Overlap',
  'Popularity',
  'Creator discovery',
] as const

export type AudienceType = (typeof AUDIENCE_TYPE_OPTIONS)[number]

export type DataSourceType =
  | 'linkedin'
  | 'xmeta'
  | 'facebook'
  | 'instagram'
  | 'threads'
  | 'meta'
  | 'google'
  | 'youtube'
  | 'web'
  | 'tiktok'

export interface DataSourceTag {
  text: string // e.g. "+ 12 segments", "+ 12 sources"
}

export interface ReportDataSource {
  type: DataSourceType
  tag?: DataSourceTag
}

export interface Report {
  id: string
  reportName: string
  audienceType: AudienceType
  audienceSize: number
  date: string
  creatorInitials: string
  creatorEmail: string
  hasError?: boolean
  /** Shown when "Show data sources" is on. Avatar bg uses --color-{avatarColor}-600 */
  avatarColor?: string
  dataSources?: ReportDataSource[]
}

const SEED_REPORTS: Report[] = [
  {
    id: '1',
    reportName: 'PUMA JOGGING',
    audienceType: 'Audience profile',
    audienceSize: 380473,
    date: 'Apr 14, 1999',
    creatorInitials: 'TK',
    creatorEmail: 'tk@company.com',
    avatarColor: 'teal',
    dataSources: [
      { type: 'linkedin' },
      { type: 'xmeta', tag: { text: '+ 12 segments' } },
    ],
  },
  {
    id: '2',
    reportName: 'Mothers who are K-Pop fans in Madrid',
    audienceType: 'Audience profile',
    audienceSize: 86849,
    date: 'Apr 14, 1999',
    creatorInitials: 'AW',
    creatorEmail: 'allison.walsh@company.com',
    avatarColor: 'ocean',
    dataSources: [{ type: 'xmeta', tag: { text: '+ 8 segments' } }],
  },
  {
    id: '3',
    reportName: 'Luxury car enthusiasts aged 20-25',
    audienceType: 'Saved audience',
    audienceSize: 380462,
    date: 'Apr 14, 1999',
    creatorInitials: 'RS',
    creatorEmail: 'rs@company.com',
    avatarColor: 'red',
    dataSources: [{ type: 'facebook' }, { type: 'instagram' }],
  },
  {
    id: '4',
    reportName: 'Marketing professionals interested in tech',
    audienceType: 'Conversations',
    audienceSize: 29039,
    date: 'Apr 14, 1999',
    creatorInitials: 'DZ',
    creatorEmail: 'dz@company.com',
    avatarColor: 'purple',
    dataSources: [{ type: 'meta' }],
  },
  {
    id: '5',
    reportName: 'Vegan-content foodies on TikTok',
    audienceType: 'Audience profile',
    audienceSize: 154800,
    date: 'Apr 14, 1999',
    creatorInitials: 'KY',
    creatorEmail: 'ky@company.com',
    avatarColor: 'avocado',
    dataSources: [{ type: 'xmeta', tag: { text: '+ 13 segments' } }],
  },
  {
    id: '6',
    reportName: 'Frequent millennial travelers (EU & UK)',
    audienceType: 'Fan page',
    audienceSize: 116570,
    date: 'Apr 14, 1999',
    creatorInitials: 'DZ',
    creatorEmail: 'dz@company.com',
    avatarColor: 'magenta',
    dataSources: [{ type: 'instagram' }],
  },
  {
    id: '7',
    reportName: 'High-protein fitness lovers (women 25-34)',
    audienceType: 'Conversations',
    audienceSize: 20232,
    date: 'Apr 14, 1999',
    creatorInitials: 'AV',
    creatorEmail: 'av@company.com',
    avatarColor: 'blueberry',
    dataSources: [],
  },
  {
    id: '8',
    reportName: '@uefa',
    audienceType: 'Account profile',
    audienceSize: 222658,
    date: 'Apr 14, 1999',
    creatorInitials: 'SP',
    creatorEmail: 'sp@company.com',
    avatarColor: 'indigo',
    dataSources: [
      { type: 'google' },
      { type: 'youtube' },
      { type: 'web' },
      { type: 'web', tag: { text: '+ 12 sources' } },
    ],
  },
  {
    id: '9',
    reportName: 'Dua Lipa South America',
    audienceType: 'Overlap',
    audienceSize: 298352,
    date: 'Apr 14, 1999',
    creatorInitials: 'AW',
    creatorEmail: 'Allison_Walsh31@company.com',
    avatarColor: 'violet',
    dataSources: [{ type: 'instagram' }],
  },
  {
    id: '10',
    reportName: 'Electronic music fans who attend festivals',
    audienceType: 'Popularity',
    audienceSize: 298887,
    date: 'Apr 14, 1999',
    creatorInitials: 'AW',
    creatorEmail: 'allison.walsh@company.com',
    hasError: true,
    avatarColor: 'tomato',
    dataSources: [{ type: 'instagram' }],
  },
]

/** TikTok reports from Creator Discovery (campaigns) */
const TIKTOK_REPORTS_FROM_CAMPAIGNS: Report[] = CAMPAIGNS_SEED.map((c) => ({
  id: `tiktok-${c.id}`,
  reportName: c.name,
  audienceType: 'Creator discovery',
  audienceSize: c.creatorCount,
  date: 'Apr 14, 1999',
  creatorInitials: 'TK',
  creatorEmail: 'tiktok@company.com',
  avatarColor: 'turquoise',
  dataSources: [{ type: 'tiktok' }],
}))

export const REPORTS_SEED: Report[] = [...TIKTOK_REPORTS_FROM_CAMPAIGNS, ...SEED_REPORTS]
