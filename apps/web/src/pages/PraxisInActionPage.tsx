import PageHero from '../components/ui/PageHero'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, ChevronDown, ChevronUp, Flag, PenLine, MapPin, RotateCcw, BookOpen, Users, Lightbulb, Scale } from 'lucide-react'
import ThemeBadge from '../components/ui/ThemeBadge'
import SiteImage from '../components/ui/SiteImage'
import { useCollection, useSectionToggles, useWorkPackages } from '../hooks/useFirestore'

// ── Praxis cycle ───────────────────────────────────────────────────────────
const PRAXIS_STEPS = [
  { step: '01', icon: Flag,      heading: 'A real challenge',      body: 'Every project begins with a challenge identified by ARO members — not a research question invented in a seminar room.' },
  { step: '02', icon: PenLine,   heading: 'Joint design',          body: 'ARO and UJ participants design the response together. The method, timeline, and measures of success are all negotiated.' },
  { step: '03', icon: MapPin,    heading: 'Action in community',   body: 'Students, researchers, and reclaimers work together in the actual places where reclaimers live and work.' },
  { step: '04', icon: RotateCcw, heading: 'Reflection & learning', body: "What happened? What changed? What do we know now that we didn't? Both partners reflect — and that feeds the next project." },
]

// ── Five pillars of the approach ───────────────────────────────────────────
const APPROACH_PILLARS = [
  { icon: BookOpen,  heading: 'Research',               body: 'Participatory and applied research co-designed with ARO. Questions come from reclaimers\' lived experience, not academic agendas.' },
  { icon: Users,     heading: 'Teaching',               body: 'Students across seven faculties complete practicum placements embedded in real network projects — learning through action.' },
  { icon: Scale,     heading: 'Policy',                 body: 'Direct engagement with national and Gauteng government — translating network research into briefs, submissions, and advocacy.' },
  { icon: Lightbulb, heading: 'Capacity-building',      body: 'Training, toolkits, and organisational development for ARO and its members — building the capacity to sustain the struggle.' },
  { icon: Flag,      heading: 'Innovative solutions',   body: 'Design, engineering, technology, and legal innovation applied to real challenges identified by reclaimers.' },
]

// ── WP fallback data (mirrors HomePage defaults) ───────────────────────────
const WP_DEFAULTS = [
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

  // Merge live WP data over defaults
  const workPackages = WP_DEFAULTS.map(def => {
    const live = wpFromFirestore.find((w: any) => w.id === def.id)
    return live ? { ...def, ...live } : def
  })

  // URL-driven tab: 'approach' | 'projects'
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = (searchParams.get('tab') as 'approach' | 'projects') ?? 'projects'
  const activeWp = searchParams.get('wp')

  function setTab(t: 'approach' | 'projects') {
    setSearchParams(prev => { prev.set('tab', t); prev.delete('wp'); return prev })
  }

  // Expand/collapse state for WP cards in projects tab
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
        imageAlt="Network members working alongside reclaimers"
        eyebrow="The work of the network"
        title="Praxis in Action"
        lead="Knowledge applied in the real world, and learning that comes back from that application. Work done with reclaimers — not about them."
        variant="dark"
      />

      {/* ── TAB BAR ───────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-border">
        <div className="container">
          <div className="flex gap-0">
            {([
              { key: 'projects',  label: 'Our Projects' },
              { key: 'approach',  label: 'Our Approach' },
            ] as { key: 'approach' | 'projects'; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`font-body text-sm font-medium px-6 py-4 border-b-2 transition-colors ${
                  tab === key
                    ? 'border-forest text-forest'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: OUR PROJECTS                                             */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {tab === 'projects' && (
        <section className="section bg-surface">
          <div className="container">
            <p className="eyebrow">10 work packages</p>
            <h2 className="section-heading">All network projects</h2>
            <p className="text-body text-muted max-w-2xl mb-10">
              Each work package is a sustained area of work led by a UJ faculty in
              partnership with ARO. Click any work package to see its projects and details.
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
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: OUR APPROACH                                             */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {tab === 'approach' && (
        <div>
          {/* Praxis cycle */}
          {sections.praxis_cycle !== false && (
            <section className="section-sm bg-surface">
              <div className="container">
                <p className="eyebrow">How it works</p>
                <h2 className="section-heading">The praxis cycle</h2>
                <p className="text-body text-muted max-w-2xl mb-10">
                  Every project in the network follows the same cycle — a discipline of
                  action and reflection that keeps knowledge grounded in real experience.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PRAXIS_STEPS.map(({ step, heading, body, icon: Icon }) => (
                    <div key={step} className="bg-white rounded-2xl border border-border p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-greenlight rounded-lg">
                          <Icon size={24} className="text-forest" />
                        </div>
                        <span className="font-body text-xs font-semibold text-forest/40 tracking-widest">{step}</span>
                      </div>
                      <h3 className="font-display font-bold text-ink text-h3 mb-2">{heading}</h3>
                      <p className="font-body text-sm text-muted leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Five pillars */}
          <section className="section bg-white">
            <div className="container">
              <p className="eyebrow">Five pillars</p>
              <h2 className="section-heading">How we work across disciplines</h2>
              <p className="text-body text-muted max-w-2xl mb-10">
                The network's approach is holistic — every project contributes to
                at least two of these five pillars simultaneously, ensuring that
                individual activities strengthen the broader network.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {APPROACH_PILLARS.map(({ icon: Icon, heading, body }) => (
                  <div key={heading}
                    className="bg-white rounded-2xl border border-border p-6 hover:border-forest transition-colors group">
                    <div className="p-2 bg-greenlight rounded-lg w-fit mb-4 group-hover:bg-forest transition-colors">
                      <Icon size={24} className="text-forest group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-display font-bold text-ink text-large mb-2">{heading}</h3>
                    <p className="font-body text-sm text-muted leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Decolonising note */}
          <section className="section-sm bg-surface border-t border-border">
            <div className="container max-w-3xl">
              <p className="eyebrow">Decolonising praxis</p>
              <h2 className="section-heading">Leadership from reclaimers</h2>
              <div className="space-y-5 text-body text-muted">
                <p>
                  The network adopts a decolonising approach that runs through all five
                  pillars. Projects are led by the needs and knowledge of reclaimers —
                  not shaped by academic agendas, funder priorities, or institutional
                  prestige. This means that reclaimers give guest lectures, sit on
                  research steering committees, co-author publications, and evaluate
                  the work of students placed with them.
                </p>
                <p>
                  Every project must involve a multi-disciplinary team from at least
                  two faculties, must redress inequities based on gender, nationality,
                  and race, and must produce both a public engagement output and a
                  peer-reviewed publication. These are not aspirational commitments —
                  they are operational criteria.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="section bg-white border-t border-border">
        <div className="container text-center max-w-xl">
          <p className="eyebrow">Get involved</p>
          <h2 className="section-heading">Bring your expertise to the network</h2>
          <p className="section-lead mx-auto mb-10">
            Every faculty and every discipline has something to contribute.
            If you see a connection between your work and the challenges
            reclaimers face, that connection is where your project begins.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/join" className="btn-join">Join the Network <ArrowRight size={15} /></Link>
            <Link to="/student-practicum" className="btn-outline">Student Practicum</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
