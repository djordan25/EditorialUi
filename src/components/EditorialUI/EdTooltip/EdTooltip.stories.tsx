import type { Meta, StoryObj } from '@storybook/react';
import { EdTooltip, EdTooltipProvider } from './EdTooltip';

const meta: Meta<typeof EdTooltip> = {
    title: 'EditorialUI/Feedback/EdTooltip',
    component: EdTooltip,
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <EdTooltipProvider delayDuration={500} skipDelayDuration={300}>
                <div style={{ padding: 60 }}>
                    <Story />
                </div>
            </EdTooltipProvider>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof EdTooltip>;

// Minimal trigger styled like an EdButton for the stories (real consumers pass EdButton).
const Btn = ({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...rest}
        style={{
            height: 36,
            padding: '0 16px',
            background: 'var(--ed-color-surface-1)',
            border: '1px solid var(--ed-color-hairline-strong)',
            borderRadius: 'var(--ed-radius-sm)',
            fontFamily: 'var(--ed-font-sans)',
            fontWeight: 500,
            fontSize: 14,
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const Default: Story = {
    render: () => (
        <EdTooltip label="Reopen finding">
            <Btn>Reopen</Btn>
        </EdTooltip>
    ),
};

export const WithKbd: Story = {
    render: () => (
        <EdTooltip label="Save draft" kbd="⌘S">
            <Btn>Save draft</Btn>
        </EdTooltip>
    ),
};

export const Rich: Story = {
    render: () => (
        <EdTooltip
            title="MRIA"
            body="Matter Requiring Immediate Attention. Highest severity. Closure must occur within 90 days; failure triggers regulator escalation."
        >
            <span
                tabIndex={0}
                style={{
                    fontFamily: 'var(--ed-font-mono)',
                    fontSize: 13,
                    borderBottom: '1px dotted var(--ed-color-hairline-bold)',
                    cursor: 'help',
                }}
            >
                MRIA
            </span>
        </EdTooltip>
    ),
};

export const TruncatedText: Story = {
    render: () => (
        <EdTooltip label="F-2438 — Stale model documentation in PD model v2.3">
            <span
                tabIndex={0}
                style={{
                    display: 'inline-block',
                    maxWidth: 160,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontFamily: 'var(--ed-font-mono)',
                    fontSize: 13,
                    verticalAlign: 'bottom',
                }}
            >
                F-2438 — Stale model documentation in PD…
            </span>
        </EdTooltip>
    ),
};

export const Placements: Story = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 48, placeItems: 'center' }}>
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
                <EdTooltip key={side} label={side[0].toUpperCase() + side.slice(1)} side={side}>
                    <Btn>{side}</Btn>
                </EdTooltip>
            ))}
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <EdTooltip label="You won't see me" disabled>
            <Btn>No tooltip</Btn>
        </EdTooltip>
    ),
};

export const VerifyOpen: Story = {
    render: () => (
        <EdTooltip open onOpenChange={() => {}} label="Save draft" kbd="⌘S">
            <button>Save draft</button>
        </EdTooltip>
    ),
};
