// EditorialUI · visual verification — story → spec-state mapping
//
// This is the heart of the harness: it ties each Storybook story (a component
// state) to the matching state in the design spec HTML, so the runner can diff
// the two renderings.
//
// THE ORACLE is the spec HTML in design_system_v2/components/*.html — NOT the
// PNG screenshots in ../screenshots (those are 0.7x letterboxed orientation
// shots, useless for pixel diffing). The spec pages render every state at 1:1
// using the same tokens.css the components compile against.
//
// HOW MATCHING WORKS
//   - story:   a Storybook story id, e.g. "editorialui-inputs-edbutton--primary".
//              The runner screenshots the story's root element in isolation.
//   - spec:    locates the matching state in the spec HTML. Two ways:
//                { page, label }    → find the .ed-cell whose .ed-cell__label
//                                     text === label, screenshot its .ed-cell__demo
//                { page, selector } → screenshot the first element matching this
//                                     CSS selector (use for anatomy/twin blocks)
//   - interaction (optional): a real pseudo-state Playwright drives on the STORY
//              before capture — 'hover' | 'focus' | 'active'. The spec side is
//              always static (the spec author drew the hover/focus cell by hand),
//              so interaction only applies to the Storybook capture.
//   - theme:   'light' (default) or 'dark'. Dark sets [data-theme="dark"] on
//              both the story iframe and the spec page before capture.
//
// FIRST RUN: confirm the spec labels are right with
//     node verify/visual-verify.mjs --list-spec button
//   which prints every .ed-cell__label found in button.html. Fix any mismatches
//   here, then run the real diff. Labels below are best-guess from the spec and
//   MUST be reconciled against that list before trusting a green run.

/** @typedef {{ id: string, spec: ({page:string,label:string}|{page:string,selector:string}), interaction?: 'hover'|'focus'|'active', theme?: 'light'|'dark', note?: string }} VerifyCase */

/** @type {Record<string, VerifyCase[]>} */
export const CASES = {
    /* ---------------------------------------------------------------- EdIcon */
    EdIcon: [
        { id: 'editorialui-display-edicon--sizes', spec: { page: 'icon', label: 'sizes' } },
        { id: 'editorialui-display-edicon--colors', spec: { page: 'icon', label: 'semantic colors' } },
    ],

    /* -------------------------------------------------------------- EdButton */
    EdButton: [
        // Variants — each story's example text matches its spec cell text 1:1.
        { id: 'editorialui-inputs-edbutton--primary',   spec: { page: 'button', label: 'primary' } },
        { id: 'editorialui-inputs-edbutton--secondary', spec: { page: 'button', label: 'secondary' } },
        { id: 'editorialui-inputs-edbutton--ghost',     spec: { page: 'button', label: 'ghost' } },
        { id: 'editorialui-inputs-edbutton--danger',    spec: { page: 'button', label: 'danger' } },
        { id: 'editorialui-inputs-edbutton--link',      spec: { page: 'button', label: 'link' } },
        // Dark-mode spot check on the primary variant (same "Save changes" text).
        { id: 'editorialui-inputs-edbutton--primary', spec: { page: 'button', label: 'primary' }, theme: 'dark' },
        // NOTE: the spec's hover/active/focus/loading/disabled cells render a
        // different example ("Run validation"), and the size cells / Sizes story are
        // composite — none have a content-matched 1:1 story to diff, so they're left
        // unmapped rather than mismatched.
    ],

    /* ---------------------------------------------------------- EdIconButton */
    EdIconButton: [
        { id: 'editorialui-inputs-ediconbutton--default',  spec: { page: 'icon-button', label: 'default' } },
        { id: 'editorialui-inputs-ediconbutton--bordered', spec: { page: 'icon-button', label: 'bordered' } },
        { id: 'editorialui-inputs-ediconbutton--filled',   spec: { page: 'icon-button', label: 'filled' } },
        { id: 'editorialui-inputs-ediconbutton--default',  spec: { page: 'icon-button', label: 'hover' },   interaction: 'hover' },
        { id: 'editorialui-inputs-ediconbutton--default',  spec: { page: 'icon-button', label: 'focus' },   interaction: 'focus' },
        { id: 'editorialui-inputs-ediconbutton--pressed',  spec: { page: 'icon-button', label: 'pressed' } },
        { id: 'editorialui-inputs-ediconbutton--disabled', spec: { page: 'icon-button', label: 'disabled' } },
    ],
};

// Per-component pass threshold: max fraction of differing pixels (0–1) tolerated
// after cropping to common dimensions. 0.1 absorbs anti-aliasing / font hinting
// without hiding a token or geometry change. Tighten toward 0.03 once green.
export const DIFF_THRESHOLD = 0.1;

// A dimension delta larger than this (px, either axis) is treated as a geometry
// failure on its own — a 38px-tall button vs a 36px spec button must fail loudly
// rather than being cropped away.
export const DIM_TOLERANCE_PX = 2;
