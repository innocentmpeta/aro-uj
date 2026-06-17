# ARO-UJ Praxis — Monorepo

A Turborepo monorepo containing the public website and content management system for the ARO-UJ Praxis Network.

---

## Structure

```
arouj-praxis/
├── apps/
│   ├── web/          # Public website — React + Vite + TypeScript (port 3000)
│   └── cms/          # Content management portal — React + Vite + TypeScript (port 3001)
├── packages/
│   ├── types/        # Shared TypeScript content types (used by both apps)
│   └── firebase-config/  # Shared Firebase initialisation
└── turbo.json        # Turborepo pipeline config
```

---

## Prerequisites

- **Node.js 18+** — check with `node --version`
- **npm 9+** — check with `npm --version`
- A Firebase project (see Firebase Setup below)

---

## Quick Start

```bash
# 1. Install all dependencies from the repo root
npm install

# 2. Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/cms/.env.example apps/cms/.env.local
# Fill in your Firebase values in both .env.local files

# 3. Run both apps in development
npm run dev

# Or run individually
npm run web   # public site on http://localhost:3000
npm run cms   # CMS portal on http://localhost:3001
```

---

## Firebase Setup

### 1. Create a Firebase project
1. Go to https://console.firebase.google.com
2. Click "Add project" → name it `arouj-praxis`
3. Disable Google Analytics (not needed)

### 2. Enable Firestore
1. In the Firebase console → Build → Firestore Database
2. Click "Create database" → Start in **test mode** for development
3. Choose a region close to South Africa (e.g. `europe-west1` — closest available)

### 3. Enable Authentication
1. Build → Authentication → Get started
2. Sign-in method → Email/Password → Enable
3. Go to Users tab → Add user → create the Website Manager's account

### 4. Register a web app
1. Project Settings (gear icon) → Your apps → Add app → Web
2. Copy the config values into both `.env.local` files

### 5. Firestore Security Rules (important before going live)
Replace the default rules with these in Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public website can read published content only
    match /{collection}/{document} {
      allow read: if resource.data.published == true;
    }
    // CMS can read and write if authenticated
    match /{collection}/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Image Management

All images are stored on the host server (not Firebase Storage). Structure:

```
apps/web/public/
├── logos/
│   ├── aro-logo.png          ← ARO logo (provided)
│   ├── uj-logo.png           ← UJ logo (provided)
│   └── arouj-praxis-logo.png ← Add when Praxis logo is ready
├── images/
│   ├── hero/                 ← Hero images (min 1920×1080px, landscape)
│   │   └── hero-main.jpg     ← SWAP: replace with real hero photo
│   ├── stories/              ← Story hero images (min 1200×800px)
│   ├── projects/             ← Project card images (min 800×600px)
│   └── team/                 ← Team portraits (min 600×600px, square)
└── uploads/                  ← CMS-uploaded documents (PDFs)
```

### To swap an image:
1. Drop the new file into the correct subfolder with the **same filename**
2. Commit and push → Vercel auto-deploys
3. OR update the `imagePath` value in the Firestore document if using a new filename

### When the ARO-UJ Praxis logo arrives:
1. Save it as `apps/web/public/logos/arouj-praxis-logo.png`
2. Update `apps/web/src/components/layout/Header.tsx` — replace the text wordmark with `<img src="/logos/arouj-praxis-logo.png" ... />`

---

## Video Management

Videos are hosted on YouTube. To add a video to a story or project:

1. Upload the video to the ARO-UJ Praxis YouTube channel
2. Copy the video ID from the URL — e.g. `https://youtube.com/watch?v=**dQw4w9WgXcQ**`
3. Paste the video ID into the `videoId` field in the CMS

The site uses `react-lite-youtube-embed` — a lightweight façade that loads the YouTube player only when the user clicks play, keeping page load fast.

**Privacy note:** Use YouTube's "Unlisted" setting for videos featuring reclaimers in personal or sensitive contexts. Unlisted videos embed correctly but don't appear in YouTube search.

---

## Development

### Adding a new CMS section

1. Add the TypeScript type to `packages/types/src/index.ts`
2. Add the collection name to `packages/firebase-config/src/index.ts`
3. Build the list + form UI in `apps/cms/src/pages/`
4. Add the read hook in `apps/web/src/` for the public site

### Tech stack
| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript (TSX) |
| Build tool | Vite |
| Styling | Tailwind CSS |
| UI | Custom components + Lucide icons |
| Database | Firestore (text & metadata only) |
| Auth | Firebase Auth (email/password) |
| Video | YouTube + react-lite-youtube-embed |
| Images | Host server / CDN |
| Monorepo | Turborepo |
| Hosting | Vercel (recommended) |

---

## Deployment (Vercel — recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy web app
cd apps/web && vercel

# Deploy CMS (separate Vercel project)
cd apps/cms && vercel
```

Add your Firebase environment variables in Vercel's dashboard under Project → Settings → Environment Variables.

---

## Built by
CODE — Centre of Design and Engineering  
For ARO-UJ Praxis Network, June 2026
