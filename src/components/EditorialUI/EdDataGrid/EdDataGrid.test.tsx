import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';
import { EdDataGrid } from './EdDataGrid';

// @tanstack/react-virtual measures the scroll element via offsetWidth/offsetHeight
// (virtual-core getRect), which jsdom reports as 0 — so no rows would virtualize in.
// Give elements a real viewport for the duration of this file so the grid windows in.
const restore: Array<() => void> = [];
beforeAll(() => {
    for (const [prop, value] of [
        ['offsetHeight', 600],
        ['offsetWidth', 800],
    ] as const) {
        const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop);
        Object.defineProperty(HTMLElement.prototype, prop, { configurable: true, get: () => value });
        if (original) restore.push(() => Object.defineProperty(HTMLElement.prototype, prop, original));
    }
});
afterAll(() => restore.forEach((fn) => fn()));

interface Row {
    id: string;
    name: string;
    n: number;
}
const data: Row[] = [
    { id: 'a', name: 'Alice', n: 1 },
    { id: 'b', name: 'Bob', n: 2 },
];
const columns: ColumnDef<Row, unknown>[] = [
    { accessorKey: 'name', header: 'Name', size: 200 },
    { accessorKey: 'n', header: 'Count', enableSorting: false, size: 80 },
];
const base = { ariaLabel: 'People', data, columns, getRowId: (r: Row) => r.id };

