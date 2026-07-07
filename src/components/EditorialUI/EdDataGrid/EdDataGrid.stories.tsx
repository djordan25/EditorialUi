import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import { EdDataGrid } from './EdDataGrid';

const meta: Meta<typeof EdDataGrid> = {
    title: 'EditorialUI/Data/EdDataGrid',
    component: EdDataGrid as never,
    parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof EdDataGrid>;

interface Finding {
    id: string;
    ref: string;
    title: string;
    severity: 'Low' | 'Medium' | 'High';
    owner: string;
    updated: string;
}

const SEVERITIES: Finding['severity'][] = ['Low', 'Medium', 'High'];
const OWNERS = ['marcus.chen', 'aisha.patel', 'liam.novak', 'sara.kim'];

function makeRows(n: number): Finding[] {
    return Array.from({ length: n }, (_, i) => ({
        id: `f-${i + 1}`,
        ref: `F-${1000 + i}`,
        title: `Validation gap in model input ${i + 1}`,
        severity: SEVERITIES[i % 3],
        owner: OWNERS[i % OWNERS.length],
        updated: `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
    }));
}

const columns: ColumnDef<Finding, unknown>[] = [
    { accessorKey: 'ref', header: 'Ref', size: 90 },
    { accessorKey: 'title', header: 'Finding', size: 320, enableSorting: false },
    { accessorKey: 'severity', header: 'Severity', size: 110 },
    { accessorKey: 'owner', header: 'Owner', size: 150 },
    { accessorKey: 'updated', header: 'Updated', size: 120 },
];

export const Virtualized: Story = {
    render: () => {
        const rows = useMemo(() => makeRows(1000), []);
        const [sorting, setSorting] = useState<SortingState>([{ id: 'updated', desc: true }]);
        return (
            <div style={{ height: 420 }}>
                <EdDataGrid
                    ariaLabel="Findings"
                    data={rows}
                    columns={columns}
                    getRowId={(r) => r.id}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    onRowClick={(r) => console.log('open', r.ref)}
                />
            </div>
        );
    },
};

export const Selectable: Story = {
    render: () => {
        const rows = useMemo(() => makeRows(200), []);
        const [sorting, setSorting] = useState<SortingState>([]);
        const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
        const count = Object.values(rowSelection).filter(Boolean).length;
        return (
            <div>
                <p style={{ fontFamily: 'var(--ed-font-mono)', fontSize: 12, color: 'var(--ed-color-text-muted)' }}>
                    {count} selected
                </p>
                <div style={{ height: 380 }}>
                    <EdDataGrid
                        ariaLabel="Findings"
                        data={rows}
                        columns={columns}
                        getRowId={(r) => r.id}
                        sorting={sorting}
                        onSortingChange={setSorting}
                        enableRowSelection
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                        onRowClick={(r) => console.log('open', r.ref)}
                    />
                </div>
            </div>
        );
    },
};

export const Cards: Story = {
    render: () => {
        const rows = useMemo(() => makeRows(12), []);
        return (
            <div style={{ maxWidth: 420 }}>
                <EdDataGrid
                    ariaLabel="Findings"
                    data={rows}
                    columns={columns}
                    getRowId={(r) => r.id}
                    cardLayout
                    onRowClick={(r) => console.log('open', r.ref)}
                    renderCard={(r) => (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong style={{ fontFamily: 'var(--ed-font-mono)', fontSize: 12 }}>{r.ref}</strong>
                                <span style={{ fontSize: 12, color: 'var(--ed-color-text-muted)' }}>{r.severity}</span>
                            </div>
                            <span style={{ fontSize: 14 }}>{r.title}</span>
                            <span style={{ fontSize: 12, color: 'var(--ed-color-text-muted)' }}>
                                {r.owner} · {r.updated}
                            </span>
                        </div>
                    )}
                />
            </div>
        );
    },
};

export const FirstPaintLoading: Story = {
    render: () => (
        <div style={{ height: 320 }}>
            <EdDataGrid ariaLabel="Findings" data={[]} columns={columns} isLoading skeletonRows={8} />
        </div>
    ),
};

export const Empty: Story = {
    render: () => (
        <div style={{ height: 240 }}>
            <EdDataGrid
                ariaLabel="Findings"
                data={[]}
                columns={columns}
                renderEmpty={() => 'No findings match your filters.'}
            />
        </div>
    ),
};
