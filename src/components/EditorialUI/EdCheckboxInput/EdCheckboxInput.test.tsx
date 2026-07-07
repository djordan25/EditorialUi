import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdCheckboxInput } from './EdCheckboxInput';

describe('EdCheckboxInput', () => {
    it('renders a bare native checkbox input with no wrapping label', () => {
        const { container } = render(<EdCheckboxInput aria-label="Include superseded" />);
        const cb = screen.getByRole('checkbox', { name: 'Include superseded' });
        expect(cb.tagName).toBe('INPUT');
        expect(cb).toHaveAttribute('type', 'checkbox');
        expect(container.querySelector('label')).toBeNull();
    });

    it('emits a real ChangeEvent exposing target.checked', async () => {
        const onChange = vi.fn();
        render(<EdCheckboxInput aria-label="x" onChange={onChange} />);
        await userEvent.click(screen.getByRole('checkbox'));
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target.checked).toBe(true);
    });

    it('toggles when uncontrolled', async () => {
        render(<EdCheckboxInput aria-label="x" defaultChecked={false} />);
        const cb = screen.getByRole('checkbox');
        expect(cb).not.toBeChecked();
        await userEvent.click(cb);
        expect(cb).toBeChecked();
    });

    it('honors a controlled checked value', async () => {
        const onChange = vi.fn();
        const { rerender } = render(<EdCheckboxInput aria-label="x" checked={false} onChange={onChange} />);
        const cb = screen.getByRole('checkbox');
        expect(cb).not.toBeChecked();
        await userEvent.click(cb);
        expect(onChange).toHaveBeenCalled();
        expect(cb).not.toBeChecked(); // stays until the parent updates
        rerender(<EdCheckboxInput aria-label="x" checked onChange={onChange} />);
        expect(cb).toBeChecked();
    });

    it('reflects indeterminate on the DOM node', () => {
        render(<EdCheckboxInput aria-label="x" indeterminate />);
        expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true);
    });

    it('readOnly prevents toggling but stays focusable + announced', async () => {
        const onChange = vi.fn();
        render(<EdCheckboxInput aria-label="x" readOnly defaultChecked onChange={onChange} />);
        const cb = screen.getByRole('checkbox');
        expect(cb).toHaveAttribute('aria-readonly', 'true');
        await userEvent.click(cb);
        expect(onChange).not.toHaveBeenCalled();
        expect(cb).toBeChecked(); // unchanged
    });

    it('disabled prevents onChange', async () => {
        const onChange = vi.fn();
        render(<EdCheckboxInput aria-label="x" disabled onChange={onChange} />);
        await userEvent.click(screen.getByRole('checkbox'));
        expect(onChange).not.toHaveBeenCalled();
    });

    it('gets an accessible name from an external label via id/htmlFor', () => {
        render(
            <div>
                <label htmlFor="cb-1">Accept terms</label>
                <EdCheckboxInput id="cb-1" />
            </div>,
        );
        expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
    });

    it('applies the compact size class', () => {
        render(<EdCheckboxInput aria-label="x" size="sm" />);
        expect(screen.getByRole('checkbox')).toHaveClass('sm');
    });

    it('forwards ref to the input', () => {
        const ref = { current: null as HTMLInputElement | null };
        render(<EdCheckboxInput aria-label="x" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
});
