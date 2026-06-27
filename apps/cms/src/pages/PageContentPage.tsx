import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { getDocument, setDocument } from '../lib/firebase'
import { Btn, Card, Field, Textarea, Input, SectionHead, Toast } from '../components/ui'

// ── Editable content blocks per page ─────────────────────────────────────
interface Block {
  key: string
  label: string
  hint: string
  multiline: boolean
}

const PAGE_CONFIGS: { id: string; title: string; description: string; blocks: Block[] }[] = [
  {
    id: 'aboutPage',
    title: 'About Page',
    description: 'Edit the key text blocks on the About page. Structural content (principles, pillars, SDGs) remains in code.',
    blocks: [
      { key: 'intro_p1',   label: 'Intro paragraph 1',        hint: 'Describes the network, its partners, and funding.',                  multiline: true },
      { key: 'intro_p2',   label: 'Intro paragraph 2',        hint: 'The network\'s aim and broader significance.',                        multiline: true },
      { key: 'intro_p3',   label: 'Intro paragraph 3',        hint: 'Funding raised and co-funding details.',                             multiline: true },
      { key: 'ges_body',   label: 'GES 4.0 SI section text',  hint: 'Describes the GES 4.0 SI programme and what it means for the network.', multiline: true },
      { key: 'team_intro', label: 'Team section intro',        hint: 'Short sentence under "Network team" heading.',                       multiline: false },
    ],
  },
  {
    id: 'practicumPage',
    title: 'Student Practicum Page',
    description: 'Edit the faculty list and "who can apply" intro. One faculty per line in the faculty list field.',
    blocks: [
      { key: 'who_can_apply',   label: '"Who can participate" text', hint: 'Paragraph explaining which students can apply and why.', multiline: true },
      { key: 'faculties_list',  label: 'Faculty list (one per line)', hint: 'e.g.\nFADA — Art, Design & Architecture\nLaw\nEngineering & Built Environment (FEBE)', multiline: true },
    ],
  },
]

type FormState = Record<string, string>

export default function PageContentPage() {
  const [forms, setForms]   = useState<Record<string, FormState>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast]   = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    PAGE_CONFIGS.forEach(async ({ id, blocks }) => {
      const doc = await getDocument<FormState>('siteConfig', id)
      const init: FormState = {}
      blocks.forEach(b => { init[b.key] = doc?.[b.key] ?? '' })
      setForms(prev => ({ ...prev, [id]: init }))
    })
  }, [])

  function setField(pageId: string, key: string, value: string) {
    setForms(prev => ({
      ...prev,
      [pageId]: { ...(prev[pageId] ?? {}), [key]: value },
    }))
  }

  async function handleSave(pageId: string) {
    setSaving(pageId)
    try {
      await setDocument('siteConfig', pageId, forms[pageId] ?? {})
      showToast('Saved successfully', 'success')
    } catch {
      showToast('Could not save — please try again', 'error')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-10">
      <SectionHead
        title="Page Content"
        description="Edit key text blocks on specific pages. Changes go live immediately."
      />

      {PAGE_CONFIGS.map(({ id, title, description, blocks }) => (
        <Card key={id} className="overflow-hidden">
          <div className="px-5 py-4 bg-surface border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-body font-bold text-sm text-ink">{title}</h2>
              <p className="font-body text-xs text-slate/60 mt-0.5">{description}</p>
            </div>
            <Btn
              variant="primary"
              size="sm"
              loading={saving === id}
              onClick={() => handleSave(id)}
            >
              <Save size={13} /> Save {title}
            </Btn>
          </div>

          <div className="p-5 space-y-5">
            {blocks.map(block => (
              <Field key={block.key} label={block.label} hint={block.hint}>
                {block.multiline ? (
                  <Textarea
                    rows={block.key === 'faculties_list' ? 8 : 4}
                    value={forms[id]?.[block.key] ?? ''}
                    onChange={e => setField(id, block.key, e.target.value)}
                    placeholder={block.hint}
                  />
                ) : (
                  <Input
                    value={forms[id]?.[block.key] ?? ''}
                    onChange={e => setField(id, block.key, e.target.value)}
                    placeholder={block.hint}
                  />
                )}
              </Field>
            ))}
          </div>
        </Card>
      ))}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
