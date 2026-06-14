# Claude Code — EditorialUI Containers Bundle (Bundle 6)

You are integrating the **sixth bundle** of the EditorialUI design system into
the `prodicusgroup/apostlerisk` repo (React 19 + Radix + Storybook 10 +
react-hook-form + zod + TanStack). Bundles 1–5 are already merged.

This bundle adds the surfaces that hold other content: cards, modals, drawers,
and the two collapsible primitives (disclosure + accordion).

---

## 1. What's in this drop

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

Same shape as previous bundles: every folder ships
`*.tsx` + `*.module.scss` + `*.stories.tsx` + `*.test.tsx` + `index.ts`.

Visual reference per component (in `screenshots/`):
- `01-EdCard.png` / `02-EdCard.png` — anatomy + variants (stat tile, summary, interactive, selected, flat, ghost).
- `01-EdModal.png` / `02-EdModal.png` — patterns (confirmation, form, busy, multi-step) + footer compositions + copy guidance.
- `01-EdDrawer.png` / `02-EdDrawer.png` — anatomy + modes (non-modal / modal) + sizes.
- `01-EdDisclosure.png` / `02-EdDisclosure.png` — anatomy + patterns (advanced options, debug dump).
- `01-EdAccordion.png` / `02-EdAccordion.png` — anatomy + modes (single-open / multi-open) + meta.

Full spec HTML for any detail the code doesn't make obvious:
`design_system_v2/components/{card,modal,side-panel,disclosure,accordion}.html`.

---

## 2. Naming note — EdDrawer vs EdSidePanel

The design spec file is `side-panel.html` but its component (D4) is named
**`EdDrawer`**, and the rest of the spec (decision rules in EdModal, EdDialog)
refers to "EdDrawer". The implementation follows the spec:

- `EdDrawer` is the canonical export.
- `EdSidePanel` is exported as an alias (`export const EdSidePanel = EdDrawer`).

Use `EdDrawer` in new code. The alias exists only so an `EdSidePanel` import
doesn't break if someone wrote one against the roadmap name.

---

## 3. Hard conventions (still in force)

All prior conventions hold: `Ed*` prefix, folder structure, token-only SCSS,
light default + `[data-theme="dark"]`, sentence case, Radix where possible,
`lucide-react` only, `prefers-reduced-motion` honored, ARIA wired in the
component.

Reinforced this bundle:

- **Interactive surfaces are real elements.** An interactive `EdCard` renders a `<button>`/`<a>` via `asChild` + Radix Slot — never a `<div onClick>`. Same rule the buttons established in Bundle 1.
- **Flat by default.** Cards have no resting shadow. The hairline border is the affordance; elevation appears only on interactive hover. Don't add drop shadows to resting surfaces.

---

## 4. Implementation tasks

### 4.1 — Confirm Bundle 5 is present, then install the new dep

`EdModal` imports `EdDialog` from `../EdDialog`. Verify `src/components/EditorialUI/EdDialog/` exists (Bundle 5). Then:

```bash
yarn add @radix-ui/react-accordion
```

`@radix-ui/react-dialog` (EdDrawer) and `@radix-ui/react-slot` (EdCard asChild) are already on the project from Bundles 5 and 1.

### 4.2 — Copy the bundle into the repo

```bash
cp -R src/components/EditorialUI/EdCard        <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdModal       <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDrawer      <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDisclosure  <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdAccordion   <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp    src/components/EditorialUI/index.ts      <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/index.ts
```

### 4.3 — Run tests

```bash
yarn test --run src/components/EditorialUI
yarn build
yarn storybook         # all five under EditorialUI/Containers/*
```

The five test files (~45 cases) cover card asChild/interactive/selected,
modal busy-state guarding + live region, drawer modal/non-modal + close +
section, disclosure controlled/uncontrolled toggle, accordion single/multi +
keyboard nav + disabled.

> **jsdom note:** `EdDrawer` (Radix Dialog) and `EdAccordion` (Radix Accordion)
> render into portals / use ResizeObserver + animation APIs jsdom only partially
> implements. The provided tests assert on roles, `aria-expanded`, and text —
> they pass under jsdom. Don't add assertions on the slide/expand *animation* in
> jsdom; use Playwright CT for motion.

---

## 5. Per-component success checklist

### `EdCard`
- [ ] Resting card has a hairline border and **no shadow**.
- [ ] `interactive` adds hover elevation + focus ring; `asChild` makes it a real `<button>`/`<a>`.
- [ ] `selected` sets `data-selected` + brand-tinted surface.
- [ ] `EdCardHeader` renders the title at `headingLevel` (the eyebrow stays a `<p>`).
- [ ] Footer uses surface-2 + mono metadata; flat/ghost variants drop the footer fill.

