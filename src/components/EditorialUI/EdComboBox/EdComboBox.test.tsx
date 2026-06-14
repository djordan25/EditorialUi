import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdComboBox, type EdComboBoxOption } from './EdComboBox';

const owners: EdComboBoxOption[] = [
    { value: 'hl', label: 'Hanna Lindqvist' },
    { value: 'mc', label: 'Marcus Chen' },
    { value: 'my', label: 'Margaret Yu' },
];

const openMenu = async () => {
    await userEvent.click(screen.getByRole('combobox', { name: /Owner/ }));
    return screen.findByRole('listbox');
};

describe('EdComboBox · single', () => {
    it('renders the trigger with role=combobox', () => {
        render(<EdComboBox label="Owner" options={owners} />);
        expect(screen.getByRole('combobox', { name: 'Owner' })).toBeInTheDocument();
    });

    it('shows the placeholder when no value', () => {
        render(<EdComboBox label="Owner" options={owners} placeholder="Pick…" />);
        expect(screen.getByText('Pick…')).toBeInTheDocument();
    });

    it('opens on click and renders all options', async () => {
        render(<EdComboBox label="Owner" options={owners} />);
        const listbox = await openMenu();
        owners.forEach((o) => {
            expect(within(listbox).getByRole('option', { name: o.label })).toBeInTheDocument();
        });
    });

    it('filters options by the search query', async () => {
        render(<EdComboBox label="Owner" options={owners} />);
        await openMenu();
        await userEvent.type(screen.getByPlaceholderText('Search…'), 'ma');
        const listbox = screen.getByRole('listbox');
        expect(within(listbox).queryByRole('option', { name: 'Hanna Lindqvist' })).toBeNull();
        expect(within(listbox).getByRole('option', { name: 'Marcus Chen' })).toBeInTheDocument();
        expect(within(listbox).getByRole('option', { name: 'Margaret Yu' })).toBeInTheDocument();
    });

    it('selects via click and closes the menu', async () => {
        const onValueChange = vi.fn();
        render(<EdComboBox label="Owner" options={owners} onValueChange={onValueChange} />);
        await openMenu();
        await userEvent.click(screen.getByRole('option', { name: 'Marcus Chen' }));
        expect(onValueChange).toHaveBeenCalledWith('mc');
        expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('selects with ArrowDown + Enter', async () => {
        const onValueChange = vi.fn();
        render(<EdComboBox label="Owner" options={owners} onValueChange={onValueChange} />);
        await openMenu();
        const search = screen.getByPlaceholderText('Search…');
        search.focus();
        await userEvent.keyboard('{ArrowDown}{Enter}');
        expect(onValueChange).toHaveBeenCalled();
    });

    it('Escape closes the menu without selecting', async () => {
        const onValueChange = vi.fn();
        render(<EdComboBox label="Owner" options={owners} onValueChange={onValueChange} />);
        await openMenu();
        await userEvent.keyboard('{Escape}');
        expect(screen.queryByRole('listbox')).toBeNull();
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('renders the empty state with the query string', async () => {
        render(<EdComboBox label="Owner" options={owners} />);
        await openMenu();
        await userEvent.type(screen.getByPlaceholderText('Search…'), 'zzz');
        expect(screen.getByText(/No results for "zzz"/)).toBeInTheDocument();
    });

    it('marks the active option aria-selected', async () => {
        render(<EdComboBox label="Owner" options={owners} defaultValue="mc" />);
        await openMenu();
        const selected = screen.getByRole('option', { name: 'Marcus Chen' });
        expect(selected).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-invalid on error', () => {
        render(<EdComboBox label="Owner" options={owners} error="Required." />);
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not open when disabled', async () => {
        render(<EdComboBox label="Owner" options={owners} disabled />);
        await userEvent.click(screen.getByRole('combobox'));
        expect(screen.queryByRole('listbox')).toBeNull();
    });
});

describe('EdComboBox · multi', () => {
    it('aria-multiselectable on the listbox', async () => {
        render(<EdComboBox multiple label="Owner" options={owners} />);
        const listbox = await openMenu();
        expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('toggling does not close the menu', async () => {
        const onValuesChange = vi.fn();
        render(
            <EdComboBox multiple label="Owner" options={owners} onValuesChange={onValuesChange} />,
        );
        await openMenu();
        await userEvent.click(screen.getByRole('option', { name: 'Marcus Chen' }));
        expect(onValuesChange).toHaveBeenCalledWith(['mc']);
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('renders selected values as tags inside the trigger', () => {
        render(
            <EdComboBox multiple label="Owner" options={owners} defaultValues={['hl', 'mc']} />,
        );
        const trigger = screen.getByRole('combobox');
        expect(within(trigger).getByText('Hanna Lindqvist')).toBeInTheDocument();
        expect(within(trigger).getByText('Marcus Chen')).toBeInTheDocument();
    });

    it('removes a tag via its remove button', async () => {
        const onValuesChange = vi.fn();
        render(
            <EdComboBox
                multiple
                label="Owner"
                options={owners}
                defaultValues={['hl', 'mc']}
                onValuesChange={onValuesChange}
            />,
        );
        await userEvent.click(screen.getByRole('button', { name: 'Remove Marcus Chen' }));
        expect(onValuesChange).toHaveBeenCalledWith(['hl']);
    });
});
