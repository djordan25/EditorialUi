// EditorialUI · visual verification — story → spec-state mapping  (Bundle: Containers)
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

    /* -------------------------------------------------- EdCard */
    // card.html spec states:
    //   • stat tile — dashboard cell
    //   • summary card — entity preview
    //   • interactive — clickable
    //   • selected
    //   • flat — no border
    //   • ghost — empty / add
    EdCard: [
        { id: "editorialui-containers-edcard--stat", spec: { page: "card", label: "stat tile — dashboard cell" } },
        { id: "editorialui-containers-edcard--summary", spec: { page: "card", label: "summary card — entity preview" } },
        { id: "editorialui-containers-edcard--interactive", spec: { page: "card", label: "interactive — clickable" } },
        { id: "editorialui-containers-edcard--selected", spec: { page: "card", label: "selected" } },
        { id: "editorialui-containers-edcard--flat", spec: { page: "card", label: "flat — no border" } },
        { id: "editorialui-containers-edcard--ghost", spec: { page: "card", label: "ghost — empty / add" } },
        // dark-mode spot check (first story)
        { id: "editorialui-containers-edcard--stat", spec: { page: "card", label: "stat tile — dashboard cell" }, theme: 'dark' },
    ],

    /* ------------------------------------------------- EdModal */
    // modal.html spec states:
    //   • confirmation — single action, danger phrasing
    //   • form — single-column, labels above inputs
    //   • busy — disable footer, show inline progress
    //   • multi-step — stepper at top, single-action footer
    //   • single primary — informational
    //   • cancel + primary — default
    //   • cancel + secondary + primary — form save
    //   • with meta — shortcut hint
    EdModal: [
        { id: "editorialui-containers-edmodal--confirmation", spec: { page: "modal", label: "confirmation — single action, danger phrasing" } },
        { id: "editorialui-containers-edmodal--form", spec: { page: "modal", label: "form — single-column, labels above inputs" } },
        { id: "editorialui-containers-edmodal--busy", spec: { page: "modal", label: "busy — disable footer, show inline progress" } },
        { id: "editorialui-containers-edmodal--dangervariant", spec: { page: "modal", label: "confirmation — single action, danger phrasing" } /* TODO:pair — 'DangerVariant' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-containers-edmodal--confirmation", spec: { page: "modal", label: "confirmation — single action, danger phrasing" }, theme: 'dark' },
    ],

    /* ------------------------------------------------ EdDrawer */
    // side-panel.html spec states:
    //   • non-modal (default) — page stays interactive
    //   • modal — focused edit, blocks page
    //   • sm — 320 — read-only inspect
    //   • md — 380 — default
    //   • lg — 480 — form drawer
    //   • xl — 640 — multi-pane content
    EdDrawer: [
        { id: "editorialui-containers-eddrawer--nonmodalinspect", spec: { page: "side-panel", label: "non-modal (default) — page stays interactive" } /* TODO:pair — 'NonModalInspect' had no match */ },
        { id: "editorialui-containers-eddrawer--modaledit", spec: { page: "side-panel", label: "non-modal (default) — page stays interactive" } /* TODO:pair — 'ModalEdit' had no match */ },
        { id: "editorialui-containers-eddrawer--sizes", spec: { page: "side-panel", label: "non-modal (default) — page stays interactive" } /* TODO:pair — 'Sizes' had no match */ },
        { id: "editorialui-containers-eddrawer--leftside", spec: { page: "side-panel", label: "non-modal (default) — page stays interactive" } /* TODO:pair — 'LeftSide' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-containers-eddrawer--nonmodalinspect", spec: { page: "side-panel", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],

    /* -------------------------------------------- EdDisclosure */
    // disclosure.html spec states:
    //   • advanced options — secondary form fields
    //   • debug info — collapsed by default, mono dump
    EdDisclosure: [
        { id: "editorialui-containers-eddisclosure--default", spec: { page: "disclosure", label: "debug info — collapsed by default, mono dump" } },
        { id: "editorialui-containers-eddisclosure--collapsed", spec: { page: "disclosure", label: "debug info — collapsed by default, mono dump" } },
        { id: "editorialui-containers-eddisclosure--stacked", spec: { page: "disclosure", label: "advanced options — secondary form fields" } /* TODO:pair — 'Stacked' had no match */ },
        { id: "editorialui-containers-eddisclosure--advancedoptions", spec: { page: "disclosure", label: "advanced options — secondary form fields" } /* TODO:pair — 'AdvancedOptions' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-containers-eddisclosure--default", spec: { page: "disclosure", label: "debug info — collapsed by default, mono dump" }, theme: 'dark' },
    ],

    /* --------------------------------------------- EdAccordion */
    // accordion.html spec states:
    //   • single-open — one section at a time
    //   • multi-open — independent sections
    EdAccordion: [
        { id: "editorialui-containers-edaccordion--singleopen", spec: { page: "accordion", label: "single-open — one section at a time" } /* TODO:pair — 'SingleOpen' had no match */ },
        { id: "editorialui-containers-edaccordion--multiopen", spec: { page: "accordion", label: "single-open — one section at a time" } /* TODO:pair — 'MultiOpen' had no match */ },
        { id: "editorialui-containers-edaccordion--withmeta", spec: { page: "accordion", label: "single-open — one section at a time" } /* TODO:pair — 'WithMeta' had no match */ },
        { id: "editorialui-containers-edaccordion--defaultexpanded", spec: { page: "accordion", label: "single-open — one section at a time" } /* TODO:pair — 'DefaultExpanded' had no match */ },
        { id: "editorialui-containers-edaccordion--withdisableditem", spec: { page: "accordion", label: "single-open — one section at a time" } /* TODO:pair — 'WithDisabledItem' had no match */ },
        { id: "editorialui-containers-edaccordion--nometa", spec: { page: "accordion", label: "single-open — one section at a time" } /* TODO:pair — 'NoMeta' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-containers-edaccordion--singleopen", spec: { page: "accordion", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],
};

// Max fraction of differing pixels (0–1) tolerated after cropping to common
// dimensions. 0.1 absorbs anti-aliasing without hiding a token/geometry change.
// Tighten toward 0.03 once a component is green.
export const DIFF_THRESHOLD = 0.1;

// A dimension delta larger than this (px, either axis) fails on its own —
// geometry drift (e.g. 38px vs 36px control) must fail loudly, not be cropped.
export const DIM_TOLERANCE_PX = 2;
