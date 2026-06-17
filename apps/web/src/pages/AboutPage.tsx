import React from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import { useSectionToggles, useCollection } from '../hooks/useFirestore'
import { ArrowRight, ExternalLink, MapPin, BookMarked, Link2, Shield, Clock, Globe, Search, BookOpen, Building2, Users, Lightbulb, CheckCircle2 } from 'lucide-react'
import { PILLARS, SDG_META, SDG } from '@arouj/types'
import SiteImage from '../components/ui/SiteImage'

// ── Full team from the programme document ──────────────────────────────────
const TEAM = [
  { name: 'Prof Melanie Samson',          role: 'Lead Principal Investigator', faculty: 'Humanities — Sociology',                             org: 'UJ' as const, imagePath: null },
  { name: '[ARO Co-Director]',            role: 'Network Co-Director',          faculty: 'African Reclaimers Organisation',                    org: 'ARO' as const, imagePath: null },
  { name: 'Prof Brendon Barnes',          role: 'Co-Investigator',              faculty: 'Humanities — Psychology',                            org: 'UJ' as const, imagePath: null },
  { name: 'Prof ES Fourie',              role: 'WP9 Leader',                   faculty: 'Law — Public Law',                                   org: 'UJ' as const, imagePath: null },
  { name: 'Dr Martin Bolton',            role: 'Co-Investigator',              faculty: 'FADA — Industrial Design',                           org: 'UJ' as const, imagePath: null },
  { name: 'Dr Radhika Mia',             role: 'Co-Investigator',              faculty: 'FADA — Industrial Design',                           org: 'UJ' as const, imagePath: null },
  { name: 'Dr Khaya Mchunu',            role: 'Co-Investigator',              faculty: 'FADA — Fashion',                                     org: 'UJ' as const, imagePath: null },
  { name: 'Prof Kim Berman',            role: 'Co-Investigator',              faculty: 'FADA — Visual Arts',                                 org: 'UJ' as const, imagePath: null },
  { name: 'Prof Anthony Ambala',        role: 'Co-Investigator',              faculty: 'FADA — Multimedia',                                  org: 'UJ' as const, imagePath: null },
  { name: 'Ms Christa van Zyl',         role: 'Co-Investigator',              faculty: 'FADA — Graphic Design',                              org: 'UJ' as const, imagePath: null },
  { name: 'Ms Nickey Janse van Rensburg', role: 'WP4 & WP7 Leader',           faculty: 'Engineering & Built Environment — PEETS',            org: 'UJ' as const, imagePath: null },
  { name: 'Dr Thea Schoeman',           role: 'Co-Investigator',              faculty: 'Science — Geography & Environmental Management',      org: 'UJ' as const, imagePath: null },
  { name: 'Mrs Shalin Bidassey-Manilal', role: 'Co-Investigator',             faculty: 'Health Sciences — Environmental Health',             org: 'UJ' as const, imagePath: null },
  { name: 'Dr Thokozani Mbonane',       role: 'Co-Investigator',              faculty: 'Health Sciences — Environmental Health',             org: 'UJ' as const, imagePath: null },
  { name: 'Dr Marinda Pretorius',       role: 'Co-Investigator',              faculty: 'College of Business & Economics — Economics',        org: 'UJ' as const, imagePath: null },
  { name: 'Dr Julie Metta-Versmessen',  role: 'International Partner',        faculty: 'KU Leuven — HIVA Research Institute',                org: 'KU Leuven' as const, imagePath: null },
]

const PARTNERS = [
  { name: 'African Reclaimers Organisation', url: 'https://africanreclaimers.org', type: 'Lead partner — co-director of the network' },
  { name: 'University of Johannesburg',      url: 'https://www.uj.ac.za',         type: 'Lead partner — 7 participating faculties' },
  { name: 'KU Leuven (HIVA)',                url: 'https://hiva.kuleuven.be',     type: 'U21 international university partner' },
  { name: 'TRANSFORM',                       url: '#',                             type: 'Funder & implementation partner' },
  { name: 'SERI',                            url: 'https://seri-sa.org',          type: 'Research & legal partner' },
  { name: 'PRO Alliance',                    url: '#',                             type: 'EPR & payment partner' },
  { name: 'IAWP',                            url: '#',                             type: 'International waste picker network' },
  { name: 'DFFE',                            url: '#',                             type: 'National policy partner' },
]

