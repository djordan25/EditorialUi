import type { Meta, StoryObj } from '@storybook/react';
import { List, Clock, Users } from 'lucide-react';
import { EdTabs, type EdTabItem } from './EdTabs';

const meta: Meta<typeof EdTabs> = {
    title: 'EditorialUI/Navigation/EdTabs',
    component: EdTabs,
    parameters: { layout: 'padded' },
    decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof EdTabs>;

const panel = (label: string) => (
    <div style={{ color: 'var(--ed-color-text-secondary)', fontSize: 13 }}>Panel content for {label}.</div>
);

export const Underline: Story = {
    args: {
        defaultValue: 'overview',
        items: [
            { value: 'overview', label: 'Overview', content: panel('Overview') },
            { value: 'findings', label: 'Findings', count: 23, content: panel('Findings') },
            { value: 'audit', label: 'Audit log', count: 147, content: panel('Audit log') },
            { value: 'validators', label: 'Validators', content: panel('Validators') },
            { value: 'settings', label: 'Settings', disabled: true },
        ] as EdTabItem[],
    },
};

export const Segmented: Story = {
    args: {
        variant: 'segmented',
        defaultValue: 'table',
        items: [
            { value: 'table', label: 'Table', content: panel('Table') },
            { value: 'inspector', label: 'Inspector', content: panel('Inspector') },
            { value: 'graph', label: 'Graph', content: panel('Graph') },
        ],
    },
};

export const WithCounts: Story = {
    args: {
        defaultValue: 'all',
        items: [
            { value: 'all', label: 'All', count: 312, content: panel('All') },
            { value: 'mine', label: 'Mine', count: 14, content: panel('Mine') },
            { value: 'watched', label: 'Watched', count: 8, content: panel('Watched') },
            { value: 'drafts', label: 'Drafts', count: 2, content: panel('Drafts') },
        ],
    },
};

export const WithIcons: Story = {
    args: {
        defaultValue: 'findings',
        items: [
            { value: 'findings', label: 'Findings', icon: <List size={14} strokeWidth={1.8} />, content: panel('Findings') },
            { value: 'audit', label: 'Audit log', icon: <Clock size={14} strokeWidth={1.8} />, content: panel('Audit log') },
            { value: 'validators', label: 'Validators', icon: <Users size={14} strokeWidth={1.8} />, content: panel('Validators') },
        ],
    },
};

export const WithStatusDot: Story = {
    args: {
        defaultValue: 'open',
        items: [
            { value: 'open', label: 'Open', statusDot: 'var(--ed-color-status-warning)', content: panel('Open') },
            { value: 'closed', label: 'Closed', content: panel('Closed') },
            { value: 'overdue', label: 'Overdue', statusDot: 'var(--ed-color-status-danger)', content: panel('Overdue') },
        ],
    },
};

export const Overflow: Story = {
    args: {
        defaultValue: 't1',
        items: Array.from({ length: 9 }, (_, i) => ({
            value: `t${i + 1}`,
            label: `Section ${i + 1}`,
            content: panel(`Section ${i + 1}`),
        })),
    },
};

export const AsyncManual: Story = {
    name: 'AsyncPanels (manual activation)',
    args: {
        activationMode: 'manual',
        defaultValue: 'overview',
        items: [
            { value: 'overview', label: 'Overview', content: panel('Overview') },
            { value: 'findings', label: 'Findings', count: 23, content: panel('Findings (fetched on activate)') },
            { value: 'audit', label: 'Audit log', count: 147, content: panel('Audit log (fetched on activate)') },
        ],
    },
};
