import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { EdCircularProgress } from './EdCircularProgress';

const meta: Meta<typeof EdCircularProgress> = {
    title: 'EditorialUI/Feedback/EdCircularProgress',
    component: EdCircularProgress,
    parameters: { layout: 'centered' },
    argTypes: {
        size: { control: 'radio', options: ['sm', 'md', 'lg'] },
        tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger', 'inverse'] },
        percent: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        showValue: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof EdCircularProgress>;

export const IndeterminateSm: Story = { args: { size: 'sm', label: 'Loading' } };
export const IndeterminateMd: Story = { args: { size: 'md', label: 'Loading' } };
export const IndeterminateLg: Story = { args: { size: 'lg', label: 'Loading' } };

export const IndeterminateSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <EdCircularProgress size="sm" label="Loading" />
                <p style={{ margin: '8px 0 0', fontFamily: 'var(--ed-font-mono)', fontSize: 10, color: 'var(--ed-color-text-muted)' }}>sm · 14px</p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <EdCircularProgress size="md" label="Loading" />
                <p style={{ margin: '8px 0 0', fontFamily: 'var(--ed-font-mono)', fontSize: 10, color: 'var(--ed-color-text-muted)' }}>md · 20px</p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <EdCircularProgress size="lg" label="Loading" />
                <p style={{ margin: '8px 0 0', fontFamily: 'var(--ed-font-mono)', fontSize: 10, color: 'var(--ed-color-text-muted)' }}>lg · 32px</p>
            </div>
        </div>
    ),
};

export const Determinate0:   Story = { args: { percent: 0,   size: 'lg', showValue: true, label: 'Progress' } };
export const Determinate25:  Story = { args: { percent: 25,  size: 'lg', showValue: true, label: 'Progress' } };
export const Determinate50:  Story = { args: { percent: 50,  size: 'lg', showValue: true, label: 'Progress' } };
export const Determinate75:  Story = { args: { percent: 75,  size: 'lg', showValue: true, label: 'Progress' } };
export const Determinate100: Story = { args: { percent: 100, size: 'lg', showValue: true, label: 'Progress', tone: 'success' } };

export const DeterminateSemantic: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <EdCircularProgress percent={85} size="lg" showValue tone="success" label="Closure" />
            <EdCircularProgress percent={42} size="lg" showValue tone="warning" label="SLA budget" />
            <EdCircularProgress percent={9}  size="lg" showValue tone="danger"  label="SLA budget" />
        </div>
    ),
};

export const InButton: Story = {
    render: () => (
        <button
            type="button"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                height: 36,
                padding: '0 16px',
                background: 'var(--ed-color-brand)',
                color: 'var(--ed-color-brand-contrast)',
                border: 'none',
                borderRadius: 'var(--ed-radius-sm)',
                fontFamily: 'var(--ed-font-sans)',
                fontSize: 'var(--ed-font-size-md)',
                lineHeight: 1,
                fontWeight: 500,
                cursor: 'progress',
            }}
        >
            <EdCircularProgress size="sm" tone="inverse" label="Saving" />
            Saving…
        </button>
    ),
};

export const InRow: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: 'var(--ed-color-text-secondary)',
            }}
        >
            <EdCircularProgress size="sm" label="Loading evidence" />
            Loading evidence…
        </div>
    ),
};

export const PageLevel: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
                width: 360,
                border: '1px dashed var(--ed-color-hairline)',
                borderRadius: 'var(--ed-radius-md)',
            }}
        >
            <EdCircularProgress size="lg" label="Fetching findings" />
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ed-color-text-muted)' }}>Fetching findings…</p>
        </div>
    ),
};

export const Animated: Story = {
    name: 'Animated (live)',
    render: () => {
        const [p, setP] = useState(0);
        useEffect(() => {
            const id = window.setInterval(() => setP((x) => (x >= 100 ? 0 : x + 4)), 250);
            return () => window.clearInterval(id);
        }, []);
        const tone = p < 30 ? 'brand' : p < 80 ? 'warning' : 'success';
        return (
            <EdCircularProgress percent={p} size="lg" showValue tone={tone} label="Sync" />
        );
    },
};
