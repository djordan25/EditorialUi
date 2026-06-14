import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdTextField } from './EdTextField';
import { EdIcon } from '../EdIcon';
import { EdIconButton } from '../EdIconButton';

const meta: Meta<typeof EdTextField> = {
    title: 'EditorialUI/Inputs/EdTextField',
    component: EdTextField,
    parameters: { layout: 'centered' },
    argTypes: {
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
        required: { control: 'boolean' },
        mono: { control: 'boolean' },
        disabled: { control: 'boolean' },
        readOnly: { control: 'boolean' },
        fullWidth: { control: 'boolean' },
    },
    decorators: [
        (Story) => (
            <div style={{ width: 360 }}>
                <Story />
            </div>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof EdTextField>;

export const Default: Story = {
    args: { label: 'Model name', placeholder: 'e.g. PD-Wholesale-2026', fullWidth: true },
};

export const Filled: Story = {
    args: { label: 'Model name', defaultValue: 'PD-Wholesale-2026', fullWidth: true },
};

export const WithHint: Story = {
    args: {
        label: 'Replication path',
        placeholder: 's3://...',
        hint: 'Where validation snapshots are stored.',
        mono: true,
        fullWidth: true,
    },
};

export const Required: Story = {
    args: {
        label: 'Owner',
        placeholder: 'Search users…',
        required: true,
        hint: 'Tier-1 models require a designated owner.',
        fullWidth: true,
    },
};

export const Error: Story = {
    args: {
        label: 'Model name',
        defaultValue: 'pd_wholesale!2026',
        required: true,
        error: 'Use only letters, numbers, and dashes.',
        fullWidth: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Model name',
        defaultValue: 'PD-Wholesale-2026',
        disabled: true,
        fullWidth: true,
    },
};

export const Readonly: Story = {
    args: {
        label: 'Model ID',
        defaultValue: 'M-9F4D-2026',
        readOnly: true,
        mono: true,
        fullWidth: true,
    },
};

export const MonoVariant: Story = {
    args: {
        label: 'S3 path',
        defaultValue: 's3://mriq/snapshots/2026-Q2/',
        mono: true,
        fullWidth: true,
    },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <EdTextField label="Search · sm" size="sm" placeholder="Find…" fullWidth />
            <EdTextField label="Search · md (default)" size="md" placeholder="Find…" fullWidth />
            <EdTextField label="Search · lg" size="lg" placeholder="Find…" fullWidth />
        </div>
    ),
};

export const WithPrefix: Story = {
    args: {
        label: 'Search',
        placeholder: 'Find a model…',
        prefix: <EdIcon name="Search" />,
        fullWidth: true,
    },
};

export const WithSuffix: Story = {
    args: {
        label: 'Threshold',
        defaultValue: '0.05',
        suffix: (
            <span style={{ fontFamily: 'var(--ed-font-mono)', fontSize: 12 }}>bps</span>
        ),
        fullWidth: true,
    },
};

export const WithClear: Story = {
    render: () => {
        const [value, setValue] = useState('Wholesale');
        return (
            <EdTextField
                label="Filter"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                fullWidth
                suffix={
                    value ? (
                        <EdIconButton
                            aria-label="Clear filter"
                            size="sm"
                            icon={<EdIcon name="X" />}
                            onClick={() => setValue('')}
                        />
                    ) : null
                }
            />
        );
    },
};
