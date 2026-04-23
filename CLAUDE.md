# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend
```bash
cd backend
npm start              # Run Express server (port 5000)
node scripts/buildDatabase.js  # Build SQLite database from JSON data files (run once before starting)
```

### Frontend
```bash
cd frontend
npm start              # Run React dev server (port 3000)
npm run build          # Production build
npm test               # Run unit tests (Jest / React Testing Library)
npm run test:e2e       # Run Cypress E2E tests headlessly
npm run test:e2e:open  # Open Cypress test runner
```

### Environment setup
Backend requires a `.env` file in `backend/`:
```
DB_PATH=./database.sqlite
PORT=5000
```

The database must be built before the backend can serve requests: `node scripts/buildDatabase.js` reads all JSON files from `backend/data/` and populates `database.sqlite`.

## Architecture

This is a Linux package search tool for IBM Z-compatible distributions. Users can search packages across 17 distributions simultaneously using bitmask-based filtering.

### Backend (`backend/`)

Express.js REST API backed by a SQLite database (via `better-sqlite3`).

**Data flow:** JSON files in `backend/data/` → `buildDatabase.js` populates one table per distro → `packageController.js` queries tables at runtime.

**API endpoints** (all under `/api`):
- `GET /getSupportedDistros` — returns distro name → bitmask map
- `GET /searchPackages?search_term=&exact_match=&search_bit_flag=&page_number=` — UNION query across selected distro tables, paginated (100 per page)

**Bitmask filtering:** Each distro family gets a power-of-2 bit. `search_bit_flag` is a bitwise OR of selected distros. The controller uses `DISTRO_TABLE_MAP` to decide which tables to UNION in the query.

### Frontend (`frontend/src/`)

React 19 SPA using React Router DOM v7.

**Routing:**
- `/` → `LandingPage` (search + results)
- `/faq` → `Faq`

**State flow:** `SearchBar` calls the backend API and passes results up to `LandingPage`, which passes them down to `SearchResults`. Pagination in `SearchResults` is client-side (via `react-paginate`) over the already-fetched page of results.

**Key components:**
- `SearchBar.jsx` — OS multiselect (checkboxes with bitmask), search input, exact/fuzzy toggle, items-per-page selector, description search toggle
- `SearchResults.jsx` — result cards with client-side refine filter (name/version/distro), scroll-to-top button
- `LandingPage.jsx` — orchestrates SearchBar + SearchResults + HeroSection + Carousel

**Styling:** Tailwind CSS for layout/utilities + inline styles for component-specific styles + MUI for CircularProgress and icons. Custom Tailwind colors: `customBlue: #044FC0`. Fonts: Poppins, Outfit.

### Database schema

Each distro has its own table:
```sql
CREATE TABLE "TableName" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  packageName TEXT,
  version TEXT,
  description TEXT,
  osName TEXT
)
```

17 tables covering Ubuntu (22.04, 24.04), Debian (Bookworm, Trixie), Fedora (42, 43), AlmaLinux (9, 10), RockyLinux (9, 10), OpenSUSE (Tumbleweed, Leap 15.6), ClefOS 7, and IBM Z Validated (RHEL 9, SLES 15, Ubuntu 22.04, Ubuntu 24.04).
