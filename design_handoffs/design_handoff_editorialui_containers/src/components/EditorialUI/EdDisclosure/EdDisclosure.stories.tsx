import type { Meta, StoryObj } from '@storybook/react';
import { EdDisclosure } from './EdDisclosure';

const meta: Meta<typeof EdDisclosure> = {
    title: 'EditorialUI/Containers/EdDisclosure',
    component: EdDisclosure,
    parameters: { layout: 'padded' },
    decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof EdDisclosure>;

export const Default: Story = {
    args: {
        label: 'Advanced metadata',
        defaultOpen: true,
        children: (
            <table style={{ width: '100%', fontFamily: 'var(--ed-font-mono)', fontSize: 11, color: 'var(--ed-color-text-secondary)', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr><td style={{ padding: '2px 0', width: 140 }}>internal-id</td><td>fnd-9F4D-2026-2438</td></tr>
                    <tr><td style={{ padding: '2px 0' }}>created-by</td><td>hanna.lindqvist@modelriskiq.com</td></tr>
                    <tr><td style={{ padding: '2px 0' }}>workflow-version</td><td>v3.2.0</td></tr>
                    <tr><td style={{ padding: '2px 0' }}>checksum</td><td>sha256:c47b8a…</td></tr>
                </tbody>
            </table>
        ),
    },
};

export const Collapsed: Story = {
    args: { label: 'Raw JSON', defaultOpen: false, children: <code>{'{ "id": "F-2438" }'}</code> },
};

export const Stacked: Story = {
    render: () => (
        <div>
            <EdDisclosure label="Advanced metadata" defaultOpen>
                <p style={{ margin: 0 }}>Metadata fields render here.</p>
            </EdDisclosure>
            <EdDisclosure label="Raw JSON">
                <pre style={{ margin: 0, fontFamily: 'var(--ed-font-mono)', fontSize: 11 }}>{'{ "id": "F-2438", "status": "open" }'}</pre>
            </EdDisclosure>
            <EdDisclosure label="Debug · request trace">
                <pre style={{ margin: 0, fontFamily: 'var(--ed-font-mono)', fontSize: 11, color: 'var(--ed-color-text-secondary)' }}>
{`trace-id  c47b8a3f-91d2-4f...
duration  142ms
status    200
cache     hit`}
                </pre>
            </EdDisclosure>
        </div>
    ),
};

export const AdvancedOptions: Story = {
    name: 'Advanced options (form context)',
    render: () => (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <label style={{ fontFamily: 'var(--ed-font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ed-color-text-secondary)' }}>Title</label>
                <input defaultValue="Stale model documentation" style={{ height: 36, padding: '0 12px', border: '1px solid var(--ed-color-hairline-strong)', borderRadius: 'var(--ed-radius-sm)', fontFamily: 'var(--ed-font-sans)', fontSize: 14 }} />
            </div>
            <EdDisclosure label="Advanced options" defaultOpen>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ margin: 0, fontSize: 13 }}>Workflow version, notification toggles, etc.</p>
                </div>
            </EdDisclosure>
        </div>
    ),
};
