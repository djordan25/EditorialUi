import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdProgressMeter, EdProgressSegmented } from './EdProgressMeter';

describe('EdProgressMeter', () => {
    it('renders a progressbar role', () => {
        render(<EdProgressMeter label="Uploading" percent={42} />);
        expect(screen.getByRole('progressbar', { name: 'Uploading' })).toBeInTheDocument();
    });

    it('sets aria-valuenow for determinate', () => {
        render(<EdProgressMeter label="Uploading" percent={42} />);
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveAttribute('aria-valuenow', '42');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
    });

    it('uses aria-valuetext for the visible string', () => {
        render(<EdProgressMeter label="Uploading" percent={42} />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '42%');
    });

    it('honors valueText override', () => {
        render(
            <EdProgressMeter
                label="Importing"
                percent={68}
                valueText="68%, 2142 of 3150"
            />,
        );
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '68%, 2142 of 3150');
    });

    it('omits aria-valuenow when indeterminate, sets aria-busy', () => {
        render(<EdProgressMeter label="Searching" />);
        const bar = screen.getByRole('progressbar');
        expect(bar).not.toHaveAttribute('aria-valuenow');
        expect(bar).toHaveAttribute('aria-busy', 'true');
    });

    it('clamps percent into [0, 100]', () => {
        render(<EdProgressMeter label="X" percent={150} />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    });

    it('renders the visible label and value', () => {
        render(<EdProgressMeter label="Uploading" value="42%" percent={42} />);
        expect(screen.getByText('Uploading')).toBeInTheDocument();
        expect(screen.getByText('42%')).toBeInTheDocument();
    });

    it('honors ariaLabel when no label prop is set', () => {
        render(<EdProgressMeter percent={50} ariaLabel="Sync progress" />);
        expect(screen.getByRole('progressbar', { name: 'Sync progress' })).toBeInTheDocument();
    });
});

describe('EdProgressSegmented', () => {
    it('renders a progressbar with the right range', () => {
        render(<EdProgressSegmented segments={4} filled={2} ariaLabel="Strength" />);
        const bar = screen.getByRole('progressbar', { name: 'Strength' });
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '4');
        expect(bar).toHaveAttribute('aria-valuenow', '2');
    });

    it('clamps filled', () => {
        render(<EdProgressSegmented segments={4} filled={10} ariaLabel="X" />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4');
    });

    it('passes valueText through to aria-valuetext', () => {
        render(
            <EdProgressSegmented
                segments={4}
                filled={2}
                ariaLabel="Strength"
                valueText="Fair · 12+ characters"
            />,
        );
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Fair · 12+ characters');
    });
});
