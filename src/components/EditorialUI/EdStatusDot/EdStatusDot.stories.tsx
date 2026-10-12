import type { Meta, StoryObj } from '@storybook/react';
import { EdStatusDot } from './EdStatusDot';

const meta: Meta<typeof EdStatusDot> = {
    title: 'EditorialUI/Display/EdStatusDot',
    component: EdStatusDot,
    parameters: { layout: 'padded' },
    args: { tone: 'success' },
    argTypes: { tone: { control: 'radio', options: ['success', 'warning', 'danger', 'info', 'neutral'] } },
};
export default meta;

type Story = StoryObj<typeof EdStatusDot>;

export const Default: Story = {};

export const WithLabels: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: 8, fontSize: 12 }}>
            <span><EdStatusDot tone="success" /> all clear</span>
            <span><EdStatusDot tone="warning" /> in review</span>
            <span><EdStatusDot tone="danger" /> failing</span>
            <span><EdStatusDot tone="neutral" /> not validated</span>
        </div>
    ),
};
