import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdKeyValueTable, EdNativeTable } from './EdNativeTable';

describe('EdKeyValueTable', () => {
    it('renders label cells as row headers (th scope=row)', () => {
        render(<EdKeyValueTable rows={[{ label: 'ID', value: 'F-2438', mono: true }]} />);
        const th = screen.getByRole('rowheader', { name: 'ID' });
        expect(th.tagName).toBe('TH');
        expect(th).toHaveAttribute('scope', 'row');
    });

    it('renders values', () => {
        render(<EdKeyValueTable rows={[{ label: 'Owner', value: 'Marcus Chen' }]} />);
        expect(screen.getByText('Marcus Chen')).toBeInTheDocument();
    });

    it('renders a visually-hidden caption when provided', () => {
        render(<EdKeyValueTable caption="Finding metadata" rows={[{ label: 'ID', value: 'F-2438' }]} />);
        expect(screen.getByText('Finding metadata')).toBeInTheDocument();
    });

    it('renders composed values (badges)', () => {
        render(<EdKeyValueTable rows={[{ label: 'Severity', value: <span data-testid="badge">MEDIUM</span> }]} />);
        expect(screen.getByTestId('badge')).toBeInTheDocument();
    });
});

describe('EdNativeTable', () => {
    const columns = [
        { header: 'Validator', key: 'name' },
        { header: 'Findings', key: 'open', mono: true, align: 'right' as const },
    ];
    const rows = [
        { name: 'Marcus Chen', open: 14 },
        { name: 'Priya Rao', open: 8 },
    ];

    it('renders column headers as th scope=col', () => {
        render(<EdNativeTable columns={columns} rows={rows} />);
        const th = screen.getByRole('columnheader', { name: 'Validator' });
        expect(th).toHaveAttribute('scope', 'col');
    });

    it('renders all data rows', () => {
        render(<EdNativeTable columns={columns} rows={rows} />);
        // header row + 2 body rows
        expect(screen.getAllByRole('row')).toHaveLength(3);
        expect(screen.getByText('Marcus Chen')).toBeInTheDocument();
        expect(screen.getByText('Priya Rao')).toBeInTheDocument();
    });

    it('uses a custom cell renderer when provided', () => {
        render(
            <EdNativeTable
                columns={[
                    { header: 'Name', key: 'name' },
                    { header: 'Overdue', key: 'overdue', render: (v) => <span data-testid="ov">{`${v} overdue`}</span> },
                ]}
                rows={[{ name: 'X', overdue: 2 }]}
            />,
        );
        expect(screen.getByTestId('ov')).toHaveTextContent('2 overdue');
    });

    it('renders a caption for screen readers', () => {
        render(<EdNativeTable caption="Validator workload" columns={columns} rows={rows} />);
        const table = screen.getByRole('table', { name: 'Validator workload' });
        expect(table).toBeInTheDocument();
    });
});
