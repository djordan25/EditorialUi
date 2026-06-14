import {
    forwardRef,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import styles from './EdProgressMeter.module.scss';

export type EdProgressTone = 'brand' | 'success' | 'warning' | 'danger' | 'muted';
export type EdProgressSize = 'md' | 'lg';

export interface EdProgressMeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
    /** Label shown above the bar (left-aligned). */
    label?: ReactNode;
    /** Mono value shown above the bar (right-aligned). */
    value?: ReactNode;
    /** Determinate progress 0-100. Omit for indeterminate. */
    percent?: number;
    /** Fill tone — switch to warning/danger when the value crosses a threshold. */
    tone?: EdProgressTone;
    /** Bar height. */
    size?: EdProgressSize;
    /** Pause the bar — switches tone to muted and disables motion. */
    paused?: boolean;
    /**
     * aria-valuetext — the visible string. Defaults to "{percent}%" for determinate;
     * pass the longer label when the visible value has more context (e.g.
     * "68%, 2,142 of 3,150").
     */
    valueText?: string;
    /** Accessible name when label is omitted. */
    ariaLabel?: string;
}

const toneFillClass: Record<EdProgressTone, string> = {
    brand: styles.fillBrand,
    success: styles.fillSuccess,
    warning: styles.fillWarning,
    danger: styles.fillDanger,
    muted: styles.fillMuted,
};

/**
 * EdProgressMeter — linear progress bar for determinate jobs (uploads, batches)
 * and a separate segmented variant for stage-based work.
 *
 *   <EdProgressMeter label="Uploading" percent={42} />
 *   <EdProgressMeter label="Searching audit log…" />              (indeterminate)
 *   <EdProgressMeter label="Sync complete" percent={100} tone="success" />
 *   <EdProgressMeter label="SLA budget" percent={14} tone="warning" />
 *
 * For stage-based progress, use <EdProgressSegmented>.
 */
export const EdProgressMeter = forwardRef<HTMLDivElement, EdProgressMeterProps>(
    function EdProgressMeter(
        {
            label,
            value,
            percent,
            tone = 'brand',
            size = 'md',
            paused = false,
            valueText,
            ariaLabel,
            className,
            ...rest
        },
        ref,
    ) {
        const isDeterminate = typeof percent === 'number';
        const clamped = isDeterminate ? Math.min(100, Math.max(0, percent!)) : undefined;
        const resolvedTone = paused ? 'muted' : tone;
        const resolvedValueText =
            valueText ??
            (isDeterminate
                ? `${Math.round(clamped!)}%`
                : 'Working…');

        return (
            <div
                ref={ref}
                className={[styles.root, className].filter(Boolean).join(' ')}
                {...rest}
            >
                {(label || value) && (
                    <div className={styles.head}>
                        {label && <span className={styles.label}>{label}</span>}
                        {value && <span className={styles.value}>{value}</span>}
                    </div>
                )}
                <div
                    role="progressbar"
                    aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={isDeterminate ? clamped : undefined}
                    aria-valuetext={resolvedValueText}
                    aria-busy={!isDeterminate || undefined}
                    className={[
                        styles.track,
                        size === 'lg' ? styles.sizeLg : styles.sizeMd,
                        !isDeterminate && styles.indeterminate,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    <div
                        className={[styles.fill, toneFillClass[resolvedTone]]
                            .filter(Boolean)
                            .join(' ')}
                        style={isDeterminate ? { width: `${clamped}%` } : undefined}
                    />
                </div>
            </div>
        );
    },
);

/* ------------------------------------------------------------------
 * Segmented variant — fixed N bars, used for stage-based progress
 * and the bands used by EdPasswordInput's strength meter.
 * ------------------------------------------------------------------ */

export interface EdProgressSegmentedProps extends HTMLAttributes<HTMLDivElement> {
    /** Total number of segments. */
    segments: number;
    /** Number of segments to fill. */
    filled: number;
    /** Fill tone for the lit segments. */
    tone?: EdProgressTone;
    /** Accessible name. */
    ariaLabel?: string;
    /** aria-valuetext override — pass the band name ("Fair · 12+ characters"). */
    valueText?: string;
}

/**
 * EdProgressSegmented — fixed-N segment meter. Used for stages and strength bands.
 *
 *   <EdProgressSegmented segments={4} filled={2} tone="warning" ariaLabel="Strength" />
 */
export const EdProgressSegmented = forwardRef<HTMLDivElement, EdProgressSegmentedProps>(
    function EdProgressSegmented(
        { segments, filled, tone = 'brand', ariaLabel, valueText, className, ...rest },
        ref,
    ) {
        const clamped = Math.min(segments, Math.max(0, filled));
        return (
            <div
                ref={ref}
                role="progressbar"
                aria-label={ariaLabel}
                aria-valuemin={0}
                aria-valuemax={segments}
                aria-valuenow={clamped}
                aria-valuetext={valueText}
                className={[styles.seg, className].filter(Boolean).join(' ')}
                {...rest}
            >
                {Array.from({ length: segments }, (_, i) => (
                    <span
                        key={i}
                        className={[
                            styles.segBar,
                            i < clamped && toneFillClass[tone],
                            i < clamped && styles.segBarOn,
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    />
                ))}
            </div>
        );
    },
);
