import { useSectionToggles, useCollection, usePageContent } from '../hooks/useFirestore'
import React from 'react'
import PageHero from '../components/ui/PageHero'
import SectionNav from '../components/ui/SectionNav'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ShieldCheck, Users, Link2, Ban, Scale, BookOpen, Heart, Lightbulb,
} from 'lucide-react'
import SiteImage from '../components/ui/SiteImage'
import ThemeBadge from '../components/ui/ThemeBadge'

// Fixed icon set — must match the identical map in
// apps/cms/src/pages/StudentPrinciplesPage.tsx (icon names are stored as strings)
const PRINCIPLE_ICONS: Record<string, React.ElementType> = {
  ShieldCheck, Users, Link2, Ban, Scale, BookOpen, Heart, Lightbulb,
}

const HOW_TO_PARTICIPATE = [
  { step: '01', heading: 'Independent research project', body: '[Placeholder — to be replaced by Shillah and Melanie] Do your independent post-graduate research project on reclaimers in partnership with ARO.' },
  { step: '02', heading: 'Course assignment',             body: '[Placeholder — to be replaced by Shillah and Melanie] Work with ARO for an assignment as part of a participating course. Examples of FADA courses that have taken part will be listed here.' },
  { step: '03', heading: 'Volunteer',                     body: '[Placeholder — to be replaced by Shillah and Melanie] Volunteer to support the network and ARO.' },
]

const DEFAULT_FACULTIES = [
  'FADA — Art, Design & Architecture',
  'Law',
  'Engineering & Built Environment (FEBE)',
  'Humanities',
  'Science',
  'Health Sciences',
  'College of Business & Economics (CBE)',
]

