import type { Meta, StoryObj } from '@storybook/react';
import { EdButton } from './EdButton';
import { EdIcon } from '../EdIcon';

const meta: Meta<typeof EdButton> = {
    title: 'EditorialUI/Inputs/EdButton',
    component: EdButton,
    parameters: { layout: 'centered' },
    argTypes: {
        variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger', 'link'] },
        size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
        loading: { control: 'boolean' },
        disabled: { control: 'boolean' },
        fullWidth: { control: 'boolean' },
    },
};
export default meta;

type Story = StoryObj<typeof EdButton>;

export const Primary: Story = { args: { variant: 'primary', children: 'Save changes' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancel' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'View details' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Delete model' } };
export const Link: Story = { args: { variant: 'link', children: 'Reset password' } };

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <EdButton variant="primary" size="sm">Save</EdButton>
            <EdButton variant="primary" size="md">Save</EdButton>
            <EdButton variant="primary" size="lg">Save</EdButton>
            <EdButton variant="primary" size="xl">Sign in</EdButton>
        </div>
    ),
};

export const WithLeadingIcon: Story = {
    args: {
        variant: 'secondary',
        leadingIcon: <EdIcon name="Plus" />,
        children: 'Add model',
    },
};

export const WithTrailingIcon: Story = {
    args: {
        variant: 'secondary',
        trailingIcon: <EdIcon name="ChevronDown" />,
        children: 'Export',
    },
};

export const Loading: Story = { args: { variant: 'primary', loading: true, children: 'Saving…' } };

export const Disabled: Story = { args: { variant: 'primary', disabled: true, children: 'Save' } };

export const AsChild: Story = {
    render: () => (
        <EdButton asChild variant="secondary">
            <a href="https://example.com" target="_blank" rel="noreferrer">Linked button</a>
        </EdButton>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: 12 }}>
            {(['primary', 'secondary', 'ghost', 'danger', 'link'] as const).map((variant) => (
                <EdButton key={variant} variant={variant}>{variant}</EdButton>
            ))}
        </div>
    ),
};
