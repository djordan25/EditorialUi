import type { Meta, StoryObj } from '@storybook/react';
import { Trash2, Copy, Pencil } from 'lucide-react';
import { EdContextMenu } from './EdContextMenu';
import type { EdMenuEntry } from '../EdMenu';

const meta: Meta<typeof EdContextMenu> = {
    title: 'EditorialUI/Navigation/EdContextMenu',
    component: EdContextMenu,
    parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof EdContextMenu>;

const rowActions: EdMenuEntry[] = [
    { id: 'open', label: 'Open finding', shortcut: '↵', onSelect: () => {} },
    { id: 'reassign', label: 'Reassign owner', icon: <Pencil size={14} strokeWidth={1.8} />, onSelect: () => {} },
    { kind: 'separator' },
    { kind: 'label', label: 'Status' },
    { id: 'closed', label: 'Mark as closed', onSelect: () => {} },
    { id: 'draft', label: 'Move to draft', onSelect: () => {} },
    { kind: 'separator' },
    { id: 'copy', label: 'Copy ID', icon: <Copy size={14} strokeWidth={1.8} />, shortcut: '⌘C', onSelect: () => {} },
    { kind: 'separator' },
    { id: 'delete', label: 'Delete', icon: <Trash2 size={14} strokeWidth={1.8} />, danger: true, ariaLabel: 'Delete finding F-2438', onSelect: () => {} },
];

const Row = () => (
    <div
        style={{
            display: 'flex', gap: 14, alignItems: 'center', minWidth: 320, padding: '12px 16px',
            background: 'var(--ed-color-surface-1)', border: '1px solid var(--ed-color-hairline)',
            borderRadius: 'var(--ed-radius-sm)', fontSize: 13, cursor: 'context-menu',
        }}
    >
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 8px',
            borderRadius: 'var(--ed-radius-sm)', background: 'var(--ed-color-status-warning-bg)',
            color: 'var(--ed-color-status-warning)', fontFamily: 'var(--ed-font-mono)', fontSize: 11,
            letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>OPEN</span>
        <div>
            <div style={{ fontFamily: 'var(--ed-font-mono)', fontSize: 11, color: 'var(--ed-color-text-muted)' }}>F-2438</div>
            <div>Stale model documentation</div>
        </div>
    </div>
);

export const OnTableRow: Story = {
    render: () => (
        <div>
            <p style={{ fontSize: 12, color: 'var(--ed-color-text-muted)', marginBottom: 12 }}>Right-click the row ↓</p>
            <EdContextMenu items={rowActions}>
                <Row />
            </EdContextMenu>
        </div>
    ),
};

export const WithSubmenu: Story = {
    render: () => (
        <div>
            <p style={{ fontSize: 12, color: 'var(--ed-color-text-muted)', marginBottom: 12 }}>Right-click the row ↓</p>
            <EdContextMenu
                items={[
                    { id: 'open', label: 'Open finding', onSelect: () => {} },
                    {
                        kind: 'submenu', id: 'move', label: 'Move to',
                        items: [
                            { id: 'q2', label: '2026-Q2 audit', onSelect: () => {} },
                            { id: 'q1', label: '2026-Q1 audit', onSelect: () => {} },
                        ],
                    },
                    { kind: 'separator' },
                    { id: 'delete', label: 'Delete', danger: true, ariaLabel: 'Delete finding F-2438', onSelect: () => {} },
                ]}
            >
                <Row />
            </EdContextMenu>
        </div>
    ),
};

export const OnCanvas: Story = {
    render: () => (
        <EdContextMenu
            items={[
                { id: 'fit', label: 'Fit to view', onSelect: () => {} },
                { id: 'reset', label: 'Reset zoom', onSelect: () => {} },
                { kind: 'separator' },
                { id: 'paste', label: 'Paste', shortcut: '⌘V', onSelect: () => {} },
            ]}
        >
            <div
                style={{
                    width: 360, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px dashed var(--ed-color-hairline-bold)', borderRadius: 'var(--ed-radius-md)',
                    color: 'var(--ed-color-text-muted)', fontSize: 13, cursor: 'context-menu',
                    backgroundImage: 'radial-gradient(var(--ed-color-hairline) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                }}
            >
                Right-click the canvas
            </div>
        </EdContextMenu>
    ),
};