export default function StudentPracticumPage() {
  const { sections } = useSectionToggles()
  const { data: projects } = useCollection<any>('projects', { publishedOnly: true })
  const { data: principlesFromDB } = useCollection<any>('studentPrinciples', { publishedOnly: true })
  const { data: pageContent } = usePageContent('practicumPage')

  const principles = [...principlesFromDB].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))

  const show = (key: string) => sections[key] !== false

  // CMS can supply a comma-separated list of faculties to override defaults
  const facultiesRaw = pageContent?.faculties_list
  const faculties = facultiesRaw
    ? facultiesRaw.split('\n').map((f: string) => f.trim()).filter(Boolean)
    : DEFAULT_FACULTIES

  const whoCanApplyText = pageContent?.who_can_apply
    ?? 'Reclaimers face challenges that require every kind of expertise. Engineers design safer working spaces. Law students navigate UIF and documentation barriers. FADA students communicate reclaimer stories with dignity. Humanities researchers analyse policy. Health Sciences students assess occupational risks. Economists study market dynamics. There is no faculty that does not have something to contribute.'

  // Use more projects for past highlights (up to 6)
  const PAST_HIGHLIGHTS = projects.slice(0, 6)

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <PageHero
        imagePath="/images/practicum/hero.jpg"
        imageUrl={pageContent?.heroImage}
        imageAlt="UJ student and reclaimer working together in the field"
        eyebrow="For UJ students & researchers"
        title="Student research"
        lead="Apply your expertise alongside ARO members on real challenges — and learn from the community as much as from the classroom."
        variant="dark"
      />

      <SectionNav items={[
        { id: 'past-projects', label: 'Past projects' },
        { id: 'principles',    label: 'Principles' },
        { id: 'participate',   label: 'How to participate' },
        { id: 'who-can-apply', label: 'Who can apply' },
      ]} />

      {/* ── PAST HIGHLIGHTS — first per Melanie's note ─────────── */}
      {show('practicum_past') && PAST_HIGHLIGHTS.length > 0 && (
        <section id="past-projects" className="section bg-white scroll-mt-32">
          <div className="container">
            <p className="eyebrow">What students have built</p>
            <h2 className="section-heading">Past student research projects</h2>
            <p className="text-body text-muted max-w-2xl mb-10">
              Every project below was produced by UJ students working directly
              alongside ARO members — not desk research, but applied work in the
              communities where reclaimers live and work.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PAST_HIGHLIGHTS.map((project: any) => (
                <Link key={project.id ?? project.title}
                  to={`/praxis-in-action/${project.slug ?? ''}`}
                  className="card group block hover:shadow-md transition-shadow">
                  <SiteImage src={project.imagePath} imageBase64={project.imageBase64}
                    thumbnailBase64={project.thumbnailBase64} alt={project.title} aspectRatio="video" />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(project.themes ?? []).map((t: any) => <ThemeBadge key={t} theme={t} size="sm" />)}
                    </div>
                    <h3 className="font-display font-bold text-ink text-small mb-2 leading-snug group-hover:text-forest transition-colors">
                      {project.title}
                    </h3>
                    <p className="font-body text-xs text-muted mb-3 line-clamp-2">{project.outcome}</p>
                    <div className="flex items-center gap-2 font-body text-xs text-muted pt-3 border-t border-border">
                      <span>{project.years}</span>
                      {project.outputType?.length > 0 && (
                        <><span>·</span><span>{project.outputType.join(', ')}</span></>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/praxis-in-action" className="btn-outline">
                See the full project portfolio <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── ETHICAL FRAMEWORK ────────────────────────────────────── */}
      {show('practicum_ethics') && (
        <section id="principles" className="section bg-surface scroll-mt-32">
          <div className="container max-w-3xl">
            <p className="eyebrow">How we work</p>
            <h2 className="section-heading">Principles for Student Projects</h2>
            <div className="space-y-5 text-body text-muted mt-2 mb-8">
              <p>
                Participatory action research with marginalised communities
                carries real ethical responsibilities. The Praxis Network operates
                under a clear ethical framework, approved by UJ's Research Ethics
                Committee and agreed with ARO.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {principles.map((principle: any) => {
                const Icon = PRINCIPLE_ICONS[principle.icon] ?? ShieldCheck
                return (
                <div key={principle.id} className="rounded-2xl border border-border bg-white p-6">
                  <div className="p-2 bg-greenlight rounded-lg w-fit mb-4">
                    <Icon size={26} className="text-forest" />
                  </div>
                  <h3 className="font-display font-bold text-ink text-large mb-2">{principle.heading}</h3>
                  <p className="font-body text-sm text-muted leading-relaxed">{principle.body}</p>
                </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW CAN STUDENTS PARTICIPATE ─────────────────────────── */}
      {show('practicum_how') && (
        <section id="participate" className="section bg-white scroll-mt-32">
          <div className="container">
            <p className="eyebrow">The process</p>
            <h2 className="section-heading">How can students participate?</h2>
            <p className="text-body text-muted max-w-2xl mb-2">
              There are three ways students can participate in the ARO-UJ Reclaiming Praxis Network:
            </p>
            <div className="mt-10 space-y-3">
              {HOW_TO_PARTICIPATE.map(({ step, heading, body }) => (
                <div key={step} className="flex items-start gap-8 p-7 bg-white border border-border rounded-2xl">
                  <div className="font-body text-xs font-semibold text-forest/40 tracking-widest shrink-0 pt-0.5 w-6">{step}</div>
                  <div>
                    <h3 className="font-display font-bold text-ink text-h3 mb-2">{heading}</h3>
                    <p className="font-body text-small text-muted leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHO CAN APPLY — lower on page per Melanie ─────────────── */}
      {show('practicum_who') && (
        <section id="who-can-apply" className="section-sm bg-surface scroll-mt-32">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="eyebrow">Who can participate</p>
                <h2 className="section-heading">Open to all UJ faculties</h2>
                <p className="text-body text-muted">{whoCanApplyText}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {faculties.map((f: string) => (
                  <div key={f} className="bg-white rounded-xl border border-border px-4 py-3 font-body text-small text-ink">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── APPLY CTA ────────────────────────────────────────────── */}
      <section className="section bg-forest">
        <div className="container text-center max-w-xl">
          <p className="eyebrow text-white/50">Applications open each semester</p>
          <h2 className="font-display font-bold text-white mb-5"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
            Ready to participate?
          </h2>
          <p className="text-body text-white/70 mb-10 max-w-md mx-auto">
            Contact the network coordinator or submit an expression of
            interest. Tell us your faculty, your skills, and what drew you to this work.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/join" className="btn bg-white text-forest px-7 py-3 hover:bg-greenlight font-medium">
              Express interest <ArrowRight size={15} />
            </Link>
            <a href="mailto:reclaimingpraxis@uj.ac.za"
              className="btn border border-white/30 text-white px-7 py-3 hover:bg-white/10">
              Email us directly
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
