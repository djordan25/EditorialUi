import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdTag } from './EdTag';

describe('EdTag', () => {
    it('renders children as the label', () => {
        render(<EdTag>credit-risk</EdTag>);
        expect(screen.getByText('credit-risk')).toBeInTheDocument();
    });

    it('renders as a <span> by default (non-interactive)', () => {
        const { container } = render(<EdTag>x</EdTag>);
        expect(container.firstChild?.nodeName).toBe('SPAN');
    });

    it('does not render a button without onRemove', () => {
        render(<EdTag>x</EdTag>);
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('renders a remove button with default "Remove {label}" aria-label', () => {
        const onRemove = vi.fn();
        render(<EdTag onRemove={onRemove}>retail</EdTag>);
        expect(screen.getByRole('button', { name: 'Remove retail' })).toBeInTheDocument();
    });

    it('honors a custom removeLabel', () => {
        const onRemove = vi.fn();
        render(<EdTag onRemove={onRemove} removeLabel="Detach tag">retail</EdTag>);
        expect(screen.getByRole('button', { name: 'Detach tag' })).toBeInTheDocument();
    });

    it('falls back to "Remove" when children is non-string', () => {
        const onRemove = vi.fn();
        render(<EdTag onRemove={onRemove}><strong>retail</strong></EdTag>);
        expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    });

    it('fires onRemove when the close button is clicked', async () => {
        const onRemove = vi.fn();
        render(<EdTag onRemove={onRemove}>retail</EdTag>);
        await userEvent.click(screen.getByRole('button'));
        expect(onRemove).toHaveBeenCalledOnce();
    });

    it('fills the chip with an arbitrary color', () => {
        const { container } = render(<EdTag color="#6D28D9">Wholesale</EdTag>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.style.background).not.toBe('');
        expect(root).not.toHaveClass('toneNeutral');
    });

    it('derives dark text on a light custom color and light text on a dark one', () => {
        const light = render(<EdTag color="#ffffff">x</EdTag>);
        expect((light.container.firstElementChild as HTMLElement).style.color).toContain('text-primary');
        const dark = render(<EdTag color="#000000">y</EdTag>);
        expect((dark.container.firstElementChild as HTMLElement).style.color).toContain('text-on-solid');
    });

    it('honors an explicit textColor over the derived one', () => {
        const { container } = render(<EdTag color="#334155" textColor="#abcdef">x</EdTag>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.style.color).not.toContain('var(');
        expect(root.style.color).not.toBe('');
    });

    it('renders a color dot in dot mode (chip not filled)', () => {
        const { container } = render(<EdTag dot color="#16A34A">active</EdTag>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.querySelector('.dot')).not.toBeNull();
        expect(root).toHaveClass('toneNeutral'); // dot mode keeps the tone surface
        expect(root.style.background).toBe(''); // not filled
        expect(screen.getByText('active')).toBeInTheDocument();
    });

    it('supports a text-less swatch (dot, no children) named by aria-label', () => {
        const { container } = render(<EdTag dot color="#DC2626" aria-label="Retail" />);
        const root = container.firstElementChild as HTMLElement;
        expect(root).toHaveAttribute('aria-label', 'Retail');
        expect(root.querySelector('.dot')).not.toBeNull();
        expect(root.querySelector('.label')).toBeNull();
    });

    it('applies the size scale', () => {
        const { container: sm } = render(<EdTag size="sm">x</EdTag>);
        expect(sm.firstElementChild).toHaveClass('sm');
        const { container: lg } = render(<EdTag size="lg">y</EdTag>);
        expect(lg.firstElementChild).toHaveClass('lg');
    });
});
