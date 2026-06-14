import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EdTooltip, EdTooltipProvider } from './EdTooltip';

const renderTip = (props: Partial<React.ComponentProps<typeof EdTooltip>> = {}) =>
    render(
        <EdTooltipProvider delayDuration={0}>
            <EdTooltip label="Reopen finding" {...props}>
                <button>Reopen</button>
            </EdTooltip>
        </EdTooltipProvider>,
    );

describe('EdTooltip', () => {
    it('renders its trigger', () => {
        renderTip();
        expect(screen.getByRole('button', { name: 'Reopen' })).toBeInTheDocument();
    });

    it('does not show the tooltip until focus/hover', () => {
        renderTip();
        expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('shows on focus with role="tooltip"', async () => {
        renderTip();
        await userEvent.tab();
        // Radix renders the content (possibly duplicated for a11y) — at least one tooltip role.
        const tips = await screen.findAllByText('Reopen finding');
        expect(tips.length).toBeGreaterThan(0);
    });

    it('renders the rich variant (title + body)', async () => {
        render(
            <EdTooltipProvider delayDuration={0}>
                <EdTooltip title="MRIA" body="Matter Requiring Immediate Attention.">
                    <span tabIndex={0}>MRIA</span>
                </EdTooltip>
            </EdTooltipProvider>,
        );
        await userEvent.tab();
        expect(await screen.findAllByText('MRIA')).not.toHaveLength(0);
        expect(await screen.findAllByText(/Matter Requiring/)).not.toHaveLength(0);
    });

    it('renders the kbd chip when provided', async () => {
        renderTip({ label: 'Save draft', kbd: '⌘S' });
        await userEvent.tab();
        expect(await screen.findAllByText('⌘S')).not.toHaveLength(0);
    });

    it('disabled renders the bare trigger and never a tooltip', async () => {
        renderTip({ disabled: true });
        await userEvent.tab();
        expect(screen.getByRole('button', { name: 'Reopen' })).toBeInTheDocument();
        expect(screen.queryByRole('tooltip')).toBeNull();
    });
});
