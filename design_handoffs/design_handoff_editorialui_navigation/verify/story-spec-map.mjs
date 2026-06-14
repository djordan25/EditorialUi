// EditorialUI · visual verification — story → spec-state mapping  (Bundle: Navigation)
//
// Ties each Storybook story (a component state) to the matching state in the
// design spec HTML so the runner can diff the two renderings.
//
// THE ORACLE is the spec HTML in design_system_v2/components/*.html — NOT the
// PNG screenshots in ../screenshots (those are 0.7x letterboxed orientation
// shots). The spec pages render every state at 1:1 using the same tokens.css the
// components compile against.
//
// HOW MATCHING WORKS
//   - id:    a Storybook story id ('<sanitized-title>--<sanitized-export>').
//   - spec:  { page, label }    → find the .ed-cell whose .ed-cell__label === label,
//                                 screenshot its .ed-cell__demo
//            { page, selector } → screenshot the first element matching selector
//   - interaction (optional): 'hover' | 'focus' | 'active' — a real pseudo-state
//                             Playwright drives on the STORY before capture.
//   - theme: 'light' (default) | 'dark'.
//
// ⚠️  SCAFFOLD — RECONCILE BEFORE TRUSTING A GREEN RUN.
// The story ids below are derived from the real story exports found in each
// *.stories.tsx. The spec 'label' values are AUTO-PAIRED best guesses; every
// page's full set of available labels is listed in the comment above its block.
// First run, for each component page:
//     node verify/visual-verify.mjs --list-spec <page>
// then fix any label that didn't auto-pair (marked /* TODO:pair */).

/** @typedef {{ id: string, spec: ({page:string,label:string}|{page:string,selector:string}), interaction?: 'hover'|'focus'|'active', theme?: 'light'|'dark', note?: string }} VerifyCase */

/** @type {Record<string, VerifyCase[]>} */
export const CASES = {

    /* -------------------------------------------------- EdTabs */
    // tabs.html spec states:
    //   • underline — page-level navigation
    //   • segmented — inline view toggle
    //   • with icons
    //   • with status dot
    EdTabs: [
        { id: "editorialui-navigation-edtabs--underline", spec: { page: "tabs", label: "underline — page-level navigation" } },
        { id: "editorialui-navigation-edtabs--segmented", spec: { page: "tabs", label: "segmented — inline view toggle" } },
        { id: "editorialui-navigation-edtabs--withcounts", spec: { page: "tabs", label: "underline — page-level navigation" } /* TODO:pair — 'WithCounts' had no match */ },
        { id: "editorialui-navigation-edtabs--withicons", spec: { page: "tabs", label: "underline — page-level navigation" } /* TODO:pair — 'WithIcons' had no match */ },
        { id: "editorialui-navigation-edtabs--withstatusdot", spec: { page: "tabs", label: "underline — page-level navigation" } /* TODO:pair — 'WithStatusDot' had no match */ },
        { id: "editorialui-navigation-edtabs--overflow", spec: { page: "tabs", label: "underline — page-level navigation" } /* TODO:pair — 'Overflow' had no match */ },
        { id: "editorialui-navigation-edtabs--asyncmanual", spec: { page: "tabs", label: "underline — page-level navigation" } /* TODO:pair — 'AsyncManual' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-navigation-edtabs--underline", spec: { page: "tabs", label: "underline — page-level navigation" }, theme: 'dark' },
    ],

    /* -------------------------------------------- EdBreadcrumb */
    // breadcrumb.html spec states:
    //   • default
    //   • with overflow (long path)
    //   • single back link (compact)
    //   • with chevron separator (Stripe-style)
    EdBreadcrumb: [
        { id: "editorialui-navigation-edbreadcrumb--twolevel", spec: { page: "breadcrumb", label: "default" } /* TODO:pair — 'TwoLevel' had no match */ },
        { id: "editorialui-navigation-edbreadcrumb--threelevel", spec: { page: "breadcrumb", label: "default" } /* TODO:pair — 'ThreeLevel' had no match */ },
        { id: "editorialui-navigation-edbreadcrumb--withoverflow", spec: { page: "breadcrumb", label: "default" } /* TODO:pair — 'WithOverflow' had no match */ },
        { id: "editorialui-navigation-edbreadcrumb--chevronseparator", spec: { page: "breadcrumb", label: "default" } /* TODO:pair — 'ChevronSeparator' had no match */ },
        { id: "editorialui-navigation-edbreadcrumb--backlinkvariant", spec: { page: "breadcrumb", label: "default" } /* TODO:pair — 'BackLinkVariant' had no match */ },
        { id: "editorialui-navigation-edbreadcrumb--longlabelstruncate", spec: { page: "breadcrumb", label: "default" } /* TODO:pair — 'LongLabelsTruncate' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-navigation-edbreadcrumb--twolevel", spec: { page: "breadcrumb", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],

    /* -------------------------------------------------- EdMenu */
    // menu.html spec states:
    //   • simple — label only
    //   • with icons
    //   • with shortcuts
    //   • checkable — toggle state
    //   • with metadata — counts, status
    //   • submenu — trailing chevron
    //   • disabled item
    //   • button with chevron — declared menu
    //   • icon-only — overflow menu
    //   • split button — primary + menu
    //   • avatar — user menu
    EdMenu: [
        { id: "editorialui-navigation-edmenu--full", spec: { page: "menu", label: "simple — label only" } /* TODO:pair — 'Full' had no match */ },
        { id: "editorialui-navigation-edmenu--simple", spec: { page: "menu", label: "simple — label only" } },
        { id: "editorialui-navigation-edmenu--overflowicon", spec: { page: "menu", label: "simple — label only" } /* TODO:pair — 'OverflowIcon' had no match */ },
        { id: "editorialui-navigation-edmenu--checkable", spec: { page: "menu", label: "checkable — toggle state" } },
        { id: "editorialui-navigation-edmenu--withmetadata", spec: { page: "menu", label: "simple — label only" } /* TODO:pair — 'WithMetadata' had no match */ },
        { id: "editorialui-navigation-edmenu--submenu", spec: { page: "menu", label: "submenu — trailing chevron" } },
        { id: "editorialui-navigation-edmenu--disableditem", spec: { page: "menu", label: "simple — label only" } /* TODO:pair — 'DisabledItem' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-navigation-edmenu--full", spec: { page: "menu", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],

    /* ------------------------------------------- EdContextMenu */
    // context-menu.html spec states:
    //   • table row
    //   • graph node
    //   • canvas background
    //   • text selection
    EdContextMenu: [
        { id: "editorialui-navigation-edcontextmenu--ontablerow", spec: { page: "context-menu", label: "table row" } /* TODO:pair — 'OnTableRow' had no match */ },
        { id: "editorialui-navigation-edcontextmenu--withsubmenu", spec: { page: "context-menu", label: "table row" } /* TODO:pair — 'WithSubmenu' had no match */ },
        { id: "editorialui-navigation-edcontextmenu--oncanvas", spec: { page: "context-menu", label: "table row" } /* TODO:pair — 'OnCanvas' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-navigation-edcontextmenu--ontablerow", spec: { page: "context-menu", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],
};

// Max fraction of differing pixels (0–1) tolerated after cropping to common
// dimensions. 0.1 absorbs anti-aliasing without hiding a token/geometry change.
// Tighten toward 0.03 once a component is green.
export const DIFF_THRESHOLD = 0.1;

// A dimension delta larger than this (px, either axis) fails on its own —
// geometry drift (e.g. 38px vs 36px control) must fail loudly, not be cropped.
export const DIM_TOLERANCE_PX = 2;
