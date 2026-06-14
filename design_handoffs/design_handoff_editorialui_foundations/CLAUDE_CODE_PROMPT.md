# Claude Code — EditorialUI Foundations Bundle (Bundle 1)

You are integrating the **first bundle** of the EditorialUI design system into the
`prodicusgroup/apostlerisk` repo (React 19 + Radix + Storybook 10 + react-hook-form +
zod + TanStack, tag 0.0.51.0).

EditorialUI is the **replacement** for the existing ProdicusUI library. Both libraries
coexist during a parallel rollout; consumers migrate one screen at a time. This bundle
introduces the tokens, icon wrapper, and two button primitives that every later bundle
builds on.

---

## 1. What's in this drop

```
src/
├── theme/
│   ├── tokens-v2.scss          ← all --ed-* CSS custom properties (light + dark)
│   └── tokens-v2.ts            ← typed cssVar/token helpers
└── components/
    └── EditorialUI/
        ├── index.ts            ← public barrel
        ├── EdIcon/             ← lucide-react wrapper, token-driven size + color
        ├── EdButton/           ← 5 variants × 4 sizes
        └── EdIconButton/       ← 3 variants × 3 sizes, toggle (pressed) support
```

Every component folder ships:
- `*.tsx` — React 19 component (already complete in this drop)
- `*.module.scss` — SCSS modules, **token-only** (no hex literals)
- `*.stories.tsx` — Storybook stories under `EditorialUI/<Group>/<Component>`
- `*.test.tsx` — Vitest + Testing Library
- `index.ts` — named export

Visual reference: see `screenshots/01-Ed{Button,IconButton,Icon}.png` (anatomy / variants)
and `screenshots/02-Ed{Button,IconButton,Icon}.png` (states / sizes / twin views).
The full design specs are at `design_system_v2/components/{button,icon-button,icon}.html`
if you need to verify a detail the code doesn't make obvious.

---

## 2. Hard conventions — do not break

| Rule | Why |
|---|---|
| **Prefix everything `Ed*`** | Coexistence with ProdicusUI; the prefix is how each call site signals which library it's on. |
| **Folder: `src/components/EditorialUI/<Component>/`** | Mirror of `ProdicusUI/`. One folder per public component. |
| **Storybook category: `EditorialUI/<Group>/<Component>`** | Matches the spec doc's 7 groups: Inputs, Selection, Display, Feedback, Containers, Navigation, Data. |
| **Tokens only — no hex / rgb / oklch literals in component SCSS** | All color/spacing/type values reference `--ed-*` custom properties from `tokens-v2.scss`. Stylelint must reject hex in `src/components/EditorialUI/**/*.scss`. |
| **Light is the default theme** | Dark activates via `[data-theme="dark"]` on any ancestor. Don't invert. |
| **Build on Radix where possible** | `EdButton.asChild` already uses `@radix-ui/react-slot`. Later bundles use Radix's headless primitives. Never re-implement what Radix already ships. |
| **`lucide-react` is the only sanctioned icon family** | Imported once, behind `EdIcon`. ESLint must reject `react-icons` inside `src/components/EditorialUI/**`. |
| **Sentence case copy everywhere** | Labels, button text, helper text. Never Title Case or ALL CAPS (except the eyebrow style, which is rendered by the component itself). |

---

## 3. Implementation tasks

### 3.1 — Copy the bundle into the repo

```bash
# From the bundle root, into ClientApp:
cp -R src/theme/tokens-v2.scss      <repo>/Prodicus.Api/ClientApp/src/theme/tokens-v2.scss
cp -R src/theme/tokens-v2.ts        <repo>/Prodicus.Api/ClientApp/src/theme/tokens-v2.ts
cp -R src/components/EditorialUI    <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI
```

**Do NOT overwrite** `src/theme/tokens.scss` or `tokens.ts`. Both files coexist.

### 3.2 — Load tokens-v2 globally

Append to `Prodicus.Api/ClientApp/src/index.scss`:

```scss
@use './theme/tokens-v2';
```

This pollutes `:root` with all `--ed-*` properties. There is no namespace collision with
the existing `--color-*` tokens — that's the whole point of the `--ed-*` prefix.

### 3.3 — Install runtime deps

```bash
yarn add lucide-react @radix-ui/react-slot
```

`react-icons` stays — it migrates icon-by-icon during consumer migration.

### 3.4 — Storybook

Storybook 10 already auto-loads `src/**/*.stories.tsx`. The category prefix
`EditorialUI/Inputs/...` puts every story under a single tree node. Run
`yarn storybook` and confirm three new entries: `EdIcon`, `EdButton`, `EdIconButton`.

### 3.5 — Stylelint update

Add to `.stylelintrc`:

```json
{
  "rules": {
    "color-no-hex": [
      true,
      { "ignoreFiles": ["**/tokens-v2.scss"] }
    ]
  }
}
```

### 3.6 — ESLint update

Add to `eslint.config.js`:

