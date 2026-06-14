// EditorialUI · visual verification — story → spec-state mapping  (Bundle: Selection)
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

    /* ------------------------------------------------ EdSelect */
    // select.html spec states:
    //   • default
    //   • filled
    //   • focus
    //   • open
    //   • error
    //   • disabled
    //   • simple list
    //   • grouped
    //   • with metadata
    //   • sm — 28px
    //   • md — 36px (default)
    //   • lg — 44px
    EdSelect: [
        { id: "editorialui-selection-edselect--default", spec: { page: "select", label: "default" } },
        { id: "editorialui-selection-edselect--filled", spec: { page: "select", label: "filled" } },
        { id: "editorialui-selection-edselect--open", spec: { page: "select", label: "open" } },
        { id: "editorialui-selection-edselect--sizes", spec: { page: "select", label: "default" } /* TODO:pair — 'Sizes' had no match */ },
        { id: "editorialui-selection-edselect--grouped", spec: { page: "select", label: "grouped" } },
        { id: "editorialui-selection-edselect--withmetadata", spec: { page: "select", label: "default" } /* TODO:pair — 'WithMetadata' had no match */ },
        { id: "editorialui-selection-edselect--error", spec: { page: "select", label: "error" } },
        { id: "editorialui-selection-edselect--disabled", spec: { page: "select", label: "disabled" } },
        { id: "editorialui-selection-edselect--controlled", spec: { page: "select", label: "default" } /* TODO:pair — 'Controlled' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-selection-edselect--default", spec: { page: "select", label: "default" }, theme: 'dark' },
    ],

    /* ---------------------------------------------- EdComboBox */
    // combobox.html spec states:
    //   • empty
    //   • selected
    //   • filtering
    //   • empty results
    //   • loading
    //   • error
    //   • staged loading — owners (35), regulations (200+)
    EdComboBox: [
        { id: "editorialui-selection-edcombobox--default", spec: { page: "combobox", label: "empty" } /* TODO:pair — 'Default' had no match */ },
        { id: "editorialui-selection-edcombobox--filtering", spec: { page: "combobox", label: "filtering" } },
        { id: "editorialui-selection-edcombobox--emptyresults", spec: { page: "combobox", label: "empty" } },
        { id: "editorialui-selection-edcombobox--error", spec: { page: "combobox", label: "error" } },
        { id: "editorialui-selection-edcombobox--disabled", spec: { page: "combobox", label: "empty" } /* TODO:pair — 'Disabled' had no match */ },
        { id: "editorialui-selection-edcombobox--multi", spec: { page: "combobox", label: "empty" } /* TODO:pair — 'Multi' had no match */ },
        { id: "editorialui-selection-edcombobox--multioverflow", spec: { page: "combobox", label: "empty" } /* TODO:pair — 'MultiOverflow' had no match */ },
        { id: "editorialui-selection-edcombobox--asyncowners", spec: { page: "combobox", label: "empty" } /* TODO:pair — 'AsyncOwners' had no match */ },
        { id: "editorialui-selection-edcombobox--asyncregulations", spec: { page: "combobox", label: "empty" } /* TODO:pair — 'AsyncRegulations' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-selection-edcombobox--default", spec: { page: "combobox", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],

    /* ------------------------------------------ EdAutocomplete */
    // autocomplete.html spec states:
    //   • find or create — finding title
    //   • command-style — quick add
    //   • cell — type-or-pick value
    //   • tags input — free + suggested
    EdAutocomplete: [
        { id: "editorialui-selection-edautocomplete--findorcreate", spec: { page: "autocomplete", label: "find or create — finding title" } /* TODO:pair — 'FindOrCreate' had no match */ },
        { id: "editorialui-selection-edautocomplete--nomatch", spec: { page: "autocomplete", label: "find or create — finding title" } /* TODO:pair — 'NoMatch' had no match */ },
        { id: "editorialui-selection-edautocomplete--celledit", spec: { page: "autocomplete", label: "find or create — finding title" } /* TODO:pair — 'CellEdit' had no match */ },
        { id: "editorialui-selection-edautocomplete--tagsinput", spec: { page: "autocomplete", label: "find or create — finding title" } /* TODO:pair — 'TagsInput' had no match */ },
        { id: "editorialui-selection-edautocomplete--asyncsuggestions", spec: { page: "autocomplete", label: "find or create — finding title" } /* TODO:pair — 'AsyncSuggestions' had no match */ },
        { id: "editorialui-selection-edautocomplete--error", spec: { page: "autocomplete", label: "find or create — finding title" } /* TODO:pair — 'Error' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-selection-edautocomplete--findorcreate", spec: { page: "autocomplete", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],
};

// Max fraction of differing pixels (0–1) tolerated after cropping to common
// dimensions. 0.1 absorbs anti-aliasing without hiding a token/geometry change.
// Tighten toward 0.03 once a component is green.
export const DIFF_THRESHOLD = 0.1;

// A dimension delta larger than this (px, either axis) fails on its own —
// geometry drift (e.g. 38px vs 36px control) must fail loudly, not be cropped.
export const DIM_TOLERANCE_PX = 2;
