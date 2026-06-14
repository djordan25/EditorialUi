# Claude Code — EditorialUI Forms Bundle (Bundle 2)

You are integrating the **second bundle** of the EditorialUI design system into the
`prodicusgroup/apostlerisk` repo. Bundle 1 (Foundations — tokens, EdIcon, EdButton,
EdIconButton) is already merged.

This bundle adds the form primitives: text input, password input, checkbox, radio
group, switch, and a composition primitive for wrapping arbitrary controls with the
label / hint / error shell.

---

## 1. What's in this drop

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                       ← UPDATED barrel (foundations + forms — already in this drop)
        ├── EdTextField/
        ├── EdPasswordInput/
        ├── EdCheckbox/
        ├── EdRadioGroup/
        ├── EdSwitch/
        └── EdFormControlLabel/
```

Each component folder follows the **exact same shape** as the foundation bundle:
`*.tsx` + `*.module.scss` + `*.stories.tsx` + `*.test.tsx` + `index.ts`. Match the
patterns already established in `EdButton/` and `EdIconButton/` — do not invent
new ones.

Visual reference per component (in `screenshots/`):
- `01-EdTextField.png` / `02-EdTextField.png` — anatomy + states (default, filled, hover, focus, error, disabled, readonly, with hint), adornments, sizes, mono variant.
- `01-EdPasswordInput.png` / `02-EdPasswordInput.png` — states + strength meter (weak / fair / good / strong).
- `01-EdCheckbox.png` / `02-EdCheckbox.png` — states (unchecked, hover, focus, checked, indeterminate, error, disabled), description rows, vertical group.
- `01-EdRadioGroup.png` / `02-EdRadioGroup.png` — single radio states, vertical + horizontal layouts, options with descriptions.
- `01-EdSwitch.png` / `02-EdSwitch.png` — off / on / focus / disabled / loading states, settings-list row pattern.
- `01-EdFormControlLabel.png` / `02-EdFormControlLabel.png` — anatomy, wrapping arbitrary controls (select, switch row, custom segmented).

Full spec HTML for any detail the code doesn't make obvious:
`design_system_v2/components/{text-field,password-input,checkbox,radio-group,switch,form-control-label}.html`.

---

## 2. Hard conventions (still in force from Bundle 1)

These don't relax. Re-read Bundle 1's prompt if anything is unclear:

- `Ed*` prefix; folder `src/components/EditorialUI/<Component>/`; Storybook category `EditorialUI/Inputs/<Component>`.
- Token-only SCSS — every color/spacing/type value references a `--ed-*` custom property from `tokens-v2.scss`.
- Light is the default theme; dark activates via `[data-theme="dark"]`.
- Sentence case copy everywhere (labels, hints, button text). The eyebrow visual (mono uppercase) is rendered by the component — callers pass sentence case strings.
- Build on Radix where possible (`@radix-ui/react-checkbox`, `…react-radio-group`, `…react-switch` for this bundle).
- `lucide-react` is the only icon family.

Additional rule introduced this bundle:

- **`error` replaces `hint`.** They are never visible at once. If a component receives both props, render only `error`. Matches the spec's decision rules.

---

## 3. Implementation tasks

### 3.1 — Install Radix deps

```bash
yarn add @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch
```

| Package | Used by |
|---|---|
| `@radix-ui/react-checkbox` | `EdCheckbox` |
| `@radix-ui/react-radio-group` | `EdRadioGroup` + `EdRadio` |
| `@radix-ui/react-switch` | `EdSwitch` |

`EdTextField`, `EdPasswordInput`, and `EdFormControlLabel` have no new dependencies —
they wrap the native input + the existing `EdIconButton` / `EdIcon` from Bundle 1.

### 3.2 — Copy the bundle into the repo

```bash
cp -R src/components/EditorialUI/EdTextField          <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdPasswordInput      <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdCheckbox           <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdRadioGroup         <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdSwitch             <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdFormControlLabel   <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/

