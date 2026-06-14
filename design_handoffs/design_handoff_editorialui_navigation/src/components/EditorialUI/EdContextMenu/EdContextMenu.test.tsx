import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdContextMenu } from './EdContextMenu';
import type { EdMenuEntry } from '../EdMenu';

const items: EdMenuEntry[] = [
    { id: 'open', label: 'Open finding', onSelect: () => {} },
    { kind: 'separator' },
    { id: 'delete', label: 'Delete', danger: true, ariaLabel: 'Delete finding F-2438', onSelect: () => {} },
];

const rightClick = async (el: Element) => {
    // userEvent.pointer with a secondary (right) button to open the context menu.
    await userEvent.pointer({ keys: '[MouseRight]', target: el });
};

describe('EdContextMenu', () => {
    it('renders its trigger children', () => {
        render(
            <EdContextMenu items={items}>
                <div data-testid="target">row</div>
            </EdContextMenu>,
        );
        expect(screen.getByTestId('target')).toBeInTheDocument();
    });

    it('does not show the menu until right-click', () => {
        render(
            <EdContextMenu items={items}>
                <div data-testid="target">row</div>
            </EdContextMenu>,
        );
        expect(screen.queryByRole('menu')).toBeNull();
    });

    it('opens the menu on right-click and renders items', async () => {
        render(
            <EdContextMenu items={items}>
                <div data-testid="target">row</div>
            </EdContextMenu>,
        );
        await rightClick(screen.getByTestId('target'));
        expect(await screen.findByRole('menu')).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Open finding' })).toBeInTheDocument();
    });

    it('renders the destructive item with its explicit aria-label', async () => {
        render(
            <EdContextMenu items={items}>
                <div data-testid="target">row</div>
            </EdContextMenu>,
        );
        await rightClick(screen.getByTestId('target'));
        await screen.findByRole('menu');
        expect(screen.getByRole('menuitem', { name: 'Delete finding F-2438' })).toBeInTheDocument();
    });

    it('invokes onSelect when an item is chosen', async () => {
        const onSelect = vi.fn();
        render(
            <EdContextMenu items={[{ id: 'open', label: 'Open finding', onSelect }]}>
                <div data-testid="target">row</div>
            </EdContextMenu>,
        );
        await rightClick(screen.getByTestId('target'));
        await screen.findByRole('menu');
        await userEvent.click(screen.getByRole('menuitem', { name: 'Open finding' }));
        expect(onSelect).toHaveBeenCalledOnce();
    });
});
