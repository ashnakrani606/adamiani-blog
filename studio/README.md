# Adamiani Blog — Sanity Studio

Standalone Sanity Studio for managing multilingual blog posts (EN / RU / KA).

## Setup

1. Copy environment variables into `studio/.env`:

```
SANITY_STUDIO_PROJECT_ID=your_existing_project_id
SANITY_STUDIO_DATASET=production
```

2. Install and run:

```bash
cd studio
npm install
npm run dev
```

Studio opens at http://localhost:3333

## Deploy Studio

```bash
cd studio
npm run deploy
```

This deploys Studio to Sanity's hosting (e.g. your-studio.sanity.studio) and does not affect the Next.js website.
