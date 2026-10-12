import type { Meta, StoryObj } from '@storybook/react';
import { EdTierBadge } from './EdTierBadge';

const meta: Meta<typeof EdTierBadge> = {
    title: 'EditorialUI/Display/EdTierBadge',
    component: EdTierBadge,
    parameters: { layout: 'padded' },
    args: { tier: 1 },
    argTypes: { tier: { control: 'radio', options: [1, 2, 3, null] } },
};
export default meta;

type Story = StoryObj<typeof EdTierBadge>;

export const Default: Story = {};

export const AllTiers: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <EdTierBadge tier={1} />
            <EdTierBadge tier={2} />
            <EdTierBadge tier={3} />
            <EdTierBadge tier={null} />
        </div>
    ),
};
