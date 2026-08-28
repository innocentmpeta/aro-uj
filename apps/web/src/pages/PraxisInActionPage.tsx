import PageHero from '../components/ui/PageHero'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react'
import ThemeBadge from '../components/ui/ThemeBadge'
import SiteImage from '../components/ui/SiteImage'
import VideoEmbed from '../components/ui/VideoEmbed'
import { useCollection, useSectionToggles, useWorkPackages, usePageContent, WorkPackage } from '../hooks/useFirestore'

// Default text blocks — Firestore siteConfig/projectsPage values override these when set
const DEFAULTS: Record<string, string> = {
  hero_title: 'Projects',
  hero_lead: 'Knowledge applied in the real world, and learning that comes back from that application. Work done with reclaimers — not about them.',
  intro_text: 'Each work package is a sustained area of work led by a UJ faculty in partnership with ARO. Click any work package to see its projects and details.',
}

function useTxt(content: Record<string, string> | null, key: string): string {
  return (content && content[key]) ? content[key] : DEFAULTS[key] ?? ''
}

// ── WP fallback data (mirrors HomePage defaults) ───────────────────────────
const WP_DEFAULTS: Omit<WorkPackage, 'published'>[] = [
  { id: 'wp1',  code: 'WP1',  title: 'Multi-Faculty Community Engagement & Coordination',       leader: 'Humanities', faculties: ['HUM', 'All UJ'],           startDate: 'Aug 2024', endDate: 'Jul 2027', summary: 'Overall project management, stakeholder oversight, and coordination of activities across all participating UJ faculties and ARO.' },
  { id: 'wp2',  code: 'WP2',  title: 'Strengthening ARO Public Engagement',                     leader: 'Humanities', faculties: ['HUM', 'FADA', 'FoS', 'CBE'], startDate: 'Aug 2024', endDate: 'Jul 2027', summary: 'Multi-disciplinary research and multi-media interventions to improve resident support for reclaimers and reclaimer-led separation at source.' },
  { id: 'wp3',  code: 'WP3',  title: 'ARO-UJ Youth Camp',                                      leader: 'TBC',        faculties: ['FADA', 'HUM'],              startDate: 'Feb 2025', endDate: 'Jul 2027', summary: 'An annual winter camp providing reclaimers\' children with multi-disciplinary educational activities and access to UJ.' },
  { id: 'wp4',  code: 'WP4',  title: 'Professionalising ARO Warehouse & Service Provision',    leader: 'FEBE',       faculties: ['FEBE', 'FADA', 'HUM'],      startDate: 'Sep 2024', endDate: 'Jul 2027', summary: 'Coordinating UJ faculty support to improve ARO Recycling Company\'s warehouse management, logistics, and business operations.' },
  { id: 'wp5',  code: 'WP5',  title: 'Landfill Closures & a Just Transition',                  leader: 'Humanities', faculties: ['HUM', 'LAW', 'FADA', 'FEBE'], startDate: 'Aug 2024', endDate: 'Jul 2027', summary: 'Supporting ARO\'s campaign to negotiate social plans and retrenchment packages for reclaimers ahead of Johannesburg landfill closures.' },
  { id: 'wp6',  code: 'WP6',  title: 'Alternative Employment for Reclaimers',                  leader: 'FADA',       faculties: ['FADA', 'FEBE'],             startDate: 'Aug 2024', endDate: 'Jul 2027', summary: 'Developing new income-generation programmes, cooperatives, and companies — including sewing, e-waste recycling, and eco-product design.' },
  { id: 'wp7',  code: 'WP7',  title: 'Advancing Sustainable Development at UJ',                leader: 'FEBE',       faculties: ['FEBE', 'FoS', 'HUM'],       startDate: 'Jun 2023', endDate: 'Jul 2025', summary: 'Integrating reclaimers into UJ\'s waste management system and supporting green procurement policy reform.' },
  { id: 'wp8',  code: 'WP8',  title: 'Advancing Reclaimer Health & Wellbeing',                 leader: 'Humanities', faculties: ['HUM', 'FADA', 'FoHS'],      startDate: 'Sep 2024', endDate: 'Jul 2027', summary: 'Participatory research and community-led interventions to address health risks, psychosocial wellbeing, and gender equality among reclaimers.' },
  { id: 'wp9',  code: 'WP9',  title: 'Justice for Migrant Reclaimers',                         leader: 'Law',        faculties: ['LAW', 'HUM'],               startDate: 'Sep 2024', endDate: 'Jul 2027', summary: 'Research and advocacy to strengthen ARO\'s support for migrant reclaimers seeking legal status, social protection, and employment rights.' },
  { id: 'wp10', code: 'WP10', title: 'Gender Justice & Reclaiming',                            leader: 'Humanities', faculties: ['HUM', 'LAW'],               startDate: 'Jan 2025', endDate: 'Jul 2027', summary: 'Creating spaces for ARO members to engage on gender issues in the sector and developing feminist strategies to promote gender justice.' },
]

