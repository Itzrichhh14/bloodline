# Bloodline — Roblox / Time Bomb Duels Clan

Production-oriented Next.js site with public SEO pages, Discord OAuth, invite-only member registration, PostgreSQL/Prisma data layer, member profiles, rankings, news, and an admin dashboard.

## Stack
- Next.js 16 + React + TypeScript
- Tailwind CSS 4
- PostgreSQL + Prisma 6
- Auth.js / Discord OAuth
- Vercel-ready

## Requirements
Node.js 22+, PostgreSQL database, and a Discord OAuth application.

The deployable project root is this directory, the one containing `app/`, `lib/` and `package.json`.

## Configure
Copy `.env.example` to `.env.local` and set the values. `ADMIN_DISCORD_IDS` is a comma-separated list of Discord IDs that can bootstrap the first admin account. Never commit `.env` or `.env.local`, and rotate OAuth/database credentials if they have been exposed.

Discord OAuth callback:
`https://YOUR-DOMAIN.com/api/auth/callback/discord`

## Local setup
```bash
npm install
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

If npm reports `Invalid Version`, remove `node_modules` and `package-lock.json`, then run `npm install` again from this directory. Do not run npm from a parent folder or from the incomplete `bloodline/` subfolder.

## Production
Set the variables from `.env.example` in Vercel, set the Vercel Root Directory to this project root, then deploy. The build runs `prisma generate` before `next build`. The initial migration is committed under `prisma/migrations`; run `npm run db:deploy` against production before the first use, then run `npm run db:seed` once to create the default rank tiers.

For Discord OAuth, configure the callback as `https://YOUR-DOMAIN.com/api/auth/callback/discord`. Set `NEXT_PUBLIC_SITE_URL` to the deployed URL and include the production URL in the Discord application settings.

The public site is server-rendered and includes metadata, sitemap, robots rules, revalidation and minimal client JavaScript. Admin/member areas are protected server-side.

## Included
- Public homepage, About, Members, Rankings and News
- Individual SEO-friendly news pages
- Discord OAuth authentication
- Invite-only registration with transactional use limits
- Member profiles with Roblox username field
- Admin dashboard
- User management and ranking management
- Invite generation
- Invitation expiry, usage limits and revocation
- News drafts, editing, publishing and deletion
- Public member profiles and editable member bios
- Match reporting, admin verification and automatic competitive stats
- Administrative activity audit log
- PostgreSQL schema ready for later Roblox/Discord integrations
