import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Filter as FilterIcon } from 'lucide-react';
import { EdChip } from './EdChip';

const meta: Meta<typeof EdChip> = {
    title: 'EditorialUI/Display/EdChip',
    component: EdChip,
    parameters: { layout: 'centered' },
    argTypes: {
        kind: { control: 'select', options: ['toggle', 'radio', 'input'] },
        selected: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof EdChip>;

export const Unselected: Story = { args: { children: 'Open' } };
export const Selected: Story = { args: { children: 'Open', selected: true } };
export const Disabled: Story = { args: { children: 'Archived', disabled: true } };

export const WithCount: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <EdChip count={120}>All</EdChip>
            <EdChip selected count={87}>Open</EdChip>
            <EdChip count={28}>Closed</EdChip>
            <EdChip count={5}>Overdue</EdChip>
        </div>
    ),
};

export const WithDot: Story = {
    args: {
        children: 'In review',
        leadingDot: 'var(--ed-color-status-warning)',
    },
};

export const WithIcon: Story = {
    args: {
        children: 'Filters',
        leadingIcon: <FilterIcon size={12} strokeWidth={1.8} />,
    },
};

export const Input: Story = {
    name: 'Input (removable token)',
    render: () => {
        const [tags, setTags] = useState(['PRA SS3/21', 'CCAR 2025', 'IFRS 9']);
        return (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: 380 }}>
                {tags.map((t) => (
                    <EdChip
                        key={t}
                        kind="input"
                        onRemove={() => setTags((s) => s.filter((x) => x !== t))}
                    >
                        {t}
                    </EdChip>
                ))}
            </div>
        );
    },
};

export const AsCheckboxGroup: Story = {
    name: 'AsCheckboxGroup (multi-select filter)',
    render: () => {
        const [picked, setPicked] = useState<Set<string>>(new Set(['open']));
        const toggle = (k: string) =>
            setPicked((s) => {
                const next = new Set(s);
                if (next.has(k)) next.delete(k);
                else next.add(k);
                return next;
            });

        return (
            <div style={{ display: 'flex', gap: 6 }}>
                {[
                    { k: 'all', label: 'All', count: 120 },
                    { k: 'open', label: 'Open', count: 87 },
                    { k: 'closed', label: 'Closed', count: 28 },
                    { k: 'overdue', label: 'Overdue', count: 5 },
                ].map((c) => (
                    <EdChip
                        key={c.k}
                        selected={picked.has(c.k)}
                        count={c.count}
                        onSelectedChange={() => toggle(c.k)}
                    >
                        {c.label}
                    </EdChip>
                ))}
            </div>
        );
    },
};

export const AsRadioGroup: Story = {
    name: 'AsRadioGroup (single-select)',
    render: () => {
        const [value, setValue] = useState('week');
        return (
            <div role="radiogroup" aria-label="Date range" style={{ display: 'flex', gap: 6 }}>
                {[
                    { k: 'day', label: '24h' },
                    { k: 'week', label: '7d' },
                    { k: 'month', label: '30d' },
                    { k: 'quarter', label: '90d' },
                ].map((c) => (
                    <EdChip
                        key={c.k}
                        kind="radio"
                        selected={value === c.k}
                        onSelectedChange={(next) => next && setValue(c.k)}
                    >
                        {c.label}
                    </EdChip>
                ))}
            </div>
        );
    },
};
