import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdFilterChipRow, type EdFilterChip } from './EdFilterChipRow';

const chips: EdFilterChip[] = [
    { value: 'all', label: 'All', count: 312 },
    { value: 'open', label: 'Open', count: 87 },
    { value: 'closed', label: 'Closed', count: 211 },
];

describe('EdFilterChipRow', () => {
    it('multi mode renders a group of checkbox chips', () => {
        render(<EdFilterChipRow ariaLabel="Filters" selected={[]} onSelectedChange={() => {}} chips={chips} />);
        expect(screen.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
        expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    });

    it('single mode renders a radiogroup', () => {
        render(<EdFilterChipRow ariaLabel="Scope" mode="single" selected={['all']} onSelectedChange={() => {}} chips={chips} />);
        expect(screen.getByRole('radiogroup', { name: 'Scope' })).toBeInTheDocument();
        expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('folds the count into the accessible name', () => {
        render(<EdFilterChipRow ariaLabel="Filters" selected={[]} onSelectedChange={() => {}} chips={chips} />);
        expect(screen.getByRole('checkbox', { name: 'Open, 87 items' })).toBeInTheDocument();
    });

    it('reflects selected via aria-checked', () => {
        render(<EdFilterChipRow ariaLabel="Filters" selected={['open']} onSelectedChange={() => {}} chips={chips} />);
        expect(screen.getByRole('checkbox', { name: 'Open, 87 items' })).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('checkbox', { name: 'All, 312 items' })).toHaveAttribute('aria-checked', 'false');
    });

    it('multi: toggling adds and removes from the selection', async () => {
        const onSelectedChange = vi.fn();
        const { rerender } = render(
            <EdFilterChipRow ariaLabel="Filters" selected={[]} onSelectedChange={onSelectedChange} chips={chips} />,
        );
        await userEvent.click(screen.getByRole('checkbox', { name: 'Open, 87 items' }));
        expect(onSelectedChange).toHaveBeenCalledWith(['open']);

        rerender(<EdFilterChipRow ariaLabel="Filters" selected={['open']} onSelectedChange={onSelectedChange} chips={chips} />);
        await userEvent.click(screen.getByRole('checkbox', { name: 'Open, 87 items' }));
        expect(onSelectedChange).toHaveBeenCalledWith([]);
    });

    it('single: selecting replaces the selection', async () => {
        const onSelectedChange = vi.fn();
        render(<EdFilterChipRow ariaLabel="Scope" mode="single" selected={['all']} onSelectedChange={onSelectedChange} chips={chips} />);
        await userEvent.click(screen.getByRole('radio', { name: 'Open, 87 items' }));
        expect(onSelectedChange).toHaveBeenCalledWith(['open']);
    });

    it('does not toggle a disabled chip', async () => {
        const onSelectedChange = vi.fn();
        render(
            <EdFilterChipRow
                ariaLabel="Filters"
                selected={[]}
                onSelectedChange={onSelectedChange}
                chips={[{ value: 'x', label: 'Archived', disabled: true }]}
            />,
        );
        await userEvent.click(screen.getByRole('checkbox', { name: 'Archived' }));
        expect(onSelectedChange).not.toHaveBeenCalled();
    });

    it('renders grouped chips with a divider', () => {
        render(
            <EdFilterChipRow
                ariaLabel="Filters"
                selected={[]}
                onSelectedChange={() => {}}
                groups={[
                    { chips: [{ value: 'all', label: 'All' }] },
                    { divider: true, chips: [{ value: 'high', label: 'High severity' }] },
                ]}
            />,
        );
        expect(screen.getByRole('checkbox', { name: 'All' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'High severity' })).toBeInTheDocument();
    });

    it('renders an overflow control', () => {
        render(
            <EdFilterChipRow
                ariaLabel="Filters"
                selected={[]}
                onSelectedChange={() => {}}
                chips={chips}
                overflow={<button>+ 4 more</button>}
            />,
        );
        expect(screen.getByRole('button', { name: '+ 4 more' })).toBeInTheDocument();
    });
});
