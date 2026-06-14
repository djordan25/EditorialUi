# EditorialUI · Selection bundle (Bundle 3)

Third implementation bundle. Selection primitives — where the user picks from a list.

## What's in this bundle

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← UPDATED barrel (foundations + forms + selection)
        ├── _internal/
        │   ├── listbox.ts          ← shared keyboard-nav hook, filter + highlight utils
        │   └── menu.module.scss    ← shared :global() menu / trigger styles
        ├── EdSelect/
        ├── EdComboBox/
        └── EdAutocomplete/
```

Same shape as previous bundles — every component folder ships:
- `*.tsx` — React 19 component
- `*.module.scss` — styles (token-only)
- `*.stories.tsx` — Storybook stories
- `*.test.tsx` — Vitest + Testing Library
- `index.ts` — named export

`_internal/` is **private**. Nothing inside it is re-exported from the public barrel; the imports live behind the EdComboBox / EdAutocomplete public APIs. Stylelint should treat `_internal/` as off-limits to consumer code.

## Drop locations

| What | Where |
|---|---|
| `src/components/EditorialUI/_internal/` | NEW folder. |
| `src/components/EditorialUI/EdSelect/` | NEW folder. |
| `src/components/EditorialUI/EdComboBox/` | NEW folder. |
| `src/components/EditorialUI/EdAutocomplete/` | NEW folder. |
| `src/components/EditorialUI/index.ts` | **OVERWRITES** the forms-bundle barrel — additive. |

## New dependencies

```bash
yarn add @radix-ui/react-select @radix-ui/react-popover
```

| Package | Used by |
|---|---|
| `@radix-ui/react-select` | `EdSelect` |
| `@radix-ui/react-popover` | `EdComboBox`, `EdAutocomplete` |

`lucide-react` is already on the project. Bundles 1–2 dependencies (`@radix-ui/react-checkbox`, `…-radio-group`, `…-switch`, `…-slot`) are still required.

## What each component gives you

### `EdSelect`
Radix Select under the hood. Compact dropdown for **≤7 fixed, known options** where a search bar adds friction. Sizes sm/md/lg. Supports flat lists, grouped sections (`{ kind: 'group', ... }`), separators, item metadata, and disabled items. Auto-wired ARIA (`role="combobox"`, `aria-expanded`, `aria-controls`, group `<Label>` headings).

```tsx
<EdSelect
  label="Severity"
  options={[
    { value: 'low',  label: 'Low' },
    { value: 'med',  label: 'Medium' },
    { value: 'high', label: 'High' },
  ]}
  value={severity}
  onValueChange={setSeverity}
/>
```

### `EdComboBox`
Searchable single- or multi-select for moderate-to-large known lists. Three modes:

1. **Sync** — pass `options` array; the component does the substring filter.
2. **Async** — pass `onSearch(query) => Promise<options>`. Debounced (`debounceMs`, default 200). In-flight requests are cancelled when the query changes. Supports `recents` shown when the query is empty.
3. **Multi-select** — set `multiple` to `true`; values render as removable tags inside the trigger. Optional "Clear all" action.

Built on Radix Popover for positioning + a hand-rolled listbox (Radix has no combobox primitive). ARIA: `role="combobox"` on the trigger with `aria-expanded` / `aria-haspopup="listbox"` / `aria-controls`; `role="combobox"` on the search input with `aria-autocomplete="list"` / `aria-activedescendant`; live region announces result counts.

```tsx
// Single
<EdComboBox
  label="Owner"
  options={owners}
  value={owner}
  onValueChange={setOwner}
/>

// Async + recents
<EdComboBox
  label="Owner"
  onSearch={fetchOwners}
  recents={recentlyUsed}
/>

// Multi
<EdComboBox
  multiple
  label="Regulations"
  options={regs}
  values={picked}
  onValuesChange={setPicked}
/>
```

### `EdAutocomplete`
Free-text input + suggestion menu. **Free text is always valid** — Enter without a highlighted option commits the typed string. Optional "Create new…" action appears when no exact label match exists. Matched substring is highlighted with `<span class="edmenu__hi">` (brand bg, not yellow). Suggestions open after `minQueryLength` characters (default 2). Async + debouncing supported same as EdComboBox.

ARIA: `role="combobox"` with `aria-autocomplete="both"` on the input; live region announces "N suggestions, use arrows to browse" on first qualifying keystroke.

```tsx
<EdAutocomplete
  label="Finding title"
  options={recentFindings}
  value={title}
  onValueChange={setTitle}
  allowCreate
  onCreate={(q) => createFinding(q)}
