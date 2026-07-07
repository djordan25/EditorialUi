import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { EdInlineSelect, type EdInlineSelectOption } from './EdInlineSelect';

interface User {
    id: string;
    name: string;
    email: string;
}
const users: EdInlineSelectOption<User>[] = [
    { value: { id: 'u1', name: 'Alice', email: 'alice@x.io' }, label: 'Alice', secondary: 'alice@x.io' },
    { value: { id: 'u2', name: 'Bob', email: 'bob@x.io' }, label: 'Bob', secondary: 'bob@x.io' },
    { value: { id: 'u3', name: 'Carol', email: 'carol@x.io' }, label: 'Carol', secondary: 'carol@x.io' },
];

function Host({
    initial = null,
    onChangeSpy,
    ...rest
}: {
    initial?: EdInlineSelectOption<User> | null;
    onChangeSpy?: (o: EdInlineSelectOption<User> | null) => void;
    renderOption?: React.ComponentProps<typeof EdInlineSelect<User>>['renderOption'];
    error?: React.ReactNode;
}) {
    const [val, setVal] = useState<EdInlineSelectOption<User> | null>(initial);
    return (
        <EdInlineSelect<User>
            label="Owner"
            options={users}
            value={val}
            onChange={(o) => {
                onChangeSpy?.(o);
                setVal(o);
            }}
            getOptionValue={(o) => o.value.id}
            {...rest}
        />
    );
}

describe('EdInlineSelect', () => {
    it('renders a constrained combobox input named by its label', () => {
        render(<Host />);
        const input = screen.getByRole('combobox', { name: 'Owner' });
        expect(input).toHaveAttribute('aria-autocomplete', 'list');
    });

    it('shows the full option list on focus (minQueryLength 0)', async () => {
        render(<Host />);
        await userEvent.click(screen.getByRole('combobox'));
        const listbox = await screen.findByRole('listbox');
        expect(within(listbox).getAllByRole('option')).toHaveLength(3);
    });

    it('filters options by the typed substring', async () => {
        render(<Host />);
        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.type(input, 'bo');
        const listbox = await screen.findByRole('listbox');
        const options = within(listbox).getAllByRole('option');
        expect(options).toHaveLength(1);
        expect(options[0]).toHaveTextContent('Bob');
    });

    it('selecting an option emits the object option and fills the field', async () => {
        const onChangeSpy = vi.fn();
        render(<Host onChangeSpy={onChangeSpy} />);
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(within(await screen.findByRole('listbox')).getByRole('option', { name: /Bob/ }));
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy.mock.calls[0][0]?.value.id).toBe('u2');
        expect(screen.getByRole('combobox')).toHaveValue('Bob');
    });

    it('clearing the field emits null', async () => {
        const onChangeSpy = vi.fn();
        render(<Host initial={users[0]} onChangeSpy={onChangeSpy} />);
        const input = screen.getByRole('combobox');
        expect(input).toHaveValue('Alice');
        await userEvent.click(input);
        await userEvent.clear(input);
        await userEvent.tab();
        expect(onChangeSpy).toHaveBeenCalledWith(null);
    });

    it('reverts uncommitted text to the selection on blur (constrained)', async () => {
        const onChangeSpy = vi.fn();
        render(<Host initial={users[0]} onChangeSpy={onChangeSpy} />);
        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await userEvent.clear(input);
        await userEvent.type(input, 'zzz');
        await userEvent.tab();
        expect(onChangeSpy).not.toHaveBeenCalled();
        expect(input).toHaveValue('Alice');
    });

    it('Escape closes the menu without changing the value', async () => {
        const onChangeSpy = vi.fn();
        render(<Host initial={users[0]} onChangeSpy={onChangeSpy} />);
        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await screen.findByRole('listbox');
        await userEvent.keyboard('{Escape}');
        expect(screen.queryByRole('listbox')).toBeNull();
        expect(onChangeSpy).not.toHaveBeenCalled();
    });

    it('ArrowDown + Enter selects the first option', async () => {
        const onChangeSpy = vi.fn();
        render(<Host onChangeSpy={onChangeSpy} />);
        await userEvent.click(screen.getByRole('combobox'));
        await screen.findByRole('listbox');
        await userEvent.keyboard('{ArrowDown}{Enter}');
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy.mock.calls[0][0]?.value.id).toBe('u1');
    });

    it('marks the committed option aria-selected', async () => {
        render(<Host initial={users[1]} />);
        await userEvent.click(screen.getByRole('combobox'));
        const listbox = await screen.findByRole('listbox');
        expect(within(listbox).getByRole('option', { name: /Bob/, selected: true })).toBeInTheDocument();
    });

    it('renders a custom option row via renderOption', async () => {
        render(<Host renderOption={(o) => <span>ROW-{o.value.name}</span>} />);
        await userEvent.click(screen.getByRole('combobox'));
        await screen.findByRole('listbox');
        expect(screen.getByText('ROW-Alice')).toBeInTheDocument();
        expect(screen.getByText('ROW-Carol')).toBeInTheDocument();
    });

    it('sets aria-invalid and wires the error message', () => {
        render(<Host error="Owner is required." />);
        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        const describedBy = input.getAttribute('aria-describedby');
        expect(document.getElementById(describedBy!)).toHaveTextContent('Owner is required.');
    });
});
