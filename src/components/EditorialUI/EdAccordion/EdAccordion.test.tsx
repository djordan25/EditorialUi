import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdAccordion, type EdAccordionItemData } from './EdAccordion';

const items: EdAccordionItemData[] = [
    { value: 'evidence', title: 'Closure evidence', meta: '3 documents', content: 'evidence body' },
    { value: 'audit', title: 'Audit trail', meta: '14 entries', content: 'audit body' },
    { value: 'related', title: 'Related findings', content: 'related body' },
];

describe('EdAccordion', () => {
    it('renders all triggers', () => {
        render(<EdAccordion items={items} />);
        expect(screen.getByRole('button', { name: /Closure evidence/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Audit trail/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Related findings/ })).toBeInTheDocument();
    });

    it('renders meta in the trigger', () => {
        render(<EdAccordion items={items} />);
        expect(screen.getByText('3 documents')).toBeInTheDocument();
        expect(screen.getByText('14 entries')).toBeInTheDocument();
    });

    it('defaultValue expands that item', () => {
        render(<EdAccordion defaultValue="evidence" items={items} />);
        expect(screen.getByText('evidence body')).toBeVisible();
        expect(screen.getByRole('button', { name: /Closure evidence/ })).toHaveAttribute('aria-expanded', 'true');
    });

    it('clicking a trigger expands it (single mode swaps)', async () => {
        render(<EdAccordion defaultValue="evidence" items={items} />);
        await userEvent.click(screen.getByRole('button', { name: /Audit trail/ }));
        expect(screen.getByRole('button', { name: /Audit trail/ })).toHaveAttribute('aria-expanded', 'true');
        // Single mode collapses the previously-open item.
        expect(screen.getByRole('button', { name: /Closure evidence/ })).toHaveAttribute('aria-expanded', 'false');
    });

    it('multiple mode keeps independent items open', async () => {
        render(<EdAccordion type="multiple" defaultValue={['evidence']} items={items} />);
        await userEvent.click(screen.getByRole('button', { name: /Audit trail/ }));
        expect(screen.getByRole('button', { name: /Closure evidence/ })).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('button', { name: /Audit trail/ })).toHaveAttribute('aria-expanded', 'true');
    });

    it('fires onValueChange (single)', async () => {
        const onValueChange = vi.fn();
        render(<EdAccordion defaultValue="evidence" onValueChange={onValueChange} items={items} />);
        await userEvent.click(screen.getByRole('button', { name: /Related findings/ }));
        expect(onValueChange).toHaveBeenCalledWith('related');
    });

    it('arrow keys move between triggers', async () => {
        render(<EdAccordion items={items} />);
        const triggers = screen.getAllByRole('button');
        triggers[0].focus();
        await userEvent.keyboard('{ArrowDown}');
        expect(triggers[1]).toHaveFocus();
    });

    it('disabled item cannot be opened', async () => {
        const data = [items[0], { ...items[1], disabled: true }, items[2]];
        render(<EdAccordion items={data} />);
        const trigger = screen.getByRole('button', { name: /Audit trail/ });
        await userEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
});
