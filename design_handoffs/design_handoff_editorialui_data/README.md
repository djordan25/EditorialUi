# EditorialUI · Data bundle (Bundle 8)

Eighth implementation bundle. The components that render rows of records:
the inventory data table, the static metadata table, and the scannable list.

---

## What's in this bundle

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← UPDATED barrel (Bundles 1–8 — additive)
        ├── EdNativeTable/          ← EdNativeTable + EdKeyValueTable
        ├── EdDataTable/
        └── EdList/
```

Same shape as every bundle: `*.tsx` + `*.module.scss` + `*.stories.tsx`
+ `*.test.tsx` + `index.ts`.

**No new dependencies.** All three are plain React + CSS + a couple of lucide
icons. Virtualization for `EdDataTable` is an opt-in integration step at the
call site (see below) — the component itself ships dependency-free.

---

## Component summary

### `EdNativeTable` (+ `EdKeyValueTable`)
Static, plain tables for small known-row sets — no virtualization, sort, or
selection. Two exports:
- **`EdKeyValueTable`** — label→value grid, no header row. Labels render as
  `<th scope="row">` so AT announces "ID: F-2438". The side-panel / modal-summary
  workhorse.
- **`EdNativeTable`** — columned table (`<th scope="col">`), optional zebra
  striping, custom cell renderers, right-align for numbers.

Both compact-by-default, token-driven, dark-mode-aware. Reach for these instead
of hand-rolling a `<table>` — even static blocks inherit type/spacing/theme.

### `EdDataTable`
The going-forward primitive for inventory pages, picker dialogs, audit logs.
Generic over the row type (`EdDataTable<Finding>`). Column-config driven:

- **Sorting** — per-column, `aria-sort` on headers, cycles none→asc→desc→none. Uncontrolled (client-side via `sortAccessor`) or controlled (`sort` + `onSortChange`) for server pagination.
- **Selection** — leading checkbox column; header checkbox is select-all-on-page with indeterminate state. Controlled (`selectedIds`) or uncontrolled. Row checkbox cells stop click propagation so selection never triggers row-click.
- **Toolbar** — appears when selection is non-empty: a live-region count + your `bulkActions(ids)` + optional `toolbarEnd`.
- **Row interaction** — `onRowClick` (opens detail / drawer), `isSuperseded` (dimmed audit-trail rows), `rowActions` (trailing overflow cell, e.g. an EdMenu).
- **Pagination** — footer range + prev/next when `page` + `pageCount` are provided. Server-driven via `onPageChange`.
- **States** — `loading` (animated skeleton rows), `error`, and `empty` slots.
- **Density** — `default` 40px / `compact` 32px; optional `zebra`.

Semantic `<table>`/`<thead>`/`<tbody>`/`<th scope>` throughout; sortable headers
are real `<button>`s inside `<th aria-sort>`; row checkboxes carry
`aria-label="Select row {id}"`; selection changes announce via a live region.

> **Virtualization:** the spec calls for TanStack Virtual past ~100 rows. This
> component renders all passed rows — wrap the `<tbody>` rows with TanStack
> Virtual at the call site (or pass already-paginated rows). Keeping the
> virtualizer at the call site avoids baking a row-height assumption into the
> primitive. Per-density row heights: 40px (default) / 32px (compact).

> **Checkbox:** uses a native `<input type="checkbox">` (styled via `accent-color`)
> to stay dependency-free. If you want the EdCheckbox visual (Bundle 2), swap the
> two checkbox renders — the markup is isolated and labelled.

### `EdList`
Vertical list of selectable / scannable rows — picker results, recent items,
entity selectors, command-palette results. `selectionMode="none"` renders a
static `<ul>`; `selectionMode="single"` renders a `role="listbox"` with
`role="option"` + `aria-selected` + arrow-key/Enter/Space activation. Optional
leading avatar/icon, title + description, trailing meta (folded into the
accessible name), group labels, disabled rows, empty + loading-skeleton states.

---

## When to use which

| Situation | Reach for |
|---|---|
| Inventory page, ≥3 columns or ≥50 rows, sort/select/paginate | `EdDataTable` |
| 3–10 rows of static metadata (side panel, modal summary) | `EdKeyValueTable` / `EdNativeTable` |
| Picker results, recent items, 1–2 fields, selection is the point | `EdList` |
| Button-triggered action list | `EdMenu` (Bundle 7) |
| Items expand to reveal content | `EdAccordion` (Bundle 6) |

Never use a card grid in place of a table. Tables read as tables.

---

## Drop locations

```bash
cp -R src/components/EditorialUI/EdNativeTable <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDataTable   <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdList         <repo>/ClientApp/src/components/EditorialUI/
cp    src/components/EditorialUI/index.ts       <repo>/ClientApp/src/components/EditorialUI/index.ts
```

All three stories land under `EditorialUI/Data/*`. (The spec files group `EdList`
under *Navigation* (F3); this bundle delivers it with the tables under *Data* —
change the `title` in `EdList.stories.tsx` if you'd rather mirror the spec.)

---

## Composition with earlier bundles

The data table is where the system comes together:
- **Cells** render `EdStatusBadge` (severity/status), `EdTag` (categories) from Bundle 4.
- **`rowActions`** is an `EdMenu` overflow button (Bundle 7); wrap rows in `EdContextMenu` for right-click.
- **`onRowClick`** opens an `EdDrawer` (Bundle 6) or navigates to a detail route.
- **`empty` / `error`** slots take an `EdEmptyState` (Bundle 5).
- **Bulk actions** are `EdButton`s (Bundle 1); destructive ones use the danger variant.

These are all caller-supplied via props/slots — the table doesn't hard-depend on
them, so it compiles standalone and you wire the real components at the call site.

---

## What's next

- **Bundle 9** — Late composites: `EdDateRangePicker`, `EdFilterChipRow`, `EdTagContainer`, `EdTagSelect`. The final bundle — these stitch together primitives from Bundles 2–8 (filter chip rows sit above data tables; tag select builds on combobox + tag).
