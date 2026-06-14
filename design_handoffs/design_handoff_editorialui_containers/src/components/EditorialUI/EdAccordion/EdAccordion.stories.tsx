import type { Meta, StoryObj } from '@storybook/react';
import { EdAccordion, type EdAccordionItemData } from './EdAccordion';

const meta: Meta<typeof EdAccordion> = {
    title: 'EditorialUI/Containers/EdAccordion',
    component: EdAccordion,
    parameters: { layout: 'padded' },
    decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof EdAccordion>;

const items: EdAccordionItemData[] = [
    {
        value: 'evidence',
        title: 'Closure evidence',
        meta: '3 documents',
        content:
            'Owner attestation, control evidence, and validator approval are required before closure. All three have been attached.',
    },
    {
        value: 'audit',
        title: 'Audit trail',
        meta: '14 entries',
        content: 'Most recent: 2026-04-04 09:14 — closure attested by Marcus Chen.',
    },
    {
        value: 'related',
        title: 'Related findings',
        meta: '2 in scope',
        content: 'F-2401 (overdue) and F-2287 (closed) reference the same model version.',
    },
];

export const SingleOpen: Story = {
    args: { type: 'single', defaultValue: 'evidence', items },
};

export const MultiOpen: Story = {
    args: { type: 'multiple', defaultValue: ['evidence', 'audit'], items },
};

export const WithMeta: Story = {
    args: { type: 'single', defaultValue: 'evidence', items },
};

export const DefaultExpanded: Story = {
    args: { type: 'single', defaultValue: 'audit', items },
};

export const WithDisabledItem: Story = {
    args: {
        type: 'single',
        defaultValue: 'evidence',
        items: [
            items[0],
            { ...items[1], disabled: true, meta: 'locked' },
            items[2],
        ],
    },
};

export const NoMeta: Story = {
    args: {
        type: 'single',
        defaultValue: 'a',
        items: [
            { value: 'a', title: 'What counts as evidence?', content: 'Any artifact that demonstrates the control operated as designed.' },
            { value: 'b', title: 'Who can approve closure?', content: 'A validator who did not author the finding.' },
            { value: 'c', title: 'What triggers an MRIA?', content: 'A finding open past 90 days with no approved extension.' },
        ],
    },
};
