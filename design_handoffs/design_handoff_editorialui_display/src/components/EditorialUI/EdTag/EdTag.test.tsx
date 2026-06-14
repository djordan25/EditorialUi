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
});
