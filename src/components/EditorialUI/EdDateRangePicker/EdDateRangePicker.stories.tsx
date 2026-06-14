import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdDateRangePicker, defaultPresets, type EdDateRange } from './EdDateRangePicker';

const meta: Meta<typeof EdDateRangePicker> = {
    title: 'EditorialUI/Selection/EdDateRangePicker',
    component: EdDateRangePicker,
    parameters: { layout: 'padded' },
    decorators: [(Story) => <div style={{ minHeight: 480 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof EdDateRangePicker>;

export const Default: Story = {
    render: () => {
        const [range, setRange] = useState<EdDateRange>({ start: '2026-03-02', end: '2026-03-15' });
        return (
            <div style={{ width: 280 }}>
                <EdDateRangePicker label="Created between" value={range} onChange={setRange} fullWidth />
            </div>
        );
    },
};

export const EmptyState: Story = {
    render: () => {
        const [range, setRange] = useState<EdDateRange>({ start: null, end: null });
        return (
            <div style={{ width: 280 }}>
                <EdDateRangePicker label="Created between" value={range} onChange={setRange} fullWidth />
            </div>
        );
    },
};

export const PresetMatched: Story = {
    name: 'Preset matched (shows name)',
    render: () => {
        const presets = defaultPresets();
        const last14 = presets.find((p) => p.label === 'Last 14 days')!.range();
        const [range, setRange] = useState<EdDateRange>({ start: last14[0], end: last14[1] });
        return (
            <div style={{ width: 280 }}>
                <EdDateRangePicker label="Created between" value={range} onChange={setRange} fullWidth />
            </div>
        );
    },
};

export const Constrained: Story = {
    name: 'MinMax (exam window)',
    render: () => {
        const [range, setRange] = useState<EdDateRange>({ start: null, end: null });
        return (
            <div style={{ width: 280 }}>
                <EdDateRangePicker
                    label="Exam window"
                    value={range}
                    onChange={setRange}
                    min="2026-03-01"
                    max="2026-04-30"
                    hint="Limited to the 2026-Q1 exam period."
                    fullWidth
                />
            </div>
        );
    },
};

export const Error: Story = {
    render: () => {
        const [range, setRange] = useState<EdDateRange>({ start: null, end: null });
        return (
            <div style={{ width: 280 }}>
                <EdDateRangePicker label="Created between" value={range} onChange={setRange} error="Date range is required." fullWidth />
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => (
        <div style={{ width: 280 }}>
            <EdDateRangePicker label="Created between" defaultValue={{ start: '2026-03-02', end: '2026-03-15' }} disabled fullWidth />
        </div>
    ),
};
