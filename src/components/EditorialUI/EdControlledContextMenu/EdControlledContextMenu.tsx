import { type ReactNode } from 'react';
import * as RadixMenu from '@radix-ui/react-dropdown-menu';
import { renderEntry } from '../EdMenu/EdMenu';
import type { EdMenuEntry } from '../EdMenu';
import menuStyles from '../EdMenu/EdMenu.module.scss';
import styles from './EdControlledContextMenu.module.scss';

/** A non-interactive key/value stats block rendered above the actions. */
export interface EdContextMenuInfoEntry {
    kind: 'info';
    id?: string;
    rows: { label: ReactNode; value: ReactNode }[];
}

export type EdControlledContextMenuEntry = EdMenuEntry | EdContextMenuInfoEntry;

export interface EdControlledContextMenuProps {
    /** Whether the menu is open (externally controlled). */
    open: boolean;
    /**
     * Viewport coordinate to anchor the menu at (e.g. captured from `onContextMenu`'s
     * `clientX`/`clientY`). `null` keeps the menu closed.
     */
    position: { top: number; left: number } | null;
    /** Called when the menu requests to close (Escape, outside-click, or after a selection). */
    onClose: () => void;
    /** Menu entries — the EdMenu item model plus an optional `info` stats block. */
    items: EdControlledContextMenuEntry[];
    /** Accessible name for the menu. */
    ariaLabel?: string;
    /** Min width of the content panel in px. */
    minWidth?: number;
    className?: string;
}

/**
 * EdControlledContextMenu — a context menu opened programmatically at a screen
 * coordinate and controlled externally (`open` / `position` / `onClose`), rather than
 * by right-clicking a trigger (for that, use EdContextMenu). One shared instance can be
 * rendered at page root and positioned from a captured mouse coordinate. Supports an
 * `info` entry — a non-interactive key/value block above the actions. Built on Radix
 * DropdownMenu (via an invisible coordinate-anchored trigger) so it keeps full menu
 * keyboard navigation, focus management, and edge-flip positioning.
 *
 *   const [menu, setMenu] = useState<{ pos: { top: number; left: number } } | null>(null);
 *   <div onContextMenu={(e) => { e.preventDefault(); setMenu({ pos: { top: e.clientY, left: e.clientX } }); }}>…</div>
 *   <EdControlledContextMenu
 *     open={!!menu} position={menu?.pos ?? null} onClose={() => setMenu(null)}
 *     items={[{ kind: 'info', rows: [{ label: 'BVN', value: id }] }, { kind: 'separator' }, { id: 'go', label: 'Open', onSelect }]}
 *   />
 */
export function EdControlledContextMenu({
    open,
    position,
    onClose,
    items,
    ariaLabel,
    minWidth = 200,
    className,
}: EdControlledContextMenuProps) {
    const isOpen = open && position !== null;

    return (
        <RadixMenu.Root
            open={isOpen}
            onOpenChange={(next) => {
                if (!next) onClose();
            }}
        >
            <RadixMenu.Trigger asChild>
                <span
                    aria-hidden
                    style={{
                        position: 'fixed',
                        top: position?.top ?? 0,
                        left: position?.left ?? 0,
                        width: 0,
                        height: 0,
                        pointerEvents: 'none',
                    }}
                />
            </RadixMenu.Trigger>
            <RadixMenu.Portal>
                <RadixMenu.Content
                    aria-label={ariaLabel}
                    align="start"
                    side="bottom"
                    sideOffset={0}
                    collisionPadding={8}
                    className={[menuStyles.content, className].filter(Boolean).join(' ')}
                    style={{ minWidth }}
                    // The anchor span is a stable node whose inline top/left change when
                    // `position` updates while the menu stays open (e.g. one shared menu
                    // re-anchored to a new cell). "always" re-measures each frame so the
                    // panel follows the new coordinate instead of sticking to the old one.
                    updatePositionStrategy="always"
                    // The consumer owns focus after close (the anchor is an invisible span).
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    {items.map((entry, i) =>
                        entry.kind === 'info' ? (
                            <div
                                key={entry.id ?? `info-${i}`}
                                className={styles.info}
                                role="group"
                            >
                                {entry.rows.map((row, j) => (
                                    <div key={j} className={styles.infoRow}>
                                        <span className={styles.infoLabel}>{row.label}</span>
                                        <span className={styles.infoValue}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            renderEntry(entry, i)
                        ),
                    )}
                </RadixMenu.Content>
            </RadixMenu.Portal>
        </RadixMenu.Root>
    );
}
