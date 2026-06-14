import type { Meta, StoryObj } from '@storybook/react';
import { EdStatusBadge, type EdStatusBadgeTone, type EdStatusBadgeStyle } from './EdStatusBadge';

const meta: Meta<typeof EdStatusBadge> = {
    title: 'EditorialUI/Feedback/EdStatusBadge',
    component: EdStatusBadge,
    parameters: { layout: 'centered' },
    argTypes: {
        badgeStyle: { control: 'select', options: ['soft', 'solid', 'outline'] },
        tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger', 'brand'] },
        dot: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof EdStatusBadge>;

const allTones: EdStatusBadgeTone[] = ['neutral', 'info', 'success', 'warning', 'danger', 'brand'];

const row = (badgeStyle: EdStatusBadgeStyle) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} key={badgeStyle}>
        {allTones.map((t) => (
            <EdStatusBadge key={`${badgeStyle}-${t}`} badgeStyle={badgeStyle} tone={t}>
                {t.toUpperCase()}
            </EdStatusBadge>
        ))}
    </div>
);

export const AllSoft: Story = { render: () => row('soft') };
export const AllSolid: Story = { render: () => row('solid') };
export const AllOutline: Story = { render: () => row('outline') };

export const FindingLifecycle: Story = {
    render: () => (
        <table style={{ fontFamily: 'var(--ed-font-sans)', fontSize: 13, borderCollapse: 'collapse' }}>
            <tbody>
                {[
                    { tone: 'neutral', dot: false, label: 'DRAFT', meaning: 'created, not yet opened' },
                    { tone: 'warning', dot: true,  label: 'OPEN', meaning: 'action required' },
                    { tone: 'info',    dot: true,  label: 'IN_REVIEW', meaning: 'awaiting validator' },
                    { tone: 'success', dot: false, label: 'CLOSED', meaning: 'resolved with evidence' },
                    { tone: 'danger',  dot: true,  label: 'OVERDUE', meaning: 'past SLA' },
                ].map((row) => (
                    <tr key={row.label}>
                        <td style={{ padding: '8px 16px 8px 0' }}>
                            <EdStatusBadge tone={row.tone as EdStatusBadgeTone} dot={row.dot}>
                                {row.label}
                            </EdStatusBadge>
                        </td>
                        <td style={{ color: 'var(--ed-color-text-secondary)' }}>{row.meaning}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ),
};

export const Severity: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <EdStatusBadge tone="neutral">LOW</EdStatusBadge>
            <EdStatusBadge tone="warning">MEDIUM</EdStatusBadge>
            <EdStatusBadge tone="danger">HIGH</EdStatusBadge>
            <EdStatusBadge badgeStyle="solid" tone="danger">MRA</EdStatusBadge>
            <EdStatusBadge badgeStyle="solid" tone="danger">MRIA</EdStatusBadge>
        </div>
    ),
};

export const WithDot: Story = {
    args: { tone: 'warning', dot: true, children: 'OPEN' },
};

export const InTable: Story = {
    render: () => (
        <table style={{ fontFamily: 'var(--ed-font-sans)', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid var(--ed-color-hairline)' }}>
                    {['ID', 'Status', 'Severity', 'Owner'].map((h) => (
                        <th
                            key={h}
                            style={{
                                textAlign: 'left',
                                padding: '8px 16px 8px 0',
                                fontFamily: 'var(--ed-font-mono)',
                                fontSize: 10,
                                letterSpacing: '0.06em',
                                color: 'var(--ed-color-text-muted)',
                                textTransform: 'uppercase',
                            }}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {[
                    { id: 'F-2438', status: ['warning', true,  'OPEN'],     sev: ['warning', false, 'MEDIUM'], owner: 'Marcus Chen' },
                    { id: 'F-2401', status: ['danger',  true,  'OVERDUE'],  sev: ['solid-danger', false, 'MRA'], owner: 'Priya Rao' },
                    { id: 'F-2287', status: ['success', false, 'CLOSED'],   sev: ['neutral', false, 'LOW'],    owner: 'Hanna Lindqvist' },
                ].map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--ed-color-hairline)' }}>
                        <td style={{ padding: '10px 16px 10px 0', fontFamily: 'var(--ed-font-mono)' }}>{r.id}</td>
                        <td style={{ padding: '10px 16px 10px 0' }}>
                            <EdStatusBadge tone={r.status[0] as EdStatusBadgeTone} dot={r.status[1] as boolean}>
                                {r.status[2] as string}
                            </EdStatusBadge>
                        </td>
                        <td style={{ padding: '10px 16px 10px 0' }}>
                            {r.sev[0] === 'solid-danger' ? (
                                <EdStatusBadge badgeStyle="solid" tone="danger">{r.sev[2] as string}</EdStatusBadge>
                            ) : (
                                <EdStatusBadge tone={r.sev[0] as EdStatusBadgeTone}>{r.sev[2] as string}</EdStatusBadge>
                            )}
                        </td>
                        <td style={{ padding: '10px 16px 10px 0' }}>{r.owner}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ),
};
