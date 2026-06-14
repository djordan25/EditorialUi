import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdList, type EdListItem } from './EdList';

const items: EdListItem[] = [
    { id: 'mc', title: 'Marcus Chen', description: 'Validation · 14 open', group: 'recent' },
    { id: 'pr', title: 'Priya Rao', description: 'Validation · 8 open', group: 'recent' },
    { id: 'hl', title: 'Hanna Lindqvist', disabled: true, group: 'recent' },
];

describe('EdList', () => {
    it('renders a plain list (no listbox role) in static mode', () => {
        render(<EdList items={items} />);
        expect(screen.queryByRole('listbox')).toBeNull();
        expect(screen.getByText('Marcus Chen')).toBeInTheDocument();
    });

    it('renders a listbox with options in single mode', () => {
        render(<EdList selectionMode="single" ariaLabel="Owners" items={items} />);
        expect(screen.getByRole('listbox', { name: 'Owners' })).toBeInTheDocument();
        expect(screen.getAllByRole('option')).toHaveLength(3);
    });

    it('marks the selected option aria-selected', () => {
        render(<EdList selectionMode="single" ariaLabel="Owners" selectedId="pr" items={items} />);
        expect(screen.getByRole('option', { name: /Priya Rao/ })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('option', { name: /Marcus Chen/ })).toHaveAttribute('aria-selected', 'false');
    });

    it('fires onSelect when an option is clicked', async () => {
        const onSelect = vi.fn();
        render(<EdList selectionMode="single" ariaLabel="Owners" onSelect={onSelect} items={items} />);
        await userEvent.click(screen.getByRole('option', { name: /Marcus Chen/ }));
        expect(onSelect).toHaveBeenCalledWith('mc');
    });

    it('selects with Enter / Space when focused', async () => {
        const onSelect = vi.fn();
        render(<EdList selectionMode="single" ariaLabel="Owners" onSelect={onSelect} items={items} />);
        const opt = screen.getByRole('option', { name: /Priya Rao/ });
        opt.focus();
        await userEvent.keyboard('{Enter}');
        expect(onSelect).toHaveBeenCalledWith('pr');
    });

    it('does not select a disabled option', async () => {
        const onSelect = vi.fn();
        render(<EdList selectionMode="single" ariaLabel="Owners" onSelect={onSelect} items={items} />);
        await userEvent.click(screen.getByRole('option', { name: /Hanna Lindqvist/ }));
        expect(onSelect).not.toHaveBeenCalled();
    });

    it('folds title + description + meta into the accessible name', () => {
        render(
            <EdList
                selectionMode="single"
                ariaLabel="Owners"
                items={[{ id: 'mc', title: 'Marcus Chen', description: '14 open', meta: '2 overdue' }]}
            />,
        );
        expect(screen.getByRole('option', { name: 'Marcus Chen, 14 open, 2 overdue' })).toBeInTheDocument();
    });

    it('renders group labels', () => {
        render(<EdList selectionMode="single" ariaLabel="Owners" groupLabels={{ recent: 'Recent' }} items={items} />);
        expect(screen.getByText('Recent')).toBeInTheDocument();
    });

    it('renders the empty state', () => {
        render(<EdList items={[]} empty={<span>No matches</span>} />);
        expect(screen.getByText('No matches')).toBeInTheDocument();
    });

    it('renders skeleton rows when loading', () => {
        const { container } = render(<EdList items={[]} loading loadingRows={4} />);
        // 4 skeleton list items
        expect(container.querySelectorAll('li').length).toBe(4);
    });
});
