import { useSectionToggles, usePageContent } from '../hooks/useFirestore'
import React from 'react'
import PageHero from '../components/ui/PageHero'
import SectionNav from '../components/ui/SectionNav'
import { ExternalLink, ArrowRight, ShoppingCart, Sliders, Tag, RefreshCw, MapPin, CreditCard, FileText, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import SiteImage from '../components/ui/SiteImage'

// Default text blocks — Firestore siteConfig/reclaimersPage values override these when set.
// Multi-paragraph blocks are stored as one string, paragraphs separated by a blank line.
const DEFAULTS: Record<string, string> = {
  hero_lead: "Before most of Johannesburg wakes up, reclaimers are already at work — collecting the recyclable materials that sustain South Africa's recycling economy.",
  understanding_heading: 'Essential workers. Excluded from the system they sustain.',
  understanding_body:
    "Reclaimers — also called waste pickers or informal recyclers — are the men and women who collect, sort, transport, and sell recyclable materials from South Africa's streets, landfill sites, and communities. Research by the CSIR estimates that close to 90,000 South Africans work as informal reclaimers.\n\n" +
    "They are responsible for collecting 80 to 90 percent of all post-consumer packaging that is recycled in this country — a contribution that saves municipalities an estimated R780 million annually in landfill costs. South Africa's recycling rates, which are among the highest on the continent, exist almost entirely because of their labour.\n\n" +
    'Yet reclaimers are systematically excluded from the formal waste management system. They are not recognised as workers. They are not paid for the service they provide to municipalities and producers. They have no access to social protections. And they face constant risk of displacement as private companies bid for recycling contracts that reclaimers have always serviced.\n\n' +
    'This is the context in which ARO-UJ Praxis works. The partnership exists not to study reclaimers as a social phenomenon, but to work alongside them as they organise, advocate, and fight for recognition and rights.',
  challenges_heading: 'Doing essential work.\nDenied essential rights.',
  challenges_intro: 'Reclaimers face a consistent set of systemic barriers — not individual misfortunes, but the predictable result of an economic and policy environment that has not yet caught up with the reality of their contribution.',
  quote_text: 'We are not begging. We are working. We are asking to be recognised for the work we already do — and to be paid for it.',
  quote_cite: 'ARO member, Johannesburg',
  aro_heading: 'The African Reclaimers Organisation',
  aro_body:
    "The African Reclaimers Organisation (ARO) is a democratic, membership-based organisation of reclaimers, founded in Johannesburg in 2016, when street and landfill reclaimers in the city united to mobilise against the municipality's attempt to contract private companies to collect recyclables — a move that would have dispossessed reclaimers of their livelihoods. ARO's membership has since expanded to Mpumalanga, the Western Cape, and the Eastern Cape.\n\n" +
    'In 2023, ARO established ARO Recycling, a recycling company owned by reclaimers, through which ARO provides separation at source services to middle- and high-income areas in Johannesburg.\n\n' +
    "ARO is named 'African' because it represents reclaimers of all nationalities engaged in the recycling trade. It is run by its members, for its members — a democratic organisation where reclaimers elect their own leadership and make decisions collectively.\n\n" +
    "ARO is the lead partner in the ARO-UJ Praxis Network. It is not a beneficiary of the network's work — it is a co-director of it.",
}

function useTxt(content: Record<string, string> | null, key: string): string {
  return (content && content[key]) ? content[key] : DEFAULTS[key] ?? ''
}

function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => <p key={i} className={className}>{p}</p>)}
    </>
  )
}

// ── TO SWAP IMAGES:
// /images/reclaimers/hero.jpg        — wide shot, reclaimers at work
// /images/reclaimers/sorting.jpg     — sorting depot or trolley
// /images/reclaimers/community.jpg   — community gathering or march

const STATS = [
  { value: '~90,000',  label: 'informal reclaimers working across South Africa' },
  { value: '80–90%',   label: 'of all used packaging and paper recycled in SA is collected by reclaimers' },
  { value: 'Up to R780m', label: 'saved annually in municipal landfill airspace costs' },
  { value: '6,000+',   label: 'ARO members in Johannesburg and Mpumalanga' },
]

