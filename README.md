# DIY1T.com — See It. Build It. Make It Yourself.

AI-powered web app that turns any photo into a complete DIY project guide.

**Tech stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Supabase · Stripe · OpenAI · Cloudinary · Vercel

## Local Development

```bash
cp .env.local.example .env.local
# fill in your API keys

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.local.example` for the full list. Required services:
- [Supabase](https://supabase.com) — auth + database
- [Stripe](https://stripe.com) — billing
- [OpenAI](https://platform.openai.com) — AI generation (gpt-4o)
- [Cloudinary](https://cloudinary.com) — image + PDF storage

## Database

Migrations live in `supabase/migrations/`. Apply in order to any Supabase project.

## Deployment

Deployed to Vercel. Add all env vars from `.env.local.example` to your Vercel project settings.
