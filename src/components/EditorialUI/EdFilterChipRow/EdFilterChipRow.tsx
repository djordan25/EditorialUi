import {
    forwardRef,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import styles from './EdFilterChipRow.module.scss';

export interface EdFilterChip {
    /** Stable value. */
    value: string;
    /** Visible label. */
    label: ReactNode;
    /** Optional count badge — folded into the accessible name. */
    count?: number;
    /** Optional leading status dot (CSS color). */
    dot?: string;
    disabled?: boolean;
}

export type EdFilterChipGroup = {
    /** A visual divider precedes this group's chips. */
    divider?: boolean;
    chips: EdFilterChip[];
};

export interface EdFilterChipRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /**
     * Either a flat chip list, or grouped chips (each group optionally preceded
     * by a hairline divider).
     */
    chips?: EdFilterChip[];
    groups?: EdFilterChipGroup[];
    /**
     * `multi` (default) — additive filters; role="group" of checkboxes.
     * `single` — mutually-exclusive views; role="radiogroup".
     */
    mode?: 'multi' | 'single';
    /** Selected values (multi) or single value in a one-element array (single). */
    selected: string[];
    onSelectedChange: (selected: string[]) => void;
    /** Accessible name for the group. */
    ariaLabel?: string;
    /**
     * Render an overflow control after the chips (e.g. a "+N more" button that
     * opens an EdMenu/EdPopover with the remaining filters). Purely presentational
     * here — wire the popover at the call site.
     */
    overflow?: ReactNode;
}

const labelText = (chip: EdFilterChip): string | undefined => {
    if (typeof chip.label !== 'string') return undefined;
    return typeof chip.count === 'number' ? `${chip.label}, ${chip.count} items` : chip.label;
};

/**
 * EdFilterChipRow — horizontal row of pill toggles for fast filtering above a
 * table. Multi-select (additive) by default; single-select for mutually-exclusive
 * views. For large/unfamiliar value spaces use EdComboBox (multi); for 2–4 fixed
 * view modes use a segmented control.
 *
 *   <EdFilterChipRow
 *     ariaLabel="Status filters"
 *     selected={status}
 *     onSelectedChange={setStatus}
 *     chips={[
 *       { value: 'all', label: 'All', count: 312 },
 *       { value: 'open', label: 'Open', count: 87 },
 *     ]}
 *   />
 */
export const EdFilterChipRow = forwardRef<HTMLDivElement, EdFilterChipRowProps>(
    function EdFilterChipRow(
        { chips, groups, mode = 'multi', selected, onSelectedChange, ariaLabel, overflow, className, ...rest },
        ref,
    ) {
        const selectedSet = new Set(selected);
        const isMulti = mode === 'multi';

        const toggle = (chip: EdFilterChip) => {
            if (chip.disabled) return;
            if (isMulti) {
                if (selectedSet.has(chip.value)) onSelectedChange(selected.filter((v) => v !== chip.value));
                else onSelectedChange([...selected, chip.value]);
            } else {
                onSelectedChange([chip.value]);
            }
        };

        const renderChip = (chip: EdFilterChip) => {
            const isSel = selectedSet.has(chip.value);
            return (
                <button
                    key={chip.value}
                    type="button"
                    role={isMulti ? 'checkbox' : 'radio'}
                    aria-checked={isSel}
                    aria-label={labelText(chip)}
                    disabled={chip.disabled}
                    data-selected={isSel || undefined}
                    className={[styles.chip, isSel && styles.chipSelected].filter(Boolean).join(' ')}
                    onClick={() => toggle(chip)}
                >
                    {chip.dot && <span className={styles.dot} style={{ background: chip.dot }} aria-hidden />}
                    <span className={styles.label}>{chip.label}</span>
                    {typeof chip.count === 'number' && <span className={styles.count} aria-hidden>{chip.count}</span>}
                </button>
            );
        };

        const resolvedGroups: EdFilterChipGroup[] = groups ?? [{ chips: chips ?? [] }];

        return (
            <div
                ref={ref}
                role={isMulti ? 'group' : 'radiogroup'}
                aria-label={ariaLabel}
                className={[styles.root, className].filter(Boolean).join(' ')}
                {...rest}
            >
                {resolvedGroups.map((group, gi) => (
                    <div key={gi} className={styles.group}>
                        {group.divider && gi > 0 && <span className={styles.divider} aria-hidden />}
                        {group.chips.map(renderChip)}
                    </div>
                ))}
                {overflow && <div className={styles.overflow}>{overflow}</div>}
            </div>
        );
    },
);
