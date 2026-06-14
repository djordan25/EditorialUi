import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdButton } from './EdButton';

describe('EdButton', () => {
    it('renders children as the label', () => {
        render(<EdButton>Save</EdButton>);
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('defaults type="button" (does not submit forms unexpectedly)', () => {
        render(<EdButton>Save</EdButton>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('honors explicit type="submit"', () => {
        render(<EdButton type="submit">Save</EdButton>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('fires onClick when clicked', async () => {
        const onClick = vi.fn();
        render(<EdButton onClick={onClick}>Save</EdButton>);
        await userEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('does not fire onClick when disabled', async () => {
        const onClick = vi.fn();
        render(<EdButton disabled onClick={onClick}>Save</EdButton>);
        await userEvent.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('sets aria-busy and disables interaction when loading', async () => {
        const onClick = vi.fn();
        render(<EdButton loading onClick={onClick}>Saving</EdButton>);
        const btn = screen.getByRole('button');
        expect(btn).toHaveAttribute('aria-busy', 'true');
        expect(btn).toBeDisabled();
        await userEvent.click(btn);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('keeps the accessible name when loading (label not stripped)', () => {
        render(<EdButton loading>Saving</EdButton>);
        expect(screen.getByRole('button', { name: 'Saving' })).toBeInTheDocument();
    });

    it('forwards ref to the underlying button', () => {
        const ref = { current: null as HTMLButtonElement | null };
        render(<EdButton ref={ref}>Save</EdButton>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('asChild slots props onto the child element', () => {
        render(
            <EdButton asChild variant="secondary">
                <a href="/foo">Go</a>
            </EdButton>,
        );
        const link = screen.getByRole('link', { name: 'Go' });
        expect(link).toHaveAttribute('href', '/foo');
    });
});
