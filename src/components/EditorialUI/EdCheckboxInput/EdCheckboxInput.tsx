import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    type ChangeEvent,
    type InputHTMLAttributes,
    type MouseEvent,
} from 'react';
import styles from './EdCheckboxInput.module.scss';

export type EdCheckboxInputSize = 'sm' | 'md';

export interface EdCheckboxInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    /** Compact size for dense table cells. Default 'md' (16px). */
    size?: EdCheckboxInputSize;
    /** Indeterminate (mixed) visual — set imperatively on the native input. */
    indeterminate?: boolean;
}

/**
 * EdCheckboxInput — a bare, styled native `<input type="checkbox">`.
 *
 * Unlike EdCheckbox (a Radix control that renders its own wrapping `<label>` +
 * description/hint and emits a boolean `onCheckedChange`), this renders ONLY the
 * input: the caller supplies their own `<label>` (via `id`/`htmlFor` or a wrapper)
 * and reads a real `ChangeEvent` (`evt.target.checked`). Use it inside table rows,
 * custom controls, or anywhere a native input is required. Toggle brand color via
 * the theme's `accent-color`.
 *
 *   <label>
 *     <EdCheckboxInput checked={on} onChange={(e) => setOn(e.target.checked)} /> Include
 *   </label>
 */
export const EdCheckboxInput = forwardRef<HTMLInputElement, EdCheckboxInputProps>(
    function EdCheckboxInput(
        { size = 'md', indeterminate = false, readOnly = false, className, onClick, onChange, ...rest },
        ref,
    ) {
        const innerRef = useRef<HTMLInputElement | null>(null);
        useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

        // `indeterminate` is a DOM property, not an attribute — set it imperatively.
        useEffect(() => {
            if (innerRef.current) innerRef.current.indeterminate = indeterminate;
        }, [indeterminate]);

        // Read-only: focusable + announced, but toggling is prevented. preventDefault
        // stops the toggle in browsers; swallowing onChange covers jsdom (which still
        // fires change on a prevent-defaulted checkbox click).
        const handleClick = (e: MouseEvent<HTMLInputElement>) => {
            if (readOnly) e.preventDefault();
            onClick?.(e);
        };
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (readOnly) return;
            onChange?.(e);
        };

        return (
            <input
                {...rest}
                ref={innerRef}
                type="checkbox"
                aria-readonly={readOnly || undefined}
                className={[styles.checkbox, size === 'sm' && styles.sm, className]
                    .filter(Boolean)
                    .join(' ')}
                onClick={handleClick}
                onChange={handleChange}
            />
        );
    },
);
