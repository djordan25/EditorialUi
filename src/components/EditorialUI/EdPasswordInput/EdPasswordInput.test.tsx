import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EdPasswordInput } from './EdPasswordInput';

describe('EdPasswordInput', () => {
    it('renders a masked input by default', () => {
        render(<EdPasswordInput label="Password" />);
        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('does not render a reveal toggle by default', () => {
        render(<EdPasswordInput label="Password" />);
        expect(screen.queryByRole('button', { name: /show password|hide password/i })).toBeNull();
    });

    it('shows a reveal toggle when revealable, with "Show password" label', () => {
        render(<EdPasswordInput label="Password" revealable />);
        expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    });

    it('toggles to type=text and updates the toggle label when clicked', async () => {
        render(<EdPasswordInput label="Password" revealable />);
        const input = screen.getByLabelText('Password');
        const toggle = screen.getByRole('button', { name: 'Show password' });
        await userEvent.click(toggle);
        expect(input).toHaveAttribute('type', 'text');
        expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
    });

    it('re-masks on blur', async () => {
        render(
            <>
                <EdPasswordInput label="Password" revealable />
                <button>other</button>
            </>,
        );
        const input = screen.getByLabelText('Password');
        await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
        expect(input).toHaveAttribute('type', 'text');
        await userEvent.click(screen.getByRole('button', { name: 'other' }));
        expect(input).toHaveAttribute('type', 'password');
    });

    it('renders strength meter with progressbar role and the caption', () => {
        render(
            <EdPasswordInput
                label="New password"
                strength={{ band: 'fair', caption: 'Fair · 12+ characters recommended' }}
            />,
        );
        const bar = screen.getByRole('progressbar', { name: 'Password strength' });
        expect(bar).toHaveAttribute('aria-valuenow', '2');
        expect(bar).toHaveAttribute('aria-valuemax', '4');
        expect(screen.getByText(/Fair · 12\+ characters recommended/)).toBeInTheDocument();
    });

    it('omits the meter when strength is not provided', () => {
        render(<EdPasswordInput label="Password" />);
        expect(screen.queryByRole('progressbar')).toBeNull();
    });

    it('defaults autoComplete to "current-password"', () => {
        render(<EdPasswordInput label="Password" />);
        expect(screen.getByLabelText('Password')).toHaveAttribute('autoComplete', 'current-password');
    });

    it('honors an overridden autoComplete', () => {
        render(<EdPasswordInput label="New password" autoComplete="new-password" />);
        expect(screen.getByLabelText('New password')).toHaveAttribute('autoComplete', 'new-password');
    });

    it('propagates error state to aria-invalid', () => {
        render(<EdPasswordInput label="Password" error="Incorrect" />);
        expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true');
    });
});
