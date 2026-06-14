import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdCircularProgress } from './EdCircularProgress';

describe('EdCircularProgress', () => {
    it('indeterminate renders role=status with aria-busy', () => {
        render(<EdCircularProgress label="Loading findings" />);
        const el = screen.getByRole('status', { name: 'Loading findings' });
        expect(el).toHaveAttribute('aria-busy', 'true');
        expect(el).toHaveAttribute('aria-live', 'polite');
    });

    it('determinate renders role=progressbar with aria-valuenow', () => {
        render(<EdCircularProgress percent={42} label="Sync" />);
        const bar = screen.getByRole('progressbar', { name: 'Sync' });
        expect(bar).toHaveAttribute('aria-valuenow', '42');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
        expect(bar).toHaveAttribute('aria-valuetext', '42%');
    });

    it('clamps percent into [0, 100]', () => {
        render(<EdCircularProgress percent={150} label="X" />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    });

    it('shows the percent value when showValue is true', () => {
        render(<EdCircularProgress percent={70} size="lg" showValue label="X" />);
        expect(screen.getByText('70%')).toBeInTheDocument();
    });

    it('hides the percent value by default', () => {
        render(<EdCircularProgress percent={70} size="lg" label="X" />);
        expect(screen.queryByText('70%')).toBeNull();
    });

    it('renders the label visually-hidden but accessible (indeterminate)', () => {
        render(<EdCircularProgress label="Saving" />);
        // The label is in DOM (just visually hidden) — getByText finds it.
        expect(screen.getByText('Saving')).toBeInTheDocument();
    });
});
