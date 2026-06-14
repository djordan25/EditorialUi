# Claude Code — EditorialUI Data Bundle (Bundle 8)

You are integrating the **eighth bundle** of the EditorialUI design system into
the `prodicusgroup/apostlerisk` repo (React 19 + Radix + Storybook 10 +
react-hook-form + zod + TanStack). Bundles 1–7 are already merged.

This bundle adds the components that render rows of records: `EdDataTable`,
`EdNativeTable` (+ `EdKeyValueTable`), and `EdList`.

---

## 1. What's in this drop

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← UPDATED barrel (Bundles 1–8 — additive)
        ├── EdNativeTable/          ← EdNativeTable + EdKeyValueTable
        ├── EdDataTable/
        └── EdList/
```

Same shape as previous bundles: `*.tsx` + `*.module.scss` + `*.stories.tsx`
+ `*.test.tsx` + `index.ts`.

Visual reference per component (in `screenshots/`):
- `01-EdDataTable.png` / `02-EdDataTable.png` — anatomy (toolbar, sortable headers, selection, superseded row, footer) + density + states (empty, loading, error).
- `01-EdNativeTable.png` / `02-EdNativeTable.png` — anatomy (key-value) + layouts (columned, zebra, in side panel).
- `01-EdList.png` / `02-EdList.png` — anatomy + variants (simple, avatar+desc, icon+meta, grouped, empty, skeleton).

Full spec HTML: `design_system_v2/components/{data-table,native-table,list}.html`.

---

## 2. Hard conventions (still in force)

All prior conventions hold: `Ed*` prefix, folder structure, token-only SCSS,
light default + `[data-theme="dark"]`, sentence case, semantic HTML, ARIA wired
in the component, `prefers-reduced-motion` honored.

---

## 3. Implementation tasks

### 3.1 — No new dependencies

All three are plain React + CSS + lucide-react (already on the project). Nothing
to install.

### 3.2 — Copy the bundle into the repo

```bash
cp -R src/components/EditorialUI/EdNativeTable <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDataTable   <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdList         <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp    src/components/EditorialUI/index.ts       <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/index.ts
```

### 3.3 — Run tests

```bash
yarn test --run src/components/EditorialUI
yarn build
yarn storybook         # all three under EditorialUI/Data/*
```

The three test files (~35 cases) cover table semantics + sort cycle + client
sort + controlled sort, selection (single + select-all + aria-selected +
checkbox-stops-row-click), pagination, empty/error/loading states, native-table
scope wiring, and list listbox roles + keyboard select + accessible-name folding.

---

## 4. Wiring `EdDataTable` — the integration points

`EdDataTable<Row>` is generic and column-config driven. Two decisions at each call site:

### 4.1 — Sorting & pagination: client vs server

- **Client (small, fully-loaded sets):** omit `sort`/`onSortChange`; give sortable columns a `sortAccessor`. The table sorts in place. Omit pagination props.
- **Server (paginated):** pass `sort` + `onSortChange` (push to URL/query) and `page` + `pageCount` + `onPageChange` + `totalCount`. The table renders exactly the rows you pass for the current page.

### 4.2 — Virtualization (>100 rows)

The component renders all rows it's given. For large sets, wrap the row mapping
with **TanStack Virtual** at the call site — keep the `<tbody>` + `<tr>`/`<td>`
semantics intact (don't replace them with divs). Row heights are fixed per
density: **40px default / 32px compact**. For most server-paginated tables you
won't need virtualization at all — page size keeps the DOM small.

### 4.3 — Cells compose earlier-bundle components

Column `cell` renderers return any node. Wire the real components:
- severity/status → `EdStatusBadge` (Bundle 4)
- categories → `EdTag` (Bundle 4)
- `rowActions` → `EdMenu` overflow button (Bundle 7)
- wrap `<tr>` in `EdContextMenu` for right-click (Bundle 7)
- `onRowClick` → open `EdDrawer` (Bundle 6) or navigate
- `empty`/`error` → `EdEmptyState` (Bundle 5)

### 4.4 — Checkbox swap (optional)

Selection uses a native `<input type="checkbox">` styled with `accent-color` to
keep the table dependency-free. To use the `EdCheckbox` visual (Bundle 2), replace
the two `<input type="checkbox">` renders in `EdDataTable.tsx` — they're isolated
and already `aria-label`led.

---

## 5. Per-component success checklist

### `EdDataTable`
- [ ] Semantic `<table>`/`<thead>`/`<tbody>`; `<th scope="col">` headers.
- [ ] Sortable headers are `<button>`s inside `<th aria-sort>`; cycle none→asc→desc→none.
- [ ] Client sort works uncontrolled (via `sortAccessor`); controlled mode fires `onSortChange` without mutating.
- [ ] Row checkbox `aria-label="Select row {id}"`; header checkbox is select-all-on-page with indeterminate.
- [ ] Clicking a checkbox cell does NOT fire `onRowClick`.
- [ ] Selection changes announce via the toolbar's live region ("3 of 312 selected").
- [ ] Superseded rows are visibly dimmed; loading shows skeleton rows; empty/error slots render.
- [ ] Paginator disables prev on page 1 / next on the last page.

### `EdNativeTable` / `EdKeyValueTable`
- [ ] Key-value labels are `<th scope="row">` (AT reads "ID: F-2438").
- [ ] Columned headers are `<th scope="col">`; `caption` is available for SR-only titles.
- [ ] Custom cell renderers + right-align + mono + zebra all work.

### `EdList`
- [ ] `selectionMode="none"` → plain `<ul>`; `"single"` → `role="listbox"` + `role="option"`.
- [ ] Selected option `aria-selected="true"`; Enter/Space select; disabled options don't.
- [ ] Title + description + meta fold into the accessible name.
- [ ] Group labels, empty state, and loading skeleton render.

---

## 6. Migration table

| Existing usage | EditorialUI |
|---|---|
| TanStack Table + bespoke markup | `<EdDataTable>` (keep your TanStack query/pagination; feed rows in) |
| Material `<Table>` inventory grid | `<EdDataTable>` |
| Hand-rolled metadata `<table>` / `<dl>` in panels | `<EdKeyValueTable>` |
| Small static stats table | `<EdNativeTable>` |
| Material `<List>` / picker results | `<EdList>` |
| `react-window` / `react-virtualized` lists | `<EdList>` for short sets; `<EdDataTable>` + TanStack Virtual for large |

Notable diffs:
- `EdDataTable` is **column-config driven** (`EdColumn<Row>[]`), not `<Column>` children. Map your TanStack column defs to `EdColumn`.
- It does NOT own data fetching, server pagination, or virtualization — those stay at the call site (TanStack Query / Router / Virtual). The component owns presentation + interaction.
- `EdList` selection is single-select; for multi-select-with-bulk-actions use `EdDataTable selectable`.

---

## 7. Success criteria

- [ ] `yarn test` passes — three new suites + everything from Bundles 1–7.
- [ ] `yarn build` zero new warnings.
- [ ] `yarn storybook` shows the three new entries under `Data`.
- [ ] Stylelint passes (no hex in EditorialUI SCSS).
- [ ] Dark-theme spot check — header row, selected row tint, superseded dim, zebra, skeleton all read correctly.
- [ ] Manual a11y:
  - `EdDataTable` — screen reader reads column headers + sort state; row select announces; Tab reaches checkboxes + row actions (no Excel-style arrow grid nav — that's intentional per spec).
  - `EdNativeTable` — key-value reads "label: value"; columned reads headers.
  - `EdList` — listbox announces options + selection; arrow/Enter work.
- [ ] `prefers-reduced-motion: reduce` — skeleton pulse disabled.

---

## 8. What's NOT in this bundle

- **No built-in virtualization.** Wrap with TanStack Virtual at the call site for >100 rows. Deliberate — keeps row-height assumptions out of the primitive.
- **No data fetching / server-state.** TanStack Query stays at the call site; the table is presentation + interaction only.
- **No column resize / reorder / show-hide.** The toolbar's `toolbarEnd` slot is where a column-settings popover goes; build it as a follow-up if needed.
- **No EdFilterChipRow.** Bundle 9 — the filter row that sits above the table.
- **No app-level migration.** Land the library clean; migrate consumers in follow-up PRs.

Lead the PR with the `screenshots/` grid so reviewers can match each component
to its spec at a glance.
