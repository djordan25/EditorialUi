# EditorialUI · Display bundle (Bundle 4)

Fourth implementation bundle. Display primitives — small visual building blocks
that everything else composes from: metadata tags, status badges, interactive
filter chips, dividers, and progress feedback (linear + circular).

---

## What's in this bundle

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← UPDATED barrel (Bundles 1–4 — additive)
        ├── EdTag/
        ├── EdStatusBadge/
        ├── EdChip/
        ├── EdDivider/
        ├── EdProgressMeter/        ← exports EdProgressMeter + EdProgressSegmented
        └── EdCircularProgress/
```

Same shape as previous bundles — every folder ships `*.tsx` + `*.module.scss`
+ `*.stories.tsx` + `*.test.tsx` + `index.ts`.

No new third-party dependencies — everything is plain HTML + CSS + a couple of
lucide icons.

---

## Component summary

### `EdTag`
Compact label for entity metadata — categories, regulations, business unit, model
family. Sentence / kebab case, regular weight. Five tones (`neutral` /
`brand` / `success` / `warning` / `danger`). Optional `onRemove` renders a close
button with a default `Remove {label}` aria-label. Non-interactive by default.

**Use for:** what something IS (categorical metadata).
**Don't use for:** state (use `EdStatusBadge`), or toggleable filters (use `EdChip`).

### `EdStatusBadge`
Compact label for state, severity, or lifecycle. Mono uppercase. Three styles
(`soft` for the workhorse 95% of cells, `solid` for escalations like MRA/MRIA,
`outline` for read-only / archival). Six tones (`neutral` / `info` / `success` /
`warning` / `danger` / `brand`). Optional 6px leading `dot` for states that imply
motion or recent change (Open, In Review). Always non-interactive — if users
change status, render a separate menu; do not attach onClick to the badge.

### `EdChip`
Pill-shaped interactive control. Three behaviour modes via the `kind` prop:
- `toggle` (default) — `role="checkbox"` + `aria-checked`. Multi-select filter row.
- `radio` — `role="radio"`. Use inside a `<div role="radiogroup">` for single-select segmented selectors.
- `input` — free pill, removable token in a form. No selection role; Backspace / Delete fires `onRemove` when focused.

Optional `count` is included in the accessible name automatically (`"Open, 87 items"`). Optional leading dot or icon. `selected` is the visual + ARIA toggle.

### `EdDivider`
Hairline rule for separating sibling regions. Horizontal (renders as `<hr>`),
vertical (renders as a div with `aria-orientation="vertical"`), `weight: strong /
dashed`, optional centered label. `decorative` switches to a div with
`aria-hidden` — use for vertical separators inside metadata strips where screen
readers read content sequentially anyway.

**Prefer space and headings first.** Reach for a divider only when neither is
sufficient. Two adjacent dividers means you have spacing wrong.

### `EdProgressMeter` (+ `EdProgressSegmented`)
Linear progress bar. `role="progressbar"` with `aria-valuemin / max / now /
valuetext / busy`. Pass `percent` for determinate, omit for indeterminate.
Five tones (`brand` / `success` / `warning` / `danger` / `muted`). Sizes `md` /
`lg`. `paused` switches to muted tone and disables motion.

`EdProgressSegmented` is the fixed-N variant — used for stage-based work (closure
pipelines) and the password-strength bands consumed by `EdPasswordInput`.

Honors `prefers-reduced-motion`: the indeterminate sweep falls back to a static
40% bar at lower opacity.

### `EdCircularProgress`
Spinner (indeterminate) + ring (determinate). Three sizes (`sm` 14px / `md` 20px
/ `lg` 32px). Indeterminate renders `role="status"` + `aria-busy="true"` + a
visually-hidden label. Determinate renders `role="progressbar"` with full
valuetext wiring; optional centered `showValue` for the percent label.

Honors `prefers-reduced-motion`: rotation becomes a 1.5s opacity pulse.

---

## Drop locations

```
cp -R src/components/EditorialUI/EdTag                <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdStatusBadge        <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdChip               <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDivider            <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdProgressMeter      <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdCircularProgress   <repo>/ClientApp/src/components/EditorialUI/

# Additive barrel overwrite:
cp    src/components/EditorialUI/index.ts             <repo>/ClientApp/src/components/EditorialUI/index.ts
```

## Storybook

Stories land at:
- `EditorialUI/Display/EdTag`
- `EditorialUI/Display/EdChip`
- `EditorialUI/Display/EdDivider`
- `EditorialUI/Feedback/EdStatusBadge`
- `EditorialUI/Feedback/EdProgressMeter`
- `EditorialUI/Feedback/EdCircularProgress`

`EdStatusBadge`, `EdProgressMeter`, and `EdCircularProgress` are categorised under
`Feedback` even though they're in the "Display" bundle — that's because they're
feedback signals about state/progress, and they sit there in the spec's group
taxonomy. The bundle name is about delivery, not the Storybook tree.

## Backlinks

Two earlier components now reference Bundle-4 primitives:

- **`EdComboBox`** (Bundle 3, multi-mode trigger): the inline tag chips in the
  trigger should be replaced with `<EdTag tone="brand" onRemove={…}>`. Look for
  the `// TODO(bundle-4)` comment in `EdComboBox.tsx` — the swap is mechanical.
- **`EdPasswordInput`** (Bundle 2): the strength meter renders inline. It can
  now delegate to `<EdProgressSegmented segments={4} filled={...} tone={...}>`
  and inherit the `prefers-reduced-motion` handling for free.

Both swaps are **optional polish** — neither is required for Bundle 4 to land.
Do them in a follow-up PR.

---

## What's next

- **Bundle 5** — Feedback: `EdNotification`, `EdDialog`, `EdEmptyState`, `EdTooltip`
- **Bundle 6** — Containers: `EdCard`, `EdModal`, `EdSidePanel`, `EdDisclosure`, `EdAccordion`
- **Bundle 7** — Navigation: `EdTabs`, `EdBreadcrumb`, `EdMenu`, `EdContextMenu`
- **Bundle 8** — Data: `EdDataTable`, `EdNativeTable`, `EdList`
- **Bundle 9** — Late composites: `EdDateRangePicker`, `EdFilterChipRow`, `EdTagContainer`, `EdTagSelect`

`EdFilterChipRow` in Bundle 9 will consume `EdChip` internally — the rough shape
is "horizontal row of `EdChip kind=toggle` with overflow + clear-all + URL-state
binding". The chip primitive is intentionally low-level so the composite can be
built on top without changing the chip API.
