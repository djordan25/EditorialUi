import {
    forwardRef,
    useRef,
    type HTMLAttributes,
    type KeyboardEvent,
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
     * `single` — mutually-exclusive views; role="radiogroup". One tab stop (the
     * checked chip); arrow keys move and select, Home/End jump to the ends.
     */
    mode?: 'multi' | 'single';
    /** Selected values (multi) or single value in a one-element array (single). */
    selected: string[];
    onSelectedChange: (selected: string[]) => void;
    /** Accessible name for the group. */
    ariaLabel?: string;
    /**
     * How a chip's count is spoken in its accessible name ("Open, 87 items").
     * Pass your own noun, e.g. `(n) => (n === 1 ? '1 model' : `${n} models`)`.
     */
    countLabel?: (count: number) => string;
    /**
     * Render an overflow control after the chips (e.g. a "+N more" button that
     * opens an EdMenu/EdPopover with the remaining filters). Purely presentational
     * here — wire the popover at the call site.
     */
    overflow?: ReactNode;
}

const itemCount = (count: number) => `${count} ${count === 1 ? 'item' : 'items'}`;

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
        {
            chips,
            groups,
            mode = 'multi',
            selected,
            onSelectedChange,
            ariaLabel,
            countLabel = itemCount,
            overflow,
            className,
            ...rest
        },
        ref,
    ) {
        const chipRefs = useRef(new Map<string, HTMLButtonElement>());
        const selectedSet = new Set(selected);
        const isMulti = mode === 'multi';
        const resolvedGroups: EdFilterChipGroup[] = groups ?? [{ chips: chips ?? [] }];

        // Radio group: the checked chip is the one tab stop (the first enabled
        // chip when none is checked); the others are reached with the arrow keys.
        const enabled = resolvedGroups.flatMap((g) => g.chips).filter((c) => !c.disabled);
        const tabStop = isMulti ? undefined : (enabled.find((c) => selectedSet.has(c.value)) ?? enabled[0])?.value;

        const toggle = (chip: EdFilterChip) => {
            if (chip.disabled) return;
            if (isMulti) {
                if (selectedSet.has(chip.value)) onSelectedChange(selected.filter((v) => v !== chip.value));
                else onSelectedChange([...selected, chip.value]);
            } else {
                onSelectedChange([chip.value]);
            }
        };

        const moveInRadioGroup = (event: KeyboardEvent<HTMLButtonElement>, chip: EdFilterChip) => {
            if (event.altKey || event.ctrlKey || event.metaKey || enabled.length === 0) return;
            const at = enabled.findIndex((c) => c.value === chip.value);
            const last = enabled.length - 1;
            let next: EdFilterChip;
            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    next = enabled[at >= last ? 0 : at + 1];
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    next = enabled[at <= 0 ? last : at - 1];
                    break;
                case 'Home':
                    next = enabled[0];
                    break;
                case 'End':
                    next = enabled[last];
                    break;
                default:
                    return;
            }
            event.preventDefault();
            chipRefs.current.get(next.value)?.focus();
            if (!selectedSet.has(next.value)) onSelectedChange([next.value]);
        };

        const labelText = (chip: EdFilterChip): string | undefined => {
            if (typeof chip.label !== 'string') return undefined;
            return typeof chip.count === 'number' ? `${chip.label}, ${countLabel(chip.count)}` : chip.label;
        };

        const renderChip = (chip: EdFilterChip) => {
            const isSel = selectedSet.has(chip.value);
            return (
                <button
                    key={chip.value}
                    ref={(el) => {
                        if (el) chipRefs.current.set(chip.value, el);
                        else chipRefs.current.delete(chip.value);
                    }}
                    type="button"
                    role={isMulti ? 'checkbox' : 'radio'}
                    aria-checked={isSel}
                    aria-label={labelText(chip)}
                    disabled={chip.disabled}
                    tabIndex={isMulti ? undefined : chip.value === tabStop ? 0 : -1}
                    data-selected={isSel || undefined}
                    className={[styles.chip, isSel && styles.chipSelected].filter(Boolean).join(' ')}
                    onClick={() => toggle(chip)}
                    onKeyDown={isMulti ? undefined : (event) => moveInRadioGroup(event, chip)}
                >
                    {chip.dot && <span className={styles.dot} style={{ background: chip.dot }} aria-hidden />}
                    <span className={styles.label}>{chip.label}</span>
                    {typeof chip.count === 'number' && <span className={styles.count} aria-hidden>{chip.count}</span>}
                </button>
            );
        };

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
