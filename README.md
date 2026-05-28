# STEM CBT

A complete, lightweight STEM competition CBT platform built with one Next.js App Router codebase for frontend pages and backend API routes.

## Stack

- Next.js App Router, TypeScript, TailwindCSS
- MongoDB with Prisma ORM
- JWT cookie authentication with bcrypt password hashing
- Zustand persisted exam/offline state
- next-pwa service worker support
- PapaParse CSV uploads
- Framer Motion and shadcn-style local UI components

## Features

- Student registration, login, logout, protected dashboard
- Admin login, exam creation, exam management, CSV/JSON question upload, result export
- Timed CBT exam engine with MCQ, numeric, and true/false questions
- Autosave answers, countdown, review mode, question palette, auto-submit
- Instant marking with 2% tolerance for numeric answers
- Subject breakdown, leaderboard, and recent results
- Offline indicator, cached exam API responses, local answer persistence, queued submission sync
- Lightweight anti-cheat: fullscreen warning, tab switch detection, right-click/copy/paste blocking, auto-submit after repeated violations

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL` to your MongoDB Atlas connection string and set a long `JWT_SECRET`.

4. Generate Prisma Client:

```bash
npx prisma generate
```

5. Push the schema and seed sample data:

```bash
npx prisma db push
npm run seed
```

6. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Sample Accounts

Created by `npm run seed`:

- Admin: `admin@stemcbt.local` / `admin12345`
- Student: `student@stemcbt.local` / `student12345`

## Question Upload

CSV columns:

```csv
subject,type,question,optionA,optionB,optionC,optionD,answer,marks
Physics,mcq,What is g?,8.9,9.8,10,11,9.8,2
```

JSON format:

```json
[
  {
    "subject": "Physics",
    "type": "mcq",
    "question": "What is force?",
    "options": ["Mass", "Push or pull", "Speed", "Power"],
    "answer": "Push or pull",
    "marks": 2
  }
]
```

Sample files live in `public/data/sample-questions.csv` and `public/data/sample-questions.json`.

## Deployment

Deploy on Vercel with these environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`

Run `npx prisma db push` against MongoDB Atlas before first use, then seed if you want demo data.
# stem-cbt