```js
{
  files: ['src/components/EditorialUI/**/*'],
  rules: {
    'no-restricted-imports': ['error', {
      paths: [
        { name: 'react-icons', message: 'EditorialUI uses lucide-react. Import EdIcon instead.' },
      ],
      patterns: [
        { group: ['react-icons/*'], message: 'EditorialUI uses lucide-react. Import EdIcon instead.' },
      ],
    }],
  },
}
```

### 3.7 — Run tests

```bash
yarn test --run src/components/EditorialUI
yarn build
```

All Vitest suites must pass without modification. The Storybook bundle must build
without warnings about missing peer deps.

---

## 4. Component behavior summary

Cross-reference against the screenshots when implementing surrounding code.

### `EdButton` ([screenshots](./screenshots/))
- 5 variants: `primary` (one per surface), `secondary` (paired with primary), `ghost` (tertiary/inline), `danger` (destructive only), `link` (inline text actions).
- 4 sizes: `sm` 28px (toolbars), `md` 36px (default), `lg` 44px (prominent CTAs), `xl` 56px (auth / marketing only).
- States: default / hover / active / focus-visible / loading / disabled.
- `loading` keeps the button at its current width, replaces the label with a spinner, sets `aria-busy`, and disables clicks.
- `asChild` forwards styling to the child element via Radix Slot — use it to render an `<a>` as a styled button.
- `leadingIcon` and `trailingIcon` slot icons before/after the label. Icons are decorative (`aria-hidden`).
- **`type` defaults to `"button"`** — never `"submit"` by default; that's a common React footgun.

### `EdIconButton` ([screenshots](./screenshots/))
- 3 variants: `default` (transparent — toolbars), `bordered` (looks like EdButton secondary), `filled` (brand background — emphatic).
- 3 sizes: `sm` 28px, `md` 36px, `lg` 44px.
- **`aria-label` is REQUIRED at the type level** — the TS interface forbids omitting it. Pair with `EdTooltip` (later bundle) when the label isn't otherwise visible.
- `pressed` prop adds toggle behavior — sets `aria-pressed` and a "selected" visual state.

### `EdIcon` ([screenshots](./screenshots/))
- Wraps `lucide-react`. Pass an icon name as the `name` prop: `<EdIcon name="Search" />`.
- 6 sizes: `xs` 12 / `sm` 14 / `md` 16 / `lg` 20 / `xl` 24 / `2xl` 32.
- 9 semantic colors: `inherit` (default), `primary`, `muted`, `faint`, `brand`, `success`, `warning`, `danger`, `inverse`. Always token-driven.
- **Decorative by default** (`aria-hidden`). Pass a `label` prop to make the icon meaningful (sets `role="img"` and `aria-label`). Use this only when the icon stands alone with no other label.

---

## 5. Migration posture

This bundle does NOT delete any ProdicusUI code. Consumers move one screen at a time:

```diff
- import { ProdicusButton } from '@/components/ProdicusUI';
+ import { EdButton } from '@/components/EditorialUI';

- <ProdicusButton variant="primary" loading={saving}>Save</ProdicusButton>
+ <EdButton variant="primary" loading={saving}>Save</EdButton>
```

For each migrated screen:
1. Replace the import.
2. Replace the JSX (the prop shapes are intentionally close — `variant`, `size`, `loading`, `disabled`, `leadingIcon`/`trailingIcon` all carry over).
3. Smoke-test the screen visually + via keyboard. Storybook stories are the reference for the expected look in every state.
4. Run `yarn test` and any e2e suite touching the screen.

A codemod for trivial swaps lands in a later bundle. For now, manual is the rule —
every consumer needs visual + interaction verification anyway.

---

## 6. Success criteria

Before opening a PR:

- [ ] `yarn test` passes (foundation + existing suites)
- [ ] `yarn storybook` renders three new entries with **every** state from the screenshots reachable via controls
- [ ] `yarn build` produces zero new warnings
- [ ] Stylelint passes (no hex literals in EditorialUI component SCSS)
- [ ] ESLint passes (no `react-icons` in EditorialUI source)
- [ ] Toggling `[data-theme="dark"]` on `<html>` does not break any EdButton/EdIconButton state — every token has a dark counterpart in `tokens-v2.scss`
- [ ] Keyboard a11y verified manually: every interactive control is reachable via Tab, fires on Enter/Space, has a visible focus ring (uses `--ed-color-focus-ring`)

When the PR description is written, lead with a screenshot grid using the assets in
`screenshots/` so reviewers can match code to spec.

---

## 7. What's NOT in this bundle

So you don't get scope creep:

- **No EdTextField / EdSelect / EdSwitch** — those land in Bundle 2 (Forms) and Bundle 3 (Selection).
- **No Storybook docs MDX** — stories carry the documentation surface; no separate `.mdx`.
- **No codemod / migration script** — that ships once the API surface is large enough to be worth automating.
- **No app-level integration** — don't replace any ProdicusUI call sites in this PR. The point of this PR is to land the library cleanly. Migration happens separately, screen by screen.

Treat this PR as **infrastructure**. Land it green, then start migration in follow-ups.
