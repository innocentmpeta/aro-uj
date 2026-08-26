import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import { getDocument, setDocument } from '../lib/firebase'
import { Btn, Card, Field, Textarea, Input, SectionHead, Toast } from '../components/ui'
import { ImageUpload } from '../components/ui/ImageUpload'

interface Block {
  key: string
  label: string
  hint: string
  multiline: boolean
}

interface PageConfig {
  docId: string
  title: string
  description: string
  heroImage?: boolean
  blocks: Block[]
}

// ── One entry per manageable page — the URL slug is the key ────────────────
export const PAGE_CONFIGS: Record<string, PageConfig> = {
  home: {
    docId: 'homePage',
    title: 'Home Page',
    description: 'Edit the hero, "about the network" intro, and reclaimer quote shown on the home page.',
    heroImage: true,
    blocks: [
      { key: 'hero_title',    label: 'Hero headline',            hint: 'The large headline over the home page photo.',            multiline: true },
      { key: 'hero_lead',     label: 'Hero subheading',          hint: 'The sentence below the headline.',                        multiline: true },
      { key: 'about_heading', label: '"About the network" heading', hint: 'Heading above the two-column intro section.',          multiline: false },
      { key: 'about_lead',    label: '"About the network" lead paragraph', hint: 'The larger intro sentence.',                    multiline: true },
      { key: 'about_body',    label: '"About the network" second paragraph', hint: 'The "praxis" explanation paragraph.',         multiline: true },
      { key: 'quote_text',    label: 'Reclaimer quote',          hint: 'Shown in the full-width green quote block (without quotation marks).', multiline: true },
      { key: 'quote_cite',    label: 'Quote attribution',        hint: 'e.g. "Mantoa K., ARO member, Selby sorting depot"',        multiline: false },
    ],
  },
  about: {
    docId: 'aboutPage',
    title: 'About Page',
    description: 'Edit the key text blocks on the About page. Structural content (principles, pillars, SDGs) remains in code.',
    heroImage: true,
    blocks: [
      { key: 'hero_title', label: 'Hero headline',            hint: 'The main heading on the About page.',                                multiline: true },
      { key: 'hero_lead',  label: 'Hero subheading',          hint: 'The sentence below the headline.',                                   multiline: true },
      { key: 'intro_p1',   label: 'Intro paragraph 1',        hint: 'Describes the network, its partners, and funding.',                  multiline: true },
      { key: 'intro_p2',   label: 'Intro paragraph 2',        hint: 'The network\'s aim and broader significance.',                        multiline: true },
      { key: 'intro_p3',   label: 'Intro paragraph 3',        hint: 'Funding raised and co-funding details.',                             multiline: true },
      { key: 'ges_body',   label: 'GES 4.0 SI section text',  hint: 'Describes the GES 4.0 SI programme and what it means for the network.', multiline: true },
      { key: 'team_intro', label: 'Team section intro',        hint: 'Short sentence under "Network team" heading.',                       multiline: false },
    ],
  },
  reclaimers: {
    docId: 'reclaimersPage',
    title: 'Reclaimers Page',
    description: 'Edit the text blocks on the Reclaimers page. For multi-paragraph fields, leave a blank line between paragraphs.',
    heroImage: true,
    blocks: [
      { key: 'hero_lead',              label: 'Hero subheading',            hint: 'The sentence below "Reclaimers" in the hero.',       multiline: true },
      { key: 'understanding_heading',  label: '"Understanding reclaimers" heading', hint: '',                                          multiline: false },
      { key: 'understanding_body',     label: '"Understanding reclaimers" text',    hint: 'Leave a blank line between paragraphs.',     multiline: true },
      { key: 'challenges_heading',     label: '"Systemic challenges" heading',      hint: 'One line per line-break in the heading.',    multiline: true },
      { key: 'challenges_intro',       label: '"Systemic challenges" intro text',   hint: '',                                          multiline: true },
      { key: 'quote_text',             label: 'Reclaimer quote',                    hint: 'Shown in the full-width green quote block (without quotation marks).', multiline: true },
      { key: 'quote_cite',             label: 'Quote attribution',                  hint: 'e.g. "ARO member, Johannesburg"',            multiline: false },
      { key: 'aro_heading',            label: '"About ARO" heading',                hint: '',                                          multiline: false },
      { key: 'aro_body',               label: '"About ARO" text',                   hint: 'Leave a blank line between paragraphs.',     multiline: true },
    ],
  },
  projects: {
    docId: 'projectsPage',
    title: 'Projects Page',
    description: 'Edit the hero and intro text on the Projects page (formerly "Praxis in Action"). Work packages themselves are managed under Work Packages.',
    heroImage: true,
    blocks: [
      { key: 'hero_title', label: 'Hero headline', hint: '', multiline: true },
      { key: 'hero_lead',  label: 'Hero subheading', hint: '', multiline: true },
      { key: 'intro_text', label: 'Intro text', hint: 'Sentence above the work packages list.', multiline: true },
    ],
  },
  approach: {
    docId: 'approachPage',
    title: 'Approach Page',
    description: 'Edit the hero text on the Approach page. The praxis cycle and five pillars remain in code for this pass.',
    heroImage: true,
    blocks: [
      { key: 'hero_title', label: 'Hero headline', hint: '', multiline: true },
      { key: 'hero_lead',  label: 'Hero subheading', hint: '', multiline: true },
    ],
  },
  publications: {
    docId: 'publicationsPage',
    title: 'Publications Page',
    description: 'Edit the hero text on the Publications page. Individual publications are managed under Publications (list); the CrossRef intro paragraph stays in code since it contains a live link.',
    heroImage: true,
    blocks: [
      { key: 'hero_title', label: 'Hero headline', hint: '', multiline: true },
      { key: 'hero_lead',  label: 'Hero subheading', hint: '', multiline: true },
    ],
  },
  'student-research': {
    docId: 'practicumPage',
    title: 'Student Research Page',
    description: 'Edit the "who can apply" intro and faculty list. One faculty per line in the faculty list field.',
    heroImage: true,
    blocks: [
      { key: 'who_can_apply',   label: '"Who can participate" text', hint: 'Paragraph explaining which students can apply and why.', multiline: true },
      { key: 'faculties_list',  label: 'Faculty list (one per line)', hint: 'e.g.\nFADA — Art, Design & Architecture\nLaw\nEngineering & Built Environment (FEBE)', multiline: true },
    ],
  },
  resources: {
    docId: 'resourcesPage',
    title: 'Resources Page',
    description: 'Edit the hero and intro text on the Teaching Resources page. Individual downloads are managed under Free Downloads.',
    heroImage: true,
    blocks: [
      { key: 'hero_title', label: 'Hero headline', hint: '', multiline: true },
      { key: 'hero_lead',  label: 'Hero subheading', hint: '', multiline: true },
      { key: 'intro_p1',   label: 'Intro paragraph', hint: 'Licensing / usage terms. (The "contact us to request a resource" line below it stays in code, since it contains a live email link.)', multiline: true },
    ],
  },
  news: {
    docId: 'newsPage',
    title: 'News Page',
    description: 'Edit the hero text on the News page. Individual articles are managed under News & Updates.',
    heroImage: true,
    blocks: [
      { key: 'hero_title', label: 'Hero headline', hint: '', multiline: true },
      { key: 'hero_lead',  label: 'Hero subheading', hint: '', multiline: true },
    ],
  },
  join: {
    docId: 'joinPage',
    title: 'Join Page',
    description: 'Edit the hero and contact-form intro text on the Join page. The pathway cards are managed under Join Pathways.',
    heroImage: true,
    blocks: [
      { key: 'hero_title',  label: 'Hero headline', hint: '', multiline: true },
      { key: 'hero_lead',   label: 'Hero subheading', hint: '', multiline: true },
      { key: 'form_intro',  label: 'Contact form intro text', hint: 'Sentence above the "Send us a message" form.', multiline: true },
    ],
  },
}

