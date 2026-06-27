import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const NAV = [
  { to: '/about',              label: 'About' },
  { to: '/the-reclaimers',     label: 'Reclaimers' },
  { to: '/praxis-in-action',   label: 'Praxis in Action' },
  { to: '/research',           label: 'Research' },
  { to: '/student-practicum',  label: 'Student Practicum' },
  { to: '/teaching-resources', label: 'Resources' },
  { to: '/news',               label: 'News' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">

          {/* Wordmark */}
          <Link to="/" className="flex items-baseline gap-2 shrink-0">
            <span className="font-display font-bold text-forest text-sm leading-none">
              Reclaiming Praxis
            </span>
            <span className="font-body text-[10px] text-muted tracking-widest uppercase hidden sm:block">
              Network
            </span>
          </Link>

          {/* Desktop nav — scrollable on medium screens */}
          <nav className="hidden lg:flex items-center gap-0.5 mx-4 overflow-x-auto">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `font-body text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-forest font-semibold bg-greenlight'
                      : 'text-muted hover:text-ink hover:bg-surface'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {/* Partner logos — only on very wide screens */}
            
            {/*
              <div className="hidden xl:flex items-center gap-3 pr-4 border-r border-border">
              <img src="/logos/aro-logo.png" alt="ARO"
                className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity" />
              <img src="/logos/uj-logo.png"  alt="UJ"
                className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity rounded" />
            </div>
            */}
            <Link to="/join" className="btn-join hidden sm:inline-flex py-2 px-4 text-xs">
              Join the Network
            </Link>
            <button
              className="lg:hidden p-2 text-muted hover:text-ink"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white px-6 py-4">
          <nav className="flex flex-col gap-1">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `font-body text-small px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-greenlight text-forest font-medium'
                      : 'text-body hover:bg-surface'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link to="/join" onClick={() => setOpen(false)}
              className="btn-join justify-center mt-3">
              Join the Network
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
