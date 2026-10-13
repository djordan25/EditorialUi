import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdFilterChipRow, type EdFilterChip } from './EdFilterChipRow';

const chips: EdFilterChip[] = [
    { value: 'all', label: 'All', count: 312 },
    { value: 'open', label: 'Open', count: 87 },
    { value: 'closed', label: 'Closed', count: 211 },
];

describe('EdFilterChipRow', () => {
    it('multi mode renders a group of checkbox chips', () => {
        render(<EdFilterChipRow ariaLabel="Filters" selected={[]} onSelectedChange={() => {}} chips={chips} />);
        expect(screen.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
        expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    });

    it('single mode renders a radiogroup', () => {
        render(<EdFilterChipRow ariaLabel="Scope" mode="single" selected={['all']} onSelectedChange={() => {}} chips={chips} />);
        expect(screen.getByRole('radiogroup', { name: 'Scope' })).toBeInTheDocument();
        expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('folds the count into the accessible name', () => {
        render(<EdFilterChipRow ariaLabel="Filters" selected={[]} onSelectedChange={() => {}} chips={chips} />);
        expect(screen.getByRole('checkbox', { name: 'Open, 87 items' })).toBeInTheDocument();
    });

    it('reflects selected via aria-checked', () => {
        render(<EdFilterChipRow ariaLabel="Filters" selected={['open']} onSelectedChange={() => {}} chips={chips} />);
        expect(screen.getByRole('checkbox', { name: 'Open, 87 items' })).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('checkbox', { name: 'All, 312 items' })).toHaveAttribute('aria-checked', 'false');
    });

    it('multi: toggling adds and removes from the selection', async () => {
        const onSelectedChange = vi.fn();
        const { rerender } = render(
            <EdFilterChipRow ariaLabel="Filters" selected={[]} onSelectedChange={onSelectedChange} chips={chips} />,
        );
        await userEvent.click(screen.getByRole('checkbox', { name: 'Open, 87 items' }));
        expect(onSelectedChange).toHaveBeenCalledWith(['open']);

        rerender(<EdFilterChipRow ariaLabel="Filters" selected={['open']} onSelectedChange={onSelectedChange} chips={chips} />);
        await userEvent.click(screen.getByRole('checkbox', { name: 'Open, 87 items' }));
        expect(onSelectedChange).toHaveBeenCalledWith([]);
    });

    it('single: selecting replaces the selection', async () => {
        const onSelectedChange = vi.fn();
        render(<EdFilterChipRow ariaLabel="Scope" mode="single" selected={['all']} onSelectedChange={onSelectedChange} chips={chips} />);
        await userEvent.click(screen.getByRole('radio', { name: 'Open, 87 items' }));
        expect(onSelectedChange).toHaveBeenCalledWith(['open']);
    });

    it('does not toggle a disabled chip', async () => {
        const onSelectedChange = vi.fn();
        render(
            <EdFilterChipRow
                ariaLabel="Filters"
                selected={[]}
                onSelectedChange={onSelectedChange}
                chips={[{ value: 'x', label: 'Archived', disabled: true }]}
            />,
        );
        await userEvent.click(screen.getByRole('checkbox', { name: 'Archived' }));
        expect(onSelectedChange).not.toHaveBeenCalled();
    });

    it('renders grouped chips with a divider', () => {
        render(
            <EdFilterChipRow
                ariaLabel="Filters"
                selected={[]}
                onSelectedChange={() => {}}
                groups={[
                    { chips: [{ value: 'all', label: 'All' }] },
                    { divider: true, chips: [{ value: 'high', label: 'High severity' }] },
                ]}
            />,
        );
        expect(screen.getByRole('checkbox', { name: 'All' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'High severity' })).toBeInTheDocument();
    });

    it('renders an overflow control', () => {
        render(
            <EdFilterChipRow
                ariaLabel="Filters"
                selected={[]}
                onSelectedChange={() => {}}
                chips={chips}
                overflow={<button>+ 4 more</button>}
            />,
        );
        expect(screen.getByRole('button', { name: '+ 4 more' })).toBeInTheDocument();
    });

    it('speaks a count of one as "1 item"', () => {
        render(
            <EdFilterChipRow ariaLabel="Filters" selected={[]} onSelectedChange={() => {}} chips={[{ value: 'a', label: 'Open', count: 1 }]} />,
        );
        expect(screen.getByRole('checkbox', { name: 'Open, 1 item' })).toBeInTheDocument();
    });

    it('lets the caller name the counted thing', () => {
        render(
            <EdFilterChipRow
                ariaLabel="Scope"
                mode="single"
                selected={['all']}
                onSelectedChange={() => {}}
                chips={chips}
                countLabel={(n) => `${n} models`}
            />,
        );
        expect(screen.getByRole('radio', { name: 'All, 312 models' })).toBeInTheDocument();
    });

    it('multi: every chip is its own tab stop and arrows do not select', async () => {
        const user = userEvent.setup();
        const onSelectedChange = vi.fn();
        render(<EdFilterChipRow ariaLabel="Filters" selected={[]} onSelectedChange={onSelectedChange} chips={chips} />);
        await user.tab();
        expect(screen.getByRole('checkbox', { name: 'All, 312 items' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('checkbox', { name: 'Open, 87 items' })).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(onSelectedChange).not.toHaveBeenCalled();
    });
});

describe('EdFilterChipRow single-select keyboard (radio group pattern)', () => {
    /** Controlled like a real caller: the selection follows onSelectedChange. */
    function Scope({ items = chips, initial = ['open'] }: { items?: EdFilterChip[]; initial?: string[] }) {
        const [selected, setSelected] = useState(initial);
        return (
            <>
                <button type="button">before</button>
                <EdFilterChipRow ariaLabel="Scope" mode="single" selected={selected} onSelectedChange={setSelected} chips={items} />
                <button type="button">after</button>
            </>
        );
    }
    const radio = (name: string) => screen.getByRole('radio', { name: new RegExp(`^${name}`) });

    it('has one tab stop: the checked chip', async () => {
        const user = userEvent.setup();
        render(<Scope />);
        expect(radio('All')).toHaveAttribute('tabindex', '-1');
        expect(radio('Open')).toHaveAttribute('tabindex', '0');
        expect(radio('Closed')).toHaveAttribute('tabindex', '-1');

        await user.click(screen.getByRole('button', { name: 'before' }));
        await user.tab();
        expect(radio('Open')).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
        await user.tab({ shift: true });
        expect(radio('Open')).toHaveFocus();
    });

    it('puts the tab stop on the first enabled chip when none is checked', () => {
        render(<Scope initial={[]} items={[{ value: 'x', label: 'Archived', disabled: true }, ...chips]} />);
        expect(radio('All')).toHaveAttribute('tabindex', '0');
        expect(radio('Archived')).toHaveAttribute('tabindex', '-1');
    });

    it('arrow keys move focus and select, wrapping at the ends', async () => {
        const user = userEvent.setup();
        render(<Scope />);
        await user.click(radio('Open'));

        await user.keyboard('{ArrowRight}');
        expect(radio('Closed')).toHaveFocus();
        expect(radio('Closed')).toHaveAttribute('aria-checked', 'true');
        expect(radio('Closed')).toHaveAttribute('tabindex', '0');
        expect(radio('Open')).toHaveAttribute('aria-checked', 'false');

        await user.keyboard('{ArrowDown}');
        expect(radio('All')).toHaveFocus();
        expect(radio('All')).toHaveAttribute('aria-checked', 'true');

        await user.keyboard('{ArrowLeft}');
        expect(radio('Closed')).toHaveFocus();
        await user.keyboard('{ArrowUp}');
        expect(radio('Open')).toHaveFocus();
        expect(radio('Open')).toHaveAttribute('aria-checked', 'true');
    });

    it('Home and End jump to the first and last chip', async () => {
        const user = userEvent.setup();
        render(<Scope />);
        await user.click(radio('Open'));
        await user.keyboard('{End}');
        expect(radio('Closed')).toHaveFocus();
        expect(radio('Closed')).toHaveAttribute('aria-checked', 'true');
        await user.keyboard('{Home}');
        expect(radio('All')).toHaveFocus();
        expect(radio('All')).toHaveAttribute('aria-checked', 'true');
    });

    it('skips disabled chips, across groups', async () => {
        const user = userEvent.setup();
        function Grouped() {
            const [selected, setSelected] = useState(['all']);
            return (
                <EdFilterChipRow
                    ariaLabel="Scope"
                    mode="single"
                    selected={selected}
                    onSelectedChange={setSelected}
                    groups={[
                        { chips: [{ value: 'all', label: 'All' }, { value: 'x', label: 'Archived', disabled: true }] },
                        { divider: true, chips: [{ value: 'mine', label: 'Mine' }] },
                    ]}
                />
            );
        }
        render(<Grouped />);
        await user.click(radio('All'));
        await user.keyboard('{ArrowRight}');
        expect(radio('Mine')).toHaveFocus();
        expect(radio('Mine')).toHaveAttribute('aria-checked', 'true');
        await user.keyboard('{End}');
        expect(radio('Mine')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(radio('All')).toHaveFocus();
    });

    it('leaves modified arrow keys to the browser', async () => {
        const user = userEvent.setup();
        const onSelectedChange = vi.fn();
        render(<EdFilterChipRow ariaLabel="Scope" mode="single" selected={['all']} onSelectedChange={onSelectedChange} chips={chips} />);
        await user.click(radio('All'));
        onSelectedChange.mockClear();
        await user.keyboard('{Alt>}{ArrowRight}{/Alt}');
        expect(radio('All')).toHaveFocus();
        expect(onSelectedChange).not.toHaveBeenCalled();
    });
});
