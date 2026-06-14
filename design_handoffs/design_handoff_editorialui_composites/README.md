# EditorialUI · Late composites bundle (Bundle 9 — final)

The ninth and final implementation bundle. Higher-order components that stitch
together primitives from the earlier bundles: the tag layout container, the
multi-tag select input, the table filter chip row, and the date-range picker.

With this bundle, all **37 primitives across the 7 spec groups** are implemented.

---

## What's in this bundle

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

Same shape as every bundle: `*.tsx` + `*.module.scss` + `*.stories.tsx`
+ `*.test.tsx` + `index.ts`.

---

## New dependencies

```bash
yarn add @radix-ui/react-popover   # only if not already installed (Bundle 3)
```

`@radix-ui/react-popover` powers `EdTagSelect` and `EdDateRangePicker` — it was
first added in Bundle 3 (EdComboBox / EdAutocomplete), so on a normal rollout
it's already present. `EdTagContainer` and `EdFilterChipRow` are plain React + CSS.
`EdDateRangePicker` does its date math with native `Date` — **no date-fns / dayjs.**

---

## Component summary

### `EdTagContainer`
Layout primitive — lays out a collection of tags with consistent gap + overflow.
`wrap` (default, flowing rows for side panels) or `single-row` (collapses extras
into a "+N more" counter past `maxVisible`, with an optional `renderOverflow` for
a tooltip/popover). Owns the gap/overflow logic so consumers don't reinvent it.
Pass `<EdTag>` (Bundle 4) children.

### `EdTagSelect`
Multi-select input that renders selected values as removable tags, with a
combobox dropdown. Picks from a known list; optional `allowCreate` for free-text
values (lock it off for production-critical lists). Backspace from the empty input
removes the last tag; each tag's remove button is `aria-label`led. Built on Radix
Popover. For a compact dropdown trigger instead of inline tags, use `EdComboBox`
multi (Bundle 3).

### `EdFilterChipRow`
Horizontal row of pill toggles for fast filtering above a table. `multi`
(additive, `role="group"` of checkbox chips) or `single` (mutually-exclusive,
`role="radiogroup"`). Optional count badges (folded into the accessible name),
status dots, group dividers, and an `overflow` slot for "+N more". Selected state
changes **background AND border AND text** — never color alone.

### `EdDateRangePicker` (+ `defaultPresets`)
Two-month calendar with preset shortcuts. **ISO dates only** (`YYYY-MM-DD`, mono,
`→` separator) — no time-of-day, no locale formatting (audit/regulatory work
demands unambiguous ISO). When the selected range matches a preset exactly, the
trigger shows the preset name ("Last 14 days") instead of literal dates. `min`/`max`
constrain selectable days; `defaultPresets(today)` returns the recommended set
(Today / Yesterday / Last 7·14·30 days / This quarter / Year to date). Calendar
grid is `role="grid"`; presets are `aria-pressed` buttons.

---

## Drop locations

```bash
cp -R src/components/EditorialUI/EdTagContainer    <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdTagSelect       <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdFilterChipRow    <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDateRangePicker  <repo>/ClientApp/src/components/EditorialUI/
cp    src/components/EditorialUI/index.ts            <repo>/ClientApp/src/components/EditorialUI/index.ts
```

Storybook categories follow the spec's group taxonomy:
`EdTagContainer` / `EdTagSelect` → `EditorialUI/Display/*`;
`EdFilterChipRow` / `EdDateRangePicker` → `EditorialUI/Selection/*`.

---

## Composition — where these sit

These are the "last mile" components that assemble the rest:

- **`EdFilterChipRow` + `EdDateRangePicker`** sit in the toolbar **above `EdDataTable`** (Bundle 8) — fast status filters + a date-range filter feeding the table's query.
- **`EdTagContainer`** renders `<EdTag>` collections inside `EdDrawer` bodies, `EdCard`s, and `EdDataTable` cells (single-row mode for cells).
- **`EdTagSelect`** is the form input for multi-tag fields (regulations, watchers, categories) inside `EdModal` / `EdDrawer` forms.

As with Bundle 8, these accept children/options as props — they don't hard-depend
on the other components, so each compiles standalone and you compose at the call site.

---

## The system is complete

All nine bundles, 37 primitives:

| Bundle | Group | Components |
|---|---|---|
| 1 | Foundations | EdIcon, EdButton, EdIconButton |
| 2 | Forms | EdTextField, EdPasswordInput, EdCheckbox, EdRadioGroup, EdSwitch, EdFormControlLabel |
| 3 | Selection | EdSelect, EdComboBox, EdAutocomplete |
| 4 | Display | EdTag, EdStatusBadge, EdChip, EdDivider, EdProgressMeter, EdCircularProgress |
| 5 | Feedback | EdTooltip, EdNotification, EdDialog, EdEmptyState |
| 6 | Containers | EdCard, EdModal, EdDrawer, EdDisclosure, EdAccordion |
| 7 | Navigation | EdTabs, EdBreadcrumb, EdMenu, EdContextMenu |
| 8 | Data | EdNativeTable, EdDataTable, EdList |
| 9 | Late composites | EdTagContainer, EdTagSelect, EdFilterChipRow, EdDateRangePicker |

The barrel in this bundle (`src/components/EditorialUI/index.ts`) is the complete
public surface — it supersedes every prior bundle's barrel.

### Suggested post-completion follow-ups (separate PRs)
- The two backlinks flagged earlier: `EdComboBox` multi-mode tags → `EdTag`; `EdPasswordInput` strength meter → `EdProgressSegmented`.
- Wrap label-less `EdIconButton`s in `EdTooltip` (promised in Bundle 1).
- Replace ad-hoc "no data" divs with `EdEmptyState` during table migration.
- Ship the codemod for trivial ProdicusUI → EditorialUI swaps now that the surface is stable.