type FormState = Record<string, string>

export default function PageContentPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const config = pageId ? PAGE_CONFIGS[pageId] : undefined

  const [form, setForm]           = useState<FormState>({})
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [loaded, setLoaded]       = useState(false)
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    if (!config) return
    setLoaded(false)
    getDocument<FormState & { heroImage?: string | null }>('siteConfig', config.docId).then(doc => {
      const init: FormState = {}
      config.blocks.forEach(b => { init[b.key] = doc?.[b.key] ?? '' })
      setForm(init)
      setHeroImage(doc?.heroImage ?? null)
      setLoaded(true)
    })
  }, [pageId])

  function setField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    if (!config) return
    setSaving(true)
    try {
      await setDocument('siteConfig', config.docId, { ...form, heroImage })
      showToast('Saved successfully', 'success')
    } catch {
      showToast('Could not save — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!config) return <Navigate to="/cms/content/home" replace />

  return (
    <div className="space-y-6">
      <SectionHead title={config.title} description={config.description} />

      <Card className="overflow-hidden">
        <div className="px-5 py-4 bg-surface border-b border-border flex items-center justify-between">
          <p className="font-body text-xs text-slate/60">Changes go live immediately.</p>
          <Btn variant="primary" size="sm" loading={saving} disabled={!loaded} onClick={handleSave}>
            <Save size={13} /> Save
          </Btn>
        </div>

        <div className="p-5 space-y-5">
          {!loaded && (
            <p className="font-body text-sm text-slate/50">Loading current content…</p>
          )}
          {loaded && config.heroImage && (
            <ImageUpload
              value={heroImage}
              onChange={setHeroImage}
              label="Hero image"
              hint="Replaces the default hero photo for this page. Leave empty to keep the current default."
            />
          )}
          {loaded && config.blocks.map(block => (
            <Field key={block.key} label={block.label} hint={block.hint}>
              {block.multiline ? (
                <Textarea
                  rows={block.key === 'faculties_list' ? 8 : (block.key.endsWith('_body') ? 8 : 4)}
                  value={form[block.key] ?? ''}
                  onChange={e => setField(block.key, e.target.value)}
                  placeholder={block.hint}
                />
              ) : (
                <Input
                  value={form[block.key] ?? ''}
                  onChange={e => setField(block.key, e.target.value)}
                  placeholder={block.hint}
                />
              )}
            </Field>
          ))}
        </div>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
