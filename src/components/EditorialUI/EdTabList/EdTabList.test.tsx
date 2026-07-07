import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdTab, EdTabList, edTabId, edTabPanelId } from './EdTabList';

function StringTabs(props: {
    value?: string;
    onValueChange?: (v: string | number, e?: unknown) => void;
}) {
    return (
        <EdTabList
            value={props.value ?? 'overview'}
            onValueChange={(v, e) => props.onValueChange?.(v, e as never)}
            aria-label="Model views"
        >
            <EdTab value="overview" label="Overview" />
            <EdTab value="findings" label="Findings" count={23} />
            <EdTab value="audit" label="Audit log" />
            <EdTab value="settings" label="Settings" disabled />
        </EdTabList>
    );
}

describe('EdTabList', () => {
    it('renders a tablist with all compound tabs', () => {
        render(<StringTabs />);
        expect(screen.getByRole('tablist', { name: 'Model views' })).toBeInTheDocument();
        expect(screen.getAllByRole('tab')).toHaveLength(4);
    });

    it('marks the selected tab aria-selected and gives it the roving tabindex', () => {
        render(<StringTabs value="findings" />);
        const active = screen.getByRole('tab', { name: 'Findings, 23' });
        const inactive = screen.getByRole('tab', { name: 'Overview' });
        expect(active).toHaveAttribute('aria-selected', 'true');
        expect(active).toHaveAttribute('tabindex', '0');
        expect(inactive).toHaveAttribute('aria-selected', 'false');
        expect(inactive).toHaveAttribute('tabindex', '-1');
    });

    it('folds the count into the accessible name', () => {
        render(<StringTabs />);
        expect(screen.getByRole('tab', { name: 'Findings, 23' })).toBeInTheDocument();
    });

    it('emits deterministic tab + panel ids for external panels', () => {
        render(<StringTabs />);
        const tab = screen.getByRole('tab', { name: 'Overview' });
        expect(tab).toHaveAttribute('id', edTabId('overview'));
        expect(tab).toHaveAttribute('aria-controls', edTabPanelId('overview'));
    });

    it('calls onValueChange with the value + event on click', async () => {
        const onValueChange = vi.fn();
        render(<StringTabs onValueChange={onValueChange} />);
        await userEvent.click(screen.getByRole('tab', { name: 'Audit log' }));
        expect(onValueChange).toHaveBeenCalledWith('audit', expect.anything());
    });

    it('disables a disabled tab', () => {
        render(<StringTabs />);
        expect(screen.getByRole('tab', { name: 'Settings' })).toBeDisabled();
    });

    it('supports numeric values with a positional fallback', async () => {
        const onValueChange = vi.fn();
        render(
            <EdTabList value={0} onValueChange={onValueChange} aria-label="n">
                <EdTab label="First" />
                <EdTab label="Second" />
            </EdTabList>,
        );
        // index fallback: first tab is value 0 and selected
        expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
        await userEvent.click(screen.getByRole('tab', { name: 'Second' }));
        expect(onValueChange).toHaveBeenCalledWith(1, expect.anything());
    });

    it('ArrowRight moves selection + focus to the next enabled tab', async () => {
        const onValueChange = vi.fn();
        render(<StringTabs onValueChange={onValueChange} />);
        const overview = screen.getByRole('tab', { name: 'Overview' });
        overview.focus();
        await userEvent.keyboard('{ArrowRight}');
        expect(onValueChange).toHaveBeenLastCalledWith('findings', expect.anything());
        expect(screen.getByRole('tab', { name: 'Findings, 23' })).toHaveFocus();
    });

    it('ArrowLeft wraps and skips disabled tabs; Home/End jump to ends', async () => {
        const onValueChange = vi.fn();
        render(<StringTabs value="overview" onValueChange={onValueChange} />);
        screen.getByRole('tab', { name: 'Overview' }).focus();
        // Left from the first enabled tab wraps to the last ENABLED (audit — settings is disabled)
        await userEvent.keyboard('{ArrowLeft}');
        expect(onValueChange).toHaveBeenLastCalledWith('audit', expect.anything());
        await userEvent.keyboard('{End}');
        expect(onValueChange).toHaveBeenLastCalledWith('audit', expect.anything());
        await userEvent.keyboard('{Home}');
        expect(onValueChange).toHaveBeenLastCalledWith('overview', expect.anything());
    });

    it('vertical orientation exposes aria-orientation and uses the vertical arrow axis', async () => {
        const onValueChange = vi.fn();
        render(
            <EdTabList
                value="a"
                orientation="vertical"
                onValueChange={onValueChange}
                aria-label="v"
            >
                <EdTab value="a" label="A" />
                <EdTab value="b" label="B" />
            </EdTabList>,
        );
        expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
        screen.getByRole('tab', { name: 'A' }).focus();
        await userEvent.keyboard('{ArrowDown}');
        expect(onValueChange).toHaveBeenLastCalledWith('b', expect.anything());
    });

    it('honors an idBase for the generated ids', () => {
        render(
            <EdTabList value="a" idBase="report" onValueChange={() => {}} aria-label="r">
                <EdTab value="a" label="A" />
            </EdTabList>,
        );
        expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('id', 'report-tab-a');
        expect(edTabPanelId('a', 'report')).toBe('report-tabpanel-a');
    });

    it('id helpers stringify numbers and strings', () => {
        expect(edTabId(0)).toBe('ed-tab-0');
        expect(edTabPanelId(2)).toBe('ed-tabpanel-2');
        expect(edTabId('findings')).toBe('ed-tab-findings');
    });

    it('navigates relative to the FOCUSED tab, not the selected value', async () => {
        const onValueChange = vi.fn();
        // 'settings' is disabled yet passed as the selected value (a drifted/rejected state);
        // focus sits on 'overview'. ArrowRight must move relative to focus → 'findings',
        // not skip based on the (non-enabled) selected value.
        render(<StringTabs value="settings" onValueChange={onValueChange} />);
        screen.getByRole('tab', { name: 'Overview' }).focus();
        await userEvent.keyboard('{ArrowRight}');
        expect(onValueChange).toHaveBeenLastCalledWith('findings', expect.anything());
        expect(screen.getByRole('tab', { name: 'Findings, 23' })).toHaveFocus();
    });

    it('scopes keyboard focus to its own tablist (no cross-instance jump)', async () => {
        const a = vi.fn();
        const b = vi.fn();
        render(
            <>
                <EdTabList value="a1" onValueChange={a} aria-label="First" idBase="first">
                    <EdTab value="a1" label="A1" />
                    <EdTab value="a2" label="A2" />
                </EdTabList>
                <EdTabList value="b1" onValueChange={b} aria-label="Second" idBase="second">
                    <EdTab value="b1" label="B1" />
                    <EdTab value="b2" label="B2" />
                </EdTabList>
            </>,
        );
        screen.getByRole('tab', { name: 'B1' }).focus();
        await userEvent.keyboard('{ArrowRight}');
        expect(b).toHaveBeenLastCalledWith('b2', expect.anything());
        expect(a).not.toHaveBeenCalled();
        expect(screen.getByRole('tab', { name: 'B2' })).toHaveFocus();
    });

    it('folds the count into the accessible name even for non-string labels', () => {
        render(
            <EdTabList value="f" onValueChange={() => {}} aria-label="x">
                <EdTab value="f" label={<span>Findings</span>} count={23} />
            </EdTabList>,
        );
        expect(screen.getByRole('tab', { name: /Findings, 23/ })).toBeInTheDocument();
    });
});
