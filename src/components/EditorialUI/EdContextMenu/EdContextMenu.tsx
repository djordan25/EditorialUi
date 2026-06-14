import {
    forwardRef,
    type ReactNode,
} from 'react';
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { Check, ChevronRight } from 'lucide-react';
import type { EdMenuEntry, EdMenuActionItem } from '../EdMenu';
import styles from '../EdMenu/EdMenu.module.scss';

export type { EdMenuEntry as EdContextMenuEntry };

export interface EdContextMenuProps {
    /** The right-click target — any element/subtree. */
    children: ReactNode;
    /** Menu entries — same model as EdMenu. */
    items: EdMenuEntry[];
    /** Min width of the content panel in px. */
    minWidth?: number;
    /** className applied to the trigger wrapper. */
    className?: string;
}

/**
 * EdContextMenu — right-click menu for direct manipulation of an entity. Same
 * look + item model as EdMenu, different trigger. Reserve for power-user
 * accelerators: every action MUST also be reachable via the visible UI.
 *
 * Keyboard equivalent (Shift+F10 / Menu key on the focused target) is provided
 * by Radix ContextMenu. Long-press triggers on touch.
 *
 *   <EdContextMenu items={rowActions}>
 *     <tr>…</tr>
 *   </EdContextMenu>
 */
export const EdContextMenu = forwardRef<HTMLDivElement, EdContextMenuProps>(function EdContextMenu(
    { children, items, minWidth = 200, className },
    ref,
) {
    return (
        <RadixContextMenu.Root>
            <RadixContextMenu.Trigger ref={ref} className={className}>
                {children}
            </RadixContextMenu.Trigger>
            <RadixContextMenu.Portal>
                <RadixContextMenu.Content className={styles.content} style={{ minWidth }} collisionPadding={8}>
                    {items.map((entry, i) => renderContextEntry(entry, i))}
                </RadixContextMenu.Content>
            </RadixContextMenu.Portal>
        </RadixContextMenu.Root>
    );
});

/* ContextMenu uses its own Radix primitives, so we render with the ContextMenu
   namespace while reusing EdMenu's stylesheet for identical visuals. */
function renderContextEntry(entry: EdMenuEntry, index: number): ReactNode {
    switch (entry.kind) {
        case 'separator':
            return <RadixContextMenu.Separator key={entry.id ?? `sep-${index}`} className={styles.separator} />;
        case 'label':
            return (
                <RadixContextMenu.Label key={entry.id ?? `lbl-${index}`} className={styles.groupLabel}>
                    {entry.label}
                </RadixContextMenu.Label>
            );
        case 'checkbox':
            return (
                <RadixContextMenu.CheckboxItem
                    key={entry.id}
                    checked={entry.checked}
                    onCheckedChange={entry.onCheckedChange}
                    disabled={entry.disabled}
                    className={styles.item}
                    onSelect={(e) => e.preventDefault()}
                >
                    <span className={styles.check}>
                        <RadixContextMenu.ItemIndicator>
                            <Check size={12} strokeWidth={2.5} aria-hidden />
                        </RadixContextMenu.ItemIndicator>
                    </span>
                    <span className={styles.label}>{entry.label}</span>
                </RadixContextMenu.CheckboxItem>
            );
        case 'submenu':
            return (
                <RadixContextMenu.Sub key={entry.id}>
                    <RadixContextMenu.SubTrigger disabled={entry.disabled} className={styles.item}>
                        {entry.icon && <span className={styles.icon} aria-hidden>{entry.icon}</span>}
                        <span className={styles.label}>{entry.label}</span>
                        <span className={styles.subChevron} aria-hidden>
                            <ChevronRight size={14} strokeWidth={1.8} />
                        </span>
                    </RadixContextMenu.SubTrigger>
                    <RadixContextMenu.Portal>
                        <RadixContextMenu.SubContent className={styles.content} sideOffset={2} alignOffset={-4}>
                            {entry.items.map((sub, j) => renderContextEntry(sub, j))}
                        </RadixContextMenu.SubContent>
                    </RadixContextMenu.Portal>
                </RadixContextMenu.Sub>
            );
        default: {
            const item = entry as EdMenuActionItem;
            return (
                <RadixContextMenu.Item
                    key={item.id}
                    disabled={item.disabled}
                    aria-label={item.ariaLabel}
                    onSelect={() => item.onSelect?.()}
                    className={[styles.item, item.danger && styles.danger].filter(Boolean).join(' ')}
                >
                    {item.icon && <span className={styles.icon} aria-hidden>{item.icon}</span>}
                    <span className={styles.label}>{item.label}</span>
                    {item.meta && <span className={styles.meta}>{item.meta}</span>}
                    {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
                </RadixContextMenu.Item>
            );
        }
    }
}
