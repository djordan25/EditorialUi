import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdDialog, EdConfirmation, EdDialogBody, EdDialogActions, type EdDialogSize } from './EdDialog';

const meta: Meta<typeof EdDialog> = {
    title: 'EditorialUI/Containers/EdDialog',
    component: EdDialog,
    parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof EdDialog>;

const Btn = ({
    children,
    variant = 'primary',
    onClick,
}: {
    children: React.ReactNode;
    variant?: 'primary' | 'ghost' | 'secondary' | 'danger';
    onClick?: () => void;
}) => (
    <button
        onClick={onClick}
        style={{
            height: 32,
            padding: '0 14px',
            background:
                variant === 'primary'
                    ? 'var(--ed-color-brand)'
                    : variant === 'danger'
                    ? 'var(--ed-color-status-danger)'
                    : variant === 'secondary'
                    ? 'var(--ed-color-surface-1)'
                    : 'transparent',
            color:
                variant === 'primary' || variant === 'danger'
                    ? '#fff'
                    : 'var(--ed-color-text-primary)',
            border:
                variant === 'secondary'
                    ? '1px solid var(--ed-color-hairline-strong)'
                    : '1px solid transparent',
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

export const Default: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn onClick={() => setOpen(true)}>Reopen finding</Btn>
                <EdDialog
                    open={open}
                    onOpenChange={setOpen}
                    title="Reopen finding"
                    subtitle="F-2438 · CLOSED 2026-03-22"
                    footerMeta="⌘↩ to confirm"
                    footer={
                        <>
                            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
                            <Btn onClick={() => setOpen(false)}>Reopen finding</Btn>
                        </>
                    }
                >
                    <p style={{ marginTop: 0 }}>
                        This will reopen the finding and re-attach it to the active validation queue.
                        Reviewer notes will be preserved; closure timestamp will be cleared.
                    </p>
                    <p style={{ marginBottom: 0, color: 'var(--ed-color-text-muted)', fontSize: 13 }}>
                        Audit log entry will be written.
                    </p>
                </EdDialog>
            </>
        );
    },
};

export const Sizes: Story = {
    render: () => {
        const [size, setSize] = useState<EdDialogSize | null>(null);
        return (
            <div style={{ display: 'flex', gap: 8 }}>
                {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                    <Btn key={s} variant="secondary" onClick={() => setSize(s)}>{s}</Btn>
                ))}
                <EdDialog
                    open={size !== null}
                    onOpenChange={(o) => !o && setSize(null)}
                    size={size ?? 'md'}
                    title={`Dialog — ${size ?? ''}`}
                    footer={<Btn onClick={() => setSize(null)}>Close</Btn>}
                >
                    <p style={{ margin: 0 }}>Body content for the {size} dialog.</p>
                </EdDialog>
            </div>
        );
    },
};

export const ScrollingBody: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn onClick={() => setOpen(true)}>Open long dialog</Btn>
                <EdDialog
                    open={open}
                    onOpenChange={setOpen}
                    title="Audit log"
                    subtitle="F-2438"
                    footer={<Btn onClick={() => setOpen(false)}>Close</Btn>}
                >
                    {Array.from({ length: 30 }, (_, i) => (
                        <p key={i} style={{ marginTop: i === 0 ? 0 : 12 }}>
                            Entry {i + 1}: status changed by marcus.chen at 2026-04-0{(i % 9) + 1}.
                        </p>
                    ))}
                </EdDialog>
            </>
        );
    },
};

export const PreventOutsideClose: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn onClick={() => setOpen(true)}>Open guarded form</Btn>
                <EdDialog
                    open={open}
                    onOpenChange={setOpen}
                    title="New finding"
                    subtitle="Unsaved — Esc and overlay-click are disabled"
                    preventOutsideClose
                    footer={
                        <>
                            <Btn variant="ghost" onClick={() => setOpen(false)}>Discard</Btn>
                            <Btn onClick={() => setOpen(false)}>Save draft</Btn>
                        </>
                    }
                >
                    <p style={{ margin: 0 }}>
                        Outside-click and Esc won't close this dialog — only the explicit buttons do.
                        Use this for forms with unsaved changes.
                    </p>
                </EdDialog>
            </>
        );
    },
};

export const Confirmation: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn variant="danger" onClick={() => setOpen(true)}>Delete period</Btn>
                <EdConfirmation
                    open={open}
                    onOpenChange={setOpen}
                    danger
                    title="Delete audit period"
                    subtitle="2025-Q4 · 312 findings"
                    confirmLabel="Delete period"
                    onConfirm={() => console.log('deleted')}
                    renderActions={({ confirm, cancel, confirmLabel, cancelLabel, danger }) => (
                        <>
                            <Btn variant="ghost" onClick={cancel}>{cancelLabel}</Btn>
                            <Btn variant={danger ? 'danger' : 'primary'} onClick={confirm}>
                                {confirmLabel}
                            </Btn>
                        </>
                    )}
                >
                    All findings, evidence, and audit log entries in this period will be permanently
                    removed. This cannot be undone.
                </EdConfirmation>
            </>
        );
    },
};

export const GuardedEscapeOnly: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn onClick={() => setOpen(true)}>Open (Esc closes, click-away doesn't)</Btn>
                <EdDialog
                    open={open}
                    onOpenChange={setOpen}
                    title="Edit note"
                    subtitle="Escape closes · overlay-click is guarded"
                    dismissOnOutsideClick={false}
                    footer={
                        <>
                            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
                            <Btn onClick={() => setOpen(false)}>Save</Btn>
                        </>
                    }
                >
                    <p style={{ margin: 0 }}>
                        A stray click on the overlay won't discard your edits, but Escape still
                        closes — the two close vectors are controlled independently.
                    </p>
                </EdDialog>
            </>
        );
    },
};

export const ComposedSlots: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn onClick={() => setOpen(true)}>Open composed dialog</Btn>
                <EdDialog
                    open={open}
                    onOpenChange={setOpen}
                    title="Validate project model"
                    titleVisuallyHidden
                    layout="composed"
                    size="lg"
                >
                    {/* Custom title bar between the (hidden) accessible title and the body */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '16px 20px 12px',
                        }}
                    >
                        <span
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: 'var(--ed-color-brand)',
                                color: '#fff',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        >
                            PD
                        </span>
                        <span style={{ fontFamily: 'var(--ed-font-sans)', fontSize: 15, fontWeight: 600 }}>
                            Validate project model
                        </span>
                    </div>
                    <EdDialogBody>
                        <p style={{ marginTop: 0 }}>
                            The body and footer are composed from <code>EdDialogBody</code> and{' '}
                            <code>EdDialogActions</code>, so a custom title bar can sit above them.
                        </p>
                    </EdDialogBody>
                    <EdDialogActions meta="3 checks · 0 errors">
                        <Btn variant="ghost" onClick={() => setOpen(false)}>Close</Btn>
                        <Btn onClick={() => setOpen(false)}>Run validation</Btn>
                    </EdDialogActions>
                </EdDialog>
            </>
        );
    },
};

export const VerifyOpen: Story = {
    render: () => (
        <div style={{ minHeight: 280, minWidth: 380 }}>
            <EdDialog open onOpenChange={() => {}} size="md" title="Reopen finding" subtitle="F-2438 · CLOSED 2026-03-22"
                footer={<><Btn variant="ghost">Cancel</Btn><Btn>Reopen</Btn></>}>
                This will reopen the finding and re-attach it to the active validation queue.
            </EdDialog>
        </div>
    ),
};
