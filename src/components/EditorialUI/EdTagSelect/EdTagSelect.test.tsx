import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdTagSelect, type EdTagOption } from './EdTagSelect';

const options: EdTagOption[] = [
    { value: 'pra', label: 'PRA SS3/21' },
    { value: 'ccar', label: 'CCAR 2025' },
    { value: 'ifrs9', label: 'IFRS 9' },
];

describe('EdTagSelect', () => {
    it('renders a combobox input tied to its label', () => {
        render(<EdTagSelect label="Scope" options={options} />);
        expect(screen.getByRole('combobox', { name: 'Scope' })).toBeInTheDocument();
    });

    it('renders selected values as tags', () => {
        render(<EdTagSelect label="Scope" options={options} defaultValues={['pra', 'ccar']} />);
        expect(screen.getByText('PRA SS3/21')).toBeInTheDocument();
        expect(screen.getByText('CCAR 2025')).toBeInTheDocument();
    });

    it('opens the menu and lists unselected options', async () => {
        render(<EdTagSelect label="Scope" options={options} defaultValues={['pra']} />);
        await userEvent.click(screen.getByRole('combobox'));
        const listbox = await screen.findByRole('listbox');
        expect(within(listbox).getByRole('option', { name: 'CCAR 2025' })).toBeInTheDocument();
        // Already-selected option is not offered.
        expect(within(listbox).queryByRole('option', { name: 'PRA SS3/21' })).toBeNull();
    });

    it('adds a value on option click', async () => {
        const onValuesChange = vi.fn();
        render(<EdTagSelect label="Scope" options={options} values={[]} onValuesChange={onValuesChange} />);
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(await screen.findByRole('option', { name: 'IFRS 9' }));
        expect(onValuesChange).toHaveBeenCalledWith(['ifrs9']);
    });

    it('filters options by the typed query', async () => {
        render(<EdTagSelect label="Scope" options={options} />);
        await userEvent.type(screen.getByRole('combobox'), 'ccar');
        const listbox = await screen.findByRole('listbox');
        expect(within(listbox).getByRole('option', { name: 'CCAR 2025' })).toBeInTheDocument();
        expect(within(listbox).queryByRole('option', { name: 'PRA SS3/21' })).toBeNull();
    });

    it('removes a tag via its remove button', async () => {
        const onValuesChange = vi.fn();
        render(<EdTagSelect label="Scope" options={options} values={['pra', 'ccar']} onValuesChange={onValuesChange} />);
        await userEvent.click(screen.getByRole('button', { name: 'Remove CCAR 2025' }));
        expect(onValuesChange).toHaveBeenCalledWith(['pra']);
    });

    it('Backspace on empty input removes the last tag', async () => {
        const onValuesChange = vi.fn();
        render(<EdTagSelect label="Scope" options={options} values={['pra', 'ccar']} onValuesChange={onValuesChange} />);
        const input = screen.getByRole('combobox');
        input.focus();
        await userEvent.keyboard('{Backspace}');
        expect(onValuesChange).toHaveBeenCalledWith(['pra']);
    });

    it('does not offer a create row unless allowCreate is set', async () => {
        render(<EdTagSelect label="Scope" options={options} />);
        await userEvent.type(screen.getByRole('combobox'), 'Novel reg');
        // A no-match query (with allowCreate off) renders the empty state, not a
        // listbox — wait on that, then assert there's no Create row.
        await screen.findByText(/No matches/i);
        expect(screen.queryByText(/Create/)).toBeNull();
    });

    it('offers and commits a create row when allowCreate is set', async () => {
        const onValuesChange = vi.fn();
        render(<EdTagSelect label="Scope" options={options} values={[]} onValuesChange={onValuesChange} allowCreate />);
        await userEvent.type(screen.getByRole('combobox'), 'Novel reg');
        await userEvent.click(await screen.findByText(/Create/));
        expect(onValuesChange).toHaveBeenCalledWith(['Novel reg']);
    });

    it('sets aria-invalid on error', () => {
        render(<EdTagSelect label="Scope" options={options} error="Required." />);
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not render remove buttons when disabled', () => {
        render(<EdTagSelect label="Scope" options={options} defaultValues={['pra']} disabled />);
        expect(screen.queryByRole('button', { name: /Remove/ })).toBeNull();
    });
});
