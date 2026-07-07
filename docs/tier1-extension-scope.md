# Tier-1 editorial-ui extension scope

Concrete, **additive, backward-compatible** upstream work to unblock the three Tier-1 items in
the Cerynto app's [`editorial-ui-extension-backlog.md`](../../../apostlerisk.api/docs/editorial-ui-extension-backlog.md).
Each item lets the app retire a custom `Prodicus*` control via the adapter-seam pattern (the app keeps
its stable `Prodicus*` wrapper; only the internals swap to the `Ed*` component).

All gaps re-verified against **editorial-ui v0.1.3** source (2026-07-06) before scoping — every Tier-1
claim still holds. Nothing here bumps a Radix major or breaks an existing `Ed*` consumer.

**Unblocks:** Modal (62) + Dialog (12) + DataTable (31) + ComboBox (5) + Autocomplete (8) ≈ **118 call sites.**

---

## Item 1 — Dialog + Modal: decoupled close + compound slots + hidden title  — effort **M**

App contract (files that get retired/thinned):
`ProdicusDialog.tsx` (QA-008 `suppressClickAway` guarding pointer-down-outside + interact-outside;
QA-009 visually-hidden Title when only `aria-label`; `maxWidth xs|sm|md|lg|xl|false`),
`ProdicusDialogContent`/`ProdicusDialogActions` slots (9+ sites), `ProdicusModal` (19+ consumers / 62 usages).

**Additive API on `EdDialog.tsx` / `EdModal.tsx`:**

| Change | Signature | Back-compat |
|---|---|---|
| Decouple close controls (also guard `onPointerDownOutside`, not just `onInteractOutside` @103) | `dismissOnOutsideClick?: boolean; dismissOnEscape?: boolean` (both default `undefined`) | When both unset, the existing `preventOutsideClose` branch (EdDialog.tsx:103-108) runs verbatim. Adapter maps `suppressClickAway → dismissOnOutsideClick={false}`, leaving Escape on. |
| Visually-hidden / aria-label-only title (QA-009) | `titleVisuallyHidden?: boolean; 'aria-label'?; 'aria-labelledby'?` — always emit a `RadixDialog.Title` (srOnly) so Radix's missing-title warning never fires | Defaults to today's visible header. |
| Opt-in compound slots | `export function EdDialogBody(...)`, `EdDialogActions(...)` — thin wrappers over `styles.body` / `styles.footer` | Purely additive components; `children`+`footer` prop paths untouched. |
| Forward new props through `EdModal` | add the same 4 props to `EdModalProps`; while `busy`, force both dismiss props `false` | Additive; `busy` still hides close + blocks dismissal. |

**Radix dedupe:** EdDialog already uses `@radix-ui/react-dialog ^1.1.16` — **no new Radix dep.** Keep it at
`^1.1.x` (do not bump to a 1.2/2.x major) so transitive focus-scope/dismissable-layer/focus-guards stay on
the app's PR #412 pinned singletons.

**Key open decisions:**
1. Close-control shape: two booleans `dismissOnOutsideClick`/`dismissOnEscape` *(recommended)* vs `closeOn?: 'both'|'escape'|'none'` vs adding `preventEscapeClose`. Define precedence when `preventOutsideClose` is also set.
2. Compound slots (`EdDialogBody`/`EdDialogActions`) *(recommended — 1:1 adapter swap)* vs one-time call-site rewrite to `title`/`footer`.
3. `maxWidth` parity — add an `xs` size (~444px, used by `IdleTimeoutWarning`) or accept `xs→sm` widening in the adapter.
4. Whether to reuse `EdModal`'s existing `busy`/`busyContent` for ProdicusModal's spinner, or keep the spinner app-side.

**Watch-outs:** double-footer if a caller uses `EdDialogActions` *and* the `footer` prop (document "pick one");
hidden-title + `!hideClose` leaves an empty header row (check `styles.header` padding); there is a dead
`aria-describedby={description ? undefined : undefined}` at EdDialog.tsx:109 — fix while here.

---

## Item 2 — DataTable: virtualization + keyboard rows + responsive cards  — effort **L**

App contract: `ProdicusDataTable` (31 usages) is **TanStack-native** — `ColumnDef<T>[]`, `SortingState` +
`RowSelectionState` with **`OnChangeFn` updater functions**, `@tanstack/react-virtual` (spacer `<tr>`s),
per-row `tabIndex` + Enter/Space (QA-E1), `cardLayout`/`renderCard` `<li>` stack < 768px, `pinFirstColumn`,
first-paint-skeleton-vs-refetch-bar. Its test asserts `updater({}) === {a:true, b:true}` — i.e. the exact
TanStack updater semantics. Canonical consumer: `ModelInventoryPage.tsx`.

**This is the one item where "extend the existing component" is not honest.** `EdColumn`
(`{id, header, cell:(row)=>ReactNode, sortAccessor}`) is **not** `ColumnDef`-compatible (no
`accessorKey`/`accessorFn`/cell-context/`getSize`/`enableSorting`), and `EdDataTable` uses
`EdSortState` + `string[] selectedIds` — not TanStack updater-fn state. A lossy adapter would silently drop
updater-fn sort/selection, `flexRender` header context, and column pinning that the 31 usages rely on.

**Recommended split:**

- **Cheap, additive, on the existing `EdDataTable`** (S/M): opt-in `renderCard` + `cardLayout` (`<li>` stack,
  mirrors ProdicusDataTable 218-249) and keyboard rows (`tabIndex=0` + Enter/Space fired from the existing
  `onRowClick` gate at 312-322). Both default off / behavior-only → zero change for current consumers.
