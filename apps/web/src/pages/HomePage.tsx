import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, BookMarked, Link2, Shield, ChevronRight } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import StatCounter from '../components/ui/StatCounter'
import VideoEmbed from '../components/ui/VideoEmbed'
import SiteImage from '../components/ui/SiteImage'
import ThemeBadge from '../components/ui/ThemeBadge'
import {
  useCollection, useImpactStats, useFeaturedProject,
  useSectionToggles, useWorkPackages,
} from '../hooks/useFirestore'

// ── Hardcoded WP fallback data (shown until Shillah edits via CMS) ─────────
const WP_DEFAULTS = [
  { id: 'wp1',  code: 'WP1',  title: 'Multi-Faculty Community Engagement & Coordination',
    summary: 'Overall project management, stakeholder oversight, and coordination of activities across all participating UJ faculties and ARO.',
    leader: 'Humanities', faculties: ['HUM', 'All UJ'], startDate: 'Aug 2024', endDate: 'Jul 2027' },
  { id: 'wp2',  code: 'WP2',  title: 'Strengthening ARO Public Engagement',
    summary: 'Multi-disciplinary research and multi-media interventions to improve resident support for reclaimers and reclaimer-led separation at source.',
    leader: 'Humanities', faculties: ['HUM', 'FADA', 'FoS', 'CBE'], startDate: 'Aug 2024', endDate: 'Jul 2027' },
  { id: 'wp3',  code: 'WP3',  title: 'ARO-UJ Youth Camp',
    summary: 'An annual winter camp providing reclaimers\' children with multi-disciplinary educational activities and access to UJ.',
    leader: 'TBC', faculties: ['FADA', 'HUM'], startDate: 'Feb 2025', endDate: 'Jul 2027' },
  { id: 'wp4',  code: 'WP4',  title: 'Professionalising ARO Warehouse & Service Provision',
    summary: 'Coordinating UJ faculty support to improve ARO Recycling Company\'s warehouse management, logistics, and business operations.',
    leader: 'FEBE', faculties: ['FEBE', 'FADA', 'HUM'], startDate: 'Sep 2024', endDate: 'Jul 2027' },
  { id: 'wp5',  code: 'WP5',  title: 'Landfill Closures & a Just Transition',
    summary: 'Supporting ARO\'s campaign to negotiate social plans and retrenchment packages for reclaimers ahead of Johannesburg landfill closures.',
    leader: 'Humanities', faculties: ['HUM', 'LAW', 'FADA', 'FEBE'], startDate: 'Aug 2024', endDate: 'Jul 2027' },
  { id: 'wp6',  code: 'WP6',  title: 'Alternative Employment for Reclaimers',
    summary: 'Developing new income-generation programmes, cooperatives and companies — including sewing, e-waste recycling, and eco-product design.',
    leader: 'FADA', faculties: ['FADA', 'FEBE'], startDate: 'Aug 2024', endDate: 'Jul 2027' },
  { id: 'wp7',  code: 'WP7',  title: 'Advancing Sustainable Development at UJ',
    summary: 'Integrating reclaimers into UJ\'s waste management system and supporting green procurement policy reform.',
    leader: 'FEBE', faculties: ['FEBE', 'FoS', 'HUM'], startDate: 'Jun 2023', endDate: 'Jul 2025' },
  { id: 'wp8',  code: 'WP8',  title: 'Advancing Reclaimer Health & Wellbeing',
    summary: 'Participatory research and community-led interventions to address health risks, psychosocial wellbeing, and gender equality among reclaimers.',
    leader: 'Humanities', faculties: ['HUM', 'FADA', 'FoHS'], startDate: 'Sep 2024', endDate: 'Jul 2027' },
  { id: 'wp9',  code: 'WP9',  title: 'Justice for Migrant Reclaimers',
    summary: 'Research and advocacy to strengthen ARO\'s support for migrant reclaimers seeking legal status, social protection, and employment rights.',
    leader: 'Law', faculties: ['LAW', 'HUM'], startDate: 'Sep 2024', endDate: 'Jul 2027' },
  { id: 'wp10', code: 'WP10', title: 'Gender Justice & Reclaiming',
    summary: 'Creating spaces for ARO members to engage on gender issues in the sector and developing feminist strategies to promote gender justice.',
    leader: 'Humanities', faculties: ['HUM', 'LAW'], startDate: 'Jan 2025', endDate: 'Jul 2027' },
]

