import {
    forwardRef,
    type ReactNode,
} from 'react';
import * as RadixMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight } from 'lucide-react';
import styles from './EdMenu.module.scss';

/* ------------------------------------------------------------------ */
/* Item model — shared shape used by EdMenu and EdContextMenu.         */
/* ------------------------------------------------------------------ */

export interface EdMenuActionItem {
    kind?: 'item';
    /** Stable key. */
    id: string;
    label: ReactNode;
    /** Optional leading icon. */
    icon?: ReactNode;
    /** Optional keyboard-shortcut hint (display only). */
    shortcut?: ReactNode;
    /** Right-aligned mono metadata (counts, status). */
    meta?: ReactNode;
    disabled?: boolean;
    /** Destructive styling — danger tone. Convention: place at the bottom. */
    danger?: boolean;
    /** Invoke handler. */
    onSelect?: () => void;
    /**
     * REQUIRED for destructive items: an explicit accessible label that names
     * the entity, e.g. "Delete finding F-2438".
     */
    ariaLabel?: string;
}

export interface EdMenuCheckboxItem {
    kind: 'checkbox';
    id: string;
    label: ReactNode;
    checked: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
}

export interface EdMenuSeparator {
    kind: 'separator';
    id?: string;
}

export interface EdMenuGroupLabel {
    kind: 'label';
    id?: string;
    label: ReactNode;
}

export interface EdMenuSubmenu {
    kind: 'submenu';
    id: string;
    label: ReactNode;
    icon?: ReactNode;
    items: EdMenuEntry[];
    disabled?: boolean;
}

export type EdMenuEntry =
    | EdMenuActionItem
    | EdMenuCheckboxItem
    | EdMenuSeparator
    | EdMenuGroupLabel
    | EdMenuSubmenu;

export interface EdMenuProps {
    /** The trigger element — a button, icon button, avatar, etc. */
    trigger: ReactNode;
    /** Menu entries. */
    items: EdMenuEntry[];
    /** Alignment relative to the trigger. */
    align?: 'start' | 'center' | 'end';
    /** Side of the trigger. */
    side?: 'top' | 'bottom' | 'left' | 'right';
    /** Controlled open. */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Min width of the content panel in px. */
    minWidth?: number;
}

/**
 * EdMenu — anchored dropdown of command targets (actions, not selections).
 * Built on Radix DropdownMenu. For value-picking use EdSelect/EdComboBox;
 * for right-click use EdContextMenu (which shares this item model).
 *
 *   <EdMenu
 *     trigger={<EdButton variant="secondary" trailingIcon={<EdIcon name="ChevronDown" />}>Actions</EdButton>}
 *     items={[
 *       { id: 'close', label: 'Close finding', icon: <EdIcon name="CheckCheck" />, shortcut: '⌘↩', onSelect: close },
 *       { kind: 'separator' },
 *       { id: 'delete', label: 'Delete finding', danger: true, ariaLabel: 'Delete finding F-2438', onSelect: del },
 *     ]}
 *   />
 */
export const EdMenu = forwardRef<HTMLButtonElement, EdMenuProps>(function EdMenu(
    { trigger, items, align = 'start', side = 'bottom', open, defaultOpen, onOpenChange, minWidth = 200 },
    ref,
) {
    return (
        <RadixMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
            <RadixMenu.Trigger ref={ref} asChild>
                {trigger}
            </RadixMenu.Trigger>
            <RadixMenu.Portal>
                <RadixMenu.Content
                    align={align}
                    side={side}
                    sideOffset={4}
                    collisionPadding={8}
                    className={styles.content}
                    style={{ minWidth }}
                >
                    {items.map((entry, i) => renderEntry(entry, i))}
                </RadixMenu.Content>
            </RadixMenu.Portal>
        </RadixMenu.Root>
    );
});

/* Shared renderer — also imported by EdContextMenu via the namespace adapter. */
export function renderEntry(entry: EdMenuEntry, index: number): ReactNode {
    switch (entry.kind) {
        case 'separator':
            return <RadixMenu.Separator key={entry.id ?? `sep-${index}`} className={styles.separator} />;
        case 'label':
            return (
                <RadixMenu.Label key={entry.id ?? `lbl-${index}`} className={styles.groupLabel}>
                    {entry.label}
                </RadixMenu.Label>
            );
        case 'checkbox':
            return (
                <RadixMenu.CheckboxItem
                    key={entry.id}
                    checked={entry.checked}
                    onCheckedChange={entry.onCheckedChange}
                    disabled={entry.disabled}
                    className={styles.item}
                    onSelect={(e) => e.preventDefault()} /* keep menu open on toggle */
                >
                    <span className={styles.check}>
                        <RadixMenu.ItemIndicator>
                            <Check size={12} strokeWidth={2.5} aria-hidden />
                        </RadixMenu.ItemIndicator>
                    </span>
                    <span className={styles.label}>{entry.label}</span>
                </RadixMenu.CheckboxItem>
            );
        case 'submenu':
            return (
                <RadixMenu.Sub key={entry.id}>
                    <RadixMenu.SubTrigger disabled={entry.disabled} className={styles.item}>
                        {entry.icon && <span className={styles.icon} aria-hidden>{entry.icon}</span>}
                        <span className={styles.label}>{entry.label}</span>
                        <span className={styles.subChevron} aria-hidden>
                            <ChevronRight size={14} strokeWidth={1.8} />
                        </span>
                    </RadixMenu.SubTrigger>
                    <RadixMenu.Portal>
                        <RadixMenu.SubContent className={styles.content} sideOffset={2} alignOffset={-4}>
                            {entry.items.map((sub, j) => renderEntry(sub, j))}
                        </RadixMenu.SubContent>
                    </RadixMenu.Portal>
                </RadixMenu.Sub>
            );
        default: {
            const item = entry as EdMenuActionItem;
            return (
                <RadixMenu.Item
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
                </RadixMenu.Item>
            );
        }
    }
}
