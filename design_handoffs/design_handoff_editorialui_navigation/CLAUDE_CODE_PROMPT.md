# Claude Code — EditorialUI Navigation Bundle (Bundle 7)

You are integrating the **seventh bundle** of the EditorialUI design system into
the `prodicusgroup/apostlerisk` repo (React 19 + Radix + Storybook 10 +
react-hook-form + zod + TanStack). Bundles 1–6 are already merged.

This bundle adds the components for moving between views and invoking commands:
`EdTabs`, `EdBreadcrumb`, `EdMenu`, and `EdContextMenu`.

---

## 1. What's in this drop

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← UPDATED barrel (Bundles 1–7 — additive)
        ├── EdTabs/
        ├── EdBreadcrumb/
        ├── EdMenu/                 ← exports EdMenu + the EdMenuEntry item model
        └── EdContextMenu/          ← imports ../EdMenu (shared model + stylesheet)
```

Same shape as previous bundles: `*.tsx` + `*.module.scss` + `*.stories.tsx`
+ `*.test.tsx` + `index.ts`.

Visual reference per component (in `screenshots/`):
- `01-EdTabs.png` / `02-EdTabs.png` — anatomy (underline) + variants (segmented, counts, icons, status dot).
- `01-EdBreadcrumb.png` / `02-EdBreadcrumb.png` — anatomy + variants (overflow, back-link, chevron separator).
- `01-EdMenu.png` / `02-EdMenu.png` — anatomy + item types (simple, icons, shortcuts, checkable, metadata, submenu).
- `01-EdContextMenu.png` / `02-EdContextMenu.png` — anatomy + triggers (table row, graph node, canvas, text selection).

Full spec HTML for any detail the code doesn't make obvious:
`design_system_v2/components/{tabs,breadcrumb,menu,context-menu}.html`.

---

## 2. Hard conventions (still in force)

All prior conventions hold: `Ed*` prefix, folder structure, token-only SCSS,
light default + `[data-theme="dark"]`, sentence case, Radix where possible,
`lucide-react` only, `prefers-reduced-motion` honored, ARIA wired in the component.

---

## 3. Implementation tasks

### 3.1 — Install Radix deps

```bash
yarn add @radix-ui/react-tabs @radix-ui/react-dropdown-menu @radix-ui/react-context-menu
```

`EdBreadcrumb` needs nothing new.

### 3.2 — Copy the bundle into the repo

```bash
cp -R src/components/EditorialUI/EdTabs        <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdBreadcrumb  <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdMenu        <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdContextMenu <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp    src/components/EditorialUI/index.ts      <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/index.ts
```

**`EdContextMenu` imports `../EdMenu`** for the shared `EdMenuEntry` type and the
`.module.scss`. Copy `EdMenu` in the same PR — never ship `EdContextMenu` alone.

### 3.3 — Run tests

```bash
yarn test --run src/components/EditorialUI
yarn build
yarn storybook         # all four under EditorialUI/Navigation/*
```

The four test files (~35 cases) cover tab roles + arrow nav + manual activation,
breadcrumb links/current/overflow-expand, menu item types + checkbox-stays-open +
destructive aria-label, and context-menu right-click open + item invoke.

> **jsdom note:** All three Radix primitives here render into portals and use
> pointer APIs jsdom only partially implements. The provided tests drive
> interactions via `user-event` (including `pointer({ keys: '[MouseRight]' })`
> for the context menu) and assert on roles / text — they pass under jsdom.
> Don't assert on positioning/flip behavior in jsdom; use Playwright CT.

---

## 4. Per-component success checklist

### `EdTabs`
- [ ] `role="tablist"` / `tab` / `tabpanel` wired by Radix; active tab `aria-selected`.
- [ ] Count pill folds into the accessible name (`"Findings, 23"`).
- [ ] `underline` shows the 2px brand underline on active; `segmented` shows the lifted pill.
- [ ] `automatic` selects on arrow-focus; `manual` waits for Enter/Space (use for async panels).
- [ ] Active tab encoded in `?tab=<value>` at the call site (component exposes `value`/`onValueChange`).

### `EdBreadcrumb`
- [ ] `<nav aria-label="Breadcrumb"><ol>`; final crumb is plain text with `aria-current="page"`.
- [ ] Non-final crumbs are links (or your `renderLink` router adapter).
- [ ] Collapses past `maxItems` behind a "…" button that expands inline.
- [ ] Separators are `aria-hidden`; long labels truncate at 200px.

### `EdMenu`
- [ ] Trigger gets `aria-haspopup="menu"` + `aria-expanded` (Radix).
- [ ] Action / checkbox / label / separator / submenu entries all render from the one `items` array.
- [ ] Checkbox items use `role="menuitemcheckbox"` + `aria-checked` and keep the menu open on toggle.
- [ ] Destructive items render danger tone AND carry an explicit `ariaLabel` naming the entity.
- [ ] Arrow keys navigate; Enter/Space invokes; Esc + outside-click dismiss.

### `EdContextMenu`
- [ ] Right-click on the trigger opens the menu; native browser menu suppressed.
- [ ] Same item model + visuals as `EdMenu` (imports its type + stylesheet).
- [ ] Keyboard equivalent (Shift+F10 / Menu key) opens the menu on the focused target (Radix).
- [ ] Every action also exists in the visible UI; no destructive-only-here actions.

---

## 5. Migration table

| Existing usage | EditorialUI |
|---|---|
| Material `<Tabs>` | `<EdTabs>` |
| Segmented control / `<ToggleButtonGroup>` | `<EdTabs variant="segmented">` |
| Bespoke breadcrumb markup | `<EdBreadcrumb>` (pass `renderLink` for TanStack Router `<Link>`) |
| Material `<Menu>` / dropdown | `<EdMenu>` |
| Bespoke right-click handlers | `<EdContextMenu>` |

Notable diffs:
- `EdTabs` / `EdMenu` / `EdContextMenu` take **data arrays**, not `<Tab>`/`<MenuItem>` children. Map your data to the item models.
- `EdMenu` and `EdContextMenu` share one `EdMenuEntry` type — build the `items` array once, use it for both the row overflow button and the row right-click.
- Breadcrumb's final crumb is NOT a link — don't pass `href` on it.
- For SPA routing, pass `renderLink` to `EdBreadcrumb` (or `onClick` per crumb) instead of relying on `href` full-page navigation.

---

## 6. Success criteria

- [ ] `yarn test` passes — four new suites + everything from Bundles 1–6.
- [ ] `yarn build` zero new warnings.
- [ ] `yarn storybook` shows the four new entries under `Navigation`.
- [ ] Three Radix peer deps resolved.
- [ ] Stylelint passes (no hex in EditorialUI SCSS).
- [ ] Dark-theme spot check — tab underline, segmented pill, menu surface, context-menu danger item all read correctly.
- [ ] Manual a11y:
  - `EdTabs` — arrow keys move tabs; manual mode doesn't fire async fetches on focus.
  - `EdBreadcrumb` — screen reader announces the trail; current page is `aria-current`.
  - `EdMenu` — keyboard open/navigate/invoke; destructive item announces the entity name.
  - `EdContextMenu` — Shift+F10 opens on the focused row; touch long-press works.
- [ ] `prefers-reduced-motion: reduce` — menu open animation disabled.

---

## 7. What's NOT in this bundle

- **No EdDataTable.** Bundle 8. `EdContextMenu` + `EdMenu` will wrap its rows / column headers there.
- **No EdFilterChipRow.** Bundle 9 — that's the "narrow the same dataset" counterpart to tabs.
- **No EdPopover.** Non-command hover/click content is a separate primitive (interactive content, not a list of verbs).
- **No app-level migration.** Land the library clean; migrate consumers in follow-up PRs.

Lead the PR with the `screenshots/` grid so reviewers can match each component
to its spec at a glance.