# The barrel file overwrites — it's additive, includes all Bundle 1 exports too:
cp src/components/EditorialUI/index.ts                <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/index.ts
```

### 3.3 — Run tests

```bash
yarn test --run src/components/EditorialUI
yarn build
yarn storybook         # verify every story under EditorialUI/Inputs/* renders
```

All test suites must pass without modification. Six new test files; ~50 new test
cases collectively. They cover:

- Accessible name resolution (`getByRole(..., { name })`)
- Correct ARIA wiring (`aria-checked`, `aria-invalid`, `aria-required`, `aria-describedby`, `aria-pressed`, `aria-busy`)
- Keyboard activation (Space, Arrow keys for radio groups)
- Disabled / loading interaction blocks
- Hint replaced by error
- Required marker → `aria-required="true"`
- Indeterminate checkbox → `aria-checked="mixed"`

---

## 4. Component behavior summary

### `EdTextField`
Single-line text input bundled with its label + hint/error slots so layout never
drifts. Three sizes (`sm` 28 / `md` 36 / `lg` 44), `mono` variant for IDs/paths/codes,
`prefix`/`suffix` adornment slots (decorative or a `<button>` for clear), `readOnly` +
`disabled` + `error` states.

**ARIA is the component's job** — it auto-generates `id`, wires `htmlFor` on the
label, builds the `aria-describedby` list for hint+error, and flips `aria-invalid` /
`aria-required` from props. Callers pass `error="…"` — they never wire
`aria-describedby` themselves.

### `EdPasswordInput`
`EdTextField` specialised for password capture. Opt-in `revealable` toggle — **off by
default** because at sign-in the user already knows their password and the toggle is a
shoulder-surf risk; enable for change-password / reset flows. Auto-masks back on blur
and after `revealTimeoutMs` (default 30s).

Optional `strength` prop renders the meter — caller computes the band
(`weak | fair | good | strong`) via zxcvbn or similar, component renders the segments
+ caption with `role="progressbar"` + `aria-live="polite"`. **The meter is
informational only — server-side policy is the source of truth.**

### `EdCheckbox`
Radix Checkbox. Three visual states: `unchecked` / `checked` / `indeterminate`
(`aria-checked="mixed"`). Optional `description` for consent rows. Use indeterminate
for "select all" headers when subset is selected.

**Don't use a checkbox as an on/off switch** — that's `EdSwitch`. The semantic is
"selected for an action" vs. "this is now on".

### `EdRadioGroup` + `EdRadio`
Radix RadioGroup — arrow-key navigation, roving tabindex, fieldset-style group
labelling for free. Vertical (default) or horizontal layout. Optional per-item
descriptions.

**`<EdRadio>` only inside `<EdRadioGroup>`** — single radio buttons never appear
alone. For 6+ options use `EdSelect` (Bundle 3). For binary use `EdCheckbox` or
`EdSwitch`.

### `EdSwitch`
Radix Switch — `role="switch"`, `aria-checked`. Two layouts: `inline` (label trailing
the control — hero forms) and `row` (label + description left, switch flush right —
settings rows). `loading` prop renders an inline "saving…" indicator and disables
interaction during optimistic-update round-trips.

**Use only for settings that take effect immediately.** If the change needs a Save
button, that's a checkbox.

### `EdFormControlLabel`
**Composition primitive — not a control.** Wraps any focusable child with the same
label + hint/error layout as `EdTextField` and auto-wires
`id` / `htmlFor` / `aria-describedby` / `aria-invalid` / `aria-required`.

Two layouts: `stack` (label / control / hint vertically) and `row` (label + hint left,
control flush right — for settings rows).

Accepts either a single React element (cloned with slot props) or a render-prop
function `({ id, 'aria-describedby': db, 'aria-invalid': inv, 'aria-required': req })
=> ReactNode`. The render-prop form is the escape hatch for third-party controls that
don't accept those props directly.

**Prefer `EdTextField` over `EdFormControlLabel + raw input`** — the bundled version
is what most forms want.

---

## 5. Migration table

One-for-one replacements for the ProdicusUI components this bundle obsoletes. Each
swap is **per screen** — don't shotgun the codebase.

| ProdicusUI | EditorialUI | Notable diff |
|---|---|---|
| `<TextField>` | `<EdTextField>` | `helper` → `hint`; `errorText` → `error` (`ReactNode`, not `boolean \| string`). |
| `<PasswordField>` | `<EdPasswordInput>` | Rename was intentional — old name conflicted with `<input type="password">`. Reveal is opt-in via `revealable`. |
| `<Checkbox>` | `<EdCheckbox>` | `indeterminate` is a prop (was a ref-mutation footgun before). |
| `<RadioGroup>` + `<Radio>` | `<EdRadioGroup>` + `<EdRadio>` | `<EdRadio>` MUST be inside an `<EdRadioGroup>`. Bare use is gone. |
| `<Toggle>` / `<Switch>` | `<EdSwitch>` | No `value` prop — switches are stateful, their checkedness IS the value. |
| `<FormField>` | `<EdFormControlLabel>` | New render-prop slot form. `helper` → `hint`. |

Migration checklist per screen:
1. Replace imports.
2. Translate prop names (the diffs above).
3. **Drop the `aria-describedby` / `aria-invalid` manual wiring** — these components do it for you.
4. **Drop the `htmlFor` wiring on hand-rolled labels** — same.
5. Smoke-test keyboard + screen reader on the screen.
6. Confirm dark theme by toggling `[data-theme="dark"]` on `<html>` (Risk Ops uses dark mode).

---

## 6. Success criteria

- [ ] `yarn test` passes — all six new suites + everything from Bundle 1.
- [ ] `yarn build` produces zero new warnings.
- [ ] `yarn storybook` shows six new entries under `EditorialUI/Inputs/*`, each with the states from the screenshots reachable via controls.
- [ ] All Radix peer deps are resolved (`yarn install` clean).
- [ ] Stylelint passes (no hex in EditorialUI component SCSS).
- [ ] Dark-theme spot check: toggle `[data-theme="dark"]` in Storybook; every state still meets WCAG AA contrast.
- [ ] Manual a11y verified for each component: Tab reaches the control, Space/Arrow activates correctly, focus ring uses `--ed-color-focus-ring`, error messages are read by VoiceOver / NVDA when they appear.

---

## 7. What's NOT in this bundle

- **No EdSelect / EdComboBox / EdAutocomplete** — Bundle 3 (Selection).
- **No date picker** — Bundle 9 (Late composites).
- **No form-level orchestration** — react-hook-form / zod wiring is the caller's job. These primitives are uncontrolled-friendly (every component has `defaultChecked` / `defaultValue` / `defaultValues`); controlled is the more common path inside react-hook-form.
- **No app-level migration** — same rule as Bundle 1. Land the library cleanly first, migrate screens in follow-ups.

When the PR description is written, lead with the screenshot grid in `screenshots/` so
reviewers can match code to spec at a glance.
