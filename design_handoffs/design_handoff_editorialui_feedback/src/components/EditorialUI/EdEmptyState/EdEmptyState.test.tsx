import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdEmptyState } from './EdEmptyState';

describe('EdEmptyState', () => {
    it('renders the title as a heading (h2 by default)', () => {
        render(<EdEmptyState title="No findings yet" />);
        const heading = screen.getByRole('heading', { name: 'No findings yet' });
        expect(heading.tagName).toBe('H2');
    });

    it('honors a custom heading level', () => {
        render(<EdEmptyState title="No comments" headingLevel="h3" />);
        expect(screen.getByRole('heading', { name: 'No comments' }).tagName).toBe('H3');
    });

    it('renders the body when provided', () => {
        render(<EdEmptyState title="X" body="Create the first finding." />);
        expect(screen.getByText('Create the first finding.')).toBeInTheDocument();
    });

    it('renders actions', () => {
        render(<EdEmptyState title="X" actions={<button>New finding</button>} />);
        expect(screen.getByRole('button', { name: 'New finding' })).toBeInTheDocument();
    });

    it('works with zero actions (no action container crash)', () => {
        render(<EdEmptyState title="Nothing assigned" body="Will appear here." />);
        expect(screen.getByRole('heading', { name: 'Nothing assigned' })).toBeInTheDocument();
    });

    it('marks the icon decorative (aria-hidden)', () => {
        const { container } = render(
            <EdEmptyState title="X" icon={<svg data-testid="icn" />} />,
        );
        const visual = container.querySelector('[aria-hidden="true"]');
        expect(visual).toBeInTheDocument();
        expect(visual?.querySelector('[data-testid="icn"]')).toBeInTheDocument();
    });

    it('omits the visual wrapper when no icon is given', () => {
        const { container } = render(<EdEmptyState title="X" />);
        expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
    });
});
