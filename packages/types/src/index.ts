// ── Themes ─────────────────────────────────────────────────────────────────
export type Theme =
  | 'health-wellbeing'
  | 'rights-justice'
  | 'design-environment'
  | 'knowledge-education'
  | 'economic-justice'

export const THEMES: Record<Theme, { label: string; color: string; bg: string }> = {
  'health-wellbeing':    { label: 'Health & Wellbeing',     color: '#1A5C2A', bg: '#EEF6F0' },
  'rights-justice':      { label: 'Rights & Justice',        color: '#6B4200', bg: '#F5F0E8' },
  'design-environment':  { label: 'Design & Environment',    color: '#1A2E6B', bg: '#EEF0F8' },
  'knowledge-education': { label: 'Knowledge & Education',   color: '#4A1A6B', bg: '#F4EEF8' },
  'economic-justice':    { label: 'Economic Justice',        color: '#5C3A00', bg: '#F8F2EE' },
}

// ── SDGs ───────────────────────────────────────────────────────────────────
export type SDG =
  | 1 | 3 | 5 | 8 | 9 | 10 | 11 | 12 | 13 | 17

export const SDG_META: Record<SDG, { label: string; color: string }> = {
  1:  { label: 'No Poverty',                        color: '#E5243B' },
  3:  { label: 'Good Health & Well-Being',          color: '#4C9F38' },
  5:  { label: 'Gender Equality',                   color: '#FF3A21' },
  8:  { label: 'Decent Work & Economic Growth',     color: '#A21942' },
  9:  { label: 'Industry, Innovation & Infrastructure', color: '#FD6925' },
  10: { label: 'Reduced Inequalities',              color: '#DD1367' },
  11: { label: 'Sustainable Cities & Communities',  color: '#FD9D24' },
  12: { label: 'Responsible Consumption',           color: '#BF8B2E' },
  13: { label: 'Climate Action',                    color: '#3F7E44' },
  17: { label: 'Partnerships for the Goals',        color: '#19486A' },
}

// ── Pillars ────────────────────────────────────────────────────────────────
export type Pillar =
  | 'research'
  | 'teaching'
  | 'policy'
  | 'capacity-building'
  | 'innovative-solutions'

export const PILLARS: Record<Pillar, { label: string; description: string }> = {
  'research':             { label: 'Research',              description: 'Participatory and academic research co-produced with reclaimers' },
  'teaching':             { label: 'Teaching',              description: 'Integrating reclaimer knowledge into UJ curricula across faculties' },
  'policy':               { label: 'Policy',                description: 'Engaging national and local government on reclaimer rights and integration' },
  'capacity-building':    { label: 'Capacity-Building',     description: 'Building reclaimer skills, knowledge, and organisational capacity' },
  'innovative-solutions': { label: 'Innovative Solutions',  description: 'Technology, design, and enterprise solutions developed with reclaimers' },
}

// ── Base ───────────────────────────────────────────────────────────────────
export interface BaseDocument {
  id: string
  createdAt: string
  updatedAt: string
  published: boolean
}

// ── Programme (Work Package — public-facing name) ──────────────────────────
export interface Programme extends BaseDocument {
  name: string            // Plain English: "Advancing Reclaimer Health & Wellbeing"
  wpReference: string     // Internal: "WP8" — shown only on detail/about views
  wpLeader: string        // Faculty leading the WP
  supportedBy: string[]   // Other faculties involved
  themes: Theme[]
  pillars: Pillar[]
  sdgs: SDG[]
  summary: string         // 2–3 sentences for cards
  body: string            // Full description for detail page (HTML)
  objective: string       // The WP objective verbatim
  startDate: string       // e.g. "August 2024"
  endDate: string         // e.g. "July 2027"
  status: 'active' | 'completed' | 'planned'
  slug: string
}

// ── Project ────────────────────────────────────────────────────────────────
export interface Project extends BaseDocument {
  title: string
  programmeId: string     // links to Programme
  themes: Theme[]
  pillars: Pillar[]
  sdgs: SDG[]
  years: string
  challenge: string
  collaboration: string
  outcome: string
  outputType: OutputType[]
  collaborators: string
  imagePath: string | null
  documentPath: string | null
  relatedPublicationIds: string[]
  videoId: string | null
  slug: string
  featured: boolean
}

export type OutputType =
  | 'Research'
  | 'Training'
  | 'Design'
  | 'Legal'
  | 'Infrastructure'
  | 'Policy'
  | 'Education'
  | 'Advocacy'

// ── Publication ────────────────────────────────────────────────────────────
export interface Publication extends BaseDocument {
  title: string
  authors: string
  year: number
  journal: string
  themes: Theme[]
  openAccess: boolean
  url: string
  documentPath: string | null
  abstract: string
}

// ── News ───────────────────────────────────────────────────────────────────
export interface NewsItem extends BaseDocument {
  title: string
  body: string
  imagePath: string | null
  themes: Theme[]
  slug: string
  excerpt: string
}

// ── Teaching Resource ──────────────────────────────────────────────────────
export interface TeachingResource extends BaseDocument {
  title: string
  description: string
  themes: Theme[]
  documentPath: string
  relatedProjectIds: string[]
}

// ── Team Member ────────────────────────────────────────────────────────────
export interface TeamMember extends BaseDocument {
  name: string
  role: string
  faculty: string
  organisation: 'ARO' | 'UJ' | 'KU Leuven' | 'Other'
  bio: string
  imagePath: string | null
  email: string | null
  order: number
}

// ── Impact Stats ───────────────────────────────────────────────────────────
export interface ImpactStats {
  yearFounded: number
  facultiesInvolved: number
  projectsCompleted: number
  publicationsCount: number
  studentParticipants: number
  reclaimersInvolved: number
  externalFundingRaised: string
  updatedAt: string
}

// ── Site Settings ──────────────────────────────────────────────────────────
export interface SiteSettings {
  heroHeadline: string
  heroSubheading: string
  contactEmail: string
  updatedAt: string
}
