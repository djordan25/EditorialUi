import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { EdProgressMeter, EdProgressSegmented } from './EdProgressMeter';

const meta: Meta<typeof EdProgressMeter> = {
    title: 'EditorialUI/Feedback/EdProgressMeter',
    component: EdProgressMeter,
    parameters: { layout: 'centered' },
    argTypes: {
        percent: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger', 'muted'] },
        size: { control: 'radio', options: ['md', 'lg'] },
        paused: { control: 'boolean' },
    },
    decorators: [(Story) => <div style={{ width: 420 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof EdProgressMeter>;

export const Determinate: Story = {
    args: { label: 'Uploading evidence', value: '42%', percent: 42 },
};

export const Indeterminate: Story = {
    args: { label: 'Searching audit log…' },
};

export const Complete: Story = {
    args: { label: 'Sync complete', value: '100%', percent: 100, tone: 'success' },
};

export const ThresholdWarning: Story = {
    args: { label: 'SLA budget remaining', value: '14%', percent: 14, tone: 'warning' },
};

export const ThresholdDanger: Story = {
    args: { label: 'SLA budget remaining', value: '3%', percent: 3, tone: 'danger' },
};

export const Paused: Story = {
    args: { label: 'Sync paused', value: '52%', percent: 52, paused: true },
};

export const LargeWithLongValue: Story = {
    args: {
        label: 'Importing findings — registry sync',
        value: '68% · 2,142 of 3,150',
        percent: 68,
        size: 'lg',
        valueText: '68%, 2142 of 3150',
    },
};

export const Animated: Story = {
    name: 'Animated (live)',
    render: () => {
        const [p, setP] = useState(0);
        useEffect(() => {
            const id = window.setInterval(() => setP((x) => (x >= 100 ? 0 : x + 4)), 250);
            return () => window.clearInterval(id);
        }, []);
        return <EdProgressMeter label="Uploading" value={`${p}%`} percent={p} />;
    },
};

export const MultiFileBatch: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 420 }}>
            <EdProgressMeter label="evidence-A.pdf" value="Done" percent={100} tone="success" />
            <EdProgressMeter label="memo-final.docx" value="73%" percent={73} />
            <EdProgressMeter label="attestation.pdf" value="Queued" percent={0} paused />
        </div>
    ),
};

/* ----- Segmented ----- */

export const SegmentedClosure: Story = {
    name: 'Segmented — closure (3 of 4)',
    render: () => (
        <div style={{ width: 420 }}>
            <EdProgressSegmented
                segments={4}
                filled={3}
                tone="success"
                ariaLabel="Closure progress"
                valueText="Stage 3 of 4 — Validator review"
            />
        </div>
    ),
};

export const SegmentedStrength: Story = {
    name: 'Segmented — password strength (2 of 4)',
    render: () => (
        <div style={{ width: 280 }}>
            <EdProgressSegmented
                segments={4}
                filled={2}
                tone="warning"
                ariaLabel="Password strength"
                valueText="Fair · 12+ characters recommended"
            />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 6,
                    fontFamily: 'var(--ed-font-mono)',
                    fontSize: 11,
                    color: 'var(--ed-color-text-muted)',
                }}
            >
                <span>Fair</span>
                <span style={{ color: 'var(--ed-color-status-warning)' }}>2/4</span>
            </div>
        </div>
    ),
};
