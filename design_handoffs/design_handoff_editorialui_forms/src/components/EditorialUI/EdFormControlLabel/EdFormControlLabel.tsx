import {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    useId,
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
} from 'react';
import styles from './EdFormControlLabel.module.scss';

export type EdFormControlLabelLayout = 'stack' | 'row';

export interface EdFormControlSlotProps {
    /** Stable id injected onto the control; the label uses this as htmlFor. */
    id: string;
    /** Pre-joined describedby ids for the hint/error message, if any. */
    'aria-describedby'?: string;
    /** True when the field is in an error state. */
    'aria-invalid'?: true;
    /** True when the field is required. */
    'aria-required'?: true;
}

export interface EdFormControlLabelProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Visible label. Sentence case. */
    label: ReactNode;
    /** Hint text below the control. Replaced by `error`. */
    hint?: ReactNode;
    /** Error message — sets aria-invalid on the control and replaces the hint. */
    error?: ReactNode;
    /** Required indicator: renders `*` on the label and sets aria-required on the control. */
    required?: boolean;
    /** Hide the label visually but keep it announced. */
    visuallyHidden?: boolean;
    /**
     * Layout:
     *  - `stack` (default) — label / control / hint vertically.
     *  - `row` — label + description on the left, control flush right (settings rows).
     */
    layout?: EdFormControlLabelLayout;
    /** Stable id for the control. Auto-generated when omitted. */
    htmlFor?: string;
    /**
     * The control. Can be:
     *  - A single React element (recommended) — the wrapper clones it and injects
     *    `id`, `aria-describedby`, `aria-invalid`, `aria-required`.
     *  - A function `(slotProps) => ReactNode` — receive the same props and spread them
     *    yourself. Use this for third-party controls that don't accept these props directly.
     */
    children: ReactElement | ((slotProps: EdFormControlSlotProps) => ReactNode);
}

/**
 * EdFormControlLabel — composition primitive. Renders label + control slot + hint/error
 * with consistent layout and ARIA wiring.
 *
 *   <EdFormControlLabel label="Severity" hint="Pick one">
 *     <EdSelect options={...} />
 *   </EdFormControlLabel>
 *
 *   <EdFormControlLabel layout="row" label="Notify on completion">
 *     {({ id, 'aria-describedby': db }) => (
 *       <ThirdPartySwitch id={id} aria-describedby={db} />
 *     )}
 *   </EdFormControlLabel>
 */
export const EdFormControlLabel = forwardRef<HTMLDivElement, EdFormControlLabelProps>(
    function EdFormControlLabel(
        {
            label,
            hint,
            error,
            required = false,
            visuallyHidden = false,
            layout = 'stack',
            htmlFor,
            children,
            className,
            ...rest
        },
        ref,
    ) {
        const autoId = useId();
        const controlId = htmlFor ?? `ed-fcl-${autoId}`;
        const messageId = error || hint ? `${controlId}-msg` : undefined;

        const slotProps: EdFormControlSlotProps = {
            id: controlId,
            'aria-describedby': messageId,
            'aria-invalid': error ? true : undefined,
            'aria-required': required || undefined,
        };

        // Resolve the control slot. We support a single element (cloned with slotProps)
        // or a render function (receives slotProps).
        let control: ReactNode;
        if (typeof children === 'function') {
            control = children(slotProps);
        } else if (isValidElement(children)) {
            const onlyChild = Children.only(children);
            // Merge slot props with whatever the child already has — caller wins for id
            // if they explicitly set one, but we still prefer the wrapper id so htmlFor matches.
            control = cloneElement(onlyChild, {
                id: controlId,
                'aria-describedby':
                    [
                        (onlyChild.props as { 'aria-describedby'?: string })['aria-describedby'],
                        messageId,
                    ]
                        .filter(Boolean)
                        .join(' ') || undefined,
                'aria-invalid':
                    error ? true : (onlyChild.props as { 'aria-invalid'?: boolean })['aria-invalid'],
                'aria-required':
                    required || (onlyChild.props as { 'aria-required'?: boolean })['aria-required'] || undefined,
            } as Partial<typeof onlyChild.props>);
        } else {
            control = children;
        }

        return (
            <div
                {...rest}
                ref={ref}
                className={[
                    styles.root,
                    layout === 'row' ? styles.layoutRow : styles.layoutStack,
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                <div className={styles.head}>
                    <label
                        htmlFor={controlId}
                        className={[
                            styles.label,
                            required && styles.labelRequired,
                            visuallyHidden && styles.visuallyHidden,
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    >
                        {label}
                    </label>
                    {/* In row layout the hint sits under the label, left of the control. */}
                    {layout === 'row' && (error || hint) && (
                        <p
                            id={messageId}
                            className={[styles.hint, error && styles.hintError]
                                .filter(Boolean)
                                .join(' ')}
                            role={error ? 'alert' : undefined}
                            aria-live={error ? 'polite' : undefined}
                        >
                            {error || hint}
                        </p>
                    )}
                </div>
                <div className={styles.control}>{control}</div>
                {layout === 'stack' && (error || hint) && (
                    <p
                        id={messageId}
                        className={[styles.hint, error && styles.hintError]
                            .filter(Boolean)
                            .join(' ')}
                        role={error ? 'alert' : undefined}
                        aria-live={error ? 'polite' : undefined}
                    >
                        {error || hint}
                    </p>
                )}
            </div>
        );
    },
);
