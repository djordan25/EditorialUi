// EditorialUI · public barrel
//
// Bundles 1–8: Foundations + Forms + Selection + Display + Feedback + Containers
// + Navigation + Data.

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
export type { EdPasswordInputProps, EdPasswordStrength, EdPasswordStrengthInfo } from './EdPasswordInput';

export { EdCheckbox } from './EdCheckbox';
export type { EdCheckboxProps } from './EdCheckbox';

export { EdRadioGroup, EdRadio } from './EdRadioGroup';
export type { EdRadioGroupProps, EdRadioProps, EdRadioGroupOrientation } from './EdRadioGroup';

export { EdSwitch } from './EdSwitch';
export type { EdSwitchProps } from './EdSwitch';

export { EdFormControlLabel } from './EdFormControlLabel';
export type { EdFormControlLabelProps, EdFormControlLabelLayout, EdFormControlSlotProps } from './EdFormControlLabel';

/* ---- Bundle 3 — Selection ---- */
export { EdSelect } from './EdSelect';
export type { EdSelectProps, EdSelectSize, EdSelectOption, EdSelectItem, EdSelectGroup, EdSelectSeparator } from './EdSelect';

export { EdComboBox } from './EdComboBox';
export type { EdComboBoxProps, EdComboBoxBaseProps, EdComboBoxSingleProps, EdComboBoxMultiProps, EdComboBoxOption, EdComboBoxSearchFn } from './EdComboBox';

export { EdAutocomplete } from './EdAutocomplete';
export type { EdAutocompleteProps, EdAutocompleteOption, EdAutocompleteSearchFn } from './EdAutocomplete';

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
export type { EdProgressMeterProps, EdProgressSegmentedProps, EdProgressTone, EdProgressSize } from './EdProgressMeter';

export { EdCircularProgress } from './EdCircularProgress';
export type { EdCircularProgressProps, EdCircularSize, EdCircularTone } from './EdCircularProgress';

/* ---- Bundle 5 — Feedback ---- */
export { EdTooltip, EdTooltipProvider } from './EdTooltip';
export type { EdTooltipProps, EdTooltipSide } from './EdTooltip';

export { EdNotification } from './EdNotification';
export type { EdNotificationProps, EdNotificationSeverity } from './EdNotification';

export { EdDialog, EdConfirmation } from './EdDialog';
export type { EdDialogProps, EdDialogSize, EdConfirmationProps } from './EdDialog';

export { EdEmptyState } from './EdEmptyState';
export type { EdEmptyStateProps, EdEmptyStateTone, EdEmptyStateHeadingLevel } from './EdEmptyState';

/* ---- Bundle 6 — Containers ---- */
export { EdCard, EdCardHeader, EdCardBody, EdCardFooter } from './EdCard';
export type { EdCardProps, EdCardVariant, EdCardHeaderProps } from './EdCard';

export { EdModal } from './EdModal';
export type { EdModalProps, EdModalSize } from './EdModal';

export { EdDrawer, EdDrawerSection, EdSidePanel } from './EdDrawer';
export type { EdDrawerProps, EdDrawerSectionProps, EdDrawerSize, EdDrawerSide } from './EdDrawer';

export { EdDisclosure } from './EdDisclosure';
export type { EdDisclosureProps } from './EdDisclosure';

export { EdAccordion } from './EdAccordion';
export type { EdAccordionProps, EdAccordionItemData } from './EdAccordion';

/* ---- Bundle 7 — Navigation ---- */
export { EdTabs } from './EdTabs';
export type { EdTabsProps, EdTabsVariant, EdTabItem } from './EdTabs';

export { EdBreadcrumb } from './EdBreadcrumb';
export type { EdBreadcrumbProps, EdBreadcrumbCrumb, EdBreadcrumbSeparator } from './EdBreadcrumb';

export { EdMenu } from './EdMenu';
export type { EdMenuProps, EdMenuEntry, EdMenuActionItem, EdMenuCheckboxItem, EdMenuSeparator, EdMenuGroupLabel, EdMenuSubmenu } from './EdMenu';

export { EdContextMenu } from './EdContextMenu';
export type { EdContextMenuProps, EdContextMenuEntry } from './EdContextMenu';

/* ---- Bundle 8 — Data ---- */
export { EdNativeTable, EdKeyValueTable } from './EdNativeTable';
export type { EdNativeTableProps, EdNativeColumn, EdKeyValueTableProps, EdKeyValueRow, EdNativeTableDensity } from './EdNativeTable';

export { EdDataTable } from './EdDataTable';
export type { EdDataTableProps, EdColumn, EdSortState, EdSortDir, EdTableDensity } from './EdDataTable';

export { EdList } from './EdList';
export type { EdListProps, EdListItem } from './EdList';
