import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdDisclosure } from './EdDisclosure';

describe('EdDisclosure', () => {
    it('renders the trigger label', () => {
        render(<EdDisclosure label="Advanced metadata">content</EdDisclosure>);
        expect(screen.getByRole('button', { name: /Advanced metadata/ })).toBeInTheDocument();
    });

    it('is collapsed by default (content kept mounted but inert)', () => {
        render(<EdDisclosure label="X">secret content</EdDisclosure>);
        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
        // Content stays mounted so the collapse can animate, but is inert while closed
        // (out of tab + a11y order).
        expect(screen.getByText('secret content')).toHaveAttribute('inert');
    });

    it('defaultOpen renders the panel', () => {
        render(<EdDisclosure label="X" defaultOpen>shown content</EdDisclosure>);
        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('shown content')).toBeInTheDocument();
    });

    it('toggles open on click', async () => {
        render(<EdDisclosure label="X">toggle content</EdDisclosure>);
        const trigger = screen.getByRole('button');
        expect(screen.getByText('toggle content')).toHaveAttribute('inert');
        await userEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('toggle content')).not.toHaveAttribute('inert');
    });

    it('wires aria-controls to the panel id', async () => {
        render(<EdDisclosure label="X" defaultOpen>content</EdDisclosure>);
        const trigger = screen.getByRole('button');
        const controls = trigger.getAttribute('aria-controls');
        expect(controls).toBeTruthy();
        expect(document.getElementById(controls!)).toHaveTextContent('content');
    });

    it('fires onOpenChange with the next state', async () => {
        const onOpenChange = vi.fn();
        render(<EdDisclosure label="X" onOpenChange={onOpenChange}>content</EdDisclosure>);
        await userEvent.click(screen.getByRole('button'));
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('respects controlled open prop', async () => {
        const onOpenChange = vi.fn();
        const { rerender } = render(
            <EdDisclosure label="X" open={false} onOpenChange={onOpenChange}>content</EdDisclosure>,
        );
        expect(screen.getByText('content')).toHaveAttribute('inert');
        await userEvent.click(screen.getByRole('button'));
        // Controlled — stays closed (inert) until parent flips the prop.
        expect(onOpenChange).toHaveBeenCalledWith(true);
        expect(screen.getByText('content')).toHaveAttribute('inert');
        rerender(<EdDisclosure label="X" open onOpenChange={onOpenChange}>content</EdDisclosure>);
        expect(screen.getByText('content')).not.toHaveAttribute('inert');
    });
});
