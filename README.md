# editorial-ui

A React 19 component library — the **EditorialUI** design system as a reusable npm
package. Ships ~38 `Ed*` components (buttons, inputs, selection, display, feedback,
containers, navigation, data, and composites) plus the `--ed-*` design tokens, all
built on Radix primitives and `lucide-react`.

> Status: local-only (`private: true`). Consume via `npm link` / `file:` / git URL.
> Built from the Claude Design handoffs in `design_handoffs/`.

## Install (local)

```bash
# in a consuming app
npm install /path/to/editorial-ui      # or: npm link editorial-ui
```

Peer deps: `react@^19`, `react-dom@^19`.

## Usage

Import the global tokens **once** at your app root, then use components:

```tsx
import 'editorial-ui/tokens.css';
import { EdButton, EdIcon } from 'editorial-ui';

export function Save() {
  return (
    <EdButton variant="primary" leadingIcon={<EdIcon name="Check" />}>
      Save changes
    </EdButton>
  );
}
```

Component styles are injected automatically (no extra CSS import needed). Dark mode
activates when any ancestor has `data-theme="dark"`; light is the default.

The token CSS is also available as Sass: `@use 'editorial-ui/tokens.scss';`.
Typed token helpers (`cssVar`, `token`, `getEditorialThemeMode`) are exported from
the package root.

## Develop

```bash
npm install
npm run storybook       # browse every component state
npm test                # Vitest behavior + a11y suites
npm run typecheck
npm run lint            # no react-icons under EditorialUI
npm run lint:css        # token purity — no hex literals in component SCSS
npm run build           # dist/ : ESM + .d.ts + tokens.css
```

## Visual verification

Stories are pixel-diffed against the design spec HTML (the oracle in
`design_handoffs/editorialui_spec/`). See `verify/README.md`.

```bash
npm run build-storybook
SPEC_DIR="$PWD/design_handoffs/editorialui_spec/components" node verify/visual-verify.mjs
```
