import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdNotification } from './EdNotification';

const meta: Meta<typeof EdNotification> = {
    title: 'EditorialUI/Feedback/EdNotification',
    component: EdNotification,
    parameters: { layout: 'padded' },
    argTypes: {
        severity: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
        variant: { control: 'select', options: ['rail', 'subtle', 'compact'] },
    },
    decorators: [(Story) => <div style={{ maxWidth: 720 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof EdNotification>;

// Lightweight stand-in for EdButton in stories.
const Btn = ({ children, variant = 'secondary' }: { children: React.ReactNode; variant?: 'secondary' | 'ghost' }) => (
    <button
        style={{
            height: 28,
            padding: '0 12px',
            background: variant === 'ghost' ? 'transparent' : 'var(--ed-color-surface-1)',
            border: variant === 'ghost' ? '1px solid transparent' : '1px solid var(--ed-color-hairline-strong)',
            borderRadius: 'var(--ed-radius-sm)',
            fontFamily: 'var(--ed-font-sans)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const Info: Story = {
    args: {
        severity: 'info',
        title: 'Audit period preview is read-only',
        description: 'Findings created here will not appear in production until the period is opened.',
    },
};

export const Success: Story = {
    args: {
        severity: 'success',
        title: 'Finding F-2438 closed with evidence',
        description: 'Marcus Chen approved closure on 2026-04-04. Audit log updated.',
        onDismiss: () => {},
    },
};

export const Warning: Story = {
    args: {
        severity: 'warning',
        title: 'Evidence required within 14 days',
        description: 'Findings without evidence by April 18 will reopen automatically.',
        actions: <Btn>Upload evidence</Btn>,
    },
};

export const Danger: Story = {
    args: {
        severity: 'danger',
        title: 'Sync with the model registry failed',
        description: 'Last successful pull: 2 hours ago. Data shown may be stale.',
        actions: (
            <>
                <Btn>Retry</Btn>
                <Btn variant="ghost">View error log</Btn>
            </>
        ),
    },
};

export const Compact: Story = {
    args: {
        severity: 'info',
        variant: 'compact',
        title: 'Sync completed at 11:42 UTC',
    },
};

export const Subtle: Story = {
    args: {
        severity: 'info',
        variant: 'subtle',
        title: 'No prior closures referenced this finding',
        description: 'First-time issue type. Reviewer should consider escalation criteria.',
    },
};

export const WithDismiss: Story = {
    render: () => {
        const [open, setOpen] = useState(true);
        if (!open) {
            return (
                <button onClick={() => setOpen(true)} style={{ fontSize: 13 }}>
                    Show banner again
                </button>
            );
        }
        return (
            <EdNotification
                severity="warning"
                title="Validation evidence is overdue for 4 findings"
                description="Closure won't finalize until evidence is attached. Reviewers were notified at 09:14 UTC."
                actions={
                    <>
                        <Btn>Review findings</Btn>
                        <Btn variant="ghost">Snooze 24h</Btn>
                    </>
                }
                onDismiss={() => setOpen(false)}
            />
        );
    },
};

export const Stacked: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <EdNotification
                severity="danger"
                title="2 findings missed SLA"
                description="F-2438, F-2401 — overdue 5 and 3 days."
            />
            <EdNotification
                severity="warning"
                title="14 findings approaching SLA in 7 days"
            />
        </div>
    ),
};
