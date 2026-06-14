import {
    forwardRef,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import styles from './EdNativeTable.module.scss';

export type EdNativeTableDensity = 'default' | 'compact';

/* ------------------------------------------------------------------ */
/* Key-value layout — labels in the left column, no header row.       */
/* ------------------------------------------------------------------ */

export interface EdKeyValueRow {
    /** Mono uppercase label (left column). */
    label: ReactNode;
    /** Value — plain text, mono, or composed (badge, link). */
    value: ReactNode;
    /** Render the value cell in mono. */
    mono?: boolean;
}

export interface EdKeyValueTableProps extends HTMLAttributes<HTMLTableElement> {
    rows: EdKeyValueRow[];
    density?: EdNativeTableDensity;
    /** Fixed width of the label column. Default 140px. */
    labelWidth?: number | string;
    /** Visually-hidden caption for screen readers when no visible heading precedes it. */
    caption?: ReactNode;
}

/**
 * EdKeyValueTable — static metadata grid (label → value), no header row.
 * Labels render as <th scope="row"> so AT announces "ID: F-2438".
 *
 *   <EdKeyValueTable rows={[
 *     { label: 'ID', value: 'F-2438', mono: true },
 *     { label: 'Severity', value: <EdStatusBadge tone="warning">MEDIUM</EdStatusBadge> },
 *   ]} />
 */
export const EdKeyValueTable = forwardRef<HTMLTableElement, EdKeyValueTableProps>(
    function EdKeyValueTable(
        { rows, density = 'compact', labelWidth = 140, caption, className, ...rest },
        ref,
    ) {
        return (
            <table
                ref={ref}
                className={[
                    styles.table,
                    density === 'compact' ? styles.compact : styles.default,
                    styles.keyValue,
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
                {...rest}
            >
                {caption && <caption className={styles.srOnly}>{caption}</caption>}
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            <th
                                scope="row"
                                className={`${styles.cell} ${styles.cellMono} ${styles.kvLabel}`}
                                style={{ width: labelWidth }}
                            >
                                {row.label}
                            </th>
                            <td className={[styles.cell, row.mono && styles.cellMono].filter(Boolean).join(' ')}>
                                {row.value}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    },
);

/* ------------------------------------------------------------------ */
/* Columned layout — header row + body, small known data sets.        */
/* ------------------------------------------------------------------ */

export interface EdNativeColumn {
    /** Column header. */
    header: ReactNode;
    /** Cell accessor key into each row record. */
    key: string;
    /** Render the cells in mono. */
    mono?: boolean;
    /** Right-align (numbers). */
    align?: 'left' | 'right';
    /** Custom cell renderer. */
    render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
}

export interface EdNativeTableProps extends HTMLAttributes<HTMLTableElement> {
    columns: EdNativeColumn[];
    rows: Record<string, unknown>[];
    density?: EdNativeTableDensity;
    /** Zebra striping for scannability when rows visually blend. */
    zebra?: boolean;
    caption?: ReactNode;
}

/**
 * EdNativeTable — static, plain columned table for small known-row sets.
 * No virtualization, sort, or selection — use EdDataTable for those.
 *
 *   <EdNativeTable
 *     columns={[
 *       { header: 'Validator', key: 'name' },
 *       { header: 'Findings', key: 'open', mono: true, align: 'right' },
 *     ]}
 *     rows={validators}
 *   />
 */
export const EdNativeTable = forwardRef<HTMLTableElement, EdNativeTableProps>(
    function EdNativeTable(
        { columns, rows, density = 'compact', zebra = false, caption, className, ...rest },
        ref,
    ) {
        return (
            <table
                ref={ref}
                className={[
                    styles.table,
                    density === 'compact' ? styles.compact : styles.default,
                    zebra && styles.zebra,
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
                {...rest}
            >
                {caption && <caption className={styles.srOnly}>{caption}</caption>}
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                scope="col"
                                className={[styles.cell, styles.headCell, col.align === 'right' && styles.alignRight]
                                    .filter(Boolean)
                                    .join(' ')}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col) => {
                                const raw = row[col.key];
                                return (
                                    <td
                                        key={col.key}
                                        className={[
                                            styles.cell,
                                            col.mono && styles.cellMono,
                                            col.align === 'right' && styles.alignRight,
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                    >
                                        {col.render ? col.render(raw, row) : (raw as ReactNode)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    },
);
