import type { Meta, StoryObj } from '@storybook/react';
import { EdTagContainer } from './EdTagContainer';

/** Minimal tag stand-in (real consumers pass <EdTag> from Bundle 4). */
const Tag = ({ children, brand }: { children: React.ReactNode; brand?: boolean }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 'var(--ed-radius-sm)',
        background: brand ? 'var(--ed-color-brand-bg)' : 'var(--ed-color-surface-2)',
        color: brand ? 'var(--ed-color-brand)' : 'var(--ed-color-text-secondary)',
        border: brand ? 'none' : '1px solid var(--ed-color-hairline)',
        fontFamily: 'var(--ed-font-sans)', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
    }}>{children}</span>
);

const meta: Meta<typeof EdTagContainer> = {
    title: 'EditorialUI/Display/EdTagContainer',
    component: EdTagContainer,
    parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof EdTagContainer>;

const tags = ['credit-risk', 'retail', 'PD', 'PRA SS3/21', 'CCAR 2025', 'IFRS 9', 'Basel IV'];

export const Wrap: Story = {
    render: () => (
        <div style={{ maxWidth: 480 }}>
            <EdTagContainer>
                {tags.map((t) => <Tag key={t}>{t}</Tag>)}
            </EdTagContainer>
        </div>
    ),
};

export const SingleRow: Story = {
    render: () => (
        <div style={{ maxWidth: 320 }}>
            <EdTagContainer mode="single-row" maxVisible={3}>
                {tags.map((t) => <Tag key={t}>{t}</Tag>)}
            </EdTagContainer>
        </div>
    ),
};

export const SingleRowInteractiveOverflow: Story = {
    name: 'SingleRow (interactive +N more)',
    render: () => (
        <div style={{ maxWidth: 240 }}>
            <EdTagContainer
                mode="single-row"
                maxVisible={2}
                renderOverflow={(hidden, n) => (
                    <button
                        title={hidden.map((_, i) => tags[i + 2]).join(', ')}
                        style={{ background: 'none', border: 'none', borderBottom: '1px dotted var(--ed-color-hairline-bold)', color: 'var(--ed-color-text-muted)', fontSize: 13, cursor: 'pointer', padding: 0 }}
                    >
                        +{n} more
                    </button>
                )}
            >
                {tags.map((t) => <Tag key={t} brand>{t}</Tag>)}
            </EdTagContainer>
        </div>
    ),
};

export const Empty: Story = {
    render: () => (
        <div style={{ maxWidth: 480 }}>
            <EdTagContainer>{[]}</EdTagContainer>
        </div>
    ),
};
