import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { EdDataTable, type EdColumn, type EdSortState } from './EdDataTable';

const meta: Meta = {
    title: 'EditorialUI/Data/EdDataTable',
    parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

interface Finding {
    id: string;
    title: string;
    severity: 'LOW' | 'MEDIUM' | 'MRA';
    status: 'OPEN' | 'OVERDUE' | 'IN_REVIEW' | 'CLOSED';
    owner: string;
    due: string;
    superseded?: boolean;
}

const DATA: Finding[] = [
    { id: 'F-2438', title: 'Stale model documentation', severity: 'MEDIUM', status: 'OPEN', owner: 'Marcus Chen', due: '2026-04-22' },
    { id: 'F-2401', title: 'Backtest mismatch — PD retail', severity: 'MRA', status: 'OVERDUE', owner: 'Priya Rao', due: '2026-04-05' },
    { id: 'F-2399', title: 'Drift threshold not configured', severity: 'LOW', status: 'IN_REVIEW', owner: 'Hanna Lindqvist', due: '2026-05-14' },
    { id: 'F-2287', title: 'Stale documentation (superseded by F-2438)', severity: 'LOW', status: 'CLOSED', owner: 'Marcus Chen', due: '2026-02-14', superseded: true },
];

const badge = (label: string, tone: string, solid = false, dot = false) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 8px', borderRadius: 'var(--ed-radius-sm)',
        background: solid ? `var(--ed-color-status-${tone})` : `var(--ed-color-status-${tone}-bg)`,
        color: solid ? '#fff' : `var(--ed-color-status-${tone})`,
        fontFamily: 'var(--ed-font-mono)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
        {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
        {label}
    </span>
);

const sevBadge = (s: Finding['severity']) =>
    s === 'MRA' ? badge('MRA', 'danger', true) : s === 'MEDIUM' ? badge('MEDIUM', 'warning') : badge('LOW', 'neutral');
const statusBadge = (s: Finding['status']) =>
    s === 'OPEN' ? badge('OPEN', 'warning', false, true)
    : s === 'OVERDUE' ? badge('OVERDUE', 'danger', false, true)
    : s === 'IN_REVIEW' ? badge('IN_REVIEW', 'info')
    : badge('CLOSED', 'neutral');

const columns: EdColumn<Finding>[] = [
    { id: 'id', header: 'ID', cell: (r) => r.id, mono: true, sortable: true, sortAccessor: (r) => r.id, width: '110px' },
    { id: 'title', header: 'Title', cell: (r) => r.title, sortable: true, sortAccessor: (r) => r.title },
    { id: 'severity', header: 'Severity', cell: (r) => sevBadge(r.severity) },
    { id: 'status', header: 'Status', cell: (r) => statusBadge(r.status) },
    { id: 'owner', header: 'Owner', cell: (r) => r.owner, sortable: true, sortAccessor: (r) => r.owner },
    { id: 'due', header: 'Due', cell: (r) => <span style={{ color: r.status === 'OVERDUE' ? 'var(--ed-color-status-danger)' : undefined }}>{r.due}</span>, mono: true, sortable: true, sortAccessor: (r) => r.due, align: 'right' },
];

const overflowBtn = (
    <button aria-label="More actions" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: 'transparent', border: 'none', borderRadius: 'var(--ed-radius-sm)', color: 'var(--ed-color-text-secondary)', cursor: 'pointer' }}>
        <MoreHorizontal size={16} strokeWidth={1.8} />
    </button>
);

const smBtn = (label: string, danger = false) => (
    <button style={{ height: 28, padding: '0 12px', background: 'var(--ed-color-surface-1)', border: '1px solid var(--ed-color-hairline-strong)', borderRadius: 'var(--ed-radius-sm)', fontFamily: 'var(--ed-font-sans)', fontSize: 13, fontWeight: 500, color: danger ? 'var(--ed-color-status-danger)' : 'var(--ed-color-text-primary)', cursor: 'pointer' }}>{label}</button>
);

export const Default: Story = {
    render: () => (
        <EdDataTable<Finding>
            columns={columns}
            rows={DATA}
            getRowId={(r) => r.id}
            isSuperseded={(r) => !!r.superseded}
            rowActions={() => overflowBtn}
            caption="Findings"
        />
    ),
};

