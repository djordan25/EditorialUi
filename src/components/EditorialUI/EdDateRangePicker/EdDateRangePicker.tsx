import {
    forwardRef,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './EdDateRangePicker.module.scss';

/* ------------------------------------------------------------------ */
/* Date helpers — ISO strings only (YYYY-MM-DD), no time, no locale.  */
/* ------------------------------------------------------------------ */

export type EdISODate = string; // 'YYYY-MM-DD'
export interface EdDateRange {
    start: EdISODate | null;
    end: EdISODate | null;
}

const pad = (n: number) => String(n).padStart(2, '0');
const toISO = (d: Date): EdISODate => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (s: EdISODate): Date => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
};
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const addMonths = (d: Date, n: number) => { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; };
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const isSameDay = (a: EdISODate, b: EdISODate) => a === b;
const inRange = (day: EdISODate, start: EdISODate, end: EdISODate) => day > start && day < end;

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export interface EdDateRangePreset {
    label: string;
    /** Returns [start, end] as ISO dates. */
    range: () => [EdISODate, EdISODate];
}

/** The recommended preset set from the spec. */
export function defaultPresets(today = new Date()): EdDateRangePreset[] {
    const t = toISO(today);
    const startOfQuarter = () => { const q = Math.floor(today.getMonth() / 3); return toISO(new Date(today.getFullYear(), q * 3, 1)); };
    const startOfYear = () => toISO(new Date(today.getFullYear(), 0, 1));
    return [
        { label: 'Today', range: () => [t, t] },
        { label: 'Yesterday', range: () => { const y = toISO(addDays(today, -1)); return [y, y]; } },
        { label: 'Last 7 days', range: () => [toISO(addDays(today, -6)), t] },
        { label: 'Last 14 days', range: () => [toISO(addDays(today, -13)), t] },
        { label: 'Last 30 days', range: () => [toISO(addDays(today, -29)), t] },
        { label: 'This quarter', range: () => [startOfQuarter(), t] },
        { label: 'Year to date', range: () => [startOfYear(), t] },
    ];
}

export interface EdDateRangePickerProps {
    label?: ReactNode;
    /** Controlled range. */
    value?: EdDateRange;
    defaultValue?: EdDateRange;
    onChange?: (range: EdDateRange) => void;

    /**
     * `range` (default) — two-click start→end range.
     * `day` — single click commits a same-day `[d, d]` range and closes (a day stepper).
     */
    mode?: 'range' | 'day';
    /**
     * Preset shortcuts shown at the left. Defaults to the recommended set in `range`
     * mode and to none in `day` mode. Pass `[]` for an explicit no-preset picker.
     */
    presets?: EdDateRangePreset[];
    placeholder?: string;
    /** Constrain selectable dates. */
    min?: EdISODate;
    max?: EdISODate;

    hint?: ReactNode;
    error?: ReactNode;
    disabled?: boolean;
    fullWidth?: boolean;
    wrapperClassName?: string;
}

/**
 * EdDateRangePicker — two-month calendar with preset shortcuts. ISO dates only
 * (YYYY-MM-DD, mono, `→` separator), no time-of-day. When a preset matches the
 * selected range exactly, the trigger shows the preset name instead of literal dates.
 *
 *   <EdDateRangePicker
 *     label="Created between"
 *     value={range}
 *     onChange={setRange}
 *   />
 */
