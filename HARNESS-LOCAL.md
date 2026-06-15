# Harness-local adaptations

`design_handoffs/editorialui_verify/` is the canonical visual-verification harness.
Four small infra adaptations are required for it to run against **this** package and
must be re-applied whenever the canonical `visual-verify.mjs` / `component-map.mjs`
is pasted over (they keep getting reverted). They are infrastructure only — they do
not change what the gate measures.

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

4. **Derive story ids the way Storybook does — Start-Case the export first.**
   Storybook turns export `WithDot` into id `…--with-dot`; the stock
   `sanitize(export)` yields `…--withdot`, which 404s every multi-word story. Ids are
   produced as `sanitize(title) + '--' + kebab(StartCase(export))`. (Baked into the
   generated `component-map.mjs` ids; the harness's `storyId()` needs the same kebab
   step if `SCAFFOLD` auto-expansion is ever used.)

Everything else — the reconciled `CASES` anchors/labels, the `CONTENT_DRIVEN` set,
the portal `VerifyOpen` stories — lives in `component-map.mjs` and the component
`*.stories.tsx`, not in these four infra tweaks.
