// EditorialUI · public barrel
//
// Re-exports the public surface. Internal helpers stay inside their folders.
//
// Bundles 1 (Foundations) + 2 (Forms). Update as each bundle lands.

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
