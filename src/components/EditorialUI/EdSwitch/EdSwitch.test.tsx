import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdSwitch } from './EdSwitch';

describe('EdSwitch', () => {
    it('renders a switch role tied to its label', () => {
        render(<EdSwitch label="Notifications" />);
        expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument();
    });

    it('defaults to unchecked', () => {
        render(<EdSwitch label="Notifications" />);
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });

    it('reflects defaultChecked', () => {
        render(<EdSwitch label="Notifications" defaultChecked />);
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles on click', async () => {
        const onCheckedChange = vi.fn();
        render(<EdSwitch label="Notifications" onCheckedChange={onCheckedChange} />);
        await userEvent.click(screen.getByRole('switch'));
        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('toggles when the label is clicked', async () => {
        const onCheckedChange = vi.fn();
        render(<EdSwitch label="Notifications" onCheckedChange={onCheckedChange} />);
        await userEvent.click(screen.getByText('Notifications'));
        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('does not toggle when disabled', async () => {
        const onCheckedChange = vi.fn();
        render(<EdSwitch label="Notifications" disabled onCheckedChange={onCheckedChange} />);
        await userEvent.click(screen.getByRole('switch'));
        expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it('does not toggle while loading', async () => {
        const onCheckedChange = vi.fn();
        render(<EdSwitch label="Notifications" loading onCheckedChange={onCheckedChange} />);
        await userEvent.click(screen.getByRole('switch'));
        expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it('shows the loading tag when loading', () => {
        render(<EdSwitch label="Notifications" loading />);
        expect(screen.getByText('saving…')).toBeInTheDocument();
    });

    it('renders a description and links it via aria-describedby', () => {
        render(
            <EdSwitch
                layout="row"
                label="Email on completion"
                description="Goes to your default workspace channel."
            />,
        );
        const sw = screen.getByRole('switch');
        const describedBy = sw.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy!)).toHaveTextContent(
            'Goes to your default workspace channel.',
        );
    });

    it('toggles with Space when focused', async () => {
        const onCheckedChange = vi.fn();
        render(<EdSwitch label="Notifications" onCheckedChange={onCheckedChange} />);
        const sw = screen.getByRole('switch');
        sw.focus();
        await userEvent.keyboard(' ');
        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
});
