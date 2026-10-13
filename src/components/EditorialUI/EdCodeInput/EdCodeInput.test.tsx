import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdCodeInput } from './EdCodeInput';

const boxes = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('[aria-hidden="true"]')).map((b) => b.textContent);

describe('EdCodeInput', () => {
    it('is ONE labelled input, set up for one-time-code autofill', () => {
        const { container } = render(<EdCodeInput label="Authentication code" />);
        const input = screen.getByRole('textbox', { name: 'Authentication code' });
        expect(container.querySelectorAll('input')).toHaveLength(1);
        expect(input).toHaveAttribute('autocomplete', 'one-time-code');
        expect(input).toHaveAttribute('inputmode', 'numeric');
        expect(input).not.toHaveAttribute('maxlength');
    });

    it('draws one box per digit, `length` boxes in all', () => {
        const { container } = render(<EdCodeInput label="Code" length={4} defaultValue="12" />);
        expect(boxes(container)).toEqual(['1', '2', '', '']);
    });

    it('fills the boxes as you type and reports digits only', async () => {
        const onChange = vi.fn();
        const { container } = render(<EdCodeInput label="Code" onChange={onChange} />);
        await userEvent.type(screen.getByRole('textbox'), '4a2-0');
        expect(onChange).toHaveBeenLastCalledWith('420');
        expect(boxes(container)).toEqual(['4', '2', '0', '', '', '']);
    });

    it('stops at `length` digits', async () => {
        const onChange = vi.fn();
        render(<EdCodeInput label="Code" onChange={onChange} />);
        await userEvent.type(screen.getByRole('textbox'), '12345678');
        expect(onChange).toHaveBeenLastCalledWith('123456');
        expect(screen.getByRole('textbox')).toHaveValue('123456');
    });

    it('calls onComplete once, when the last digit arrives', async () => {
        const onComplete = vi.fn();
        render(<EdCodeInput label="Code" onComplete={onComplete} />);
        await userEvent.type(screen.getByRole('textbox'), '1234567');
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith('123456');
    });

    it('a pasted full code replaces a part-filled value, formatting stripped', () => {
        const onComplete = vi.fn();
        render(<EdCodeInput label="Code" defaultValue="99" onComplete={onComplete} />);
        const input = screen.getByRole('textbox');
        fireEvent.paste(input, { clipboardData: { getData: () => '123 456' } });
        expect(input).toHaveValue('123456');
        expect(onComplete).toHaveBeenCalledWith('123456');
    });

    it('moves the caret to the end on focus, so typing appends', () => {
        render(<EdCodeInput label="Code" defaultValue="12" />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        input.setSelectionRange(0, 0);
        fireEvent.focus(input);
        expect(input.selectionStart).toBe(2);
    });

    it('Backspace removes the last digit', async () => {
        render(<EdCodeInput label="Code" defaultValue="123" />);
        const input = screen.getByRole('textbox');
        await userEvent.click(input);
        await userEvent.keyboard('{Backspace}');
        expect(input).toHaveValue('12');
    });

    it('shows a controlled value and does not change until the parent does', async () => {
        const onChange = vi.fn();
        const { rerender, container } = render(<EdCodeInput label="Code" value="12" onChange={onChange} />);
        await userEvent.type(screen.getByRole('textbox'), '3');
        expect(onChange).toHaveBeenCalledWith('123');
        expect(boxes(container).slice(0, 3)).toEqual(['1', '2', '']);
        rerender(<EdCodeInput label="Code" value="123" onChange={onChange} />);
        expect(boxes(container).slice(0, 3)).toEqual(['1', '2', '3']);
    });

    it('works as a controlled field driven by state', async () => {
        function Harness() {
            const [code, setCode] = useState('');
            return <EdCodeInput label="Code" value={code} onChange={setCode} />;
        }
        render(<Harness />);
        await userEvent.type(screen.getByRole('textbox'), '987654');
        expect(screen.getByRole('textbox')).toHaveValue('987654');
    });

    it('marks the box where the next digit goes while focused', async () => {
        const { container } = render(<EdCodeInput label="Code" defaultValue="12" />);
        expect(container.querySelector('[data-active]')).toBeNull();
        await userEvent.click(screen.getByRole('textbox'));
        const all = Array.from(container.querySelectorAll('[aria-hidden="true"]'));
        expect(all.findIndex((b) => b.hasAttribute('data-active'))).toBe(2);
    });

    it('wires the error: aria-invalid, described-by, alert', () => {
        render(<EdCodeInput label="Code" error="That code didn't match." hint="ignored" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAccessibleDescription("That code didn't match.");
        expect(screen.getByRole('alert')).toHaveTextContent("That code didn't match.");
    });

    it('describes the field with the hint when there is no error', () => {
        render(<EdCodeInput label="Code" hint="Codes refresh every 30 seconds." />);
        expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Codes refresh every 30 seconds.');
    });

    it('keeps a visually hidden label accessible', () => {
        render(<EdCodeInput label="Authentication code" visuallyHidden />);
        expect(screen.getByRole('textbox', { name: 'Authentication code' })).toBeInTheDocument();
    });

    it('disables the input', async () => {
        const onChange = vi.fn();
        render(<EdCodeInput label="Code" disabled onChange={onChange} />);
        await userEvent.type(screen.getByRole('textbox'), '1');
        expect(screen.getByRole('textbox')).toBeDisabled();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('forwards its ref to the input and passes other attributes through', () => {
        const ref = createRef<HTMLInputElement>();
        render(<EdCodeInput label="Code" ref={ref} name="totp" data-testid="otp" />);
        expect(ref.current).toBe(screen.getByTestId('otp'));
        expect(ref.current).toHaveAttribute('name', 'totp');
    });
});

describe('EdCodeInput caller description', () => {
    it('keeps the error linked when the caller links its own description', () => {
        render(<EdCodeInput label="Code" error="Wrong code." aria-describedby="why" />);
        const ids = screen.getByLabelText('Code').getAttribute('aria-describedby')?.split(' ');
        expect(ids).toHaveLength(2);
        expect(document.getElementById(ids![0])).toHaveTextContent('Wrong code.');
        expect(ids![1]).toBe('why');
    });
});
