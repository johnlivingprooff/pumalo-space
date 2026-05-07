# AGENTS.md - Pumalo Space

## Developer Commands

```bash
npm run dev      # Start dev server (turbopack)
npm run build    # Production build
npm run lint    # Biome check
npm run format  # Biome format --write

# Database
npm run db:generate  # Prisma generate
npm run db:push     # Prisma db push
npm run db:seed     # Prisma seed
npm run db:studio   # Open Prisma Studio
```

## Tech Stack

- Next.js 15 (App Router), React 19, TypeScript 5
- Tailwind CSS 4, Biome 2 (2-space indent, NOT 4)
- Prisma + PostgreSQL (Neon)
- Stack Auth v2.8.54 for authentication
- Cloudinary for images

## Critical Gotchas

**Stack Auth**: Do NOT set `NEXT_PUBLIC_STACK_URL` in `.env.local`. It causes ECONNRESET errors. Leave it unset - Stack Auth auto-discovers the API endpoint.

**Import paths**: 
- Use `@stack/server` and `@stack/client` - NOT `@/stack`
- Use `@/*` for local imports (`@/lib/utils`)

**Prisma**: Runs on `postinstall`, so client auto-generates after `npm install`.

## Architecture Notes

- Route groups: `(auth)` for login/signup, `(main)` for app pages
- Database models in `prisma/schema.prisma`: User, Property, Booking, Review, Favorite, HostProfile
- API routes in `src/app/api/` - use Stack Auth, no manual auth route needed
- Auth config in root `stack/` directory (`stack/server.ts`, `stack/client.ts`)

## Key Files

- `prisma/schema.prisma` - Database schema
- `stack/server.ts` / `stack/client.ts` - Stack Auth config
- `src/lib/prisma.ts` - Prisma client instance
- `biome.json` - Linting/formatting config