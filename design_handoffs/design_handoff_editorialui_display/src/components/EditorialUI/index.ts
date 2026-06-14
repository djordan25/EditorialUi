// EditorialUI · public barrel
//
// Re-exports the public surface. Internal helpers stay inside their folders.
//
// Bundles 1 (Foundations) + 2 (Forms) + 3 (Selection) + 4 (Display). Additive each bundle.

/* ---- Bundle 1 — Foundations ---- */
export { EdIcon } from './EdIcon';
export type { EdIconProps, EdIconName, EdIconSize, EdIconColor } from './EdIcon';

export { EdButton } from './EdButton';
export type { EdButtonProps, EdButtonVariant, EdButtonSize } from './EdButton';

export { EdIconButton } from './EdIconButton';
export type { EdIconButtonProps, EdIconButtonVariant } from './EdIconButton';

/* ---- Bundle 2 — Forms ---- */
export { EdTextField } from './EdTextField';
export type { EdTextFieldProps, EdTextFieldSize } from './EdTextField';

export { EdPasswordInput } from './EdPasswordInput';
export type {
    EdPasswordInputProps,
    EdPasswordStrength,
    EdPasswordStrengthInfo,
} from './EdPasswordInput';

export { EdCheckbox } from './EdCheckbox';
export type { EdCheckboxProps } from './EdCheckbox';

export { EdRadioGroup, EdRadio } from './EdRadioGroup';
export type {
    EdRadioGroupProps,
    EdRadioProps,
    EdRadioGroupOrientation,
} from './EdRadioGroup';

export { EdSwitch } from './EdSwitch';
export type { EdSwitchProps } from './EdSwitch';

export { EdFormControlLabel } from './EdFormControlLabel';
export type {
    EdFormControlLabelProps,
    EdFormControlLabelLayout,
    EdFormControlSlotProps,
} from './EdFormControlLabel';

/* ---- Bundle 3 — Selection ---- */
export { EdSelect } from './EdSelect';
export type {
    EdSelectProps,
    EdSelectSize,
    EdSelectOption,
    EdSelectItem,
    EdSelectGroup,
    EdSelectSeparator,
} from './EdSelect';

export { EdComboBox } from './EdComboBox';
export type {
    EdComboBoxProps,
    EdComboBoxBaseProps,
    EdComboBoxSingleProps,
    EdComboBoxMultiProps,
    EdComboBoxOption,
    EdComboBoxSearchFn,
} from './EdComboBox';

export { EdAutocomplete } from './EdAutocomplete';
export type {
    EdAutocompleteProps,
    EdAutocompleteOption,
    EdAutocompleteSearchFn,
} from './EdAutocomplete';

/* ---- Bundle 4 — Display ---- */
export { EdTag } from './EdTag';
export type { EdTagProps, EdTagTone } from './EdTag';

export { EdStatusBadge } from './EdStatusBadge';
export type { EdStatusBadgeProps, EdStatusBadgeStyle, EdStatusBadgeTone } from './EdStatusBadge';

export { EdChip } from './EdChip';
export type { EdChipProps, EdChipKind } from './EdChip';

export { EdDivider } from './EdDivider';
export type { EdDividerProps, EdDividerOrientation, EdDividerWeight } from './EdDivider';

export { EdProgressMeter, EdProgressSegmented } from './EdProgressMeter';
export type {
    EdProgressMeterProps,
    EdProgressSegmentedProps,
    EdProgressTone,
    EdProgressSize,
} from './EdProgressMeter';

export { EdCircularProgress } from './EdCircularProgress';
export type {
    EdCircularProgressProps,
    EdCircularSize,
    EdCircularTone,
} from './EdCircularProgress';
