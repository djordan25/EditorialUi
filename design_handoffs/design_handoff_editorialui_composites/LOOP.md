# Bundle 9 — Late composites · /loop instruction

Paste the block below into Claude Code's `/loop`. It builds this bundle's
components one at a time, gating each on Vitest + stylelint + the visual harness
(`verify/`) before advancing. The harness diffs every story against the design
spec HTML, so "matches the design" is a checked condition, not a judgment call.

> One-time prereqs (see verify/README.md):
> `yarn add -D playwright pixelmatch pngjs && npx playwright install chromium`,
> merge `verify/preview.decorators.tsx` into `.storybook/preview.tsx`, set
> `SPEC_DIR` to the copied spec HTML, and `yarn build-storybook -o storybook-static`.

Component → spec page:
  EdTagContainer → tag-container.html
  EdTagSelect → tag-select.html
  EdFilterChipRow → filter-chip-row.html
  EdDateRangePicker → date-range-picker.html

---

```
/loop

Goal: implement EditorialUI Bundle 9 (Late composites) so each component matches its
design spec EXACTLY. The shipped .tsx/.module.scss are a starting point, not the
finish line.

Oracle (source of truth), in priority order:
  1. The design spec HTML: design_system_v2/components/{tag-container,tag-select,filter-chip-row,date-range-picker}.html
  2. design_system_v2/shared/tokens.css + components.css — exact token values
  3. ../screenshots/*.png — orientation only; never diff against these
The verify/ harness encodes this: it screenshots each Storybook story and diffs
it against the matching state in the spec HTML.

Work ONE component at a time, in this order:
EdTagContainer → EdTagSelect → EdFilterChipRow → EdDateRangePicker

Per component, repeat until the exit criteria pass:
  1. Refine the component + its *.module.scss. Use ONLY --ed-* tokens — no hex,
     rgb, or oklch literals anywhere in the SCSS.
  2. Reconcile coverage FIRST:
       node verify/visual-verify.mjs --list-spec <page>
     Compare against verify/story-spec-map.mjs: fix every /* TODO:pair */ label,
     and ensure a Storybook story exists for each spec state (variant, size,
     interaction). The harness drives real hover/focus/active itself.
  3. Gate A — behaviour + tokens:
       yarn test --run <Component>
       yarn stylelint "src/components/EditorialUI/<Component>/**/*.scss"
  4. Gate B — visual:
       yarn build-storybook -o storybook-static
       node verify/visual-verify.mjs <Component>
  5. If ANYTHING fails: for each ✗, open verify/__diff__/<tag>.{story,spec,diff}.png,
     identify the exact discrepancy (height / padding / border-radius / font
     weight / color token / focus-ring offset / transition), fix the SCSS, repeat
     from step 3. Diffs appear in light AND dark — fix both.

Exit criteria for a component (ALL true, else do not advance):
  - All Vitest tests green.
  - stylelint: zero color literals in the component SCSS.
  - Every spec state for that page is mapped (no remaining /* TODO:pair */).
  - node verify/visual-verify.mjs <Component> reports 0 failures.
  - Any residual sub-threshold diff is confirmed anti-aliasing, not a token or
    geometry difference (eyeball story vs spec PNG).

After all components pass, run the full sweep once more:
  node verify/visual-verify.mjs
Then output the pass/fail table, any justified residuals (with reason), and the
Storybook URLs. Do not edit tokens-v2.scss to force a match — if a token looks
wrong, the spec's tokens.css wins; correct tokens-v2.scss to agree with it and note it.
```

---

## Notes specific to this bundle

- EdTagSelect and EdDateRangePicker render Radix Popovers into portals — map the
  open calendar/menu via selector or an inline-open story.
- EdFilterChipRow / EdTagContainer diff inline normally. Selected chips must
  differ by bg+border+text (never color alone) — watch that in the diff.

A literal zero-pixel match is impossible across font anti-aliasing and sub-pixel
rounding. "Exactly" here means **within perceptual tolerance, with tokens and
geometry identical** — the bar the harness actually enforces.
