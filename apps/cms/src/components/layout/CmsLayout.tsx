import { ReactNode } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '@arouj/firebase-config'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Newspaper, Folder, BookOpen,
  FileText, Users, BarChart2, Settings,
  LogOut, ChevronRight, Layers, Package, Building2,
  Home, Info, HeartHandshake, GraduationCap, Compass,
  Handshake, ShieldCheck, Route as RouteIcon,
} from 'lucide-react'

const NAV_GROUPS: { label: string; items: { to: string; icon: any; label: string; end?: boolean }[] }[] = [
  {
    label: 'Overview',
    items: [
      { to: '/cms',          icon: LayoutDashboard, label: 'Dashboard',     end: true },
      { to: '/cms/sections', icon: Layers,          label: 'Page Sections' },
    ],
  },
  {
    label: 'Page Content',
    items: [
      { to: '/cms/content/home',             icon: Home,           label: 'Home Page' },
      { to: '/cms/content/about',            icon: Info,           label: 'About Page' },
      { to: '/cms/content/reclaimers',       icon: HeartHandshake, label: 'Reclaimers Page' },
      { to: '/cms/content/projects',         icon: Folder,         label: 'Projects Page' },
      { to: '/cms/content/approach',         icon: Compass,        label: 'Approach Page' },
      { to: '/cms/content/publications',     icon: BookOpen,       label: 'Publications Page' },
      { to: '/cms/content/student-research', icon: GraduationCap,  label: 'Student Research Page' },
      { to: '/cms/content/resources',        icon: FileText,       label: 'Resources Page' },
      { to: '/cms/content/news',             icon: Newspaper,      label: 'News Page' },
      { to: '/cms/content/join',             icon: Handshake,      label: 'Join Page' },
    ],
  },
  {
    label: 'Collections',
    items: [
      { to: '/cms/news',               icon: Newspaper,      label: 'News & Updates' },
      { to: '/cms/projects',           icon: Folder,         label: 'Network Projects' },
      { to: '/cms/work-packages',      icon: Package,        label: 'Work Packages' },
      { to: '/cms/team',               icon: Users,          label: 'Team Members' },
      { to: '/cms/partners',           icon: Handshake,      label: 'Partners & Funders' },
      { to: '/cms/student-principles', icon: ShieldCheck,    label: 'Student Research Principles' },
      { to: '/cms/join-pathways',      icon: RouteIcon,      label: 'Join Pathways' },
      { to: '/cms/faculties',          icon: Building2,      label: 'Faculties & Depts' },
      { to: '/cms/research',           icon: BookOpen,       label: 'Publications (items)' },
      { to: '/cms/resources',          icon: FileText,       label: 'Free Downloads' },
    ],
  },
  {
    label: 'Site',
    items: [
      { to: '/cms/stats',    icon: BarChart2, label: 'Homepage Numbers' },
      { to: '/cms/settings', icon: Settings,  label: 'Site Settings' },
    ],
  },
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
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <div className="px-3 mb-1 font-body text-[10px] font-semibold uppercase
                              tracking-widest text-white/30">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map(({ to, icon: Icon, label, end }) => (
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
              </div>
            </div>
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
