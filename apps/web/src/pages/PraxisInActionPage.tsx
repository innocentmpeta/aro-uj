import PageHero from '../components/ui/PageHero'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Grid2X2, List, Flag, PenLine, MapPin, RotateCcw } from 'lucide-react'
import { THEMES, Theme } from '@arouj/types'
import ThemeBadge from '../components/ui/ThemeBadge'
import { SDGStrip } from '../components/ui/SDGBadge'
import SiteImage from '../components/ui/SiteImage'
import ProgrammeCard from '../components/ui/ProgrammeCard'
import { useCollection, useSectionToggles } from '../hooks/useFirestore'

const ALL_THEMES: Theme[] = [
  'health-wellbeing',
  'rights-justice',
  'design-environment',
  'knowledge-education',
  'economic-justice',
]

// ── Praxis cycle explainer ─────────────────────────────────────────────────
const PRAXIS_STEPS = [
  { step: '01', icon: Flag,      heading: 'A real challenge',    body: 'Every project begins with a challenge identified by ARO members — not a research question invented in a seminar room.' },
  { step: '02', icon: PenLine,   heading: 'Joint design',        body: 'ARO and UJ participants design the response together. The method, timeline, and measures of success are all negotiated.' },
  { step: '03', icon: MapPin,    heading: 'Action in community', body: 'Students, researchers, and reclaimers work together in the actual places where reclaimers live and work.' },
  { step: '04', icon: RotateCcw, heading: 'Reflection & learning', body: "What happened? What changed? What do we know now that we didn't? Both partners reflect — and that feeds the next project." },
]

