import type { Meta, StoryObj } from '@storybook/react';
import { EdAvatar } from './EdAvatar';

const meta: Meta<typeof EdAvatar> = {
    title: 'EditorialUI/Display/EdAvatar',
    component: EdAvatar,
    parameters: { layout: 'padded' },
    args: { name: 'Anika Rao', size: 'sm' },
    argTypes: { size: { control: 'radio', options: ['sm', 'md'] } },
};
export default meta;

type Story = StoryObj<typeof EdAvatar>;

export const Default: Story = {};

export const Row: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {['Anika Rao', 'Tomás Ferreira', 'Henrik Lindqvist', 'Priya'].map(n => (
                <EdAvatar key={n} name={n} />
            ))}
            <EdAvatar name="Mei Tanaka" size="md" />
        </div>
    ),
};
