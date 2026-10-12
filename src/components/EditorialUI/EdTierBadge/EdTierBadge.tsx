import { forwardRef, type HTMLAttributes } from 'react';
import styles from './EdTierBadge.module.scss';

export type EdTier = 1 | 2 | 3;

export interface EdTierBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    /** Model risk tier; `null` renders a dash for "not tiered". */
    tier: EdTier | null;
    /** Accessible name; defaults to "Tier I" … "Tier III" / "Not tiered". */
    ariaLabel?: string;
}

const NUMERAL: Record<EdTier, string> = { 1: 'I', 2: 'II', 3: 'III' };

/**
 * EdTierBadge — a model's risk tier as a roman numeral in a 20px square. Tier I is
 * solid ink (highest scrutiny), II plain, III muted; untiered is a faint dash.
 *
 *   <EdTierBadge tier={1} />
 *   <EdTierBadge tier={null} />
 */
export const EdTierBadge = forwardRef<HTMLSpanElement, EdTierBadgeProps>(function EdTierBadge(
    { tier, ariaLabel, className, ...rest },
    ref,
) {
    const label = ariaLabel ?? (tier ? `Tier ${NUMERAL[tier]}` : 'Not tiered');
    const tone = tier === 1 ? styles.t1 : tier === 2 ? styles.t2 : tier === 3 ? styles.t3 : styles.none;
    return (
        <span
            ref={ref}
            role="img"
            aria-label={label}
            title={label}
            className={[styles.root, tone, className].filter(Boolean).join(' ')}
            {...rest}
        >
            <span aria-hidden="true">{tier ? NUMERAL[tier] : '—'}</span>
        </span>
    );
});
