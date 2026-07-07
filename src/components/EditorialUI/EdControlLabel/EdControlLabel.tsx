import {
    cloneElement,
    forwardRef,
    isValidElement,
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
} from 'react';
import styles from './EdControlLabel.module.scss';

export type EdControlLabelPlacement = 'start' | 'end';

export interface EdControlLabelProps
    extends Omit<HTMLAttributes<HTMLLabelElement>, 'children'> {
    /** The interactive control — typically a checkbox, radio, or switch. */
    control: ReactElement;
    /** The label content, rendered beside the control. */
    label: ReactNode;
    /** Dims the label and forwards `disabled` to the control. */
    disabled?: boolean;
    /** Place the label before (`start`) or after (`end`, default) the control. */
    labelPlacement?: EdControlLabelPlacement;
    className?: string;
}

/**
 * EdControlLabel — an inline, clickable `<label>` that wraps a single control
 * (checkbox / radio / switch) so clicking the text toggles it. MUI-FormControlLabel
 * shaped. For a labeled *field* with hint/error (select, text input) use
 * EdFormControlLabel instead; this is for a bare toggle + its caption.
 *
 *   <EdControlLabel label="Include superseded" control={<EdCheckboxInput />} />
 *   <EdControlLabel label="Notify" labelPlacement="start" control={<EdSwitch />} />
 */
export const EdControlLabel = forwardRef<HTMLLabelElement, EdControlLabelProps>(
    function EdControlLabel(
        { control, label, disabled = false, labelPlacement = 'end', className, ...rest },
        ref,
    ) {
        // Forward `disabled` to the control when the label is disabled, without
        // un-disabling a control that is independently disabled.
        const enrichedControl = isValidElement(control)
            ? cloneElement(control as ReactElement<{ disabled?: boolean }>, {
                  disabled: disabled || (control.props as { disabled?: boolean }).disabled,
              })
            : control;

        const labelSpan = <span className={styles.label}>{label}</span>;

        return (
            <label
                {...rest}
                ref={ref}
                className={[styles.root, disabled && styles.disabled, className]
                    .filter(Boolean)
                    .join(' ')}
            >
                {labelPlacement === 'start' && labelSpan}
                {enrichedControl}
                {labelPlacement === 'end' && labelSpan}
            </label>
        );
    },
);