export default function HomePage() {
  const { sections }             = useSectionToggles()
  const { data: statsData }      = useImpactStats()
  const { data: featured, loading: featuredLoading } = useFeaturedProject()
  const { data: projects }       = useCollection<any>('projects', { publishedOnly: true })
  const { data: news }           = useCollection<any>('news',     { publishedOnly: true })
  const { data: wpFromFirestore } = useWorkPackages()

  const stats = statsData ?? {
    yearFounded: 2022, facultiesInvolved: 7, projectsCompleted: 24,
    publicationsCount: 18, studentParticipants: 142, reclaimersInvolved: 380,
  }

  // Merge Firestore WP data over defaults (so the CMS can override title/summary)
  const workPackages = WP_DEFAULTS.map(def => {
    const live = wpFromFirestore.find(w => w.id === def.id)
    return live ? { ...def, ...live } : def
  })

  const show = (key: string) => sections[key] !== false

  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      {show('home_hero') && (
        <PageHero
          imagePath="/images/hero/hero.jpg"
          imageAlt="Reclaimers and academics working together"
          eyebrow="ARO-UJ Reclaiming Praxis Network · Est. 2022"
          title="Where reclaimer knowledge and academic expertise build change together."
          lead="A partnership between the African Reclaimers Organisation (ARO) and the University of Johannesburg (UJ) — working where theory meets the street."
          variant="dark"
          minHeight="88vh"
        />
      )}

      {/* ── IMPACT STATS ─────────────────────────────────────────────── */}
      {show('home_stats') && (
        <section className="bg-white border-b border-border">
          <div className="container py-14">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
              <StatCounter value={stats.yearFounded}         label="Founded" />
              <StatCounter value={stats.facultiesInvolved}   label="UJ faculties" />
              <StatCounter value={stats.projectsCompleted}   label="Projects completed" />
              <StatCounter value={stats.publicationsCount}   label="Publications" />
              <StatCounter value={stats.studentParticipants} label="Student participants" />
              <StatCounter value={stats.reclaimersInvolved}  label="Reclaimers involved" />
            </div>
          </div>
        </section>
      )}

      {/* ── PARTNER IDENTITY STRIP ───────────────────────────────────── */}
      {show('home_partners_strip') && (
        <section className="bg-surface border-b border-border">
          <div className="container py-10">
            <p className="eyebrow text-center mb-8">The partnership behind the network</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

              {/* ARO */}
              <div className="flex gap-5 items-start bg-white rounded-2xl border border-border p-6">
                <img src="/logos/aro-logo.png" alt="African Reclaimers Organisation"
                  className="h-14 w-auto shrink-0 object-contain" />
                <div>
                  <div className="font-display font-bold text-ink text-base mb-1">
                    African Reclaimers Organisation (ARO)
                  </div>
                  <p className="font-body text-xs text-muted leading-relaxed">
                    A mass-based democratic movement of reclaimers founded in Johannesburg.
                    ARO represents reclaimers across South Africa — advocating for their
                    recognition, livelihoods, and rights in the recycling value chain.
                  </p>
                </div>
              </div>

              {/* UJ */}
              <div className="flex gap-5 items-start bg-white rounded-2xl border border-border p-6">
                <img src="/logos/uj-logo.png" alt="University of Johannesburg"
                  className="h-14 w-auto shrink-0 object-contain rounded" />
                <div>
                  <div className="font-display font-bold text-ink text-base mb-1">
                    University of Johannesburg (UJ)
                  </div>
                  <p className="font-body text-xs text-muted leading-relaxed">
                    A comprehensive South African university committed to societal impact.
                    Seven UJ faculties — from Humanities to Engineering — participate in
                    the network, bringing research, teaching, and design expertise.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT INTRO ──────────────────────────────────────────────── */}
      {show('home_about') && (
        <section className="section bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="eyebrow">About the network</p>
                <h2 className="section-heading">A network built on equal partnership.</h2>
                <p className="section-lead mb-6">
                  The ARO-UJ Network brings together the African Reclaimers Organisation
                  and the University of Johannesburg — not a research project on
                  reclaimers, but a collaboration <em>with</em> them.
                </p>
                <p className="text-body text-muted mb-8">
                  The word <em>praxis</em> describes the cycle of reflection and action.
                  Knowledge is applied in the real world. Learning comes back from
                  that application. Both partners are changed by the encounter.
                </p>
                <Link to="/about" className="btn-outline">
                  About the network <ArrowRight size={15} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'National scope',   sub: 'Johannesburg and Mpumalanga',         icon: MapPin },
                  { label: '7 UJ faculties',   sub: 'Interdisciplinary, not departmental', icon: BookMarked },
                  { label: 'Equal partners',   sub: 'ARO and UJ — neither subordinate',    icon: Link2 },
                  { label: 'Funded by UJ',     sub: 'GES 4.0 SI programme',                icon: Shield },
                ].map(({ label, sub, icon: Icon }) => (
                  <div key={label} className="rounded-2xl border border-border p-5">
                    <div className="p-1.5 bg-greenlight rounded-lg w-fit mb-3">
                      <Icon size={24} className="text-forest" />
                    </div>
                    <div className="font-display font-bold text-ink text-h3 mb-1">{label}</div>
                    <div className="font-body text-xs text-muted">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── WORK PACKAGES ────────────────────────────────────────────── */}
      {show('home_workpackages') && (
        <section className="section bg-surface">
          <div className="container">
            <p className="eyebrow">10 work packages</p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <h2 className="section-heading mb-0">
                Praxis in action —<br className="hidden sm:block" /> across the whole network.
              </h2>
              <Link to="/praxis-in-action" className="btn-ghost text-forest shrink-0">
                All projects <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {workPackages.map((wp) => (
                <Link
                  key={wp.id}
                  to={`/praxis-in-action?wp=${wp.id}`}
                  className="group bg-white rounded-2xl border border-border p-5
                             hover:border-forest hover:shadow-sm transition-all duration-200 flex flex-col"
                >
                  {/* Code badge */}
                  <span className="inline-block font-body text-[10px] font-semibold
                                   tracking-widest uppercase text-forest bg-greenlight
                                   px-2.5 py-1 rounded-full w-fit mb-3">
                    {wp.code}
                  </span>

                  {/* Title */}
                  <div className="font-display font-bold text-ink text-base mb-2 leading-snug
                                  group-hover:text-forest transition-colors flex-1">
                    {wp.title}
                  </div>

                  {/* Summary */}
                  <p className="font-body text-xs text-muted leading-relaxed mb-4 line-clamp-3">
                    {wp.summary}
                  </p>

                  {/* Leader + arrow */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                    <span className="font-body text-[10px] text-muted uppercase tracking-wide">
                      Led by {wp.leader}
                    </span>
                    <ChevronRight size={13}
                      className="text-muted group-hover:text-forest transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED STORY ───────────────────────────────────────────── */}
      {show('home_story') && !featuredLoading && featured && (
        <section className="section bg-white">
          <div className="container">
            <p className="eyebrow">Featured story</p>
            <h2 className="section-heading mb-10">From the network</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              <div className="lg:col-span-3">
                {featured.videoId ? (
                  <VideoEmbed videoId={featured.videoId} title={featured.title} />
                ) : (
                  <SiteImage src={featured.imagePath} imageBase64={featured.imageBase64}
                    thumbnailBase64={featured.thumbnailBase64} alt={featured.title}
                    aspectRatio="video" className="rounded-2xl" />
                )}
              </div>
              <div className="lg:col-span-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(featured.themes ?? []).map((t: any) => <ThemeBadge key={t} theme={t} size="sm" />)}
                </div>
                <h3 className="font-display font-bold text-ink text-h2 mb-4 leading-snug">
                  {featured.title}
                </h3>
                <p className="text-body text-muted mb-6">{featured.challenge}</p>
                {featured.outcome && (
                  <blockquote className="border-l-2 border-forest pl-5 mb-6">
                    <p className="font-display italic text-ink text-small leading-relaxed">
                      "{featured.outcome}"
                    </p>
                  </blockquote>
                )}
                <Link to={`/praxis-in-action/${featured.slug}`} className="btn-primary">
                  Read the full story <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── RECLAIMER QUOTE ──────────────────────────────────────────── */}
      {show('home_quote') && (
        <section className="bg-forest py-20">
          <div className="container max-w-3xl text-center">
            <blockquote>
              <p className="font-display font-light text-white italic mb-6"
                 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', lineHeight: 1.5 }}>
                "Before, in December you could not breathe inside. Now my children
                ask me to take them to see where I work — they are proud of it."
              </p>
              <cite className="font-body text-small text-white/60 not-italic">
                Mantoa K., ARO member, Selby sorting depot
              </cite>
            </blockquote>
          </div>
        </section>
      )}

      {/* ── RECENT PROJECTS ──────────────────────────────────────────── */}
      {show('home_projects') && projects.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow">Portfolio</p>
                <h2 className="section-heading mb-0">Recent projects</h2>
              </div>
              <Link to="/praxis-in-action" className="btn-ghost text-forest hidden sm:flex">
                All projects <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project: any) => (
                <Link key={project.id} to={`/praxis-in-action/${project.slug}`} className="card group block">
                  <SiteImage src={project.imagePath} imageBase64={project.imageBase64}
                    thumbnailBase64={project.thumbnailBase64} alt={project.title} aspectRatio="video" />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(project.themes ?? []).slice(0, 2).map((t: any) => <ThemeBadge key={t} theme={t} size="sm" />)}
                    </div>
                    <h3 className="font-display font-bold text-ink text-small mb-2 leading-snug
                                   group-hover:text-forest transition-colors">
                      {project.title}
                    </h3>
                    <p className="font-body text-xs text-muted leading-relaxed mb-3">{project.outcome}</p>
                    <div className="font-body text-xs text-muted pt-3 border-t border-border">
                      {project.years} · {(project.outputType ?? []).join(', ')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWS ─────────────────────────────────────────────────────── */}
      {show('home_news') && news.length > 0 && (
        <section className="section bg-surface">
          <div className="container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow">Latest</p>
                <h2 className="section-heading mb-0">News & Updates</h2>
              </div>
              <Link to="/news" className="btn-ghost text-forest hidden sm:flex">
                All news <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item: any) => (
                <Link key={item.id} to={`/news/${item.slug}`} className="card group block">
                  <SiteImage src={item.imagePath} imageBase64={item.imageBase64}
                    thumbnailBase64={item.thumbnailBase64} alt={item.title} aspectRatio="video" />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(item.themes ?? []).slice(0, 1).map((t: any) => <ThemeBadge key={t} theme={t} size="sm" />)}
                    </div>
                    <h3 className="font-display font-bold text-ink text-small mb-2 leading-snug
                                   group-hover:text-forest transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-body text-xs text-muted leading-relaxed">{item.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── JOIN CTA ─────────────────────────────────────────────────── */}
      {show('home_join') && (
        <section className="section bg-white border-t border-border">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <p className="eyebrow">Grow the network</p>
              <h2 className="section-heading">Join us in building change.</h2>
              <p className="section-lead mx-auto mb-10">
                We welcome UJ colleagues from all faculties, international university
                partners, and reclaimers' organisations who want to participate.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/join" className="btn-join">Join the network <ArrowRight size={15} /></Link>
                <Link to="/about" className="btn-outline">Learn more</Link>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
