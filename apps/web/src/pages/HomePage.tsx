import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, BookMarked, Link2, Shield, Heart, Scale, Leaf, BookOpen, Briefcase } from 'lucide-react'
import { THEMES, Theme } from '@arouj/types'
import PageHero from '../components/ui/PageHero'
import StatCounter from '../components/ui/StatCounter'
import ThemeBadge from '../components/ui/ThemeBadge'
import VideoEmbed from '../components/ui/VideoEmbed'
import SiteImage from '../components/ui/SiteImage'
import {
  useCollection, useImpactStats, useFeaturedProject, useSectionToggles
} from '../hooks/useFirestore'

// ── Image: apps/web/public/images/hero/hero.jpg ───────────────────────────

const THEME_CARDS: { theme: Theme; description: string; icon: React.ElementType }[] = [
  { theme: 'health-wellbeing',    description: 'Safety, healthcare, ECD, and reclaimer wellbeing',    icon: Heart },
  { theme: 'rights-justice',      description: 'Legal support, EPR advocacy, SAWPRS, and policy',     icon: Scale },
  { theme: 'design-environment',  description: 'Sorting facilities, waste systems, and solar design',  icon: Leaf },
  { theme: 'knowledge-education', description: 'Research, training, and teaching resources',           icon: BookOpen },
  { theme: 'economic-justice',    description: 'Payment systems, market access, buy-back advocacy',    icon: Briefcase },
]

export default function HomePage() {
  const { sections }              = useSectionToggles()
  const { data: statsData }       = useImpactStats()
  const { data: featured, loading: featuredLoading } = useFeaturedProject()
  const { data: projects }        = useCollection<any>('projects', { publishedOnly: true })
  const { data: news }            = useCollection<any>('news',     { publishedOnly: true })

  const stats = statsData ?? {
    yearFounded: 2022, facultiesInvolved: 7, projectsCompleted: 24,
    publicationsCount: 18, studentParticipants: 142, reclaimersInvolved: 380,
  }

  // show = key is missing (default visible) OR explicitly true
  const show = (key: string) => sections[key] !== false

  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      {show('home_hero') && (
        <PageHero
          imagePath="/images/hero/hero.jpg"
          imageAlt="Reclaimers at work in Johannesburg"
          eyebrow="ARO-UJ Praxis Network · Est. 2022"
          title="Where reclaimer knowledge and academic expertise build change together."
          lead="A partnership between the African Reclaimers Organisation and the University of Johannesburg — working where theory meets the street."
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

      {/* ── ABOUT INTRO ──────────────────────────────────────────────── */}
      {show('home_about') && (
        <section className="section bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="eyebrow">About the network</p>
                <h2 className="section-heading">A network built on equal partnership.</h2>
                <p className="section-lead mb-6">
                  ARO-UJ Praxis brings together the African Reclaimers Organisation
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
                  { label: 'National scope',   sub: 'Johannesburg and Mpumalanga',      icon: MapPin },
                  { label: '7 UJ faculties',   sub: 'Interdisciplinary, not departmental', icon: BookMarked },
                  { label: 'Equal partners',   sub: 'ARO and UJ — neither subordinate', icon: Link2 },
                  { label: 'Funded by UJ',     sub: 'GES 4.0 SI programme',             icon: Shield },
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

      {/* ── FIVE THEMES ──────────────────────────────────────────────── */}
      {show('home_themes') && (
        <section className="section bg-surface">
          <div className="container">
            <p className="eyebrow">Five themes</p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <h2 className="section-heading mb-0">Interdisciplinary.<br />Community-led.</h2>
              <Link to="/praxis-in-action" className="btn-ghost text-forest shrink-0">
                See all projects <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {THEME_CARDS.map(({ theme, description, icon: Icon }) => {
                const t = THEMES[theme]
                return (
                  <Link key={theme} to={`/praxis-in-action?theme=${theme}`}
                    className="group bg-white rounded-2xl border border-border p-6
                               hover:border-forest hover:shadow-sm transition-all duration-200">
                    <div className="p-2 bg-greenlight rounded-lg w-fit mb-4
                                    group-hover:bg-forest transition-colors duration-200">
                      <Icon size={24} className="text-forest group-hover:text-white transition-colors duration-200" />
                    </div>
                    <div className="font-display font-bold text-ink text-lg mb-2 leading-snug">
                      {t.label}
                    </div>
                    <p className="font-body text-sm text-muted leading-relaxed">{description}</p>
                    <div className="mt-5 text-xs font-body font-medium text-forest
                                    flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View projects <ArrowRight size={11} />
                    </div>
                  </Link>
                )
              })}
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
                  <SiteImage src={featured.imagePath} imageBase64={featured.imageBase64} thumbnailBase64={featured.thumbnailBase64}         alt={featured.title}
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
                  <SiteImage src={project.imagePath} imageBase64={project.imageBase64} thumbnailBase64={project.thumbnailBase64} alt={project.title} aspectRatio="video" />
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
                  <SiteImage src={item.imagePath} imageBase64={item.imageBase64} thumbnailBase64={item.thumbnailBase64} alt={item.title} aspectRatio="video" />
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