const WHAT_THEY_DO = [
  { heading: 'They collect',          icon: ShoppingCart, body: 'Moving through residential streets, landfill sites, and industrial areas before and after municipal trucks, reclaimers collect paper, cardboard, glass, metals, and plastics that would otherwise go to landfill.' },
  { heading: 'They sort',             icon: Sliders,      body: 'At sorting depots and on street corners, reclaimers separate materials by type, grade, and cleanliness — skilled work that determines what can actually be recycled and at what value.' },
  { heading: 'They sell',             icon: Tag,          body: 'Sorted materials are sold to buy-back centres. Reclaimers navigate a complex and often exploitative market, with little bargaining power and no formal protection. This is why reclaimers organised to form ARO, so that they can improve their incomes, working conditions, power in the sector and social status.' },
  { heading: 'They sustain the system', icon: RefreshCw,  body: "South Africa's impressive recycling rates exist almost entirely because of reclaimers' labour. Without them, those materials go to landfill. Yet reclaimers remain outside the formal waste management system." },
]

const CHALLENGES = [
  'Denied formal recognition as workers, despite providing an essential service',
  'Excluded from payment under Extended Producer Responsibility (EPR) regulations',
  'Subject to displacement when municipalities award recycling contracts to private companies',
  'Exposed to health and safety hazards at landfill sites and in traffic',
  'Foreign national reclaimers face additional barriers: documentation, language, xenophobia',
  'No access to UIF, pension, or other social protections as informal workers',
]

