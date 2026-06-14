import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdBreadcrumb, type EdBreadcrumbCrumb } from './EdBreadcrumb';

const crumbs: EdBreadcrumbCrumb[] = [
    { label: 'Findings', href: '/findings' },
    { label: '2026-Q1 audit', href: '/findings/q1' },
    { label: 'F-2438' },
];

describe('EdBreadcrumb', () => {
    it('renders a nav labelled "Breadcrumb"', () => {
        render(<EdBreadcrumb crumbs={crumbs} />);
        expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    });

    it('renders non-final crumbs as links', () => {
        render(<EdBreadcrumb crumbs={crumbs} />);
        expect(screen.getByRole('link', { name: 'Findings' })).toHaveAttribute('href', '/findings');
        expect(screen.getByRole('link', { name: '2026-Q1 audit' })).toHaveAttribute('href', '/findings/q1');
    });

    it('renders the final crumb as plain text with aria-current="page"', () => {
        render(<EdBreadcrumb crumbs={crumbs} />);
        expect(screen.queryByRole('link', { name: 'F-2438' })).toBeNull();
        const current = screen.getByText('F-2438');
        expect(current).toHaveAttribute('aria-current', 'page');
    });

    it('uses an ordered list', () => {
        const { container } = render(<EdBreadcrumb crumbs={crumbs} />);
        expect(container.querySelector('ol')).toBeInTheDocument();
    });

    it('collapses the middle when over maxItems', () => {
        const long: EdBreadcrumbCrumb[] = [
            { label: 'Findings', href: '#1' },
            { label: '2026-Q1', href: '#2' },
            { label: 'Credit risk', href: '#3' },
            { label: 'PD models', href: '#4' },
            { label: 'F-2438' },
        ];
        render(<EdBreadcrumb crumbs={long} maxItems={4} />);
        expect(screen.getByRole('button', { name: 'Show hidden breadcrumbs' })).toBeInTheDocument();
        // Middle crumbs hidden.
        expect(screen.queryByRole('link', { name: '2026-Q1' })).toBeNull();
        // First + last two remain.
        expect(screen.getByRole('link', { name: 'Findings' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'PD models' })).toBeInTheDocument();
    });

    it('expands hidden crumbs when the overflow button is clicked', async () => {
        const long: EdBreadcrumbCrumb[] = [
            { label: 'Findings', href: '#1' },
            { label: '2026-Q1', href: '#2' },
            { label: 'Credit risk', href: '#3' },
            { label: 'PD models', href: '#4' },
            { label: 'F-2438' },
        ];
        render(<EdBreadcrumb crumbs={long} maxItems={4} />);
        await userEvent.click(screen.getByRole('button', { name: 'Show hidden breadcrumbs' }));
        expect(screen.getByRole('link', { name: '2026-Q1' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Credit risk' })).toBeInTheDocument();
    });

    it('does not collapse when maxItems is 0', () => {
        const long: EdBreadcrumbCrumb[] = [
            { label: 'A', href: '#1' }, { label: 'B', href: '#2' },
            { label: 'C', href: '#3' }, { label: 'D', href: '#4' }, { label: 'E' },
        ];
        render(<EdBreadcrumb crumbs={long} maxItems={0} />);
        expect(screen.queryByRole('button', { name: 'Show hidden breadcrumbs' })).toBeNull();
    });

    it('fires onClick for router-style crumbs', async () => {
        const onClick = vi.fn();
        render(<EdBreadcrumb crumbs={[{ label: 'Findings', onClick }, { label: 'F-2438' }]} />);
        await userEvent.click(screen.getByText('Findings'));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('separators are aria-hidden', () => {
        const { container } = render(<EdBreadcrumb crumbs={crumbs} />);
        const hidden = container.querySelectorAll('[aria-hidden="true"]');
        expect(hidden.length).toBeGreaterThan(0);
    });
});
