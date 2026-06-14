import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { EdList, type EdListItem } from './EdList';

const meta: Meta<typeof EdList> = {
    title: 'EditorialUI/Data/EdList',
    component: EdList,
    parameters: { layout: 'padded' },
    decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof EdList>;

const Avatar = ({ children }: { children: React.ReactNode }) => (
    <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ed-color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ed-font-mono)', fontSize: 11, color: 'var(--ed-color-text-primary)' }}>{children}</span>
);

const people: EdListItem[] = [
    { id: 'mc', title: 'Marcus Chen', description: 'Validation · 14 open', leading: <Avatar>MC</Avatar>, meta: '⌘1', group: 'recent' },
    { id: 'pr', title: 'Priya Rao', description: 'Validation · 8 open', leading: <Avatar>PR</Avatar>, group: 'recent' },
    { id: 'hl', title: 'Hanna Lindqvist', description: 'Risk ops · out of office', leading: <Avatar>HL</Avatar>, disabled: true, group: 'recent' },
];

export const Simple: Story = {
    args: {
        items: [
            { id: 'findings', title: 'Findings' },
            { id: 'audit', title: 'Audit log' },
            { id: 'validators', title: 'Validators' },
            { id: 'settings', title: 'Settings' },
        ],
        selectionMode: 'single',
        selectedId: 'audit',
        ariaLabel: 'Sections',
    },
};

export const WithAvatar: Story = {
    render: () => {
        const [sel, setSel] = useState<string | null>('mc');
        return (
            <EdList
                selectionMode="single"
                selectedId={sel}
                onSelect={setSel}
                ariaLabel="Owners"
                groupLabels={{ recent: 'Recent' }}
                items={people}
            />
        );
    },
};

export const WithIconMeta: Story = {
    args: {
        ariaLabel: 'Commands',
        selectionMode: 'single',
        items: [
            { id: 'search', title: 'Search findings', leading: <Search size={14} strokeWidth={1.8} />, meta: '⌘K' },
            { id: 'new', title: 'New finding', leading: <Plus size={14} strokeWidth={1.8} />, meta: '⌘N' },
        ],
    },
};

export const Grouped: Story = {
    args: {
        ariaLabel: 'Findings',
        selectionMode: 'single',
        groupLabels: { recent: 'Recent', pinned: 'Pinned' },
        items: [
            { id: 'f1', title: 'F-2438 · Stale documentation', group: 'recent' },
            { id: 'f2', title: 'F-2401 · Backtest mismatch', group: 'recent' },
            { id: 'f3', title: 'F-2287 · Drift threshold', group: 'pinned' },
        ],
    },
};

export const Static: Story = {
    name: 'Static (non-interactive)',
    args: {
        selectionMode: 'none',
        groupLabels: { recent: 'Recent' },
        items: people.map(({ disabled, ...p }) => p),
    },
};

export const Empty: Story = {
    args: { items: [], empty: <span style={{ fontSize: 13, color: 'var(--ed-color-text-muted)' }}>No matches</span> },
};

export const LoadingSkeleton: Story = {
    args: { items: [], loading: true, loadingRows: 4 },
};
