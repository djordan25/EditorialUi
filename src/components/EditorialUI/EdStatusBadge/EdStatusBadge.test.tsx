import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdStatusBadge } from './EdStatusBadge';

describe('EdStatusBadge', () => {
    it('renders the label', () => {
        render(<EdStatusBadge>OPEN</EdStatusBadge>);
        expect(screen.getByText('OPEN')).toBeInTheDocument();
    });

    it('renders as a <span> (non-interactive)', () => {
        const { container } = render(<EdStatusBadge>OPEN</EdStatusBadge>);
        expect(container.firstChild?.nodeName).toBe('SPAN');
    });

    it('does not have a button role', () => {
        render(<EdStatusBadge>OPEN</EdStatusBadge>);
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('honors ariaLabel for screen readers', () => {
        render(<EdStatusBadge ariaLabel="Status: Open">OPEN</EdStatusBadge>);
        expect(screen.getByLabelText('Status: Open')).toBeInTheDocument();
    });

    it('renders the dot when dot is true', () => {
        const { container } = render(<EdStatusBadge tone="warning" dot>OPEN</EdStatusBadge>);
        // Dot is a styled span; assert via aria-hidden attribute on the inner element.
        const dotEl = container.querySelector('[aria-hidden="true"]');
        expect(dotEl).toBeInTheDocument();
    });

    it('omits the dot when dot is false', () => {
        const { container } = render(<EdStatusBadge tone="warning">OPEN</EdStatusBadge>);
        expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
    });

    it('accepts arbitrary HTML attributes (e.g. data-testid, title)', () => {
        render(<EdStatusBadge data-testid="b" title="Open finding">OPEN</EdStatusBadge>);
        const badge = screen.getByTestId('b');
        expect(badge).toHaveAttribute('title', 'Open finding');
    });
});
