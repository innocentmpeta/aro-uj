import { useEffect, useState } from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { setDocument, getDocument } from '../lib/firebase'
import { Toggle, Card, SectionHead, Btn, Toast } from '../components/ui'

// Every toggleable section across the site
const SECTIONS = [
  {
    page: 'Home',
    items: [
      { key: 'home_hero',         label: 'Hero banner',          description: 'The full-screen image and headline at the top of the home page' },
      { key: 'home_stats',        label: 'Impact numbers',        description: 'The six statistics strip below the hero' },
      { key: 'home_about',        label: 'About intro',           description: 'The two-column "equal partnership" section' },
      { key: 'home_partners_strip', label: 'Partner identity strip',  description: 'The ARO and UJ logo + one-line description cards below the stats' },
      { key: 'home_workpackages',   label: 'Work packages grid',      description: 'The 10 work package cards — click through to Praxis in Action' },
      { key: 'home_story',        label: 'Featured story',        description: 'The large story card with photo, quote, and video' },
      { key: 'home_quote',        label: 'Reclaimer quote block', description: 'The full-width green quote section' },
      { key: 'home_projects',     label: 'Recent projects',       description: 'The three-column project card grid' },
      { key: 'home_news',         label: 'Latest news',           description: 'The news article grid' },
      { key: 'home_join',         label: 'Join the network CTA',  description: 'The bottom call-to-action section' },
    ]
  },
  {
    page: 'The Reclaimers',
    items: [
      { key: 'reclaimers_stats',      label: 'Statistics',        description: 'The four impact stat cards' },
      { key: 'reclaimers_what',       label: 'What reclaimers do', description: 'The four cards — collect, sort, sell, sustain' },
      { key: 'reclaimers_challenges', label: 'Systemic challenges', description: 'The challenges list with photo' },
      { key: 'reclaimers_quote',      label: 'Reclaimer quote',   description: 'The green quote section' },
      { key: 'reclaimers_aro',        label: 'About ARO section', description: 'The ARO organisation description and ARO website link' },
    ]
  },
  {
    page: 'Praxis in Action',
    items: [
      { key: 'praxis_cycle',      label: 'How it works',          description: 'The four-step praxis cycle cards' },
      { key: 'praxis_story',      label: 'Featured story',        description: 'The story preview section' },
    ]
  },
  {
    page: 'About',
    items: [
      { key: 'about_aim',         label: 'Aim & Impact statement', description: 'The green full-width aim section' },
      { key: 'about_ges',         label: 'GES 4.0 SI section',     description: 'Funding programme details and duration box — new section' },
      { key: 'about_pillars',     label: 'Five pillars',            description: 'Research, Teaching, Policy, Capacity-Building, Innovation' },
      { key: 'about_sdgs',        label: 'SDG icons',               description: 'The United Nations SDG section' },
      { key: 'about_principles',  label: 'Principles list',         description: 'The ten engagement principles' },
      { key: 'about_team',        label: 'Team members',            description: 'The full team grid' },
      { key: 'about_kuleuven',    label: 'KU Leuven section',       description: 'International partnership — hide this: KU Leuven not currently active' },
      { key: 'about_partners',    label: 'Partners & funders',      description: 'Partners grid — consider hiding until list is reviewed' },
    ]
  },
  {
    page: 'Student Practicum',
    items: [
      { key: 'practicum_who',     label: 'Who can apply',         description: 'The faculty grid section' },
      { key: 'practicum_how',     label: 'How it works',          description: 'The five-step process' },
      { key: 'practicum_past',    label: 'Past highlights',       description: 'Previous practicum project cards' },
      { key: 'practicum_ethics',  label: 'Ethical principles',    description: 'The four ethical principle cards' },
    ]
  },
  {
    page: 'Praxis in Action — Work Packages',
    items: [
      { key: 'prog_wp1',  label: 'Network Coordination (WP1)',          description: 'Auto-hidden if no projects — toggle off to hide even with projects' },
      { key: 'prog_wp2',  label: 'ARO Public Engagement (WP2)',         description: 'Auto-hidden if no projects — toggle off to hide even with projects' },
      { key: 'prog_wp3',  label: 'ARO-UJ Youth Camp (WP3)',            description: 'Auto-hidden if no projects — toggle off to hide even with projects' },
      { key: 'prog_wp4',  label: 'Professionalising the Warehouse (WP4)', description: 'Auto-hidden if no projects — toggle off to hide even with projects' },
      { key: 'prog_wp5',  label: 'Landfill Closures & Just Transition (WP5)', description: 'Auto-hidden if no projects — toggle off to hide even with projects' },
      { key: 'prog_wp6',  label: 'Alternative Employment (WP6)',        description: 'Auto-hidden if no projects — toggle off to hide even with projects' },
      { key: 'prog_wp7',  label: 'Advancing Sustainability at UJ (WP7)', description: 'Auto-hidden if no projects — toggle off to hide even with projects' },
      { key: 'prog_wp8',  label: 'Reclaimer Health & Wellbeing (WP8)', description: 'Auto-hidden if no projects — toggle off to hide even with projects' },
      { key: 'prog_wp9',  label: 'Justice for Migrant Reclaimers (WP9)', description: 'Auto-hidden if no projects — toggle off to hide even with projects' },
      { key: 'prog_wp10', label: 'Gender Justice & Reclaiming (WP10)', description: 'Auto-hidden if no projects — toggle off to hide even with projects' },
    ]
  },
]

