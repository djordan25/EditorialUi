import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdStatusDot } from './EdStatusDot';

describe('EdStatusDot', () => {
    it('is decorative without a label', () => {
        const { container } = render(<EdStatusDot tone="success" />);
        expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('is a named image with a label', () => {
        render(<EdStatusDot tone="danger" label="Failing validation" />);
        expect(screen.getByRole('img', { name: 'Failing validation' })).toBeInTheDocument();
    });
});
