import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdIconButton } from './EdIconButton';
import { EdIcon } from '../EdIcon';

describe('EdIconButton', () => {
    it('renders with an accessible name from aria-label', () => {
        render(<EdIconButton aria-label="Search" icon={<EdIcon name="Search" />} />);
        expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    });

    it('defaults type="button"', () => {
        render(<EdIconButton aria-label="Search" icon={<EdIcon name="Search" />} />);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('fires onClick when clicked', async () => {
        const onClick = vi.fn();
        render(<EdIconButton aria-label="Search" icon={<EdIcon name="Search" />} onClick={onClick} />);
        await userEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('reflects pressed state via aria-pressed', () => {
        const { rerender } = render(
            <EdIconButton aria-label="Pin" icon={<EdIcon name="Pin" />} pressed={false} />,
        );
        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

        rerender(<EdIconButton aria-label="Pin" icon={<EdIcon name="Pin" />} pressed={true} />);
        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('omits aria-pressed when toggle behavior is not used', () => {
        render(<EdIconButton aria-label="Search" icon={<EdIcon name="Search" />} />);
        expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed');
    });

    it('honors disabled', async () => {
        const onClick = vi.fn();
        render(<EdIconButton aria-label="Search" icon={<EdIcon name="Search" />} disabled onClick={onClick} />);
        await userEvent.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });
});
