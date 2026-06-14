import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdRadioGroup, EdRadio } from './EdRadioGroup';

const meta: Meta<typeof EdRadioGroup> = {
    title: 'EditorialUI/Inputs/EdRadioGroup',
    component: EdRadioGroup,
    parameters: { layout: 'centered' },
    argTypes: {
        orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
        disabled: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof EdRadioGroup>;

export const Vertical: Story = {
    args: {
        label: 'Validation cadence',
        defaultValue: 'daily',
        children: (
            <>
                <EdRadio value="daily" label="Daily" />
                <EdRadio value="weekly" label="Weekly" />
                <EdRadio value="monthly" label="Monthly" />
                <EdRadio value="ondemand" label="On-demand only" />
            </>
        ),
    },
};

export const Horizontal: Story = {
    args: {
        label: 'View',
        defaultValue: 'table',
        orientation: 'horizontal',
        children: (
            <>
                <EdRadio value="table" label="Table" />
                <EdRadio value="inspector" label="Inspector" />
                <EdRadio value="graph" label="Graph" />
            </>
        ),
    },
};

export const WithDescriptions: Story = {
    args: {
        label: 'Approval mode',
        defaultValue: 'two-person',
        children: (
            <>
                <EdRadio
                    value="single"
                    label="Single-approver"
                    description="Any member of the Risk Ops team can approve a graph version for production."
                />
                <EdRadio
                    value="two-person"
                    label="Two-person rule (recommended)"
                    description="Approval requires sign-off from one Risk Ops and one Validation user."
                />
                <EdRadio
                    value="committee"
                    label="Committee"
                    description="Approval requires a vote from the Model Risk Committee. Slower; for tier-1 models only."
                />
            </>
        ),
    },
    decorators: [
        (Story) => (
            <div style={{ width: 520 }}>
                <Story />
            </div>
        ),
    ],
};

export const DisabledSingle: Story = {
    name: 'Disabled (single option)',
    args: {
        label: 'Cadence',
        defaultValue: 'daily',
        children: (
            <>
                <EdRadio value="daily" label="Daily" />
                <EdRadio value="weekly" label="Weekly" />
                <EdRadio value="monthly" label="Monthly (plan upgrade required)" disabled />
            </>
        ),
    },
};

export const DisabledAll: Story = {
    name: 'Disabled (all options)',
    args: {
        label: 'Cadence',
        defaultValue: 'daily',
        disabled: true,
        children: (
            <>
                <EdRadio value="daily" label="Daily" />
                <EdRadio value="weekly" label="Weekly" />
                <EdRadio value="monthly" label="Monthly" />
            </>
        ),
    },
};

export const WithError: Story = {
    args: {
        label: 'Approval mode',
        required: true,
        error: 'Select an approval mode to continue.',
        children: (
            <>
                <EdRadio value="single" label="Single-approver" />
                <EdRadio value="two-person" label="Two-person rule" />
                <EdRadio value="committee" label="Committee" />
            </>
        ),
    },
};

export const Controlled: Story = {
    name: 'ControlledExample',
    render: () => {
        const [value, setValue] = useState('weekly');
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <EdRadioGroup label="Cadence" value={value} onValueChange={setValue}>
                    <EdRadio value="daily" label="Daily" />
                    <EdRadio value="weekly" label="Weekly" />
                    <EdRadio value="monthly" label="Monthly" />
                </EdRadioGroup>
                <p style={{ fontFamily: 'var(--ed-font-mono)', fontSize: 12, color: 'var(--ed-color-text-muted)' }}>
                    Selected: {value}
                </p>
            </div>
        );
    },
};
