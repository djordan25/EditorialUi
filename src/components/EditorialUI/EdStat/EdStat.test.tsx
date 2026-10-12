import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdStat, EdStatGrid } from './EdStat';

describe('EdStat', () => {
    it('shows the label and the figure', () => {
        render(
            <EdStatGrid columns={2} data-testid="grid">
                <EdStat label="Runs" value="412" />
                <EdStat label="Error rate" value="1.20%" tone="warning" />
            </EdStatGrid>,
        );
        expect(screen.getByText('Runs')).toBeInTheDocument();
        expect(screen.getByText('1.20%')).toBeInTheDocument();
        expect(screen.getByTestId('grid').style.getPropertyValue('--ed-stat-columns')).toBe('2');
    });
});
