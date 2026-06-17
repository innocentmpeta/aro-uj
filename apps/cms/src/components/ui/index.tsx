import { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

// ── Button ─────────────────────────────────────────────────────────────────
interface BtnProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'danger' | 'ghost' | 'outline'
  loading?: boolean
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md'
}

export function Btn({
  children, onClick, type = 'button', variant = 'primary',
  loading, disabled, className = '', size = 'md'
}: BtnProps) {
  const base = 'inline-flex items-center gap-2 font-body font-medium rounded-lg transition-colors'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' }
  const variants = {
    primary: 'bg-forest text-white hover:bg-midgreen disabled:opacity-50',
    danger:  'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
    ghost:   'text-slate hover:bg-mist disabled:opacity-40',
    outline: 'border border-border text-ink hover:bg-surface disabled:opacity-40',
  }
  return (
    <button
      type={type} onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}

// ── Field wrapper ──────────────────────────────────────────────────────────
interface FieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
}

export function Field({ label, hint, error, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block font-body text-xs font-semibold text-slate uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="font-body text-xs text-slate/60">{hint}</p>}
      {error && <p className="font-body text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ── Input ──────────────────────────────────────────────────────────────────
export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full border border-border rounded-lg px-3 py-2.5 font-body text-sm
        bg-white text-ink placeholder:text-slate/40
        focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest
        disabled:bg-surface disabled:cursor-not-allowed transition-colors ${className}`}
      {...props}
    />
  )
}

// ── Textarea ───────────────────────────────────────────────────────────────
export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full border border-border rounded-lg px-3 py-2.5 font-body text-sm
        bg-white text-ink placeholder:text-slate/40
        focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest
        resize-none transition-colors ${className}`}
      {...props}
    />
  )
}

// ── Select ─────────────────────────────────────────────────────────────────
export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={`w-full border border-border rounded-lg px-3 py-2.5 font-body text-sm
        bg-white text-ink focus:outline-none focus:ring-2 focus:ring-forest/30
        focus:border-forest transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

// ── Toggle switch ──────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean
  onChange: (val: boolean) => void
  label?: string
  description?: string
  size?: 'sm' | 'md'
}

export function Toggle({ checked, onChange, label, description, size = 'md' }: ToggleProps) {
  const trackW = size === 'sm' ? 'w-8' : 'w-11'
  const trackH = size === 'sm' ? 'h-4' : 'h-6'
  const knobSz = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const translate = size === 'sm'
    ? (checked ? 'translate-x-4' : 'translate-x-0.5')
    : (checked ? 'translate-x-5' : 'translate-x-1')

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex shrink-0 ${trackW} ${trackH} items-center
          rounded-full border-2 border-transparent transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-forest/40 focus:ring-offset-1
          ${checked ? 'bg-forest' : 'bg-slate/25'}`}
      >
        <span className={`${knobSz} rounded-full bg-white shadow transition-transform
          duration-200 ${translate}`} />
      </button>
      {(label || description) && (
        <div>
          {label && <div className="font-body text-sm font-medium text-ink">{label}</div>}
          {description && <div className="font-body text-xs text-slate/60 mt-0.5">{description}</div>}
        </div>
      )}
    </div>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-border shadow-sm ${className}`}>
      {children}
    </div>
  )
}

// ── Section heading ────────────────────────────────────────────────────────
export function SectionHead({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-body font-bold text-xl text-ink">{title}</h1>
      {description && <p className="font-body text-sm text-slate mt-1">{description}</p>}
    </div>
  )
}

// ── Status badge ───────────────────────────────────────────────────────────
export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-body text-xs font-semibold
      px-2.5 py-0.5 rounded-full ${published
        ? 'bg-green-50 text-green-700'
        : 'bg-amber-50 text-amber-700'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${published ? 'bg-green-500' : 'bg-amber-400'}`} />
      {published ? 'Published' : 'Draft'}
    </span>
  )
}

// ── Confirm dialog ─────────────────────────────────────────────────────────
interface ConfirmProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger }: ConfirmProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <h3 className="font-body font-bold text-base text-ink mb-2">{title}</h3>
        <p className="font-body text-sm text-slate mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
          <Btn variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────
export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="text-center py-16 border border-dashed border-border rounded-2xl">
      <p className="font-body text-sm text-slate mb-4">{message}</p>
      {action}
    </div>
  )
}

// ── Toast notification ─────────────────────────────────────────────────────
export function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg
      font-body text-sm font-medium text-white
      ${type === 'success' ? 'bg-forest' : 'bg-red-600'}`}>
      {message}
    </div>
  )
}

// ── Media input — image upload OR YouTube link ─────────────────────────────
interface MediaInputProps {
  mediaType: 'image' | 'video'
  imagePath: string
  videoUrl: string
  onMediaTypeChange: (type: 'image' | 'video') => void
  onImageChange: (path: string) => void
  onVideoChange: (url: string) => void
  imageFolder: string // e.g. 'news', 'projects'
  allowVideo?: boolean
}

export function MediaInput({
  mediaType, imagePath, videoUrl,
  onMediaTypeChange, onImageChange, onVideoChange,
  imageFolder, allowVideo = true
}: MediaInputProps) {
  return (
    <div className="space-y-3">
      {allowVideo && (
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={mediaType === 'image'}
              onChange={() => onMediaTypeChange('image')}
              className="accent-forest" />
            <span className="font-body text-sm text-ink">Upload an image</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={mediaType === 'video'}
              onChange={() => onMediaTypeChange('video')}
              className="accent-forest" />
            <span className="font-body text-sm text-ink">Use a YouTube video</span>
          </label>
        </div>
      )}

      {mediaType === 'image' ? (
        <div className="space-y-2">
          <Input
            placeholder={`e.g. /images/${imageFolder}/my-photo.jpg`}
            value={imagePath}
            onChange={e => onImageChange(e.target.value)}
          />
          <p className="font-body text-xs text-slate/60">
            Drop your image into <code className="bg-surface px-1 rounded">apps/web/public/images/{imageFolder}/</code> then type the filename above.
          </p>
          {imagePath && (
            <img src={imagePath} alt="Preview"
              className="h-24 w-auto rounded-lg border border-border object-cover mt-1"
              onError={e => (e.currentTarget.style.display = 'none')} />
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            placeholder="Paste the full YouTube link here"
            value={videoUrl}
            onChange={e => onVideoChange(e.target.value)}
          />
          <p className="font-body text-xs text-slate/60">
            e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ
          </p>
        </div>
      )}
    </div>
  )
}