export default function PraxisInActionPage() {
  const { sections } = useSectionToggles()
  const { data: programmes, loading: loadingProg } = useCollection<any>('programmes', { publishedOnly: false })
  const { data: projects,   loading: loadingProj } = useCollection<any>('projects',   { publishedOnly: true  })

  // Aliases kept for JSX compatibility
  const MOCK_PROGRAMMES = programmes
  const MOCK_PROJECTS   = projects

  // Helper functions using live data
  // Programme is visible if:
  // 1. It's not explicitly toggled off in siteConfig/programmeSections
  // 2. It has at least one published project (automatic rule)
  const programmeSections = sections  // reuse siteConfig/sections for programme keys

  const isProgrammeVisible = (prog: any) => {
    const key = `prog_${prog.id}`
    const toggled = programmeSections[key] !== false
    const hasProjects = projects.some((p: any) => p.programmeId === prog.id)
    return toggled && hasProjects
  }

  const getProgrammesByTheme = (theme: string) =>
    programmes.filter((p: any) => p.themes?.includes(theme) && isProgrammeVisible(p))
  const getProjectsByProgramme = (programmeId: string) =>
    projects.filter((p: any) => p.programmeId === programmeId)

  const [searchParams, setSearchParams] = useSearchParams()
  const view        = (searchParams.get('view') as 'themes' | 'programmes') ?? 'themes'
  const activeTheme = searchParams.get('theme') as Theme | null

  function setView(v: 'themes' | 'programmes') {
    setSearchParams(prev => { prev.set('view', v); prev.delete('theme'); return prev })
  }
  function setTheme(t: Theme | null) {
    setSearchParams(prev => {
      prev.set('view', 'themes')
      if (t) prev.set('theme', t); else prev.delete('theme')
      return prev
    })
  }

  // Themes view data
  const themesToShow = activeTheme ? [activeTheme] : ALL_THEMES

  return (
    <div className="bg-white">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <PageHero
        imagePath="/images/praxis/hero.jpg"
        imageAlt="Network members working alongside reclaimers"
        eyebrow="The work of the network"
        title="Praxis in Action"
        lead="Knowledge applied in the real world, and learning that comes back from that application. Work done with reclaimers — not about them."
        variant="dark"
      />

      {/* ── PRAXIS CYCLE ────────────────────────────────────────────── */}
      {sections.praxis_cycle !== false && (
      <section className="section-sm bg-surface">
        <div className="container">
          <p className="eyebrow mb-6">How it works</p>
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
                <p className="font-body text-large text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── VIEW TOGGLE + FILTERS ────────────────────────────────────── */}
      <section className="sticky top-16 z-30 bg-white border-b border-border">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-surface rounded-xl p-1 w-fit shrink-0">
              <button
                onClick={() => setView('themes')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-xs
                  font-medium transition-colors ${
                  view === 'themes'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Grid2X2 size={13} /> By Theme
              </button>
              <button
                onClick={() => setView('programmes')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-xs
                  font-medium transition-colors ${
                  view === 'programmes'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <List size={13} /> By Programme
              </button>
            </div>

            {/* Theme filter — only in themes view */}
            {view === 'themes' && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTheme(null)}
                  className={`font-body text-xs px-4 py-1.5 rounded-full border transition-colors ${
                    !activeTheme
                      ? 'bg-forest text-white border-forest'
                      : 'border-border text-muted hover:border-forest hover:text-forest'
                  }`}
                >
                  All themes
                </button>
                {ALL_THEMES.map(theme => (
                  <button
                    key={theme}
                    onClick={() => setTheme(theme === activeTheme ? null : theme)}
                    className={`font-body text-xs px-4 py-1.5 rounded-full border transition-colors ${
                      activeTheme === theme
                        ? 'bg-forest text-white border-forest'
                        : 'border-border text-muted hover:border-forest hover:text-forest'
                    }`}
                  >
                    {THEMES[theme].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* VIEW A — THEMES → PROGRAMMES → PROJECTS                       */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {view === 'themes' && (
        <section className="section bg-surface">
          <div className="container">
            <div className="space-y-16">
              {themesToShow.map(theme => {
                const programmes = getProgrammesByTheme(theme)
                if (programmes.length === 0) return null
                const t = THEMES[theme]

                return (
                  <div key={theme}>
                    {/* Theme heading */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                      <h2 className="font-display font-bold text-ink text-h2"
                          style={{ color: t.color }}>
                        {t.label}
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="font-body text-xs text-muted shrink-0">
                        {programmes.length} programme{programmes.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Programmes within this theme */}
                    <div className="space-y-6">
                      {programmes.map(programme => {
                        const projects = getProjectsByProgramme(programme.id)
                        return (
                          <div key={programme.id}>
                            {/* Programme header row */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="font-display font-bold text-ink text-h3">
                                    {programme.name}
                                  </h3>
                                  <span className="font-body text-[10px] text-muted bg-white
                                                   border border-border px-2 py-0.5 rounded-full">
                                    {programme.wpReference}
                                  </span>
                                  <span className={`font-body text-[10px] font-semibold uppercase
                                    tracking-wide px-2 py-0.5 rounded-full ${
                                    programme.status === 'active'
                                      ? 'bg-greenlight text-forest'
                                      : 'bg-surface text-muted'
                                  }`}>
                                    {programme.status}
                                  </span>
                                </div>
                                <p className="font-body text-small text-muted max-w-2xl">
                                  {programme.summary}
                                </p>
                                <div className="flex items-center gap-3 mt-2 font-body text-xs text-muted">
                                  <span>Led by {programme.wpLeader}</span>
                                  <span>·</span>
                                  <span>{programme.startDate} – {programme.endDate}</span>
                                </div>
                                {programme.sdgs.length > 0 && (
                                  <div className="mt-2">
                                    <SDGStrip sdgs={programme.sdgs} size="sm" max={8} />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Project cards — 3 columns */}
                            {projects.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projects.filter((p: any) => p.slug).map(project => (
                                  <Link
                                    key={project.id}
                                    to={`/praxis-in-action/${project.slug}`}
                                    className="group card bg-white"
                                  >
                                    <SiteImage
                                      src={project.imagePath} imageBase64={project.imageBase64} thumbnailBase64={project.thumbnailBase64}
                                      alt={project.title}
                                      aspectRatio="video"
                                    />
                                    <div className="p-5">
                                      <h4 className="font-display font-bold text-ink text-small
                                                     mb-2 leading-snug group-hover:text-forest
                                                     transition-colors">
                                        {project.title}
                                      </h4>
                                      <p className="font-body text-xs text-muted leading-relaxed mb-3
                                                    line-clamp-2">
                                        <span className="font-medium text-ink">Outcome: </span>
                                        {project.outcome}
                                      </p>
                                      <div className="flex items-center justify-between pt-3 border-t border-border">
                                        <span className="font-body text-xs text-muted">{project.years}</span>
                                        <span className="font-body text-xs text-forest flex items-center gap-1
                                                         group-hover:gap-2 transition-all">
                                          Read more <ArrowRight size={11} />
                                        </span>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-white rounded-2xl border border-dashed border-border p-6">
                                <p className="font-body text-xs text-muted">
                                  Projects under this programme will appear here as they are added.
                                </p>
                              </div>
                            )}

                            {/* Divider between programmes within same theme */}
                            <div className="mt-8 border-b border-border/50" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* VIEW B — ALL PROGRAMMES LIST                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {view === 'programmes' && (
        <section className="section bg-surface">
          <div className="container">
            <div className="mb-8">
              <p className="eyebrow">Ten programme areas</p>
              <h2 className="section-heading mb-2">All network programmes</h2>
              <p className="text-body text-muted max-w-2xl">
                Each programme is a sustained area of work — running across the three-year
                network period, led by a faculty, and producing multiple projects and outputs.
                Click any programme to see its projects and full description.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {MOCK_PROGRAMMES.map(programme => (
                <ProgrammeCard key={programme.id} programme={programme} variant="default" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────── */}
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