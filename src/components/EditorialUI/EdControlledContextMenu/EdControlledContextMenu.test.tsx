import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
    EdControlledContextMenu,
    type EdControlledContextMenuEntry,
} from './EdControlledContextMenu';

const items: EdControlledContextMenuEntry[] = [
    { kind: 'info', rows: [{ label: 'BVN', value: 'BVN-42' }, { label: 'Status', value: 'Open' }] },
    { kind: 'separator' },
    { id: 'open', label: 'Open in inspector', onSelect: vi.fn() },
    { id: 'delete', label: 'Delete', danger: true, ariaLabel: 'Delete BVN-42', onSelect: vi.fn() },
];

describe('EdControlledContextMenu', () => {
    it('renders nothing when closed', () => {
        render(<EdControlledContextMenu open={false} position={null} onClose={() => {}} items={items} />);
        expect(screen.queryByRole('menu')).toBeNull();
    });

    it('stays closed when open but position is null', () => {
        render(<EdControlledContextMenu open position={null} onClose={() => {}} items={items} />);
        expect(screen.queryByRole('menu')).toBeNull();
    });

    it('opens the menu at a coordinate and forwards the aria-label', async () => {
        render(
            <EdControlledContextMenu
                open
                position={{ top: 120, left: 80 }}
                onClose={() => {}}
                items={items}
                ariaLabel="Row actions"
            />,
        );
        expect(await screen.findByRole('menu')).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Open in inspector' })).toBeInTheDocument();
        expect(document.querySelector('[aria-label="Row actions"]')).not.toBeNull();
    });

    it('renders a non-interactive info/stats block above the actions', async () => {
        render(<EdControlledContextMenu open position={{ top: 0, left: 0 }} onClose={() => {}} items={items} />);
        await screen.findByRole('menu');
        expect(screen.getByText('BVN')).toBeInTheDocument();
        expect(screen.getByText('BVN-42')).toBeInTheDocument();
        // The info block is not a menu item — only the two actions are.
        expect(screen.getAllByRole('menuitem')).toHaveLength(2);
    });

    it('fires an action onSelect when chosen', async () => {
        const onSelect = vi.fn();
        const its: EdControlledContextMenuEntry[] = [{ id: 'go', label: 'Validate', onSelect }];
        render(<EdControlledContextMenu open position={{ top: 0, left: 0 }} onClose={() => {}} items={its} />);
        await userEvent.click(await screen.findByRole('menuitem', { name: 'Validate' }));
        expect(onSelect).toHaveBeenCalled();
    });

    it('calls onClose on Escape', async () => {
        const onClose = vi.fn();
        render(<EdControlledContextMenu open position={{ top: 0, left: 0 }} onClose={onClose} items={items} />);
        await screen.findByRole('menu');
        await userEvent.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalled();
    });

    it('names a destructive item by its ariaLabel', async () => {
        render(<EdControlledContextMenu open position={{ top: 0, left: 0 }} onClose={() => {}} items={items} />);
        await screen.findByRole('menu');
        expect(screen.getByRole('menuitem', { name: 'Delete BVN-42' })).toBeInTheDocument();
    });
});
