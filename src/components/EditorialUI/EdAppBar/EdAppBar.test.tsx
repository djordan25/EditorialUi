import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdAppBar, EdAppBarNav, EdAppBarNavItem, EdAppBarNavMenu } from './EdAppBar';

describe('EdAppBar', () => {
    it('renders the brand, version, navigation and the right-hand slot', () => {
        render(
            <EdAppBar
                brand="Cerynto"
                version="v0.51"
                nav={
                    <EdAppBarNav aria-label="Main">
                        <EdAppBarNavItem href="/models" active>Models</EdAppBarNavItem>
                        <EdAppBarNavItem href="/runs">Runs</EdAppBarNavItem>
                    </EdAppBarNav>
                }
                end={<span>all systems nominal</span>}
            />,
        );
        expect(screen.getByRole('banner')).toHaveTextContent('Cerynto');
        expect(screen.getByText('v0.51')).toBeInTheDocument();
        const nav = screen.getByRole('navigation', { name: 'Main' });
        expect(nav).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Models' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', { name: 'Runs' })).not.toHaveAttribute('aria-current');
        expect(screen.getByText('all systems nominal')).toBeInTheDocument();
    });

    it('renders a router link in place of its own anchor with asChild', () => {
        render(
            <EdAppBarNavItem asChild active>
                <a href="/x" data-router="yes">Reports</a>
            </EdAppBarNavItem>,
        );
        const link = screen.getByRole('link', { name: 'Reports' });
        expect(link).toHaveAttribute('data-router', 'yes');
        expect(link).toHaveAttribute('aria-current', 'page');
    });

    it('opens a menu from a nav item', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(
            <EdAppBarNavMenu
                label="Governance"
                items={[{ id: 'settings', label: 'Settings', onSelect }]}
            />,
        );
        await user.click(screen.getByRole('button', { name: /governance/i }));
        await user.click(await screen.findByRole('menuitem', { name: 'Settings' }));
        expect(onSelect).toHaveBeenCalled();
    });
});
