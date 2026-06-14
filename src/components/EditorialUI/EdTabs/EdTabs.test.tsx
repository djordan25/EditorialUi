import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdTabs, type EdTabItem } from './EdTabs';

const items: EdTabItem[] = [
    { value: 'overview', label: 'Overview', content: 'overview panel' },
    { value: 'findings', label: 'Findings', count: 23, content: 'findings panel' },
    { value: 'audit', label: 'Audit log', count: 147, content: 'audit panel' },
    { value: 'settings', label: 'Settings', disabled: true, content: 'settings panel' },
];

describe('EdTabs', () => {
    it('renders a tablist with all tabs', () => {
        render(<EdTabs defaultValue="overview" items={items} />);
        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getAllByRole('tab')).toHaveLength(4);
    });

    it('shows the default tab panel', () => {
        render(<EdTabs defaultValue="overview" items={items} />);
        expect(screen.getByText('overview panel')).toBeVisible();
    });

    it('switches panel on tab click', async () => {
        render(<EdTabs defaultValue="overview" items={items} />);
        await userEvent.click(screen.getByRole('tab', { name: /Findings/ }));
        expect(screen.getByText('findings panel')).toBeVisible();
    });

    it('folds the count into the accessible name', () => {
        render(<EdTabs defaultValue="overview" items={items} />);
        expect(screen.getByRole('tab', { name: 'Findings, 23' })).toBeInTheDocument();
    });

    it('marks the active tab aria-selected', () => {
        render(<EdTabs defaultValue="findings" items={items} />);
        expect(screen.getByRole('tab', { name: 'Findings, 23' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'false');
    });

    it('disables a disabled tab', () => {
        render(<EdTabs defaultValue="overview" items={items} />);
        expect(screen.getByRole('tab', { name: 'Settings' })).toBeDisabled();
    });

    it('arrow keys move between tabs (automatic activation)', async () => {
        render(<EdTabs defaultValue="overview" items={items} />);
        const overview = screen.getByRole('tab', { name: 'Overview' });
        overview.focus();
        await userEvent.keyboard('{ArrowRight}');
        expect(screen.getByRole('tab', { name: 'Findings, 23' })).toHaveFocus();
    });

    it('fires onValueChange', async () => {
        const onValueChange = vi.fn();
        render(<EdTabs defaultValue="overview" items={items} onValueChange={onValueChange} />);
        await userEvent.click(screen.getByRole('tab', { name: /Audit log/ }));
        expect(onValueChange).toHaveBeenCalledWith('audit');
    });

    it('manual activation does not switch on arrow focus alone', async () => {
        render(<EdTabs activationMode="manual" defaultValue="overview" items={items} />);
        screen.getByRole('tab', { name: 'Overview' }).focus();
        await userEvent.keyboard('{ArrowRight}');
        // Panel stays on overview until Enter/Space.
        expect(screen.getByText('overview panel')).toBeVisible();
        await userEvent.keyboard('{Enter}');
        expect(screen.getByText('findings panel')).toBeVisible();
    });
});
