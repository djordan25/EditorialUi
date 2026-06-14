import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdAutocomplete, type EdAutocompleteOption } from './EdAutocomplete';

const items: EdAutocompleteOption[] = [
    { value: 'a', label: 'Stale model documentation' },
    { value: 'b', label: 'Stale documents missing update' },
    { value: 'c', label: 'Documents reference stale model' },
];

describe('EdAutocomplete', () => {
    it('renders an input with role=combobox and aria-autocomplete=both', () => {
        render(<EdAutocomplete label="Finding" options={items} />);
        const input = screen.getByRole('combobox', { name: 'Finding' });
        expect(input).toHaveAttribute('aria-autocomplete', 'both');
    });

    it('does not open until minQueryLength chars are typed', async () => {
        render(<EdAutocomplete label="Finding" options={items} minQueryLength={2} />);
        const input = screen.getByRole('combobox');
        await userEvent.type(input, 's');
        expect(screen.queryByRole('listbox')).toBeNull();
        await userEvent.type(input, 't');
        expect(await screen.findByRole('listbox')).toBeInTheDocument();
    });

    it('filters suggestions by substring and highlights matches', async () => {
        render(<EdAutocomplete label="Finding" options={items} />);
        await userEvent.type(screen.getByRole('combobox'), 'stale');
        const listbox = await screen.findByRole('listbox');
        const options = within(listbox).getAllByRole('option');
        expect(options.length).toBeGreaterThan(0);
        // Highlight markup uses the .edmenu__hi class.
        expect(listbox.querySelectorAll('.edmenu__hi').length).toBeGreaterThan(0);
    });

    it('selecting a suggestion sets the value to its label', async () => {
        const onValueChange = vi.fn();
        const onSuggestionSelect = vi.fn();
        render(
            <EdAutocomplete
                label="Finding"
                options={items}
                value=""
                onValueChange={onValueChange}
                onSuggestionSelect={onSuggestionSelect}
            />,
        );
        // Cannot test full flow without controlled value re-render; assert the callback API.
        await userEvent.type(screen.getByRole('combobox'), 'stale');
        await userEvent.click(
            within(await screen.findByRole('listbox'))
                .getAllByRole('option')[0],
        );
        expect(onSuggestionSelect).toHaveBeenCalled();
        expect(onValueChange).toHaveBeenCalledWith(items[0].label);
    });

    it('shows the Create row when allowCreate and no exact match', async () => {
        const onCreate = vi.fn();
        render(
            <EdAutocomplete
                label="Finding"
                options={items}
                allowCreate
                onCreate={onCreate}
                defaultValue=""
            />,
        );
        await userEvent.type(screen.getByRole('combobox'), 'brand new');
        await screen.findByText(/Create/);
        await userEvent.click(screen.getByText(/Create/));
        expect(onCreate).toHaveBeenCalledWith('brand new');
    });

    it('hides the Create row when an exact label match exists', async () => {
        render(
            <EdAutocomplete
                label="Finding"
                options={items}
                allowCreate
            />,
        );
        await userEvent.type(
            screen.getByRole('combobox'),
            'Stale model documentation',
        );
        await screen.findByRole('listbox');
        expect(screen.queryByText(/Create/)).toBeNull();
    });

    it('Escape closes the menu', async () => {
        render(<EdAutocomplete label="Finding" options={items} />);
        await userEvent.type(screen.getByRole('combobox'), 'sta');
        await screen.findByRole('listbox');
        await userEvent.keyboard('{Escape}');
        expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('ArrowDown + Enter selects the first option', async () => {
        const onSuggestionSelect = vi.fn();
        render(
            <EdAutocomplete
                label="Finding"
                options={items}
                onSuggestionSelect={onSuggestionSelect}
            />,
        );
        await userEvent.type(screen.getByRole('combobox'), 'sta');
        await screen.findByRole('listbox');
        await userEvent.keyboard('{ArrowDown}{Enter}');
        expect(onSuggestionSelect).toHaveBeenCalled();
    });

    it('sets aria-invalid + describes error', () => {
        render(<EdAutocomplete label="Finding" options={items} error="Title required." />);
        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        const describedBy = input.getAttribute('aria-describedby');
        expect(document.getElementById(describedBy!)).toHaveTextContent('Title required.');
    });
});