// Default all sections to visible
const DEFAULT_STATE: Record<string, boolean> = {}
SECTIONS.forEach(page => page.items.forEach(item => { DEFAULT_STATE[item.key] = true }))

export default function SectionsPage() {
  const [sections, setSections] = useState<Record<string, boolean>>(DEFAULT_STATE)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [confirmKey, setConfirmKey] = useState<string | null>(null)

  useEffect(() => {
    getDocument<Record<string, boolean>>('siteConfig', 'sections').then(doc => {
      if (doc) setSections({ ...DEFAULT_STATE, ...doc })
    })
  }, [])

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleToggle(key: string, newValue: boolean) {
    // Turning OFF requires confirmation
    if (!newValue) {
      setConfirmKey(key)
      return
    }
    await applyToggle(key, true)
  }

  async function applyToggle(key: string, value: boolean) {
    const updated = { ...sections, [key]: value }
    setSections(updated)
    setConfirmKey(null)
    setSaving(true)
    try {
      await setDocument('siteConfig', 'sections', updated)
      showToast(value ? 'Section turned on' : 'Section turned off', 'success')
    } catch {
      showToast('Could not save — please try again', 'error')
      setSections(sections) // revert
    } finally {
      setSaving(false)
    }
  }

  const confirmItem = confirmKey
    ? SECTIONS.flatMap(p => p.items).find(i => i.key === confirmKey)
    : null

  const hiddenCount = Object.values(sections).filter(v => !v).length

  return (
    <div>
      <SectionHead
        title="Page Sections"
        description="Turn individual sections on or off across the website. Visitors won't see sections that are turned off."
      />

      {hiddenCount > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200
          rounded-xl px-4 py-3 mb-6 font-body text-sm text-amber-800">
          <EyeOff size={15} />
          {hiddenCount} section{hiddenCount !== 1 ? 's are' : ' is'} currently hidden from visitors
        </div>
      )}

      <div className="space-y-6">
        {SECTIONS.map(({ page, items }) => (
          <Card key={page} className="overflow-hidden">
            {/* Page header */}
            <div className="px-5 py-3 bg-surface border-b border-border">
              <h2 className="font-body font-semibold text-sm text-ink">{page}</h2>
            </div>

            {/* Section rows */}
            <div className="divide-y divide-border">
              {items.map(({ key, label, description }) => (
                <div key={key} className="px-5 py-4 flex items-center gap-4">
                  {/* Status icon */}
                  <div className="shrink-0">
                    {sections[key]
                      ? <Eye size={15} className="text-forest" />
                      : <EyeOff size={15} className="text-slate/40" />}
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-body font-medium text-sm ${sections[key] ? 'text-ink' : 'text-slate/50'}`}>
                      {label}
                    </div>
                    <div className="font-body text-xs text-slate/50 mt-0.5 truncate">
                      {description}
                    </div>
                  </div>

                  {/* Toggle */}
                  <div className="shrink-0">
                    <Toggle
                      size="sm"
                      checked={sections[key]}
                      onChange={val => handleToggle(key, val)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Confirm turn-off dialog */}
      {confirmKey && confirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmKey(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle size={18} className="text-amber-600" />
              </div>
              <h3 className="font-body font-bold text-base text-ink">Hide this section?</h3>
            </div>
            <p className="font-body text-sm text-slate mb-2">
              <strong className="text-ink">"{confirmItem.label}"</strong> will be hidden from all visitors.
            </p>
            <p className="font-body text-sm text-slate mb-6">
              You can turn it back on at any time from this page.
            </p>
            <div className="flex gap-3 justify-end">
              <Btn variant="ghost" onClick={() => setConfirmKey(null)}>Cancel</Btn>
              <Btn variant="danger" onClick={() => applyToggle(confirmKey, false)}>
                Yes, hide it
              </Btn>
            </div>
          </div>
        </div>
      )}

      {saving && (
        <div className="fixed bottom-6 right-6 bg-ink text-white text-sm
          font-body px-4 py-2 rounded-xl shadow-lg">
          Saving…
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
