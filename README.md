# Pam's Fashion Academy

A production website and online learning platform for Pam's Fashion Academy —
public marketing site, student portal, and admin dashboard — built with
Next.js, TypeScript, Tailwind CSS and Firebase.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Firebase**: Authentication, Cloud Firestore, Cloud Storage
- **Vercel** for hosting

## Project structure

```
src/
  app/
    (public)/        Marketing site — home, about, courses, gallery, apply...
    (auth)/           Login, register, forgot password
    (student)/        Role-guarded student portal
    (admin)/          Role-guarded admin dashboard
    verify-certificate/  Public certificate verification (no auth)
  components/
    ui/               Button, Container, Modal, SectionHeading, EmptyState...
    layout/           Navbar, Footer, StudentSidebar, AdminSidebar, PortalShell
    sections/         Homepage editorial sections
    shared/           Cross-cutting components (forms, video player, curriculum manager...)
  lib/
    firebase/         Firebase app/auth/firestore/storage clients
    services/         Domain data-access layer (courses, enrollments, quizzes...)
  hooks/              useAuth (current user + role)
  types/              Shared TypeScript types for every Firestore collection
firestore.rules        Firestore security rules
storage.rules           Storage security rules
firestore.indexes.json  Required composite indexes
scripts/seed.ts          One-time content seed (the academy's existing courses)
```

## 1. Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a new project.
2. **Authentication** → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → Create database → start in production mode (the
   security rules in this repo replace the defaults — see step 4).
4. **Storage** → Get started → production mode.
5. **Project settings** → General → "Your apps" → Add app → Web (`</>`). Copy
   the config object shown — you'll need it in step 2 below.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the six `NEXT_PUBLIC_FIREBASE_*` values from the web app config you
copied above. `NEXT_PUBLIC_SITE_URL` can stay as `http://localhost:3000` for
local development.

> The app is defensive about missing config — the build won't crash if these
> are unset — but every Firebase call (auth, reads, writes) will fail at
> runtime until real values are set.

## 3. Install dependencies and run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 4. Deploy Firestore & Storage security rules

Install the Firebase CLI if you don't have it, then from the project root:

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # select your Firebase project
firebase deploy --only firestore:rules,firestore:indexes,storage
```

This deploys `firestore.rules`, `firestore.indexes.json` and `storage.rules`.
**Do this before real users sign up** — the rules are what actually protect
the data; the app's own route guards are UX-only (see comments in
`src/components/shared/RoleGuard.tsx`).

Composite indexes can take a few minutes to build after deploying — Firestore
will otherwise show a "query requires an index" error with a direct link to
create it, if one is somehow missing.

## 5. Seed the academy's existing course content

The homepage and course pages are fully data-driven from Firestore — nothing
is hardcoded — so on a brand-new project they'll be empty until content
exists. A seed script populates the eight courses/programmes already
described in the academy's existing materials (Beginners Class, Fashion
Business, Fashion Branding, Professional Sewing, Pattern Making, Fashion
Illustration, Sustainable Fashion, Upcycling & Repurposing):

1. Firebase Console → Project settings → Service accounts → **Generate new
   private key**. Save the downloaded file as `scripts/service-account.json`
   (already git-ignored — never commit it).
2. Run:

```bash
npm run seed
```

It's safe to re-run — it upserts by slug rather than duplicating courses.
Gallery images, testimonials and announcements have no seed data (there's no
existing content to preserve for those) — add them from the admin dashboard
once you have real photos and quotes.

## 6. Create your first admin user

There's intentionally no public "become an admin" flow. To create the first
admin:

1. Register a normal account at `/register` (this creates a `student` by
   default).
2. In the Firebase Console, open **Firestore Database** → `users` collection
   → find the document with your `uid` → change its `role` field from
   `student` to `admin`.
3. Log out and back in (or refresh) — you'll now see **Admin Dashboard** in
   the navbar and can visit `/admin/dashboard`.

From then on, you can promote other users to `admin` or `instructor` directly
from **Admin → Students** in the dashboard.

> This project uses the user's Firestore document (`users/{uid}.role`) as the
> source of truth for role, checked both in the UI (`useAuth`) and in
> security rules. For a stronger guarantee than a Firestore field can give
> (e.g. if you later add server-side APIs that need to trust the role without
> an extra read), the standard hardening step is a Cloud Function that
> mirrors `role` onto a Firebase Auth **custom claim** whenever the user
> document changes, and checking that claim instead. Not required for this
> version, but straightforward to add later.

## 7. Deploy to Vercel

1. Push this repository to GitHub.
2. [Import the project into Vercel](https://vercel.com/new).
3. Add the same environment variables from `.env.local` in Vercel's project
   settings (Settings → Environment Variables) — for Production, Preview and
   Development.
4. Deploy. Vercel will run `next build` automatically.
5. Once you have a production domain, update `NEXT_PUBLIC_SITE_URL` in
   Vercel's env vars to match it (used for SEO metadata and the sitemap).

## How content management works

Everything editorial is managed from **Admin Dashboard**, not code:

| What | Where |
|---|---|
| Courses, pricing, publish status | Admin → Courses |
| Modules & lessons (video, resources, quizzes, assignments) | Admin → Courses → Manage Lessons |
| Quizzes | Admin → Quizzes |
| Assignments & submission review | Admin → Assignments |
| Certificates | Admin → Certificates |
| Gallery photos | Admin → Gallery |
| Testimonials | Admin → Testimonials |
| Announcements | Admin → Announcements |
| Admissions applications | Admin → Applications |
| Student/instructor/admin roles | Admin → Students |

The only things left in code are the academy's static brand facts (address,
phone, email, class schedule) in the relevant section components under
`src/components/sections/` — update those directly if the academy moves or
changes its schedule.

## Notable design decisions

- **No lesson auto-completion.** A lesson is marked complete when the video
  reaches ~95% playback or the student explicitly clicks "Mark as Complete"
  — never just because the page was opened (see `VideoPlayer.tsx` and
  `progress.ts`).
- **Only the active lesson's video loads**, not the whole course, per the
  performance requirement.
- **Paid courses are architected but not charged yet.** `Course.isFree`,
  `price`, `currency` and `Enrollment.paymentStatus` / `transactionRef`
  exist so a payment provider (e.g. Paystack) can be wired in later without
  a data model change — see `lib/services/enrollments.ts`.
- **Certificates are publicly verifiable** by ID at `/verify-certificate/[id]`
  with no login required, per the Firestore rules (`certificates` collection
  is world-readable, write-restricted to staff).
- **Fonts are self-hosted** via `@fontsource` (Playfair Display + Manrope)
  rather than fetched from Google Fonts at build time, so builds succeed in
  offline/restricted-network environments and there's no third-party font
  request at runtime.

## Suggested next steps (not required for v1)

- Cloud Function to mirror Firestore `role` → Firebase Auth custom claims.
- Paystack integration for paid course checkout.
- Server-side quiz grading (a Cloud Function) so correct answers aren't
  present in the client bundle for high-stakes assessments.
- A dedicated "Website Content" editor for static sections (hero image,
  address, schedule) instead of editing component code directly.
# pamsfashion
