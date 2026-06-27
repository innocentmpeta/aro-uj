import { ReactNode } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '@arouj/firebase-config'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Newspaper, Folder, BookOpen,
  FileText, Users, BarChart2, Settings,
  LogOut, ChevronRight, Layers, Package
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/cms',                icon: LayoutDashboard, label: 'Dashboard',           end: true },
  { to: '/cms/sections',       icon: Layers,          label: 'Page Sections',       end: false },
  { to: '/cms/news',           icon: Newspaper,       label: 'News & Updates',      end: false },
  { to: '/cms/projects',       icon: Folder,          label: 'Network Projects',    end: false },
  { to: '/cms/work-packages',  icon: Package,         label: 'Work Packages',       end: false },
  { to: '/cms/team',           icon: Users,           label: 'Team Members',        end: false },
  { to: '/cms/research',       icon: BookOpen,        label: 'Research',            end: false },
  { to: '/cms/resources',      icon: FileText,        label: 'Free Downloads',      end: false },
  { to: '/cms/stats',          icon: BarChart2,       label: 'Homepage Numbers',    end: false },
  { to: '/cms/settings',       icon: Settings,        label: 'Site Settings',       end: false },
]

export default function CmsLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex bg-surface">

      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-ink flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link to="/cms" className="block">
            <div className="font-body font-bold text-white text-sm">ARO-UJ Praxis</div>
            <div className="font-body text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
              Content Manager
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm
                transition-colors ${isActive
                  ? 'bg-forest text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'}`
              }
            >
              <Icon size={15} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-100" />
            </NavLink>
          ))}
        </nav>

        {/* User + sign out */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="font-body text-xs text-white/40 px-3 mb-2 truncate">
            {user?.email}
          </div>
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg font-body text-sm
              text-white/60 hover:text-white hover:bg-white/10 transition-colors w-full"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
