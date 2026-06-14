import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdCheckbox } from './EdCheckbox';

const meta: Meta<typeof EdCheckbox> = {
    title: 'EditorialUI/Inputs/EdCheckbox',
    component: EdCheckbox,
    parameters: { layout: 'centered' },
    argTypes: {
        checked: { control: 'boolean' },
        indeterminate: { control: 'boolean' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof EdCheckbox>;

export const Unchecked: Story = { args: { label: 'Include superseded' } };
export const Checked: Story = { args: { label: 'Include superseded', defaultChecked: true } };
export const Indeterminate: Story = { args: { label: 'Select all (3 of 12)', indeterminate: true } };

export const WithDescription: Story = {
    args: {
        label: 'Notify approvers on lock',
        description: 'Sends an email when this graph version is locked for review.',
        defaultChecked: true,
    },
};

export const Error: Story = {
    args: {
        label: 'I accept the terms',
        required: true,
        error: 'Required to continue.',
    },
};

export const Disabled: Story = {
    args: { label: 'Locked by policy', disabled: true },
};

export const DisabledChecked: Story = {
    args: { label: 'Locked by policy', disabled: true, defaultChecked: true },
};

export const GroupVertical: Story = {
    name: 'Group (vertical)',
    render: () => (
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend
                style={{
                    fontFamily: 'var(--ed-font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ed-color-text-secondary)',
                    marginBottom: 10,
                }}
            >
                Severity (any)
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <EdCheckbox label="Low" defaultChecked />
                <EdCheckbox label="Medium" />
                <EdCheckbox label="High" defaultChecked />
                <EdCheckbox label="MRA" />
                <EdCheckbox label="MRIA" />
            </div>
        </fieldset>
    ),
};

export const SelectAllInteractive: Story = {
    name: 'Select-all pattern',
    render: () => {
        const items = ['Low', 'Medium', 'High', 'MRA', 'MRIA'];
        const [checked, setChecked] = useState<Record<string, boolean>>({
            Low: true,
            Medium: false,
            High: true,
            MRA: false,
            MRIA: false,
        });

        const total = items.length;
        const selected = items.filter((i) => checked[i]).length;
        const allChecked = selected === total;
        const someChecked = selected > 0 && selected < total;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <EdCheckbox
                    label={`Select all (${selected} of ${total})`}
                    checked={allChecked}
                    indeterminate={someChecked}
                    onCheckedChange={(v) => {
                        const next = v === true;
                        setChecked(Object.fromEntries(items.map((i) => [i, next])));
                    }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 24 }}>
                    {items.map((i) => (
                        <EdCheckbox
                            key={i}
                            label={i}
                            checked={!!checked[i]}
                            onCheckedChange={(v) =>
                                setChecked((s) => ({ ...s, [i]: v === true }))
                            }
                        />
                    ))}
                </div>
            </div>
        );
    },
};
