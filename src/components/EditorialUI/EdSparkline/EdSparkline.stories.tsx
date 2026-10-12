import type { Meta, StoryObj } from '@storybook/react';
import { EdSparkline } from './EdSparkline';

const series = [2.1, 2.4, 2.2, null, 2.8, 3.1, 2.6, 2.5, 2.9, 3.4, 3.0, 2.7, null, null, 2.4, 2.6, 2.8, 3.3];

const meta: Meta<typeof EdSparkline> = {
    title: 'EditorialUI/Display/EdSparkline',
    component: EdSparkline,
    parameters: { layout: 'padded' },
    args: { values: series, ariaLabel: 'p95 run time, last 18 days', width: 80, height: 24, tone: 'brand', area: true },
    argTypes: { tone: { control: 'radio', options: ['brand', 'success', 'warning', 'danger', 'neutral'] } },
};
export default meta;

type Story = StoryObj<typeof EdSparkline>;

export const Cell: Story = {};

export const Wide: Story = { args: { width: 460, height: 36 } };

export const Empty: Story = { args: { values: [null, null, null], ariaLabel: 'No runs' } };
