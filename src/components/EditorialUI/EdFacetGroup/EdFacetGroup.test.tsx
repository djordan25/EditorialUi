import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdFacetGroup, EdFacetRow } from './EdFacetGroup';

describe('EdFacetGroup', () => {
    it('collapses and expands its rows', async () => {
        const user = userEvent.setup();
        render(
            <EdFacetGroup label="Tier">
                <EdFacetRow checked label="Tier I" count={7} onCheckedChange={() => {}} />
            </EdFacetGroup>,
        );
        const header = screen.getByRole('button', { name: /tier/i });
        expect(header).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('checkbox', { name: /tier i/i })).toBeVisible();

        await user.click(header);
        expect(header).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('can be controlled', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(
            <EdFacetGroup label="Status" open={false} onOpenChange={onOpenChange}>
                <span>row</span>
            </EdFacetGroup>,
        );
        await user.click(screen.getByRole('button', { name: /status/i }));
        expect(onOpenChange).toHaveBeenCalledWith(true);
        expect(screen.getByRole('button', { name: /status/i })).toHaveAttribute('aria-expanded', 'false');
    });
});

describe('EdFacetRow', () => {
    it('is a checkbox that toggles on click, Space and Enter', async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();
        render(<EdFacetRow checked={false} label="Released" count={12} onCheckedChange={onCheckedChange} />);
        const row = screen.getByRole('checkbox', { name: /released/i });
        expect(row).toHaveAttribute('aria-checked', 'false');
        expect(row).toHaveTextContent('12');

        await user.click(row);
        row.focus();
        await user.keyboard(' ');
        await user.keyboard('{Enter}');
        expect(onCheckedChange.mock.calls).toEqual([[true], [true], [true]]);
    });

    it('reports off when checked, and does nothing when disabled', async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();
        const { rerender } = render(<EdFacetRow checked label="Draft" onCheckedChange={onCheckedChange} />);
        await user.click(screen.getByRole('checkbox'));
        expect(onCheckedChange).toHaveBeenLastCalledWith(false);

        onCheckedChange.mockClear();
        rerender(<EdFacetRow checked label="Draft" disabled onCheckedChange={onCheckedChange} />);
        await user.click(screen.getByRole('checkbox'));
        expect(onCheckedChange).not.toHaveBeenCalled();
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-disabled', 'true');
    });
});