export const EdDateRangePicker = forwardRef<HTMLButtonElement, EdDateRangePickerProps>(
    function EdDateRangePicker(
        {
            label,
            value,
            defaultValue = { start: null, end: null },
            onChange,
            mode = 'range',
            presets,
            placeholder,
            min,
            max,
            hint,
            error,
            disabled,
            fullWidth = false,
            wrapperClassName,
        },
        ref,
    ) {
        const resolvedPresets = useMemo(
            () => presets ?? (mode === 'day' ? [] : defaultPresets()),
            [presets, mode],
        );
        const resolvedPlaceholder =
            placeholder ?? (mode === 'day' ? 'Select date…' : 'Select date range…');

        const [internal, setInternal] = useState<EdDateRange>(defaultValue);
        const range = value !== undefined ? value : internal;

        const [open, setOpen] = useState(false);
        const [viewMonth, setViewMonth] = useState<Date>(() =>
            range.start ? startOfMonth(fromISO(range.start)) : startOfMonth(new Date()),
        );
        // Pending selection while picking start→end.
        const [pendingStart, setPendingStart] = useState<EdISODate | null>(null);

        const setRange = (next: EdDateRange) => {
            if (value === undefined) setInternal(next);
            onChange?.(next);
        };

        const matchedPreset = useMemo(() => {
            if (!range.start || !range.end) return undefined;
            return resolvedPresets.find((p) => {
                const [s, e] = p.range();
                return s === range.start && e === range.end;
            });
        }, [range, resolvedPresets]);

        const triggerText = matchedPreset
            ? matchedPreset.label
            : range.start && range.end
            ? range.start === range.end
                ? range.start
                : `${range.start} → ${range.end}`
            : range.start
            ? `${range.start} → …`
            : null;

        const handleDayClick = (iso: EdISODate) => {
            if (min && iso < min) return;
            if (max && iso > max) return;
            if (mode === 'day') {
                // Single click commits a same-day range and closes (day stepper).
                setRange({ start: iso, end: iso });
                setPendingStart(null);
                setOpen(false);
                return;
            }
            if (!pendingStart) {
                setPendingStart(iso);
                setRange({ start: iso, end: null });
            } else {
                const [start, end] = iso < pendingStart ? [iso, pendingStart] : [pendingStart, iso];
                setRange({ start, end });
                setPendingStart(null);
                setOpen(false);
            }
        };

        const applyPreset = (preset: EdDateRangePreset) => {
            const [start, end] = preset.range();
            setRange({ start, end });
            setPendingStart(null);
            setViewMonth(startOfMonth(fromISO(start)));
            setOpen(false);
        };

        return (
            <div className={[styles.root, fullWidth && styles.fullWidth, wrapperClassName].filter(Boolean).join(' ')}>
                {/* Visual label only — not associated to the trigger, so the trigger's
                    accessible name stays its value (the selected range / placeholder). */}
                {label && <span className={styles.label}>{label}</span>}
                <Popover.Root open={open && !disabled} onOpenChange={setOpen}>
                    <Popover.Trigger asChild>
                        <button
                            ref={ref}
                            type="button"
                            disabled={disabled}
                            data-state={open ? 'open' : 'closed'}
                            aria-invalid={error ? true : undefined}
                            className={[styles.trigger, error && styles.triggerError].filter(Boolean).join(' ')}
                        >
                            <CalendarIcon size={14} strokeWidth={1.8} className={styles.calIcon} aria-hidden />
                            <span className={[styles.value, !triggerText && styles.placeholder].filter(Boolean).join(' ')}>
                                {triggerText ?? resolvedPlaceholder}
                            </span>
                            <ChevronDown size={14} strokeWidth={1.8} className={styles.chev} aria-hidden />
                        </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content align="start" sideOffset={4} className={styles.panel}>
                            {resolvedPresets.length > 0 && (
                                <div className={styles.presets}>
                                    {resolvedPresets.map((preset) => (
                                        <button
                                            key={preset.label}
                                            type="button"
                                            aria-pressed={matchedPreset?.label === preset.label}
                                            className={[styles.presetItem, matchedPreset?.label === preset.label && styles.presetActive]
                                                .filter(Boolean)
                                                .join(' ')}
                                            onClick={() => applyPreset(preset)}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className={styles.calendars}>
                                <CalendarMonth
                                    month={viewMonth}
                                    range={range}
                                    pendingStart={pendingStart}
                                    min={min}
                                    max={max}
                                    onDayClick={handleDayClick}
                                    onPrev={() => setViewMonth((m) => addMonths(m, -1))}
                                    showPrev
                                />
                                <CalendarMonth
                                    month={addMonths(viewMonth, 1)}
                                    range={range}
                                    pendingStart={pendingStart}
                                    min={min}
                                    max={max}
                                    onDayClick={handleDayClick}
                                    onNext={() => setViewMonth((m) => addMonths(m, 1))}
                                    showNext
                                />
                            </div>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
                {(error || hint) && (
                    <p className={[styles.hint, error && styles.hintError].filter(Boolean).join(' ')} role={error ? 'alert' : undefined}>
                        {error || hint}
                    </p>
                )}
            </div>
        );
    },
);

/* ------------------------------------------------------------------ */
/* Single month grid.                                                 */
/* ------------------------------------------------------------------ */

interface CalendarMonthProps {
    month: Date;
    range: EdDateRange;
    pendingStart: EdISODate | null;
    min?: EdISODate;
    max?: EdISODate;
    onDayClick: (iso: EdISODate) => void;
    onPrev?: () => void;
    onNext?: () => void;
    showPrev?: boolean;
    showNext?: boolean;
}

function CalendarMonth({ month, range, pendingStart, min, max, onDayClick, onPrev, onNext, showPrev, showNext }: CalendarMonthProps) {
    const todayISO = toISO(new Date());
    const first = startOfMonth(month);
    // Monday-first offset.
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

    const cells: { iso: EdISODate; day: number; muted: boolean }[] = [];
    // Leading days from previous month.
    for (let i = 0; i < offset; i++) {
        const d = addDays(first, i - offset);
        cells.push({ iso: toISO(d), day: d.getDate(), muted: true });
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(month.getFullYear(), month.getMonth(), day);
        cells.push({ iso: toISO(d), day, muted: false });
    }
    // Trailing to fill the last week.
    while (cells.length % 7 !== 0) {
        const last = fromISO(cells[cells.length - 1].iso);
        const d = addDays(last, 1);
        cells.push({ iso: toISO(d), day: d.getDate(), muted: true });
    }

    const start = range.start;
    const end = range.end ?? (pendingStart && range.start ? null : range.end);

    return (
        <div className={styles.calPanel}>
            <div className={styles.calTitle}>
                <span className={styles.calNav}>
                    {showPrev && (
                        <button type="button" className={styles.navBtn} aria-label="Previous month" onClick={onPrev}>
                            <ChevronLeft size={14} strokeWidth={1.8} aria-hidden />
                        </button>
                    )}
                </span>
                <span className={styles.calMonthLabel}>{MONTH_NAMES[month.getMonth()]} {month.getFullYear()}</span>
                <span className={styles.calNav}>
                    {showNext && (
                        <button type="button" className={styles.navBtn} aria-label="Next month" onClick={onNext}>
                            <ChevronRight size={14} strokeWidth={1.8} aria-hidden />
                        </button>
                    )}
                </span>
            </div>
            <div className={styles.grid} role="grid" aria-label={`${MONTH_NAMES[month.getMonth()]} ${month.getFullYear()}`}>
                <div className={styles.weekHeader} role="row">
                    {WEEKDAYS.map((w, i) => (
                        <span key={i} role="columnheader" className={styles.weekday}>{w}</span>
                    ))}
                </div>
                {Array.from({ length: cells.length / 7 }).map((_, weekIdx) => (
                    <div key={weekIdx} className={styles.week} role="row">
                        {cells.slice(weekIdx * 7, weekIdx * 7 + 7).map((cell) => {
                            const isStart = !!start && isSameDay(cell.iso, start);
                            const isEnd = !!end && isSameDay(cell.iso, end);
                            const isInRange = !!start && !!end && inRange(cell.iso, start, end);
                            const disabled = (min && cell.iso < min) || (max && cell.iso > max);
                            const isToday = cell.iso === todayISO;
                            return (
                                <button
                                    key={cell.iso}
                                    type="button"
                                    role="gridcell"
                                    disabled={!!disabled}
                                    aria-selected={isStart || isEnd}
                                    aria-current={isToday ? 'date' : undefined}
                                    tabIndex={isStart || (!start && isToday) ? 0 : -1}
                                    className={[
                                        styles.day,
                                        cell.muted && styles.dayMuted,
                                        isInRange && styles.dayInRange,
                                        (isStart || isEnd) && styles.dayEndpoint,
                                        isStart && styles.dayStart,
                                        isEnd && styles.dayEnd,
                                        isToday && styles.dayToday,
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    onClick={() => onDayClick(cell.iso)}
                                >
                                    {cell.day}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
