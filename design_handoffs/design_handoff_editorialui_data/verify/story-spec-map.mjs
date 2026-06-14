// EditorialUI · visual verification — story → spec-state mapping  (Bundle: Data)
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

    /* ------------------------------------------- EdNativeTable */
    // native-table.html spec states:
    //   • key-value (most common)
    //   • columned (small data set with headers)
    //   • zebra-striped (for scannability when rows visually blend)
    //   • in side panel
    //   • Metadata
    EdNativeTable: [
        { id: "editorialui-data-ednativetable--keyvalue", spec: { page: "native-table", label: "key-value (most common)" } /* TODO:pair — 'KeyValue' had no match */ },
        { id: "editorialui-data-ednativetable--columned", spec: { page: "native-table", label: "columned (small data set with headers)" } },
        { id: "editorialui-data-ednativetable--zebra", spec: { page: "native-table", label: "zebra-striped (for scannability when rows visually blend)" } },
        { id: "editorialui-data-ednativetable--insidepanel", spec: { page: "native-table", label: "key-value (most common)" } /* TODO:pair — 'InSidePanel' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-data-ednativetable--keyvalue", spec: { page: "native-table", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],

    /* --------------------------------------------- EdDataTable */
    // data-table.html spec states:
    //   • default — 40px rows
    //   • compact — 32px rows (audit log, run history)
    //   • empty
    //   • loading skeleton
    //   • error
    //   • filtered no-results
    EdDataTable: [
        { id: "editorialui-data-eddatatable--default", spec: { page: "data-table", label: "default — 40px rows" } },
        { id: "editorialui-data-eddatatable--selection", spec: { page: "data-table", label: "default — 40px rows" } /* TODO:pair — 'Selection' had no match */ },
        { id: "editorialui-data-eddatatable--sortable", spec: { page: "data-table", label: "default — 40px rows" } /* TODO:pair — 'Sortable' had no match */ },
        { id: "editorialui-data-eddatatable--clientsortuncontrolled", spec: { page: "data-table", label: "default — 40px rows" } /* TODO:pair — 'ClientSortUncontrolled' had no match */ },
        { id: "editorialui-data-eddatatable--compact", spec: { page: "data-table", label: "compact — 32px rows (audit log, run history)" } },
        { id: "editorialui-data-eddatatable--zebra", spec: { page: "data-table", label: "default — 40px rows" } /* TODO:pair — 'Zebra' had no match */ },
        { id: "editorialui-data-eddatatable--paginated", spec: { page: "data-table", label: "default — 40px rows" } /* TODO:pair — 'Paginated' had no match */ },
        { id: "editorialui-data-eddatatable--loading", spec: { page: "data-table", label: "loading skeleton" } },
        { id: "editorialui-data-eddatatable--errorstate", spec: { page: "data-table", label: "error" } },
        { id: "editorialui-data-eddatatable--empty", spec: { page: "data-table", label: "empty" } },
        // dark-mode spot check (first story)
        { id: "editorialui-data-eddatatable--default", spec: { page: "data-table", label: "default — 40px rows" }, theme: 'dark' },
    ],

    /* -------------------------------------------------- EdList */
    // list.html spec states:
    //   • simple — single line
    //   • with avatar + desc
    //   • with leading icon + meta
    //   • grouped
    //   • empty
    //   • loading skeleton
    EdList: [
        { id: "editorialui-data-edlist--simple", spec: { page: "list", label: "simple — single line" } },
        { id: "editorialui-data-edlist--withavatar", spec: { page: "list", label: "simple — single line" } /* TODO:pair — 'WithAvatar' had no match */ },
        { id: "editorialui-data-edlist--withiconmeta", spec: { page: "list", label: "simple — single line" } /* TODO:pair — 'WithIconMeta' had no match */ },
        { id: "editorialui-data-edlist--grouped", spec: { page: "list", label: "grouped" } },
        { id: "editorialui-data-edlist--static", spec: { page: "list", label: "simple — single line" } /* TODO:pair — 'Static' had no match */ },
        { id: "editorialui-data-edlist--empty", spec: { page: "list", label: "empty" } },
        { id: "editorialui-data-edlist--loadingskeleton", spec: { page: "list", label: "simple — single line" } /* TODO:pair — 'LoadingSkeleton' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-data-edlist--simple", spec: { page: "list", label: "simple — single line" }, theme: 'dark' },
    ],
};

// Max fraction of differing pixels (0–1) tolerated after cropping to common
// dimensions. 0.1 absorbs anti-aliasing without hiding a token/geometry change.
// Tighten toward 0.03 once a component is green.
export const DIFF_THRESHOLD = 0.1;

// A dimension delta larger than this (px, either axis) fails on its own —
// geometry drift (e.g. 38px vs 36px control) must fail loudly, not be cropped.
export const DIM_TOLERANCE_PX = 2;
