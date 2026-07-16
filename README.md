# 🎟️ GrabATicket

A ticket-stub themed movie seat booking site: browse a catalog of 6,000+ movies,
pick a showtime, choose seats, and check out — with a working Node/Express API
backing the whole flow.

## What's in this build

**Frontend (`/frontend`)** — React 19 + Vite + Tailwind CSS v4:

- Live search across the full movie/cinema catalog from the navbar
- Home page with a "Now Showing" carousel + grid, pulled from the backend
- Movie detail page with date/showtime picker, cast & crew, and wishlist
- Seat matrix with Premium/Executive/Normal pricing tiers and a live running total
- Dashboard, booking history, and wishlist — all backed by your account
- Every poster falls back to a generated placeholder card (title + genre) instead
  of a broken image icon when no artwork is available

**Backend (`/backend`)** — Express + TypeScript API that reads/writes
`backend/data/db.json` (no MongoDB required):

- `/api/v1/movies` — search, `nowShowing` filter, pagination
- `/api/v1/movies/:id`, `/api/v1/shows?movie=:id`, `/api/v1/theaters`
- `/api/v1/auth/signup`, `/api/v1/auth/login`, JWT-protected `/api/v1/bookings`
- Seeded with the full Netflix movie-titles catalog (6,129 movies), with ~390
  flagged `nowShowing` and given real showtimes across 6 Lucknow cinemas

## Getting started

Requirements: Node.js 18+.

```bash
# Backend
cd backend
npm install
npm run dev        # http://localhost:9000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev         # http://localhost:5173
```

> **Note:** `node_modules` is not shipped in this download — run `npm install` in
> both `backend/` and `frontend/` before starting either one.

The frontend talks to the backend at the URL in `frontend/.env`
(`VITE_BACKEND_URL`, defaults to `http://localhost:9000/api/v1`). If the
backend isn't running, the UI still renders using a small bundled mock catalog,
so you can preview it standalone — but search, the full 6,000+ title catalog,
and real bookings need the backend running.

## Notes on the data

`backend/data/db.json` is a plain JSON file acting as the database. It ships
pre-seeded from the imported catalog, and gets written to as users sign up and
book tickets. Keep a backup of the shipped version if you want an easy way to
reset to a clean seeded state.
