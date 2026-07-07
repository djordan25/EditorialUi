import { useMemo, useRef, type KeyboardEvent, type ReactNode } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type OnChangeFn,
    type Row,
    type RowData,
    type RowSelectionState,
    type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import styles from './EdDataGrid.module.scss';

export interface EdDataGridProps<T extends RowData> {
    /** Row data. `data.length === 0` while `isLoading` drives the first-paint skeleton. */
    data: T[];
    /** TanStack column definitions (accessorKey/accessorFn/cell/header/size/enableSorting…). */
    columns: ColumnDef<T, unknown>[];
    /** Stable row id — feeds selection keys, virtual-list keys, and `row.id`. */
    getRowId?: (row: T, index: number) => string;

    /* ---- Sorting (controlled) ---- */
    sorting?: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;

    /* ---- Selection (controlled) ---- */
    /** Prepend a checkbox column and enable row selection. */
    enableRowSelection?: boolean;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    /** Accessible label for each row checkbox. Default "Select row". */
    selectRowLabel?: string;
    /** Accessible label for the select-all header checkbox. Default "Select all rows". */
    selectAllLabel?: string;

    /* ---- Virtualization ---- */
    /** Estimated row height (drives the virtualizer + the fixed row height). Default 40. */
    estimateRowHeight?: number;
    /** Rows rendered beyond the viewport on each side. Default 8. */
    overscan?: number;

    /* ---- Interaction ---- */
    /** Row click — its presence makes rows focusable + keyboard-activatable (Enter/Space). */
    onRowClick?: (row: T) => void;
    /** Extra class(es) appended verbatim to the matching row `<tr>` / card `<li>`. */
    rowClassName?: (row: T) => string | undefined;

    /* ---- Responsive cards ---- */
    /** Card body renderer for narrow viewports (used only when `cardLayout` is true). */
    renderCard?: (row: T) => ReactNode;
    /** Render a `<ul>/<li>` card stack instead of a table. The breakpoint is caller-owned. */
    cardLayout?: boolean;

    /* ---- Presentation ---- */
    /** Sticky first column (e.g. a matrix row header). */
    pinFirstColumn?: boolean;

    /* ---- States ---- */
    /** Loading. Empty + loading → first-paint skeleton; populated + loading → a refetch bar. */
    isLoading?: boolean;
    /** Skeleton body rows on first paint. Default 8. */
    skeletonRows?: number;
    /** Rendered when there are zero rows. Falls back to "No rows.". */
    renderEmpty?: () => ReactNode;

    /** Accessible name for the grid region. Required. */
    ariaLabel: string;
    className?: string;
}

type AriaSort = 'ascending' | 'descending' | 'none';

/**
 * EdDataGrid — the TanStack-backed data grid for large, interactive tables:
 * consumer-authored `ColumnDef`s, virtualized rows (1000+), keyboard-activatable
 * rows, controlled sort + selection (updater-fn semantics), a responsive card
 * mode, and a first-paint-skeleton vs refetch-bar loading split.
 *
 * For the simpler bespoke-column primitive (client sort, pagination, no virtual
 * scroll) use EdDataTable; for static metadata grids use EdNativeTable.
 *
 *   <EdDataGrid
 *     ariaLabel="Model inventory"
 *     data={rows}
 *     columns={columns}
 *     getRowId={(r) => r.id}
 *     sorting={sorting}
 *     onSortingChange={setSorting}
 *     onRowClick={(r) => openDetail(r.id)}
 *   />
 */
