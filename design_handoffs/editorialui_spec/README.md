# EditorialUI spec HTML — the visual-verification oracle

This is the **"spec-HTML folder" the harness needs.** There is no folder literally
named `spec-HTML`; the spec is these rendered design pages. The `verify/` harness
in each handoff bundle screenshots your Storybook stories and diffs them against
the matching state on these pages.

## Contents

```
editorialui_spec/
├── components/     ← 40 spec pages: button.html, text-field.html, … (one per primitive)
└── shared/         ← tokens.css, components.css, spec.css, fonts.css, spec.js …
```

`components/*.html` reference `../shared/*` — so **these two folders must stay
siblings.** Don't move the HTML out on its own; it won't render without `shared/`.

## Wire it up (once)

Put this folder anywhere the build machine can read it (inside the repo, or beside
it), then point the harness at the **`components/` subfolder**:

```bash
# from the bundle you're verifying (e.g. design_handoff_editorialui_foundations)
export SPEC_DIR=/abs/path/to/editorialui_spec/components

node verify/visual-verify.mjs --list-spec button   # sanity check — prints spec state labels
node verify/visual-verify.mjs EdButton             # run a diff
```

That's the only piece of external state the harness needs. Everything else
(Storybook static build, Playwright, the story↔spec map) lives in the bundle.

## Why a real browser

The pages build their state cells via `shared/spec.js` (deferred). The harness
loads them in Playwright (Chromium) and waits for network-idle, so the JS-rendered
cells are present before capture — this is also why the spec can't be diffed as
flat images and why jsdom isn't enough.

## Note on `SPEC_DIR` defaults

The runner's built-in default resolves a sibling `design_system_v2/components`
relative to the bundle — that only works inside the original design project. In
the apostlerisk repo there is no `design_system_v2/`, so **set `SPEC_DIR`
explicitly** to this folder's `components/`. That's the whole fix for the
"spec-HTML folder isn't in the handoff" message.
```
