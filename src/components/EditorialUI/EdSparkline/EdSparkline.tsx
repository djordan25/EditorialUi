import { forwardRef, type SVGAttributes } from 'react';
import styles from './EdSparkline.module.scss';

export type EdSparklineTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

export interface EdSparklineProps extends Omit<SVGAttributes<SVGSVGElement>, 'values' | 'children'> {
    /** The series, oldest first. `null` is a gap: the line breaks rather than inventing a value. */
    values: (number | null)[];
    /** Accessible summary, e.g. "p95 run time, last 30 days". The chart is role="img". */
    ariaLabel: string;
    /** CSS pixels. Defaults 80 × 24 (a table cell). */
    width?: number;
    height?: number;
    tone?: EdSparklineTone;
    /** Fill a faint area under the line. Default true. */
    area?: boolean;
}

export interface SparklineSegment {
    points: [number, number][];
}

/**
 * Lays the series out in a width × height box: runs of non-null values become
 * separate segments (so gaps stay gaps), y is scaled between the series' min and
 * max with a little headroom, and a flat series sits mid-height.
 */
export function sparklineSegments(values: (number | null)[], width: number, height: number, inset = 2): SparklineSegment[] {
    const present = values.filter((v): v is number => v !== null && Number.isFinite(v));
    if (present.length === 0 || values.length === 0) return [];
    const min = Math.min(...present);
    const max = Math.max(...present);
    const span = max - min;
    const step = values.length > 1 ? width / (values.length - 1) : 0;
    const y = (v: number) =>
        span === 0 ? height / 2 : inset + (1 - (v - min) / span) * (height - inset * 2);

    const segments: SparklineSegment[] = [];
    let current: [number, number][] = [];
    values.forEach((v, i) => {
        if (v === null || !Number.isFinite(v)) {
            if (current.length) segments.push({ points: current });
            current = [];
            return;
        }
        current.push([values.length > 1 ? i * step : width / 2, y(v)]);
    });
    if (current.length) segments.push({ points: current });
    return segments;
}

const path = (points: [number, number][]) =>
    points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');

/**
 * EdSparkline — a word-sized trend line. Gaps in the data stay gaps; a single
 * point draws as a dot.
 *
 *   <EdSparkline values={dailyP95} ariaLabel="p95 run time, last 30 days" />
 *   <EdSparkline values={series} width={460} height={36} tone="warning" />
 */
export const EdSparkline = forwardRef<SVGSVGElement, EdSparklineProps>(function EdSparkline(
    { values, ariaLabel, width = 80, height = 24, tone = 'brand', area = true, className, ...rest },
    ref,
) {
    const segments = sparklineSegments(values, width, height);
    return (
        <svg
            ref={ref}
            role="img"
            aria-label={ariaLabel}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className={[styles.root, styles[tone], className].filter(Boolean).join(' ')}
            {...rest}
        >
            {segments.length === 0 && (
                <line x1={0} x2={width} y1={height / 2} y2={height / 2} className={styles.empty} />
            )}
            {segments.map((s, i) =>
                s.points.length === 1 ? (
                    <circle key={i} cx={s.points[0][0]} cy={s.points[0][1]} r={1.5} className={styles.point} />
                ) : (
                    <g key={i}>
                        {area && (
                            <path
                                className={styles.area}
                                d={`${path(s.points)} L ${s.points[s.points.length - 1][0].toFixed(2)} ${height} L ${s.points[0][0].toFixed(2)} ${height} Z`}
                            />
                        )}
                        <path className={styles.line} d={path(s.points)} />
                    </g>
                ),
            )}
        </svg>
    );
});
