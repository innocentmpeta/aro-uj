import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, Circle } from 'lucide-react'
import { Programme } from '@arouj/types'
import ThemeBadge from './ThemeBadge'
import { SDGStrip } from './SDGBadge'
import { getProjectsByProgramme } from '../../data/mockData'

interface ProgrammeCardProps {
  programme: Programme
  variant?: 'default' | 'compact'
}

export default function ProgrammeCard({ programme, variant = 'default' }: ProgrammeCardProps) {
  const projects = getProjectsByProgramme(programme.id)

  if (variant === 'compact') {
    return (
      <Link
        to={`/praxis-in-action/programme/${programme.slug}`}
        className="group block bg-white rounded-2xl border border-border p-5
                   hover:border-forest transition-colors duration-200"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display font-bold text-ink text-small leading-snug
                         group-hover:text-forest transition-colors">
            {programme.name}
          </h3>
          <span className="font-body text-[10px] text-muted/60 shrink-0 bg-surface
                           px-2 py-0.5 rounded-full border border-border">
            {programme.wpReference}
          </span>
        </div>
        <p className="font-body text-xs text-muted leading-relaxed mb-3 line-clamp-2">
          {programme.summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-body text-xs text-muted">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </span>
          <ArrowRight size={13} className="text-forest opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      {/* Programme header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {programme.themes.map(t => <ThemeBadge key={t} theme={t} size="sm" />)}
          </div>
          <span className="font-body text-[10px] text-muted/60 shrink-0 bg-surface
                           px-2 py-0.5 rounded-full border border-border whitespace-nowrap">
            {programme.wpReference}
          </span>
        </div>
        <h3 className="font-display font-bold text-ink text-h3 mb-2 leading-snug">
          {programme.name}
        </h3>
        <p className="font-body text-small text-muted leading-relaxed mb-4">
          {programme.summary}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs font-body text-muted">
          <span>Led by {programme.wpLeader}</span>
          <span>·</span>
          <span>{programme.startDate} – {programme.endDate}</span>
          <span>·</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide
              ${programme.status === 'active' ? 'bg-greenlight text-forest' :
                programme.status === 'completed' ? 'bg-surface text-muted' :
                'bg-surface text-muted'}`}
          >
            {programme.status}
          </span>
        </div>
        {programme.sdgs.length > 0 && (
          <div className="mt-3">
            <SDGStrip sdgs={programme.sdgs} size="sm" max={6} />
          </div>
        )}
      </div>

      {/* Projects under this programme */}
      {projects.length > 0 && (
        <div className="divide-y divide-border">
          {projects.map(project => (
            <Link
              key={project.id}
              to={`/praxis-in-action/${project.slug}`}
              className="group flex items-center justify-between px-6 py-4
                         hover:bg-surface transition-colors"
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="font-body font-medium text-small text-ink mb-0.5
                                group-hover:text-forest transition-colors line-clamp-1">
                  {project.title}
                </div>
                <div className="font-body text-xs text-muted line-clamp-1">
                  {project.outcome}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-body text-xs text-muted">{project.years}</span>
                <ArrowRight size={13} className="text-forest opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
