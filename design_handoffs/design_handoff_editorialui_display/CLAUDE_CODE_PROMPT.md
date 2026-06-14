# Claude Code — EditorialUI Display Bundle (Bundle 4)

You are integrating the **fourth bundle** of the EditorialUI design system into
the `prodicusgroup/apostlerisk` repo (React 19 + Radix + Storybook 10 +
react-hook-form + zod + TanStack). Bundles 1 (Foundations), 2 (Forms), and
3 (Selection) are already merged.

This bundle adds the small visual building blocks that everything else composes
from: metadata tags, status badges, interactive filter chips, dividers, and
progress feedback (linear + circular).

---

## 1. What's in this drop

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← UPDATED barrel (Bundles 1–4 — additive)
        ├── EdTag/
        ├── EdStatusBadge/
        ├── EdChip/
        ├── EdDivider/
        ├── EdProgressMeter/        ← exports EdProgressMeter + EdProgressSegmented
        └── EdCircularProgress/
```

Same shape as previous bundles: every folder ships
`*.tsx` + `*.module.scss` + `*.stories.tsx` + `*.test.tsx` + `index.ts`.

Visual reference per component (in `screenshots/`):
- `01-EdTag.png` / `02-EdTag.png` — anatomy + tones (neutral / brand / success / warning / danger) + use cases.
- `01-EdStatusBadge.png` / `02-EdStatusBadge.png` — anatomy + style × tone matrix (soft / solid / outline × six tones) + canonical lifecycle and severity maps.
- `01-EdChip.png` / `02-EdChip.png` — variants (unselected / selected / input / with-dot / with-icon / disabled).
- `01-EdDivider.png` / `02-EdDivider.png` — horizontal / strong / dashed / vertical / labeled variants.
- `01-EdProgressMeter.png` / `02-EdProgressMeter.png` — anatomy + states (determinate / indeterminate / complete / thresholds / paused) + segmented + multi-file batch.
- `01-EdCircularProgress.png` / `02-EdCircularProgress.png` — anatomy + sizes + in-context (button / row / page-level) + determinate ring with semantic tones.

Full spec HTML for any detail the code doesn't make obvious:
`design_system_v2/components/{tag,status-badge,chip,divider,progress-meter,circular-progress}.html`.

---

## 2. Hard conventions (still in force)

All Bundle-1/2/3 conventions hold: `Ed*` prefix, folder structure, Storybook
category, token-only SCSS, light default + `[data-theme="dark"]`, sentence case,
Radix where possible, `lucide-react` only, `error` replaces `hint`,
`useListboxNav` is the keyboard-nav primitive.

Additional convention introduced this bundle:

- **`prefers-reduced-motion` is honored explicitly.** Any component with
  perpetual or sweep animation (indeterminate progress, spinner) must fall back
  to a static or pulsed state. The bundle's two motion-using components
  (`EdProgressMeter` indeterminate sweep, `EdCircularProgress` spinner) already
  implement this — keep the pattern when extending.

---

## 3. Implementation tasks

### 3.1 — No new dependencies

`EdTag`, `EdStatusBadge`, `EdChip`, `EdDivider`, `EdProgressMeter`,
`EdCircularProgress` are all plain React + CSS + a couple of lucide-react icons
already on the project from Bundle 1. **Nothing to install.**

### 3.2 — Copy the bundle into the repo

```bash
cp -R src/components/EditorialUI/EdTag                <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdStatusBadge        <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdChip               <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdDivider            <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdProgressMeter      <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdCircularProgress   <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/

