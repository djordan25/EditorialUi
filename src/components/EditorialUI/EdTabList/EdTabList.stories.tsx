import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileText, ShieldCheck, ListChecks } from 'lucide-react';
import { EdTabList, EdTab, edTabId, edTabPanelId, type EdTabValue } from './EdTabList';

const meta: Meta<typeof EdTabList> = {
    title: 'EditorialUI/Navigation/EdTabList',
    component: EdTabList,
    parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof EdTabList>;

const PANELS: Record<string, string> = {
    overview: 'Overview panel — app-owned, wired by edTabPanelId.',
    findings: 'Findings panel — 23 open items.',
    audit: 'Audit log panel — full history.',
};

function ExternalPanels({
    orientation,
    variant,
}: {
    orientation?: 'horizontal' | 'vertical';
    variant?: 'underline' | 'segmented';
}) {
    const [tab, setTab] = useState<EdTabValue>('overview');
    return (
        <div style={{ display: 'flex', gap: 16, flexDirection: orientation === 'vertical' ? 'row' : 'column' }}>
            <EdTabList
                value={tab}
                onValueChange={(v) => setTab(v)}
                orientation={orientation}
                variant={variant}
                aria-label="Model views"
            >
                <EdTab value="overview" label="Overview" icon={<FileText size={15} strokeWidth={1.8} />} />
                <EdTab value="findings" label="Findings" count={23} icon={<ListChecks size={15} strokeWidth={1.8} />} />
                <EdTab value="audit" label="Audit log" icon={<ShieldCheck size={15} strokeWidth={1.8} />} />
            </EdTabList>
            <div
                role="tabpanel"
                id={edTabPanelId(tab)}
                aria-labelledby={edTabId(tab)}
                style={{ padding: '4px 2px', fontFamily: 'var(--ed-font-sans)', color: 'var(--ed-color-text-primary)' }}
            >
                {PANELS[String(tab)]}
            </div>
        </div>
    );
}

export const Underline: Story = { render: () => <ExternalPanels /> };
export const Segmented: Story = { render: () => <ExternalPanels variant="segmented" /> };
export const Vertical: Story = { render: () => <ExternalPanels orientation="vertical" /> };

export const NumericValues: Story = {
    render: () => {
        const [tab, setTab] = useState<EdTabValue>(0);
        return (
            <EdTabList value={tab} onValueChange={(v) => setTab(v)} aria-label="Steps">
                <EdTab label="Step 1" />
                <EdTab label="Step 2" />
                <EdTab label="Step 3" />
            </EdTabList>
        );
    },
};
