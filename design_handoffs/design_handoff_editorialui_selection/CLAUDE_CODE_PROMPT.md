# Claude Code — EditorialUI Selection Bundle (Bundle 3)

You are integrating the **third bundle** of the EditorialUI design system into the
`prodicusgroup/apostlerisk` repo. Bundles 1 (Foundations) and 2 (Forms) are already
merged.

This bundle adds the three selection components: a compact dropdown, a searchable
combobox (single + multi + async), and a free-text autocomplete with suggestions.
Plus a private `_internal/` module the two combobox-shaped components share.

---

## 1. What's in this drop

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← UPDATED barrel (Bundles 1 + 2 + 3 — already in this drop)
        ├── _internal/
        │   ├── listbox.ts          ← shared keyboard-nav hook (useListboxNav), filter, highlight, debounce
        │   └── menu.module.scss    ← shared :global() menu chrome + combobox-trigger styles
        ├── EdSelect/
        ├── EdComboBox/
        └── EdAutocomplete/
```

`_internal/` is **private**. Nothing inside it is re-exported from the public barrel.
Consumer code must never import from `EditorialUI/_internal/*` — stylelint / eslint
should enforce this.

Visual reference per component (in `screenshots/`):
- `01-EdSelect.png` / `02-EdSelect.png` — anatomy + state matrix (default / filled / focus / open / error / disabled), menu variants (simple, grouped, with metadata), sizes.
- `01-EdComboBox.png` / `02-EdComboBox.png` — anatomy + state matrix (empty / selected / filtering / empty-results / loading / error), multi-select mode with tag chips, async loading patterns.
- `01-EdAutocomplete.png` / `02-EdAutocomplete.png` — anatomy + use cases (find-or-create, command-style, cell edit, tags input).

Full spec HTML for any detail the code doesn't make obvious:
`design_system_v2/components/{select,combobox,autocomplete}.html`.

---

## 2. Hard conventions (still in force)

All Bundle-1 + Bundle-2 conventions hold: `Ed*` prefix, folder structure, Storybook
category, token-only SCSS, light default + `[data-theme="dark"]`, sentence case,
Radix-where-possible, `lucide-react` only, `error` replaces `hint`.

New conventions introduced this bundle:

- **Options are plain objects, not React elements.** Pass `{ value, label, meta?, group?, disabled? }`. No `<Option>` children. No more `Object.values(enumMap).map(...)` boilerplate in callers — the shape is the contract.
- **Async loading uses `onSearch(query) => Promise<options>`.** No `loadOptions` / `cacheOptions` / `defaultOptions` zoo from `react-select`. Debouncing (`debounceMs`, default 200ms) and in-flight cancellation are built in.
- **Free text is a different component.** `EdComboBox` constrains the value to its list. `EdAutocomplete` doesn't — its suggestions are hints, not constraints. The "creatable" case from `react-select` is `EdAutocomplete` with `allowCreate`.
- **`useListboxNav` is the single source of truth for combobox keyboard nav.** Future combobox-shaped components (date pickers, mention menus) must reuse it; do not re-implement Arrow / Home / End / Enter / Escape logic.

---

## 3. Implementation tasks

### 3.1 — Install Radix deps

```bash
yarn add @radix-ui/react-select @radix-ui/react-popover
```

| Package | Used by |
|---|---|
| `@radix-ui/react-select` | `EdSelect` (full Radix Select primitive — type-ahead, arrow nav, item indicators) |
| `@radix-ui/react-popover` | `EdComboBox`, `EdAutocomplete` (positioning + portal only — listbox + ARIA hand-rolled) |

Radix has no combobox primitive, which is why Bundles 1–2 didn't anticipate `@radix-ui/react-popover`. The hand-rolled listbox is what justifies the `_internal/` module — without it we'd duplicate keyboard logic between `EdComboBox` and `EdAutocomplete`.

### 3.2 — Copy the bundle into the repo

```bash
cp -R src/components/EditorialUI/_internal       <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdSelect        <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdComboBox      <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdAutocomplete  <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/

# Barrel overwrite — additive, includes all Bundles 1+2+3:
cp src/components/EditorialUI/index.ts           <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/index.ts
```

### 3.3 — ESLint: forbid public imports from `_internal/`

Add to the `EditorialUI/**/*` block of `eslint.config.js`:

```js
'no-restricted-imports': ['error', {
  patterns: [
    {
      group: ['@/components/EditorialUI/_internal/*'],
      message: 'EditorialUI/_internal is private. Use the public barrel or rebuild from EdComboBox/EdAutocomplete.',
    },
    // ...existing patterns (react-icons block from Bundle 1)
  ],
}]
```

### 3.4 — Run tests

```bash
yarn test --run src/components/EditorialUI
yarn build
yarn storybook         # verify every story under EditorialUI/Selection/* renders
```

The new test files cover:
- Combobox role wiring, `aria-expanded`, `aria-controls`, `aria-activedescendant`.
- Filter behaviour (substring match) + empty-state messaging with the live query.
- Keyboard nav: Arrow / Home / End / Enter / Escape — including disabled-item skipping and wrap.
- Multi-mode: `aria-multiselectable`, tag-chip rendering, focusable tag-remove buttons.
- Autocomplete `allowCreate`: row is exposed as `role="option"`, hides when an exact label match exists.
- Disabled state blocks open.
- `error` flips `aria-invalid` and replaces hint.

---

## 4. Component behavior summary

### `EdSelect`
Radix Select under the hood. Compact dropdown for **≤7 fixed, known options** where a
search bar adds friction. Sizes `sm` / `md` / `lg`. Supports flat lists, grouped
sections (`{ kind: 'group', label, items }`), separators (`{ kind: 'separator' }`),
item metadata (mono right-aligned), and disabled items.

ARIA is Radix's job — type-ahead matching, `aria-selected`, `aria-controls`, group
`<Label>` headings all come for free.

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

1. **Sync** — pass `options` array; substring-filter happens client-side via `_internal/listbox.ts#filterByLabel`.
2. **Async** — pass `onSearch(query) => Promise<options>`. Debounced (`debounceMs`, default 200ms). In-flight requests are cancelled when the query changes (per-effect sequence number). Optional `recents` array shown when query is empty.
3. **Multi-select** — set `multiple` to `true`. Values are emitted as `string[]` via `onValuesChange`. The trigger renders selected values as removable tag chips with focusable per-tag remove buttons. Optional "Clear all" action row.

