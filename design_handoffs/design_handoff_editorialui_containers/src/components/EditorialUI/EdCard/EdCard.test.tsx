import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdCard, EdCardHeader, EdCardBody, EdCardFooter } from './EdCard';

describe('EdCard', () => {
    it('renders children', () => {
        render(<EdCard><EdCardBody>content</EdCardBody></EdCard>);
        expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('renders as a div by default', () => {
        const { container } = render(<EdCard>x</EdCard>);
        expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('asChild renders the child element (button) and forwards classes', () => {
        render(
            <EdCard asChild interactive>
                <button>pick</button>
            </EdCard>,
        );
        expect(screen.getByRole('button', { name: 'pick' })).toBeInTheDocument();
    });

    it('interactive asChild button fires onClick', async () => {
        const onClick = vi.fn();
        render(
            <EdCard asChild interactive>
                <button onClick={onClick}>pick</button>
            </EdCard>,
        );
        await userEvent.click(screen.getByRole('button', { name: 'pick' }));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('selected sets data-selected attribute', () => {
        const { container } = render(<EdCard selected>x</EdCard>);
        expect(container.firstChild).toHaveAttribute('data-selected', 'true');
    });

    it('EdCardHeader renders eyebrow + title at the right heading level', () => {
        render(<EdCardHeader eyebrow="FINDING" title="Stale docs" headingLevel="h3" />);
        expect(screen.getByText('FINDING')).toBeInTheDocument();
        const heading = screen.getByRole('heading', { name: 'Stale docs' });
        expect(heading.tagName).toBe('H3');
    });

    it('EdCardHeader renders an adornment', () => {
        render(<EdCardHeader title="X" adornment={<span data-testid="badge">OPEN</span>} />);
        expect(screen.getByTestId('badge')).toBeInTheDocument();
    });

    it('EdCardFooter renders content', () => {
        render(<EdCardFooter>updated 11:42</EdCardFooter>);
        expect(screen.getByText('updated 11:42')).toBeInTheDocument();
    });
});
