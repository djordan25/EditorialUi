import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdDrawer, EdDrawerSection, type EdDrawerSize } from './EdDrawer';

const meta: Meta<typeof EdDrawer> = {
    title: 'EditorialUI/Containers/EdDrawer',
    component: EdDrawer,
    parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof EdDrawer>;

const Btn = ({ children, variant = 'primary', onClick }: { children: React.ReactNode; variant?: 'primary' | 'ghost' | 'secondary'; onClick?: () => void }) => (
    <button
        onClick={onClick}
        style={{
            height: 32,
            padding: '0 14px',
            background: variant === 'primary' ? 'var(--ed-color-brand)' : variant === 'secondary' ? 'var(--ed-color-surface-1)' : 'transparent',
            color: variant === 'primary' ? '#fff' : 'var(--ed-color-text-primary)',
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

const badge = (label: string, tone: string) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 8px', borderRadius: 'var(--ed-radius-sm)', background: `var(--ed-color-status-${tone}-bg)`, color: `var(--ed-color-status-${tone})`, fontFamily: 'var(--ed-font-mono)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
    </span>
);

export const NonModalInspect: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn onClick={() => setOpen(true)}>Inspect F-2438</Btn>
                <EdDrawer
                    open={open}
                    onOpenChange={setOpen}
                    crumb="FINDING · F-2438"
                    title="Stale model documentation"
                    description="Inspecting finding F-2438"
                    footer={
                        <>
                            <Btn variant="ghost" onClick={() => setOpen(false)}>Close</Btn>
                            <Btn>Open finding</Btn>
                        </>
                    }
                >
                    <EdDrawerSection label="Status">
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {badge('OPEN', 'warning')}
                            {badge('MEDIUM', 'warning')}
                        </div>
                    </EdDrawerSection>
                    <EdDrawerSection label="Owner">
                        <p style={{ margin: 0, fontSize: 13 }}>Marcus Chen · Validation</p>
                    </EdDrawerSection>
                    <EdDrawerSection label="Description">
                        <p style={{ margin: 0, fontSize: 13, color: 'var(--ed-color-text-secondary)' }}>
                            Model documentation references v2.1 outputs; current production version is v2.3.
                            Two control evidence packs are dated before the v2.3 cutover.
                        </p>
                    </EdDrawerSection>
                    <EdDrawerSection label="Audit trail">
                        <p style={{ margin: 0, fontFamily: 'var(--ed-font-mono)', fontSize: 11, color: 'var(--ed-color-text-muted)', lineHeight: 1.6 }}>
                            2026-03-22 11:42 · created by Hanna Lindqvist<br />
                            2026-03-23 09:14 · assigned to Marcus Chen
                        </p>
                    </EdDrawerSection>
                </EdDrawer>
            </>
        );
    },
};

export const ModalEdit: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn onClick={() => setOpen(true)}>Reassign owner</Btn>
                <EdDrawer
                    open={open}
                    onOpenChange={setOpen}
                    modal
                    crumb="EDIT"
                    title="Reassign finding owner"
                    footer={
                        <>
                            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
                            <Btn onClick={() => setOpen(false)}>Reassign</Btn>
                        </>
                    }
                >
                    <EdDrawerSection label="New owner">
                        <input
                            placeholder="Search users…"
                            style={{ width: '100%', height: 36, padding: '0 12px', border: '1px solid var(--ed-color-hairline-strong)', borderRadius: 'var(--ed-radius-sm)', fontFamily: 'var(--ed-font-sans)', fontSize: 14 }}
                        />
                    </EdDrawerSection>
                </EdDrawer>
            </>
        );
    },
};

export const Sizes: Story = {
    render: () => {
        const [size, setSize] = useState<EdDrawerSize | null>(null);
        return (
            <div style={{ display: 'flex', gap: 8 }}>
                {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                    <Btn key={s} variant="secondary" onClick={() => setSize(s)}>{s}</Btn>
                ))}
                <EdDrawer
                    open={size !== null}
                    onOpenChange={(o) => !o && setSize(null)}
                    size={size ?? 'md'}
                    modal
                    crumb="DRAWER"
                    title={`Size — ${size ?? ''}`}
                    footer={<Btn onClick={() => setSize(null)}>Close</Btn>}
                >
                    <EdDrawerSection label="Body">
                        <p style={{ margin: 0, fontSize: 13 }}>Content for the {size} drawer.</p>
                    </EdDrawerSection>
                </EdDrawer>
            </div>
        );
    },
};

export const LeftSide: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Btn onClick={() => setOpen(true)}>Open left drawer</Btn>
                <EdDrawer
                    open={open}
                    onOpenChange={setOpen}
                    modal
                    side="left"
                    crumb="NAV"
                    title="Filters"
                    footer={<Btn onClick={() => setOpen(false)}>Apply</Btn>}
                >
                    <EdDrawerSection label="Severity">
                        <p style={{ margin: 0, fontSize: 13, color: 'var(--ed-color-text-secondary)' }}>Filter controls render here.</p>
                    </EdDrawerSection>
                </EdDrawer>
            </>
        );
    },
};

export const VerifyOpen: Story = {
    render: () => (
        <div style={{ minHeight: 280, minWidth: 380 }}>
            <EdDrawer open onOpenChange={() => {}} modal size="md" crumb="FINDING · F-2438"
                title="Stale model documentation" footer={<Btn>Save</Btn>}>
                <EdDrawerSection label="Status">Open · awaiting validation</EdDrawerSection>
            </EdDrawer>
        </div>
    ),
};
