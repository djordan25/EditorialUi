import {
    forwardRef,
    type HTMLAttributes,
    type MouseEvent,
    type ReactNode,
} from 'react';
import { X } from 'lucide-react';
import styles from './EdTag.module.scss';

export type EdTagTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
export type EdTagSize = 'sm' | 'md' | 'lg';

export interface EdTagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onRemove' | 'color'> {
    /** Visible label. Optional — omit for a text-less color swatch (pass `aria-label`). */
    children?: ReactNode;
    /** Preset tone. Pair color with label — never bare color. */
    tone?: EdTagTone;
    /** Size scale. Default `md`. */
    size?: EdTagSize;
    /**
     * Arbitrary fill color (any CSS color) — overrides `tone`. Text color is derived
     * from luminance unless `textColor` is given. Use for user-defined tag palettes.
     */
    color?: string;
    /** Explicit text color, paired with `color`. */
    textColor?: string;
    /**
     * Render a leading color dot (a swatch) instead of filling the chip. Uses `color`
     * (or the tone's accent). With no children this is a compact text-less swatch.
     */
    dot?: boolean;
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
 *   <EdTag color="#6D28D9">Wholesale</EdTag>
 *   <EdTag dot color="#16A34A">active</EdTag>
 *   <EdTag dot color="#DC2626" aria-label="Retail" />   // text-less swatch
 */
export const EdTag = forwardRef<HTMLSpanElement, EdTagProps>(function EdTag(
    {
        children,
        tone = 'neutral',
        size = 'md',
        color,
        textColor,
        dot = false,
        leadingIcon,
        onRemove,
        removeLabel,
        className,
        style,
        ...rest
    },
    ref,
) {
    const label = typeof children === 'string' ? children : undefined;
    const resolvedRemoveLabel = removeLabel ?? (label ? `Remove ${label}` : 'Remove');
    const hasLabel = children !== undefined && children !== null && children !== false;

    // A custom color FILLS the chip (unless in dot mode, where it colors the dot only).
    const filled = Boolean(color) && !dot;
    const sizeCls = size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : undefined;

    const mergedStyle = filled
        ? {
              background: color,
              color: textColor ?? readableTextColor(color as string),
              borderColor: 'transparent',
              ...style,
          }
        : style;

    return (
        <span
            ref={ref}
            className={[
                styles.root,
                sizeCls,
                !filled && toneClass[tone],
                dot && !hasLabel && styles.dotOnly,
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            style={mergedStyle}
            {...rest}
        >
            {dot && (
                <span
                    className={styles.dot}
                    style={color ? { background: color } : undefined}
                    aria-hidden="true"
                />
            )}
            {leadingIcon && (
                <span className={styles.icon} aria-hidden="true">
                    {leadingIcon}
                </span>
            )}
            {hasLabel && <span className={styles.label}>{children}</span>}
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

/* Parse a hex or rgb() color to [r,g,b] 0-255, or null when unrecognized. */
function parseRgb(input: string): [number, number, number] | null {
    const c = input.trim();
    const hex = c.match(/^#([0-9a-f]{3,8})$/i);
    if (hex) {
        let h = hex[1];
        if (h.length === 3 || h.length === 4) {
            h = h
                .split('')
                .map((x) => x + x)
                .join('');
        }
        if (h.length === 6 || h.length === 8) {
            return [
                parseInt(h.slice(0, 2), 16),
                parseInt(h.slice(2, 4), 16),
                parseInt(h.slice(4, 6), 16),
            ];
        }
        return null;
    }
    const rgb = c.match(/^rgba?\(([^)]+)\)$/i);
    if (rgb) {
        const parts = rgb[1].split(/[,\s/]+/).map(Number);
        if (parts.length >= 3 && parts.slice(0, 3).every((n) => Number.isFinite(n))) {
            return [parts[0], parts[1], parts[2]];
        }
    }
    return null;
}

/* Pick a readable text token (dark vs on-solid) for an arbitrary background via WCAG luminance. */
function readableTextColor(bg: string): string {
    const rgb = parseRgb(bg);
    if (!rgb) return 'var(--ed-color-text-on-solid)';
    const [r, g, b] = rgb.map((v) => v / 255);
    const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    return luminance > 0.5 ? 'var(--ed-color-text-primary)' : 'var(--ed-color-text-on-solid)';
}
