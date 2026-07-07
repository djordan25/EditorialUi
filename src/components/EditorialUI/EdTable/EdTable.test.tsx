import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
    EdTable,
    EdTableBody,
    EdTableCell,
    EdTableContainer,
    EdTableHead,
    EdTableRow,
} from './EdTable';

describe('EdTable', () => {
    it('renders a table with head and body', () => {
        render(
            <EdTable>
                <EdTableHead>
                    <EdTableRow>
                        <EdTableCell>Name</EdTableCell>
                    </EdTableRow>
                </EdTableHead>
                <EdTableBody>
                    <EdTableRow>
                        <EdTableCell>Alice</EdTableCell>
                    </EdTableRow>
                </EdTableBody>
            </EdTable>,
        );
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'Alice' })).toBeInTheDocument();
    });

    it('auto-renders <th> in the head and <td> in the body', () => {
        render(
            <EdTable>
                <EdTableHead>
                    <EdTableRow>
                        <EdTableCell>H</EdTableCell>
                    </EdTableRow>
                </EdTableHead>
                <EdTableBody>
                    <EdTableRow>
                        <EdTableCell>B</EdTableCell>
                    </EdTableRow>
                </EdTableBody>
            </EdTable>,
        );
        expect(screen.getByText('H').tagName).toBe('TH');
        expect(screen.getByText('B').tagName).toBe('TD');
    });

    it('supports a component override (row header <th scope="row"> in the body)', () => {
        render(
            <EdTable>
                <EdTableBody>
                    <EdTableRow>
                        <EdTableCell component="th" scope="row">
                            ID
                        </EdTableCell>
                        <EdTableCell>F-2438</EdTableCell>
                    </EdTableRow>
                </EdTableBody>
            </EdTable>,
        );
        const rowHeader = screen.getByText('ID');
        expect(rowHeader.tagName).toBe('TH');
        expect(rowHeader).toHaveAttribute('scope', 'row');
    });

    it('passes through colSpan on a cell', () => {
        render(
            <EdTable>
                <EdTableBody>
                    <EdTableRow>
                        <EdTableCell colSpan={3}>Spanning</EdTableCell>
                    </EdTableRow>
                </EdTableBody>
            </EdTable>,
        );
        expect(screen.getByText('Spanning')).toHaveAttribute('colspan', '3');
    });

    it('is transparent to ARIA-grid + keyboard props (role, tabIndex, onKeyDown)', async () => {
        const onKeyDown = vi.fn();
        render(
            <EdTable role="grid">
                <EdTableBody>
                    <EdTableRow role="row">
                        <EdTableCell role="gridcell" tabIndex={0} onKeyDown={onKeyDown}>
                            cell
                        </EdTableCell>
                    </EdTableRow>
                </EdTableBody>
            </EdTable>,
        );
        expect(screen.getByRole('grid')).toBeInTheDocument();
        const cell = screen.getByRole('gridcell');
        expect(cell).toHaveAttribute('tabindex', '0');
        cell.focus();
        await userEvent.keyboard('{ArrowRight}');
        expect(onKeyDown).toHaveBeenCalled();
    });

    it('exposes drag-selection mouse handlers on the head', async () => {
        const onMouseDown = vi.fn();
        render(
            <EdTable>
                <EdTableHead onMouseDown={onMouseDown} data-testid="head">
                    <EdTableRow>
                        <EdTableCell>H</EdTableCell>
                    </EdTableRow>
                </EdTableHead>
            </EdTable>,
        );
        await userEvent.pointer({ target: screen.getByTestId('head'), keys: '[MouseLeft>]' });
        expect(onMouseDown).toHaveBeenCalled();
    });

    it('applies the stickyHeader class', () => {
        render(
            <EdTable stickyHeader data-testid="t">
                <EdTableBody>
                    <EdTableRow>
                        <EdTableCell>x</EdTableCell>
                    </EdTableRow>
                </EdTableBody>
            </EdTable>,
        );
        expect(screen.getByTestId('t')).toHaveClass('stickyHeader');
    });

    it('applies the compact density class', () => {
        render(
            <EdTable density="compact" data-testid="t">
                <EdTableBody>
                    <EdTableRow>
                        <EdTableCell>x</EdTableCell>
                    </EdTableRow>
                </EdTableBody>
            </EdTable>,
        );
        expect(screen.getByTestId('t')).toHaveClass('compact');
    });

    it('aligns cells and forwards row onClick + table aria', async () => {
        const onClick = vi.fn();
        render(
            <EdTable aria-label="Metrics" aria-rowcount={10}>
                <EdTableBody>
                    <EdTableRow onClick={onClick}>
                        <EdTableCell align="right">42</EdTableCell>
                    </EdTableRow>
                </EdTableBody>
            </EdTable>,
        );
        expect(screen.getByRole('table', { name: 'Metrics' })).toHaveAttribute('aria-rowcount', '10');
        expect(screen.getByText('42')).toHaveClass('alignRight');
        await userEvent.click(screen.getByText('42'));
        expect(onClick).toHaveBeenCalled();
    });

    it('EdTableContainer renders an overflow wrapper', () => {
        render(
            <EdTableContainer data-testid="c">
                <EdTable>
                    <EdTableBody>
                        <EdTableRow>
                            <EdTableCell>x</EdTableCell>
                        </EdTableRow>
                    </EdTableBody>
                </EdTable>
            </EdTableContainer>,
        );
        const container = screen.getByTestId('c');
        expect(container.tagName).toBe('DIV');
        expect(container).toHaveClass('container');
        expect(container.querySelector('table')).not.toBeNull();
    });
});
