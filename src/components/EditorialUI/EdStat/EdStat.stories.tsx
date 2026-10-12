import type { Meta, StoryObj } from '@storybook/react';
import { EdStat, EdStatGrid } from './EdStat';

const meta: Meta<typeof EdStatGrid> = {
    title: 'EditorialUI/Display/EdStat',
    component: EdStatGrid,
    parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof EdStatGrid>;

export const Operational: Story = {
    render: () => (
        <div style={{ maxWidth: 460 }}>
            <EdStatGrid columns={3}>
                <EdStat label="Runs" value="412" />
                <EdStat label="Error rate" value="1.21%" tone="warning" />
                <EdStat label="P95 latency" value="2.84s" />
            </EdStatGrid>
        </div>
    ),
};

export const Governance: Story = {
    render: () => (
        <EdStatGrid columns={4}>
            <EdStat label="Owner" value="Anika Rao" />
            <EdStat label="Team" value="Market Risk" />
            <EdStat label="Regulator" value="PRA / ECB" />
            <EdStat label="Materiality" value="high" tone="warning" />
        </EdStatGrid>
    ),
};
