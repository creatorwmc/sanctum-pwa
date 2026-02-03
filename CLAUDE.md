# Sanctum PWA - Claude Code Instructions

## Deployment Policy

**DEFAULT: Local development only.**

When running or testing the application:
- Use `npm run dev` for local development server (localhost:5173)
- Do NOT deploy to Netlify production unless explicitly requested

**Production deployment requires explicit instruction:**
- User must say "deploy to live", "deploy to production", "deploy to Netlify", or similar
- Nightly deployments are handled automatically via GitHub Actions
- Manual production deploys should be rare exceptions

## Development Commands

```bash
# Local development (DEFAULT)
npm run dev              # Vite dev server on localhost:5173

# Build (for testing build locally)
npm run build            # Production build to /dist (also increments version)
npm run preview          # Preview production build locally

# Linting
npm run lint             # ESLint check
```

## Project Context

- **Purpose**: Spiritual practice tracking PWA with offline-first architecture
- **Backend**: Firebase (Auth, Firestore)
- **Local Storage**: IndexedDB via `idb` for offline persistence
- **Sync**: Bidirectional Firestore/IndexedDB sync (user opt-in)
- **Hosting**: Netlify (with Netlify Forms for feedback)
- **CI/CD**: GitHub Actions nightly deploy at 12:15 AM EST

## Key Directories

- `src/pages/` - Route pages (Dashboard, Timer, Journal, etc.)
- `src/components/` - Reusable UI components
- `src/services/` - Sync and Google Drive services
- `src/db/` - IndexedDB schema and operations
- `src/data/` - Static data (practices, traditions, calendars)

## Data Architecture

- Primary data store: IndexedDB (offline-first)
- Cloud sync: Firestore (opt-in via Settings)
- Documents: Google Drive API integration
