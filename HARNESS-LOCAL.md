# Harness-local adaptations

`design_handoffs/editorialui_verify/` is the canonical visual-verification harness.
Six small adaptations are required for it to run against **this** package and must be
re-applied whenever the canonical `visual-verify.mjs` / `component-map.mjs` is pasted
over (they keep getting reverted). Most are pure infrastructure; a few (#3's
height-only/`checkWidth` rule, #5's geometry source, #6's colour normalisation) are
deliberate measurement/normalisation choices — each is called out where it applies.

1. **Serve Storybook over HTTP, not `file://`.**
   The Storybook 10 static build loads its stories as ES modules and `fetch()`es
   `index.json`. Both are flaky or blocked over `file://` (stories hang →
   `#storybook-root` empty → 30 s timeouts; the index fetch is cross-origin-blocked).
   The harness starts a tiny static server and points `storyUrl()` / the `index.json`
   fetch at `http://127.0.0.1:<port>`.

2. **Send `Access-Control-Allow-Origin: *` from that server.**
   `storyExports()` runs its `index.json` `fetch()` from an `about:blank` page
   (null origin). Without the CORS header the fetch fails and every scaffolded
   component reports "no stories found".

3. **Gate Tier-1 geometry on HEIGHT only — never WIDTH.**
   Width is content/layout-driven almost everywhere (a button sized by its label, a
   field by its container), so a faithful component false-fails when its story renders
   different example text than the spec cell. Horizontal padding is compared directly,
   and height still carries the control-height contract. (Drop the `width` push in
   `diffStyles`; `CONTENT_DRIVEN` containers already skip height too.)

   Height-only is the default because width is content-driven almost everywhere. The
   one exception is fixed-width controls (the switch track), which opt back in via
   checkWidth:true on their map case. This deliberately narrows what the gate checks —
   it is not pure infra.

4. **Derive story ids the way Storybook does — Start-Case the export first.**
   Storybook turns export `WithDot` into id `…--with-dot`; the stock
   `sanitize(export)` yields `…--withdot`, which 404s every multi-word story. Ids are
   produced as `sanitize(title) + '--' + kebab(StartCase(export))`. (Baked into the
   generated `component-map.mjs` ids; the harness's `storyId()` needs the same kebab
   step if `SCAFFOLD` auto-expansion is ever used.)

5. **Measure geometry with `offsetWidth`/`offsetHeight`, not `getBoundingClientRect`.**
   `getBoundingClientRect` reports the CSS-*transformed* box, so an element mid-animation
   inflates to its transformed bounds — the indeterminate spinner (a 14 px square under
   `animation: rotate`) measures up to its ~19 px diagonal, and the measured value swings
   with capture timing. `offsetWidth`/`offsetHeight` report the untransformed layout box
   (and are already integers). The harness falls back to `getBoundingClientRect` for SVG
   anchors, which have no `offset*` properties. This makes deterministic sizes compare
   deterministically; it does not relax any tolerance.

6. **Canonicalise `color(srgb r g b / a)` → `rgb()`/`rgba()` in `normalize()`.**
   `color-mix()` / relative-colour results serialise as `color(srgb …)` (0–1 channels) in
   Chromium, while the spec writes the same colours as `rgb()/rgba()`. Without this, an
   identical colour false-fails on string form alone. Scoped to the srgb `color()` form,
   which nothing else in the suite emits, so it only ever reconciles equal colours — it
   never makes two different colours compare equal. (Used by EdCircularProgress's inverse
   spinner tone: a translucent `currentColor` track via `color-mix`.)

Everything else — the reconciled `CASES` anchors/labels, the `CONTENT_DRIVEN` set,
the portal `VerifyOpen` stories — lives in `component-map.mjs` and the component
`*.stories.tsx`, not in these infra tweaks.

## Known exemptions (Tier-1)

Four cases stay `✗` on a Tier-1 CSS property. They split into two honest groups: **spec-cell
artifacts** (no fix exists without editing the spec) and **tracked component gaps** (a real
divergence that has a fix, deliberately *not* applied here, recorded so it is not mistaken for
"already correct"). None is fixed by distorting a passing component or loosening the gate. The
other 165/169 are real, passing design contracts. An adversarial review (5 reviewers + verify)
re-classified these from earlier, too-generous "pattern divergence / sub-threshold" wording, and
flagged a fifth — the EdBreadcrumb back-link — as a genuine a11y defect rather than a pattern
divergence; that one was **fixed upstream** (a lone crumb with an `href` now renders a real `<a>`
link), so it passes and is no longer exempt.

**Spec-cell artifacts — no clean fix:**

| Case | Residual prop(s) | Why |
|---|---|---|
| `EdFormControlLabel — with-select` (light + dark) | `line-height: normal` vs `21px` | The story wraps the **real** EdSelect; its trigger is a `<button>` (UA `line-height: normal`). The spec's "EdSelect (placeholder)" cell is a generic `.ed-field__control` **div** that inherits the body's `line-height: 1.5` (= 21px). Non-visual on a fixed-height, flex-centred control. EdSelect's own cases pass against `.ed-select__trigger`; the same `<button>` cannot also match the div, and the spec cell has no button to anchor. |

**Tracked component gaps — a fix exists; recorded, not chased here:**

| Case | Residual prop(s) | Real cause + the available fix |
|---|---|---|
| `EdDivider — vertical` | `height 14` vs `20`; `color`/`border-color 0.34` vs `0.2` | The `color`/`border-color` half **is** non-visual: inherited `currentColor` on a 1px element with no border/text; the painted hairline (`background`) matches exactly. The `height` half is a **component height-model divergence**: `.vertical` hard-codes `height: 1em`, which defeats `align-self: stretch`; the spec's `.ed-divider--v` uses `height: auto; min-height: 1em` and stretches to the row (~20px). The story's inline `height: 14` papers over it. **Fix:** `.vertical { height: auto; min-height: 1em }` + drop the story's inline height; the color half stays a genuine non-visual exemption. |
| `EdDivider — labeled` | `height 11` vs `15` | **Not** sub-threshold — the 4px delta exceeds `DIM_TOLERANCE_PX` (2), so it is a real Tier-1 height fail (the 5.2% figure is the non-gating Tier-2 advisory). Cause: the eyebrow `.labelText { line-height: 1 }` (→11px box) vs the spec label leaving `line-height` to inherit `1.5` (→15px box); the label is also 11px (the `--ed-font-size-2xs` eyebrow token) vs the spec cell's 10px. Visually faithful (uppercase-mono rule); the `line-height: 1` eyebrow is an intentional component choice, so it is documented rather than changed. |
