import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdSparkline, sparklineSegments } from './EdSparkline';

describe('sparklineSegments', () => {
    it('breaks the line at gaps instead of bridging them', () => {
        const segs = sparklineSegments([1, 2, null, 3, 4, null, null, 5], 70, 24);
        expect(segs.map(s => s.points.length)).toEqual([2, 2, 1]);
    });

    it('spreads points across the width and puts the max at the top, the min at the bottom', () => {
        const [seg] = sparklineSegments([10, 20, 30], 100, 24, 2);
        expect(seg.points.map(p => p[0])).toEqual([0, 50, 100]);
        expect(seg.points[2][1]).toBe(2); // max → top inset
        expect(seg.points[0][1]).toBe(22); // min → bottom inset
    });

    it('draws a flat series mid-height and returns nothing for an empty one', () => {
        const [seg] = sparklineSegments([5, 5, 5], 60, 24);
        expect(seg.points.every(p => p[1] === 12)).toBe(true);
        expect(sparklineSegments([null, null], 60, 24)).toEqual([]);
        expect(sparklineSegments([], 60, 24)).toEqual([]);
    });
});

describe('EdSparkline', () => {
    it('is a named image', () => {
        render(<EdSparkline values={[1, 3, 2]} ariaLabel="p95 run time, last 30 days" />);
        expect(screen.getByRole('img', { name: 'p95 run time, last 30 days' })).toBeInTheDocument();
    });

    it('draws a dashed baseline when there is no data, and a dot for a lone point', () => {
        const { container, rerender } = render(<EdSparkline values={[null, null]} ariaLabel="none" />);
        expect(container.querySelector('line')).not.toBeNull();
        rerender(<EdSparkline values={[null, 4, null]} ariaLabel="one" />);
        expect(container.querySelector('circle')).not.toBeNull();
        expect(container.querySelector('line')).toBeNull();
    });

    it('omits the area fill when asked', () => {
        const { container } = render(<EdSparkline values={[1, 2, 3]} ariaLabel="x" area={false} />);
        expect(container.querySelectorAll('path')).toHaveLength(1);
    });
});