// The 10 SDGs the network addresses
const NETWORK_SDGS: SDG[] = [1, 3, 5, 8, 9, 10, 11, 12, 13, 17]

export default function AboutPage() {
  const { sections } = useSectionToggles()
  const { data: teamFromDB } = useCollection<any>('team', { publishedOnly: true })
  // Use Firestore team if available, fall back to static list
  const useStaticTeam = teamFromDB.length === 0
  return (
    <div className="bg-white">

      {/* ── HERO — split variant ────────────────────────────────── */}
      <PageHero
        imagePath="/images/about/hero.jpg"
        imageAlt="ARO and UJ network members working together"
        eyebrow="About the network"
        title="A partnership built on equal footing."
        lead="The ARO-UJ Reclaiming Praxis Network — where reclaimer knowledge leads academic expertise."
        variant="split"
      />

      {/* ── INTRO ───────────────────────────────────────────────── */}
      <section className="section bg-white border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="space-y-5 text-body text-muted">
                <p>
                  The <strong className="text-ink">ARO-UJ Reclaiming Praxis Network</strong> is a
                  three-year funded collaboration between the African Reclaimers
                  Organisation (ARO) and seven faculties at the University of
                  Johannesburg, active since 2022 and funded by UJ's GES 4.0 SI
                  programme. It also partners with KU Leuven in Belgium.
                </p>
                <p>
                  The network aims to advance economic, social, and environmental
                  justice for reclaimers — strengthening ARO's capacity to fight
                  for recognition and rights, while building a model for genuine
                  university–civil society collaboration that can be replicated
                  across South Africa and the continent.
                </p>
                <p>
                  Since 2021, participating academics have raised over{' '}
                  <strong className="text-ink">R2 million in external funding</strong>{' '}
                  and received R75,000 in teaching innovation funds. Co-funding of
                  over R430,000 has been secured or committed for the current
                  three-year programme.
                </p>
              </div>
            </div>

            {/* Quick facts */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {([
                  { label: 'Founded',              value: '2022',      icon: Clock },
                  { label: 'Duration',             value: '3 years',   icon: Shield },
                  { label: 'UJ faculties',         value: '7',         icon: BookMarked },
                  { label: 'External funding',     value: 'R2m+',      icon: Building2 },
                  { label: 'Work packages',        value: '10',        icon: Link2 },
                  { label: 'International partner',value: 'KU Leuven', icon: Globe },
                ] as { label: string; value: string; icon: React.ElementType }[]).map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-2xl border border-border p-5">
                    <div className="p-1.5 bg-greenlight rounded-lg w-fit mb-3">
                      <Icon size={24} className="text-forest" />
                    </div>
                    <div className="font-display font-bold text-forest text-h2 mb-1">{value}</div>
                    <div className="font-body text-xs text-muted">{label}</div>
                  </div>
                ))}
              </div>
              <a href="https://africanreclaimers.org" target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-2xl
                           border-2 border-forest hover:bg-forest transition-colors">
                <div>
                  <div className="font-body font-semibold text-small text-forest
                                  group-hover:text-white transition-colors">
                    africanreclaimers.org
                  </div>
                  <div className="font-body text-xs text-muted group-hover:text-white/70 transition-colors">
                    Visit ARO's own website
                  </div>
                </div>
                <ExternalLink size={18} className="text-forest group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── AIM & IMPACT ──────────────────────────────────────────── */}
      {sections.about_aim !== false && (
      <section className="section-sm bg-forest">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="eyebrow text-white/50 mb-3">Aim</p>
              <p className="font-display font-light text-white italic leading-relaxed"
                 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}>
                "To enable societal impact and sustainability by strengthening
                ARO's capacity to advance economic, social, and environmental
                justice for reclaimers."
              </p>
            </div>
            <div>
              <p className="eyebrow text-white/50 mb-3">Impact</p>
              <p className="font-body text-white/80 leading-relaxed text-body">
                To foster a sustainable and just transition by empowering reclaimers
                and the informal recycling sector through innovative academic-community
                partnerships — contributing to the circular economy, promoting social
                equity, and enhancing environmental stewardship in Johannesburg and
                across South Africa.
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── FIVE PILLARS ──────────────────────────────────────────── */}
      {sections.about_pillars !== false && (
      <section className="section bg-white">
        <div className="container">
          <p className="eyebrow">How the network works</p>
          <h2 className="section-heading">Five mutually reinforcing pillars</h2>
          <p className="text-body text-muted max-w-2xl mb-10">
            The network adopts a holistic approach rooted in five pillars that
            are mutually reinforcing — each strengthens the others. Every project
            and programme contributes to at least two pillars simultaneously.
          </p>
          {(() => {
            const pillarIcons: Record<string, React.ElementType> = {
              'research': Search,
              'teaching': BookOpen,
              'policy': Building2,
              'capacity-building': Users,
              'innovative-solutions': Lightbulb,
            }
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {(Object.entries(PILLARS) as [string, { label: string; description: string }][]).map(
                  ([key, pillar]) => {
                    const Icon = pillarIcons[key] ?? Lightbulb
                    return (
                      <div key={key}
                        className="bg-white rounded-2xl border border-border p-6
                                   hover:border-forest transition-colors group">
                        <div className="p-2 bg-greenlight rounded-lg w-fit mb-4
                                        group-hover:bg-forest transition-colors">
                          <Icon size={24} className="text-forest group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-display font-bold text-ink text-large mb-2">
                          {pillar.label}
                        </h3>
                        <p className="font-body text-sm text-muted leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    )
                  }
                )}
              </div>
            )
          })()}
          <div className="mt-8 bg-surface rounded-2xl border border-border p-6 max-w-3xl">
            <p className="font-body text-small text-muted leading-relaxed">
              <strong className="text-ink">A decolonising approach runs through all five pillars. </strong>
              The network takes leadership from reclaimers and prioritises their knowledge,
              needs, and interests — addressing inequities based on gender, nationality, and race
              in each sphere of work.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* ── SDGs ──────────────────────────────────────────────────── */}
      {sections.about_sdgs !== false && (
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — intro text */}
            <div>
              <p className="eyebrow">Global development alignment</p>
              <h2 className="section-heading">
                Contributing to 10 UN Sustainable Development Goals
              </h2>
              <p className="text-body text-muted mb-6">
                The network's work directly contributes to ten of the United
                Nations Sustainable Development Goals. Reclaimers sit at the
                intersection of poverty, health, gender, decent work, innovation,
                reduced inequality, sustainable cities, responsible consumption,
                climate action, and partnerships — which is why their struggle
                matters far beyond the recycling sector.
              </p>
              <p className="text-body text-muted mb-6">
                Every project in the network is mapped to the SDGs it advances,
                providing a framework for reporting to funders and for situating
                the work in global development debates.
              </p>
              <a
                href="https://sdgs.un.org/goals"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-small text-forest hover:underline
                           inline-flex items-center gap-1"
              >
                Learn about the UN SDGs ↗
              </a>
            </div>

            {/* Right — SDG icon grid */}
            <div>
              {/*
                ICON FILES: place official SDG icons in
                apps/web/public/images/about/
                Named exactly: sdg1.png, sdg3.png, sdg5.png, sdg8.png,
                sdg9.png, sdg10.png, sdg11.png, sdg12.png, sdg13.png, sdg17.png
                Download from: https://www.un.org/sustainabledevelopment/news/communications-material/
              */}
              <div className="grid grid-cols-5 gap-3">
                {NETWORK_SDGS.map(sdg => {
                  const meta = SDG_META[sdg]
                  return (
                    <div
                      key={sdg}
                      className="group relative flex flex-col items-center"
                      title={`SDG ${sdg}: ${meta.label}`}
                    >
                      {/* Icon image — falls back to coloured tile if file missing */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden
                                      shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={`/images/about/sdg${sdg}.png`}
                          alt={`SDG ${sdg}: ${meta.label}`}
                          className="w-full h-full object-cover"
                          onError={e => {
                            const img = e.currentTarget as HTMLImageElement
                            img.style.display = 'none'
                            const parent = img.parentElement
                            if (parent && !parent.querySelector('.sdg-fallback')) {
                              const fb = document.createElement('div')
                              fb.className = 'sdg-fallback absolute inset-0 flex flex-col items-center justify-center p-1'
                              fb.style.backgroundColor = meta.color
                              fb.innerHTML = `<span style="color:white;font-weight:bold;font-size:1.1rem;font-family:Georgia,serif">${sdg}</span>`
                              parent.appendChild(fb)
                            }
                          }}
                        />
                      </div>
                      {/* Label on hover — tooltip-style */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10
                                      bg-ink text-white text-[10px] font-body px-2 py-1 rounded-lg
                                      whitespace-nowrap opacity-0 group-hover:opacity-100
                                      transition-opacity pointer-events-none shadow-lg">
                        SDG {sdg}: {meta.label}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* SDG count strip below icons */}
              <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                <div className="font-display font-bold text-forest text-h2">10</div>
                <div className="font-body text-small text-muted leading-snug">
                  Sustainable Development Goals<br />addressed by the network
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* ── PRINCIPLES ────────────────────────────────────────────── */}
      {sections.about_principles !== false && (
      <section className="section bg-white">
        <div className="container max-w-3xl">
          <p className="eyebrow">How we engage</p>
          <h2 className="section-heading">Principles for every project</h2>
          <p className="text-body text-muted mb-8">
            Every activity in the network is held to a set of principles agreed
            between ARO and UJ. These are not aspirational — they are operational
            criteria that each project must meet.
          </p>
          <div className="space-y-3">
            {[
              'Based on and responsive to clear needs articulated by ARO that advance ARO\'s struggle for environmental, economic, and social justice.',
              'Leadership by reclaimers — in design, delivery, and evaluation.',
              'Rooted in and giving effect to a decolonising approach.',
              'Redresses inequities based on gender, nationality, and race.',
              'Builds reclaimers\' knowledge and capacity through organising, resident engagement, negotiations, or policy advocacy.',
              'Involves a multi-disciplinary team drawn from at least two faculties.',
              'Results in public engagement materials — op-eds, videos, websites, exhibitions, case studies.',
              'Results in peer-reviewed publications.',
              'Includes students and/or postdocs and reclaimers, providing workplace experience where possible.',
              'Strengthens the ARO-UJ Reclaiming Praxis Network.',
            ].map((principle, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-border bg-white">
                <CheckCircle2 size={18} className="text-forest shrink-0 mt-0.5" />
                <span className="font-body text-small text-muted leading-relaxed">{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── TEAM ──────────────────────────────────────────────────── */}
      {sections.about_team !== false && (
      <section className="section bg-surface">
        <div className="container">
          <p className="eyebrow">The people</p>
          <h2 className="section-heading">Network team</h2>
          <p className="text-body text-muted max-w-2xl mb-10">
            The network brings together researchers, designers, engineers, lawyers,
            health scientists, economists, and reclaimers — from UJ's seven
            participating faculties, ARO, and KU Leuven in Belgium.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(teamFromDB.length > 0 ? teamFromDB : TEAM).map((member: any) => {
              const name      = member.name
              const role      = member.role
              const faculty   = member.faculty
              const org       = member.organisation ?? member.org ?? 'UJ'
              const imagePath = member.imagePath ?? null
              return (
                <div key={name}
                  className={`rounded-2xl border p-5 flex items-start gap-4
                    ${org === 'ARO' ? 'border-forest bg-greenlight' : 'border-border bg-white'}`}
                >
                  <SiteImage
                    src={imagePath}
                    alt={name}
                    className="w-12 h-12 rounded-full shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-display font-bold text-ink text-small mb-0.5 leading-snug">
                      {name}
                    </div>
                    <div className="font-body text-xs text-forest mb-0.5">{role}</div>
                    <div className="font-body text-xs text-muted leading-snug">{faculty}</div>
                    <div className={`font-body text-[10px] font-semibold uppercase tracking-wide mt-1.5
                      px-2 py-0.5 rounded-full inline-block
                      ${org === 'ARO' ? 'bg-forest text-white' :
                        org === 'KU Leuven' ? 'bg-ink text-white' :
                        'bg-surface text-muted border border-border'}`}>
                      {org}
                    </div>
                    {member.bio && (
                      <p className="font-body text-xs text-muted mt-1.5 leading-snug line-clamp-2">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      )}

      {/* ── KU LEUVEN ─────────────────────────────────────────────── */}
      {sections.about_kuleuven !== false && (
      <section className="section bg-white border-t border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="eyebrow">International partnership</p>
              <h2 className="section-heading">KU Leuven — HIVA Institute</h2>
              <div className="space-y-4 text-body text-muted">
                <p>
                  The ARO-UJ Reclaiming Praxis Network advances UJ's U21 university
                  partnerships through collaboration with KU Leuven — one of Europe's
                  oldest and most respected universities, founded in 1425 in Belgium.
                </p>
                <p>
                  Key collaborators from KU Leuven work at the{' '}
                  <strong className="text-ink">HIVA Research Institute for Work and Society</strong>,
                  bringing expertise in circular economy, waste management, and labour
                  market transitions. Their work on projects such as the MICHELLE
                  project (modelling circular economy impacts on labour markets),
                  Pop-Machina (circular economy and collaborative production), and
                  the Circular Economy Center (skills for a repair society) aligns
                  directly with the network's goals.
                </p>
                <p>
                  The partnership promotes global knowledge exchange on advancing
                  economic, social, and environmental justice for workers in the
                  informal recycling sector.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Dr Julie Metta-Versmessen', spec: 'PhD Economics — Circular Economy' },
                { name: 'Dr Carolien Lavigne',       spec: 'PhD Business Economics — Waste Management' },
                { name: 'Dr Allison Dunne',          spec: 'PhD Sociology — Education' },
              ].map(({ name, spec }) => (
                <div key={name} className="flex items-start gap-4 p-5 rounded-xl border border-border">
                  <div className="w-2 h-2 rounded-full bg-ink mt-1.5 shrink-0" />
                  <div>
                    <div className="font-body font-semibold text-small text-ink">{name}</div>
                    <div className="font-body text-xs text-muted">{spec}</div>
                  </div>
                </div>
              ))}
              <a href="https://hiva.kuleuven.be" target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-2xl border border-border hover:border-ink transition-colors">
                <span className="font-body text-small font-medium text-ink group-hover:text-forest transition-colors">
                  hiva.kuleuven.be
                </span>
                <ExternalLink size={14} className="text-muted group-hover:text-forest transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── PARTNERS ──────────────────────────────────────────────── */}
      {sections.about_partners !== false && (
      <section className="section bg-surface">
        <div className="container">
          <p className="eyebrow">Partners & funders</p>
          <h2 className="section-heading">Who we work with</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {PARTNERS.map(({ name, url, type }) => (
              <a key={name} href={url}
                target={url !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`group flex flex-col justify-between p-5 rounded-2xl border
                  hover:border-forest transition-colors bg-white
                  ${url === '#' ? 'cursor-default' : 'cursor-pointer'}`}>
                <div>
                  <div className="font-body font-semibold text-small text-ink mb-1
                                  group-hover:text-forest transition-colors">
                    {name}
                  </div>
                  <div className="font-body text-xs text-muted">{type}</div>
                </div>
                {url !== '#' && (
                  <ExternalLink size={13} className="text-muted group-hover:text-forest
                    transition-colors mt-3 self-end" />
                )}
              </a>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="section bg-white border-t border-border">
        <div className="container text-center max-w-xl">
          <p className="eyebrow">Get involved</p>
          <h2 className="section-heading">Join the network</h2>
          <p className="section-lead mx-auto mb-10">
            The network is open to UJ colleagues from all faculties, international
            university partners, and reclaimers' organisations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/join" className="btn-join">Join the Network <ArrowRight size={15} /></Link>
            <Link to="/praxis-in-action" className="btn-outline">Praxis in Action</Link>
          </div>
        </div>
      </section>

    </div>
  )
}