import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ThemeBadge from '../components/ui/ThemeBadge'
import { SDGStrip } from '../components/ui/SDGBadge'
import SiteImage from '../components/ui/SiteImage'
import { useCollection } from '../hooks/useFirestore'
import { PILLARS } from '@arouj/types'

export default function ProgrammeDetailPage() {
  const { slug } = useParams()
  const { data: programmes, loading: loadingP } = useCollection<any>('programmes', { publishedOnly: false })
  const { data: allProjects, loading: loadingPr } = useCollection<any>('projects', { publishedOnly: true })

  const loading = loadingP || loadingPr

  if (loading) {
    return (
      <div className="container py-24 text-center">
        <p className="font-body text-muted animate-pulse">Loading…</p>
      </div>
    )
  }

  const programme = programmes.find((p: any) => p.slug === slug) ?? null
  const projects  = allProjects.filter((p: any) => p.programmeId === programme?.id)

  if (!programme) {
    return (
      <div className="container py-24 text-center">
        <p className="font-body text-muted mb-4">Programme not found.</p>
        <Link to="/praxis-in-action" className="btn-outline">← Praxis in Action</Link>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Back nav */}
      <div className="border-b border-border">
        <div className="container py-4">
          <Link to="/praxis-in-action?view=programmes"
            className="inline-flex items-center gap-2 font-body text-small text-muted hover:text-forest transition-colors">
            <ArrowLeft size={14} /> All programmes
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="section-sm bg-white">
        <div className="container max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {(programme.themes ?? []).map((t: any) => <ThemeBadge key={t} theme={t} />)}
            <span className="font-body text-xs text-muted bg-surface border border-border px-3 py-1 rounded-full">
              {programme.wpReference}
            </span>
            <span className={`font-body text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${
              programme.status === 'active' ? 'bg-greenlight text-forest' : 'bg-surface text-muted'
            }`}>
              {programme.status}
            </span>
          </div>
          <h1 className="font-display font-bold text-ink mb-4"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', lineHeight: 1.1 }}>
            {programme.name}
          </h1>
          <p className="section-lead mb-4">{programme.summary}</p>
          <div className="flex flex-wrap gap-4 font-body text-small text-muted">
            <span>Led by <strong className="text-ink">{programme.wpLeader}</strong></span>
            <span>· {programme.startDate} – {programme.endDate}</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl">
          <div className="lg:col-span-2 space-y-8">
            {programme.objective && (
              <div>
                <h2 className="font-display font-bold text-ink text-h3 mb-3">Objective</h2>
                <p className="text-body text-muted leading-relaxed">{programme.objective}</p>
              </div>
            )}
            {programme.body && (
              <div>
                <h2 className="font-display font-bold text-ink text-h3 mb-3">About this programme</h2>
                <div className="prose prose-sm max-w-none text-muted"
                  dangerouslySetInnerHTML={{ __html: programme.body }} />
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-ink text-h3 mb-5">
                  Projects in this programme
                </h2>
                <div className="space-y-4">
                  {projects.map((project: any) => (
                    <Link key={project.id} to={`/praxis-in-action/${project.slug}`}
                      className="group card flex gap-4 p-5 bg-white">
                      <SiteImage src={project.imagePath} alt={project.title}
                        className="w-20 h-20 rounded-xl shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-small text-ink mb-1
                                       group-hover:text-forest transition-colors leading-snug">
                          {project.title}
                        </h3>
                        <p className="font-body text-xs text-muted mb-1 line-clamp-2">{project.outcome}</p>
                        <span className="font-body text-xs text-muted">{project.years}</span>
                      </div>
                      <ArrowRight size={14} className="text-forest shrink-0 mt-1
                        opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {(programme.sdgs ?? []).length > 0 && (
              <div className="rounded-2xl border border-border p-6">
                <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-muted mb-4">
                  SDGs addressed
                </h3>
                <SDGStrip sdgs={programme.sdgs} size="md" showLabels />
              </div>
            )}
            {(programme.pillars ?? []).length > 0 && (
              <div className="rounded-2xl border border-border p-6">
                <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-muted mb-4">
                  Network pillars
                </h3>
                <div className="space-y-2">
                  {programme.pillars.map((p: string) => (
                    <div key={p} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                      <span className="font-body text-small text-ink">
                        {PILLARS[p as keyof typeof PILLARS]?.label ?? p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Link to="/join" className="btn-join w-full justify-center">Join the Network</Link>
          </aside>
        </div>
      </section>
    </div>
  )
}