describe('EdDataGrid', () => {
    it('renders a grid region with headers and all rows', () => {
        render(<EdDataGrid {...base} />);
        expect(screen.getByRole('region', { name: 'People' })).toBeInTheDocument();
        expect(screen.getByRole('grid')).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('makes rows focusable and fires onRowClick on Enter, Space, and click', async () => {
        const onRowClick = vi.fn();
        render(<EdDataGrid {...base} onRowClick={onRowClick} />);
        const rowA = screen.getByText('Alice').closest('tr')!;
        expect(rowA).toHaveAttribute('tabindex', '0');
        rowA.focus();
        await userEvent.keyboard('{Enter}');
        expect(onRowClick).toHaveBeenCalledWith(data[0]);

        onRowClick.mockClear();
        screen.getByText('Bob').closest('tr')!.focus();
        await userEvent.keyboard(' ');
        expect(onRowClick).toHaveBeenCalledWith(data[1]);

        onRowClick.mockClear();
        await userEvent.click(screen.getByText('Alice'));
        expect(onRowClick).toHaveBeenCalledWith(data[0]);
    });

    it('rows are not focusable without onRowClick', () => {
        render(<EdDataGrid {...base} />);
        expect(screen.getByText('Alice').closest('tr')!).toHaveAttribute('tabindex', '-1');
    });

    it('exposes aria-sort on sortable columns and omits it on non-sortable', () => {
        render(<EdDataGrid {...base} />);
        expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'none');
        expect(screen.getByRole('columnheader', { name: 'Count' })).not.toHaveAttribute('aria-sort');
    });

    it('reflects controlled sort direction in aria-sort', () => {
        const { rerender } = render(
            <EdDataGrid {...base} sorting={[{ id: 'name', desc: false }]} onSortingChange={() => {}} />,
        );
        expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending');
        rerender(<EdDataGrid {...base} sorting={[{ id: 'name', desc: true }]} onSortingChange={() => {}} />);
        expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'descending');
    });

    it('fires onSortingChange when a sortable header is clicked', async () => {
        const onSortingChange = vi.fn();
        render(<EdDataGrid {...base} sorting={[]} onSortingChange={onSortingChange} />);
        await userEvent.click(within(screen.getByRole('columnheader', { name: 'Name' })).getByRole('button'));
        expect(onSortingChange).toHaveBeenCalled();
    });

    it('renders a select-all + per-row checkboxes and reports selection', async () => {
        const onRowSelectionChange = vi.fn();
        render(
            <EdDataGrid {...base} enableRowSelection rowSelection={{}} onRowSelectionChange={onRowSelectionChange} />,
        );
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(3); // header + 2 rows
        await userEvent.click(checkboxes[1]);
        expect(onRowSelectionChange).toHaveBeenCalled();
    });

    it('select-all emits a TanStack updater that selects every row', async () => {
        const onRowSelectionChange = vi.fn();
        render(
            <EdDataGrid
                {...base}
                enableRowSelection
                rowSelection={{}}
                onRowSelectionChange={onRowSelectionChange}
                selectAllLabel="Select all"
            />,
        );
        await userEvent.click(screen.getByLabelText('Select all'));
        const updater = onRowSelectionChange.mock.calls[0][0];
        const next = typeof updater === 'function' ? updater({}) : updater;
        expect(next).toEqual({ a: true, b: true });
    });

    it('does not fire onRowClick when a selection checkbox is clicked', async () => {
        const onRowClick = vi.fn();
        render(
            <EdDataGrid
                {...base}
                onRowClick={onRowClick}
                enableRowSelection
                rowSelection={{}}
                onRowSelectionChange={() => {}}
                selectAllLabel="Select all"
            />,
        );
        await userEvent.click(screen.getByLabelText('Select all'));
        expect(onRowClick).not.toHaveBeenCalled();
    });

    it('applies rowClassName to the matching row only', () => {
        render(<EdDataGrid {...base} rowClassName={(r) => (r.id === 'a' ? 'flagged' : undefined)} />);
        expect(screen.getByText('Alice').closest('tr')!).toHaveClass('flagged');
        expect(screen.getByText('Bob').closest('tr')!).not.toHaveClass('flagged');
    });

    it('renders the empty state via renderEmpty', () => {
        render(<EdDataGrid {...base} data={[]} renderEmpty={() => <span>Nothing here</span>} />);
        expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    describe('card mode', () => {
        const cardProps = {
            ...base,
            cardLayout: true,
            renderCard: (r: Row) => <div>Card {r.name}</div>,
        };

        it('renders a card list with no table rows', () => {
            render(<EdDataGrid {...cardProps} />);
            expect(screen.queryByRole('row')).toBeNull();
            const cards = screen.getAllByRole('listitem');
            expect(cards).toHaveLength(2);
            expect(screen.getByText('Card Alice')).toBeInTheDocument();
            expect(screen.getByText('Card Bob')).toBeInTheDocument();
        });

        it('keeps cards keyboard-activatable', async () => {
            const onRowClick = vi.fn();
            render(<EdDataGrid {...cardProps} onRowClick={onRowClick} />);
            const cards = screen.getAllByRole('listitem');
            expect(cards[0]).toHaveAttribute('tabindex', '0');
            cards[1].focus();
            await userEvent.keyboard('{Enter}');
            expect(onRowClick).toHaveBeenCalledWith(data[1]);
        });

        it('applies rowClassName to the matching card', () => {
            render(<EdDataGrid {...cardProps} rowClassName={(r) => (r.id === 'b' ? 'flagged' : undefined)} />);
            const cards = screen.getAllByRole('listitem');
            expect(cards[1]).toHaveClass('flagged');
            expect(cards[0]).not.toHaveClass('flagged');
        });
    });

    describe('loading', () => {
        it('shows a first-paint skeleton (no grid) when loading with no data', () => {
            render(<EdDataGrid {...base} data={[]} isLoading />);
            const status = screen.getByRole('status');
            expect(status).toHaveAttribute('aria-busy', 'true');
            expect(status).toHaveAccessibleName('People loading');
            expect(screen.queryByRole('grid')).toBeNull();
        });

        it('renders exactly skeletonRows + 1 skeleton blocks', () => {
            const { container } = render(<EdDataGrid {...base} data={[]} isLoading skeletonRows={3} />);
            expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(4);
        });

        it('shows a refetch bar over the grid when loading with data', () => {
            render(<EdDataGrid {...base} isLoading />);
            expect(screen.getByRole('grid')).toBeInTheDocument();
            expect(screen.getByRole('status')).toHaveAccessibleName('Refreshing');
        });

        it('shows no status region when not loading', () => {
            render(<EdDataGrid {...base} />);
            expect(screen.getByRole('grid')).toBeInTheDocument();
            expect(screen.queryByRole('status')).toBeNull();
        });
    });
});
