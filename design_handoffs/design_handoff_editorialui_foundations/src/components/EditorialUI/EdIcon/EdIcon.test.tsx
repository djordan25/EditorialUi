import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EdIcon } from './EdIcon';

describe('EdIcon', () => {
    it('renders a known lucide icon', () => {
        const { container } = render(<EdIcon name="Search" />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('is decorative by default (aria-hidden=true, no role)', () => {
        const { container } = render(<EdIcon name="Search" />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
        expect(svg).not.toHaveAttribute('role');
    });

    it('with label is exposed to assistive tech (role=img, aria-label, no aria-hidden)', () => {
        render(<EdIcon name="AlertTriangle" label="Failed" />);
        const svg = screen.getByRole('img', { name: 'Failed' });
        expect(svg).not.toHaveAttribute('aria-hidden');
    });

    it('renders null and warns in dev for unknown icon names', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        // @ts-expect-error — intentionally invalid
        const { container } = render(<EdIcon name="DoesNotExist" />);
        expect(container.firstChild).toBeNull();
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });

    it('applies size class', () => {
        const { container } = render(<EdIcon name="Search" size="lg" />);
        const svg = container.querySelector('svg');
        expect(svg?.className.toString()).toMatch(/sizeLg/);
    });

    it('applies semantic color class', () => {
        const { container } = render(<EdIcon name="Check" color="success" />);
        const svg = container.querySelector('svg');
        expect(svg?.className.toString()).toMatch(/colorSuccess/);
    });

    it('forwards arbitrary className', () => {
        const { container } = render(<EdIcon name="Search" className="custom-class" />);
        expect(container.querySelector('svg')).toHaveClass('custom-class');
    });
});
