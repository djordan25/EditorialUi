# EditorialUI · Containers bundle (Bundle 6)

Sixth implementation bundle. The surfaces that hold other content: cards,
modals, drawers, and the two collapsible primitives.

---

## What's in this bundle

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← UPDATED barrel (Bundles 1–6 — additive)
        ├── EdCard/                 ← EdCard + EdCardHeader/Body/Footer
        ├── EdModal/                ← convention layer over EdDialog (Bundle 5)
        ├── EdDrawer/               ← EdDrawer + EdDrawerSection (+ EdSidePanel alias)
        ├── EdDisclosure/
        └── EdAccordion/
```

Same shape as every bundle: `*.tsx` + `*.module.scss` + `*.stories.tsx`
+ `*.test.tsx` + `index.ts`.

> **Naming note:** the roadmap listed this component as `EdSidePanel`; the design
> spec (D4) names it **`EdDrawer`**. The implementation follows the spec —
> `EdDrawer` is the canonical export, with `EdSidePanel` exported as an alias
> (`export const EdSidePanel = EdDrawer`) so either import works.

---

## Dependencies

**Prerequisite:** Bundle 5 must be merged — `EdModal` imports `EdDialog` from
`../EdDialog`. If you drop this bundle without Bundle 5, `EdModal` won't compile.

New Radix package:

```bash
yarn add @radix-ui/react-accordion
```

| Package | Used by |
|---|---|
| `@radix-ui/react-accordion` | `EdAccordion` |
| `@radix-ui/react-dialog` | `EdDrawer` (already on the project from Bundle 5) |
| `@radix-ui/react-slot` | `EdCard` `asChild` (already on the project from Bundle 1) |

`EdDisclosure` is plain React state — no dependency.

---

## Component summary

### `EdCard` (+ `EdCardHeader` / `EdCardBody` / `EdCardFooter`)
Bordered surface for grouping — dashboard tiles, metadata panels, entity
previews. **Flat by default (no shadow)** — the hairline border is the
affordance; shadow appears only on interactive hover. Variants: `default` /
`flat` (no border) / `ghost` (dashed, for empty/add). `interactive` + `asChild`
make the whole card a real `<button>`/`<a>` (never a div with a click handler).
`selected` for picker tiles.

**Not a replacement for tables** — findings, models, runs live in `EdDataTable`
(Bundle 8). Cards are for editorial moments and dashboards.

### `EdModal`
The convention layer over `EdDialog`. Use this for almost every modal. Adds
title/subtitle/body/footer + footerMeta + a **busy state** (`aria-busy`, dimmed
+ frozen body, optional progress region, live-region status announcement). While
busy it auto-guards (Esc + close hidden) but keeps footer actions live so the
user can cancel. Copy guidance baked into the stories: verb-led title, primary
action echoes the verb — never "OK"/"Submit".

### `EdDrawer` (+ `EdDrawerSection`, alias `EdSidePanel`)
Right-edge (or left) sliding panel for row-contextual detail. **Non-modal by
default** — the page stays interactive and the drawer updates in place as list
selection changes. `modal` adds overlay + focus trap for focused edits. Four
sizes, `preventClose` for unsaved-change guards, `EdDrawerSection` for labelled
body groups. Encode open state in the URL (`?drawer=<id>`) at the call site for
deep-linking.

### `EdDisclosure`
Inline show/hide for a **single** secondary block. Lighter than an accordion —
no border, no panel chrome, just a mono trigger + chevron. For advanced options,
raw data, debug dumps. For 2+ related blocks use `EdAccordion`. Don't hide
default/common content.

### `EdAccordion`
Vertically-stacked collapsible sections, Radix-backed (arrow-key nav, Home/End,
roving focus free). `type="single"` (default, collapsible) or `type="multiple"`.
Items passed as data (`{ value, title, meta?, content, disabled? }`). Optional
mono meta (counts, status) right-aligned in the trigger. For sibling views
prefer `EdTabs` (Bundle 7); never hide critical info.

---

## Drop locations

```bash
cp -R src/components/EditorialUI/EdCard        <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdModal       <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDrawer      <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDisclosure  <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdAccordion   <repo>/ClientApp/src/components/EditorialUI/
cp    src/components/EditorialUI/index.ts      <repo>/ClientApp/src/components/EditorialUI/index.ts
```

All five stories land under `EditorialUI/Containers/*`.

---

## Backlinks

- **`EdConfirmation`** (Bundle 5) and **`EdModal`** now overlap. Going forward,
  `EdConfirmation` stays the terse preset; `EdModal` is the general surface. New
  confirm flows should reach for `EdConfirmation`; multi-field or busy flows use
  `EdModal`. Both wrap the same `EdDialog`.
- **`EdCard`** replaces the bespoke dashboard tile + entity-preview markup that
  has accumulated. Migrate dashboards first (highest visual payoff).

---

## What's next

- **Bundle 7** — Navigation: `EdTabs`, `EdBreadcrumb`, `EdMenu`, `EdContextMenu`
- **Bundle 8** — Data: `EdDataTable`, `EdNativeTable`, `EdList`
- **Bundle 9** — Late composites: `EdDateRangePicker`, `EdFilterChipRow`, `EdTagContainer`, `EdTagSelect`
