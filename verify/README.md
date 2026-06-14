# EditorialUI · Visual verification harness

Diffs each Storybook story against the **design spec HTML** — the real source of
truth — so Bundle 1 can be built to match the designs with confidence, not by eye.

Behaviour is gated by Vitest; **looks** are gated here; **token purity** by
stylelint. Together they make "matches the spec exactly" a checkable condition.

## What it does

For every entry in `story-spec-map.mjs`, the runner:
1. Screenshots the Storybook story's root element in isolation (light + dark, and
   driving a real hover/focus/active pseudo-state when the entry asks for one).
2. Screenshots the matching state in the spec HTML (`design_system_v2/components/*.html`).
3. Compares them:
   - dimensions differ by > 2px → **fail** (geometry drift — e.g. a 38px button vs 36px spec),
   - otherwise perceptual-diff the overlap; > 10% differing pixels → **fail**.
4. Writes `verify/__diff__/<tag>.{story,spec,diff}.png` and prints a pass/fail table.

Exit code is non-zero on any failure, so it drops straight into the loop / CI.

## Setup (once)

```bash
# from ClientApp (or wherever package.json lives)
yarn add -D playwright pixelmatch pngjs
npx playwright install chromium

# build a static, deterministic Storybook
yarn build-storybook -o storybook-static
```

Merge `verify/preview.decorators.tsx` into `.storybook/preview.tsx` (gives the
runner the `theme:dark` global it toggles, plus a human toolbar switch).

## Point it at the spec

The oracle is the three spec HTML files. In THIS design project they resolve
automatically (sibling `design_system_v2/`). In the apostlerisk repo, copy them
in and set the path:

```bash
# copy button.html / icon.html / icon-button.html + shared/ into the repo, then:
export SPEC_DIR=/abs/path/to/spec/components
```

(They're self-contained — they only need `shared/tokens.css`, `components.css`,
`fonts.css`, `spec.css` alongside.)

## Run

```bash
# 1. FIRST: confirm the spec state labels the map references actually exist
node verify/visual-verify.mjs --list-spec button
#    → reconcile any mismatches in verify/story-spec-map.mjs

# 2. diff everything, or one component
node verify/visual-verify.mjs
node verify/visual-verify.mjs EdButton
```

Or via the scripts in `verify/package.json` (`yarn verify`, `yarn verify:button`, …).

## Reading a failure

Each ✗ writes three PNGs to `verify/__diff__/`:
- `<tag>.story.png` — what your component renders
- `<tag>.spec.png` — what the design says
- `<tag>.diff.png` — magenta where they disagree

The discrepancy is almost always one of: control **height**, **padding**,
**border-radius**, font **weight/size**, a **color token** (often only visible in
dark), or **focus-ring offset**. Fix the `.module.scss`, `yarn build-storybook`,
re-run. Don't advance to the next component until the table is all ✓.

## Extending to later bundles

Add a `CASES` block per component in `story-spec-map.mjs` and copy this folder
forward. The runner is bundle-agnostic — it only knows story ids and spec states.

## Honest limits

- Perceptual diff has a tolerance (threshold 0.1). A literal 0-pixel match is
  impossible across font anti-aliasing; 0.1 catches token/geometry changes
  without false alarms. Tighten toward 0.03 once a component is green.
- The runner can't invent states it isn't told about — the map must enumerate
  every spec state. Missing entries = unverified states. Cross-check the map
  against `--list-spec` output for each page.
- jsdom can't do any of this; that's why the visual gate is a real browser
  (Playwright) and behaviour stays in Vitest.
