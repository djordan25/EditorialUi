# editorialui_verify — standalone visual-verification harness

**One** package for the whole design system. Drop this folder anywhere in the
repo, point it at a static Storybook build and the spec HTML, and run. It does
**not** live inside any handoff bundle, and it **replaces the per-bundle `verify/`
copies** — delete those once you adopt this.

It checks all 38 EditorialUI components from a single consolidated map
(`component-map.mjs`).

## The gate — two tiers

Faithfulness to the design is **not** pixel-identity. The spec HTML and your
React component are two independent renderers; their text will never be
pixel-identical even when correct. So the gate measures the design at the layer
it's authored in — resolved CSS — and uses pixels only as an advisory backstop.

**Tier 1 — computed-style diff (HARD, exact, noise-free).**
Reads `getComputedStyle` on the *anchor element* of both the Storybook story and
the matching spec cell, and compares the resolved CSS contract: height, padding,
border, radius, background/text color, font weight/size, line-height,
letter-spacing, box-shadow, opacity (+ a ±2px geometry check on the bounding
box). A wrong color **token**, a 600-vs-500 weight, a 38-vs-36px control → **fail,
with the exact prop printed** (`background-color: story=rgb(37,99,235) spec=rgb(29,78,216)`).
Text position is irrelevant. **This is what gates the build.**

**Tier 2 — alignment-tolerant pixel diff (ADVISORY).**
Slides one capture across a ±1px 3×3 grid and takes the minimum diff so sub-pixel
text noise cancels, then writes `story/spec/diff` PNGs and a pixel-%. Catches
icon/SVG/composition drift the style probe can't see. **Never fails the build**
unless you opt in with `--pixel`.

## Setup (once)

```bash
cd editorialui_verify
npm i
npx playwright install chromium
```

Merge `preview.decorators.tsx` into the app's `.storybook/preview.tsx` (adds the
`theme` global the runner toggles + a human toolbar switch).

Build a static Storybook in the app, and get the spec HTML (the `editorialui_spec`
folder — `components/` + `shared/` siblings):

```bash
(cd path/to/ClientApp && yarn build-storybook -o storybook-static)

export STORYBOOK_DIR=/abs/path/to/ClientApp/storybook-static
export SPEC_DIR=/abs/path/to/editorialui_spec/components
```

## Run

```bash
# sanity-check a spec page's available state labels
node visual-verify.mjs --list-spec button

# verify everything, or one component
node visual-verify.mjs
node visual-verify.mjs EdButton

# CI strict mode — also fail on the Tier-2 pixel advisory
node visual-verify.mjs --pixel
```

Exit code is non-zero on any Tier-1 failure (or Tier-2 under `--pixel`), so it
drops straight into the `/loop` and CI.

## The map

`component-map.mjs` holds:
- **`CASES`** — Bundle 1 (EdIcon/EdButton/EdIconButton) fully hand-wired as the
  reference: real story ids, spec labels, and `anchor` selectors (the element that
  actually carries the styling, e.g. `.ed-btn`).
- **`SCAFFOLD`** — every other component as `{ group, page }`. At launch the runner
  reads each one's real story exports (from Storybook's `index.json`) and the spec
  page's real labels, pairs them by name, and applies the default anchor (the first
  styled child). Auto-pairs that don't resolve are flagged `TODO:pair` /
  `scaffold` in the report — reconcile them with `--list-spec` and, where the
  styled element isn't the root, add an explicit `anchor`.

To promote a scaffolded component, copy its pattern from the Bundle-1 `CASES`
entries: pin the spec `label`s and the `anchor` selectors.

## Reading the report

```
✓  EdButton__primary-light        px 0.4%   
✗  EdButton__danger-light         px 1.1%   
     · background-color: story=rgb(220,38,38)  spec=rgb(225,29,72)
✓  EdButton__primary-dark         px 0.6%   
✗  EdSelect__default-light        px 3.2%⚠  scaffold TODO:pair Default
```

- A ✗ lists the **exact CSS props** that differ — fix that token/value in the
  component's `.module.scss`, rebuild Storybook, re-run.
- `px N%` is the advisory pixel diff; `⚠` means it's over the advisory threshold —
  open `__diff__/<tag>.diff.png` and eyeball whether it's real shape drift or just
  text rendering.
- `scaffold` / `TODO:pair` mean the map entry is auto-derived — reconcile it before
  trusting that row.

## Honest limits

- Tier 1 only sees properties in the contract on the **anchor** element. If a
  component's styling lives on a child (e.g. a track inside a switch), point the
  `anchor` at it. The default (first styled child) covers most single-element
  controls.
- Portal components (popovers, dialogs, menus, drawers) render their open state
  outside `#storybook-root`. Add an inline-open story, or map the panel with a
  spec `selector` + matching `anchor`; otherwise only the closed trigger is checked.
- Tier 2 is advisory by design — raw pixel-% over two independent text renderers is
  noisy. Trust Tier 1 for tokens/geometry; use Tier 2's PNGs for human shape review.
