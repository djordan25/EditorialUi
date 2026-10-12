import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdTierBadge } from './EdTierBadge';

describe('EdTierBadge', () => {
    it.each([
        [1, 'I', 'Tier I'],
        [2, 'II', 'Tier II'],
        [3, 'III', 'Tier III'],
    ] as const)('tier %s reads as %s', (tier, numeral, label) => {
        render(<EdTierBadge tier={tier} />);
        expect(screen.getByRole('img', { name: label })).toHaveTextContent(numeral);
    });

    it('shows a dash for an untiered model', () => {
        render(<EdTierBadge tier={null} />);
        expect(screen.getByRole('img', { name: 'Not tiered' })).toHaveTextContent('—');
    });

    it('accepts a custom accessible name', () => {
        render(<EdTierBadge tier={1} ariaLabel="Tier 1 — highest scrutiny" />);
        expect(screen.getByRole('img', { name: 'Tier 1 — highest scrutiny' })).toBeInTheDocument();
    });
});