Built on Radix Popover for positioning + a hand-rolled listbox. ARIA: `role="combobox"`
on both the trigger (`aria-expanded` / `aria-haspopup="listbox"` / `aria-controls`) and
the search input (`aria-autocomplete="list"` / `aria-activedescendant`). Live region
announces result counts.

### `EdAutocomplete`
Free-text input + suggestion menu. **Free text is always valid** — Enter without a
highlighted option commits the typed string. Optional "Create new…" action row
appears when no exact label match exists; exposed as a regular `role="option"` so
it's arrow-reachable.

Matched substring is highlighted with `<span class="edmenu__hi">` (brand bg, not
yellow). Suggestions open after `minQueryLength` characters (default 2). Async +
debouncing supported the same as `EdComboBox`.

ARIA: `role="combobox"` with `aria-autocomplete="both"` on the input; live region
announces "N suggestions, use arrows to browse" on first qualifying keystroke.

---

## 5. Decision matrix — which component to use

When migrating a consumer or writing new code, pick by the column on the right:

| Situation | Use |
|---|---|
| 2 known options | `EdRadioGroup` or `EdSwitch` (Bundle 2) |
| ≤7 fixed options, no need to type | `EdSelect` |
| Larger known list — value MUST be from the list | `EdComboBox` |
| Tag-style multi-select from a known list | `EdComboBox multiple` |
| Free text with hints (value can be anything) | `EdAutocomplete` |
| Find existing OR create new | `EdAutocomplete` with `allowCreate` |

---

## 6. Migration table

| ProdicusUI / old library | EditorialUI | Notable diffs |
|---|---|---|
| `<Select>` (Material-style) | `<EdSelect>` | Options are objects, not `<Option>` children. |
| `<AsyncSelect>` (react-select) | `<EdComboBox>` (async mode) | `loadOptions` → `onSearch`. No `cacheOptions` — caller caches if needed. |
| `<MultiSelect>` (react-select) | `<EdComboBox multiple>` | Emits `string[]`. Tag chips are part of the trigger; don't render them separately. |
| `<TagInput>` (custom) | `<EdComboBox multiple>` for known lists, `<EdAutocomplete>` for free | Pick by whether the value is constrained. |
| `<TypeaheadInput>` / `<Autosuggest>` | `<EdAutocomplete>` | `creatable` → `allowCreate` + `onCreate`. |

Per-screen migration:
1. Translate the options array shape (`{ value, label, meta? }`).
2. Translate `value` semantics — `EdComboBox` emits the option's `value` string, not the option object.
3. Drop manual ARIA wiring — these components do it.
4. Confirm dark theme spot-checks.
5. Run keyboard pass: Tab to trigger → Enter → Arrows / typing → Enter to select → Escape to dismiss.

---

## 7. Success criteria

- [ ] `yarn test` passes — three new suites + everything from Bundles 1+2.
- [ ] `yarn build` produces zero new warnings.
- [ ] `yarn storybook` shows three new entries under `EditorialUI/Selection/*`, including the async and multi-select stories.
- [ ] Radix peer deps clean.
- [ ] ESLint blocks imports from `_internal/`.
- [ ] Stylelint passes (no hex in EditorialUI component SCSS — the shared `_internal/menu.module.scss` is allowed; its values still reference `--ed-*` tokens).
- [ ] Dark-theme spot check — every state still meets WCAG AA contrast.
- [ ] Manual a11y per component:
  - `EdSelect` — type-ahead works, Arrow nav, Enter selects, Esc closes, `aria-selected` reflects current.
  - `EdComboBox` — open trigger, type to filter, Arrow + Enter selects, result count is announced; multi mode: each tag is focusable, its remove button activates with Space/Enter.
  - `EdAutocomplete` — typing past `minQueryLength` opens menu; live region announces "N suggestions"; Enter without selection commits the free-text value; "Create" row is reachable by arrow.

---

## 8. What's NOT in this bundle

- **No EdTag** — that's Bundle 4 (Display). The multi-mode trigger chips in `EdComboBox` are currently inline-rendered; once Bundle 4 lands, this is the natural follow-up: replace those inline tags with `<EdTag>` calls. Leave a `// TODO(bundle-4): replace with EdTag` comment when migrating.
- **No virtual scrolling** — option lists are assumed to be ≤500 visible. If a screen needs more, paginate the async loader. Virtualisation lands in Bundle 8 (Data) for `EdDataTable`; the combobox pattern doesn't justify it.
- **No "command palette" component** — `EdAutocomplete` is the closest neighbour but a command palette has its own composition pattern (groups, sections, keybinds in the row). That lands as a separate primitive later, likely in Bundle 7 (Navigation).
- **No app-level migration** — same rule. Land the library, migrate screens separately.

Lead the PR with the `screenshots/` grid so reviewers can match each component to its
spec at a glance.
