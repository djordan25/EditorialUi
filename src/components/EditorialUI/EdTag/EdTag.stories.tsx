import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { EdTag } from './EdTag';

const meta: Meta<typeof EdTag> = {
    title: 'EditorialUI/Display/EdTag',
    component: EdTag,
    parameters: { layout: 'centered' },
    argTypes: {
        tone: { control: 'select', options: ['neutral', 'brand', 'success', 'warning', 'danger'] },
    },
};
export default meta;

type Story = StoryObj<typeof EdTag>;

export const Tones: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <EdTag>credit-risk</EdTag>
            <EdTag tone="brand">PD-Retail</EdTag>
            <EdTag tone="success">production</EdTag>
            <EdTag tone="warning">draft</EdTag>
            <EdTag tone="danger">deprecated</EdTag>
        </div>
    ),
};

export const Closable: Story = {
    render: () => {
        const [tags, setTags] = useState(['PRA SS3/21', 'CCAR 2025', 'IFRS 9']);
        return (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tags.map((t) => (
                    <EdTag
                        key={t}
                        tone="brand"
                        onRemove={() => setTags(tags.filter((x) => x !== t))}
                    >
                        {t}
                    </EdTag>
                ))}
                {tags.length === 0 && (
                    <span style={{ color: 'var(--ed-color-text-faint)', fontSize: 13 }}>
                        All removed.
                    </span>
                )}
            </div>
        );
    },
};

export const WithIcon: Story = {
    args: {
        tone: 'neutral',
        leadingIcon: <TagIcon size={11} strokeWidth={1.8} />,
        children: 'wholesale',
    },
};

export const CustomColors: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <EdTag color="#6D28D9">Wholesale</EdTag>
            <EdTag color="#0EA5E9">Markets</EdTag>
            <EdTag color="#F59E0B">Retail</EdTag>
            <EdTag color="#FDE68A">Light</EdTag>
            <EdTag color="#111827">Dark</EdTag>
            <EdTag color="#DC2626" onRemove={() => {}}>Removable</EdTag>
        </div>
    ),
};

export const Dots: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <EdTag dot color="#16A34A">active</EdTag>
            <EdTag dot color="#F59E0B">pending</EdTag>
            <EdTag dot color="#DC2626">blocked</EdTag>
            {/* Text-less swatches (named for AT) */}
            <EdTag dot color="#6D28D9" aria-label="Wholesale" />
            <EdTag dot color="#0EA5E9" aria-label="Markets" />
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <EdTag size="sm" tone="brand">sm</EdTag>
            <EdTag size="md" tone="brand">md</EdTag>
            <EdTag size="lg" tone="brand">lg</EdTag>
        </div>
    ),
};

export const InMetadata: Story = {
    name: 'In entity metadata',
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                padding: '16px 20px',
                background: 'var(--ed-color-surface-1)',
                border: '1px solid var(--ed-color-hairline)',
                borderRadius: 'var(--ed-radius-md)',
                maxWidth: 520,
            }}
        >
            <EdTag>credit-risk</EdTag>
            <EdTag>retail</EdTag>
            <EdTag>PRA SS3/21</EdTag>
            <EdTag>CCAR 2025</EdTag>
            <EdTag tone="brand">PD-Retail-2026</EdTag>
        </div>
    ),
};
