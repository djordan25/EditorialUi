# Claude Code — EditorialUI Feedback Bundle (Bundle 5)

You are integrating the **fifth bundle** of the EditorialUI design system into
the `prodicusgroup/apostlerisk` repo (React 19 + Radix + Storybook 10 +
react-hook-form + zod + TanStack). Bundles 1–4 are already merged.

This bundle adds the components that talk back to the user: hover labels
(`EdTooltip`), persistent banners (`EdNotification`), modal surfaces (`EdDialog`
+ `EdConfirmation`), and empty regions (`EdEmptyState`).

---

## 1. What's in this drop

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

Same shape as previous bundles: every folder ships
`*.tsx` + `*.module.scss` + `*.stories.tsx` + `*.test.tsx` + `index.ts`.

Visual reference per component (in `screenshots/`):
- `01-EdTooltip.png` / `02-EdTooltip.png` — anatomy (simple + rich + kbd) + use cases + placements.
- `01-EdNotification.png` / `02-EdNotification.png` — anatomy + four severities + variants (compact / subtle / stacked).
- `01-EdDialog.png` / `02-EdDialog.png` — anatomy + sizes (sm/md/lg/xl) + danger + no-header variants.
- `01-EdEmptyState.png` / `02-EdEmptyState.png` — anatomy + variants by reason (first-use / no-results / error / success / restricted / compact).

Full spec HTML for any detail the code doesn't make obvious:
`design_system_v2/components/{tooltip,notification,dialog,empty-state}.html`.

---

## 2. Hard conventions (still in force)

All prior conventions hold: `Ed*` prefix, folder structure, token-only SCSS,
light default + `[data-theme="dark"]`, sentence case, Radix where possible,
`lucide-react` only, `error` replaces `hint`, `prefers-reduced-motion` honored.

Reinforced this bundle:

- **Color is never the only signal.** `EdNotification` requires a leading icon per severity; `EdEmptyState` error/success tones still carry an icon + text. Don't ship color-only differentiation.
- **ARIA role is derived, not hand-set.** `EdNotification` picks `status` vs `alert` from severity automatically. Don't override unless you have a specific reason (a banner present on initial load → `role="none"`).

---

## 3. Implementation tasks

### 3.1 — Install Radix deps

```bash
yarn add @radix-ui/react-tooltip @radix-ui/react-dialog
```

`EdNotification` and `EdEmptyState` need nothing new.

### 3.2 — Copy the bundle into the repo

```bash
cp -R src/components/EditorialUI/EdTooltip       <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdNotification   <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDialog         <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdEmptyState     <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp    src/components/EditorialUI/index.ts         <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/index.ts
```

### 3.3 — Wire EdTooltipProvider at the app root

Add once, inside the theme provider so it inherits `data-theme`:

```tsx
import { EdTooltipProvider } from '@/components/EditorialUI';

<EdTooltipProvider delayDuration={500} skipDelayDuration={300}>
  <App />
</EdTooltipProvider>
```

`EdTooltip` works without it (lazily self-provides), but the app-level provider
is what makes adjacent-tooltip hovers instant. Do this in the same PR.

### 3.4 — Storybook categories

| Component | Story path |
|---|---|
| `EdTooltip` | `EditorialUI/Feedback/EdTooltip` |
| `EdNotification` | `EditorialUI/Feedback/EdNotification` |
| `EdEmptyState` | `EditorialUI/Feedback/EdEmptyState` |
| `EdDialog` | `EditorialUI/Containers/EdDialog` |

`EdDialog` is categorised under `Containers` (spec D1) — it's the modal surface
`EdModal` / `EdSidePanel` will build on in Bundle 6.

### 3.5 — Run tests

```bash
yarn test --run src/components/EditorialUI
yarn build
yarn storybook
```

The four new test files (~35 cases) cover tooltip show-on-focus + rich variant,
notification role derivation + dismiss, dialog focus-trap / Esc / preventOutsideClose
+ the confirmation preset, and empty-state heading-level + decorative-icon wiring.

> **jsdom note:** Radix Tooltip and Dialog render into portals and rely on
> pointer/animation APIs jsdom only partially implements. The provided tests
> drive interactions through `@testing-library/user-event` and assert on roles /
> text — they pass under jsdom. If you add tests that assert on *positioning* or
> *animation end*, gate them behind a real-browser test runner (Playwright CT),
> not jsdom.

---

## 4. Per-component success checklist

### `EdTooltip`
- [ ] Trigger is the single child via Radix `asChild` — it must be one focusable element.
- [ ] Simple variant renders `label` (+ optional `kbd`); rich variant renders `title` + `body`.
- [ ] Tooltip appears on **focus** (instant) and **hover** (after delay); closes on blur / mouseleave / Esc.
- [ ] For an icon-only button, the `label` matches the trigger's `aria-label` exactly. Lint/grep for `EdIconButton` without a wrapping tooltip where the label isn't visible.
- [ ] `disabled` renders the bare trigger and never a tooltip.
- [ ] `prefers-reduced-motion` disables the fade.

