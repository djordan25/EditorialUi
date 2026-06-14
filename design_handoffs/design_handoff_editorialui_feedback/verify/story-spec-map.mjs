// EditorialUI · visual verification — story → spec-state mapping  (Bundle: Feedback)
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

    /* ----------------------------------------------- EdTooltip */
    // tooltip.html spec states:
    //   • label icon-only button
    //   • show keyboard shortcut
    //   • explain truncated text
    //   • define a term (rich)
    //   • top (default)
    //   • bottom
    //   • left
    //   • right
    EdTooltip: [
        { id: "editorialui-feedback-edtooltip--default", spec: { page: "tooltip", label: "top (default)" } },
        { id: "editorialui-feedback-edtooltip--withkbd", spec: { page: "tooltip", label: "label icon-only button" } /* TODO:pair — 'WithKbd' had no match */ },
        { id: "editorialui-feedback-edtooltip--rich", spec: { page: "tooltip", label: "define a term (rich)" } },
        { id: "editorialui-feedback-edtooltip--truncatedtext", spec: { page: "tooltip", label: "label icon-only button" } /* TODO:pair — 'TruncatedText' had no match */ },
        { id: "editorialui-feedback-edtooltip--placements", spec: { page: "tooltip", label: "label icon-only button" } /* TODO:pair — 'Placements' had no match */ },
        { id: "editorialui-feedback-edtooltip--disabled", spec: { page: "tooltip", label: "label icon-only button" } /* TODO:pair — 'Disabled' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-feedback-edtooltip--default", spec: { page: "tooltip", label: "top (default)" }, theme: 'dark' },
    ],

    /* ------------------------------------------ EdNotification */
    // notification.html spec states:
    //   • info
    //   • success
    //   • warning
    //   • danger
    //   • title only — compact
    //   • no left rail (subtle, used inside cards)
    //   • stacked — most recent on top
    EdNotification: [
        { id: "editorialui-feedback-ednotification--info", spec: { page: "notification", label: "info" } },
        { id: "editorialui-feedback-ednotification--success", spec: { page: "notification", label: "success" } },
        { id: "editorialui-feedback-ednotification--warning", spec: { page: "notification", label: "warning" } },
        { id: "editorialui-feedback-ednotification--danger", spec: { page: "notification", label: "danger" } },
        { id: "editorialui-feedback-ednotification--compact", spec: { page: "notification", label: "title only — compact" } },
        { id: "editorialui-feedback-ednotification--subtle", spec: { page: "notification", label: "no left rail (subtle, used inside cards)" } },
        { id: "editorialui-feedback-ednotification--withdismiss", spec: { page: "notification", label: "info" } /* TODO:pair — 'WithDismiss' had no match */ },
        { id: "editorialui-feedback-ednotification--stacked", spec: { page: "notification", label: "stacked — most recent on top" } },
        // dark-mode spot check (first story)
        { id: "editorialui-feedback-ednotification--info", spec: { page: "notification", label: "info" }, theme: 'dark' },
    ],

    /* ------------------------------------------------ EdDialog */
    // dialog.html spec states:
    //   • sm — 400 — confirmations
    //   • md — 520 — default
    //   • lg — 720 — forms, multi-section
    //   • xl — 960 — multi-pane (rare)
    //   • danger — destructive header rail
    //   • no header — content-led
    EdDialog: [
        { id: "editorialui-containers-eddialog--default", spec: { page: "dialog", label: "md — 520 — default" } },
        { id: "editorialui-containers-eddialog--sizes", spec: { page: "dialog", label: "sm — 400 — confirmations" } /* TODO:pair — 'Sizes' had no match */ },
        { id: "editorialui-containers-eddialog--scrollingbody", spec: { page: "dialog", label: "sm — 400 — confirmations" } /* TODO:pair — 'ScrollingBody' had no match */ },
        { id: "editorialui-containers-eddialog--preventoutsideclose", spec: { page: "dialog", label: "sm — 400 — confirmations" } /* TODO:pair — 'PreventOutsideClose' had no match */ },
        { id: "editorialui-containers-eddialog--confirmation", spec: { page: "dialog", label: "sm — 400 — confirmations" } },
        // dark-mode spot check (first story)
        { id: "editorialui-containers-eddialog--default", spec: { page: "dialog", label: "md — 520 — default" }, theme: 'dark' },
    ],

    /* -------------------------------------------- EdEmptyState */
    // empty-state.html spec states:
    //   • first use — no data yet
    //   • filtered — no results
    //   • error — load failed
    //   • success — done, no action
    //   • permission — restricted
    //   • compact — inside small panel
    EdEmptyState: [
        { id: "editorialui-feedback-edemptystate--firstuse", spec: { page: "empty-state", label: "first use — no data yet" } /* TODO:pair — 'FirstUse' had no match */ },
        { id: "editorialui-feedback-edemptystate--noresults", spec: { page: "empty-state", label: "first use — no data yet" } /* TODO:pair — 'NoResults' had no match */ },
        { id: "editorialui-feedback-edemptystate--errorstate", spec: { page: "empty-state", label: "first use — no data yet" } /* TODO:pair — 'ErrorState' had no match */ },
        { id: "editorialui-feedback-edemptystate--successnoaction", spec: { page: "empty-state", label: "first use — no data yet" } /* TODO:pair — 'SuccessNoAction' had no match */ },
        { id: "editorialui-feedback-edemptystate--restricted", spec: { page: "empty-state", label: "permission — restricted" } },
        { id: "editorialui-feedback-edemptystate--compact", spec: { page: "empty-state", label: "compact — inside small panel" } },
        { id: "editorialui-feedback-edemptystate--zeroaction", spec: { page: "empty-state", label: "first use — no data yet" } /* TODO:pair — 'ZeroAction' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-feedback-edemptystate--firstuse", spec: { page: "empty-state", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],
};

// Max fraction of differing pixels (0–1) tolerated after cropping to common
// dimensions. 0.1 absorbs anti-aliasing without hiding a token/geometry change.
// Tighten toward 0.03 once a component is green.
export const DIFF_THRESHOLD = 0.1;

// A dimension delta larger than this (px, either axis) fails on its own —
// geometry drift (e.g. 38px vs 36px control) must fail loudly, not be cropped.
export const DIM_TOLERANCE_PX = 2;
