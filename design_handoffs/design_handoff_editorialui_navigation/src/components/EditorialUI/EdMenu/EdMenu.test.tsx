import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdMenu, type EdMenuEntry } from './EdMenu';

const open = async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    return screen.findByRole('menu');
};

describe('EdMenu', () => {
    it('renders the trigger with haspopup', () => {
        render(<EdMenu trigger={<button>Actions</button>} items={[{ id: 'a', label: 'A', onSelect: () => {} }]} />);
        expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('does not render the menu until opened', () => {
        render(<EdMenu trigger={<button>Actions</button>} items={[{ id: 'a', label: 'A', onSelect: () => {} }]} />);
        expect(screen.queryByRole('menu')).toBeNull();
    });

    it('opens on trigger click and renders items', async () => {
        render(
            <EdMenu
                trigger={<button>Actions</button>}
                items={[
                    { id: 'close', label: 'Close finding', onSelect: () => {} },
                    { id: 'edit', label: 'Edit', onSelect: () => {} },
                ]}
            />,
        );
        await open();
        expect(screen.getByRole('menuitem', { name: 'Close finding' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    });

    it('invokes onSelect when an item is clicked', async () => {
        const onSelect = vi.fn();
        render(<EdMenu trigger={<button>Actions</button>} items={[{ id: 'close', label: 'Close finding', onSelect }]} />);
        await open();
        await userEvent.click(screen.getByRole('menuitem', { name: 'Close finding' }));
        expect(onSelect).toHaveBeenCalledOnce();
    });

    it('renders a destructive item with its explicit aria-label', async () => {
        render(
            <EdMenu
                trigger={<button>Actions</button>}
                items={[{ id: 'del', label: 'Delete finding', danger: true, ariaLabel: 'Delete finding F-2438', onSelect: () => {} }]}
            />,
        );
        await open();
        expect(screen.getByRole('menuitem', { name: 'Delete finding F-2438' })).toBeInTheDocument();
    });

    it('renders checkbox items with role + aria-checked and keeps menu open on toggle', async () => {
        const onCheckedChange = vi.fn();
        render(
            <EdMenu
                trigger={<button>Actions</button>}
                items={[{ kind: 'checkbox', id: 'closed', label: 'Show closed', checked: true, onCheckedChange }]}
            />,
        );
        await open();
        const cb = screen.getByRole('menuitemcheckbox', { name: 'Show closed' });
        expect(cb).toHaveAttribute('aria-checked', 'true');
        await userEvent.click(cb);
        expect(onCheckedChange).toHaveBeenCalledWith(false);
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('renders a group label', async () => {
        render(
            <EdMenu
                trigger={<button>Actions</button>}
                items={[{ kind: 'label', label: 'Export' }, { id: 'copy', label: 'Copy ID', onSelect: () => {} }] as EdMenuEntry[]}
            />,
        );
        await open();
        expect(screen.getByText('Export')).toBeInTheDocument();
    });

    it('does not invoke onSelect for a disabled item', async () => {
        const onSelect = vi.fn();
        render(<EdMenu trigger={<button>Actions</button>} items={[{ id: 'x', label: 'Reassign', disabled: true, onSelect }]} />);
        await open();
        await userEvent.click(screen.getByRole('menuitem', { name: 'Reassign' }));
        expect(onSelect).not.toHaveBeenCalled();
    });

    it('arrow keys move between items', async () => {
        render(
            <EdMenu
                trigger={<button>Actions</button>}
                items={[
                    { id: 'a', label: 'First', onSelect: () => {} },
                    { id: 'b', label: 'Second', onSelect: () => {} },
                ]}
            />,
        );
        await open();
        await userEvent.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'First' })).toHaveAttribute('data-highlighted');
    });

    it('renders a submenu trigger', async () => {
        render(
            <EdMenu
                trigger={<button>Actions</button>}
                items={[
                    { kind: 'submenu', id: 'move', label: 'Move to', items: [{ id: 'q1', label: '2026-Q1', onSelect: () => {} }] },
                ] as EdMenuEntry[]}
            />,
        );
        await open();
        expect(screen.getByRole('menuitem', { name: /Move to/ })).toBeInTheDocument();
    });
});
