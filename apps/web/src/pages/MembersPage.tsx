import { signOut } from 'firebase/auth'
import { auth } from '@arouj/firebase-config'
import { FolderOpen, LogOut, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// [Placeholder — replace with the real shared Google Drive folder link]
const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/REPLACE_WITH_FOLDER_ID'

export default function MembersPage() {
  const { user } = useAuth()

  return (
    <div className="bg-white min-h-[70vh]">
      <section className="section-sm bg-surface border-b border-border">
        <div className="container flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-eyebrow mb-1">Member area</p>
            <h1 className="font-display font-bold text-ink text-h2">Welcome{user?.email ? `, ${user.email}` : ''}</h1>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="btn-outline text-sm"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-2xl">
          <p className="section-eyebrow">Shared media</p>
          <h2 className="section-heading">Photos & videos</h2>
          <p className="text-body text-muted mb-8">
            All photos and videos from network events, projects, and campaigns are kept in a
            shared Google Drive folder for members.
          </p>
          <a
            href={DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-6 rounded-2xl border-2 border-forest
                       hover:bg-forest transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <FolderOpen size={28} className="text-forest group-hover:text-white transition-colors shrink-0" />
              <div>
                <div className="font-display font-bold text-forest text-h3 group-hover:text-white transition-colors">
                  Open the shared Drive folder
                </div>
                <div className="font-body text-small text-muted group-hover:text-white/80 transition-colors">
                  Opens in Google Drive — you'll need to be signed in with the account this was shared to.
                </div>
              </div>
            </div>
            <ExternalLink size={20} className="text-forest group-hover:text-white transition-colors shrink-0 ml-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
