import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdSelect, type EdSelectOption } from './EdSelect';

const options: EdSelectOption[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

describe('EdSelect', () => {
    it('renders a combobox-role trigger tied to its label', () => {
        render(<EdSelect label="Severity" options={options} />);
        expect(screen.getByRole('combobox', { name: 'Severity' })).toBeInTheDocument();
    });

    it('shows the placeholder when empty', () => {
        render(<EdSelect label="Severity" options={options} placeholder="Select severity…" />);
        expect(screen.getByText('Select severity…')).toBeInTheDocument();
    });

    it('shows the selected label when controlled with a value', () => {
        render(<EdSelect label="Severity" options={options} defaultValue="medium" />);
        expect(screen.getByRole('combobox', { name: /Severity/ })).toHaveTextContent('Medium');
    });

    it('opens on click and shows all options', async () => {
        render(<EdSelect label="Severity" options={options} />);
        await userEvent.click(screen.getByRole('combobox'));
        const listbox = await screen.findByRole('listbox');
        expect(within(listbox).getByRole('option', { name: 'Low' })).toBeInTheDocument();
        expect(within(listbox).getByRole('option', { name: 'Medium' })).toBeInTheDocument();
        expect(within(listbox).getByRole('option', { name: 'High' })).toBeInTheDocument();
    });

    it('fires onValueChange when an option is picked', async () => {
        const onValueChange = vi.fn();
        render(<EdSelect label="Severity" options={options} onValueChange={onValueChange} />);
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(await screen.findByRole('option', { name: 'High' }));
        expect(onValueChange).toHaveBeenCalledWith('high');
    });

    it('marks the active option aria-selected', async () => {
        render(<EdSelect label="Severity" options={options} defaultValue="medium" />);
        await userEvent.click(screen.getByRole('combobox'));
        const medium = await screen.findByRole('option', { name: 'Medium' });
        expect(medium).toHaveAttribute('aria-selected', 'true');
    });

    it('renders group labels and separators', async () => {
        render(
            <EdSelect
                label="Env"
                options={[
                    {
                        kind: 'group',
                        label: 'Active',
                        items: [{ value: 'prod', label: 'Production' }],
                    },
                    { kind: 'separator' },
                    {
                        kind: 'group',
                        label: 'Archived',
                        items: [{ value: 'q3', label: '2025 Q3' }],
                    },
                ]}
            />,
        );
        await userEvent.click(screen.getByRole('combobox'));
        expect(await screen.findByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Archived')).toBeInTheDocument();
    });

    it('does not open when disabled', async () => {
        render(<EdSelect label="Severity" options={options} disabled />);
        await userEvent.click(screen.getByRole('combobox'));
        expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('sets aria-invalid + aria-describedby with the error message', () => {
        render(<EdSelect label="Severity" options={options} error="Required." />);
        const trigger = screen.getByRole('combobox');
        expect(trigger).toHaveAttribute('aria-invalid', 'true');
        const describedBy = trigger.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy!)).toHaveTextContent('Required.');
    });

    it('keyboard: arrow-down then Enter selects', async () => {
        const onValueChange = vi.fn();
        render(<EdSelect label="Severity" options={options} onValueChange={onValueChange} />);
        const trigger = screen.getByRole('combobox');
        trigger.focus();
        await userEvent.keyboard('{Enter}');
        await screen.findByRole('listbox');
        await userEvent.keyboard('{ArrowDown}{Enter}');
        expect(onValueChange).toHaveBeenCalled();
    });
});
