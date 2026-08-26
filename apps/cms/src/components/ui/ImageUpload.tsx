/**
 * ImageUpload component
 * ─────────────────────
 * Lets the content manager upload an image directly in the browser.
 * Compresses it client-side, then uploads to Firebase Storage and
 * returns the public download URL (stored on the Firestore document).
 *
 * Older documents may still hold a base64 data: URI from before this
 * component used Storage — those keep rendering fine everywhere
 * (SiteImage/PageHero just do <img src={value}>), they just aren't
 * migrated. New uploads always go to Storage.
 */

import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@arouj/firebase-config'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  /** Current image URL (or legacy base64 data URI), or null */
  value: string | null
  onChange: (url: string | null) => void
  label?: string
  hint?: string
  /** Show YouTube option alongside image upload */
  allowVideo?: boolean
  videoUrl?: string
  onVideoChange?: (url: string) => void
  mediaType?: 'image' | 'video'
  onMediaTypeChange?: (type: 'image' | 'video') => void
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,       // max 500KB after compression
  maxWidthOrHeight: 1400,
  useWebWorker: true,
  fileType: 'image/jpeg',
}

export function ImageUpload({
  value, onChange, label = 'Image', hint,
  allowVideo = false, videoUrl = '', onVideoChange,
  mediaType = 'image', onMediaTypeChange,
}: ImageUploadProps) {
  const [processing, setProcessing] = useState<'compressing' | 'uploading' | null>(null)
  const [error, setError]           = useState<string | null>(null)
  const inputRef                    = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)')
      return
    }

    // Validate raw size — reject anything over 15MB before compression
    if (file.size > 15 * 1024 * 1024) {
      setError('Image is too large. Please use an image under 15MB.')
      return
    }

    try {
      setProcessing('compressing')
      const compressed = await imageCompression(file, COMPRESSION_OPTIONS)

      setProcessing('uploading')
      const path = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, compressed)
      const url = await getDownloadURL(storageRef)

      onChange(url)
    } catch (err) {
      setError('Could not upload this image. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  function handleRemove() {
    // Best-effort cleanup — only for real Storage URLs, never for legacy base64 values
    if (value && value.startsWith('https://')) {
      deleteObject(ref(storage, value)).catch(() => { /* ignore — file may already be gone */ })
    }
    onChange(null)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  // ── YouTube vs Image toggle ────────────────────────────────────────────
  const showToggle = allowVideo && onMediaTypeChange && onVideoChange !== undefined

  return (
    <div className="space-y-3">
      <label className="block font-body text-xs font-semibold text-slate uppercase tracking-wide">
        {label}
      </label>

      {/* Media type toggle */}
      {showToggle && (
        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={mediaType === 'image'}
              onChange={() => onMediaTypeChange!('image')} className="accent-forest" />
            <span className="font-body text-sm text-ink">Upload an image</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={mediaType === 'video'}
              onChange={() => onMediaTypeChange!('video')} className="accent-forest" />
            <span className="font-body text-sm text-ink">Use a YouTube video</span>
          </label>
        </div>
      )}

      {/* YouTube input */}
      {mediaType === 'video' && onVideoChange && (
        <div className="space-y-1">
          <input
            type="text"
            value={videoUrl}
            onChange={e => onVideoChange(e.target.value)}
            placeholder="Paste the full YouTube link here — e.g. https://youtube.com/watch?v=..."
            className="w-full border border-border rounded-lg px-3 py-2.5 font-body text-sm
                       bg-white text-ink placeholder:text-slate/40
                       focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
          />
          <p className="font-body text-xs text-slate/60">
            The video ID is extracted automatically from the link.
          </p>
        </div>
      )}

      {/* Image uploader */}
      {mediaType === 'image' && (
        <>
          {value ? (
            /* Preview with remove button */
            <div className="relative rounded-xl overflow-hidden border border-border group">
              <img
                src={value}
                alt="Uploaded"
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30
                              transition-colors flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity
                             bg-white text-ink font-body text-xs font-medium px-3 py-1.5
                             rounded-lg flex items-center gap-1.5"
                >
                  <Upload size={12} /> Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="opacity-0 group-hover:opacity-100 transition-opacity
                             bg-red-600 text-white font-body text-xs font-medium px-3 py-1.5
                             rounded-lg flex items-center gap-1.5"
                >
                  <X size={12} /> Remove
                </button>
              </div>
            </div>
          ) : (
            /* Drop zone */
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8
                         hover:border-forest hover:bg-greenlight/30 transition-colors
                         cursor-pointer text-center"
            >
              {processing ? (
                <div className="space-y-2">
                  <div className="w-8 h-8 border-2 border-forest border-t-transparent
                                  rounded-full animate-spin mx-auto" />
                  <p className="font-body text-sm text-slate">
                    {processing === 'compressing' ? 'Compressing image…' : 'Uploading…'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-surface rounded-xl w-fit mx-auto">
                    <ImageIcon size={20} className="text-muted" />
                  </div>
                  <p className="font-body text-sm font-medium text-ink">
                    Click to upload or drag and drop
                  </p>
                  <p className="font-body text-xs text-slate">
                    JPG, PNG, WebP — max 15MB (will be compressed automatically)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleInput}
          />

          {/* Error */}
          {error && (
            <p className="font-body text-xs text-red-600">{error}</p>
          )}

          {/* Hint */}
          {hint && !error && (
            <p className="font-body text-xs text-slate/60">{hint}</p>
          )}
        </>
      )}
    </div>
  )
}