# Additive barrel overwrite (includes Bundles 1–4):
cp    src/components/EditorialUI/index.ts             <repo>/Prodicus.Api/ClientApp/src/components/EditorialUI/index.ts
```

### 3.3 — Storybook categories

Stories land under both `EditorialUI/Display/*` and `EditorialUI/Feedback/*` —
the bundle name is about delivery cadence, not the Storybook tree. The split
matches the spec doc's group taxonomy:

| Component | Story path |
|---|---|
| `EdTag` | `EditorialUI/Display/EdTag` |
| `EdChip` | `EditorialUI/Display/EdChip` |
| `EdDivider` | `EditorialUI/Display/EdDivider` |
| `EdStatusBadge` | `EditorialUI/Feedback/EdStatusBadge` |
| `EdProgressMeter` | `EditorialUI/Feedback/EdProgressMeter` |
| `EdCircularProgress` | `EditorialUI/Feedback/EdCircularProgress` |

### 3.4 — Run tests

```bash
yarn test --run src/components/EditorialUI
yarn build
yarn storybook         # verify every story renders
```

The six new test files cover:
- Role wiring (`role="progressbar"` / `role="status"` / `role="checkbox"` / `role="radio"` / `role="separator"`)
- `aria-valuenow / valuemin / valuemax / valuetext / busy` on progress components
- `aria-checked` toggle for `EdChip`
- `aria-orientation` + decorative vs semantic distinction for `EdDivider`
- Disabled state blocks interaction
- Custom `aria-label` overrides where the visible label is mono/uppercase
- Backspace fires `onRemove` for `EdChip kind="input"`

---

## 4. Per-component success checklist

Cross-reference against the screenshots while implementing surrounding code.

### `EdTag`
- [ ] Five tones render with the spec's foreground/background pairings.
- [ ] `onRemove` produces a `<button aria-label="Remove {label}">` — verify the default name in tests.
- [ ] Custom `removeLabel` overrides the default.
- [ ] Component is a `<span>` by default — no button role unless `onRemove` is provided.

### `EdStatusBadge`
- [ ] Style × tone matrix renders without invented hex literals — every color comes from a token.
- [ ] `dot` adds a 6px leading circle that's `aria-hidden` (decorative).
- [ ] Mono uppercase + 0.04em tracking — matches the spec exactly. Don't soften.
- [ ] Reserve `solid` for MRA / MRIA escalations. The default 95% of cells should be `soft`.

### `EdChip`
- [ ] Default kind is `toggle` (`role="checkbox"`).
- [ ] `kind="radio"` only works correctly inside a `<div role="radiogroup">` — the chip itself does not become the group.
- [ ] `kind="input"` has no selection role; supports Backspace / Delete to remove when focused.
- [ ] `count` is included in the accessible name automatically. Confirm via `getByRole('checkbox', { name: 'Open, 87 items' })`.
- [ ] Focus-visible ring uses `--ed-color-focus-ring`.

### `EdDivider`
- [ ] Default horizontal renders a semantic `<hr>` — not a div.
- [ ] Vertical and decorative variants render `<div role="separator">` with the correct `aria-orientation` / `aria-hidden`.
- [ ] Labeled variant is horizontal only (vertical labels make no sense in a hairline).
- [ ] `weight: dashed` uses `border-top` not `background` (CSS pattern preserves on retina).

### `EdProgressMeter`
- [ ] Determinate sets `aria-valuenow` clamped to [0, 100], `aria-valuetext = "{percent}%"` by default; pass `valueText` for richer strings.
- [ ] Indeterminate omits `aria-valuenow`, sets `aria-busy="true"` on the track. The fill is a 40% bar that sweeps.
- [ ] `prefers-reduced-motion` falls back to a static low-opacity bar.
- [ ] `EdProgressSegmented` exposes `valueText` so consumers (like password strength) can announce the band name.

### `EdCircularProgress`
- [ ] Indeterminate: `role="status"`, `aria-live="polite"`, `aria-busy="true"`, visually-hidden label.
- [ ] Determinate: SVG ring with correct `stroke-dasharray` / `stroke-dashoffset` math (`circumference = 2πr`).
- [ ] `tone="inverse"` works for the "in dark button" case — used by `EdButton.loading` once swapped in.
- [ ] Reduced motion falls back to opacity pulse (the rotation is still annoying for some).

---

## 5. Backlinks — two follow-up swaps you should propose (NOT in this PR)

These are **optional polish**. Land the bundle clean first; do the swaps in
follow-up PRs.

### 5a — `EdComboBox` multi-mode tags should use `EdTag`
Search for `// TODO(bundle-4)` in `EdComboBox.tsx`. The inline tag chips in the
multi-mode trigger are hand-rendered. Replace them with
`<EdTag tone="brand" onRemove={...}>` to inherit the cleaner removal affordance
and unified visual.

### 5b — `EdPasswordInput` strength meter should use `EdProgressSegmented`
The hand-rolled segment bars inside `EdPasswordInput.tsx` can delegate to
`<EdProgressSegmented segments={4} filled={...} tone={...} valueText={...}>`.
This inherits the `prefers-reduced-motion` handling and ARIA `valuetext` plumbing
for free.

Both swaps are mechanical — same prop shapes; just less code.

---

## 6. Migration table

These map ProdicusUI / informal patterns to the new primitives. As always,
migration is **per screen**, not codebase-wide.

| Existing usage | EditorialUI |
|---|---|
| `<Tag>` / `<Badge>` (informal mix) | `<EdTag>` for category metadata, `<EdStatusBadge>` for state |
| Material `<Chip>` filter row | `<EdChip kind="toggle">` per chip; group with flex |
| Material `<Chip>` removable token in a form | `<EdChip kind="input" onRemove>` |
| `<hr>` ad-hoc | `<EdDivider>` |
| `<LinearProgress>` (Material) | `<EdProgressMeter>` |
| `<CircularProgress>` (Material) | `<EdCircularProgress>` |
| Hand-rolled spinner divs | `<EdCircularProgress size="sm" label="Loading">` |

Notable diffs:
- `EdTag.tone` is a closed set — no custom CSS color. Pick from `neutral / brand / success / warning / danger`.
- `EdStatusBadge.badgeStyle` is the new prop name (avoid clobbering the React `style` prop).
- `EdChip` emits `aria-checked` and treats clicks as toggles — wire `onSelectedChange` rather than `onClick`.
- `EdDivider` is `<hr>` by default. Switch to `decorative` when you don't want the rule announced (vertical inline separators).
- Progress components require a label (or `ariaLabel`) — a bare spinner with no accessible name is a regression.

---

## 7. Success criteria

- [ ] `yarn test` passes — six new suites + everything from Bundles 1–3.
- [ ] `yarn build` produces zero new warnings.
- [ ] `yarn storybook` shows the six new entries (three under `Display`, three under `Feedback`) with every state from the screenshots reachable via controls.
- [ ] Stylelint passes (no hex literals in EditorialUI component SCSS).
- [ ] Dark-theme spot check — every state in every component still meets WCAG AA contrast.
- [ ] Manual a11y per component:
  - `EdTag` — close button activates with Enter / Space.
  - `EdStatusBadge` — VoiceOver / NVDA reads the visible mono label and the `ariaLabel` override when present.
  - `EdChip` — Tab reaches the chip; Space toggles; for `kind="input"`, Backspace fires `onRemove` when focused.
  - `EdDivider` — `<hr>` is announced as "Separator"; decorative variants are not announced.
  - `EdProgressMeter` — `aria-valuetext` is the spoken string (verify with a long form like "68%, 2142 of 3150").
  - `EdCircularProgress` — `role="status"` is announced once on appearance, then stays silent (no flooding).
- [ ] `prefers-reduced-motion: reduce` is honoured — indeterminate progress bars and spinners stop their continuous motion.

---

## 8. What's NOT in this bundle

- **No EdFilterChipRow** — that's Bundle 9 (Late composites). `EdChip` is the building block; the composite handles overflow + clear-all + URL-state binding.
- **No EdSkeleton** — Bundle 5 (Feedback). The Decision Rules in `EdCircularProgress` already point users at the future component.
- **No animation primitives** — every motion is local CSS. A shared `Motion` token system might land later, but isn't blocking this bundle.
- **No app-level migration** — same rule as previous bundles. Land the library, migrate consumers separately.

Lead the PR with the `screenshots/` grid so reviewers can match each component
to its spec at a glance.
