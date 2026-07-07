import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdControlLabel } from './EdControlLabel';

describe('EdControlLabel', () => {
    it('renders the label and the control', () => {
        render(<EdControlLabel label="Include superseded" control={<input type="checkbox" />} />);
        expect(screen.getByText('Include superseded')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('clicking the label text toggles the wrapped native control', async () => {
        render(<EdControlLabel label="Accept terms" control={<input type="checkbox" />} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
        await userEvent.click(screen.getByText('Accept terms'));
        expect(checkbox).toBeChecked();
    });

    it('gives the control its accessible name from the label', () => {
        render(<EdControlLabel label="Notify me" control={<input type="checkbox" />} />);
        expect(screen.getByRole('checkbox', { name: 'Notify me' })).toBeInTheDocument();
    });

    it('places the label before the control when labelPlacement="start"', () => {
        const { container } = render(
            <EdControlLabel
                labelPlacement="start"
                label="Left label"
                control={<input type="checkbox" data-testid="cb" />}
            />,
        );
        const root = container.firstElementChild as HTMLElement;
        const first = root.firstElementChild as HTMLElement;
        // label span comes before the input
        expect(first.textContent).toBe('Left label');
    });

    it('disabled dims the label and forwards disabled to the control', () => {
        const { container } = render(
            <EdControlLabel disabled label="Locked" control={<input type="checkbox" />} />,
        );
        expect(container.firstElementChild).toHaveClass('disabled');
        expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('does not un-disable a control that is independently disabled', () => {
        render(<EdControlLabel label="x" control={<input type="checkbox" disabled />} />);
        expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('does not toggle a disabled control on label click', async () => {
        const onChange = vi.fn();
        render(
            <EdControlLabel disabled label="Locked" control={<input type="checkbox" onChange={onChange} />} />,
        );
        await userEvent.click(screen.getByText('Locked'));
        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('forwards ref and passes through label attributes', () => {
        const ref = { current: null as HTMLLabelElement | null };
        render(
            <EdControlLabel
                ref={ref}
                label="x"
                control={<input type="checkbox" />}
                className="custom"
                data-testid="cl"
            />,
        );
        expect(ref.current).toBeInstanceOf(HTMLLabelElement);
        expect(screen.getByTestId('cl')).toHaveClass('custom');
    });
});
