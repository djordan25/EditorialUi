import type { Meta, StoryObj } from '@storybook/react';
import { EdDivider } from './EdDivider';

const meta: Meta<typeof EdDivider> = {
    title: 'EditorialUI/Display/EdDivider',
    component: EdDivider,
    parameters: { layout: 'padded' },
    argTypes: {
        orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
        weight: { control: 'radio', options: ['default', 'strong', 'dashed'] },
    },
};
export default meta;

type Story = StoryObj<typeof EdDivider>;

export const Horizontal: Story = {
    render: () => (
        <div style={{ maxWidth: 480 }}>
            <p style={{ margin: 0, fontSize: 13 }}>First paragraph.</p>
            <EdDivider />
            <p style={{ margin: 0, fontSize: 13 }}>Second paragraph, separated by hairline.</p>
        </div>
    ),
};

export const Strong: Story = {
    render: () => (
        <div style={{ maxWidth: 480 }}>
            <p style={{ margin: 0, fontSize: 13 }}>Section A.</p>
            <EdDivider weight="strong" />
            <p style={{ margin: 0, fontSize: 13 }}>Section B (strong rule).</p>
        </div>
    ),
};

export const Dashed: Story = {
    render: () => (
        <div style={{ maxWidth: 480 }}>
            <p style={{ margin: 0, fontSize: 13 }}>Required fields above.</p>
            <EdDivider weight="dashed" />
            <p style={{ margin: 0, fontSize: 13 }}>Optional fields below.</p>
        </div>
    ),
};

export const Vertical: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 13,
                color: 'var(--ed-color-text-secondary)',
            }}
        >
            <span>v3.2.0</span>
            <EdDivider orientation="vertical" decorative style={{ height: 14 }} />
            <span>updated 11:42 UTC</span>
            <EdDivider orientation="vertical" decorative style={{ height: 14 }} />
            <span>marcus.chen</span>
        </div>
    ),
};

export const Labeled: Story = {
    args: { label: '2026 — Q1' },
    render: (args) => (
        <div style={{ maxWidth: 480 }}>
            <EdDivider {...args} />
        </div>
    ),
};

export const InMetadataStrip: Story = {
    render: () => (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 12px',
                border: '1px solid var(--ed-color-hairline)',
                borderRadius: 'var(--ed-radius-sm)',
                background: 'var(--ed-color-surface-1)',
                fontSize: 12,
                color: 'var(--ed-color-text-secondary)',
            }}
        >
            <code style={{ fontFamily: 'var(--ed-font-mono)' }}>M-9F4D-2026</code>
            <EdDivider orientation="vertical" decorative style={{ height: 12 }} />
            <span>PD-Wholesale</span>
            <EdDivider orientation="vertical" decorative style={{ height: 12 }} />
            <span>credit-risk</span>
        </div>
    ),
};