export default function TheReclaimersPage() {
  const { sections } = useSectionToggles()
  const { data: pageContent } = usePageContent('reclaimersPage')
  const txt = (key: string) => useTxt(pageContent, key)

  return (
    <div className="bg-white">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <PageHero
        imagePath="/images/reclaimers/hero.jpg"
        imageUrl={pageContent?.heroImage}
        imageAlt="Reclaimers at work in Johannesburg"
        eyebrow="Who we work with"
        title="Reclaimers"
        lead={txt('hero_lead')}
        variant="dark"
      />

      <SectionNav items={[
        { id: 'understanding',  label: 'Understanding reclaimers' },
        { id: 'what-they-do',   label: 'What they do' },
        { id: 'challenges',     label: 'Challenges' },
        { id: 'aro',            label: 'About ARO' },
      ]} />

      {/* ── WHO ARE RECLAIMERS ─────────────────────────────────────────── */}
      <section id="understanding" className="section bg-white scroll-mt-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-eyebrow">Understanding reclaimers</p>
              <h2 className="section-heading">{txt('understanding_heading')}</h2>
              <div className="space-y-5 text-body text-muted">
                <Paragraphs text={txt('understanding_body')} />
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              {STATS.map(({ value, label }) => (
                <div key={value}
                  className="flex items-start gap-5 p-6 rounded-2xl border border-border bg-white">
                  <div className="font-display font-bold text-forest shrink-0"
                       style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                    {value}
                  </div>
                  <div className="font-body text-small text-muted leading-relaxed pt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT RECLAIMERS DO ─────────────────────────────────────────── */}
      {sections.reclaimers_what !== false && (
      <section id="what-they-do" className="section bg-surface scroll-mt-32">
        <div className="container">
          <p className="section-eyebrow">The work</p>
          <h2 className="section-heading">What reclaimers do — and why it matters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {WHAT_THEY_DO.map(({ heading, body, icon: Icon }) => (
              <div key={heading}
                className="bg-white rounded-2xl border border-border p-7">
                <div className="p-2.5 bg-greenlight rounded-xl w-fit mb-5">
                  <Icon size={26} className="text-forest" />
                </div>
                <h3 className="font-display font-bold text-ink text-h3 mb-3">
                  {heading}
                </h3>
                <p className="font-body text-small text-muted leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── PHOTO + CHALLENGES SPLIT ───────────────────────────────────── */}
      {sections.reclaimers_challenges !== false && (
      <section id="challenges" className="section bg-white scroll-mt-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <SiteImage
              src="/images/reclaimers/sorting.jpg"
              alt="Reclaimers sorting materials at a depot"
              aspectRatio="portrait"
              className="rounded-2xl"
            />
            <div>
              <p className="section-eyebrow">Systemic challenges</p>
              <h2 className="section-heading">
                {txt('challenges_heading').split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
                ))}
              </h2>
              <p className="text-body text-muted mb-8">{txt('challenges_intro')}</p>
              <ul className="space-y-4">
                {CHALLENGES.map(challenge => (
                  <li key={challenge} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest mt-2 shrink-0" />
                    <span className="font-body text-small text-muted leading-relaxed">
                      {challenge}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── RECLAIMER VOICE ───────────────────────────────────────────── */}
      {sections.reclaimers_quote !== false && (
      <section className="bg-forest py-20">
        <div className="container max-w-3xl text-center">
          <blockquote>
            <p className="font-display font-light text-white italic mb-6"
               style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.8rem)', lineHeight: 1.5 }}>
              "{txt('quote_text')}"
            </p>
            <cite className="font-body text-small text-white/60 not-italic">
              {txt('quote_cite')}
            </cite>
          </blockquote>
        </div>
      </section>
      )}

      {/* ── ARO SECTION ───────────────────────────────────────────────── */}
      {sections.reclaimers_aro !== false && (
      <section id="aro" className="section bg-white scroll-mt-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-eyebrow">The organisation</p>
              <h2 className="section-heading">{txt('aro_heading')}</h2>
              <div className="space-y-5 text-body text-muted">
                <Paragraphs text={txt('aro_body')} />
              </div>

              {/* ARO programmes summary */}
              <div className="mt-8 space-y-3">
                {([
                  ['Recycling with Reclaimers', 'Resident-facing separation at source programme across Johannesburg suburbs', RefreshCw],
                  ['Mpumalanga Project', 'Expanding reclaimer organisation and registration into rural municipalities', MapPin],
                  ['SAWPRS', 'South African Waste Picker Registration System — formal recognition and payment', CreditCard],
                  ['Policy Engagement', 'National waste management strategy, EPR regulations, DFFE task team', FileText],
                  ['International Work', 'IAWP, Plastics Treaty negotiations, support to Kenya, Ghana, Lesotho', Globe],
                ] as [string, string, React.ElementType][]).map(([title, desc, Icon]) => (
                  <div key={title} className="flex items-start gap-4 p-4 rounded-xl border border-border">
                    <div className="p-1.5 bg-greenlight rounded-lg shrink-0 mt-0.5">
                      <Icon size={24} className="text-forest" />
                    </div>
                    <div>
                      <div className="font-body font-semibold text-small text-ink">{title}</div>
                      <div className="font-body text-xs text-muted">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ARO logo + link block */}
            <div className="space-y-6">
              <SiteImage
                src="/images/reclaimers/community.jpg"
                alt="ARO members at a community event"
                aspectRatio="video"
                className="rounded-2xl"
              />

              {/* Visit ARO CTA — prominent */}
              <a
                href="https://africanreclaimers.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-6 rounded-2xl border-2 border-forest
                           hover:bg-forest transition-colors duration-200"
              >
                <div>
                  <div className="font-display font-bold text-forest text-h3 mb-1
                                  group-hover:text-white transition-colors">
                    Visit ARO's website
                  </div>
                  <div className="font-body text-small text-muted group-hover:text-white/80 transition-colors">
                    africanreclaimers.org — campaigns, programmes, and how to support reclaimers
                  </div>
                </div>
                <ExternalLink
                  size={22}
                  className="text-forest group-hover:text-white transition-colors shrink-0 ml-4"
                />
              </a>

              {/* Secondary context */}
              <div className="bg-greenlight rounded-2xl p-6">
                <div className="font-body text-xs font-semibold tracking-widest uppercase text-forest mb-3">
                  ARO in the ARO-UJ Praxis Network
                </div>
                <p className="font-body text-small text-muted leading-relaxed">
                  ARO is a co-director of the Praxis Network — not a recipient
                  of services. Network projects are proposed, designed, and
                  evaluated jointly. ARO members participate directly in
                  practicum projects. ARO's campaigns and programmes provide
                  the real-world context in which all network work takes place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="section bg-surface border-t border-border">
        <div className="container text-center max-w-2xl">
          <p className="section-eyebrow">Get involved</p>
          <h2 className="section-heading">Work alongside reclaimers</h2>
          <p className="section-lead mx-auto mb-10">
            The Praxis Network works directly with ARO members on real
            challenges. Students, researchers, and practitioners from all
            disciplines are welcome.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/praxis-in-action" className="btn-primary">
              See Projects <ArrowRight size={15} />
            </Link>
            <Link to="/student-practicum" className="btn-outline">
              Student research
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}