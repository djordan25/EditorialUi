import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdDateRangePicker, defaultPresets, type EdDateRange } from './EdDateRangePicker';

describe('defaultPresets', () => {
    it('returns ISO ranges anchored to the given today', () => {
        const presets = defaultPresets(new Date(2026, 2, 15)); // 2026-03-15
        const today = presets.find((p) => p.label === 'Today')!.range();
        expect(today).toEqual(['2026-03-15', '2026-03-15']);
        const last7 = presets.find((p) => p.label === 'Last 7 days')!.range();
        expect(last7).toEqual(['2026-03-09', '2026-03-15']);
    });
});

describe('EdDateRangePicker', () => {
    it('renders the trigger with placeholder when empty', () => {
        render(<EdDateRangePicker label="Created between" value={{ start: null, end: null }} />);
        expect(screen.getByText('Select date range…')).toBeInTheDocument();
    });

    it('shows the ISO range with the → separator', () => {
        render(<EdDateRangePicker label="Created" value={{ start: '2026-03-02', end: '2026-03-15' }} />);
        expect(screen.getByText('2026-03-02 → 2026-03-15')).toBeInTheDocument();
    });

    it('shows the preset name when the range matches a preset exactly', () => {
        const presets = defaultPresets();
        const [s, e] = presets.find((p) => p.label === 'Last 14 days')!.range();
        render(<EdDateRangePicker label="Created" value={{ start: s, end: e }} presets={presets} />);
        expect(screen.getByText('Last 14 days')).toBeInTheDocument();
    });

    it('opens the calendar on trigger click', async () => {
        render(<EdDateRangePicker label="Created" value={{ start: '2026-03-02', end: '2026-03-15' }} />);
        await userEvent.click(screen.getByRole('button', { name: /2026-03-02/ }));
        // Two month grids render.
        expect(await screen.findAllByRole('grid')).toHaveLength(2);
    });

    it('applies a preset and fires onChange', async () => {
        const onChange = vi.fn();
        render(<EdDateRangePicker label="Created" value={{ start: null, end: null }} onChange={onChange} />);
        await userEvent.click(screen.getByRole('button', { name: 'Select date range…' }));
        await userEvent.click(await screen.findByRole('button', { name: 'Today' }));
        expect(onChange).toHaveBeenCalled();
        const arg = onChange.mock.calls[0][0] as EdDateRange;
        expect(arg.start).toBe(arg.end);
        expect(arg.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('marks the active preset aria-pressed', async () => {
        const presets = defaultPresets();
        const [s, e] = presets.find((p) => p.label === 'Last 14 days')!.range();
        render(<EdDateRangePicker label="Created" value={{ start: s, end: e }} presets={presets} />);
        await userEvent.click(screen.getByRole('button', { name: 'Last 14 days' }));
        // Two "Last 14 days" — the trigger collapsed to the name, plus the preset button.
        const pressed = screen.getAllByRole('button', { name: 'Last 14 days' }).find((b) => b.getAttribute('aria-pressed') === 'true');
        expect(pressed).toBeTruthy();
    });

    it('selects a custom range by clicking two days', async () => {
        const onChange = vi.fn();
        render(<EdDateRangePicker label="Created" value={{ start: null, end: null }} onChange={onChange} />);
        await userEvent.click(screen.getByRole('button', { name: 'Select date range…' }));
        const grids = await screen.findAllByRole('grid');
        const firstGrid = grids[0];
        const tens = within(firstGrid).getAllByText('10');
        await userEvent.click(tens[0]);
        const twenties = within(firstGrid).getAllByText('20');
        await userEvent.click(twenties[0]);
        // onChange fires for start, then for the completed range.
        expect(onChange).toHaveBeenCalledTimes(2);
        const final = onChange.mock.calls[1][0] as EdDateRange;
        expect(final.start).toBeTruthy();
        expect(final.end).toBeTruthy();
        expect(final.start! < final.end!).toBe(true);
    });

    it('does not open when disabled', async () => {
        render(<EdDateRangePicker label="Created" defaultValue={{ start: null, end: null }} disabled />);
        await userEvent.click(screen.getByRole('button'));
        expect(screen.queryByRole('grid')).toBeNull();
    });

    it('sets aria-invalid + renders the error', () => {
        render(<EdDateRangePicker label="Created" value={{ start: null, end: null }} error="Required." />);
        expect(screen.getByRole('button')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toHaveTextContent('Required.');
    });

    it('day mode commits a same-day range on a single click and fires onChange once', async () => {
        const onChange = vi.fn();
        render(<EdDateRangePicker mode="day" value={{ start: null, end: null }} onChange={onChange} />);
        await userEvent.click(screen.getByRole('button', { name: 'Select date…' }));
        const grids = await screen.findAllByRole('grid');
        await userEvent.click(within(grids[0]).getAllByText('15')[0]);
        expect(onChange).toHaveBeenCalledTimes(1);
        const arg = onChange.mock.calls[0][0] as EdDateRange;
        expect(arg.start).toBe(arg.end);
        expect(arg.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('day mode shows no presets rail by default', async () => {
        render(<EdDateRangePicker mode="day" value={{ start: null, end: null }} />);
        await userEvent.click(screen.getByRole('button', { name: 'Select date…' }));
        await screen.findAllByRole('grid');
        expect(screen.queryByRole('button', { name: 'Today' })).toBeNull();
    });

    it('day mode trigger shows a single date, no → separator', () => {
        render(<EdDateRangePicker mode="day" value={{ start: '2026-03-15', end: '2026-03-15' }} />);
        expect(screen.getByText('2026-03-15')).toBeInTheDocument();
        expect(screen.queryByText(/→/)).toBeNull();
    });

    it('renders no presets rail when presets is explicitly empty (range mode)', async () => {
        render(<EdDateRangePicker value={{ start: null, end: null }} presets={[]} />);
        await userEvent.click(screen.getByRole('button', { name: 'Select date range…' }));
        await screen.findAllByRole('grid');
        expect(screen.queryByRole('button', { name: 'Today' })).toBeNull();
    });
});
