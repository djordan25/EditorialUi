// EditorialUI · visual verification — story → spec-state mapping  (Bundle: Late composites)
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

    /* ------------------------------------------ EdTagContainer */
    // tag-container.html spec states:
    //   • wrap (default) — flowing rows
    //   • single-row — collapse with overflow counter
    //   • single-row + tooltip overflow
    //   • empty state
    EdTagContainer: [
        { id: "editorialui-display-edtagcontainer--wrap", spec: { page: "tag-container", label: "wrap (default) — flowing rows" } },
        { id: "editorialui-display-edtagcontainer--singlerow", spec: { page: "tag-container", label: "wrap (default) — flowing rows" } /* TODO:pair — 'SingleRow' had no match */ },
        { id: "editorialui-display-edtagcontainer--singlerowinteractiveoverflow", spec: { page: "tag-container", label: "wrap (default) — flowing rows" } /* TODO:pair — 'SingleRowInteractiveOverflow' had no match */ },
        { id: "editorialui-display-edtagcontainer--empty", spec: { page: "tag-container", label: "empty state" } },
        // dark-mode spot check (first story)
        { id: "editorialui-display-edtagcontainer--wrap", spec: { page: "tag-container", label: "wrap (default) — flowing rows" }, theme: 'dark' },
    ],

    /* --------------------------------------------- EdTagSelect */
    // tag-select.html spec states:
    //   • empty
    //   • populated
    //   • disabled
    //   • error
    EdTagSelect: [
        { id: "editorialui-display-edtagselect--empty", spec: { page: "tag-select", label: "empty" } },
        { id: "editorialui-display-edtagselect--populated", spec: { page: "tag-select", label: "populated" } },
        { id: "editorialui-display-edtagselect--allowcreate", spec: { page: "tag-select", label: "empty" } /* TODO:pair — 'AllowCreate' had no match */ },
        { id: "editorialui-display-edtagselect--disabled", spec: { page: "tag-select", label: "disabled" } },
        { id: "editorialui-display-edtagselect--error", spec: { page: "tag-select", label: "error" } },
        { id: "editorialui-display-edtagselect--overflowing", spec: { page: "tag-select", label: "empty" } /* TODO:pair — 'Overflowing' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-display-edtagselect--empty", spec: { page: "tag-select", label: "empty" }, theme: 'dark' },
    ],

    /* ----------------------------------------- EdFilterChipRow */
    // filter-chip-row.html spec states:
    //   • multi-select — count badges, additive filters
    //   • single-select — segmented control, mutually exclusive views
    //   • no counts
    //   • with status colors (read-only)
    //   • narrow viewport — collapse to popover
    EdFilterChipRow: [
        { id: "editorialui-selection-edfilterchiprow--multi", spec: { page: "filter-chip-row", label: "multi-select — count badges, additive filters" } },
        { id: "editorialui-selection-edfilterchiprow--single", spec: { page: "filter-chip-row", label: "single-select — segmented control, mutually exclusive views" } },
        { id: "editorialui-selection-edfilterchiprow--nocounts", spec: { page: "filter-chip-row", label: "multi-select — count badges, additive filters" } /* TODO:pair — 'NoCounts' had no match */ },
        { id: "editorialui-selection-edfilterchiprow--withstatusdots", spec: { page: "filter-chip-row", label: "multi-select — count badges, additive filters" } /* TODO:pair — 'WithStatusDots' had no match */ },
        { id: "editorialui-selection-edfilterchiprow--grouped", spec: { page: "filter-chip-row", label: "multi-select — count badges, additive filters" } /* TODO:pair — 'Grouped' had no match */ },
        { id: "editorialui-selection-edfilterchiprow--withoverflow", spec: { page: "filter-chip-row", label: "multi-select — count badges, additive filters" } /* TODO:pair — 'WithOverflow' had no match */ },
        { id: "editorialui-selection-edfilterchiprow--disabled", spec: { page: "filter-chip-row", label: "multi-select — count badges, additive filters" } /* TODO:pair — 'Disabled' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-selection-edfilterchiprow--multi", spec: { page: "filter-chip-row", label: "multi-select — count badges, additive filters" }, theme: 'dark' },
    ],

    /* --------------------------------------- EdDateRangePicker */
    // date-range-picker.html spec states:
    //   • empty
    //   • preset selected
    //   • custom range
    //   • single date variant
    EdDateRangePicker: [
        { id: "editorialui-selection-eddaterangepicker--default", spec: { page: "date-range-picker", label: "empty" } /* TODO:pair — 'Default' had no match */ },
        { id: "editorialui-selection-eddaterangepicker--emptystate", spec: { page: "date-range-picker", label: "empty" } },
        { id: "editorialui-selection-eddaterangepicker--presetmatched", spec: { page: "date-range-picker", label: "empty" } /* TODO:pair — 'PresetMatched' had no match */ },
        { id: "editorialui-selection-eddaterangepicker--constrained", spec: { page: "date-range-picker", label: "empty" } /* TODO:pair — 'Constrained' had no match */ },
        { id: "editorialui-selection-eddaterangepicker--error", spec: { page: "date-range-picker", label: "empty" } /* TODO:pair — 'Error' had no match */ },
        { id: "editorialui-selection-eddaterangepicker--disabled", spec: { page: "date-range-picker", label: "empty" } /* TODO:pair — 'Disabled' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-selection-eddaterangepicker--default", spec: { page: "date-range-picker", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],
};

// Max fraction of differing pixels (0–1) tolerated after cropping to common
// dimensions. 0.1 absorbs anti-aliasing without hiding a token/geometry change.
// Tighten toward 0.03 once a component is green.
export const DIFF_THRESHOLD = 0.1;

// A dimension delta larger than this (px, either axis) fails on its own —
// geometry drift (e.g. 38px vs 36px control) must fail loudly, not be cropped.
export const DIM_TOLERANCE_PX = 2;
