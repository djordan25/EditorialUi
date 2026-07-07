import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import {
    EdAccordionSection,
    EdAccordionSummary,
    EdAccordionDetails,
} from './EdAccordionSection';

const meta: Meta<typeof EdAccordionSection> = {
    title: 'EditorialUI/Display/EdAccordionSection',
    component: EdAccordionSection,
    parameters: { layout: 'padded' },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 520 }}>
                <Story />
            </div>
        ),
    ],
};
export default meta;
type Story = StoryObj<typeof EdAccordionSection>;

export const Default: Story = {
    render: () => (
        <EdAccordionSection defaultExpanded>
            <EdAccordionSummary>Closure evidence</EdAccordionSummary>
            <EdAccordionDetails>
                Three documents were attached on 2026-04-02 by the model owner.
            </EdAccordionDetails>
        </EdAccordionSection>
    ),
};

export const IndependentSections: Story = {
    render: () => (
        <>
            <EdAccordionSection defaultExpanded>
                <EdAccordionSummary>Closure evidence</EdAccordionSummary>
                <EdAccordionDetails>Evidence body…</EdAccordionDetails>
            </EdAccordionSection>
            <EdAccordionSection>
                <EdAccordionSummary>Audit trail</EdAccordionSummary>
                <EdAccordionDetails>Audit body…</EdAccordionDetails>
            </EdAccordionSection>
            <EdAccordionSection disabled>
                <EdAccordionSummary>Sign-off (locked)</EdAccordionSummary>
                <EdAccordionDetails>Unavailable.</EdAccordionDetails>
            </EdAccordionSection>
        </>
    ),
};

export const CustomExpandIcon: Story = {
    render: () => (
        <EdAccordionSection>
            <EdAccordionSummary expandIcon={<SlidersHorizontal size={15} strokeWidth={1.8} />}>
                Filters
            </EdAccordionSummary>
            <EdAccordionDetails>Filter controls…</EdAccordionDetails>
        </EdAccordionSection>
    ),
};

export const Controlled: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <button type="button" onClick={() => setOpen((o) => !o)} style={{ marginBottom: 12 }}>
                    Toggle from outside ({open ? 'open' : 'closed'})
                </button>
                <EdAccordionSection expanded={open} onExpandedChange={(v) => setOpen(v)}>
                    <EdAccordionSummary>Advanced settings</EdAccordionSummary>
                    <EdAccordionDetails>Controlled content…</EdAccordionDetails>
                </EdAccordionSection>
            </>
        );
    },
};
