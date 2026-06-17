import {
    forwardRef,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import styles from './EdDataTable.module.scss';

export type EdSortDir = 'asc' | 'desc';
export type EdTableDensity = 'default' | 'compact';

export interface EdColumn<Row> {
    /** Stable column id. */
    id: string;
    /** Header label. */
    header: ReactNode;
    /** Cell renderer. Receives the row record. */
    cell: (row: Row) => ReactNode;
    /** Enable sorting on this column. */
    sortable?: boolean;
    /** Render cells in mono. */
    mono?: boolean;
    /** Right-align (numbers, dates). */
    align?: 'left' | 'right';
    /** Fixed column width (CSS value). */
    width?: string;
    /** Accessor for client-side sorting. Defaults to no client sort (server mode). */
    sortAccessor?: (row: Row) => string | number;
}

export interface EdSortState {
    columnId: string;
    dir: EdSortDir;
}

export interface EdDataTableProps<Row> {
    columns: EdColumn<Row>[];
    rows: Row[];
    /** Unique row id accessor — drives selection + keys. */
    getRowId: (row: Row) => string;

    density?: EdTableDensity;
    zebra?: boolean;

    /* ---- Sorting ---- */
    /** Controlled sort. Omit for uncontrolled client-side sort. */
    sort?: EdSortState | null;
    onSortChange?: (sort: EdSortState | null) => void;

    /* ---- Selection ---- */
    /** Enable the leading checkbox column. */
    selectable?: boolean;
    /** Controlled selected row ids. */
    selectedIds?: string[];
    onSelectedChange?: (ids: string[]) => void;

    /* ---- Row interaction ---- */
    /** Row click — opens detail (drawer / route). Checkbox clicks never trigger this. */
    onRowClick?: (row: Row) => void;
    /** Mark a row as superseded — dimmed, audit-trail convention. */
    isSuperseded?: (row: Row) => boolean;
    /** Trailing per-row actions cell (e.g. an EdMenu overflow button). */
    rowActions?: (row: Row) => ReactNode;

    /* ---- Toolbar (shown when selection is non-empty) ---- */
    /** Bulk action nodes rendered in the toolbar. */
    bulkActions?: (selectedIds: string[]) => ReactNode;
    /** Right-aligned toolbar controls (column settings, etc). */
    toolbarEnd?: ReactNode;

    /* ---- Footer / pagination ----
       Pagination is CONTROLLED: EdDataTable renders exactly the `rows` you pass and
       emits onPageChange — it does NOT slice rows itself. Supply each page's rows
       (slice client-side, or fetch from a server) when `page` changes. Pass `page` +
       `pageCount` to show the footer; omit them for a single, unpaginated table. */
    /** Total row count across all pages (server-paginated). Defaults to rows.length. */
    totalCount?: number;
    /** 1-based current page. The parent owns the data for this page (see above). */
    page?: number;
    /** Total number of pages. The footer renders `page / pageCount`. */
    pageCount?: number;
    /** Fired with the next page number when the user clicks prev/next. */
    onPageChange?: (page: number) => void;

    /* ---- States ---- */
    loading?: boolean;
    error?: ReactNode;
    /** Node shown when there are zero rows (not loading, no error). */
    empty?: ReactNode;

    /** Accessible name for the table. */
    caption?: ReactNode;
    className?: string;
}

const HEADER_LABEL = 'Select all rows on this page';

/**
 * EdDataTable — the going-forward primitive for inventory pages, picker dialogs,
 * audit logs. Sortable, selectable, paginated, dense-by-default. For >100 rows
 * wrap with TanStack Virtual at the call site (keep the <tbody> semantics intact);
 * for static metadata grids use EdNativeTable.
 *
 *   <EdDataTable
 *     columns={cols}
 *     rows={findings}
 *     getRowId={(r) => r.id}
 *     selectable
 *     selectedIds={sel}
 *     onSelectedChange={setSel}
 *     bulkActions={(ids) => <EdButton size="sm">Reassign {ids.length}</EdButton>}
 *     onRowClick={(r) => openDrawer(r.id)}
 *   />
 */
export function EdDataTableInner<Row>(
    props: EdDataTableProps<Row>,
    ref: React.ForwardedRef<HTMLDivElement>,
) {
    const {
        columns,
        rows,
        getRowId,
        density = 'default',
        zebra = false,
        sort,
        onSortChange,
        selectable = false,
        selectedIds,
        onSelectedChange,
        onRowClick,
        isSuperseded,
        rowActions,
        bulkActions,
        toolbarEnd,
        totalCount,
        page,
        pageCount,
        onPageChange,
        loading = false,
        error,
        empty,
        caption,
        className,
    } = props;

    /* ---- Uncontrolled sort fallback ---- */
    const [internalSort, setInternalSort] = useState<EdSortState | null>(null);
    const activeSort = sort !== undefined ? sort : internalSort;
    const isClientSort = sort === undefined;

    const setSort = (next: EdSortState | null) => {
        if (isClientSort) setInternalSort(next);
        onSortChange?.(next);
    };

    const cycleSort = (columnId: string) => {
        const cur = activeSort;
        let next: EdSortState | null;
        if (!cur || cur.columnId !== columnId) next = { columnId, dir: 'asc' };
        else if (cur.dir === 'asc') next = { columnId, dir: 'desc' };
        else next = null;
        setSort(next);
    };

    /* ---- Client-side sorting (only when uncontrolled + column has accessor) ---- */
    const sortedRows = useMemo(() => {
        if (!isClientSort || !activeSort) return rows;
        const col = columns.find((c) => c.id === activeSort.columnId);
        if (!col?.sortAccessor) return rows;
        const acc = col.sortAccessor;
        const dir = activeSort.dir === 'asc' ? 1 : -1;
        return [...rows].sort((a, b) => {
            const av = acc(a);
            const bv = acc(b);
            if (av < bv) return -1 * dir;
            if (av > bv) return 1 * dir;
            return 0;
        });
    }, [isClientSort, activeSort, rows, columns]);

    /* ---- Selection ---- */
    const [internalSel, setInternalSel] = useState<string[]>([]);
    const sel = selectedIds !== undefined ? selectedIds : internalSel;
    const selSet = useMemo(() => new Set(sel), [sel]);
    const setSel = (ids: string[]) => {
        if (selectedIds === undefined) setInternalSel(ids);
        onSelectedChange?.(ids);
    };

    const pageRowIds = sortedRows.map(getRowId);
    const allSelected = pageRowIds.length > 0 && pageRowIds.every((id) => selSet.has(id));
    const someSelected = pageRowIds.some((id) => selSet.has(id)) && !allSelected;

    const toggleAll = () => {
        if (allSelected) setSel(sel.filter((id) => !pageRowIds.includes(id)));
        else setSel(Array.from(new Set([...sel, ...pageRowIds])));
    };
    const toggleRow = (id: string) => {
        if (selSet.has(id)) setSel(sel.filter((x) => x !== id));
        else setSel([...sel, id]);
    };

    const colCount = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);
    const total = totalCount ?? rows.length;
    const showToolbar = selectable && sel.length > 0;

    /* ---- Render helpers ---- */
    const sortIcon = (col: EdColumn<Row>) => {
        if (!col.sortable) return null;
        const active = activeSort?.columnId === col.id;
        if (!active) return <ChevronsUpDown size={12} strokeWidth={2} className={styles.sortIcon} aria-hidden />;
        return activeSort!.dir === 'asc'
            ? <ChevronUp size={12} strokeWidth={2.5} className={styles.sortIconActive} aria-hidden />
            : <ChevronDown size={12} strokeWidth={2.5} className={styles.sortIconActive} aria-hidden />;
    };

    const ariaSort = (col: EdColumn<Row>): 'ascending' | 'descending' | 'none' | undefined => {
        if (!col.sortable) return undefined;
        if (activeSort?.columnId !== col.id) return 'none';
        return activeSort.dir === 'asc' ? 'ascending' : 'descending';
    };

    return (
        <div
            ref={ref}
            className={[styles.wrap, className].filter(Boolean).join(' ')}
        >
            {selectable && (
                <div className={styles.toolbarWrap} data-state={showToolbar ? 'visible' : 'hidden'}>
                    <div className={styles.toolbar} inert={!showToolbar}>
                        <span className={styles.toolbarCount} role="status" aria-live="polite">
                            {sel.length} of {total} selected
                        </span>
                        {bulkActions && <div className={styles.bulkActions}>{bulkActions(sel)}</div>}
                        {toolbarEnd && <><div className={styles.spacer} />{toolbarEnd}</>}
                    </div>
                </div>
            )}

            <div className={styles.scroll}>
                <table
                    className={[
                        styles.table,
                        density === 'compact' ? styles.compact : styles.default,
                        zebra && styles.zebra,
                        onRowClick && styles.clickable,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {caption && <caption className={styles.srOnly}>{caption}</caption>}
                    <thead>
                        <tr>
                            {selectable && (
                                <th className={styles.selectCell} scope="col">
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        aria-label={HEADER_LABEL}
                                        checked={allSelected}
                                        ref={(el) => {
                                            if (el) el.indeterminate = someSelected;
                                        }}
                                        onChange={toggleAll}
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    scope="col"
                                    aria-sort={ariaSort(col)}
                                    style={{ width: col.width }}
                                    className={[styles.headCell, col.align === 'right' && styles.alignRight]
                                        .filter(Boolean)
                                        .join(' ')}
                                >
                                    {col.sortable ? (
                                        <button type="button" className={styles.sortButton} onClick={() => cycleSort(col.id)}>
                                            {col.header}
                                            {sortIcon(col)}
                                        </button>
                                    ) : (
                                        col.header
                                    )}
                                </th>
                            ))}
                            {rowActions && <th className={styles.actionsCell} scope="col" />}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={`sk-${i}`} className={styles.skeletonRow}>
                                    {selectable && <td className={styles.selectCell} />}
                                    {columns.map((col) => (
                                        <td key={col.id} className={styles.cell}>
                                            <span className={styles.skeleton} style={{ width: `${40 + ((i * 7 + col.id.length * 11) % 50)}%` }} />
                                        </td>
                                    ))}
                                    {rowActions && <td className={styles.actionsCell} />}
                                </tr>
                            ))
                        )}

                        {!loading && !error && sortedRows.map((row) => {
                            const id = getRowId(row);
                            const isSel = selSet.has(id);
                            const superseded = isSuperseded?.(row);
                            return (
                                <tr
                                    key={id}
                                    aria-selected={selectable ? isSel : undefined}
                                    className={[
                                        isSel && styles.rowSelected,
                                        superseded && styles.rowSuperseded,
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                >
                                    {selectable && (
                                        <td className={styles.selectCell} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                aria-label={`Select row ${id}`}
                                                checked={isSel}
                                                onChange={() => toggleRow(id)}
                                            />
                                        </td>
                                    )}
                                    {columns.map((col) => (
                                        <td
                                            key={col.id}
                                            className={[
                                                styles.cell,
                                                col.mono && styles.cellMono,
                                                col.align === 'right' && styles.alignRight,
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                        >
                                            {col.cell(row)}
                                        </td>
                                    ))}
                                    {rowActions && (
                                        <td className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
                                            {rowActions(row)}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {!loading && error && (
                    <div className={styles.stateBox}>{error}</div>
                )}
                {!loading && !error && sortedRows.length === 0 && (
                    <div className={styles.stateBox}>{empty ?? <span className={styles.emptyText}>No rows.</span>}</div>
                )}
            </div>

            {(page !== undefined && pageCount !== undefined) && (
                <div className={styles.footer}>
                    <span>
                        Showing {sortedRows.length === 0 ? 0 : 1}–{sortedRows.length} of {total}
                        {selectable && sel.length > 0 ? ` · ${sel.length} selected` : ''}
                    </span>
                    <span className={styles.paginator}>
                        <button
                            type="button"
                            className={styles.pageBtn}
                            aria-label="Previous page"
                            disabled={page <= 1}
                            onClick={() => onPageChange?.(page - 1)}
                        >
                            <ChevronLeft size={14} strokeWidth={1.8} aria-hidden />
                        </button>
                        <span className={styles.pageInfo}>{page} / {pageCount}</span>
                        <button
                            type="button"
                            className={styles.pageBtn}
                            aria-label="Next page"
                            disabled={page >= pageCount}
                            onClick={() => onPageChange?.(page + 1)}
                        >
                            <ChevronRight size={14} strokeWidth={1.8} aria-hidden />
                        </button>
                    </span>
                </div>
            )}
        </div>
    );
}

/** Generic forwardRef wrapper — preserves the Row type parameter. */
export const EdDataTable = forwardRef(EdDataTableInner) as <Row>(
    props: EdDataTableProps<Row> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof EdDataTableInner>;
