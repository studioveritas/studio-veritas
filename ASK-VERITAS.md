# Ask Veritas on studio-veritas.com

An AI chat (Claude Haiku 5.5) opened by an **outline triangle in the bottom-left corner**, on every page, mobile and desktop. It answers from the site copy and credentials only. It has two modes: **Ask** and the **Truth Test**. A third, the **Process** guide, appears once the real Truthful / Noticeable / Memorable copy exists.

## What was added (no existing page code changed)

| Path | What |
|---|---|
| `app/layout.tsx` | +1 import, +1 line: `<AskVeritas trigger="triangle" side="left" />` |
| `package.json` | + `@anthropic-ai/sdk` |
| `app/api/ask/route.ts` | The only server endpoint. Holds the key, enforces every cap before calling the model |
| `components/ask-veritas/` | `AskVeritas.tsx` (triangle + panel), `ask-veritas.css`, `open.ts` |
| `lib/ask-veritas/` | Knowledge, prompts, process copy, caps, guards |

## How it sits in the design

- **Triangle:** outline, black, 22×19, in the bottom-left corner, lined up with the site's left margin and the footer triangle's baseline (16px on phones, 40px/32px from 768px). The panel opens just above it, from that corner. It turns blue on hover, shows "ASK VERITAS" above it on desktop hover, and points down while the panel is open (like the footer's close triangle).
- **Panel:** the site's pop-out style. Black, 1px 10% white border, 6px corners, blue uppercase heading, ✕ close, █ typewriter cursor, the site's arrow cursor.
- **Layering:** matches every page. Bottom bars 40, triangle 45, pop-outs 50, panel 55, footer 60, grain 100. The grain still washes over it, and the grey footer still slides over it.
- **Verified:** before/after on all five pages at 390px and 1440px. Every original element is in the same position, size, colour, font and layer, and pages are pixel-identical outside the triangle.

## Settings (Vercel → studio-veritas → Settings → Environment Variables)

| Key | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Console key (Sensitive). Never commit it |
| `ASK_HASH_SALT` | any long random string (Sensitive) |
| `ASK_GLOBAL_DAY_MAX` | daily cap for the whole site, e.g. `50` to start |
| `ASK_ALLOWED_ORIGINS` | only needed to test on a preview URL: `studio-veritas.com,<preview-host>` |

Optional: `ASK_VERITAS_ENABLED=false` is a kill switch. `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` make the caps exact across Vercel instances. The Anthropic Console spend limit is the hard backstop.

## Editing what it knows

- Facts: `lib/ask-veritas/knowledge.ts`
- Voice and rules: `lib/ask-veritas/prompt.ts`
- Truthful / Noticeable / Memorable copy: `lib/ask-veritas/process.ts`. Fill all three `copy` fields and the Process guide switches on.

## Other options

- Show the label "ASK VERITAS" all the time: in `ask-veritas.css`, give `.av-tri-label` `opacity: 1`.
- Open it from any other button: `import { openAskVeritas } from '@/components/ask-veritas/open'`, then `openAskVeritas('truth')`.
- Remove it: delete the `<AskVeritas … />` line in `app/layout.tsx`.
