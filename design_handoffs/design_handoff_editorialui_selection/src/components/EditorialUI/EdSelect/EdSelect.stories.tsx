import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdSelect, type EdSelectOption } from './EdSelect';

const meta: Meta<typeof EdSelect> = {
    title: 'EditorialUI/Selection/EdSelect',
    component: EdSelect,
    parameters: { layout: 'centered' },
    argTypes: {
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
        fullWidth: { control: 'boolean' },
    },
    decorators: [
        (Story) => (
            <div style={{ width: 280 }}>
                <Story />
            </div>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof EdSelect>;

const severities: EdSelectOption[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'mra', label: 'MRA' },
    { value: 'mria', label: 'MRIA' },
];

export const Default: Story = {
    args: {
        label: 'Severity',
        options: severities,
        placeholder: 'Select severity…',
        fullWidth: true,
    },
};

export const Filled: Story = {
    args: {
        label: 'Severity',
        options: severities,
        defaultValue: 'medium',
        fullWidth: true,
    },
};

export const Open: Story = {
    args: {
        label: 'Severity',
        options: severities,
        defaultValue: 'medium',
        defaultOpen: true,
        fullWidth: true,
    },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 280 }}>
            <EdSelect label="Severity · sm" options={severities} size="sm" placeholder="Select…" fullWidth />
            <EdSelect label="Severity · md (default)" options={severities} size="md" placeholder="Select…" fullWidth />
            <EdSelect label="Severity · lg" options={severities} size="lg" placeholder="Select…" fullWidth />
        </div>
    ),
};

export const Grouped: Story = {
    args: {
        label: 'Environment',
        defaultValue: 'production',
        fullWidth: true,
        options: [
            {
                kind: 'group',
                label: 'Active',
                items: [
                    { value: 'production', label: 'Production' },
                    { value: 'staging', label: 'Staging' },
                    { value: 'development', label: 'Development' },
                ],
            },
            { kind: 'separator' },
            {
                kind: 'group',
                label: 'Archived',
                items: [
                    { value: '2025-q4', label: '2025 Q4' },
                    { value: '2025-q3', label: '2025 Q3' },
                ],
            },
        ],
    },
};

export const WithMetadata: Story = {
    args: {
        label: 'Owner',
        defaultValue: 'mchen',
        fullWidth: true,
        options: [
            { value: 'hlindqvist', label: 'Hanna Lindqvist', meta: 'Risk Ops' },
            { value: 'mchen', label: 'Marcus Chen', meta: 'Validation' },
            { value: 'prao', label: 'Priya Rao', meta: 'Validation' },
            { value: 'examiner', label: 'Examiner (read-only)', disabled: true },
        ],
    },
};

export const Error: Story = {
    args: {
        label: 'Severity',
        required: true,
        options: severities,
        placeholder: 'Select severity…',
        error: 'Required.',
        fullWidth: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Severity',
        defaultValue: 'medium',
        options: severities,
        disabled: true,
        fullWidth: true,
    },
};

export const Controlled: Story = {
    name: 'ControlledExample',
    render: () => {
        const [value, setValue] = useState('medium');
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 280 }}>
                <EdSelect
                    label="Severity"
                    options={severities}
                    value={value}
                    onValueChange={setValue}
                    fullWidth
                />
                <p style={{ fontFamily: 'var(--ed-font-mono)', fontSize: 12, color: 'var(--ed-color-text-muted)' }}>
                    Selected: {value}
                </p>
            </div>
        );
    },
};
