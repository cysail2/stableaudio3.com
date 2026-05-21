# Stable Audio 3

Stable Audio 3 is the first site built on the new modular website architecture.

The framework base was generated from the official latest stable Next.js scaffold, then adapted into a module-first structure for product sites.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- pnpm

## Structure

```txt
app/          Route entrypoints and code-rendered pages
modules/      Portable business modules
project/      Stable Audio 3 config, content, policies, and assets
```

Route files should stay thin when a module owns the implementation. Business logic belongs in `modules/`; project copy, pricing, navigation, and site configuration belong in `project/`.

Optional experience modules should stay out of generic project blocks. For example, video-specific UI lives in `modules/media/`; image-only sites can skip that module and still reuse the base SEO/article components.

## Key Routes

- `/`
- `/stable-audio-3`
- `/how-to-use-stable-audio-3`
- `/pricing`
- `/privacy`
- `/terms`
- `/refund`
- `/account`
- `/library`
- `/payment-success`
- `/payment-result`

## Commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm build
pnpm dev
```

## Environment Configuration

Local development needs a `.env.local` file with the Clerk publishable key:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk_publishable_key>
```

Business API configuration is intentionally code-owned in `project/config/site.ts`:

- `apiServiceUrl`: `https://svc.stableaudio3.com`
- `appIdentifier`: `stableaudio3`

Do not add `NEXT_PUBLIC_API_BASE` or `NEXT_PUBLIC_APP_ID` for this project unless the team decides to move those values back to runtime configuration. The temporary ACE Step upstream is server-only and defaults to `https://svc.grokimagineai.net`; override it with `ACE_STEP_API_BASE` only when backend debugging requires it.

## Notes

- Public UI should use Stable Audio 3 naming and avoid backend/provider labels.
- The generator module currently has the public Stable Audio 3 surface and credit model scaffold. The next step is wiring it to the live generation service.
- CNZZ configuration is in `project/config/analytics.ts`.
- Site/product configuration is in `project/config/site.ts`.
