import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdFilterChipRow, type EdFilterChip } from './EdFilterChipRow';

const meta: Meta<typeof EdFilterChipRow> = {
    title: 'EditorialUI/Selection/EdFilterChipRow',
    component: EdFilterChipRow,
    parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof EdFilterChipRow>;

export const Multi: Story = {
    render: () => {
        const [sel, setSel] = useState<string[]>(['credit', 'operational']);
        const chips: EdFilterChip[] = [
            { value: 'credit', label: 'Credit', count: 142 },
            { value: 'market', label: 'Market', count: 87 },
            { value: 'operational', label: 'Operational', count: 45 },
            { value: 'liquidity', label: 'Liquidity', count: 23 },
            { value: 'compliance', label: 'Compliance', count: 15 },
        ];
        return <EdFilterChipRow ariaLabel="Risk type" mode="multi" selected={sel} onSelectedChange={setSel} chips={chips} />;
    },
};

export const Single: Story = {
    render: () => {
        const [sel, setSel] = useState<string[]>(['team']);
        const chips: EdFilterChip[] = [
            { value: 'mine', label: 'My findings' },
            { value: 'team', label: 'My team' },
            { value: 'all', label: 'All' },
        ];
        return <EdFilterChipRow ariaLabel="Scope" mode="single" selected={sel} onSelectedChange={setSel} chips={chips} />;
    },
};

export const NoCounts: Story = {
    render: () => {
        const [sel, setSel] = useState<string[]>(['active']);
        return (
            <EdFilterChipRow
                ariaLabel="State"
                mode="single"
                selected={sel}
                onSelectedChange={setSel}
                chips={[
                    { value: 'active', label: 'Active' },
                    { value: 'archived', label: 'Archived' },
                    { value: 'drafts', label: 'Drafts' },
                ]}
            />
        );
    },
};

export const WithStatusDots: Story = {
    render: () => {
        const [sel, setSel] = useState<string[]>([]);
        return (
            <EdFilterChipRow
                ariaLabel="SLA status"
                selected={sel}
                onSelectedChange={setSel}
                chips={[
                    { value: 'ontrack', label: 'On track', count: 120, dot: 'var(--ed-color-status-success)' },
                    { value: 'atrisk', label: 'At risk', count: 14, dot: 'var(--ed-color-status-warning)' },
                    { value: 'overdue', label: 'Overdue', count: 9, dot: 'var(--ed-color-status-danger)' },
                ]}
            />
        );
    },
};

export const Grouped: Story = {
    render: () => {
        const [sel, setSel] = useState<string[]>(['all']);
        return (
            <EdFilterChipRow
                ariaLabel="Filters"
                selected={sel}
                onSelectedChange={setSel}
                groups={[
                    { chips: [
                        { value: 'all', label: 'All', count: 312 },
                        { value: 'open', label: 'Open', count: 87 },
                        { value: 'inreview', label: 'In review', count: 14 },
                        { value: 'closed', label: 'Closed', count: 211 },
                    ] },
                    { divider: true, chips: [
                        { value: 'high', label: 'High severity', count: 23 },
                        { value: 'overdue', label: 'Overdue', count: 9 },
                    ] },
                ]}
            />
        );
    },
};

export const WithOverflow: Story = {
    render: () => {
        const [sel, setSel] = useState<string[]>(['all']);
        return (
            <div style={{ maxWidth: 360 }}>
                <EdFilterChipRow
                    ariaLabel="Filters"
                    selected={sel}
                    onSelectedChange={setSel}
                    chips={[
                        { value: 'all', label: 'All', count: 312 },
                        { value: 'open', label: 'Open', count: 87 },
                        { value: 'closed', label: 'Closed', count: 211 },
                    ]}
                    overflow={
                        <button style={{ background: 'none', border: 'none', color: 'var(--ed-color-text-muted)', fontSize: 13, cursor: 'pointer' }}>
                            + 4 more
                        </button>
                    }
                />
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => {
        const [sel, setSel] = useState<string[]>(['open']);
        return (
            <EdFilterChipRow
                ariaLabel="Status"
                selected={sel}
                onSelectedChange={setSel}
                chips={[
                    { value: 'open', label: 'Open', count: 87 },
                    { value: 'closed', label: 'Closed', count: 211 },
                    { value: 'archived', label: 'Archived', disabled: true },
                ]}
            />
        );
    },
};