### `EdModal`
- [ ] Title is the accessible name; primary action echoes the title verb (reviewers reject "OK"/"Submit").
- [ ] `busy` sets `aria-busy`, dims + freezes the body, hides the close button, and blocks Esc — but footer actions (cancel) stay live.
- [ ] `busyStatus` is announced via a polite live region; stage changes re-announce.
- [ ] Footer composition matches the spec (single primary / cancel+primary / cancel+secondary+primary / with-meta).

### `EdDrawer`
- [ ] Non-modal (default): no overlay, page stays interactive, outside-interaction does NOT close.
- [ ] `modal`: overlay + focus trap; Esc closes (unless `preventClose`).
- [ ] Slides from the correct edge (`side`), respects `prefers-reduced-motion`.
- [ ] Title is the accessible name; `EdDrawerSection` renders a mono label + content.
- [ ] Call sites encode open state in the URL (`?drawer=<id>`) — note this in review even though the component doesn't own routing.

### `EdDisclosure`
- [ ] Collapsed by default; `aria-expanded` + `aria-controls` wired to the panel id.
- [ ] Controlled (`open`) and uncontrolled (`defaultOpen`) both work.
- [ ] Trigger is the only focus target; chevron rotates on open.

### `EdAccordion`
- [ ] `type="single"` collapsible by default; `type="multiple"` keeps independent items open.
- [ ] Arrow keys move between triggers; Home/End jump; Enter/Space toggles (Radix).
- [ ] Optional meta renders right-aligned, mono; disabled items can't open.
- [ ] Panel uses the Radix height var for the expand animation; reduced-motion disables it.

---

## 6. Migration table

| Existing usage | EditorialUI |
|---|---|
| Bespoke dashboard tile / metric card | `<EdCard>` + `EdCardHeader/Body/Footer` |
| Material `<Card>` clickable | `<EdCard asChild interactive><button>…` |
| Material `<Dialog>` for forms/confirms | `<EdModal>` (or `<EdConfirmation>` from Bundle 5 for terse confirms) |
| Right-side detail panel / inspector | `<EdDrawer>` (non-modal) |
| `<Collapse>` / `<details>` one-off | `<EdDisclosure>` |
| Material `<Accordion>` / `<Expansion>` | `<EdAccordion>` |

Notable diffs:
- `EdCard` interactive cards must be real elements (`asChild`) — a `<div onClick>` won't pass review or a11y.
- `EdModal` replaces the grab-bag of modal usages with a single convention; the `busy` prop is new (use it for imports/long saves instead of a separate spinner overlay).
- `EdDrawer` defaults to **non-modal**. If your old drawer trapped focus + dimmed the page, pass `modal`.
- `EdAccordion` takes items as a data array, not `<AccordionItem>` children — map your data to `{ value, title, meta?, content }`.

---

## 7. Success criteria

- [ ] `yarn test` passes — five new suites + everything from Bundles 1–5.
- [ ] `yarn build` zero new warnings.
- [ ] `yarn storybook` shows the five new entries under `Containers`.
- [ ] `@radix-ui/react-accordion` resolved; Bundle 5's `EdDialog` present (EdModal compiles).
- [ ] Stylelint passes (no hex in EditorialUI SCSS).
- [ ] Dark-theme spot check — cards, modal overlay, drawer edge + shadow, accordion hairlines all read correctly.
- [ ] Manual a11y:
  - `EdCard` interactive — Tab reaches it, Enter/Space activates, focus ring visible.
  - `EdModal` busy — screen reader announces stage; cancel reachable; Esc blocked.
  - `EdDrawer` — focus moves in on open, returns to trigger on close; non-modal leaves the page operable.
  - `EdDisclosure` / `EdAccordion` — `aria-expanded` flips; accordion arrow-key nav works.
- [ ] `prefers-reduced-motion: reduce` — drawer slide, accordion expand, chevron rotation all disabled.

---

## 8. What's NOT in this bundle

- **No EdTabs.** Sibling/mutually-exclusive views are Bundle 7 — the spec points users from EdAccordion to EdTabs for that case.
- **No EdPopover / EdMenu / EdContextMenu.** Bundle 7 (Navigation).
- **No data table.** `EdCard` explicitly is NOT a table substitute — `EdDataTable` is Bundle 8.
- **No routing / URL-state helper.** `EdDrawer` documents the `?drawer=<id>` convention but the call site owns routing (TanStack Router / your router of choice).
- **No app-level migration.** Land the library clean; migrate consumers in follow-up PRs.

Lead the PR with the `screenshots/` grid so reviewers can match each component
to its spec at a glance.