export function EdDataGrid<T extends RowData>({
    data,
    columns,
    getRowId,
    sorting,
    onSortingChange,
    enableRowSelection = false,
    rowSelection,
    onRowSelectionChange,
    selectRowLabel = 'Select row',
    selectAllLabel = 'Select all rows',
    estimateRowHeight = 40,
    overscan = 8,
    onRowClick,
    rowClassName,
    renderCard,
    cardLayout = false,
    pinFirstColumn = false,
    isLoading = false,
    skeletonRows = 8,
    renderEmpty,
    ariaLabel,
    className,
}: EdDataGridProps<T>) {
    const clickable = Boolean(onRowClick);
    const activateRow = (e: KeyboardEvent, row: Row<T>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRowClick?.(row.original);
        }
    };

    // Prepend the selection checkbox column when selection is enabled; identity
    // passthrough otherwise so column identity is stable for consumers.
    const effectiveColumns = useMemo<ColumnDef<T, unknown>[]>(() => {
        if (!enableRowSelection) return columns;
        const selectionColumn: ColumnDef<T, unknown> = {
            id: '__select',
            size: 36,
            enableSorting: false,
            header: ({ table: t }) => (
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    aria-label={selectAllLabel}
                    checked={t.getIsAllRowsSelected()}
                    ref={(el) => {
                        if (el) el.indeterminate = !t.getIsAllRowsSelected() && t.getIsSomeRowsSelected();
                    }}
                    onChange={t.getToggleAllRowsSelectedHandler()}
                    onClick={(e) => e.stopPropagation()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    aria-label={selectRowLabel}
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    onClick={(e) => e.stopPropagation()}
                />
            ),
        };
        return [selectionColumn, ...columns];
    }, [columns, enableRowSelection, selectAllLabel, selectRowLabel]);

    const table = useReactTable({
        data,
        columns: effectiveColumns,
        // Both sort and selection are controlled only when the caller passes state;
        // otherwise TanStack manages them internally (uncontrolled works too).
        state: {
            ...(sorting !== undefined ? { sorting } : {}),
            ...(rowSelection !== undefined ? { rowSelection } : {}),
        },
        enableRowSelection,
        onSortingChange,
        onRowSelectionChange,
        getRowId,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const rows = table.getRowModel().rows;
    const isEmpty = rows.length === 0;

    const parentRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimateRowHeight,
        overscan,
    });
    const virtualRows = virtualizer.getVirtualItems();
    const totalHeight = virtualizer.getTotalSize();
    const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
    const paddingBottom =
        virtualRows.length > 0 ? totalHeight - virtualRows[virtualRows.length - 1].end : 0;

    const rootClass = [styles.root, pinFirstColumn && styles.pinFirst, className]
        .filter(Boolean)
        .join(' ');

    /* (1) First-paint skeleton — after all hooks so hook order stays stable. */
    if (isLoading && data.length === 0) {
        return (
            <div className={[styles.root, className].filter(Boolean).join(' ')} role="region" aria-label={ariaLabel}>
                <div
                    className={styles.skeletonWrap}
                    role="status"
                    aria-busy="true"
                    aria-label={`${ariaLabel} loading`}
                >
                    <div className={[styles.skeleton, styles.skeletonHeader].join(' ')} aria-hidden="true" />
                    {Array.from({ length: skeletonRows }).map((_, i) => (
                        <div
                            key={i}
                            className={[styles.skeleton, styles.skeletonRow].join(' ')}
                            aria-hidden="true"
                            style={{ width: `${88 - ((i * 13) % 40)}%` }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    /* (2) Responsive card mode. */
    if (cardLayout && renderCard) {
        return (
            <div ref={parentRef} className={rootClass} role="region" aria-label={ariaLabel}>
                {isLoading && <div className={styles.refetchBar} role="status" aria-label="Refreshing" />}
                {isEmpty ? (
                    <div className={styles.empty}>{renderEmpty ? renderEmpty() : 'No rows.'}</div>
                ) : (
                    <ul className={styles.cardList}>
                        {rows.map((row) => {
                            const extra = rowClassName?.(row.original);
                            return (
                                <li
                                    key={row.id}
                                    className={[styles.card, clickable && styles.clickable, extra]
                                        .filter(Boolean)
                                        .join(' ')}
                                    tabIndex={clickable ? 0 : -1}
                                    onClick={clickable ? () => onRowClick!(row.original) : undefined}
                                    onKeyDown={clickable ? (e) => activateRow(e, row) : undefined}
                                >
                                    {renderCard(row.original)}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    }

    /* (3) Default virtualized table. */
    return (
        <div ref={parentRef} className={rootClass} role="region" aria-label={ariaLabel}>
            {isLoading && <div className={styles.refetchBar} role="status" aria-label="Refreshing" />}
            <table className={styles.table} role="grid">
                <thead className={styles.thead}>
                    {table.getHeaderGroups().map((hg) => (
                        <tr key={hg.id}>
                            {hg.headers.map((header) => {
                                const canSort = header.column.getCanSort();
                                const sorted = header.column.getIsSorted();
                                const ariaSort: AriaSort =
                                    sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none';
                                return (
                                    <th
                                        key={header.id}
                                        scope="col"
                                        className={styles.th}
                                        style={{ width: header.getSize() }}
                                        aria-sort={canSort ? ariaSort : undefined}
                                    >
                                        {header.isPlaceholder ? null : canSort ? (
                                            <button
                                                type="button"
                                                className={styles.sortButton}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <span className={styles.sortIcon} aria-hidden>
                                                    {sorted === 'asc' ? (
                                                        <ChevronUp size={12} strokeWidth={2.5} />
                                                    ) : sorted === 'desc' ? (
                                                        <ChevronDown size={12} strokeWidth={2.5} />
                                                    ) : (
                                                        <ChevronsUpDown size={12} strokeWidth={2} />
                                                    )}
                                                </span>
                                            </button>
                                        ) : (
                                            <span className={styles.headerLabel}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </span>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {paddingTop > 0 && (
                        <tr aria-hidden="true" style={{ height: paddingTop }}>
                            <td colSpan={effectiveColumns.length} />
                        </tr>
                    )}
                    {virtualRows.map((vrow) => {
                        const row = rows[vrow.index];
                        const extra = rowClassName?.(row.original);
                        return (
                            <tr
                                key={row.id}
                                data-index={vrow.index}
                                aria-selected={enableRowSelection ? row.getIsSelected() : undefined}
                                className={[
                                    clickable && styles.clickable,
                                    row.getIsSelected() && styles.rowSelected,
                                    extra,
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                style={{ height: estimateRowHeight }}
                                tabIndex={clickable ? 0 : -1}
                                onClick={clickable ? () => onRowClick!(row.original) : undefined}
                                onKeyDown={clickable ? (e) => activateRow(e, row) : undefined}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className={styles.td}
                                        style={{ width: cell.column.getSize() }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                    {paddingBottom > 0 && (
                        <tr aria-hidden="true" style={{ height: paddingBottom }}>
                            <td colSpan={effectiveColumns.length} />
                        </tr>
                    )}
                </tbody>
            </table>
            {isEmpty && (
                <div className={styles.empty}>{renderEmpty ? renderEmpty() : 'No rows.'}</div>
            )}
        </div>
    );
}
