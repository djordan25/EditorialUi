import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdCheckboxInput } from './EdCheckboxInput';

const meta: Meta<typeof EdCheckboxInput> = {
    title: 'EditorialUI/Forms/EdCheckboxInput',
    component: EdCheckboxInput,
    parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof EdCheckboxInput>;

const rowStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'var(--ed-font-sans)',
    fontSize: 14,
    color: 'var(--ed-color-text-primary)',
    cursor: 'pointer',
};

export const WithExternalLabel: Story = {
    render: () => {
        const [on, setOn] = useState(false);
        return (
            <label style={rowStyle}>
                <EdCheckboxInput checked={on} onChange={(e) => setOn(e.target.checked)} />
                Include superseded findings
            </label>
        );
    },
};

export const Indeterminate: Story = {
    render: () => {
        const [rows, setRows] = useState([true, false, true]);
        const all = rows.every(Boolean);
        const some = rows.some(Boolean) && !all;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ ...rowStyle, fontWeight: 600 }}>
                    <EdCheckboxInput
                        checked={all}
                        indeterminate={some}
                        onChange={(e) => setRows(rows.map(() => e.target.checked))}
                    />
                    Select all
                </label>
                {rows.map((r, i) => (
                    <label key={i} style={{ ...rowStyle, paddingLeft: 20 }}>
                        <EdCheckboxInput
                            checked={r}
                            onChange={(e) => setRows(rows.map((v, j) => (j === i ? e.target.checked : v)))}
                        />
                        Finding F-{1000 + i}
                    </label>
                ))}
            </div>
        );
    },
};

export const ReadOnly: Story = {
    render: () => (
        <label style={rowStyle}>
            <EdCheckboxInput checked readOnly onChange={() => {}} />
            Locked (read-only)
        </label>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 16 }}>
            <label style={rowStyle}>
                <EdCheckboxInput disabled />
                Disabled
            </label>
            <label style={rowStyle}>
                <EdCheckboxInput disabled defaultChecked />
                Disabled + checked
            </label>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <label style={rowStyle}>
                <EdCheckboxInput size="sm" defaultChecked />
                sm
            </label>
            <label style={rowStyle}>
                <EdCheckboxInput size="md" defaultChecked />
                md
            </label>
        </div>
    ),
};
