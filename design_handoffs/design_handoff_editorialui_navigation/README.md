# EditorialUI · Navigation bundle (Bundle 7)

Seventh implementation bundle. Moving between views and invoking commands:
tabs, breadcrumb trail, and the two menus (dropdown + right-click).

---

## What's in this bundle

```
src/
└── components/
    └── EditorialUI/
        ├── index.ts                ← UPDATED barrel (Bundles 1–7 — additive)
        ├── EdTabs/
        ├── EdBreadcrumb/
        ├── EdMenu/                 ← exports EdMenu + the EdMenuEntry item model
        └── EdContextMenu/          ← reuses EdMenu's item model + stylesheet
```

Same shape as every bundle: `*.tsx` + `*.module.scss` + `*.stories.tsx`
+ `*.test.tsx` + `index.ts`.

---

## New dependencies

```bash
yarn add @radix-ui/react-tabs @radix-ui/react-dropdown-menu @radix-ui/react-context-menu
```

| Package | Used by |
|---|---|
| `@radix-ui/react-tabs` | `EdTabs` |
| `@radix-ui/react-dropdown-menu` | `EdMenu` |
| `@radix-ui/react-context-menu` | `EdContextMenu` |

`EdBreadcrumb` is plain semantic HTML — no dependency.

---

## Component summary

### `EdTabs`
Mutually-exclusive sibling views under one heading. Radix Tabs (arrow-key nav,
Home/End, roving focus). `underline` (page-level, default) or `segmented` (inline
toolbars, 2–4 short labels). Items as data with optional count pill (folded into
the accessible name), leading icon, or trailing status dot. `activationMode`
`automatic` (select on focus) or `manual` (Enter/Space — for async panels).
Encode the active tab in `?tab=<value>` at the call site. >7 tabs → sidebar nav.

### `EdBreadcrumb`
Path-back trail. The last crumb is the current page (plain text, `aria-current="page"`);
the rest are links (native `<a>` or a `renderLink` adapter for your router). Semantic
`<nav aria-label="Breadcrumb"><ol>`. Collapses the middle behind a "…" button past
`maxItems` (default 4), expanding inline on click. Slash or chevron separators
(always `aria-hidden`). Never include the brand/Home crumb.

### `EdMenu`
Anchored dropdown of **command targets** (actions, not selections). Radix
DropdownMenu. Items are a single data model — `EdMenuEntry` — covering action
items (icon + label + shortcut + meta), checkbox items (stay open on toggle),
group labels, separators, and submenus. Destructive items take danger styling
and **require an explicit `ariaLabel` that names the entity** ("Delete finding
F-2438"). For value-picking use `EdSelect`/`EdComboBox`; for right-click use
`EdContextMenu`.

### `EdContextMenu`
Right-click menu for direct manipulation. **Same item model and visual chrome as
`EdMenu`** (it imports `EdMenu`'s `EdMenuEntry` type and `.module.scss`), different
trigger. Radix ContextMenu provides the keyboard equivalent (Shift+F10 / Menu key)
and touch long-press. **Every action must also be reachable via the visible UI** —
context menus are accelerators, never the only path. Never put a destructive action
only here.

---

## Drop locations

```bash
cp -R src/components/EditorialUI/EdTabs        <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdBreadcrumb  <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdMenu        <repo>/ClientApp/src/components/EditorialUI/
cp -R src/components/EditorialUI/EdContextMenu <repo>/ClientApp/src/components/EditorialUI/
cp    src/components/EditorialUI/index.ts      <repo>/ClientApp/src/components/EditorialUI/index.ts
```

> **Order matters:** `EdContextMenu` imports from `../EdMenu` (the shared item
> model + stylesheet). Copy `EdMenu` too — don't ship `EdContextMenu` alone.

## Storybook categories

All four stories land under `EditorialUI/Navigation/*`. Note the spec groups
`EdMenu` (D4) and `EdContextMenu` (D5) under *Containers* in the design doc; this
bundle places them under *Navigation* for delivery, and the stories are
categorised `Navigation` to match the bundle. If you prefer to mirror the spec's
taxonomy exactly, change the `title` in the two `.stories.tsx` files to
`EditorialUI/Containers/*` — purely cosmetic, no code impact.

---

## What this codifies

- **Tabs vs filters vs accordion.** Tabs = different content (sibling views). Filters (`EdFilterChipRow`, Bundle 9) = narrow the same content. Accordion = independently expandable, not mutually exclusive.
- **Menu = verb, Select = noun.** `EdMenu` invokes actions; `EdSelect`/`EdComboBox` pick values. Don't use a menu to set a field.
- **One menu item model.** `EdMenuEntry` is shared by `EdMenu` and `EdContextMenu` so the same `items` array drives a button-triggered menu and a right-click menu identically.
- **Destructive items name the entity.** Danger items require `ariaLabel` ("Delete finding F-2438"), and never live only in a context menu.

---

## What's next

- **Bundle 8** — Data: `EdDataTable`, `EdNativeTable`, `EdList`. `EdContextMenu` will wrap table rows; `EdMenu` powers the row overflow + column header menus.
- **Bundle 9** — Late composites: `EdDateRangePicker`, `EdFilterChipRow`, `EdTagContainer`, `EdTagSelect`.
