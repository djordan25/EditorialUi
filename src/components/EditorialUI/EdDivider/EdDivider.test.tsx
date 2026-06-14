import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdDivider } from './EdDivider';

describe('EdDivider', () => {
    it('renders a semantic <hr> by default', () => {
        const { container } = render(<EdDivider />);
        expect(container.firstChild?.nodeName).toBe('HR');
    });

    it('has role="separator" implicitly via <hr>', () => {
        render(<EdDivider />);
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('decorative horizontal renders a div with aria-hidden', () => {
        const { container } = render(<EdDivider decorative />);
        const el = container.firstChild as HTMLElement;
        expect(el.nodeName).toBe('DIV');
        expect(el).toHaveAttribute('aria-hidden', 'true');
    });

    it('vertical renders a div with aria-orientation="vertical"', () => {
        render(<EdDivider orientation="vertical" />);
        const el = screen.getByRole('separator');
        expect(el.nodeName).toBe('DIV');
        expect(el).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('vertical + decorative omits the separator role and adds aria-hidden', () => {
        const { container } = render(<EdDivider orientation="vertical" decorative />);
        const el = container.firstChild as HTMLElement;
        expect(el).toHaveAttribute('aria-hidden', 'true');
        expect(el).not.toHaveAttribute('role');
    });

    it('labeled variant renders the label text', () => {
        render(<EdDivider label="2026 — Q1" />);
        expect(screen.getByText('2026 — Q1')).toBeInTheDocument();
        expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('forwards className', () => {
        const { container } = render(<EdDivider className="custom" />);
        expect((container.firstChild as HTMLElement).className).toContain('custom');
    });
});
