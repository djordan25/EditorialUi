import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdCheckbox } from './EdCheckbox';

describe('EdCheckbox', () => {
    it('renders an accessible checkbox tied to its label', () => {
        render(<EdCheckbox label="Include superseded" />);
        expect(screen.getByRole('checkbox', { name: 'Include superseded' })).toBeInTheDocument();
    });

    it('toggles checked state on click', async () => {
        const onCheckedChange = vi.fn();
        render(<EdCheckbox label="Notify" onCheckedChange={onCheckedChange} />);
        await userEvent.click(screen.getByRole('checkbox'));
        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('reflects checked via aria-checked', () => {
        render(<EdCheckbox label="Notify" defaultChecked />);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    });

    it('renders indeterminate with aria-checked="mixed"', () => {
        render(<EdCheckbox label="Select all" indeterminate />);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    });

    it('renders a description and links it via aria-describedby', () => {
        render(<EdCheckbox label="Notify" description="Email when validations finish." />);
        const checkbox = screen.getByRole('checkbox');
        const describedBy = checkbox.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        const desc = document.getElementById(describedBy!.split(' ')[0]);
        expect(desc).toHaveTextContent('Email when validations finish.');
    });

    it('renders error, sets aria-invalid, replaces hint', () => {
        render(
            <EdCheckbox
                label="Terms"
                hint="Read the policy."
                error="Required to continue."
            />,
        );
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toHaveTextContent('Required to continue.');
        expect(screen.queryByText('Read the policy.')).not.toBeInTheDocument();
    });

    it('does not toggle when disabled', async () => {
        const onCheckedChange = vi.fn();
        render(<EdCheckbox label="Locked" disabled onCheckedChange={onCheckedChange} />);
        await userEvent.click(screen.getByRole('checkbox'));
        expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it('toggles when the surrounding label text is clicked', async () => {
        const onCheckedChange = vi.fn();
        render(<EdCheckbox label="Notify" onCheckedChange={onCheckedChange} />);
        await userEvent.click(screen.getByText('Notify'));
        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('toggles with Space when focused', async () => {
        const onCheckedChange = vi.fn();
        render(<EdCheckbox label="Notify" onCheckedChange={onCheckedChange} />);
        const checkbox = screen.getByRole('checkbox');
        checkbox.focus();
        await userEvent.keyboard(' ');
        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
});
