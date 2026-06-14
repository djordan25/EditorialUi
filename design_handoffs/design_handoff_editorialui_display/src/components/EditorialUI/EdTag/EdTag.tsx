import {
    forwardRef,
    type HTMLAttributes,
    type MouseEvent,
    type ReactNode,
} from 'react';
import { X } from 'lucide-react';
import styles from './EdTag.module.scss';

export type EdTagTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

export interface EdTagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onRemove'> {
    /** Visible label. Sentence / kebab case. */
    children: ReactNode;
    /** Tone. Pair color with label — never bare color. */
    tone?: EdTagTone;
    /** Optional leading icon. */
    leadingIcon?: ReactNode;
    /**
     * When provided, renders a close button. Callback fires when clicked.
     * Pass `removeLabel` to override the default "Remove {label}" aria-label.
     */
    onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
    /** Override the close button's aria-label. */
    removeLabel?: string;
}

const toneClass: Record<EdTagTone, string> = {
    neutral: styles.toneNeutral,
    brand: styles.toneBrand,
    success: styles.toneSuccess,
    warning: styles.toneWarning,
    danger: styles.toneDanger,
};

/**
 * EdTag — compact label for entity metadata (categories, regulations, model family).
 * Lower visual weight than EdStatusBadge (which is for state).
 *
 *   <EdTag>credit-risk</EdTag>
 *   <EdTag tone="brand">PD-Retail</EdTag>
 *   <EdTag tone="danger" onRemove={() => removeTag('deprecated')}>deprecated</EdTag>
 */
export const EdTag = forwardRef<HTMLSpanElement, EdTagProps>(function EdTag(
    {
        children,
        tone = 'neutral',
        leadingIcon,
        onRemove,
        removeLabel,
        className,
        ...rest
    },
    ref,
) {
    const label = typeof children === 'string' ? children : undefined;
    const resolvedRemoveLabel = removeLabel ?? (label ? `Remove ${label}` : 'Remove');

    return (
        <span
            ref={ref}
            className={[styles.root, toneClass[tone], className].filter(Boolean).join(' ')}
            {...rest}
        >
            {leadingIcon && (
                <span className={styles.icon} aria-hidden="true">
                    {leadingIcon}
                </span>
            )}
            <span className={styles.label}>{children}</span>
            {onRemove && (
                <button
                    type="button"
                    className={styles.close}
                    aria-label={resolvedRemoveLabel}
                    onClick={onRemove}
                >
                    <X size={11} strokeWidth={2.5} aria-hidden />
                </button>
            )}
        </span>
    );
});
