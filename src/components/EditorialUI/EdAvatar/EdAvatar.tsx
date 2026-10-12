import { forwardRef, type HTMLAttributes } from 'react';
import styles from './EdAvatar.module.scss';

export type EdAvatarSize = 'sm' | 'md';

export interface EdAvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    /** The person's name. Drives the initials and the accessible name. */
    name: string;
    /** Explicit initials (max 2 characters shown); derived from `name` when omitted. */
    initials?: string;
    /** `sm` 22px (default — rows, toolbars) or `md` 28px. */
    size?: EdAvatarSize;
}

/** "Anika Rao" → "AR"; "Priya" → "P"; empty → "?". */
export function initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    const first = parts[0][0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
    return (first + last).toUpperCase();
}

/**
 * EdAvatar — a person as initials in a circle. No photos: the ledger look keeps
 * people as quiet as the rest of the data.
 *
 *   <EdAvatar name="Anika Rao" />
 *   <EdAvatar name="Henrik Lindqvist" size="md" />
 */
export const EdAvatar = forwardRef<HTMLSpanElement, EdAvatarProps>(function EdAvatar(
    { name, initials, size = 'sm', className, ...rest },
    ref,
) {
    const text = (initials ?? initialsOf(name)).slice(0, 2);
    return (
        <span
            ref={ref}
            role="img"
            aria-label={name}
            title={name}
            className={[styles.root, size === 'md' ? styles.md : styles.sm, className].filter(Boolean).join(' ')}
            {...rest}
        >
            <span aria-hidden="true">{text}</span>
        </span>
    );
});
