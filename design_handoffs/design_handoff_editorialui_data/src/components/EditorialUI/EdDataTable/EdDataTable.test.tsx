import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdDataTable, type EdColumn, type EdSortState } from './EdDataTable';

interface Row { id: string; name: string; n: number; }
const rows: Row[] = [
    { id: 'a', name: 'Charlie', n: 3 },
    { id: 'b', name: 'Alice', n: 1 },
    { id: 'c', name: 'Bob', n: 2 },
];
const columns: EdColumn<Row>[] = [
    { id: 'name', header: 'Name', cell: (r) => r.name, sortable: true, sortAccessor: (r) => r.name },
    { id: 'n', header: 'Count', cell: (r) => r.n, mono: true, align: 'right', sortable: true, sortAccessor: (r) => r.n },
];

const base = { columns, rows, getRowId: (r: Row) => r.id };

describe('EdDataTable', () => {
    it('renders a semantic table with headers', () => {
        render(<EdDataTable<Row> {...base} caption="People" />);
        expect(screen.getByRole('table', { name: 'People' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    });

    it('renders all rows', () => {
        render(<EdDataTable<Row> {...base} />);
        // header row + 3 body rows
        expect(screen.getAllByRole('row')).toHaveLength(4);
    });

    it('sortable header has aria-sort and cycles none→asc→desc→none', async () => {
        render(<EdDataTable<Row> {...base} />);
        const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
        expect(nameHeader).toHaveAttribute('aria-sort', 'none');
        await userEvent.click(within(nameHeader).getByRole('button'));
        expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
        await userEvent.click(within(nameHeader).getByRole('button'));
        expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
        await userEvent.click(within(nameHeader).getByRole('button'));
        expect(nameHeader).toHaveAttribute('aria-sort', 'none');
    });

    it('client-sorts rows by the accessor when uncontrolled', async () => {
        render(<EdDataTable<Row> {...base} />);
        await userEvent.click(within(screen.getByRole('columnheader', { name: /Name/ })).getByRole('button'));
        const bodyRows = screen.getAllByRole('row').slice(1);
        const firstCell = within(bodyRows[0]).getAllByRole('cell')[0];
        expect(firstCell).toHaveTextContent('Alice');
    });

    it('fires onSortChange in controlled mode', async () => {
        const onSortChange = vi.fn();
        const sort: EdSortState = { columnId: 'name', dir: 'asc' };
        render(<EdDataTable<Row> {...base} sort={sort} onSortChange={onSortChange} />);
        await userEvent.click(within(screen.getByRole('columnheader', { name: /Name/ })).getByRole('button'));
        expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', dir: 'desc' });
    });

    it('renders selection checkboxes and a select-all header checkbox', () => {
        render(<EdDataTable<Row> {...base} selectable />);
        expect(screen.getByLabelText('Select all rows on this page')).toBeInTheDocument();
        expect(screen.getByLabelText('Select row a')).toBeInTheDocument();
    });

    it('toggles a single row selection', async () => {
        const onSelectedChange = vi.fn();
        render(<EdDataTable<Row> {...base} selectable selectedIds={[]} onSelectedChange={onSelectedChange} />);
        await userEvent.click(screen.getByLabelText('Select row b'));
        expect(onSelectedChange).toHaveBeenCalledWith(['b']);
    });

    it('select-all selects every row on the page', async () => {
        const onSelectedChange = vi.fn();
        render(<EdDataTable<Row> {...base} selectable selectedIds={[]} onSelectedChange={onSelectedChange} />);
        await userEvent.click(screen.getByLabelText('Select all rows on this page'));
        expect(onSelectedChange).toHaveBeenCalledWith(['a', 'b', 'c']);
    });

    it('shows the toolbar with bulk actions when rows are selected', () => {
        render(
            <EdDataTable<Row>
                {...base}
                selectable
                selectedIds={['a', 'b']}
                bulkActions={(ids) => <button>Reassign {ids.length}</button>}
            />,
        );
        expect(screen.getByRole('status')).toHaveTextContent('2 of 3 selected');
        expect(screen.getByRole('button', { name: 'Reassign 2' })).toBeInTheDocument();
    });

    it('marks selected rows aria-selected', () => {
        render(<EdDataTable<Row> {...base} selectable selectedIds={['a']} />);
        const rowA = screen.getByLabelText('Select row a').closest('tr')!;
        expect(rowA).toHaveAttribute('aria-selected', 'true');
    });

    it('fires onRowClick but not when the checkbox cell is clicked', async () => {
        const onRowClick = vi.fn();
        const onSelectedChange = vi.fn();
        render(
            <EdDataTable<Row>
                {...base}
                selectable
                selectedIds={[]}
                onSelectedChange={onSelectedChange}
                onRowClick={onRowClick}
            />,
        );
        await userEvent.click(screen.getByText('Alice'));
        expect(onRowClick).toHaveBeenCalledWith(rows[1]);
        onRowClick.mockClear();
        await userEvent.click(screen.getByLabelText('Select row a'));
        expect(onRowClick).not.toHaveBeenCalled();
    });

    it('renders the empty state when there are no rows', () => {
        render(<EdDataTable<Row> {...base} rows={[]} empty={<span>Nothing here</span>} />);
        expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    it('renders the error state', () => {
        render(<EdDataTable<Row> {...base} rows={[]} error={<span>Load failed</span>} />);
        expect(screen.getByText('Load failed')).toBeInTheDocument();
    });

    it('renders a paginator and disables prev on page 1', () => {
        render(<EdDataTable<Row> {...base} page={1} pageCount={5} totalCount={50} />);
        expect(screen.getByLabelText('Previous page')).toBeDisabled();
        expect(screen.getByLabelText('Next page')).toBeEnabled();
    });

    it('fires onPageChange when next is clicked', async () => {
        const onPageChange = vi.fn();
        render(<EdDataTable<Row> {...base} page={2} pageCount={5} onPageChange={onPageChange} />);
        await userEvent.click(screen.getByLabelText('Next page'));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });
});
