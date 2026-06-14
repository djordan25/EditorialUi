# EditorialUI · Feedback bundle (Bundle 5)

Fifth implementation bundle. The components that talk back to the user — hover
labels, persistent banners, modal surfaces, and empty regions.

---

## What's in this bundle

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← UPDATED barrel (Bundles 1–5 — additive)
        ├── EdTooltip/              ← exports EdTooltip + EdTooltipProvider
        ├── EdNotification/
        ├── EdDialog/               ← exports EdDialog + EdConfirmation
        └── EdEmptyState/
```

Same shape as every prior bundle: `*.tsx` + `*.module.scss` + `*.stories.tsx`
+ `*.test.tsx` + `index.ts`.

---

## New dependencies

```bash
yarn add @radix-ui/react-tooltip @radix-ui/react-dialog
```

| Package | Used by |
|---|---|
| `@radix-ui/react-tooltip` | `EdTooltip` (+ `EdTooltipProvider`) |
| `@radix-ui/react-dialog` | `EdDialog` (+ `EdConfirmation`) |

`EdNotification` and `EdEmptyState` are plain React + CSS + lucide icons — no
new deps.

---

## Component summary

### `EdTooltip` (+ `EdTooltipProvider`)
Anchored, transient label on hover / keyboard focus. Built on Radix Tooltip.
Simple label (with optional `kbd` shortcut chip) or rich variant (`title` + `body`
for definitions). Dark-on-light bubble, auto-flips at viewport edges, honors
`prefers-reduced-motion`.

Wrap your app once in `<EdTooltipProvider>` so moving between adjacent tooltips
skips the open delay. **Read-only hints only** — for interactive content use a
popover (Bundle 6/7). For icon-only buttons, the tooltip text must match the
trigger's `aria-label`.

### `EdNotification`
Inline banner for page- or section-level state that persists until acknowledged
or resolved. Four severities (`info` / `success` / `warning` / `danger`), each
with a required leading icon (never color-only). Three variants: `rail` (default,
3px colored stripe), `subtle` (inside cards), `compact` (single line).

ARIA role is automatic: info/success → `role="status"` (`aria-live="polite"`);
warning/danger → `role="alert"` (`aria-live="assertive"`). Set `role="none"` for
a banner that's always present on load (not announced). 0–2 actions, ghost /
secondary only — **never primary** (a banner isn't a CTA).

**Not for transient confirmations** (use a toast — out of scope). **Not in place
of content** (use `EdEmptyState`).

### `EdDialog` (+ `EdConfirmation`)
Radix-based modal surface: overlay, focus trap, header / body / footer slots.
Four sizes (`sm` 400 / `md` 520 / `lg` 720 / `xl` 960). `danger` colors the title;
`preventOutsideClose` disables Esc + overlay-click for unsaved-form guards;
`hideClose` removes the × ; `footerMeta` adds a left-aligned shortcut/doc hint.

`EdConfirmation` is the preset for the 90% confirm/destructive case — `sm` dialog,
title + body + confirm/cancel. Pass `renderActions` to inject your `EdButton`
instances (recommended); a native fallback is provided so it works standalone.

Body scrolls when it exceeds the available height; header + footer stay pinned.
Don't stack dialogs.

### `EdEmptyState`
Centered title + body + actions for a region with no data. Tones (`neutral` /
`danger` for load errors / `success` for done-no-action). The visual is a single
restrained glyph in a dashed ring — **no illustrations, no mascots, no "Oops!"**.
`compact` for small panels. `headingLevel` matches the surrounding document
outline (the title is always the region's heading).

Copy guidance is baked into the spec: plain title, body that states cause AND
unblock, primary-verb actions only. Skip actions the user can't perform.

---

## Drop locations

```bash
cp -R src/components/EditorialUI/EdTooltip       <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdNotification   <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDialog         <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdEmptyState     <repo>/ClientApp/src/components/EditorialUI/
cp    src/components/EditorialUI/index.ts         <repo>/ClientApp/src/components/EditorialUI/index.ts
```

## Storybook categories

Per the spec's group taxonomy (delivery cadence ≠ Storybook tree):

| Component | Story path |
|---|---|
| `EdTooltip` | `EditorialUI/Feedback/EdTooltip` |
| `EdNotification` | `EditorialUI/Feedback/EdNotification` |
| `EdEmptyState` | `EditorialUI/Feedback/EdEmptyState` |
| `EdDialog` | `EditorialUI/Containers/EdDialog` |

`EdDialog` sits under `Containers` (it's spec item D1) — it's the low-level modal
surface that `EdModal` / `EdSidePanel` (Bundle 6) build on.

## App-root wiring

Add `<EdTooltipProvider>` once near the app root (inside the theme provider):

```tsx
import { EdTooltipProvider } from '@/components/EditorialUI';

<EdTooltipProvider delayDuration={500} skipDelayDuration={300}>
  <App />
</EdTooltipProvider>
```

`EdTooltip` lazily provides its own provider if one is absent, so isolated usage
works — but a single app-level provider is what makes grouped hovers instant.

---

## Backlinks

- **`EdIconButton`** (Bundle 1): every icon-only button whose label isn't visible
  should now be wrapped in `<EdTooltip label={...}>` where the label matches the
  button's `aria-label`. This was flagged in Bundle 1's spec ("Pair with an
  EdTooltip whenever the label isn't otherwise visible") — Bundle 5 makes it real.
- **`EdEmptyState`** replaces the ad-hoc "no data" divs that have accumulated in
  table bodies and inspector panels. Migrate those during table work (Bundle 8).

---

## What's next

- **Bundle 6** — Containers: `EdCard`, `EdModal`, `EdSidePanel`, `EdDisclosure`, `EdAccordion`. `EdModal` + `EdSidePanel` build directly on `EdDialog` from this bundle.
- **Bundle 7** — Navigation: `EdTabs`, `EdBreadcrumb`, `EdMenu`, `EdContextMenu`
- **Bundle 8** — Data: `EdDataTable`, `EdNativeTable`, `EdList`
- **Bundle 9** — Late composites: `EdDateRangePicker`, `EdFilterChipRow`, `EdTagContainer`, `EdTagSelect`
