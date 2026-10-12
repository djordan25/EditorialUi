import { forwardRef, type HTMLAttributes } from 'react';
import styles from './EdStatusDot.module.scss';

export type EdStatusDotTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface EdStatusDotProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    tone?: EdStatusDotTone;
    /**
     * Accessible name. Omit only when adjacent text already says the same thing
     * (the dot is then decorative and hidden from assistive technology).
     */
    label?: string;
}

/**
 * EdStatusDot — an 8px state dot that sits beside a label ("all clear", a model
 * name in a list). Color is never the only signal: pair it with text, or give it
 * a `label`.
 *
 *   <EdStatusDot tone="success" /> all systems nominal
 *   <EdStatusDot tone="danger" label="Failing validation" />
 */
export const EdStatusDot = forwardRef<HTMLSpanElement, EdStatusDotProps>(function EdStatusDot(
    { tone = 'neutral', label, className, ...rest },
    ref,
) {
    return (
        <span
            ref={ref}
            {...(label ? { role: 'img', 'aria-label': label, title: label } : { 'aria-hidden': true })}
            className={[styles.root, styles[tone], className].filter(Boolean).join(' ')}
            {...rest}
        />
    );
});
