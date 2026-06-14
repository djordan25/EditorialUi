# Claude Code — EditorialUI Late-Composites Bundle (Bundle 9, final)

You are integrating the **ninth and final bundle** of the EditorialUI design
system into the `prodicusgroup/apostlerisk` repo (React 19 + Radix + Storybook 10
+ react-hook-form + zod + TanStack). Bundles 1–8 are already merged.

This bundle adds the higher-order components that stitch primitives together:
`EdTagContainer`, `EdTagSelect`, `EdFilterChipRow`, `EdDateRangePicker`. After
this, all 37 primitives across the 7 spec groups are implemented.

---

## 1. What's in this drop

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← FINAL barrel (all of Bundles 1–9)
        ├── EdTagContainer/
        ├── EdTagSelect/
        ├── EdFilterChipRow/
        └── EdDateRangePicker/       ← exports EdDateRangePicker + defaultPresets
```

Same shape as previous bundles: `*.tsx` + `*.module.scss` + `*.stories.tsx`
+ `*.test.tsx` + `index.ts`.

Visual reference per component (in `screenshots/`):
- `01-EdTagContainer.png` / `02-EdTagContainer.png` — wrap + single-row + tooltip overflow + empty.
- `01-EdTagSelect.png` / `02-EdTagSelect.png` — anatomy + states (empty, populated, disabled, error).
- `01-EdFilterChipRow.png` / `02-EdFilterChipRow.png` — anatomy + modes (multi, single, no-counts, status dots) + overflow.
- `01-EdDateRangePicker.png` / `02-EdDateRangePicker.png` — anatomy (presets + two months) + trigger states + ISO formatting rules.

Full spec HTML: `design_system_v2/components/{tag-container,tag-select,filter-chip-row,date-range-picker}.html`.

---

## 2. Hard conventions (still in force)

All prior conventions hold: `Ed*` prefix, folder structure, token-only SCSS,
light default + `[data-theme="dark"]`, sentence case, Radix where possible,
semantic HTML, ARIA wired in the component, `prefers-reduced-motion` honored.

---

## 3. Implementation tasks

### 3.1 — Dependency check

```bash
yarn add @radix-ui/react-popover   # already present from Bundle 3 on a normal rollout
```

`EdTagSelect` + `EdDateRangePicker` use Radix Popover. `EdTagContainer` +
`EdFilterChipRow` are plain React + CSS. **`EdDateRangePicker` uses native `Date`
— do NOT add date-fns/dayjs.** If you prefer react-aria's calendar for richer
keyboard semantics, that's a valid swap, but the shipped version is dependency-free.

### 3.2 — Copy the bundle into the repo

```bash
cp -R src/components/EditorialUI/EdTagContainer    <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdTagSelect       <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdFilterChipRow    <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDateRangePicker  <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp    src/components/EditorialUI/index.ts            <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/index.ts
```

The barrel here is the **complete public surface** — it supersedes every prior
bundle's barrel (all earlier exports are included).

### 3.3 — Run tests

```bash
yarn test --run src/components/EditorialUI
yarn build
yarn storybook
```

The four test files (~35 cases) cover tag-container wrap/collapse/overflow,
tag-select add/remove/filter/backspace/allowCreate, filter-chip multi+single
roles + count-in-name + toggle, and date-range preset application + custom
two-click range + ISO formatting + min/max.

> **jsdom note:** `EdTagSelect` and `EdDateRangePicker` render Radix Popover into
> portals. The provided tests assert on roles/text after opening — they pass under
> jsdom. Don't assert on popover positioning in jsdom; use Playwright CT.

---

## 4. Per-component success checklist

### `EdTagContainer`
- [ ] Wrap mode flows tags across rows; single-row collapses past `maxVisible` into "+N more".
- [ ] `renderOverflow(hidden, count)` lets the call site mount a tooltip/popover of the rest.
- [ ] Empty state renders when there are no children.

### `EdTagSelect`
- [ ] `role="combobox"` input; selected values render as removable tags with `aria-label="Remove {tag}"`.
- [ ] Typing filters the menu; clicking/Enter adds; Backspace on empty input removes the last tag.
- [ ] `allowCreate` shows a "Create …" row only when the query has no exact match; off by default.
- [ ] Error sets `aria-invalid`; disabled hides remove buttons.

### `EdFilterChipRow`
- [ ] `multi` → `role="group"` + `role="checkbox"` chips; `single` → `role="radiogroup"` + `role="radio"`.
- [ ] Counts fold into the accessible name (`"Open, 87 items"`).
- [ ] Selected state changes bg + border + text (never color alone).
- [ ] Group dividers + overflow slot render; disabled chips don't toggle.

### `EdDateRangePicker`
- [ ] Trigger shows `YYYY-MM-DD → YYYY-MM-DD` (mono, `→`), or the preset name on exact match, or the placeholder.
- [ ] Two-month calendar; clicking two days sets a start→end range (auto-orders); presets apply + close.
- [ ] `min`/`max` disable out-of-range days; calendar is `role="grid"`; presets are `aria-pressed`.
- [ ] No locale formatting, no time-of-day. `defaultPresets()` returns the recommended set.

---

## 5. Composition — where these land in the app

- **`EdFilterChipRow` + `EdDateRangePicker`** → the toolbar above `EdDataTable` (Bundle 8). Their state drives the table's query (push to URL params alongside sort/page).
- **`EdTagContainer`** → renders `<EdTag>` collections in `EdDrawer` bodies / `EdCard`s (wrap) and `EdDataTable` cells (single-row).
- **`EdTagSelect`** → the multi-tag form field (regulations, watchers, categories) in `EdModal` / `EdDrawer` forms.

All composition is caller-supplied via props — no hard dependencies between these
and the components they slot into.

---

## 6. Migration table

| Existing usage | EditorialUI |
|---|---|
| Bespoke wrapping tag rows | `<EdTagContainer>` |
| `react-select` multi (creatable) tag input | `<EdTagSelect>` (+ `allowCreate`) |
| Material chips / faceted filter bar | `<EdFilterChipRow>` |
| `react-datepicker` / MUI date range | `<EdDateRangePicker>` |

Notable diffs:
- `EdDateRangePicker` is **ISO-only** — if the old picker emitted `Date` objects or locale strings, adapt at the boundary (the component's value is `{ start, end }` ISO strings).
- `EdFilterChipRow` selection is a `string[]` for both modes (single mode = one-element array) — simplifies wiring to URL params.
- `EdTagSelect` locks to known options unless `allowCreate`; don't enable free-text on production-critical lists.

---

## 7. Success criteria

- [ ] `yarn test` passes — four new suites + everything from Bundles 1–8 (the whole library).
- [ ] `yarn build` zero new warnings.
- [ ] `yarn storybook` shows the four new entries; the full tree now covers all 37 primitives.
- [ ] Radix Popover resolved; no date library added.
- [ ] Stylelint passes (no hex in EditorialUI SCSS).
- [ ] Dark-theme spot check across all four.
- [ ] Manual a11y:
  - `EdTagSelect` — combobox announces; Backspace removes; remove buttons labelled.
  - `EdFilterChipRow` — group/radiogroup roles; counts in names; keyboard toggle.
  - `EdDateRangePicker` — grid nav; preset `aria-pressed`; range announced.
- [ ] `prefers-reduced-motion: reduce` — popover/menu entrance animations disabled.

---

## 8. Library complete — recommended follow-ups (separate PRs)

With all 9 bundles merged, the EditorialUI surface is stable. Worth scheduling:

1. **Backlink swaps:** `EdComboBox` multi tags → `EdTag`; `EdPasswordInput` strength → `EdProgressSegmented`.
2. **`EdIconButton` + `EdTooltip`:** wrap label-less icon buttons (promised in Bundle 1).
3. **`EdEmptyState` migration:** replace ad-hoc "no data" divs in tables/panels.
4. **Codemod:** trivial ProdicusUI → EditorialUI import/prop swaps, now that the API is frozen.
5. **Visual regression:** add Chromatic/Playwright snapshots over the full Storybook so the parallel rollout can't drift.

This is the last bundle — no Bundle 10. Lead the PR with the `screenshots/` grid.
