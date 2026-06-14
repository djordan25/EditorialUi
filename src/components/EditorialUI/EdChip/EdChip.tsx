import {
    forwardRef,
    type ButtonHTMLAttributes,
    type MouseEvent,
    type ReactNode,
} from 'react';
import { X } from 'lucide-react';
import styles from './EdChip.module.scss';

export type EdChipKind = 'toggle' | 'radio' | 'input';

export interface EdChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    /** Visible label. */
    children: ReactNode;
    /**
     * Behaviour:
     *  - `toggle` (default) → `role="checkbox"` + `aria-checked` — multi-select filter row.
     *  - `radio`            → `role="radio"` — use inside an `aria-label`'d <div role="radiogroup">.
     *  - `input`            → free pill (likely a removable token in a form). No selection role.
     */
    kind?: EdChipKind;
    /** Selection state. Required for `kind="toggle" | "radio"`. */
    selected?: boolean;
    /** Optional count badge — included in the accessible name automatically. */
    count?: number;
    /** Optional leading icon. */
    leadingIcon?: ReactNode;
    /** Optional 6px leading status dot. Pass any CSS color. */
    leadingDot?: string;
    /**
     * Render a remove button after the label. Pairs with `kind="input"`.
     * Backspace / Delete also fires this when the chip is focused.
     */
    onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
    /** Override the close button's aria-label. */
    removeLabel?: string;
    /** Selection toggle handler — receives the next selected state. */
    onSelectedChange?: (next: boolean) => void;
}

/**
 * EdChip — pill-shaped interactive control. Filters, segmented selectors,
 * removable form tokens. Used by EdFilterChipRow internally; available standalone.
 *
 *   <EdChip selected={isOpen} count={87} onSelectedChange={setOpen}>Open</EdChip>
 *   <EdChip kind="input" onRemove={() => unset()}>PRA SS3/21</EdChip>
 */
export const EdChip = forwardRef<HTMLButtonElement, EdChipProps>(function EdChip(
    {
        children,
        kind = 'toggle',
        selected,
        count,
        leadingIcon,
        leadingDot,
        onRemove,
        removeLabel,
        onSelectedChange,
        onClick,
        onKeyDown,
        disabled,
        className,
        type,
        ...rest
    },
    ref,
) {
    const label = typeof children === 'string' ? children : undefined;
    const accessibleName = (() => {
        if (rest['aria-label']) return rest['aria-label'];
        if (label && typeof count === 'number') return `${label}, ${count} items`;
        return undefined;
    })();

    const isInteractiveSelection = kind === 'toggle' || kind === 'radio';
    const role = kind === 'toggle' ? 'checkbox' : kind === 'radio' ? 'radio' : undefined;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        onClick?.(e);
        if (isInteractiveSelection && !e.defaultPrevented) {
            onSelectedChange?.(!selected);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if ((e.key === 'Backspace' || e.key === 'Delete') && onRemove && kind === 'input') {
            e.preventDefault();
            // Synthesize a click on the remove button for the consumer.
            onRemove(e as unknown as MouseEvent<HTMLButtonElement>);
        }
    };

    const resolvedRemoveLabel = removeLabel ?? (label ? `Remove ${label}` : 'Remove');

    return (
        <button
            ref={ref}
            type={type ?? 'button'}
            role={role}
            aria-checked={isInteractiveSelection ? !!selected : undefined}
            aria-label={accessibleName}
            disabled={disabled}
            data-selected={selected || undefined}
            data-kind={kind}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={[
                styles.root,
                kind === 'input' && styles.input,
                selected && isInteractiveSelection && styles.selected,
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...rest}
        >
            {leadingDot && (
                <span
                    className={styles.dot}
                    style={{ background: leadingDot }}
                    aria-hidden
                />
            )}
            {leadingIcon && (
                <span className={styles.icon} aria-hidden>
                    {leadingIcon}
                </span>
            )}
            <span className={styles.label}>{children}</span>
            {typeof count === 'number' && (
                <span className={styles.count} aria-hidden>
                    {count}
                </span>
            )}
            {onRemove && kind === 'input' && (
                <span
                    role="button"
                    aria-label={resolvedRemoveLabel}
                    tabIndex={-1}
                    className={styles.close}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(e as unknown as MouseEvent<HTMLButtonElement>);
                    }}
                >
                    <X size={11} strokeWidth={2.5} aria-hidden />
                </span>
            )}
        </button>
    );
});
