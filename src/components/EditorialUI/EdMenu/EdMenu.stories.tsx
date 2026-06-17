import type { Meta, StoryObj } from '@storybook/react';
import { useState, forwardRef, type ReactNode } from 'react';
import {
    CheckCheck, Pencil, Copy, Users, Trash2, MoreHorizontal, ChevronDown,
} from 'lucide-react';
import { EdMenu, type EdMenuEntry } from './EdMenu';

const meta: Meta<typeof EdMenu> = {
    title: 'EditorialUI/Navigation/EdMenu',
    component: EdMenu,
    parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof EdMenu>;

// forwardRef + prop spread so Radix's asChild Trigger can wire up onClick / ref / aria
// onto the real <button>. A plain wrapper that ignores props leaves the trigger dead.
const Btn = forwardRef<HTMLButtonElement, { children: ReactNode }>(function Btn(
    { children, ...props },
    ref,
) {
    return (
        <button
            ref={ref}
            {...props}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px',
                background: 'var(--ed-color-surface-1)', border: '1px solid var(--ed-color-hairline-strong)',
                borderRadius: 'var(--ed-radius-sm)', fontFamily: 'var(--ed-font-sans)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
        >
            {children}
        </button>
    );
});

const IconBtn = forwardRef<HTMLButtonElement, { label: string; children: ReactNode }>(function IconBtn(
    { label, children, ...props },
    ref,
) {
    return (
        <button
            ref={ref}
            {...props}
            aria-label={label}
            style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32,
                background: 'transparent', border: '1px solid transparent', borderRadius: 'var(--ed-radius-sm)',
                color: 'var(--ed-color-text-secondary)', cursor: 'pointer',
            }}
        >
            {children}
        </button>
    );
});

export const Full: Story = {
    args: {
        trigger: <Btn>Actions <ChevronDown size={14} strokeWidth={1.8} /></Btn>,
        items: [
            { id: 'close', label: 'Close finding', icon: <CheckCheck size={14} strokeWidth={1.8} />, shortcut: '⌘↩', onSelect: () => {} },
            { id: 'edit', label: 'Edit', icon: <Pencil size={14} strokeWidth={1.8} />, shortcut: '⌘E', onSelect: () => {} },
            { id: 'dup', label: 'Duplicate', icon: <Copy size={14} strokeWidth={1.8} />, onSelect: () => {} },
            { id: 'reassign', label: 'Reassign owner', icon: <Users size={14} strokeWidth={1.8} />, onSelect: () => {} },
            { kind: 'separator' },
            { kind: 'label', label: 'Export' },
            { id: 'copy', label: 'Copy ID', shortcut: '⌘⇧C', onSelect: () => {} },
            { id: 'pdf', label: 'Download as PDF', onSelect: () => {} },
            { kind: 'separator' },
            { id: 'delete', label: 'Delete finding', icon: <Trash2 size={14} strokeWidth={1.8} />, danger: true, ariaLabel: 'Delete finding F-2438', onSelect: () => {} },
        ] as EdMenuEntry[],
    },
};

export const Simple: Story = {
    args: {
        trigger: <Btn>Options <ChevronDown size={14} strokeWidth={1.8} /></Btn>,
        items: [
            { id: 'refresh', label: 'Refresh', onSelect: () => {} },
            { id: 'sub', label: 'Subscribe', onSelect: () => {} },
            { id: 'unsub', label: 'Unsubscribe', onSelect: () => {} },
        ],
    },
};

export const OverflowIcon: Story = {
    args: {
        trigger: <IconBtn label="More actions"><MoreHorizontal size={18} strokeWidth={1.8} /></IconBtn>,
        items: [
            { id: 'open', label: 'Open finding', onSelect: () => {} },
            { id: 'reassign', label: 'Reassign owner', onSelect: () => {} },
            { id: 'dup', label: 'Duplicate', onSelect: () => {} },
        ],
    },
};

export const Checkable: Story = {
    render: () => {
        const [closed, setClosed] = useState(true);
        const [superseded, setSuperseded] = useState(true);
        const [drafts, setDrafts] = useState(false);
        return (
            <EdMenu
                trigger={<Btn>View <ChevronDown size={14} strokeWidth={1.8} /></Btn>}
                items={[
                    { kind: 'checkbox', id: 'closed', label: 'Show closed findings', checked: closed, onCheckedChange: setClosed },
                    { kind: 'checkbox', id: 'superseded', label: 'Show superseded', checked: superseded, onCheckedChange: setSuperseded },
                    { kind: 'checkbox', id: 'drafts', label: 'Show drafts', checked: drafts, onCheckedChange: setDrafts },
                ]}
            />
        );
    },
};

export const WithMetadata: Story = {
    args: {
        trigger: <Btn>Teams <ChevronDown size={14} strokeWidth={1.8} /></Btn>,
        minWidth: 260,
        items: [
            { id: 'risk', label: 'Risk Operations', meta: '14 members', onSelect: () => {} },
            { id: 'val', label: 'Validation', meta: '8 members', onSelect: () => {} },
            { id: 'exam', label: 'Examiners', meta: '3 members', onSelect: () => {} },
        ],
    },
};

export const Submenu: Story = {
    args: {
        trigger: <Btn>Actions <ChevronDown size={14} strokeWidth={1.8} /></Btn>,
        items: [
            { id: 'open', label: 'Open', onSelect: () => {} },
            {
                kind: 'submenu',
                id: 'move',
                label: 'Move to',
                items: [
                    { id: 'q2', label: '2026-Q2 audit', onSelect: () => {} },
                    { id: 'q1', label: '2026-Q1 audit', onSelect: () => {} },
                    { id: 'q4', label: '2025-Q4 audit', onSelect: () => {} },
                ],
            },
            { id: 'dup', label: 'Duplicate', onSelect: () => {} },
        ] as EdMenuEntry[],
    },
};

export const DisabledItem: Story = {
    args: {
        trigger: <Btn>Actions <ChevronDown size={14} strokeWidth={1.8} /></Btn>,
        items: [
            { id: 'open', label: 'Open finding', onSelect: () => {} },
            { id: 'reassign', label: 'Reassign owner', disabled: true, onSelect: () => {} },
            { id: 'dup', label: 'Duplicate', onSelect: () => {} },
        ],
    },
};

export const VerifyOpen: Story = {
    args: {
        open: true,
        onOpenChange: () => {},
        trigger: <Btn>Actions <ChevronDown size={14} strokeWidth={1.8} /></Btn>,
        items: [
            { kind: 'item', id: 'close', label: 'Close finding', icon: <CheckCheck size={14} />, shortcut: '⌘↩' },
            { kind: 'item', id: 'edit', label: 'Edit', icon: <Pencil size={14} />, shortcut: '⌘E' },
            { kind: 'item', id: 'dup', label: 'Duplicate', icon: <Copy size={14} /> },
            { kind: 'separator', id: 's1' },
            { kind: 'item', id: 'del', label: 'Delete finding', icon: <Trash2 size={14} />, danger: true, ariaLabel: 'Delete finding F-2438' },
        ],
    },
};
