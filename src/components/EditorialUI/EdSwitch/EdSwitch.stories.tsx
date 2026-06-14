import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdSwitch } from './EdSwitch';

const meta: Meta<typeof EdSwitch> = {
    title: 'EditorialUI/Inputs/EdSwitch',
    component: EdSwitch,
    parameters: { layout: 'centered' },
    argTypes: {
        layout: { control: 'radio', options: ['inline', 'row'] },
        loading: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof EdSwitch>;

export const Off: Story = { args: { label: 'Notifications' } };
export const On: Story = { args: { label: 'Notifications', defaultChecked: true } };

export const DisabledOff: Story = {
    name: 'Disabled · off',
    args: { label: 'Notifications', disabled: true },
};
export const DisabledOn: Story = {
    name: 'Disabled · on',
    args: { label: 'Notifications', defaultChecked: true, disabled: true },
};

export const Loading: Story = {
    args: { label: 'Notifications', defaultChecked: true, loading: true },
};

export const WithDescription: Story = {
    args: {
        layout: 'row',
        label: 'Email me when validations complete',
        description: 'For graphs you own or co-own.',
        defaultChecked: true,
    },
    decorators: [
        (Story) => (
            <div style={{ width: 480 }}>
                <Story />
            </div>
        ),
    ],
};

export const InSettingsRow: Story = {
    render: () => (
        <div
            style={{
                width: 560,
                background: 'var(--ed-color-surface-1)',
                border: '1px solid var(--ed-color-hairline)',
                borderRadius: 'var(--ed-radius-md)',
            }}
        >
            {[
                {
                    label: 'Email me when validations complete',
                    description: 'For graphs you own or co-own.',
                    defaultChecked: true,
                },
                {
                    label: 'Page on MRIA findings',
                    description: 'PagerDuty integration via the Risk Ops escalation policy.',
                },
                {
                    label: 'Examiner sessions audit log',
                    description: 'Locked by org policy — cannot be disabled.',
                    defaultChecked: true,
                    disabled: true,
                },
            ].map((row, i, arr) => (
                <div
                    key={row.label}
                    style={{
                        padding: '16px 20px',
                        borderBottom:
                            i < arr.length - 1 ? '1px solid var(--ed-color-hairline)' : 'none',
                    }}
                >
                    <EdSwitch
                        layout="row"
                        label={row.label}
                        description={row.description}
                        defaultChecked={row.defaultChecked}
                        disabled={row.disabled}
                    />
                </div>
            ))}
        </div>
    ),
};

export const OptimisticSaveExample: Story = {
    render: () => {
        const [on, setOn] = useState(false);
        const [saving, setSaving] = useState(false);

        const handleChange = (next: boolean) => {
            setOn(next);
            setSaving(true);
            window.setTimeout(() => setSaving(false), 1200);
        };

        return (
            <div style={{ width: 360 }}>
                <EdSwitch
                    layout="row"
                    label="Examiner mode banner"
                    description="Shows the read-only banner across the app."
                    checked={on}
                    loading={saving}
                    onCheckedChange={handleChange}
                />
            </div>
        );
    },
};
