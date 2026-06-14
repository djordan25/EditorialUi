# EditorialUI · Visual verification harness — Bundle 8 (Data)

Diffs each Storybook story against the **design spec HTML** — the real source of
truth — so this bundle can be built to match the designs by a checked condition,
not by eye. Behaviour is gated by Vitest; **looks** here; **token purity** by
stylelint.

## Components in this bundle
- `EdNativeTable` → `design_system_v2/components/native-table.html`
- `EdDataTable` → `design_system_v2/components/data-table.html`
- `EdList` → `design_system_v2/components/list.html`

## What it does
For every entry in `story-spec-map.mjs`, the runner:
1. Screenshots the Storybook story's root element in isolation (light + dark, and
   driving a real hover/focus/active pseudo-state when the entry asks for one).
2. Screenshots the matching state in the spec HTML.
3. Compares: dimensions differ by > 2px → **fail** (geometry drift); otherwise
   perceptual-diff the overlap, > 10% differing pixels → **fail**.
4. Writes `verify/__diff__/<tag>.{story,spec,diff}.png` and prints a pass/fail table.

Exit code is non-zero on any failure, so it drops straight into the loop / CI.

## Setup (once)
```bash
yarn add -D playwright pixelmatch pngjs
npx playwright install chromium
yarn build-storybook -o storybook-static
```
Merge `verify/preview.decorators.tsx` into `.storybook/preview.tsx`.

## Point it at the spec
The oracle is this bundle's spec HTML (native-table.html / data-table.html / list.html). They resolve automatically in
this design project (sibling `design_system_v2/`). In the apostlerisk repo, copy
them in (with `shared/tokens.css`, `components.css`, `fonts.css`, `spec.css`) and:
```bash
export SPEC_DIR=/abs/path/to/spec/components
```

## Run
```bash
# 1. FIRST confirm the spec state labels referenced in the map exist:
node verify/visual-verify.mjs --list-spec native-table
#    reconcile every /* TODO:pair */ in verify/story-spec-map.mjs

# 2. diff everything, or one component:
node verify/visual-verify.mjs
node verify/visual-verify.mjs EdNativeTable
```

## Reading a failure
Each ✗ writes `<tag>.story.png` (yours), `<tag>.spec.png` (the design), and
`<tag>.diff.png` (magenta where they disagree) to `verify/__diff__/`. The
discrepancy is almost always control **height**, **padding**, **border-radius**,
font **weight/size**, a **color token** (often only visible in dark), or
**focus-ring offset**. Fix the `.module.scss`, rebuild Storybook, re-run.

## Honest limits
- Perceptual diff has a tolerance (0.1). A literal 0-pixel match is impossible
  across font anti-aliasing; tighten toward 0.03 once a component is green.
- The map must enumerate every spec state — a missing entry is an unverified
  state. Cross-check against `--list-spec` for each page.
- Components that render into **portals** (popovers, dialogs, menus, drawers)
  put their open state outside `#storybook-root`; map those via a selector or an
  inline-open story. See LOOP.md "Notes specific to this bundle".
- jsdom can't do any of this; the visual gate is a real browser (Playwright),
  behaviour stays in Vitest.
