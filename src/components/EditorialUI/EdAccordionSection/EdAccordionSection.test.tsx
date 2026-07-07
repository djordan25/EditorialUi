import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
    EdAccordionDetails,
    EdAccordionSection,
    EdAccordionSummary,
} from './EdAccordionSection';

function Section(props: {
    expanded?: boolean;
    defaultExpanded?: boolean;
    disabled?: boolean;
    onExpandedChange?: (expanded: boolean, e: unknown) => void;
    expandIcon?: React.ReactNode;
}) {
    return (
        <EdAccordionSection
            expanded={props.expanded}
            defaultExpanded={props.defaultExpanded}
            disabled={props.disabled}
            onExpandedChange={props.onExpandedChange}
        >
            <EdAccordionSummary expandIcon={props.expandIcon}>
                Closure evidence
            </EdAccordionSummary>
            <EdAccordionDetails>evidence body</EdAccordionDetails>
        </EdAccordionSection>
    );
}

describe('EdAccordionSection', () => {
    it('renders a compound summary trigger, collapsed by default', () => {
        render(<Section />);
        const trigger = screen.getByRole('button', { name: /Closure evidence/ });
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('defaultExpanded opens the section', () => {
        render(<Section defaultExpanded />);
        expect(screen.getByRole('button', { name: /Closure evidence/ })).toHaveAttribute(
            'aria-expanded',
            'true',
        );
        expect(screen.getByText('evidence body')).toBeVisible();
    });

    it('clicking the summary toggles it (uncontrolled)', async () => {
        render(<Section />);
        const trigger = screen.getByRole('button', { name: /Closure evidence/ });
        await userEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        await userEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('fires onExpandedChange with (isExpanded, null)', async () => {
        const onExpandedChange = vi.fn();
        render(<Section onExpandedChange={onExpandedChange} />);
        await userEvent.click(screen.getByRole('button', { name: /Closure evidence/ }));
        expect(onExpandedChange).toHaveBeenCalledWith(true, null);
    });

    it('respects the controlled expanded prop', async () => {
        const onExpandedChange = vi.fn();
        const { rerender } = render(<Section expanded onExpandedChange={onExpandedChange} />);
        const trigger = screen.getByRole('button', { name: /Closure evidence/ });
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        // Clicking requests collapse but the parent owns the state.
        await userEvent.click(trigger);
        expect(onExpandedChange).toHaveBeenCalledWith(false, null);
        expect(trigger).toHaveAttribute('aria-expanded', 'true'); // unchanged until parent updates
        rerender(<Section expanded={false} onExpandedChange={onExpandedChange} />);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('renders a custom expandIcon', () => {
        render(<Section expandIcon={<span data-testid="custom-icon">▾</span>} />);
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('auto-wires the summary↔details ARIA association in both directions', () => {
        render(<Section defaultExpanded />);
        const trigger = screen.getByRole('button', { name: /Closure evidence/ });
        // trigger → panel resolves to a real element
        const controls = trigger.getAttribute('aria-controls');
        expect(controls).toBeTruthy();
        const panel = document.getElementById(controls!);
        expect(panel).not.toBeNull();
        // panel → trigger back-reference resolves to this trigger
        const labelledby = panel!.getAttribute('aria-labelledby');
        expect(labelledby).toBeTruthy();
        expect(document.getElementById(labelledby!)).toBe(trigger);
    });

    it('a disabled section cannot be opened', async () => {
        render(<Section disabled />);
        const trigger = screen.getByRole('button', { name: /Closure evidence/ });
        await userEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('independent sections keep their own state', async () => {
        render(
            <>
                <Section />
                <EdAccordionSection>
                    <EdAccordionSummary>Audit trail</EdAccordionSummary>
                    <EdAccordionDetails>audit body</EdAccordionDetails>
                </EdAccordionSection>
            </>,
        );
        await userEvent.click(screen.getByRole('button', { name: /Closure evidence/ }));
        expect(screen.getByRole('button', { name: /Closure evidence/ })).toHaveAttribute('aria-expanded', 'true');
        // The second section is unaffected.
        expect(screen.getByRole('button', { name: /Audit trail/ })).toHaveAttribute('aria-expanded', 'false');
    });
});