- **New TanStack-backed sibling `EdDataGrid`** *(recommended)* — a 1:1 superset of the ProdicusDataTable
  contract so the seam becomes a near-identity prop map. Owns `useReactTable` + `useVirtualizer`, the built-in
  selection column, keyboard rows, cards, `pinFirstColumn`, skeleton/refetch split. `EdDataTable` (bespoke
  `EdColumn`) stays untouched for its current inventory/audit consumers.

```
export interface EdDataGridProps<T extends RowData> {
  data: T[]; columns: ColumnDef<T, unknown>[]; getRowId?;
  sorting?: SortingState; onSortingChange?: OnChangeFn<SortingState>;
  enableRowSelection?: boolean; rowSelection?: RowSelectionState; onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  estimateRowHeight?; overscan?; onRowClick?; renderCard?; cardLayout?; pinFirstColumn?;
  rowClassName?; isLoading?; skeletonRows?; renderEmpty?; ariaLabel: string; className?;
}
```

**Dependency decision (cross-cutting):** `EdDataGrid` needs `@tanstack/react-table` + `@tanstack/react-virtual`
(both already in the app, **absent from editorial-ui today**). Add them as **`peerDependencies`** (dedupe with the
app, mirrors the react/react-dom precedent) rather than `dependencies` (which risks a duplicate TanStack instance
across the boundary). Also migrate ProdicusDataTable's `eslint-disable react-hooks/incompatible-library` for
`useReactTable` into editorial-ui.

**Key open decisions:**
1. **`EdDataGrid` (new component)** *(recommended)* vs lossy `ColumnDef→EdColumn` adapter on `EdDataTable`.
2. TanStack as **peer** *(recommended)* vs dependency.
3. Keyboard activation default **ON when `onRowClick` set** (matches QA-E1 + today's `cursor:pointer`) vs opt-in flag.
4. Where `renderCard`/`cardLayout` live — on `EdDataTable` (reused by both) vs only on `EdDataGrid`.

---

## Item 3 — Object-value Select/ComboBox + renderOption + inline constrained type-ahead  — effort **M**

App contract: `ProdicusComboBox<T>` (4 consumers incl. `UserPicker` — `value:T|null`, `onChange:(T|null)`,
`getOptionKey`, `renderOption(T,{searchText})`, controlled `inputValue`/`onInputChange`, full list at 0 chars);
`ProdicusAutocomplete` (6 graph-builder dialogs — inline **constrained** type-ahead emitting `ProdicusOption|null`).
Consumers read `.id`/`.bvnId`/`.itemGuid` off the object value.

**Additive API on `EdComboBox.tsx` (make it optionally generic — the string default stays the default):**

| Change | Signature | Back-compat |
|---|---|---|
| Optional generic identity model | `EdComboBoxOption<TValue = string>`; new opt props `getOptionValue?: (o)=>string` (default `String(o.value)`), `renderOption?: (o,{query,selected,highlighted})=>ReactNode`, `renderValue?` | With `TValue=string`, `String(value)===value` so all selection/keying logic is identical; `renderOption` defaults to today's internal row. |
| Thread `TValue` through the single/multi union + generic-preserving `forwardRef` cast | `onValueChange?: (value: TValue \| null, option: EdComboBoxOption<TValue> \| null) => void` | Default `string` keeps `(string\|null)`; added `option` arg is optional. Pure type-level change, runtime identical. |
| Optional controlled input text | `inputValue?: string; onInputChange?: (text: string) => void` | Unset → keeps internal `query` useState + reset-on-close. |

**New component `EdInlineSelect`** — inline, list-**constrained**, object-value type-ahead (the
`ProdicusAutocomplete` replacement). `Popover.Anchor=input` (same anti-flash pattern as `EdAutocomplete`),
reuses `_internal/listbox` (`useListboxNav`/`highlightMatch`/`filterByLabel`), `minQueryLength` defaults to **0**
(full list at 0 chars), committed value is always a selected option or `null`. **`EdAutocomplete` is left
untouched** — bolting a constrained mode onto its free-text string model would fight it.

**Radix dedupe:** `EdComboBox` + `EdInlineSelect` both reuse `@radix-ui/react-popover ^1.1.16` — **no new Radix dep.**
`EdSelect` (react-select) is not modified.

**Key open decisions:**
1. Ship **`EdInlineSelect` + generic `EdComboBox`** *(recommended)* vs ship **only `EdInlineSelect`** and migrate all 4
   inline single-select `ProdicusComboBox` consumers to it (lower risk *if* none need multi-select object identity — confirm).
2. `renderOption` state bag `{query,selected,highlighted}` *(recommended)* — adapt the app's `{searchText}` at the seam.
3. `getOptionValue` default `String(option.value)` *(recommended)* — the adapter must `String()`-coerce numeric `.bvnId`/`.key`.
4. Whether `EdInlineSelect` needs the async `onSearch`/debounce path now (ProdicusAutocomplete is sync) or later.

---

## Recommended sequencing

1. **Item 1 (Dialog/Modal)** — highest leverage (74 usages), pure prop/JSX + two thin slot components, no new deps. Start here.
2. **Item 3 (Select/ComboBox)** — contained, no new deps; the generic-identity core is the only risk area.
3. **Item 2 (DataTable)** — largest: gates on the `EdDataGrid`-vs-adapter and TanStack-peer-dep decisions; do the cheap
   `cardLayout`/keyboard-rows additions to `EdDataTable` first, then the `EdDataGrid` build.

Each landed capability then migrates app-side via the same adapter-seam recipe used for the 13 already done
(reimplement the `Prodicus*` wrapper on the `Ed*` component, keep exports + props, run the full `yarn test`
incl. consumer tests before merging).