export default function PraxisInActionPage() {
  const { sections } = useSectionToggles()
  const { data: projects, loading: loadingProj } = useCollection<any>('projects', { publishedOnly: true })
  const { data: wpFromFirestore } = useWorkPackages()
  const { data: pageContent } = usePageContent('projectsPage')
  const txt = (key: string) => useTxt(pageContent, key)

  // Merge live WP data over defaults
  const workPackages = WP_DEFAULTS.map(def => {
    const live = wpFromFirestore.find((w: any) => w.id === def.id)
    return live ? { ...def, ...live } : def
  })

  const [searchParams] = useSearchParams()
  const activeWp = searchParams.get('wp')

  // Expand/collapse state for WP cards
  const [expandedWp, setExpandedWp] = useState<string | null>(activeWp)

  function toggleWp(id: string) {
    setExpandedWp(prev => prev === id ? null : id)
  }

  function getProjectsForWp(wpId: string) {
    return projects.filter((p: any) => p.programmeId === wpId)
  }

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <PageHero
        imagePath="/images/praxis/hero.jpg"
        imageUrl={pageContent?.heroImage}
        imageAlt="Network members working alongside reclaimers"
        eyebrow="The work of the network"
        title={txt('hero_title')}
        lead={txt('hero_lead')}
        variant="dark"
      />

      {/* ── PROJECTS ──────────────────────────────────────────────── */}
      <section className="section bg-surface">
        <div className="container">
          <p className="section-eyebrow">10 work packages</p>
          <h2 className="section-heading">All network projects</h2>
          <p className="text-body text-muted max-w-2xl mb-10">
            {txt('intro_text')}
          </p>

          <div className="space-y-3">
              {workPackages.map(wp => {
                const wpProjects = getProjectsForWp(wp.id)
                const isExpanded = expandedWp === wp.id
                const sectionVisible = sections[`prog_${wp.id}`] !== false

                if (!sectionVisible) return null

                return (
                  <div key={wp.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden
                      ${isExpanded ? 'border-forest shadow-sm' : 'border-border hover:border-forest/40'}`}
                  >
                    {/* ── WP header — always visible, click to expand ── */}
                    <button
                      onClick={() => toggleWp(wp.id)}
                      className="w-full text-left px-6 py-5 flex items-center gap-4"
                    >
                      {/* Code badge */}
                      <span className={`font-body text-[10px] font-bold tracking-widest uppercase
                        px-2.5 py-1 rounded-full shrink-0 w-12 text-center transition-colors
                        ${isExpanded ? 'bg-forest text-white' : 'bg-greenlight text-forest'}`}>
                        {wp.code}
                      </span>

                      {/* Title + leader */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className={`font-display font-bold text-base leading-snug transition-colors
                          ${isExpanded ? 'text-forest' : 'text-ink'}`}>
                          {wp.title}
                        </div>
                        <div className="font-body text-xs text-muted mt-0.5">
                          Led by {wp.leader}
                          {wpProjects.length > 0 && (
                            <span className="ml-2 text-forest font-medium">
                              · {wpProjects.length} project{wpProjects.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Faculty tags — hide on small screens */}
                      <div className="hidden md:flex flex-wrap gap-1.5 shrink-0 max-w-[200px]">
                        {(wp.faculties ?? []).slice(0, 3).map((f: string) => (
                          <span key={f} className="font-body text-[10px] text-muted bg-surface
                            border border-border px-2 py-0.5 rounded-full">
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* Chevron */}
                      <div className="text-muted shrink-0">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {/* ── Expanded body ─────────────────────────────── */}
                    {isExpanded && (
                      <div className="border-t border-border">

                        {/* WP summary + dates */}
                        <div className="px-6 py-5 bg-surface/50">
                          <p className="font-body text-sm text-muted leading-relaxed mb-3">
                            {wp.summary}
                          </p>
                          <div className="flex flex-wrap gap-4 font-body text-xs text-muted">
                            <span>{wp.startDate} – {wp.endDate}</span>
                            <span>·</span>
                            <span>Faculties: {(wp.faculties ?? []).join(', ')}</span>
                          </div>
                        </div>

                        {/* Video */}
                        {wp.videoId && (
                          <div className="px-6 py-5 border-t border-border">
                            <p className="font-body text-xs font-semibold text-ink uppercase
                              tracking-widest mb-4">
                              Video
                            </p>
                            <div className="max-w-xl">
                              <VideoEmbed videoId={wp.videoId} title={wp.title} />
                            </div>
                          </div>
                        )}

                        {/* Photos */}
                        {(wp.photos ?? []).length > 0 && (
                          <div className="px-6 py-5 border-t border-border">
                            <p className="font-body text-xs font-semibold text-ink uppercase
                              tracking-widest mb-4">
                              Photos
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                              {wp.photos!.map((src: string, i: number) => (
                                <SiteImage key={i} src={src} alt={`${wp.title} — photo ${i + 1}`}
                                  aspectRatio="video" className="rounded-xl" />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Documents */}
                        {(wp.documents ?? []).length > 0 && (
                          <div className="px-6 py-5 border-t border-border">
                            <p className="font-body text-xs font-semibold text-ink uppercase
                              tracking-widest mb-4">
                              Documents
                            </p>
                            <div className="space-y-2">
                              {wp.documents!.map((doc, i: number) => (
                                <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-3 rounded-xl border border-border
                                    hover:border-forest transition-colors group">
                                  <FileText size={16} className="text-forest shrink-0" />
                                  <span className="font-body text-small text-ink flex-1">{doc.label}</span>
                                  <ExternalLink size={13} className="text-muted group-hover:text-forest transition-colors shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Projects under this WP */}
                        {wpProjects.length > 0 ? (
                          <div className="px-6 py-5">
                            <p className="font-body text-xs font-semibold text-ink uppercase
                              tracking-widest mb-4">
                              Projects in this work package
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {wpProjects.filter((p: any) => p.slug).map((project: any) => (
                                <Link
                                  key={project.id}
                                  to={`/praxis-in-action/${project.slug}`}
                                  className="group bg-white rounded-xl border border-border
                                    hover:border-forest hover:shadow-sm transition-all overflow-hidden"
                                >
                                  <SiteImage
                                    src={project.imagePath}
                                    imageBase64={project.imageBase64}
                                    thumbnailBase64={project.thumbnailBase64}
                                    alt={project.title}
                                    aspectRatio="video"
                                  />
                                  <div className="p-4">
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {(project.themes ?? []).slice(0, 2).map((t: any) => (
                                        <ThemeBadge key={t} theme={t} size="sm" />
                                      ))}
                                    </div>
                                    <h4 className="font-display font-bold text-ink text-sm
                                      leading-snug mb-1.5 group-hover:text-forest transition-colors">
                                      {project.title}
                                    </h4>
                                    <p className="font-body text-xs text-muted leading-relaxed
                                      line-clamp-2 mb-3">
                                      {project.outcome}
                                    </p>
                                    <div className="flex items-center justify-between pt-3
                                      border-t border-border">
                                      <span className="font-body text-xs text-muted">{project.years}</span>
                                      <span className="font-body text-xs text-forest flex items-center
                                        gap-1 group-hover:gap-2 transition-all">
                                        Read more <ArrowRight size={11} />
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="px-6 py-5">
                            <div className="rounded-xl border border-dashed border-border p-5">
                              <p className="font-body text-xs text-muted">
                                Projects under this work package will appear here as they are added
                                via the CMS.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="section bg-white border-t border-border">
        <div className="container text-center max-w-xl">
          <p className="section-eyebrow">Get involved</p>
          <h2 className="section-heading">Explore our approach</h2>
          <p className="section-lead mx-auto mb-10">
            Curious how the network turns partnership into practice? See the
            praxis cycle and the five pillars that guide every project.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/approach" className="btn-join">Our Approach <ArrowRight size={15} /></Link>
            <Link to="/student-practicum" className="btn-outline">Student research</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
