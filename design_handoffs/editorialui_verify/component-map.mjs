export const DEFAULT_ANCHOR = {"story":":scope > *","spec":":scope > *"};

export const STYLE_CONTRACT = [
    "height",
    "min-height",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "border-top-width",
    "border-style",
    "border-color",
    "border-top-left-radius",
    "border-bottom-right-radius",
    "background-color",
    "color",
    "font-family",
    "font-size",
    "font-weight",
    "line-height",
    "letter-spacing",
    "box-shadow",
    "opacity"
];

export const PIXEL_ADVISORY_THRESHOLD = 0.1;
export const ALIGN_TOLERANCE_PX = 1;
export const DIM_TOLERANCE_PX = 2;

export const CONTENT_DRIVEN = new Set([
    "EdEmptyState",
    "EdList",
    "EdCard",
    "EdNativeTable",
    "EdDataTable",
    "EdDrawer",
    "EdModal",
    "EdNotification",
    "EdAccordion",
    "EdDisclosure",
    "EdDialog"
]);

export const CASES = {
    "EdButton": [
        {
            "id": "editorialui-inputs-edbutton--primary",
            "spec": {
                "page": "button",
                "label": "primary"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-btn"
            }
        },
        {
            "id": "editorialui-inputs-edbutton--secondary",
            "spec": {
                "page": "button",
                "label": "secondary"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-btn"
            }
        },
        {
            "id": "editorialui-inputs-edbutton--ghost",
            "spec": {
                "page": "button",
                "label": "ghost"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-btn"
            }
        },
        {
            "id": "editorialui-inputs-edbutton--danger",
            "spec": {
                "page": "button",
                "label": "danger"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-btn"
            }
        },
        {
            "id": "editorialui-inputs-edbutton--link",
            "spec": {
                "page": "button",
                "label": "link"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-btn"
            }
        },
        {
            "id": "editorialui-inputs-edbutton--primary",
            "spec": {
                "page": "button",
                "label": "hover"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-btn"
            },
            "interaction": "hover"
        },
        {
            "id": "editorialui-inputs-edbutton--primary",
            "spec": {
                "page": "button",
                "label": "focus"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-btn"
            },
            "interaction": "focus"
        },
        {
            "id": "editorialui-inputs-edbutton--primary",
            "spec": {
                "page": "button",
                "label": "active / pressed"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-btn"
            },
            "interaction": "active"
        },
        {
            "id": "editorialui-inputs-edbutton--loading",
            "spec": {
                "page": "button",
                "label": "loading"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-btn"
            }
        },
        {
            "id": "editorialui-inputs-edbutton--disabled",
            "spec": {
                "page": "button",
                "label": "disabled"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-btn"
            }
        },
        {
            "id": "editorialui-inputs-edbutton--primary",
            "spec": {
                "page": "button",
                "label": "primary"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-btn"
            },
            "theme": "dark"
        }
    ],
    "EdIconButton": [
        {
            "id": "editorialui-inputs-ediconbutton--default",
            "spec": {
                "page": "icon-button",
                "label": "default"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-icon-btn"
            }
        },
        {
            "id": "editorialui-inputs-ediconbutton--bordered",
            "spec": {
                "page": "icon-button",
                "label": "bordered"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-icon-btn"
            }
        },
        {
            "id": "editorialui-inputs-ediconbutton--filled",
            "spec": {
                "page": "icon-button",
                "label": "filled"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-icon-btn"
            }
        },
        {
            "id": "editorialui-inputs-ediconbutton--default",
            "spec": {
                "page": "icon-button",
                "label": "hover"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-icon-btn"
            },
            "interaction": "hover"
        },
        {
            "id": "editorialui-inputs-ediconbutton--default",
            "spec": {
                "page": "icon-button",
                "label": "focus"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-icon-btn"
            },
            "interaction": "focus"
        },
        {
            "id": "editorialui-inputs-ediconbutton--disabled",
            "spec": {
                "page": "icon-button",
                "label": "disabled"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-icon-btn"
            }
        }
    ],
    "EdTextField": [
        {
            "id": "editorialui-inputs-edtextfield--default",
            "spec": {
                "page": "text-field",
                "label": "default"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edtextfield--filled",
            "spec": {
                "page": "text-field",
                "label": "filled"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edtextfield--with-hint",
            "spec": {
                "page": "text-field",
                "label": "with hint"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edtextfield--error",
            "spec": {
                "page": "text-field",
                "label": "error"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edtextfield--disabled",
            "spec": {
                "page": "text-field",
                "label": "disabled"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edtextfield--readonly",
            "spec": {
                "page": "text-field",
                "label": "readonly"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edtextfield--mono-variant",
            "spec": {
                "page": "text-field",
                "label": "model ID"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edtextfield--with-prefix",
            "spec": {
                "page": "text-field",
                "label": "prefix icon"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edtextfield--with-suffix",
            "spec": {
                "page": "text-field",
                "label": "suffix unit"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edtextfield--with-clear",
            "spec": {
                "page": "text-field",
                "label": "suffix clear"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edtextfield--default",
            "spec": {
                "page": "text-field",
                "label": "default"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            },
            "theme": "dark"
        }
    ],
    "EdDialog": [
        {
            "id": "editorialui-containers-eddialog--verify-open",
            "spec": {
                "page": "dialog",
                "label": "md — 520 — default"
            },
            "anchor": {
                "story": "[role=\"dialog\"]",
                "spec": ".ed-dialog"
            },
            "contentDriven": true
        }
    ],
    "EdModal": [
        {
            "id": "editorialui-containers-edmodal--verify-open",
            "spec": {
                "page": "modal",
                "label": "form — single-column, labels above inputs"
            },
            "anchor": {
                "story": "[role=\"dialog\"]",
                "spec": ".ed-dialog"
            },
            "contentDriven": true
        }
    ],
    "EdDrawer": [
        {
            "id": "editorialui-containers-eddrawer--verify-open",
            "spec": {
                "page": "side-panel",
                "label": "modal — focused edit, blocks page"
            },
            "anchor": {
                "story": "[role=\"dialog\"]",
                "spec": ".ed-drawer"
            },
            "contentDriven": true
        }
    ],
    "EdTooltip": [
        {
            "id": "editorialui-feedback-edtooltip--verify-open",
            "spec": {
                "page": "tooltip",
                "label": "show keyboard shortcut"
            },
            "anchor": {
                "story": "[data-ed-tooltip-content]",
                "spec": ".ed-tooltip"
            },
            "contentDriven": true
        }
    ],
    "EdMenu": [
        {
            "id": "editorialui-navigation-edmenu--verify-open",
            "spec": {
                "page": "menu",
                "label": "with icons"
            },
            "anchor": {
                "story": "[role=\"menu\"]",
                "spec": ".ed-menu"
            },
            "contentDriven": true
        }
    ],
    "EdPasswordInput": [
        {
            "id": "editorialui-inputs-edpasswordinput--default",
            "spec": {
                "page": "password-input",
                "label": "default · masked"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edpasswordinput--default",
            "spec": {
                "page": "password-input",
                "label": "default · masked"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-inputs-edpasswordinput--error",
            "spec": {
                "page": "password-input",
                "label": "error"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edpasswordinput--disabled",
            "spec": {
                "page": "password-input",
                "label": "disabled"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edpasswordinput--with-strength-meter-weak",
            "spec": {
                "page": "password-input",
                "label": "weak"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edpasswordinput--with-strength-meter-fair",
            "spec": {
                "page": "password-input",
                "label": "fair"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edpasswordinput--with-strength-meter-good",
            "spec": {
                "page": "password-input",
                "label": "good"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edpasswordinput--with-strength-meter-strong",
            "spec": {
                "page": "password-input",
                "label": "strong"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-field__control"
            }
        }
    ],
    "EdCheckbox": [
        {
            "id": "editorialui-inputs-edcheckbox--unchecked",
            "spec": {
                "page": "checkbox",
                "label": "unchecked"
            },
            "anchor": {
                "story": "[role=checkbox]",
                "spec": ".ed-checkbox__box"
            }
        },
        {
            "id": "editorialui-inputs-edcheckbox--unchecked",
            "spec": {
                "page": "checkbox",
                "label": "unchecked"
            },
            "anchor": {
                "story": "[role=checkbox]",
                "spec": ".ed-checkbox__box"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-inputs-edcheckbox--checked",
            "spec": {
                "page": "checkbox",
                "label": "checked"
            },
            "anchor": {
                "story": "[role=checkbox]",
                "spec": ".ed-checkbox__box"
            }
        },
        {
            "id": "editorialui-inputs-edcheckbox--indeterminate",
            "spec": {
                "page": "checkbox",
                "label": "indeterminate"
            },
            "anchor": {
                "story": "[role=checkbox]",
                "spec": ".ed-checkbox__box"
            }
        },
        {
            "id": "editorialui-inputs-edcheckbox--error",
            "spec": {
                "page": "checkbox",
                "label": "error"
            },
            "anchor": {
                "story": "[role=checkbox]",
                "spec": ".ed-checkbox__box"
            }
        },
        {
            "id": "editorialui-inputs-edcheckbox--disabled",
            "spec": {
                "page": "checkbox",
                "label": "disabled"
            },
            "anchor": {
                "story": "[role=checkbox]",
                "spec": ".ed-checkbox__box"
            }
        }
    ],
    "EdRadioGroup": [
        {
            "id": "editorialui-inputs-edradiogroup--vertical",
            "spec": {
                "page": "radio-group",
                "label": "vertical (default)"
            },
            "anchor": {
                "story": "[role=radio][data-state=checked]",
                "spec": ".ed-radio__dot--checked"
            }
        },
        {
            "id": "editorialui-inputs-edradiogroup--horizontal",
            "spec": {
                "page": "radio-group",
                "label": "horizontal"
            },
            "anchor": {
                "story": "[role=radio][data-state=checked]",
                "spec": ".ed-radio__dot--checked"
            }
        },
        {
            "id": "editorialui-inputs-edradiogroup--vertical",
            "spec": {
                "page": "radio-group",
                "label": "vertical (default)"
            },
            "anchor": {
                "story": "[role=radio][data-state=checked]",
                "spec": ".ed-radio__dot--checked"
            },
            "theme": "dark"
        }
    ],
    "EdSwitch": [
        {
            "id": "editorialui-inputs-edswitch--off",
            "spec": {
                "page": "switch",
                "label": "off"
            },
            "anchor": {
                "story": "[role=switch]",
                "spec": ".ed-switch__track"
            },
            "checkWidth": true
        },
        {
            "id": "editorialui-inputs-edswitch--off",
            "spec": {
                "page": "switch",
                "label": "off"
            },
            "anchor": {
                "story": "[role=switch]",
                "spec": ".ed-switch__track"
            },
            "theme": "dark",
            "checkWidth": true
        },
        {
            "id": "editorialui-inputs-edswitch--on",
            "spec": {
                "page": "switch",
                "label": "on"
            },
            "anchor": {
                "story": "[role=switch]",
                "spec": ".ed-switch__track"
            },
            "checkWidth": true
        },
        {
            "id": "editorialui-inputs-edswitch--disabled-off",
            "spec": {
                "page": "switch",
                "label": "disabled · off"
            },
            "anchor": {
                "story": "[role=switch]",
                "spec": ".ed-switch__track"
            },
            "checkWidth": true
        },
        {
            "id": "editorialui-inputs-edswitch--disabled-on",
            "spec": {
                "page": "switch",
                "label": "disabled · on"
            },
            "anchor": {
                "story": "[role=switch]",
                "spec": ".ed-switch__track"
            },
            "checkWidth": true
        },
        {
            "id": "editorialui-inputs-edswitch--loading",
            "spec": {
                "page": "switch",
                "label": "loading (saving)"
            },
            "anchor": {
                "story": "[role=switch]",
                "spec": ".ed-switch__track"
            },
            "checkWidth": true
        }
    ],
    "EdFormControlLabel": [
        {
            "id": "editorialui-inputs-edformcontrollabel--with-select",
            "spec": {
                "page": "form-control-label",
                "label": "EdSelect (placeholder)"
            },
            "anchor": {
                "story": "select",
                "spec": ".ed-field__control"
            }
        },
        {
            "id": "editorialui-inputs-edformcontrollabel--with-select",
            "spec": {
                "page": "form-control-label",
                "label": "EdSelect (placeholder)"
            },
            "anchor": {
                "story": "select",
                "spec": ".ed-field__control"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-inputs-edformcontrollabel--with-switch-row",
            "spec": {
                "page": "form-control-label",
                "label": "Switch row"
            },
            "anchor": {
                "story": "[role=switch]",
                "spec": ".ed-switch__track"
            }
        },
        {
            "id": "editorialui-inputs-edformcontrollabel--with-custom-control",
            "spec": {
                "page": "form-control-label",
                "label": "Custom — segmented"
            },
            "anchor": {
                "story": "[role=group]",
                "spec": "div:has(> .ed-btn)"
            }
        }
    ],
    "EdSelect": [
        {
            "id": "editorialui-selection-edselect--default",
            "spec": {
                "page": "select",
                "label": "default"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-select__trigger"
            }
        },
        {
            "id": "editorialui-selection-edselect--default",
            "spec": {
                "page": "select",
                "label": "default"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-select__trigger"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-selection-edselect--filled",
            "spec": {
                "page": "select",
                "label": "filled"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-select__trigger"
            }
        },
        {
            "id": "editorialui-selection-edselect--error",
            "spec": {
                "page": "select",
                "label": "error"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-select__trigger"
            }
        },
        {
            "id": "editorialui-selection-edselect--disabled",
            "spec": {
                "page": "select",
                "label": "disabled"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-select__trigger"
            }
        }
    ],
    "EdComboBox": [
        {
            "id": "editorialui-selection-edcombobox--default",
            "spec": {
                "page": "combobox",
                "label": "empty"
            },
            "anchor": {
                "story": "[role=combobox]",
                "spec": ".ed-select__trigger"
            }
        },
        {
            "id": "editorialui-selection-edcombobox--error",
            "spec": {
                "page": "combobox",
                "label": "error"
            },
            "anchor": {
                "story": "[role=combobox]",
                "spec": ".ed-select__trigger"
            }
        },
        {
            "id": "editorialui-selection-edcombobox--default",
            "spec": {
                "page": "combobox",
                "label": "empty"
            },
            "anchor": {
                "story": "[role=combobox]",
                "spec": ".ed-select__trigger"
            },
            "theme": "dark"
        }
    ],
    "EdAutocomplete": [
        {
            "id": "editorialui-selection-edautocomplete--find-or-create",
            "spec": {
                "page": "autocomplete",
                "label": "find or create — finding title"
            },
            "anchor": {
                "story": "div:has(> input[role=combobox])",
                "spec": ".ed-input"
            }
        },
        {
            "id": "editorialui-selection-edautocomplete--find-or-create",
            "spec": {
                "page": "autocomplete",
                "label": "find or create — finding title"
            },
            "anchor": {
                "story": "div:has(> input[role=combobox])",
                "spec": ".ed-input"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-selection-edautocomplete--cell-edit",
            "spec": {
                "page": "autocomplete",
                "label": "cell — type-or-pick value"
            },
            "anchor": {
                "story": "div:has(> input[role=combobox])",
                "spec": ".ed-input"
            }
        }
    ],
    "EdTag": [
        {
            "id": "editorialui-display-edtag--in-metadata",
            "spec": {
                "page": "tag",
                "label": "metadata on entity row"
            },
            "anchor": {
                "story": ":scope > div > span",
                "spec": ".ed-tag"
            }
        },
        {
            "id": "editorialui-display-edtag--in-metadata",
            "spec": {
                "page": "tag",
                "label": "metadata on entity row"
            },
            "anchor": {
                "story": ":scope > div > span",
                "spec": ".ed-tag"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-display-edtag--closable",
            "spec": {
                "page": "tag",
                "label": "filter token in input"
            },
            "anchor": {
                "story": ":scope > div > span",
                "spec": ".ed-tag"
            }
        }
    ],
    "EdStatusBadge": [
        {
            "id": "editorialui-feedback-edstatusbadge--finding-lifecycle",
            "spec": {
                "page": "status-badge",
                "label": "finding lifecycle"
            },
            "anchor": {
                "story": "td span:has(> span)",
                "spec": ".ed-badge"
            }
        },
        {
            "id": "editorialui-feedback-edstatusbadge--severity",
            "spec": {
                "page": "status-badge",
                "label": "severity — escalating"
            },
            "anchor": {
                "story": "span:has(> span)",
                "spec": ".ed-badge"
            }
        },
        {
            "id": "editorialui-feedback-edstatusbadge--in-table",
            "spec": {
                "page": "status-badge",
                "label": "table cell — paired with text"
            },
            "anchor": {
                "story": "td span:has(> span)",
                "spec": ".ed-badge"
            }
        },
        {
            "id": "editorialui-feedback-edstatusbadge--finding-lifecycle",
            "spec": {
                "page": "status-badge",
                "label": "finding lifecycle"
            },
            "anchor": {
                "story": "td span:has(> span)",
                "spec": ".ed-badge"
            },
            "theme": "dark"
        }
    ],
    "EdChip": [
        {
            "id": "editorialui-display-edchip--unselected",
            "spec": {
                "page": "chip",
                "label": "unselected"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            }
        },
        {
            "id": "editorialui-display-edchip--unselected",
            "spec": {
                "page": "chip",
                "label": "unselected"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-display-edchip--selected",
            "spec": {
                "page": "chip",
                "label": "selected"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            }
        },
        {
            "id": "editorialui-display-edchip--disabled",
            "spec": {
                "page": "chip",
                "label": "disabled"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            }
        },
        {
            "id": "editorialui-display-edchip--with-dot",
            "spec": {
                "page": "chip",
                "label": "with leading dot (status)"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            }
        },
        {
            "id": "editorialui-display-edchip--with-icon",
            "spec": {
                "page": "chip",
                "label": "with leading icon"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            }
        },
        {
            "id": "editorialui-display-edchip--input",
            "spec": {
                "page": "chip",
                "label": "input (form context)"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            }
        }
    ],
    "EdDivider": [
        {
            "id": "editorialui-display-eddivider--horizontal",
            "spec": {
                "page": "divider",
                "label": "horizontal — default"
            },
            "anchor": {
                "story": "hr",
                "spec": ".ed-divider--h"
            }
        },
        {
            "id": "editorialui-display-eddivider--horizontal",
            "spec": {
                "page": "divider",
                "label": "horizontal — default"
            },
            "anchor": {
                "story": "hr",
                "spec": ".ed-divider--h"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-display-eddivider--strong",
            "spec": {
                "page": "divider",
                "label": "horizontal — strong"
            },
            "anchor": {
                "story": "hr",
                "spec": ".ed-divider--strong"
            }
        },
        {
            "id": "editorialui-display-eddivider--dashed",
            "spec": {
                "page": "divider",
                "label": "horizontal — dashed"
            },
            "anchor": {
                "story": "hr",
                "spec": ".ed-divider--dashed"
            }
        },
        {
            "id": "editorialui-display-eddivider--vertical",
            "spec": {
                "page": "divider",
                "label": "vertical — inline separator"
            },
            "anchor": {
                "story": "div:has(> span) > div:empty",
                "spec": ".ed-divider--v"
            }
        },
        {
            "id": "editorialui-display-eddivider--labeled",
            "spec": {
                "page": "divider",
                "label": "labeled"
            },
            "anchor": {
                "story": "div[role=separator]:has(> span)",
                "spec": ".ed-divider--labeled"
            }
        }
    ],
    "EdProgressMeter": [
        {
            "id": "editorialui-feedback-edprogressmeter--determinate",
            "spec": {
                "page": "progress-meter",
                "label": "determinate"
            },
            "anchor": {
                "story": "[role=progressbar]",
                "spec": ".ed-meter"
            }
        },
        {
            "id": "editorialui-feedback-edprogressmeter--determinate",
            "spec": {
                "page": "progress-meter",
                "label": "determinate"
            },
            "anchor": {
                "story": "[role=progressbar]",
                "spec": ".ed-meter"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-feedback-edprogressmeter--indeterminate",
            "spec": {
                "page": "progress-meter",
                "label": "indeterminate"
            },
            "anchor": {
                "story": "[role=progressbar]",
                "spec": ".ed-meter"
            }
        },
        {
            "id": "editorialui-feedback-edprogressmeter--complete",
            "spec": {
                "page": "progress-meter",
                "label": "complete"
            },
            "anchor": {
                "story": "[role=progressbar]",
                "spec": ".ed-meter"
            }
        },
        {
            "id": "editorialui-feedback-edprogressmeter--threshold-warning",
            "spec": {
                "page": "progress-meter",
                "label": "over threshold (warning)"
            },
            "anchor": {
                "story": "[role=progressbar]",
                "spec": ".ed-meter"
            }
        },
        {
            "id": "editorialui-feedback-edprogressmeter--threshold-danger",
            "spec": {
                "page": "progress-meter",
                "label": "over threshold (danger)"
            },
            "anchor": {
                "story": "[role=progressbar]",
                "spec": ".ed-meter"
            }
        },
        {
            "id": "editorialui-feedback-edprogressmeter--paused",
            "spec": {
                "page": "progress-meter",
                "label": "paused"
            },
            "anchor": {
                "story": "[role=progressbar]",
                "spec": ".ed-meter"
            }
        },
        {
            "id": "editorialui-feedback-edprogressmeter--segmented-closure",
            "spec": {
                "page": "progress-meter",
                "label": "closure pipeline — 4 stages"
            },
            "anchor": {
                "story": "[role=progressbar]",
                "spec": ".ed-meter-seg"
            }
        },
        {
            "id": "editorialui-feedback-edprogressmeter--segmented-strength",
            "spec": {
                "page": "progress-meter",
                "label": "password strength — 4 bands"
            },
            "anchor": {
                "story": "[role=progressbar]",
                "spec": ".ed-meter-seg"
            }
        }
    ],
    "EdCircularProgress": [
        {
            "id": "editorialui-feedback-edcircularprogress--indeterminate-sm",
            "spec": {
                "page": "circular-progress",
                "label": "sm — 14px (inline)"
            },
            "anchor": {
                "story": "[role=status] > span",
                "spec": ".ed-spinner"
            }
        },
        {
            "id": "editorialui-feedback-edcircularprogress--indeterminate-sm",
            "spec": {
                "page": "circular-progress",
                "label": "sm — 14px (inline)"
            },
            "anchor": {
                "story": "[role=status] > span",
                "spec": ".ed-spinner"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-feedback-edcircularprogress--indeterminate-md",
            "spec": {
                "page": "circular-progress",
                "label": "md — 20px (default)"
            },
            "anchor": {
                "story": "[role=status] > span",
                "spec": ".ed-spinner"
            }
        },
        {
            "id": "editorialui-feedback-edcircularprogress--indeterminate-lg",
            "spec": {
                "page": "circular-progress",
                "label": "lg — 32px (page-level)"
            },
            "anchor": {
                "story": "[role=status] > span",
                "spec": ".ed-spinner"
            }
        },
        {
            "id": "editorialui-feedback-edcircularprogress--in-button",
            "spec": {
                "page": "circular-progress",
                "label": "in button (loading)"
            },
            "anchor": {
                "story": "[role=status] > span",
                "spec": ".ed-spinner"
            }
        },
        {
            "id": "editorialui-feedback-edcircularprogress--in-row",
            "spec": {
                "page": "circular-progress",
                "label": "in row (cell load)"
            },
            "anchor": {
                "story": "[role=status] > span",
                "spec": ".ed-spinner"
            }
        },
        {
            "id": "editorialui-feedback-edcircularprogress--page-level",
            "spec": {
                "page": "circular-progress",
                "label": "page-level — center of empty area"
            },
            "anchor": {
                "story": "[role=status] > span",
                "spec": ".ed-spinner"
            }
        }
    ],
    "EdNotification": [
        {
            "id": "editorialui-feedback-ednotification--info",
            "spec": {
                "page": "notification",
                "label": "info"
            },
            "anchor": {
                "story": ":scope > div > div",
                "spec": ".ed-notif"
            }
        },
        {
            "id": "editorialui-feedback-ednotification--info",
            "spec": {
                "page": "notification",
                "label": "info"
            },
            "anchor": {
                "story": ":scope > div > div",
                "spec": ".ed-notif"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-feedback-ednotification--success",
            "spec": {
                "page": "notification",
                "label": "success"
            },
            "anchor": {
                "story": ":scope > div > div",
                "spec": ".ed-notif"
            }
        },
        {
            "id": "editorialui-feedback-ednotification--warning",
            "spec": {
                "page": "notification",
                "label": "warning"
            },
            "anchor": {
                "story": ":scope > div > div",
                "spec": ".ed-notif"
            }
        },
        {
            "id": "editorialui-feedback-ednotification--danger",
            "spec": {
                "page": "notification",
                "label": "danger"
            },
            "anchor": {
                "story": ":scope > div > div",
                "spec": ".ed-notif"
            }
        },
        {
            "id": "editorialui-feedback-ednotification--compact",
            "spec": {
                "page": "notification",
                "label": "title only — compact"
            },
            "anchor": {
                "story": ":scope > div > div",
                "spec": ".ed-notif"
            }
        },
        {
            "id": "editorialui-feedback-ednotification--subtle",
            "spec": {
                "page": "notification",
                "label": "no left rail (subtle, used inside cards)"
            },
            "anchor": {
                "story": ":scope > div > div",
                "spec": ".ed-notif"
            }
        }
    ],
    "EdEmptyState": [
        {
            "id": "editorialui-feedback-edemptystate--first-use",
            "spec": {
                "page": "empty-state",
                "label": "first use — no data yet"
            },
            "anchor": {
                "story": "div:has(> h2)",
                "spec": ".ed-empty"
            }
        },
        {
            "id": "editorialui-feedback-edemptystate--first-use",
            "spec": {
                "page": "empty-state",
                "label": "first use — no data yet"
            },
            "anchor": {
                "story": "div:has(> h2)",
                "spec": ".ed-empty"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-feedback-edemptystate--no-results",
            "spec": {
                "page": "empty-state",
                "label": "filtered — no results"
            },
            "anchor": {
                "story": "div:has(> h2)",
                "spec": ".ed-empty"
            }
        },
        {
            "id": "editorialui-feedback-edemptystate--error-state",
            "spec": {
                "page": "empty-state",
                "label": "error — load failed"
            },
            "anchor": {
                "story": "div:has(> h2)",
                "spec": ".ed-empty"
            }
        },
        {
            "id": "editorialui-feedback-edemptystate--success-no-action",
            "spec": {
                "page": "empty-state",
                "label": "success — done, no action"
            },
            "anchor": {
                "story": "div:has(> h2)",
                "spec": ".ed-empty"
            }
        },
        {
            "id": "editorialui-feedback-edemptystate--restricted",
            "spec": {
                "page": "empty-state",
                "label": "permission — restricted"
            },
            "anchor": {
                "story": "div:has(> h2)",
                "spec": ".ed-empty"
            }
        },
        {
            "id": "editorialui-feedback-edemptystate--compact",
            "spec": {
                "page": "empty-state",
                "label": "compact — inside small panel"
            },
            "anchor": {
                "story": "div:has(> h3)",
                "spec": ".ed-empty--compact"
            }
        }
    ],
    "EdCard": [
        {
            "id": "editorialui-containers-edcard--summary",
            "spec": {
                "page": "card",
                "label": "summary card — entity preview"
            },
            "anchor": {
                "story": ":scope > *",
                "spec": ".ed-card"
            }
        },
        {
            "id": "editorialui-containers-edcard--summary",
            "spec": {
                "page": "card",
                "label": "summary card — entity preview"
            },
            "anchor": {
                "story": ":scope > *",
                "spec": ".ed-card"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-containers-edcard--interactive",
            "spec": {
                "page": "card",
                "label": "interactive — clickable"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-card"
            }
        },
        {
            "id": "editorialui-containers-edcard--selected",
            "spec": {
                "page": "card",
                "label": "selected"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-card"
            }
        },
        {
            "id": "editorialui-containers-edcard--flat",
            "spec": {
                "page": "card",
                "label": "flat — no border"
            },
            "anchor": {
                "story": ":scope > *",
                "spec": ".ed-card"
            }
        },
        {
            "id": "editorialui-containers-edcard--ghost",
            "spec": {
                "page": "card",
                "label": "ghost — empty / add"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-card"
            }
        }
    ],
    "EdDisclosure": [
        {
            "id": "editorialui-containers-eddisclosure--advanced-options",
            "spec": {
                "page": "disclosure",
                "label": "advanced options — secondary form fields"
            },
            "anchor": {
                "story": "div:has(> button[aria-expanded])",
                "spec": ".ed-disclosure"
            }
        },
        {
            "id": "editorialui-containers-eddisclosure--advanced-options",
            "spec": {
                "page": "disclosure",
                "label": "advanced options — secondary form fields"
            },
            "anchor": {
                "story": "div:has(> button[aria-expanded])",
                "spec": ".ed-disclosure"
            },
            "theme": "dark"
        }
    ],
    "EdAccordion": [
        {
            "id": "editorialui-containers-edaccordion--single-open",
            "spec": {
                "page": "accordion",
                "label": "single-open — one section at a time"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-accordion__trigger"
            }
        },
        {
            "id": "editorialui-containers-edaccordion--multi-open",
            "spec": {
                "page": "accordion",
                "label": "multi-open — independent sections"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-accordion__trigger"
            }
        },
        {
            "id": "editorialui-containers-edaccordion--single-open",
            "spec": {
                "page": "accordion",
                "label": "single-open — one section at a time"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-accordion__trigger"
            },
            "theme": "dark"
        }
    ],
    "EdTabs": [
        {
            "id": "editorialui-navigation-edtabs--with-counts",
            "spec": {
                "page": "tabs",
                "label": "underline — page-level navigation"
            },
            "anchor": {
                "story": "[role=tab][aria-selected=true]",
                "spec": ".ed-tabs__trigger[aria-selected=true]"
            }
        },
        {
            "id": "editorialui-navigation-edtabs--with-counts",
            "spec": {
                "page": "tabs",
                "label": "underline — page-level navigation"
            },
            "anchor": {
                "story": "[role=tab][aria-selected=true]",
                "spec": ".ed-tabs__trigger[aria-selected=true]"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-navigation-edtabs--segmented",
            "spec": {
                "page": "tabs",
                "label": "segmented — inline view toggle"
            },
            "anchor": {
                "story": "[role=tab][aria-selected=true]",
                "spec": ".ed-tabs__trigger[aria-selected=true]"
            }
        },
        {
            "id": "editorialui-navigation-edtabs--with-icons",
            "spec": {
                "page": "tabs",
                "label": "with icons"
            },
            "anchor": {
                "story": "[role=tab][aria-selected=true]",
                "spec": ".ed-tabs__trigger[aria-selected=true]"
            }
        },
        {
            "id": "editorialui-navigation-edtabs--with-status-dot",
            "spec": {
                "page": "tabs",
                "label": "with status dot"
            },
            "anchor": {
                "story": "[role=tab][aria-selected=true]",
                "spec": ".ed-tabs__trigger[aria-selected=true]"
            }
        }
    ],
    "EdBreadcrumb": [
        {
            "id": "editorialui-navigation-edbreadcrumb--three-level",
            "spec": {
                "page": "breadcrumb",
                "label": "default"
            },
            "anchor": {
                "story": "a",
                "spec": ".ed-breadcrumb__item"
            }
        },
        {
            "id": "editorialui-navigation-edbreadcrumb--three-level",
            "spec": {
                "page": "breadcrumb",
                "label": "default"
            },
            "anchor": {
                "story": "a",
                "spec": ".ed-breadcrumb__item"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-navigation-edbreadcrumb--with-overflow",
            "spec": {
                "page": "breadcrumb",
                "label": "with overflow (long path)"
            },
            "anchor": {
                "story": "a",
                "spec": ".ed-breadcrumb__item"
            }
        },
        {
            "id": "editorialui-navigation-edbreadcrumb--back-link-variant",
            "spec": {
                "page": "breadcrumb",
                "label": "single back link (compact)"
            },
            "anchor": {
                "story": "a",
                "spec": ".ed-breadcrumb__item"
            }
        },
        {
            "id": "editorialui-navigation-edbreadcrumb--chevron-separator",
            "spec": {
                "page": "breadcrumb",
                "label": "with chevron separator (Stripe-style)"
            },
            "anchor": {
                "story": "a",
                "spec": ".ed-breadcrumb__item"
            }
        }
    ],
    "EdNativeTable": [
        {
            "id": "editorialui-data-ednativetable--columned",
            "spec": {
                "page": "native-table",
                "label": "columned (small data set with headers)"
            },
            "anchor": {
                "story": "table",
                "spec": ".ed-table"
            }
        },
        {
            "id": "editorialui-data-ednativetable--zebra",
            "spec": {
                "page": "native-table",
                "label": "zebra-striped (for scannability when rows visually blend)"
            },
            "anchor": {
                "story": "table",
                "spec": ".ed-table--zebra"
            }
        },
        {
            "id": "editorialui-data-ednativetable--in-side-panel",
            "spec": {
                "page": "native-table",
                "label": "in side panel"
            },
            "anchor": {
                "story": "table",
                "spec": ".ed-table"
            }
        },
        {
            "id": "editorialui-data-ednativetable--columned",
            "spec": {
                "page": "native-table",
                "label": "columned (small data set with headers)"
            },
            "anchor": {
                "story": "table",
                "spec": ".ed-table"
            },
            "theme": "dark"
        }
    ],
    "EdList": [
        {
            "id": "editorialui-data-edlist--simple",
            "spec": {
                "page": "list",
                "label": "simple — single line"
            },
            "anchor": {
                "story": "div > ul",
                "spec": ".ed-list"
            }
        },
        {
            "id": "editorialui-data-edlist--simple",
            "spec": {
                "page": "list",
                "label": "simple — single line"
            },
            "anchor": {
                "story": "div > ul",
                "spec": ".ed-list"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-data-edlist--with-icon-meta",
            "spec": {
                "page": "list",
                "label": "with leading icon + meta"
            },
            "anchor": {
                "story": "div > ul",
                "spec": ".ed-list"
            }
        },
        {
            "id": "editorialui-data-edlist--grouped",
            "spec": {
                "page": "list",
                "label": "grouped"
            },
            "anchor": {
                "story": "div > ul",
                "spec": ".ed-list"
            }
        },
        {
            "id": "editorialui-data-edlist--loading-skeleton",
            "spec": {
                "page": "list",
                "label": "loading skeleton"
            },
            "anchor": {
                "story": "div > ul",
                "spec": ".ed-list"
            }
        }
    ],
    "EdTagContainer": [
        {
            "id": "editorialui-display-edtagcontainer--wrap",
            "spec": {
                "page": "tag-container",
                "label": "wrap (default) — flowing rows"
            },
            "anchor": {
                "story": ":scope > * > div",
                "spec": ".ed-tag-container"
            }
        },
        {
            "id": "editorialui-display-edtagcontainer--wrap",
            "spec": {
                "page": "tag-container",
                "label": "wrap (default) — flowing rows"
            },
            "anchor": {
                "story": ":scope > * > div",
                "spec": ".ed-tag-container"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-display-edtagcontainer--single-row",
            "spec": {
                "page": "tag-container",
                "label": "single-row — collapse with overflow counter"
            },
            "anchor": {
                "story": ":scope > * > div",
                "spec": ".ed-tag-container"
            }
        },
        {
            "id": "editorialui-display-edtagcontainer--empty",
            "spec": {
                "page": "tag-container",
                "label": "empty state"
            },
            "anchor": {
                "story": ":scope > * > div",
                "spec": ".ed-tag-container"
            }
        }
    ],
    "EdTagSelect": [
        {
            "id": "editorialui-display-edtagselect--empty",
            "spec": {
                "page": "tag-select",
                "label": "empty"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-select__trigger"
            }
        },
        {
            "id": "editorialui-display-edtagselect--empty",
            "spec": {
                "page": "tag-select",
                "label": "empty"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-select__trigger"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-display-edtagselect--populated",
            "spec": {
                "page": "tag-select",
                "label": "populated"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-select__trigger"
            }
        },
        {
            "id": "editorialui-display-edtagselect--disabled",
            "spec": {
                "page": "tag-select",
                "label": "disabled"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-select__trigger"
            }
        },
        {
            "id": "editorialui-display-edtagselect--error",
            "spec": {
                "page": "tag-select",
                "label": "error"
            },
            "anchor": {
                "story": "div:has(> input)",
                "spec": ".ed-select__trigger"
            }
        }
    ],
    "EdFilterChipRow": [
        {
            "id": "editorialui-selection-edfilterchiprow--multi",
            "spec": {
                "page": "filter-chip-row",
                "label": "multi-select — count badges, additive filters"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            }
        },
        {
            "id": "editorialui-selection-edfilterchiprow--multi",
            "spec": {
                "page": "filter-chip-row",
                "label": "multi-select — count badges, additive filters"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-selection-edfilterchiprow--single",
            "spec": {
                "page": "filter-chip-row",
                "label": "single-select — segmented control, mutually exclusive views"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            }
        },
        {
            "id": "editorialui-selection-edfilterchiprow--no-counts",
            "spec": {
                "page": "filter-chip-row",
                "label": "no counts"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            }
        },
        {
            "id": "editorialui-selection-edfilterchiprow--with-status-dots",
            "spec": {
                "page": "filter-chip-row",
                "label": "with status colors (read-only)"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-chip"
            }
        }
    ],
    "EdDateRangePicker": [
        {
            "id": "editorialui-selection-eddaterangepicker--default",
            "spec": {
                "page": "date-range-picker",
                "label": "custom range"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-select__trigger"
            }
        },
        {
            "id": "editorialui-selection-eddaterangepicker--default",
            "spec": {
                "page": "date-range-picker",
                "label": "custom range"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-select__trigger"
            },
            "theme": "dark"
        },
        {
            "id": "editorialui-selection-eddaterangepicker--empty-state",
            "spec": {
                "page": "date-range-picker",
                "label": "empty"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-select__trigger"
            }
        },
        {
            "id": "editorialui-selection-eddaterangepicker--preset-matched",
            "spec": {
                "page": "date-range-picker",
                "label": "preset selected"
            },
            "anchor": {
                "story": "button",
                "spec": ".ed-select__trigger"
            }
        }
    ]
};

export const SCAFFOLD = {};
