# EditorialUI — single /loop (standalone harness)

One loop for the whole system, driven by the standalone `editorialui_verify/`
package. Build bundle by bundle in dependency order; the gate is the computed-style
Tier-1 check (exact, noise-free), with the pixel diff as advisory.

> One-time setup (see editorialui_verify/README.md):
> `cd editorialui_verify && npm i && npx playwright install chromium`, merge
> `preview.decorators.tsx` into `.storybook/preview.tsx`, then
> `export STORYBOOK_DIR=…/storybook-static` and
> `export SPEC_DIR=…/editorialui_spec/components`.

Build order (dependencies first):
1 Foundations → 2 Forms → 3 Selection → 4 Display → 5 Feedback → 6 Containers →
7 Navigation → 8 Data → 9 Late composites.

---

```
/loop

Goal: make every EditorialUI component match its design spec EXACTLY, verified by
the standalone harness in editorialui_verify/. "Match" = the Tier-1 computed-style
check reports zero differing CSS properties (height, padding, border, radius,
colors, font weight/size, shadow) against the spec cell — NOT pixel-identity.

Oracle (source of truth), priority order:
  1. Spec HTML at $SPEC_DIR (editorialui_spec/components/*.html)
  2. The spec's shared/tokens.css + components.css — exact token values
  3. screenshots/*.png in each bundle — orientation only; never diff against these

Work ONE component at a time, in dependency order (Bundle 1 → 9; within a bundle,
in the order listed in its README). For each component:

  1. Refine the component .tsx + .module.scss. Use ONLY --ed-* tokens — no hex,
     rgb, or oklch literals in the SCSS.
  2. Reconcile the map FIRST (scaffolded components only):
       node editorialui_verify/visual-verify.mjs --list-spec <page>
     In editorialui_verify/component-map.mjs, pin the spec `label`s for this
     component (clear every TODO:pair) and, if the styled element isn't the story
     root, add an `anchor: { story, spec }` selector pair (copy the Bundle-1
     EdButton entries as the pattern). Ensure a story exists for each spec state;
     the harness drives real hover/focus/active itself.
  3. Gate A — behaviour + tokens:
       yarn test --run <Component>
       yarn stylelint "src/components/EditorialUI/<Component>/**/*.scss"
  4. Rebuild Storybook so captures are current:
       yarn build-storybook -o storybook-static
  5. Gate B — visual (Tier 1 hard):
       node editorialui_verify/visual-verify.mjs <Component>
     For each ✗, the report prints the exact CSS props that differ. Fix the token
     or value in the .module.scss and repeat from step 3. Check light AND dark
     (the map includes a dark spot-check per component).
  6. Tier 2 is advisory: if a row shows px ⚠, open
     editorialui_verify/__diff__/<tag>.diff.png and confirm it's text rendering,
     not real shape/composition drift (icon geometry, focus ring). Only act if real.

Exit criteria for a component (ALL true, else do not advance):
  - Vitest green; stylelint shows zero color literals.
  - No remaining TODO:pair / scaffold flags for it in the report.
  - node editorialui_verify/visual-verify.mjs <Component> → 0 Tier-1 failures
    (every row ✓; no differing CSS props listed).
  - Any px ⚠ has been eyeballed and confirmed as anti-aliasing, not drift.

After each bundle, run the whole sweep:
  node editorialui_verify/visual-verify.mjs
At the end, run strict once to surface any real pixel drift the advisory hid:
  node editorialui_verify/visual-verify.mjs --pixel
Then report the pass/fail table, any justified px ⚠ residuals (with reason), and
the Storybook URLs. Do NOT edit tokens-v2.scss to force a match — if a token looks
wrong, the spec's tokens.css wins; correct tokens-v2.scss to agree with it and note it.
```

---

## Why this converges where the old loop stalled

- **Color/weight/geometry now fail exactly, by name.** The previous tail ("0.1
  threshold too strict for text") was a pixel-metric problem. Tier 1 doesn't look
  at text pixels at all — it reads resolved CSS, so a faithful component is green
  even with sub-pixel text shift, and a wrong token fails loudly with the value
  printed. No per-component threshold to calibrate.
- **The pixel diff stopped being the gate.** It's advisory backstop for shape only,
  with ±1px alignment tolerance so it doesn't cry wolf on text.
- **One place to maintain.** The consolidated map + engine live in one folder; no
  drift across nine copies.

The honest caveat: Tier 1 only checks the properties in the contract on the anchor
element. Components whose styling lives on a child, or whose important state is in a
portal, need an explicit `anchor` (and sometimes an inline-open story) — the loop's
step 2 is where you add them. Bundle 1's entries are the worked example.
