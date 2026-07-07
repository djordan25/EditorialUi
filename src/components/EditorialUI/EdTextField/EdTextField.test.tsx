import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdTextField } from './EdTextField';

describe('EdTextField', () => {
    it('renders the label and associates it with the input', () => {
        render(<EdTextField label="Model name" />);
        const input = screen.getByLabelText('Model name');
        expect(input).toBeInTheDocument();
        expect(input.tagName).toBe('INPUT');
    });

    it('honors an externally supplied id', () => {
        render(<EdTextField label="Email" id="custom-id" />);
        const input = screen.getByLabelText('Email');
        expect(input).toHaveAttribute('id', 'custom-id');
    });

    it('sets aria-required when required', () => {
        render(<EdTextField label="Owner" required />);
        expect(screen.getByLabelText(/Owner/)).toHaveAttribute('aria-required', 'true');
    });

    it('renders hint text and links it via aria-describedby', () => {
        render(<EdTextField label="Path" hint="Where snapshots live." />);
        const input = screen.getByLabelText('Path');
        const describedBy = input.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        const hint = document.getElementById(describedBy!);
        expect(hint).toHaveTextContent('Where snapshots live.');
    });

    it('renders error, sets aria-invalid, and replaces hint', () => {
        render(
            <EdTextField
                label="Model name"
                hint="Use letters and dashes."
                error="Invalid characters."
            />,
        );
        const input = screen.getByLabelText('Model name');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByText('Invalid characters.')).toBeInTheDocument();
        expect(screen.queryByText('Use letters and dashes.')).not.toBeInTheDocument();
    });

    it('error message gets role="alert"', () => {
        render(<EdTextField label="Name" error="Oops" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Oops');
    });

    it('does not set aria-invalid when there is no error', () => {
        render(<EdTextField label="Name" />);
        expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid');
    });

    it('accepts user input and fires onChange', async () => {
        const onChange = vi.fn();
        render(<EdTextField label="Name" onChange={onChange} />);
        await userEvent.type(screen.getByLabelText('Name'), 'PD');
        expect(onChange).toHaveBeenCalled();
        expect(screen.getByLabelText('Name')).toHaveValue('PD');
    });

    it('does not fire onChange when disabled', async () => {
        const onChange = vi.fn();
        render(<EdTextField label="Name" disabled onChange={onChange} />);
        await userEvent.type(screen.getByLabelText('Name'), 'x');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('forwards ref to the underlying input', () => {
        const ref = { current: null as HTMLInputElement | null };
        render(<EdTextField label="Name" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('keeps the label accessible when visuallyHidden', () => {
        render(<EdTextField label="Search" visuallyHidden />);
        expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });

    it('renders prefix and suffix adornments', () => {
        render(
            <EdTextField
                label="Threshold"
                prefix={<span data-testid="pfx">$</span>}
                suffix={<span data-testid="sfx">bps</span>}
            />,
        );
        expect(screen.getByTestId('pfx')).toBeInTheDocument();
        expect(screen.getByTestId('sfx')).toBeInTheDocument();
    });

    it('renders a textarea when multiline', () => {
        render(<EdTextField label="Notes" multiline />);
        const field = screen.getByLabelText('Notes');
        expect(field.tagName).toBe('TEXTAREA');
    });

    it('applies minRows to the textarea', () => {
        render(<EdTextField label="Notes" multiline minRows={5} />);
        expect(screen.getByLabelText('Notes')).toHaveAttribute('rows', '5');
    });

    it('forwards ref to the textarea when multiline', () => {
        const ref = { current: null as HTMLTextAreaElement | null };
        render(<EdTextField label="Notes" multiline ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('multiline accepts input and keeps the shared label/error wiring', async () => {
        const onChange = vi.fn();
        render(<EdTextField label="Notes" multiline onChange={onChange} error="Required." />);
        const field = screen.getByLabelText('Notes');
        expect(field).toHaveAttribute('aria-invalid', 'true');
        const describedBy = field.getAttribute('aria-describedby');
        expect(document.getElementById(describedBy!)).toHaveTextContent('Required.');
        await userEvent.type(field, 'hi');
        expect(onChange).toHaveBeenCalled();
        expect(field).toHaveValue('hi');
    });
});
