import type { Meta, StoryObj } from '@storybook/react';
import { EdKeyValueTable, EdNativeTable } from './EdNativeTable';

const meta: Meta = {
    title: 'EditorialUI/Data/EdNativeTable',
    parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

const badge = (label: string, tone: string) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 'var(--ed-radius-sm)', background: `var(--ed-color-status-${tone}-bg)`, color: `var(--ed-color-status-${tone})`, fontFamily: 'var(--ed-font-mono)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
);

export const KeyValue: Story = {
    render: () => (
        <div style={{ maxWidth: 480 }}>
            <EdKeyValueTable
                rows={[
                    { label: 'ID', value: 'F-2438', mono: true },
                    { label: 'Created', value: '2026-03-22 · Hanna Lindqvist' },
                    { label: 'Owner', value: 'Marcus Chen' },
                    { label: 'Severity', value: badge('MEDIUM', 'warning') },
                    { label: 'Regulations', value: 'PRA SS3/21, CCAR 2025' },
                    { label: 'SHA-256', value: 'c47b8a3f91d2…', mono: true },
                ]}
            />
        </div>
    ),
};

export const Columned: Story = {
    render: () => (
        <div style={{ maxWidth: 420 }}>
            <EdNativeTable
                columns={[
                    { header: 'Validator', key: 'name' },
                    { header: 'Findings', key: 'open', mono: true, align: 'right' },
                    { header: 'Overdue', key: 'overdue', mono: true, align: 'right', render: (v) => (
                        <span style={{ color: Number(v) > 0 ? 'var(--ed-color-status-danger)' : undefined }}>{v as number}</span>
                    ) },
                ]}
                rows={[
                    { name: 'Marcus Chen', open: 14, overdue: 2 },
                    { name: 'Priya Rao', open: 8, overdue: 0 },
                    { name: 'Hanna Lindqvist', open: 11, overdue: 1 },
                ]}
            />
        </div>
    ),
};

export const Zebra: Story = {
    render: () => (
        <div style={{ maxWidth: 420 }}>
            <EdNativeTable
                zebra
                columns={[
                    { header: 'Quarter', key: 'q', mono: true },
                    { header: 'Open', key: 'open', mono: true, align: 'right' },
                    { header: 'Closed', key: 'closed', mono: true, align: 'right' },
                    { header: 'MRA', key: 'mra', mono: true, align: 'right' },
                ]}
                rows={[
                    { q: '2026-Q1', open: 87, closed: 211, mra: 3 },
                    { q: '2025-Q4', open: 42, closed: 298, mra: 5 },
                    { q: '2025-Q3', open: 12, closed: 312, mra: 2 },
                ]}
            />
        </div>
    ),
};

export const InSidePanel: Story = {
    render: () => (
        <div style={{ maxWidth: 320, border: '1px solid var(--ed-color-hairline)', borderRadius: 'var(--ed-radius-md)', padding: 16, background: 'var(--ed-color-surface-1)' }}>
            <p style={{ margin: '0 0 8px', fontFamily: 'var(--ed-font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ed-color-text-muted)' }}>Metadata</p>
            <EdKeyValueTable
                labelWidth={80}
                rows={[
                    { label: 'Version', value: 'v3.2.0' },
                    { label: 'Updated', value: '2 days ago' },
                    { label: 'Author', value: 'marcus.chen', mono: true },
                ]}
            />
        </div>
    ),
};
