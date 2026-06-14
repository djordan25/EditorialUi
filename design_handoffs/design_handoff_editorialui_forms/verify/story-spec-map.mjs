// EditorialUI · visual verification — story → spec-state mapping  (Bundle: Forms)
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

    /* --------------------------------------------- EdTextField */
    // text-field.html spec states:
    //   • default
    //   • filled
    //   • hover
    //   • focus
    //   • error
    //   • disabled
    //   • readonly
    //   • with hint
    //   • prefix icon
    //   • suffix unit
    //   • suffix clear
    //   • sm — 28px
    //   • md — 36px (default)
    //   • lg — 44px
    //   • model ID
    //   • file path
    //   • timestamp
    EdTextField: [
        { id: "editorialui-inputs-edtextfield--default", spec: { page: "text-field", label: "default" } },
        { id: "editorialui-inputs-edtextfield--filled", spec: { page: "text-field", label: "filled" } },
        { id: "editorialui-inputs-edtextfield--withhint", spec: { page: "text-field", label: "default" } /* TODO:pair — 'WithHint' had no match */ },
        { id: "editorialui-inputs-edtextfield--required", spec: { page: "text-field", label: "default" } /* TODO:pair — 'Required' had no match */ },
        { id: "editorialui-inputs-edtextfield--error", spec: { page: "text-field", label: "error" } },
        { id: "editorialui-inputs-edtextfield--disabled", spec: { page: "text-field", label: "disabled" } },
        { id: "editorialui-inputs-edtextfield--readonly", spec: { page: "text-field", label: "readonly" } },
        { id: "editorialui-inputs-edtextfield--monovariant", spec: { page: "text-field", label: "default" } /* TODO:pair — 'MonoVariant' had no match */ },
        { id: "editorialui-inputs-edtextfield--sizes", spec: { page: "text-field", label: "default" } /* TODO:pair — 'Sizes' had no match */ },
        { id: "editorialui-inputs-edtextfield--withprefix", spec: { page: "text-field", label: "default" } /* TODO:pair — 'WithPrefix' had no match */ },
        { id: "editorialui-inputs-edtextfield--withsuffix", spec: { page: "text-field", label: "default" } /* TODO:pair — 'WithSuffix' had no match */ },
        { id: "editorialui-inputs-edtextfield--withclear", spec: { page: "text-field", label: "default" } /* TODO:pair — 'WithClear' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-inputs-edtextfield--default", spec: { page: "text-field", label: "default" }, theme: 'dark' },
    ],

    /* ----------------------------------------- EdPasswordInput */
    // password-input.html spec states:
    //   • default · masked
    //   • revealed
    //   • error
    //   • disabled
    //   • weak
    //   • fair
    //   • good
    //   • strong
    EdPasswordInput: [
        { id: "editorialui-inputs-edpasswordinput--default", spec: { page: "password-input", label: "default · masked" } },
        { id: "editorialui-inputs-edpasswordinput--revealable", spec: { page: "password-input", label: "default · masked" } /* TODO:pair — 'Revealable' had no match */ },
        { id: "editorialui-inputs-edpasswordinput--error", spec: { page: "password-input", label: "error" } },
        { id: "editorialui-inputs-edpasswordinput--disabled", spec: { page: "password-input", label: "disabled" } },
        { id: "editorialui-inputs-edpasswordinput--withstrengthmeterweak", spec: { page: "password-input", label: "weak" } },
        { id: "editorialui-inputs-edpasswordinput--withstrengthmeterfair", spec: { page: "password-input", label: "fair" } },
        { id: "editorialui-inputs-edpasswordinput--withstrengthmetergood", spec: { page: "password-input", label: "good" } },
        { id: "editorialui-inputs-edpasswordinput--withstrengthmeterstrong", spec: { page: "password-input", label: "strong" } },
        { id: "editorialui-inputs-edpasswordinput--changepasswordexample", spec: { page: "password-input", label: "default · masked" } /* TODO:pair — 'ChangePasswordExample' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-inputs-edpasswordinput--default", spec: { page: "password-input", label: "default · masked" }, theme: 'dark' },
    ],

    /* ---------------------------------------------- EdCheckbox */
    // checkbox.html spec states:
    //   • unchecked
    //   • hover
    //   • focus
    //   • checked
    //   • indeterminate
    //   • checked + focus
    //   • error
    //   • disabled
    EdCheckbox: [
        { id: "editorialui-inputs-edcheckbox--unchecked", spec: { page: "checkbox", label: "unchecked" } },
        { id: "editorialui-inputs-edcheckbox--checked", spec: { page: "checkbox", label: "checked" } },
        { id: "editorialui-inputs-edcheckbox--indeterminate", spec: { page: "checkbox", label: "indeterminate" } },
        { id: "editorialui-inputs-edcheckbox--withdescription", spec: { page: "checkbox", label: "unchecked" } /* TODO:pair — 'WithDescription' had no match */ },
        { id: "editorialui-inputs-edcheckbox--error", spec: { page: "checkbox", label: "error" } },
        { id: "editorialui-inputs-edcheckbox--disabled", spec: { page: "checkbox", label: "disabled" } },
        { id: "editorialui-inputs-edcheckbox--disabledchecked", spec: { page: "checkbox", label: "checked" } },
        { id: "editorialui-inputs-edcheckbox--groupvertical", spec: { page: "checkbox", label: "unchecked" } /* TODO:pair — 'GroupVertical' had no match */ },
        { id: "editorialui-inputs-edcheckbox--selectallinteractive", spec: { page: "checkbox", label: "unchecked" } /* TODO:pair — 'SelectAllInteractive' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-inputs-edcheckbox--unchecked", spec: { page: "checkbox", label: "unchecked" }, theme: 'dark' },
    ],

    /* -------------------------------------------- EdRadioGroup */
    // radio-group.html spec states:
    //   • unchecked
    //   • hover
    //   • focus
    //   • checked
    //   • checked + focus
    //   • disabled
    //   • vertical (default)
    //   • horizontal
    EdRadioGroup: [
        { id: "editorialui-inputs-edradiogroup--vertical", spec: { page: "radio-group", label: "vertical (default)" } },
        { id: "editorialui-inputs-edradiogroup--horizontal", spec: { page: "radio-group", label: "horizontal" } },
        { id: "editorialui-inputs-edradiogroup--withdescriptions", spec: { page: "radio-group", label: "unchecked" } /* TODO:pair — 'WithDescriptions' had no match */ },
        { id: "editorialui-inputs-edradiogroup--disabledsingle", spec: { page: "radio-group", label: "disabled" } },
        { id: "editorialui-inputs-edradiogroup--disabledall", spec: { page: "radio-group", label: "disabled" } },
        { id: "editorialui-inputs-edradiogroup--witherror", spec: { page: "radio-group", label: "unchecked" } /* TODO:pair — 'WithError' had no match */ },
        { id: "editorialui-inputs-edradiogroup--controlled", spec: { page: "radio-group", label: "unchecked" } /* TODO:pair — 'Controlled' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-inputs-edradiogroup--vertical", spec: { page: "radio-group", label: "vertical (default)" }, theme: 'dark' },
    ],

    /* ------------------------------------------------ EdSwitch */
    // switch.html spec states:
    //   • off
    //   • on
    //   • focus
    //   • disabled · off
    //   • disabled · on
    //   • loading (saving)
    EdSwitch: [
        { id: "editorialui-inputs-edswitch--off", spec: { page: "switch", label: "off" } },
        { id: "editorialui-inputs-edswitch--on", spec: { page: "switch", label: "on" } },
        { id: "editorialui-inputs-edswitch--disabledoff", spec: { page: "switch", label: "off" } },
        { id: "editorialui-inputs-edswitch--disabledon", spec: { page: "switch", label: "on" } },
        { id: "editorialui-inputs-edswitch--loading", spec: { page: "switch", label: "loading (saving)" } },
        { id: "editorialui-inputs-edswitch--withdescription", spec: { page: "switch", label: "on" } },
        { id: "editorialui-inputs-edswitch--insettingsrow", spec: { page: "switch", label: "off" } /* TODO:pair — 'InSettingsRow' had no match */ },
        { id: "editorialui-inputs-edswitch--optimisticsaveexample", spec: { page: "switch", label: "off" } /* TODO:pair — 'OptimisticSaveExample' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-inputs-edswitch--off", spec: { page: "switch", label: "off" }, theme: 'dark' },
    ],

    /* -------------------------------------- EdFormControlLabel */
    // form-control-label.html spec states:
    //   • EdSelect (placeholder)
    //   • Switch row
    //   • Custom — segmented
    EdFormControlLabel: [
        { id: "editorialui-inputs-edformcontrollabel--withtextfield", spec: { page: "form-control-label", label: "EdSelect (placeholder)" } /* TODO:pair — 'WithTextField' had no match */ },
        { id: "editorialui-inputs-edformcontrollabel--withselect", spec: { page: "form-control-label", label: "EdSelect (placeholder)" } /* TODO:pair — 'WithSelect' had no match */ },
        { id: "editorialui-inputs-edformcontrollabel--withswitchrow", spec: { page: "form-control-label", label: "EdSelect (placeholder)" } /* TODO:pair — 'WithSwitchRow' had no match */ },
        { id: "editorialui-inputs-edformcontrollabel--withcustomcontrol", spec: { page: "form-control-label", label: "EdSelect (placeholder)" } /* TODO:pair — 'WithCustomControl' had no match */ },
        { id: "editorialui-inputs-edformcontrollabel--required", spec: { page: "form-control-label", label: "EdSelect (placeholder)" } /* TODO:pair — 'Required' had no match */ },
        { id: "editorialui-inputs-edformcontrollabel--error", spec: { page: "form-control-label", label: "EdSelect (placeholder)" } /* TODO:pair — 'Error' had no match */ },
        { id: "editorialui-inputs-edformcontrollabel--hintanderror", spec: { page: "form-control-label", label: "EdSelect (placeholder)" } /* TODO:pair — 'HintAndError' had no match */ },
        // dark-mode spot check (first story)
        { id: "editorialui-inputs-edformcontrollabel--withtextfield", spec: { page: "form-control-label", selector: '.ed-cell__demo' }, theme: 'dark' },
    ],
};

// Max fraction of differing pixels (0–1) tolerated after cropping to common
// dimensions. 0.1 absorbs anti-aliasing without hiding a token/geometry change.
// Tighten toward 0.03 once a component is green.
export const DIFF_THRESHOLD = 0.1;

// A dimension delta larger than this (px, either axis) fails on its own —
// geometry drift (e.g. 38px vs 36px control) must fail loudly, not be cropped.
export const DIM_TOLERANCE_PX = 2;