/>
```

## When to use which

| Situation | Reach for |
|---|---|
| 2 known options | `EdRadioGroup` or `EdSwitch` |
| ≤7 fixed options, no need to type | `EdSelect` |
| Larger known list, value MUST be from list | `EdComboBox` |
| Tag-style multi from a known list | `EdComboBox multiple` |
| Free text with hints (value can be anything) | `EdAutocomplete` |
| Find existing OR create new | `EdAutocomplete` with `allowCreate` |

## Internal patterns this bundle codifies

**`useListboxNav`** (in `_internal/listbox.ts`) is the single source of truth for combobox keyboard nav: ArrowUp/Down with wrap, Home/End, Enter, Escape, plus disabled-item skipping and stable `aria-activedescendant` ids. EdComboBox and EdAutocomplete both use it; future custom combobox-shaped components should reuse it rather than re-implementing.

**`useDebouncedValue`** is used by both async-capable components to debounce the search query. Cancels via per-effect sequence numbers — in-flight stale requests are dropped silently.

**`highlightMatch`** returns a `{ text, matched }[]` array; render with the shared `.edmenu__hi` class so the highlight visual is identical everywhere.

**Shared `:global()` menu classes** (`.edmenu`, `.edmenu__option`, `.edcombo__trigger`, …) live in `_internal/menu.module.scss`. Both EdComboBox and EdAutocomplete `@use` it for side-effect bundling. This keeps the dropdown chrome visually identical between the two components without duplicating styles.

## A11y baseline

- `EdSelect` — Radix Select provides type-ahead, arrow nav, `aria-selected` indicators automatically.
- `EdComboBox` — combobox + listbox roles, `aria-activedescendant` wiring, `aria-multiselectable` in multi mode, focusable tag-remove buttons, live region for result count.
- `EdAutocomplete` — `aria-autocomplete="both"`, live region announcing suggestion count, Create row exposed as a regular `role="option"` so it's keyboard-reachable.

All three blocking-test that the user can:
- open the menu with the keyboard
- navigate options with arrow keys
- select with Enter
- dismiss with Escape without committing
- read the current option count via screen reader

## Migration notes

| ProdicusUI | EditorialUI |
|---|---|
| `<Select>` (Material-style) | `<EdSelect>` |
| `<AsyncSelect>` (react-select) | `<EdComboBox>` (async mode) |
| `<MultiSelect>` (react-select) | `<EdComboBox multiple>` |
| `<TagInput>` | `<EdComboBox multiple>` or `<EdAutocomplete>` |
| `<TypeaheadInput>` / `<Autosuggest>` | `<EdAutocomplete>` |

Notable shape differences:
- Options are plain objects (`{ value, label, meta?, group?, disabled? }`) — not React elements. No more `<Option>` children.
- `value` is the option's `value`, not the option object. Multi mode emits `string[]`.
- Async loading uses an `onSearch(query) => Promise<options>` callback. No `loadOptions` / `cacheOptions` / `defaultOptions` zoo.
- `<EdAutocomplete>` is for free text. If you used react-select with `creatable`, that's also `<EdAutocomplete>` with `allowCreate` — keep the create handler.

## Running

```bash
yarn storybook       # See every component state under EditorialUI/Selection/*
yarn test            # Run unit tests
yarn build           # Verify no token regressions
```

## What's next

- **Bundle 4** — Display: EdTag, EdStatusBadge, EdChip, EdDivider, EdProgressMeter, EdCircularProgress
- **Bundle 5** — Feedback: EdNotification, EdDialog, EdEmptyState, EdTooltip
- **Bundle 6** — Containers: EdCard, EdModal, EdSidePanel, EdDisclosure, EdAccordion
- **Bundle 7** — Navigation: EdTabs, EdBreadcrumb, EdMenu, EdContextMenu
- **Bundle 8** — Data: EdDataTable, EdNativeTable, EdList
- **Bundle 9** — Late composites: EdDateRangePicker, EdFilterChipRow, EdTagContainer, EdTagSelect
