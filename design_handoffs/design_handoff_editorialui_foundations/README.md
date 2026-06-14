# EditorialUI · Foundation bundle

First implementation bundle for the EditorialUI design system. Includes the design tokens plus three primitives that everything else depends on: `EdIcon`, `EdButton`, `EdIconButton`.

## What's in this bundle

```
src/
├── theme/
│   ├── tokens-v2.scss          ← CSS custom properties (light + dark)
│   └── tokens-v2.ts            ← typed token helpers (cssVar, token)
└── components/
    └── EditorialUI/
        ├── index.ts            ← barrel
        ├── EdIcon/
        ├── EdButton/
        └── EdIconButton/
```

Each component folder ships:
- `*.tsx` — React 19 component
- `*.module.scss` — styles (token-only; stylelint rejects hex literals)
- `*.stories.tsx` — Storybook stories covering every state in the spec
- `*.test.tsx` — Vitest + Testing Library, focused on behavior + a11y
- `index.ts` — named export

## Drop locations

Files copy into `Prodicus.Api/ClientApp/src/...` at the same path.

- `src/theme/tokens-v2.scss` — NEW file. Do NOT overwrite `tokens.scss` — both coexist during the parallel rollout.
- `src/theme/tokens-v2.ts` — NEW file alongside `tokens.ts`.
- `src/components/EditorialUI/` — NEW folder. Mirrors `ProdicusUI/`.

## Wire-up

### 1. Load tokens-v2.scss globally

Append to `src/index.scss`:

```scss
@use './theme/tokens-v2';
```

This adds all `--ed-*` custom properties to `:root` (light theme) and `[data-theme="dark"]` (dark theme). Lives alongside the existing `--color-*` tokens; no collision.

### 2. Install lucide-react

```bash
yarn add lucide-react
```

EditorialUI uses `lucide-react` as its single icon family. Picked for line-weight consistency, completeness, and MIT licence. The existing `react-icons` dep can stay — the codebase migrates icon-by-icon during consumer migration.

### 3. Storybook category

Stories register under the `EditorialUI/<Group>` category — `EditorialUI/Inputs/EdButton`, etc. Storybook's existing config picks them up automatically.

### 4. Theme toggle

Tokens use `[data-theme="dark"]` (NOT `[data-theme="light"]`) because light is the default — matches the spec.

The existing `useThemeMode` hook in TopBar already sets `data-theme` on the root, so EditorialUI is theme-aware on day one. The light-locked auth subtree (`data-theme="light"`) also works.

## Running

```bash
yarn storybook       # See every component state
yarn test            # Run unit tests
yarn build           # Verify no token regressions
```

## Migration posture

EditorialUI coexists with ProdicusUI. Both libraries are in Storybook simultaneously. Consumers migrate one screen at a time, replacing `<ProdicusButton>` → `<EdButton>` etc.

A codemod for trivial swaps will ship in a later bundle. For now, manual replacement is the rule — each consumer site needs visual + interaction verification anyway.

## Linting

Add to `.stylelintrc`:

```json
{
  "rules": {
    "color-no-hex": [
      true,
      {
        "ignoreFiles": ["**/tokens-v2.scss"]
      }
    ]
  }
}
```

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

## A11y baseline

All three components have keyboard tests using `@testing-library/user-event` and pass `axe-core` checks (run via `@axe-core/react` in dev). Components avoid `outline: none` without a visible replacement.

## What's next

Once this bundle is in and reviewed:
- **Bundle 2** — EdTextField + EdPasswordInput + EdCheckbox + EdRadioGroup + EdSwitch + EdFormControlLabel
- **Bundle 3** — EdSelect + EdComboBox + EdAutocomplete
- ...continuing in the spec doc's order

Each bundle = one folder, one README, all files ready to drop. No dependency cycles between bundles.
