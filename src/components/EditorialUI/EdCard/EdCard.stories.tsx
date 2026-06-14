import type { Meta, StoryObj } from '@storybook/react';
import { EdCard, EdCardHeader, EdCardBody, EdCardFooter } from './EdCard';

const meta: Meta<typeof EdCard> = {
    title: 'EditorialUI/Containers/EdCard',
    component: EdCard,
    parameters: { layout: 'padded' },
    argTypes: {
        variant: { control: 'select', options: ['default', 'flat', 'ghost'] },
        interactive: { control: 'boolean' },
        selected: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof EdCard>;

export const Stat: Story = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 600 }}>
            <EdCard>
                <EdCardBody>
                    <p style={{ margin: 0, fontFamily: 'var(--ed-font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ed-color-text-muted)' }}>Open findings</p>
                    <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 600 }}>87</p>
                </EdCardBody>
                <EdCardFooter><span>updated 11:42</span></EdCardFooter>
            </EdCard>
            <EdCard>
                <EdCardBody>
                    <p style={{ margin: 0, fontFamily: 'var(--ed-font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ed-color-text-muted)' }}>Overdue</p>
                    <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 600, color: 'var(--ed-color-status-danger)' }}>9</p>
                </EdCardBody>
                <EdCardFooter><span>3 escalated</span></EdCardFooter>
            </EdCard>
            <EdCard>
                <EdCardBody>
                    <p style={{ margin: 0, fontFamily: 'var(--ed-font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ed-color-text-muted)' }}>Closure SLA</p>
                    <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 600, color: 'var(--ed-color-status-success)' }}>94%</p>
                </EdCardBody>
                <EdCardFooter><span>30-day rolling</span></EdCardFooter>
            </EdCard>
        </div>
    ),
};

export const Summary: Story = {
    render: () => (
        <EdCard style={{ maxWidth: 480 }}>
            <EdCardHeader
                eyebrow="FINDING · F-2438"
                title="Stale model documentation"
                adornment={
                    <span style={{ fontFamily: 'var(--ed-font-mono)', fontSize: 11, color: 'var(--ed-color-status-warning)', letterSpacing: '0.04em' }}>
                        ● OPEN
                    </span>
                }
            />
            <EdCardBody>
                Model documentation references v2.1 outputs; current production version is v2.3.
            </EdCardBody>
            <EdCardFooter>
                <span>Marcus Chen · due 2026-04-22</span>
                <a href="#inspect" style={{ color: 'var(--ed-color-brand)', textDecoration: 'none' }}>Inspect →</a>
            </EdCardFooter>
        </EdCard>
    ),
};

export const Interactive: Story = {
    render: () => (
        <EdCard asChild interactive style={{ maxWidth: 240 }}>
            <button onClick={() => alert('picked')}>
                <EdCardHeader eyebrow="VALIDATOR" title="Marcus Chen" />
                <EdCardBody style={{ fontSize: 13 }}>14 open · 2 overdue</EdCardBody>
            </button>
        </EdCard>
    ),
};

export const Selected: Story = {
    render: () => (
        <EdCard asChild interactive selected style={{ maxWidth: 240 }}>
            <button>
                <EdCardHeader eyebrow="VALIDATOR" title="Priya Rao" />
                <EdCardBody style={{ fontSize: 13 }}>8 open · 0 overdue</EdCardBody>
            </button>
        </EdCard>
    ),
};

export const Flat: Story = {
    render: () => (
        <EdCard variant="flat" style={{ maxWidth: 240 }}>
            <EdCardHeader eyebrow="Audit period" title="2026-Q1" />
            <EdCardBody style={{ fontSize: 13 }}>12 weeks remaining</EdCardBody>
        </EdCard>
    ),
};

export const Ghost: Story = {
    render: () => (
        <EdCard asChild variant="ghost" interactive style={{ maxWidth: 240 }}>
            <button>
                <EdCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120, gap: 6 }}>
                    <span style={{ fontSize: 24, color: 'var(--ed-color-text-muted)' }}>+</span>
                    <span style={{ fontSize: 13, color: 'var(--ed-color-text-muted)' }}>New audit period</span>
                </EdCardBody>
            </button>
        </EdCard>
    ),
};