export const Selection: Story = {
    render: () => {
        const [sel, setSel] = useState<string[]>(['F-2438', 'F-2401']);
        return (
            <EdDataTable<Finding>
                columns={columns}
                rows={DATA}
                getRowId={(r) => r.id}
                selectable
                selectedIds={sel}
                onSelectedChange={setSel}
                isSuperseded={(r) => !!r.superseded}
                rowActions={() => overflowBtn}
                bulkActions={(ids) => (
                    <>
                        {smBtn(`Reassign ${ids.length}…`)}
                        {smBtn('Export')}
                        {smBtn('Close findings', true)}
                    </>
                )}
            />
        );
    },
};

export const Sortable: Story = {
    render: () => {
        const [sort, setSort] = useState<EdSortState | null>({ columnId: 'title', dir: 'asc' });
        return (
            <EdDataTable<Finding>
                columns={columns}
                rows={DATA}
                getRowId={(r) => r.id}
                sort={sort}
                onSortChange={setSort}
            />
        );
    },
};

export const ClientSortUncontrolled: Story = {
    name: 'Sortable (uncontrolled client sort)',
    render: () => (
        <EdDataTable<Finding> columns={columns} rows={DATA} getRowId={(r) => r.id} />
    ),
};

export const Compact: Story = {
    render: () => {
        interface Log { time: string; actor: string; action: string; target: string; }
        const logCols: EdColumn<Log>[] = [
            { id: 'time', header: 'Time', cell: (r) => r.time, mono: true },
            { id: 'actor', header: 'Actor', cell: (r) => r.actor },
            { id: 'action', header: 'Action', cell: (r) => r.action },
            { id: 'target', header: 'Target', cell: (r) => r.target, mono: true },
        ];
        const logs: Log[] = [
            { time: '11:42:08', actor: 'Marcus Chen', action: 'opened', target: 'F-2438' },
            { time: '11:41:55', actor: 'Marcus Chen', action: 'assigned', target: 'F-2438 → himself' },
            { time: '11:39:12', actor: 'Hanna L.', action: 'created', target: 'F-2438' },
        ];
        return <EdDataTable<Log> columns={logCols} rows={logs} getRowId={(r) => r.time} density="compact" />;
    },
};

export const Zebra: Story = {
    render: () => <EdDataTable<Finding> columns={columns} rows={DATA} getRowId={(r) => r.id} zebra />,
};

/* EdDataTable does CONTROLLED pagination: it renders whatever `rows` you pass and
   emits onPageChange — you supply each page's rows (slice client-side as below, or
   fetch from a server). The previous version passed the full DATA on every page, so
   the page number changed but the rows never did. */
export const Paginated: Story = {
    name: 'Paginated (controlled)',
    render: () => {
        const pageSize = 2;
        const [page, setPage] = useState(1);
        const pageCount = Math.ceil(DATA.length / pageSize);
        const pageRows = DATA.slice((page - 1) * pageSize, page * pageSize);
        return (
            <EdDataTable<Finding>
                columns={columns}
                rows={pageRows}
                getRowId={(r) => r.id}
                selectable
                totalCount={DATA.length}
                page={page}
                pageCount={pageCount}
                onPageChange={setPage}
            />
        );
    },
};

export const Loading: Story = {
    render: () => <EdDataTable<Finding> columns={columns} rows={[]} getRowId={(r) => r.id} loading />,
};

export const ErrorState: Story = {
    render: () => (
        <EdDataTable<Finding>
            columns={columns}
            rows={[]}
            getRowId={(r) => r.id}
            error={
                <>
                    <span style={{ fontWeight: 500 }}>Couldn't load findings</span>
                    <span style={{ fontSize: 13, color: 'var(--ed-color-text-secondary)' }}>Registry sync is unreachable.</span>
                    {smBtn('Retry')}
                </>
            }
        />
    ),
};

export const Empty: Story = {
    render: () => (
        <EdDataTable<Finding>
            columns={columns}
            rows={[]}
            getRowId={(r) => r.id}
            empty={
                <>
                    <span style={{ fontWeight: 500 }}>No findings match "drift threshold"</span>
                    {smBtn('Clear filters')}
                </>
            }
        />
    ),
};
