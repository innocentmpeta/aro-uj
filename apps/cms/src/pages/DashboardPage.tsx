import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getCollection } from '../lib/firebase'
import { Card } from '../components/ui'

interface Counts { news: number; projects: number; team: number }

const QUICK_LINKS = [
  { to: '/cms/sections',       label: 'Manage page sections',      description: 'Turn sections on or off across the site',              priority: true },
  { to: '/cms/page-content',   label: 'Edit page text',            description: 'Update About page and Practicum text blocks',          priority: true },
  { to: '/cms/work-packages',  label: 'Edit work packages',        description: 'Update WP titles and summaries on the home page',      priority: true },
  { to: '/cms/news/new',       label: 'Add a news item',           description: 'Publish a new update or event',                       priority: false },
  { to: '/cms/projects/new',   label: 'Add a project',             description: 'Document a new network project',                      priority: false },
  { to: '/cms/stats',          label: 'Update homepage numbers',   description: 'Keep impact statistics current',                      priority: false },
]

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts>({ news: 0, projects: 0, team: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getCollection<{}>('news'),
      getCollection<{}>('projects'),
      getCollection<{}>('team'),
    ]).then(([news, projects, team]) => {
      setCounts({ news: news.length, projects: projects.length, team: team.length })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-body font-bold text-2xl text-ink">Dashboard</h1>
        <p className="font-body text-sm text-slate mt-1">Welcome to the ARO-UJ Praxis content manager.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'News items',    count: counts.news,     to: '/cms/news' },
          { label: 'Projects',      count: counts.projects, to: '/cms/projects' },
          { label: 'Team members',  count: counts.team,     to: '/cms/team' },
        ].map(({ label, count, to }) => (
          <Link key={to} to={to}>
            <Card className="p-5 hover:border-forest transition-colors">
              <div className="font-body font-bold text-2xl text-forest mb-1">{loading ? '—' : count}</div>
              <div className="font-body text-sm text-slate">{label}</div>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="font-body font-semibold text-sm text-slate uppercase tracking-wide mb-3">Quick actions</h2>
      <div className="space-y-2 mb-8">
        {QUICK_LINKS.map(({ to, label, description, priority }) => (
          <Link key={to} to={to}>
            <Card className={`p-4 hover:border-forest transition-colors flex items-center gap-4 ${priority ? 'border-forest/40 bg-greenlight/30' : ''}`}>
              <div className="flex-1">
                <div className="font-body font-semibold text-sm text-ink">{label}</div>
                <div className="font-body text-xs text-slate mt-0.5">{description}</div>
              </div>
              <ArrowRight size={16} className="text-slate shrink-0" />
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-5 bg-amber-50 border-amber-200">
        <h3 className="font-body font-semibold text-sm text-amber-800 mb-2 flex items-center gap-2">
          <AlertCircle size={15} /> Before publishing new content
        </h3>
        <ul className="space-y-1.5">
          {[
            'Make sure images are placed in apps/web/public/images/ in the correct folder',
            'For YouTube videos, paste the full link — the system extracts the ID automatically',
            'All items are saved as drafts first — toggle Published when ready to go live',
            'Content involving reclaimers needs ARO sign-off before publishing',
          ].map(item => (
            <li key={item} className="flex items-start gap-2 font-body text-xs text-amber-800">
              <CheckCircle2 size={12} className="shrink-0 mt-0.5 text-amber-600" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
