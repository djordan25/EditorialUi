import type { Meta, StoryObj } from '@storybook/react';
import { ArrowLeft } from 'lucide-react';
import { EdBreadcrumb } from './EdBreadcrumb';

const meta: Meta<typeof EdBreadcrumb> = {
    title: 'EditorialUI/Navigation/EdBreadcrumb',
    component: EdBreadcrumb,
    parameters: { layout: 'padded' },
    argTypes: {
        separator: { control: 'radio', options: ['slash', 'chevron'] },
        maxItems: { control: { type: 'number', min: 0, max: 8 } },
    },
};
export default meta;

type Story = StoryObj<typeof EdBreadcrumb>;

export const TwoLevel: Story = {
    args: {
        crumbs: [
            { label: 'Findings', href: '#findings' },
            { label: 'F-2438' },
        ],
    },
};

export const ThreeLevel: Story = {
    args: {
        crumbs: [
            { label: 'Findings', href: '#findings' },
            { label: '2026-Q1 audit', href: '#q1' },
            { label: 'F-2438 · Stale documentation' },
        ],
    },
};

export const WithOverflow: Story = {
    args: {
        maxItems: 4,
        crumbs: [
            { label: 'Findings', href: '#findings' },
            { label: '2026-Q1 audit', href: '#q1' },
            { label: 'Credit risk', href: '#credit' },
            { label: 'PD models', href: '#pd' },
            { label: 'F-2438 · Stale documentation' },
        ],
    },
};

export const ChevronSeparator: Story = {
    args: {
        separator: 'chevron',
        crumbs: [
            { label: 'Findings', href: '#findings' },
            { label: '2026-Q1', href: '#q1' },
            { label: 'F-2438' },
        ],
    },
};

export const BackLinkVariant: Story = {
    render: () => (
        <EdBreadcrumb
            crumbs={[
                {
                    label: (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <ArrowLeft size={12} strokeWidth={1.8} /> Back to Findings
                        </span>
                    ),
                    href: '#findings',
                },
            ]}
        />
    ),
};

export const LongLabelsTruncate: Story = {
    args: {
        crumbs: [
            { label: 'Findings', href: '#findings' },
            { label: 'A very long audit period name that should truncate before it pushes the layout', href: '#q1' },
            { label: 'F-2438 · An equally long current finding title that also truncates politely' },
        ],
    },
};