### `EdNotification`
- [ ] info/success → `role="status"` + `aria-live="polite"`; warning/danger → `role="alert"` + `aria-live="assertive"`.
- [ ] Every severity renders its leading icon. No color-only banners.
- [ ] Actions are ghost / secondary — never primary. (Reviewers should reject a primary button inside a banner.)
- [ ] `compact` collapses to a single line (no description / actions); `subtle` drops the rail for in-card use.
- [ ] Dismiss button only appears with `onDismiss`; default aria-label is "Dismiss notification".

### `EdDialog`
- [ ] Title is wired to `aria-labelledby` (Radix `Dialog.Title`); `description` → `Dialog.Description`.
- [ ] Focus traps inside; returns to the trigger on close (Radix default — don't disable).
- [ ] Esc + overlay-click close by default; `preventOutsideClose` blocks both.
- [ ] Body scrolls; header + footer stay pinned.
- [ ] `EdConfirmation` calls `onConfirm` then closes; cancel closes without confirming. Pass `renderActions` with real `EdButton`s in app code (the native fallback is for standalone use only).
- [ ] Don't open a dialog from inside a dialog.

### `EdEmptyState`
- [ ] Title renders at the configured `headingLevel` (default h2) and is the region's first heading.
- [ ] Icon is decorative (`aria-hidden`); the title carries meaning.
- [ ] Works with 0, 1, or 2 actions.
- [ ] Copy follows the spec: plain title, cause+unblock body, primary-verb actions. No mascots / "Oops!" / exclamation.

---

## 5. Backlinks — propose these (NOT in this PR)

- **`EdIconButton` → wrap in `EdTooltip`.** Bundle 1 said "pair with an EdTooltip whenever the label isn't otherwise visible." Now it's possible. In a follow-up, wrap toolbar icon buttons whose label isn't visible: `<EdTooltip label="Filters"><EdIconButton aria-label="Filters" .../></EdTooltip>`.
- **Replace ad-hoc "no data" divs with `EdEmptyState`.** Table bodies and inspector panels have accumulated bespoke empty markup. Migrate during Bundle 8 (Data) table work.

Both are follow-ups — land Bundle 5 clean first.

---

## 6. Migration table

| Existing usage | EditorialUI |
|---|---|
| Material `<Tooltip>` | `<EdTooltip>` (+ app-root `<EdTooltipProvider>`) |
| `<Alert>` / `<Banner>` (informal) | `<EdNotification>` |
| Material `<Dialog>` / `<Modal>` | `<EdDialog>` |
| Bespoke confirm modals / `window.confirm` | `<EdConfirmation>` |
| Ad-hoc "no data" / "no results" divs | `<EdEmptyState>` |
| `react-hot-toast` / snackbar for state | stays for transient toasts; `EdNotification` is for **persistent** state only |

Notable diffs:
- `EdNotification` actions are ghost/secondary — if a banner had a primary CTA, rethink it (it's probably an `EdEmptyState` or a dialog).
- `EdDialog` requires a `title` for the accessible name, or an explicit `aria-label` via the description path. A nameless dialog is a regression.
- `window.confirm` → `EdConfirmation` is a behavior change: it's non-blocking (state-driven open). Wire the `onConfirm` callback rather than awaiting a boolean.

---

## 7. Success criteria

- [ ] `yarn test` passes — four new suites + everything from Bundles 1–4.
- [ ] `yarn build` zero new warnings.
- [ ] `yarn storybook` shows the four new entries (three under `Feedback`, one under `Containers`).
- [ ] Radix peer deps clean.
- [ ] Stylelint passes (no hex in EditorialUI SCSS).
- [ ] Dark-theme spot check across all four — banners, tooltips, dialog overlay, empty-state ring all meet WCAG AA.
- [ ] Manual a11y:
  - `EdTooltip` — keyboard focus shows the tooltip; screen reader reads it via `aria-describedby`; matches icon-button `aria-label`.
  - `EdNotification` — async-appearing danger banner is announced assertively; info banner politely; dismiss is keyboard-reachable.
  - `EdDialog` — focus trapped, returns to trigger on close, Esc closes (unless guarded), title is the accessible name.
  - `EdEmptyState` — title is a real heading at the correct level; icon is not announced.
- [ ] `prefers-reduced-motion: reduce` — tooltip fade, dialog/overlay entrance animations are disabled.

---

## 8. What's NOT in this bundle

- **No toast / snackbar.** Transient confirmations ("Saved") are explicitly out of scope — `EdNotification` is for *persistent* state. A toast primitive may land later; for now keep the existing toast library for transient messages.
- **No EdModal / EdSidePanel.** They're Bundle 6 and build on `EdDialog`. Don't pre-build them here.
- **No EdPopover.** Interactive hover content (links, copy buttons) is a popover, not a tooltip — Bundle 6/7.
- **No app-level migration.** Land the library clean; migrate consumers (and do the two backlink swaps) in follow-up PRs.

Lead the PR with the `screenshots/` grid so reviewers can match each component
to its spec at a glance.
