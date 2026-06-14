import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdDrawer, EdDrawerSection, EdSidePanel } from './EdDrawer';

describe('EdDrawer', () => {
    it('renders nothing when closed', () => {
        render(<EdDrawer open={false} title="X">body</EdDrawer>);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('renders a dialog with the title as accessible name', () => {
        render(<EdDrawer open title="Stale model documentation">body</EdDrawer>);
        expect(screen.getByRole('dialog', { name: 'Stale model documentation' })).toBeInTheDocument();
    });

    it('renders crumb + title + close button', () => {
        render(<EdDrawer open crumb="FINDING · F-2438" title="Stale docs">body</EdDrawer>);
        expect(screen.getByText('FINDING · F-2438')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Close drawer' })).toBeInTheDocument();
    });

    it('close button fires onOpenChange(false)', async () => {
        const onOpenChange = vi.fn();
        render(<EdDrawer open title="X" onOpenChange={onOpenChange}>body</EdDrawer>);
        await userEvent.click(screen.getByRole('button', { name: 'Close drawer' }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('renders footer actions', () => {
        render(<EdDrawer open title="X" footer={<button>Open finding</button>}>body</EdDrawer>);
        expect(screen.getByRole('button', { name: 'Open finding' })).toBeInTheDocument();
    });

    it('Escape closes by default', async () => {
        const onOpenChange = vi.fn();
        render(<EdDrawer open title="X" onOpenChange={onOpenChange}>body</EdDrawer>);
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('preventClose blocks Escape', async () => {
        const onOpenChange = vi.fn();
        render(<EdDrawer open title="X" onOpenChange={onOpenChange} preventClose>body</EdDrawer>);
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('EdDrawerSection renders a labelled group', () => {
        render(
            <EdDrawer open title="X">
                <EdDrawerSection label="Status">the status</EdDrawerSection>
            </EdDrawer>,
        );
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('the status')).toBeInTheDocument();
    });

    it('exposes a screen-reader description', () => {
        render(<EdDrawer open title="X" description="Inspecting finding F-2438">body</EdDrawer>);
        expect(screen.getByText('Inspecting finding F-2438')).toBeInTheDocument();
    });

    it('EdSidePanel is an alias of EdDrawer', () => {
        expect(EdSidePanel).toBe(EdDrawer);
    });
});
