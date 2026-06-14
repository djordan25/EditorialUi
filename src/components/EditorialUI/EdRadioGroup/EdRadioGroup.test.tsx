import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdRadioGroup, EdRadio } from './EdRadioGroup';

const renderGroup = (props: Partial<React.ComponentProps<typeof EdRadioGroup>> = {}) =>
    render(
        <EdRadioGroup label="Cadence" {...props}>
            <EdRadio value="daily" label="Daily" />
            <EdRadio value="weekly" label="Weekly" />
            <EdRadio value="monthly" label="Monthly" />
        </EdRadioGroup>,
    );

describe('EdRadioGroup', () => {
    it('renders a radiogroup with all options', () => {
        renderGroup();
        expect(screen.getByRole('radiogroup', { name: 'Cadence' })).toBeInTheDocument();
        expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('renders each radio with the correct accessible name', () => {
        renderGroup();
        expect(screen.getByRole('radio', { name: 'Daily' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'Weekly' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'Monthly' })).toBeInTheDocument();
    });

    it('selects the defaultValue radio', () => {
        renderGroup({ defaultValue: 'weekly' });
        expect(screen.getByRole('radio', { name: 'Weekly' })).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('radio', { name: 'Daily' })).toHaveAttribute('aria-checked', 'false');
    });

    it('fires onValueChange when selecting a different option', async () => {
        const onValueChange = vi.fn();
        renderGroup({ defaultValue: 'daily', onValueChange });
        await userEvent.click(screen.getByRole('radio', { name: 'Weekly' }));
        expect(onValueChange).toHaveBeenCalledWith('weekly');
    });

    it('selects via the surrounding label', async () => {
        const onValueChange = vi.fn();
        renderGroup({ defaultValue: 'daily', onValueChange });
        await userEvent.click(screen.getByText('Monthly'));
        expect(onValueChange).toHaveBeenCalledWith('monthly');
    });

    it('moves focus with arrow keys (Radix roving tabindex)', async () => {
        renderGroup({ defaultValue: 'daily' });
        const radios = screen.getAllByRole('radio');
        radios[0].focus();
        await userEvent.keyboard('{ArrowDown}');
        expect(radios[1]).toHaveFocus();
    });

    it('does not select disabled options', async () => {
        const onValueChange = vi.fn();
        render(
            <EdRadioGroup label="Cadence" defaultValue="daily" onValueChange={onValueChange}>
                <EdRadio value="daily" label="Daily" />
                <EdRadio value="monthly" label="Monthly" disabled />
            </EdRadioGroup>,
        );
        await userEvent.click(screen.getByText('Monthly'));
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('renders item descriptions and links via aria-describedby', () => {
        render(
            <EdRadioGroup label="Mode">
                <EdRadio
                    value="single"
                    label="Single-approver"
                    description="Anyone in Risk Ops can approve."
                />
            </EdRadioGroup>,
        );
        const radio = screen.getByRole('radio', { name: 'Single-approver' });
        const describedBy = radio.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy!)).toHaveTextContent('Anyone in Risk Ops can approve.');
    });

    it('renders error with role="alert" and replaces hint', () => {
        render(
            <EdRadioGroup
                label="Mode"
                hint="Tier-1 models require two-person rule."
                error="Select a mode."
            >
                <EdRadio value="a" label="A" />
            </EdRadioGroup>,
        );
        expect(screen.getByRole('alert')).toHaveTextContent('Select a mode.');
        expect(screen.queryByText(/Tier-1/)).not.toBeInTheDocument();
    });
});
