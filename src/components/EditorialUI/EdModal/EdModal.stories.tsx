import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdModal } from './EdModal';

const meta: Meta<typeof EdModal> = {
    title: 'EditorialUI/Containers/EdModal',
    component: EdModal,
    parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof EdModal>;

const Btn = ({
    children,
    variant = 'primary',
    onClick,
    disabled,
}: {
    children: React.ReactNode;
    variant?: 'primary' | 'ghost' | 'secondary' | 'danger';
    onClick?: () => void;
    disabled?: boolean;
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            height: 32,
            padding: '0 14px',
            background:
                variant === 'primary' ? 'var(--ed-color-brand)'
                : variant === 'danger' ? 'var(--ed-color-status-danger)'
                : variant === 'secondary' ? 'var(--ed-color-surface-1)'
                : 'transparent',
            color: variant === 'primary' || variant === 'danger' ? '#fff' : 'var(--ed-color-text-primary)',
            border: variant === 'secondary' ? '1px solid var(--ed-color-hairline-strong)' : '1px solid transparent',
            borderRadius: 'var(--ed-radius-sm)',
            fontFamily: 'var(--ed-font-sans)',
            fontSize: 13,
            fontWeight: 500,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
        }}
    >
        {children}
    </button>
);

export const Confirmation: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn onClick={() => setOpen(true)}>Reopen finding</Btn>
                <EdModal
                    open={open}
                    onOpenChange={setOpen}
                    size="sm"
                    title="Reopen finding F-2438?"
                    footer={
                        <>
                            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
                            <Btn onClick={() => setOpen(false)}>Reopen</Btn>
                        </>
                    }
                >
                    Closure timestamp will be cleared and the finding will re-enter the validation queue.
                </EdModal>
            </>
        );
    },
};

export const Form: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        const field = (label: string, node: React.ReactNode) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontFamily: 'var(--ed-font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ed-color-text-secondary)' }}>{label}</label>
                {node}
            </div>
        );
        const input = (ph: string) => (
            <input placeholder={ph} style={{ height: 36, padding: '0 12px', border: '1px solid var(--ed-color-hairline-strong)', borderRadius: 'var(--ed-radius-sm)', fontFamily: 'var(--ed-font-sans)', fontSize: 14 }} />
        );
        return (
            <>
                <Btn onClick={() => setOpen(true)}>New finding</Btn>
                <EdModal
                    open={open}
                    onOpenChange={setOpen}
                    size="md"
                    title="New finding"
                    subtitle="PD model — quarterly review"
                    footerMeta="All fields autosave"
                    footer={
                        <>
                            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
                            <Btn variant="secondary">Save draft</Btn>
                            <Btn onClick={() => setOpen(false)}>Open finding</Btn>
                        </>
                    }
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {field('Title', input('Short, factual headline'))}
                        {field('Severity', input('Medium'))}
                        {field('Description', (
                            <textarea placeholder="What is the issue, evidence, and recommended action?" style={{ height: 80, padding: '10px 12px', border: '1px solid var(--ed-color-hairline-strong)', borderRadius: 'var(--ed-radius-sm)', fontFamily: 'var(--ed-font-sans)', fontSize: 14, resize: 'vertical' }} />
                        ))}
                    </div>
                </EdModal>
            </>
        );
    },
};

export const Busy: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn onClick={() => setOpen(true)}>Import findings</Btn>
                <EdModal
                    open={open}
                    onOpenChange={setOpen}
                    size="md"
                    title="Importing 312 findings"
                    subtitle="From audit-period-2025Q4.csv"
                    busy
                    busyStatus="Stage 2 of 4 — validating columns"
                    busyContent={
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                <span style={{ color: 'var(--ed-color-text-secondary)' }}>Stage 2 of 4 — validating columns</span>
                                <span style={{ fontFamily: 'var(--ed-font-mono)' }}>42%</span>
                            </div>
                            <div style={{ height: 10, background: 'var(--ed-color-surface-3)', borderRadius: 9999, overflow: 'hidden' }}>
                                <div style={{ width: '42%', height: '100%', background: 'var(--ed-color-brand)', borderRadius: 9999 }} />
                            </div>
                        </div>
                    }
                    footer={<Btn variant="danger" onClick={() => setOpen(false)}>Cancel import</Btn>}
                >
                    <p style={{ margin: 0 }}>Closing this dialog will cancel the import.</p>
                </EdModal>
            </>
        );
    },
};

export const DangerVariant: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn variant="danger" onClick={() => setOpen(true)}>Delete period</Btn>
                <EdModal
                    open={open}
                    onOpenChange={setOpen}
                    size="sm"
                    danger
                    title="Delete audit period?"
                    subtitle="2025-Q4 · 312 findings"
                    footer={
                        <>
                            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
                            <Btn variant="danger" onClick={() => setOpen(false)}>Delete period</Btn>
                        </>
                    }
                >
                    All findings, evidence, and audit log entries in this period will be permanently removed.
                </EdModal>
            </>
        );
    },
};

export const VerifyOpen: Story = {
    render: () => (
        <div style={{ minHeight: 280, minWidth: 380 }}>
            <EdModal open onOpenChange={() => {}} size="md" title="New finding" subtitle="PD-Wholesale-2026"
                footer={<><Btn variant="ghost">Cancel</Btn><Btn>Create</Btn></>}>
                Capture the issue, its owner, and a severity so the validation queue can route it.
            </EdModal>
        </div>
    ),
};
