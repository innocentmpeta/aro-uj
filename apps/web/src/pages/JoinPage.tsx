import { useState, FormEvent } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@arouj/firebase-config'
import PageHero from '../components/ui/PageHero'
import { ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const PATHWAYS = [
  {
    audience: 'UJ Students',
    heading: 'Participate in the practicum',
    body: 'Students from all UJ faculties can apply to complete a structured practicum placement working alongside ARO members. Applications open each semester.',
    action: 'Learn about the practicum',
    to: '/student-practicum',
    internal: true,
  },
  {
    audience: 'UJ Faculty & Researchers',
    heading: 'Bring your expertise to the network',
    body: 'If you see a connection between your research or teaching and the challenges reclaimers face, we want to hear from you. The network is actively growing its faculty base.',
    action: 'Email the coordinator',
    to: 'mailto:praxis@uj.ac.za?subject=Faculty interest in Praxis Network',
    internal: false,
  },
  {
    audience: 'International Partners',
    heading: 'Partner with the network',
    body: 'We welcome collaboration with universities, research institutions, and international organisations working on informal economies, waste policy, and participatory methods.',
    action: 'Get in touch',
    to: 'mailto:praxis@uj.ac.za?subject=International partnership enquiry',
    internal: false,
  },
  {
    audience: 'Reclaimers\' Organisations',
    heading: 'Join a growing movement',
    body: 'ARO-UJ Praxis works in solidarity with reclaimer organisations beyond South Africa. If your organisation faces similar challenges and wants to share learning, we would like to connect.',
    action: 'Reach out',
    to: 'mailto:praxis@uj.ac.za?subject=Reclaimer organisation enquiry',
    internal: false,
  },
]

export default function JoinPage() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [interest, setInterest] = useState('')
  const [message, setMessage]   = useState('')
  const [status, setStatus]     = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    try {
      await addDoc(collection(db, 'joinRequests'), {
        name, email, interest, message,
        createdAt: serverTimestamp(),
        reviewed: false,
      })
      setStatus('sent')
      setName(''); setEmail(''); setInterest(''); setMessage('')
    } catch (err) {
      console.error('Failed to submit join request:', err)
      setStatus('error')
    }
  }

  return (
    <div className="bg-white">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <PageHero
        imagePath="/images/join/hero.jpg"
        imageAlt="People joining and collaborating in the network"
        eyebrow="Grow the network"
        title="Join the Network"
        lead="The network is open to students, researchers, faculty, international partners, and reclaimers' organisations. Every discipline has something to contribute."
        variant="dark"
      />

      {/* ── PATHWAYS ──────────────────────────────────────────────────── */}
      <section className="section bg-surface">
        <div className="container">
          <p className="eyebrow mb-10">Find your pathway</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PATHWAYS.map(({ audience, heading, body, action, to, internal }) => (
              <div key={audience}
                className="bg-white rounded-2xl border border-border p-8
                           hover:border-forest transition-colors duration-200">
                <div className="font-body text-xs font-semibold tracking-widest uppercase text-forest mb-4">
                  {audience}
                </div>
                <h2 className="font-display font-bold text-ink text-h3 mb-3">{heading}</h2>
                <p className="font-body text-small text-muted leading-relaxed mb-6">{body}</p>
                {internal
                  ? <Link to={to} className="btn-outline text-sm">
                      {action} <ArrowRight size={14} />
                    </Link>
                  : <a href={to} className="btn-primary text-sm">
                      {action} <ExternalLink size={13} />
                    </a>
                }
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ──────────────────────────────────────────────── */}
      <section className="section bg-white border-t border-border">
        <div className="container max-w-2xl">
          <p className="eyebrow">General enquiry</p>
          <h2 className="section-heading">Send us a message</h2>
          <p className="text-body text-muted mb-10">
            Not sure which pathway fits? Send a message and a network
            coordinator will respond within five working days.
          </p>

          {status === 'sent' ? (
            <div className="rounded-2xl border border-forest bg-greenlight p-8 flex items-start gap-4">
              <CheckCircle2 size={22} className="text-forest shrink-0 mt-0.5" />
              <div>
                <div className="font-display font-bold text-ink text-small mb-1">Message sent</div>
                <p className="font-body text-small text-muted leading-relaxed">
                  Thank you — a network coordinator will respond within five working days.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5"
                    htmlFor="name">Your name</label>
                  <input id="name" type="text" required placeholder="Full name"
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-3 font-body text-small
                               focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest
                               placeholder:text-muted/40 transition-colors" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5"
                    htmlFor="email">Email address</label>
                  <input id="email" type="email" required placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-3 font-body text-small
                               focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest
                               placeholder:text-muted/40 transition-colors" />
                </div>
              </div>

              <div>
                <label className="font-body text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5"
                  htmlFor="interest">I am interested as a…</label>
                <select id="interest"
                  value={interest} onChange={e => setInterest(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 font-body text-small
                             focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest
                             bg-white text-ink transition-colors">
                  <option value="">Select one</option>
                  <option>UJ student</option>
                  <option>UJ faculty / researcher</option>
                  <option>International university partner</option>
                  <option>Reclaimers' organisation</option>
                  <option>Media / journalist</option>
                  <option>General enquiry</option>
                </select>
              </div>

              <div>
                <label className="font-body text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5"
                  htmlFor="message">Message</label>
                <textarea id="message" rows={5} required
                  placeholder="Tell us about yourself and what draws you to the network…"
                  value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 font-body text-small
                             focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest
                             placeholder:text-muted/40 transition-colors resize-none" />
              </div>

              {status === 'error' && (
                <p className="font-body text-small text-red-600">
                  Something went wrong sending your message — please try again, or email{' '}
                  <a href="mailto:reclaimingpraxis@uj.ac.za" className="underline">reclaimingpraxis@uj.ac.za</a> directly.
                </p>
              )}

              <button type="submit" disabled={status === 'submitting'} className="btn-join disabled:opacity-60">
                {status === 'submitting' ? 'Sending…' : <>Send message <ArrowRight size={15} /></>}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  )
}
