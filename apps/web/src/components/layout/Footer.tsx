import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'About the Network',    to: '/about' },
  { label: 'The Reclaimers',       to: '/the-reclaimers' },
  { label: 'Praxis in Action',     to: '/praxis-in-action' },
  { label: 'Research & Publications', to: '/research' },
  { label: 'Student Practicum',    to: '/student-practicum' },
  { label: 'Teaching Resources',   to: '/teaching-resources' },
  { label: 'News & Updates',       to: '/news' },
  { label: 'Join the Network',     to: '/join' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <div className="font-display font-bold text-white text-2xl mb-1">Reclaiming Praxis</div>
            <div className="font-body text-[10px] tracking-widest uppercase text-white/30 mb-5">Network</div>
            <p className="font-body text-small text-white/60 leading-relaxed max-w-xs">
              Where reclaimer knowledge and academic expertise meet,
              act, and build change together.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <img src="/logos/aro-logo.png" alt="ARO"
                className="h-12 w-auto opacity-100 hover:opacity-80 transition-opacity" />
              <div className="w-px h-6 bg-white/20" />
              <img src="/logos/uj-logo.png" alt="UJ"
                className="h-12 w-auto opacity-100 hover:opacity-80 transition-opacity rounded" />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-white/30 mb-5">
              Navigate
            </h3>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, to }) => (
                <Link key={to} to={to}
                  className="font-body text-small text-white/60 hover:text-white transition-colors w-fit">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-white/30 mb-5">
              Connect
            </h3>
            <p className="font-body text-small text-white/60 leading-relaxed mb-4">
              Interested in the network as a researcher, student, or reclaimers' organisation?
            </p>
            <Link to="/join" className="btn-join text-xs py-2.5 px-5">
              Join the Network
            </Link>
            <div className="mt-6 flex flex-col gap-2">
              <a href="mailto:praxis@uj.ac.za"
                className="font-body text-small text-midgreen hover:text-white transition-colors">
                praxis@uj.ac.za
              </a>
              <a href="https://africanreclaimers.org" target="_blank" rel="noopener noreferrer"
                className="font-body text-small text-white/40 hover:text-white transition-colors">
                africanreclaimers.org ↗
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
          <p className="font-body text-xs text-white/25">
            © {new Date().getFullYear()} Reclaiming Praxis Network · Funded by UJ GES 4.0 SI
          </p>
          <div className="flex items-center gap-6">
            <p className="font-body text-xs text-white/25">
              Built by CODE — Centre of Design and Engineering
            </p>
            <a
              href="https://cms.reclaimingpraxis.code7.co.za"
              className="font-body text-xs text-white/20 hover:text-white/60 transition-colors
                         border border-white/10 hover:border-white/30 px-3 py-1 rounded-lg"
            >
              Content Manager ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
