import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdChip } from './EdChip';

describe('EdChip', () => {
    it('renders a checkbox-role button by default', () => {
        render(<EdChip>Open</EdChip>);
        expect(screen.getByRole('checkbox', { name: 'Open' })).toBeInTheDocument();
    });

    it('reflects selected via aria-checked', () => {
        const { rerender } = render(<EdChip selected={false}>Open</EdChip>);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
        rerender(<EdChip selected={true}>Open</EdChip>);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    });

    it('fires onSelectedChange when toggled', async () => {
        const onSelectedChange = vi.fn();
        render(<EdChip selected={false} onSelectedChange={onSelectedChange}>Open</EdChip>);
        await userEvent.click(screen.getByRole('checkbox'));
        expect(onSelectedChange).toHaveBeenCalledWith(true);
    });

    it('uses role=radio when kind="radio"', () => {
        render(<EdChip kind="radio" selected>7d</EdChip>);
        expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'true');
    });

    it('does not toggle when disabled', async () => {
        const onSelectedChange = vi.fn();
        render(<EdChip selected={false} disabled onSelectedChange={onSelectedChange}>Open</EdChip>);
        await userEvent.click(screen.getByRole('checkbox'));
        expect(onSelectedChange).not.toHaveBeenCalled();
    });

    it('includes count in the accessible name', () => {
        render(<EdChip count={87}>Open</EdChip>);
        expect(screen.getByRole('checkbox', { name: 'Open, 87 items' })).toBeInTheDocument();
    });

    it('input variant has no checkbox role', () => {
        render(<EdChip kind="input">PRA SS3/21</EdChip>);
        expect(screen.queryByRole('checkbox')).toBeNull();
    });

    it('input variant renders a remove button with default aria-label', () => {
        const onRemove = vi.fn();
        render(<EdChip kind="input" onRemove={onRemove}>PRA SS3/21</EdChip>);
        expect(screen.getByRole('button', { name: 'Remove PRA SS3/21' })).toBeInTheDocument();
    });

    it('Backspace fires onRemove for input variant', async () => {
        const onRemove = vi.fn();
        render(<EdChip kind="input" onRemove={onRemove}>PRA SS3/21</EdChip>);
        const chip = screen.getByText('PRA SS3/21').closest('button')!;
        chip.focus();
        await userEvent.keyboard('{Backspace}');
        expect(onRemove).toHaveBeenCalled();
    });

    it('renders the leading dot when leadingDot is provided', () => {
        const { container } = render(<EdChip leadingDot="red">In review</EdChip>);
        const dot = container.querySelector('[aria-hidden="true"]');
        expect(dot).toBeInTheDocument();
    });
});
