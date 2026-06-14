// EditorialUI · visual verification — story → spec-state mapping  (Bundle: Display)
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

    /* --------------------------------------------------- EdTag */
    // tag.html spec states:
    //   • neutral (default)
    //   • brand
    //   • success
    //   • warning
    //   • danger
    //   • neutral surface
    //   • metadata on entity row
    //   • filter token in input
    EdTag: [
        { id: "editorialui-display-edtag--tones", spec: { page: "tag", label: "neutral (default)" } /* TODO:pair — 'Tones' had no match */ },
        { id: "editorialui-display-edtag--closable", spec: { page: "tag", label: "neutral (default)" } /* TODO:pair — 'Closable' had no match */ },
        { id: "editorialui-display-edtag--withicon", spec: { page: "tag", label: "neutral (default)" } /* TODO:pair — 'WithIcon' had no match */ },
        { id: "editorialui-display-edtag--inmetadata", spec: { page: "tag", label: "neutral (default)" } /* TODO:pair — 'InMetadata' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-display-edtag--tones", spec: { page: "tag", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],

    /* ------------------------------------------- EdStatusBadge */
    // status-badge.html spec states:
    //   • soft (default — table cells, descriptions)
    //   • solid (high emphasis — escalations, headers)
    //   • outline (read-only, archival, secondary metadata)
    //   • finding lifecycle
    //   • severity — escalating
    //   • table cell — paired with text
    EdStatusBadge: [
        { id: "editorialui-feedback-edstatusbadge--allsoft", spec: { page: "status-badge", label: "soft (default — table cells, descriptions)" } /* TODO:pair — 'AllSoft' had no match */ },
        { id: "editorialui-feedback-edstatusbadge--allsolid", spec: { page: "status-badge", label: "soft (default — table cells, descriptions)" } /* TODO:pair — 'AllSolid' had no match */ },
        { id: "editorialui-feedback-edstatusbadge--alloutline", spec: { page: "status-badge", label: "soft (default — table cells, descriptions)" } /* TODO:pair — 'AllOutline' had no match */ },
        { id: "editorialui-feedback-edstatusbadge--findinglifecycle", spec: { page: "status-badge", label: "soft (default — table cells, descriptions)" } /* TODO:pair — 'FindingLifecycle' had no match */ },
        { id: "editorialui-feedback-edstatusbadge--severity", spec: { page: "status-badge", label: "severity — escalating" } },
        { id: "editorialui-feedback-edstatusbadge--withdot", spec: { page: "status-badge", label: "soft (default — table cells, descriptions)" } /* TODO:pair — 'WithDot' had no match */ },
        { id: "editorialui-feedback-edstatusbadge--intable", spec: { page: "status-badge", label: "soft (default — table cells, descriptions)" } /* TODO:pair — 'InTable' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-feedback-edstatusbadge--allsoft", spec: { page: "status-badge", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],

    /* -------------------------------------------------- EdChip */
    // chip.html spec states:
    //   • unselected
    //   • selected
    //   • input (form context)
    //   • with leading dot (status)
    //   • with leading icon
    //   • disabled
    EdChip: [
        { id: "editorialui-display-edchip--unselected", spec: { page: "chip", label: "unselected" } },
        { id: "editorialui-display-edchip--selected", spec: { page: "chip", label: "selected" } },
        { id: "editorialui-display-edchip--disabled", spec: { page: "chip", label: "disabled" } },
        { id: "editorialui-display-edchip--withcount", spec: { page: "chip", label: "unselected" } /* TODO:pair — 'WithCount' had no match */ },
        { id: "editorialui-display-edchip--withdot", spec: { page: "chip", label: "unselected" } /* TODO:pair — 'WithDot' had no match */ },
        { id: "editorialui-display-edchip--withicon", spec: { page: "chip", label: "unselected" } /* TODO:pair — 'WithIcon' had no match */ },
        { id: "editorialui-display-edchip--input", spec: { page: "chip", label: "input (form context)" } },
        { id: "editorialui-display-edchip--ascheckboxgroup", spec: { page: "chip", label: "unselected" } /* TODO:pair — 'AsCheckboxGroup' had no match */ },
        { id: "editorialui-display-edchip--asradiogroup", spec: { page: "chip", label: "unselected" } /* TODO:pair — 'AsRadioGroup' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-display-edchip--unselected", spec: { page: "chip", label: "unselected" }, theme: 'dark' },
    ],

    /* ----------------------------------------------- EdDivider */
    // divider.html spec states:
    //   • horizontal — default
    //   • horizontal — strong
    //   • horizontal — dashed
    //   • vertical — inline separator
    //   • labeled
    //   • in menu
    EdDivider: [
        { id: "editorialui-display-eddivider--horizontal", spec: { page: "divider", label: "horizontal — default" } },
        { id: "editorialui-display-eddivider--strong", spec: { page: "divider", label: "horizontal — strong" } },
        { id: "editorialui-display-eddivider--dashed", spec: { page: "divider", label: "horizontal — dashed" } },
        { id: "editorialui-display-eddivider--vertical", spec: { page: "divider", label: "vertical — inline separator" } },
        { id: "editorialui-display-eddivider--labeled", spec: { page: "divider", label: "labeled" } },
        { id: "editorialui-display-eddivider--inmetadatastrip", spec: { page: "divider", label: "horizontal — default" } /* TODO:pair — 'InMetadataStrip' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-display-eddivider--horizontal", spec: { page: "divider", label: "horizontal — default" }, theme: 'dark' },
    ],

    /* ----------------------------------------- EdProgressMeter */
    // progress-meter.html spec states:
    //   • determinate
    //   • indeterminate
    //   • complete
    //   • over threshold (warning)
    //   • over threshold (danger)
    //   • paused
    //   • closure pipeline — 4 stages
    //   • password strength — 4 bands
    //   • file upload — multi-file batch
    EdProgressMeter: [
        { id: "editorialui-feedback-edprogressmeter--determinate", spec: { page: "progress-meter", label: "determinate" } },
        { id: "editorialui-feedback-edprogressmeter--indeterminate", spec: { page: "progress-meter", label: "indeterminate" } },
        { id: "editorialui-feedback-edprogressmeter--complete", spec: { page: "progress-meter", label: "complete" } },
        { id: "editorialui-feedback-edprogressmeter--thresholdwarning", spec: { page: "progress-meter", label: "determinate" } /* TODO:pair — 'ThresholdWarning' had no match */ },
        { id: "editorialui-feedback-edprogressmeter--thresholddanger", spec: { page: "progress-meter", label: "determinate" } /* TODO:pair — 'ThresholdDanger' had no match */ },
        { id: "editorialui-feedback-edprogressmeter--paused", spec: { page: "progress-meter", label: "paused" } },
        { id: "editorialui-feedback-edprogressmeter--largewithlongvalue", spec: { page: "progress-meter", label: "determinate" } /* TODO:pair — 'LargeWithLongValue' had no match */ },
        { id: "editorialui-feedback-edprogressmeter--animated", spec: { page: "progress-meter", label: "determinate" } /* TODO:pair — 'Animated' had no match */ },
        { id: "editorialui-feedback-edprogressmeter--multifilebatch", spec: { page: "progress-meter", label: "determinate" } /* TODO:pair — 'MultiFileBatch' had no match */ },
        { id: "editorialui-feedback-edprogressmeter--segmentedclosure", spec: { page: "progress-meter", label: "determinate" } /* TODO:pair — 'SegmentedClosure' had no match */ },
        { id: "editorialui-feedback-edprogressmeter--segmentedstrength", spec: { page: "progress-meter", label: "determinate" } /* TODO:pair — 'SegmentedStrength' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-feedback-edprogressmeter--determinate", spec: { page: "progress-meter", label: "determinate" }, theme: 'dark' },
    ],

    /* -------------------------------------- EdCircularProgress */
    // circular-progress.html spec states:
    //   • sm — 14px (inline)
    //   • md — 20px (default)
    //   • lg — 32px (page-level)
    //   • in button (loading)
    //   • in row (cell load)
    //   • page-level — center of empty area
    //   • determinate — closure progress
    EdCircularProgress: [
        { id: "editorialui-feedback-edcircularprogress--indeterminatesm", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'IndeterminateSm' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--indeterminatemd", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'IndeterminateMd' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--indeterminatelg", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'IndeterminateLg' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--indeterminatesizes", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'IndeterminateSizes' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--determinate0", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'Determinate0' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--determinate25", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'Determinate25' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--determinate50", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'Determinate50' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--determinate75", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'Determinate75' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--determinate100", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'Determinate100' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--determinatesemantic", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'DeterminateSemantic' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--inbutton", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'InButton' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--inrow", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'InRow' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--pagelevel", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'PageLevel' had no match */ },
        { id: "editorialui-feedback-edcircularprogress--animated", spec: { page: "circular-progress", label: "sm — 14px (inline)" } /* TODO:pair — 'Animated' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-feedback-edcircularprogress--indeterminatesm", spec: { page: "circular-progress", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],
};

// Max fraction of differing pixels (0–1) tolerated after cropping to common
// dimensions. 0.1 absorbs anti-aliasing without hiding a token/geometry change.
// Tighten toward 0.03 once a component is green.
export const DIFF_THRESHOLD = 0.1;

// A dimension delta larger than this (px, either axis) fails on its own —
// geometry drift (e.g. 38px vs 36px control) must fail loudly, not be cropped.
export const DIM_TOLERANCE_PX = 2;
