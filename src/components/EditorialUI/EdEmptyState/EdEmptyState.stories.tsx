import type { Meta, StoryObj } from '@storybook/react';
import { Inbox, Plus, Search, AlertCircle, Check, Lock } from 'lucide-react';
import { EdEmptyState } from './EdEmptyState';

const meta: Meta<typeof EdEmptyState> = {
    title: 'EditorialUI/Feedback/EdEmptyState',
    component: EdEmptyState,
    parameters: { layout: 'padded' },
    argTypes: {
        tone: { control: 'select', options: ['neutral', 'danger', 'success'] },
        compact: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof EdEmptyState>;

const Btn = ({
    children,
    variant = 'primary',
}: {
    children: React.ReactNode;
    variant?: 'primary' | 'ghost' | 'secondary';
}) => (
    <button
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 32,
            padding: '0 14px',
            background:
                variant === 'primary'
                    ? 'var(--ed-color-brand)'
                    : variant === 'secondary'
                    ? 'var(--ed-color-surface-1)'
                    : 'transparent',
            color: variant === 'primary' ? 'var(--ed-color-brand-contrast)' : 'var(--ed-color-text-primary)',
            border: variant === 'secondary' ? '1px solid var(--ed-color-hairline-strong)' : '1px solid transparent',
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

const host = (children: React.ReactNode) => (
    <div
        style={{
            background: 'var(--ed-color-surface-1)',
            border: '1px solid var(--ed-color-hairline)',
            borderRadius: 'var(--ed-radius-md)',
            minHeight: 280,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        {children}
    </div>
);

export const FirstUse: Story = {
    render: () =>
        host(
            <EdEmptyState
                icon={<Plus size={22} strokeWidth={1.5} />}
                title="No findings yet"
                body="Create the first finding to begin tracking validation issues."
                actions={<Btn><Plus size={14} strokeWidth={1.8} /> New finding</Btn>}
            />,
        ),
};

export const NoResults: Story = {
    render: () =>
        host(
            <EdEmptyState
                icon={<Search size={22} strokeWidth={1.5} />}
                title="No findings match these filters"
                body="Try widening the date range or removing severity filters."
                actions={<Btn variant="ghost">Clear filters</Btn>}
            />,
        ),
};

export const ErrorState: Story = {
    name: 'Error (load failed)',
    render: () =>
        host(
            <EdEmptyState
                tone="danger"
                icon={<AlertCircle size={22} strokeWidth={1.5} />}
                title="Couldn't load findings"
                body="The model registry is unreachable. Last successful sync: 2 hours ago."
                actions={
                    <>
                        <Btn variant="secondary">Retry</Btn>
                        <Btn variant="ghost">Check sync status</Btn>
                    </>
                }
            />,
        ),
};

export const SuccessNoAction: Story = {
    render: () =>
        host(
            <EdEmptyState
                tone="success"
                icon={<Check size={22} strokeWidth={1.5} />}
                title="Inbox is clear"
                body="No findings need your attention right now."
            />,
        ),
};

export const Restricted: Story = {
    render: () =>
        host(
            <EdEmptyState
                icon={<Lock size={22} strokeWidth={1.5} />}
                title="Restricted to validators"
                body="Your role doesn't include closure rights. Ask a validator to take action."
                actions={<Btn variant="ghost">Request access</Btn>}
            />,
        ),
};

export const Compact: Story = {
    render: () => (
        <div
            style={{
                width: 280,
                background: 'var(--ed-color-surface-1)',
                border: '1px solid var(--ed-color-hairline)',
                borderRadius: 'var(--ed-radius-md)',
            }}
        >
            <EdEmptyState
                compact
                headingLevel="h3"
                icon={<Inbox size={16} strokeWidth={1.5} />}
                title="No comments"
                body="Add the first comment to start a thread."
            />
        </div>
    ),
};

export const ZeroAction: Story = {
    render: () =>
        host(
            <EdEmptyState
                icon={<Inbox size={22} strokeWidth={1.5} />}
                title="Nothing assigned to you"
                body="Findings assigned to you will appear here."
            />,
        ),
};
