import {
    forwardRef,
    useId,
    useState,
    type HTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
} from 'react';
import styles from './EdFacetGroup.module.scss';

export interface EdFacetGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Group heading, shown as an eyebrow ("Tier", "Status"). */
    label: ReactNode;
    /** Controlled open state. */
    open?: boolean;
    /** Initial state when uncontrolled. Default true. */
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
}

/**
 * EdFacetGroup — a collapsible group in a filter rail. Holds EdFacetRows.
 *
 *   <EdFacetGroup label="Tier">
 *     <EdFacetRow checked label="Tier I" count={7} onCheckedChange={…} />
 *   </EdFacetGroup>
 */
export const EdFacetGroup = forwardRef<HTMLDivElement, EdFacetGroupProps>(function EdFacetGroup(
    { label, open, defaultOpen = true, onOpenChange, children, className, ...rest },
    ref,
) {
    const [innerOpen, setInnerOpen] = useState(defaultOpen);
    const isOpen = open ?? innerOpen;
    const bodyId = useId();
    const toggle = () => {
        const next = !isOpen;
        if (open === undefined) setInnerOpen(next);
        onOpenChange?.(next);
    };
    return (
        <div ref={ref} className={[styles.group, className].filter(Boolean).join(' ')} {...rest}>
            <button type="button" className={styles.header} aria-expanded={isOpen} aria-controls={bodyId} onClick={toggle}>
                <span className={styles.label}>{label}</span>
                <span className={styles.toggle} aria-hidden="true">{isOpen ? '–' : '+'}</span>
            </button>
            <div id={bodyId} role="group" className={styles.body} hidden={!isOpen}>
                {children}
            </div>
        </div>
    );
});

export interface EdFacetRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    /** The value's label — text, or a badge plus text. */
    label: ReactNode;
    /** How many items carry the value. */
    count?: ReactNode;
    disabled?: boolean;
}

/**
 * EdFacetRow — one value in a filter rail: a small square check, the label, and a
 * count, the whole row clickable and tinted when on. A checkbox to assistive
 * technology (Space toggles; Enter too).
 */
export const EdFacetRow = forwardRef<HTMLDivElement, EdFacetRowProps>(function EdFacetRow(
    { checked, onCheckedChange, label, count, disabled = false, className, ...rest },
    ref,
) {
    const toggle = () => {
        if (!disabled) onCheckedChange(!checked);
    };
    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggle();
        }
    };
    return (
        <div
            ref={ref}
            role="checkbox"
            aria-checked={checked}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            onClick={toggle}
            onKeyDown={onKeyDown}
            className={[styles.row, checked && styles.checked, disabled && styles.disabled, className].filter(Boolean).join(' ')}
            {...rest}
        >
            <span className={styles.box} aria-hidden="true">
                {checked && (
                    <svg viewBox="0 0 10 10" width="8" height="8">
                        <path d="M1.5 5.2 L4 7.5 L8.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                )}
            </span>
            <span className={styles.rowLabel}>{label}</span>
            {count !== undefined && <span className={styles.count}>{count}</span>}
        </div>
    );
});
