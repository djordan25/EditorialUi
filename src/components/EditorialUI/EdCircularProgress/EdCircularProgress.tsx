import {
    forwardRef,
    type HTMLAttributes,
} from 'react';
import styles from './EdCircularProgress.module.scss';

export type EdCircularSize = 'sm' | 'md' | 'lg';
export type EdCircularTone = 'brand' | 'success' | 'warning' | 'danger' | 'inverse';

export interface EdCircularProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
    /** Determinate value 0-100. Omit for indeterminate spinner. */
    percent?: number;
    size?: EdCircularSize;
    tone?: EdCircularTone;
    /**
     * Required accessible name when no surrounding context describes the wait.
     * Examples: "Loading findings", "Saving change". Visually-hidden — never rendered.
     */
    label?: string;
    /** Show the percent value at the center of the ring (determinate only). */
    showValue?: boolean;
}

/* Size config — diameter, stroke width, center-label font size */
const sizeConfig: Record<EdCircularSize, { d: number; s: number; f: number }> = {
    sm: { d: 14, s: 1.5, f: 0 },
    md: { d: 20, s: 2, f: 10 },
    lg: { d: 32, s: 3, f: 11 },
};

const toneClass: Record<EdCircularTone, string> = {
    brand: styles.toneBrand,
    success: styles.toneSuccess,
    warning: styles.toneWarning,
    danger: styles.toneDanger,
    inverse: styles.toneInverse,
};

/**
 * EdCircularProgress — spinner for indeterminate waits, thin ring for determinate.
 *
 *   <EdCircularProgress label="Loading findings" />                  ← indeterminate
 *   <EdCircularProgress percent={70} showValue label="Closure progress" />
 *   <EdCircularProgress size="sm" label="Saving" />                  ← in-button
 *
 * Spinner is correct for operations >200ms with no progress signal.
 * For predictable jobs prefer EdProgressMeter; for content with shape prefer EdSkeleton.
 */
export const EdCircularProgress = forwardRef<HTMLDivElement, EdCircularProgressProps>(
    function EdCircularProgress(
        {
            percent,
            size = 'md',
            tone = 'brand',
            label,
            showValue = false,
            className,
            ...rest
        },
        ref,
    ) {
        const { d, s, f } = sizeConfig[size];
        const isDeterminate = typeof percent === 'number';
        const clamped = isDeterminate ? Math.min(100, Math.max(0, percent!)) : undefined;

        const radius = (d - s) / 2;
        const circumference = 2 * Math.PI * radius;

        // ---- Indeterminate: pure CSS rotating arc ----
        if (!isDeterminate) {
            return (
                <div
                    ref={ref}
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                    aria-label={label}
                    className={[styles.root, className].filter(Boolean).join(' ')}
                    {...rest}
                >
                    <span
                        className={[styles.spinner, toneClass[tone]].filter(Boolean).join(' ')}
                        style={{ width: d, height: d, borderWidth: s }}
                        aria-hidden
                    />
                    {label && <span className={styles.srOnly}>{label}</span>}
                </div>
            );
        }

        // ---- Determinate: SVG ring ----
        const dashOffset = circumference * (1 - clamped! / 100);

        return (
            <div
                ref={ref}
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={clamped}
                aria-valuetext={`${Math.round(clamped!)}%`}
                className={[styles.root, styles.ring, toneClass[tone], className]
                    .filter(Boolean)
                    .join(' ')}
                style={{ width: d, height: d }}
                {...rest}
            >
                <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} className={styles.svg} aria-hidden>
                    <circle
                        className={styles.track}
                        cx={d / 2}
                        cy={d / 2}
                        r={radius}
                        strokeWidth={s}
                        fill="none"
                    />
                    <circle
                        className={styles.fill}
                        cx={d / 2}
                        cy={d / 2}
                        r={radius}
                        strokeWidth={s}
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                    />
                </svg>
                {showValue && f > 0 && (
                    <span className={styles.label} style={{ fontSize: f }} aria-hidden>
                        {Math.round(clamped!)}%
                    </span>
                )}
            </div>
        );
    },
);
