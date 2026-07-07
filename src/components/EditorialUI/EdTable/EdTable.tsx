import {
    createContext,
    forwardRef,
    useContext,
    type HTMLAttributes,
    type ReactNode,
    type ThHTMLAttributes,
} from 'react';
import styles from './EdTable.module.scss';

export type EdTableCellAlign = 'left' | 'center' | 'right';

/** Which section a cell sits in — decides `<th>` (head) vs `<td>` (body/foot). */
const SectionContext = createContext<'head' | 'body' | 'foot'>('body');

/* ------------------------------------------------------------------ */
/* Container — horizontal scroll + sticky-header scroll context        */
/* ------------------------------------------------------------------ */

export type EdTableContainerProps = HTMLAttributes<HTMLDivElement>;

export const EdTableContainer = forwardRef<HTMLDivElement, EdTableContainerProps>(
    function EdTableContainer({ className, children, ...rest }, ref) {
        return (
            <div ref={ref} className={[styles.container, className].filter(Boolean).join(' ')} {...rest}>
                {children}
            </div>
        );
    },
);

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

export interface EdTableProps extends HTMLAttributes<HTMLTableElement> {
    /** Cell padding scale. Default `default`. */
    density?: 'default' | 'compact';
    /** Pin the header row while the body scrolls (inside an EdTableContainer). */
    stickyHeader?: boolean;
}

/**
 * EdTable — a low-level compound table primitive (Table / Head / Body / Row / Cell).
 * Unlike EdNativeTable (a data-driven columns/rows model), this is transparent: cells
 * pass through `colSpan`/`rowSpan`, `scope`, and any ARIA/keyboard props (`role`,
 * `tabIndex`, `onKeyDown`), so you can build spanning layouts or a `role="grid"`
 * keyboard grid. Use EdNativeTable for simple static data; use this when you need
 * per-cell control.
 *
 *   <EdTableContainer>
 *     <EdTable stickyHeader role="grid">
 *       <EdTableHead><EdTableRow><EdTableCell>Name</EdTableCell></EdTableRow></EdTableHead>
 *       <EdTableBody>
 *         <EdTableRow><EdTableCell role="gridcell" tabIndex={0}>…</EdTableCell></EdTableRow>
 *       </EdTableBody>
 *     </EdTable>
 *   </EdTableContainer>
 */
export const EdTable = forwardRef<HTMLTableElement, EdTableProps>(function EdTable(
    { density = 'default', stickyHeader = false, className, children, ...rest },
    ref,
) {
    return (
        <table
            ref={ref}
            className={[
                styles.table,
                density === 'compact' ? styles.compact : styles.default,
                stickyHeader && styles.stickyHeader,
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...rest}
        >
            {children}
        </table>
    );
});

/* ------------------------------------------------------------------ */
/* Head / Body / Foot — provide the section context                    */
/* ------------------------------------------------------------------ */

export type EdTableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

export const EdTableHead = forwardRef<HTMLTableSectionElement, EdTableHeadProps>(
    function EdTableHead({ className, children, ...rest }, ref) {
        return (
            <SectionContext.Provider value="head">
                <thead ref={ref} className={[styles.head, className].filter(Boolean).join(' ')} {...rest}>
                    {children}
                </thead>
            </SectionContext.Provider>
        );
    },
);

export type EdTableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export const EdTableBody = forwardRef<HTMLTableSectionElement, EdTableBodyProps>(
    function EdTableBody({ className, children, ...rest }, ref) {
        return (
            <SectionContext.Provider value="body">
                <tbody ref={ref} className={className} {...rest}>
                    {children}
                </tbody>
            </SectionContext.Provider>
        );
    },
);

export type EdTableFootProps = HTMLAttributes<HTMLTableSectionElement>;

export const EdTableFoot = forwardRef<HTMLTableSectionElement, EdTableFootProps>(
    function EdTableFoot({ className, children, ...rest }, ref) {
        return (
            <SectionContext.Provider value="foot">
                <tfoot ref={ref} className={[styles.foot, className].filter(Boolean).join(' ')} {...rest}>
                    {children}
                </tfoot>
            </SectionContext.Provider>
        );
    },
);

/* ------------------------------------------------------------------ */
/* Row                                                                 */
/* ------------------------------------------------------------------ */

export type EdTableRowProps = HTMLAttributes<HTMLTableRowElement>;

export const EdTableRow = forwardRef<HTMLTableRowElement, EdTableRowProps>(function EdTableRow(
    { className, children, ...rest },
    ref,
) {
    return (
        <tr ref={ref} className={[styles.row, className].filter(Boolean).join(' ')} {...rest}>
            {children}
        </tr>
    );
});

/* ------------------------------------------------------------------ */
/* Cell — auto <th> in head, <td> in body/foot                         */
/* ------------------------------------------------------------------ */

export interface EdTableCellProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
    /** Text alignment. */
    align?: EdTableCellAlign;
    /** Force the element regardless of section (e.g. a `<th scope="row">` row header in the body). */
    component?: 'th' | 'td';
    children?: ReactNode;
}

export const EdTableCell = forwardRef<HTMLTableCellElement, EdTableCellProps>(function EdTableCell(
    { align = 'left', component, className, children, ...rest },
    ref,
) {
    const section = useContext(SectionContext);
    const Tag = component ?? (section === 'head' ? 'th' : 'td');
    const isHead = Tag === 'th' && section === 'head';

    return (
        <Tag
            ref={ref}
            className={[
                styles.cell,
                isHead && styles.headCell,
                align === 'right' && styles.alignRight,
                align === 'center' && styles.alignCenter,
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...rest}
        >
            {children}
        </Tag>
    );
});
