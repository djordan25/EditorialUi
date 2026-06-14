# EditorialUI · Forms bundle (Bundle 2)

Second implementation bundle for the EditorialUI design system. Form primitives — what every screen with input needs.

## What's in this bundle

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← UPDATED barrel (foundations + forms)
        ├── EdTextField/
        ├── EdPasswordInput/
        ├── EdCheckbox/
        ├── EdRadioGroup/
        ├── EdSwitch/
        └── EdFormControlLabel/
```

Each component folder ships the same shape as the foundation bundle:
- `*.tsx` — React 19 component
- `*.module.scss` — styles (token-only)
- `*.stories.tsx` — Storybook stories covering every state in the spec
- `*.test.tsx` — Vitest + Testing Library
- `index.ts` — named export

## Drop locations

Files copy into `Prodicus.Api/ClientApp/src/...` at the same path. Bundle 1's tokens-v2 must already be loaded.

| What | Where |
|---|---|
| `src/components/EditorialUI/EdTextField/` | NEW folder. |
| `src/components/EditorialUI/EdPasswordInput/` | NEW folder. |
| `src/components/EditorialUI/EdCheckbox/` | NEW folder. |
| `src/components/EditorialUI/EdRadioGroup/` | NEW folder. |
| `src/components/EditorialUI/EdSwitch/` | NEW folder. |
| `src/components/EditorialUI/EdFormControlLabel/` | NEW folder. |
| `src/components/EditorialUI/index.ts` | **OVERWRITES** the foundation barrel — additive, includes all foundation exports. |

## Dependencies

Already on the project from Bundle 1: `react@19`, `lucide-react`.

New for this bundle — add to `package.json`:

```bash
yarn add @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch
```

| Package | Used by |
|---|---|
| `@radix-ui/react-checkbox` | `EdCheckbox` |
| `@radix-ui/react-radio-group` | `EdRadioGroup`, `EdRadio` |
| `@radix-ui/react-switch` | `EdSwitch` |

`EdTextField`, `EdPasswordInput`, and `EdFormControlLabel` are unstyled-from-scratch — no Radix dependency (no Radix primitive offers enough value for these, and the layout primitive needs to handle arbitrary children).

## What each component gives you

### `EdTextField`
The workhorse. Bundles label + control + hint/error into one component so layout never drifts. Three sizes (sm 28 / md 36 / lg 44), mono variant for IDs/paths, prefix/suffix adornment slots, readonly + disabled + error states. Auto-generates `id`, links `htmlFor`, wires `aria-describedby` / `aria-invalid` / `aria-required`.

### `EdPasswordInput`
EdTextField specialised for password capture. Opt-in reveal toggle (default off — at sign-in the user already knows their password and the toggle is a shoulder-surf risk; enable for change-password / reset flows). Auto-masks back on blur and after 30s. Optional strength meter — caller computes the band (`weak | fair | good | strong`), the component renders the segments + caption with `role="progressbar"` and `aria-live="polite"`.

### `EdCheckbox`
Radix Checkbox under the hood. Three visual states: unchecked / checked / indeterminate (`aria-checked="mixed"`). Optional description for consent rows. Error state with `role="alert"` hint.

### `EdRadioGroup` + `EdRadio`
Radix RadioGroup — arrow-key navigation, roving tabindex, fieldset-style group labelling for free. Vertical (default) or horizontal layout. Optional per-item descriptions. Item disabled, group disabled, group error all supported.

### `EdSwitch`
Radix Switch — `role="switch"`, `aria-checked`. Two layouts: `inline` (label trailing the control, for hero forms) and `row` (label + description left, switch flush right, for settings rows). `loading` prop renders an inline "saving…" indicator and disables interaction during optimistic-update round-trips.

### `EdFormControlLabel`
Composition primitive — **not** a control. Wraps any focusable child with consistent label + hint/error layout and auto-wires `id` / `htmlFor` / `aria-describedby` / `aria-invalid` / `aria-required`. Two layouts (`stack` / `row`). Accepts either a single React element (cloned with slot props) or a render-prop function (for third-party controls that don't accept these props directly).

Prefer `EdTextField` over `EdFormControlLabel + raw input` — the bundled version is what most forms want. Reach for `EdFormControlLabel` when you have an arbitrary control to wrap (a custom segmented switcher, a third-party date picker, a select stand-in until Bundle 3 lands).

## Patterns this bundle codifies

**ARIA wiring belongs in the component, not the caller.** Every field auto-generates an `id`, wires `htmlFor` on the label, builds the `aria-describedby` list for hint+error, and flips `aria-invalid` / `aria-required` from props. Callers pass `error="…"` — they never wire `aria-describedby` themselves.

**Error replaces hint; both never show at once.** Matches the spec's decision rule. If you really need both, render a custom `hint` node combining them — the slot is `ReactNode`.

**Sentence case labels.** The eyebrow style (mono 11px, uppercase, tracked) is rendered by `EdTextField` / `EdFormControlLabel` automatically — pass the label as plain sentence case ("Model name", not "MODEL NAME").

**Required indicator is decorative.** The `*` is rendered via CSS pseudo-element on the label. The semantic signal is `aria-required="true"` on the control. Never put "(required)" in helper text.

**Switches don't gate forms with a Save button.** Use `EdSwitch` only for settings that flip an actual state-of-the-world. For "include this in submission?" use `EdCheckbox` instead.

## Migration notes

These primitives replace these ProdicusUI components, one-for-one, screen-by-screen:

| ProdicusUI | EditorialUI |
|---|---|
| `<TextField>` | `<EdTextField>` |
| `<PasswordField>` | `<EdPasswordInput>` (rename — old name confuses with `<input type="password">`) |
| `<Checkbox>` | `<EdCheckbox>` |
| `<RadioGroup>` + `<Radio>` | `<EdRadioGroup>` + `<EdRadio>` |
| `<Toggle>` / `<Switch>` | `<EdSwitch>` |
| `<FormField>` | `<EdFormControlLabel>` |

The shapes are intentionally similar. Notable differences:
- `error` is a `ReactNode`, not `boolean | string` — pass the message directly. No separate `errorText`.
- `helper` / `helperText` → `hint`.
- `<EdRadio>` lives inside `<EdRadioGroup>`; you cannot use one alone. The old `<Radio>` permitted bare use — that pattern is gone.
- `EdSwitch` does not support a `value` prop. Switches are stateful — their checkedness is the value.

## A11y baseline

All six components ship with a Vitest test suite that exercises:
- accessible name resolution (`getByRole(..., { name })`)
- correct `aria-checked` / `aria-invalid` / `aria-required` / `aria-describedby` wiring
- keyboard activation (Space, Arrow keys for radio groups)
- disabled / loading interaction blocks

Run `yarn test` to verify after dropping in.

## Running

```bash
yarn storybook       # See every component state under EditorialUI/Inputs/*
yarn test            # Run unit tests
yarn build           # Verify no token regressions
```

## What's next

- **Bundle 3** — Selection: EdSelect + EdComboBox + EdAutocomplete
- **Bundle 4** — Display: EdIcon (already shipped), EdTag, EdStatusBadge, EdChip, EdDivider, EdProgressMeter, EdCircularProgress
- ...continuing in the spec doc's order
