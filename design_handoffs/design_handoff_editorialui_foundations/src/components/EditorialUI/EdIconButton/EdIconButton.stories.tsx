import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdIconButton } from './EdIconButton';
import { EdIcon } from '../EdIcon';

const meta: Meta<typeof EdIconButton> = {
    title: 'EditorialUI/Inputs/EdIconButton',
    component: EdIconButton,
    parameters: { layout: 'centered' },
    argTypes: {
        variant: { control: 'select', options: ['default', 'bordered', 'filled'] },
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
        disabled: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof EdIconButton>;

export const Default: Story = {
    args: { 'aria-label': 'Search', icon: <EdIcon name="Search" /> },
};

export const Bordered: Story = {
    args: { 'aria-label': 'Edit finding', icon: <EdIcon name="Edit" />, variant: 'bordered' },
};

export const Filled: Story = {
    args: { 'aria-label': 'Add finding', icon: <EdIcon name="Plus" />, variant: 'filled' },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <EdIconButton aria-label="Close" icon={<EdIcon name="X" size="xs" />} size="sm" />
            <EdIconButton aria-label="Close" icon={<EdIcon name="X" />} size="md" />
            <EdIconButton aria-label="Close" icon={<EdIcon name="X" size="lg" />} size="lg" />
        </div>
    ),
};

export const Toggle: Story = {
    render: () => {
        const [pinned, setPinned] = useState(false);
        return (
            <EdIconButton
                aria-label={pinned ? 'Unpin finding' : 'Pin finding'}
                icon={<EdIcon name="Pin" />}
                pressed={pinned}
                onClick={() => setPinned(p => !p)}
            />
        );
    },
};

export const Disabled: Story = {
    args: { 'aria-label': 'Refresh', icon: <EdIcon name="RefreshCw" />, disabled: true },
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <EdIconButton aria-label="Search" icon={<EdIcon name="Search" />} variant="default" />
            <EdIconButton aria-label="Edit" icon={<EdIcon name="Edit" />} variant="bordered" />
            <EdIconButton aria-label="Add" icon={<EdIcon name="Plus" />} variant="filled" />
        </div>
    ),
};
