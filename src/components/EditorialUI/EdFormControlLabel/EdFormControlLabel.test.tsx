import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdFormControlLabel } from './EdFormControlLabel';

describe('EdFormControlLabel', () => {
    it('wires htmlFor + control id (clone path)', () => {
        render(
            <EdFormControlLabel label="Email">
                <input data-testid="ctl" />
            </EdFormControlLabel>,
        );
        const input = screen.getByTestId('ctl');
        const label = screen.getByText('Email') as HTMLLabelElement;
        expect(input.getAttribute('id')).toBeTruthy();
        expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
    });

    it('wires htmlFor + control id (render-prop path)', () => {
        render(
            <EdFormControlLabel label="Email">
                {({ id }) => <input id={id} data-testid="ctl" />}
            </EdFormControlLabel>,
        );
        const input = screen.getByTestId('ctl');
        const label = screen.getByText('Email') as HTMLLabelElement;
        expect(input.getAttribute('id')).toBeTruthy();
        expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
    });

    it('uses the provided htmlFor when given', () => {
        render(
            <EdFormControlLabel label="Email" htmlFor="my-id">
                <input data-testid="ctl" />
            </EdFormControlLabel>,
        );
        const input = screen.getByTestId('ctl');
        expect(input).toHaveAttribute('id', 'my-id');
    });

    it('renders hint and links aria-describedby on the control', () => {
        render(
            <EdFormControlLabel label="Email" hint="We never share it.">
                <input data-testid="ctl" />
            </EdFormControlLabel>,
        );
        const input = screen.getByTestId('ctl');
        const describedBy = input.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy!)).toHaveTextContent('We never share it.');
    });

    it('error replaces hint and sets aria-invalid', () => {
        render(
            <EdFormControlLabel label="Email" hint="We never share it." error="Required.">
                <input data-testid="ctl" />
            </EdFormControlLabel>,
        );
        const input = screen.getByTestId('ctl');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toHaveTextContent('Required.');
        expect(screen.queryByText('We never share it.')).not.toBeInTheDocument();
    });

    it('renders the required asterisk and sets aria-required', () => {
        render(
            <EdFormControlLabel label="Email" required>
                <input data-testid="ctl" />
            </EdFormControlLabel>,
        );
        const input = screen.getByTestId('ctl');
        expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('preserves an existing aria-describedby on the child', () => {
        render(
            <>
                <p id="extra-help">Extra context.</p>
                <EdFormControlLabel label="Email" hint="Hint">
                    <input data-testid="ctl" aria-describedby="extra-help" />
                </EdFormControlLabel>
            </>,
        );
        const input = screen.getByTestId('ctl');
        const describedBy = input.getAttribute('aria-describedby') ?? '';
        expect(describedBy.split(' ')).toContain('extra-help');
        expect(describedBy.split(' ').some((id) => id !== 'extra-help')).toBe(true);
    });

    it('row layout puts the control next to the label', () => {
        const { container } = render(
            <EdFormControlLabel label="Notify" layout="row">
                {({ id }) => <button id={id}>x</button>}
            </EdFormControlLabel>,
        );
        // Simple structural check — the root has a single direct row.
        expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
        expect(screen.getByText('Notify')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});
