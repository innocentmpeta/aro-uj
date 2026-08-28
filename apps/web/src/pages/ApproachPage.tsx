import { Link } from 'react-router-dom'
import { ArrowRight, Flag, PenLine, MapPin, RotateCcw, BookOpen, Users, Lightbulb, Scale } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionNav from '../components/ui/SectionNav'
import { useSectionToggles, usePageContent } from '../hooks/useFirestore'

// Default text blocks — Firestore siteConfig/approachPage values override these when set
const DEFAULTS: Record<string, string> = {
  hero_title: 'Our Approach',
  hero_lead: 'Knowledge applied in the real world, and learning that comes back from that application. Work done with reclaimers — not about them.',
}

function useTxt(content: Record<string, string> | null, key: string): string {
  return (content && content[key]) ? content[key] : DEFAULTS[key] ?? ''
}

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

export default function ApproachPage() {
  const { sections } = useSectionToggles()
  const { data: pageContent } = usePageContent('approachPage')
  const txt = (key: string) => useTxt(pageContent, key)

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <PageHero
        imagePath="/images/praxis/hero.jpg"
        imageUrl={pageContent?.heroImage}
        imageAlt="Network members working alongside reclaimers"
        eyebrow="How the network works"
        title={txt('hero_title')}
        lead={txt('hero_lead')}
        variant="dark"
      />

      <SectionNav items={[
        { id: 'cycle',         label: 'The praxis cycle' },
        { id: 'pillars',       label: 'Five pillars' },
        { id: 'decolonising',  label: 'Decolonising praxis' },
      ]} />

      {/* Praxis cycle */}
      {sections.praxis_cycle !== false && (
        <section id="cycle" className="section-sm bg-surface scroll-mt-32">
          <div className="container">
            <p className="section-eyebrow">How it works</p>
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
      <section id="pillars" className="section bg-white scroll-mt-32">
        <div className="container">
          <p className="section-eyebrow">Five pillars</p>
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
      <section id="decolonising" className="section-sm bg-surface border-t border-border scroll-mt-32">
        <div className="container max-w-3xl">
          <p className="section-eyebrow">Decolonising praxis</p>
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

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="section bg-white border-t border-border">
        <div className="container text-center max-w-xl">
          <p className="section-eyebrow">Get involved</p>
          <h2 className="section-heading">Bring your expertise to the network</h2>
          <p className="section-lead mx-auto mb-10">
            Every faculty and every discipline has something to contribute.
            If you see a connection between your work and the challenges
            reclaimers face, that connection is where your project begins.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/join" className="btn-join">Join the Network <ArrowRight size={15} /></Link>
            <Link to="/praxis-in-action" className="btn-outline">See Projects</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
