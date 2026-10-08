# Skinet design system

Clean, calm, flat. White surfaces, navy for text accents and primary actions, ice blue for highlights.
No gradients on UI controls, no heavy shadows, no uppercase shouting, no purple (#7d00fa is gone).

## Tokens (Tailwind, see tailwind.config.js)
- `navy` (#0f2e4f) primary text accents, primary buttons; `navy-900`, `navy-700` hover.
- `ice-50/100/200/500/700` highlights, chips, badges, focus.
- `snow` (#f7fafc) subtle backgrounds (image wells, summary boxes).
- `ink` body text, `ink-muted` secondary text. `line` / `line-strong` borders.
- `danger`, `success` for status only.
Font: Manrope (self-hosted). Icons: Material Icons **Outlined** (self-hosted; `<mat-icon>` already uses them).

## Components (src/styles.scss)
`.container` (max-w-7xl + gutters), `.card` (16px radius, 1px line border, white), `.soft-box` (snow, 12px),
`.eyebrow`, `.h1`, `.h2`, `.muted`, `.chip`, `.link`, `.price`, `.divider`.
Angular Material stays for behaviour (dialogs, selects, steppers, paginator, form fields, menus, snackbars);
it is themed navy via a custom M3 palette. Buttons: `mat-flat-button` = primary navy, `mat-stroked-button` = secondary.

## Rules
- Pages start with a clear title block: `.eyebrow` (optional) + `.h1`, then a muted one-line description.
- Page wrapper: `<div class="container py-10">`. The header is fixed (64px); `<main>` already has `pt-16`.
- Cards: `.card` with `p-5`/`p-6`. Radius 12-16px. Hover = soft shadow `hover:shadow-[0_12px_32px_rgb(11_37_64_/_0.10)]`.
- Product images always on `bg-snow`, `object-cover`, square.
- Prices with `.price` and the existing `currency` pipe.
- Sentence case everywhere. Weights: 400 body, 500/600 labels, 700 headings only.
- Empty / loading / error states always designed (use the shared empty-state component).
- Never use Tailwind raw palette colors (blue-600, gray-500...). Use the tokens above.
- Keep all existing services, signals, forms and behaviour. Only the presentation changes.
