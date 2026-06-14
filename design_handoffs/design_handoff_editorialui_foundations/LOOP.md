# Bundle 1 — /loop instruction

Paste the block below into Claude Code's `/loop`. It builds EdIcon → EdButton →
EdIconButton one at a time, gating each on Vitest + stylelint + the visual
harness (`verify/`) before advancing. The harness diffs every story against the
design spec HTML, so "matches the design" is a checked condition, not a judgment call.

> Prereqs the loop assumes are done once up front (see verify/README.md):
> `yarn add -D playwright pixelmatch pngjs && npx playwright install chromium`,
> merge `verify/preview.decorators.tsx` into `.storybook/preview.tsx`, and set
> `SPEC_DIR` to the copied spec HTML.

---

```
/loop

Goal: implement EditorialUI Bundle 1 — EdIcon, EdButton, EdIconButton — so each
component matches its design spec EXACTLY. The shipped .tsx/.module.scss are a
starting point, not the finish line.

Oracle (source of truth), in priority order:
  1. The design spec HTML: design_system_v2/components/{icon,button,icon-button}.html
  2. design_system_v2/shared/tokens.css + components.css — exact token values
  3. ../screenshots/*.png — orientation only; never diff against these
The verify/ harness encodes this: it screenshots each Storybook story and
diffs it against the matching state in the spec HTML.

Work ONE component at a time, in this order (buttons depend on EdIcon):
EdIcon → EdButton → EdIconButton.

Per component, repeat until the exit criteria pass:
  1. Refine the component + its *.module.scss. Use ONLY --ed-* tokens — no hex,
     rgb, or oklch literals anywhere in the SCSS.
  2. Ensure a Storybook story exists for EVERY state in the spec page: each
     variant, each size, and the interaction states. The harness drives real
     hover/focus/active itself, so you only need the base stories the map in
     verify/story-spec-map.mjs references — but first run
       node verify/visual-verify.mjs --list-spec <page>
     and reconcile that list against the map so no spec state is left unmapped.
  3. Gate A — behaviour + tokens:
       yarn test --run <Component>
       yarn stylelint "src/components/EditorialUI/<Component>/**/*.scss"
  4. Gate B — visual:
       yarn build-storybook -o storybook-static
       node verify/visual-verify.mjs <Component>
  5. If ANYTHING fails: for each ✗, open verify/__diff__/<tag>.{story,spec,diff}.png,
     identify the exact discrepancy (height / padding / border-radius / font
     weight / color token / focus-ring offset / transition), fix the SCSS, and
     repeat from step 3. Diffs appear in light AND dark — fix both.

Exit criteria for a component (ALL true, else do not advance):
  - All Vitest tests green.
  - stylelint: zero color literals in the component SCSS.
  - Every spec state for that page is mapped in story-spec-map.mjs.
  - node verify/visual-verify.mjs <Component> reports 0 failures.
  - For any residual sub-threshold diff, you've eyeballed story vs spec PNG and
    confirmed it's anti-aliasing, NOT a token or geometry difference.

After all three pass, run the full sweep once more:
  node verify/visual-verify.mjs
Then output a report: the pass/fail table, any justified residuals (with the
reason), and the Storybook URLs. Do not edit tokens-v2.scss to force a match —
if a token looks wrong, the spec's tokens.css wins; correct tokens-v2.scss to
agree with it and note it.
```

---

## Why this converges (and where to watch it)

- **Token-only SCSS + a token oracle means most fidelity is free.** The diff is
  really hunting geometry and state drift, which is where hand-written CSS
  actually goes wrong.
- **Real pseudo-states.** The harness drives `hover`/`focus`/`active` with
  Playwright, so the states most likely to be wrong are actually captured — not
  skipped because nobody wrote a `:hover` story.
- **Geometry drift fails loudly.** A 38px vs 36px control trips the dimension
  check rather than being quietly cropped away.
- **Tighten as you go.** Start at the default 0.1 threshold; once a component is
  green, drop `DIFF_THRESHOLD` toward 0.03 in `story-spec-map.mjs` and re-run to
  squeeze out the last real differences.
- **The map is the coverage contract.** An unmapped state is an unverified state.
  The `--list-spec` reconciliation step in the loop is what prevents silent gaps.

One caveat worth repeating to Claude Code: a literal zero-pixel match is
impossible across font anti-aliasing and sub-pixel rounding. "Exactly" here means
**within perceptual tolerance, with tokens and geometry identical** — that's the
honest, reachable bar, and it's the one the harness enforces.
