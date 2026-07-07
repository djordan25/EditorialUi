import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdDialog, EdConfirmation, EdDialogBody, EdDialogActions } from './EdDialog';

describe('EdDialog', () => {
    it('does not render content when closed', () => {
        render(<EdDialog open={false} title="Reopen">body</EdDialog>);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('renders a dialog with the title wired via aria-labelledby', () => {
        render(<EdDialog open title="Reopen finding">body</EdDialog>);
        expect(screen.getByRole('dialog', { name: 'Reopen finding' })).toBeInTheDocument();
    });

    it('renders subtitle and body', () => {
        render(<EdDialog open title="Reopen" subtitle="F-2438">the body text</EdDialog>);
        expect(screen.getByText('F-2438')).toBeInTheDocument();
        expect(screen.getByText('the body text')).toBeInTheDocument();
    });

    it('renders a close button by default', () => {
        render(<EdDialog open title="X">body</EdDialog>);
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('hides the close button when hideClose is set', () => {
        render(<EdDialog open title="X" hideClose>body</EdDialog>);
        expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    });

    it('fires onOpenChange(false) when close is clicked', async () => {
        const onOpenChange = vi.fn();
        render(<EdDialog open title="X" onOpenChange={onOpenChange}>body</EdDialog>);
        await userEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('Escape closes by default', async () => {
        const onOpenChange = vi.fn();
        render(<EdDialog open title="X" onOpenChange={onOpenChange}>body</EdDialog>);
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('preventOutsideClose blocks Escape', async () => {
        const onOpenChange = vi.fn();
        render(
            <EdDialog open title="X" onOpenChange={onOpenChange} preventOutsideClose>
                body
            </EdDialog>,
        );
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('renders footer actions', () => {
        render(
            <EdDialog open title="X" footer={<button>Confirm</button>}>
                body
            </EdDialog>,
        );
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('wires a screen-reader description when provided', () => {
        render(
            <EdDialog open title="X" description="A short summary for AT.">
                body
            </EdDialog>,
        );
        expect(screen.getByText('A short summary for AT.')).toBeInTheDocument();
    });

    it('dismissOnEscape={false} blocks Escape', async () => {
        const onOpenChange = vi.fn();
        render(
            <EdDialog open title="X" onOpenChange={onOpenChange} dismissOnEscape={false}>
                body
            </EdDialog>,
        );
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('dismissOnOutsideClick={false} still lets Escape close (decoupled from click-away)', async () => {
        const onOpenChange = vi.fn();
        render(
            <EdDialog open title="X" onOpenChange={onOpenChange} dismissOnOutsideClick={false}>
                body
            </EdDialog>,
        );
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('titleVisuallyHidden keeps the accessible name but hides the title visually', () => {
        render(
            <EdDialog open title="Session expiring" titleVisuallyHidden>
                body
            </EdDialog>,
        );
        expect(screen.getByRole('dialog', { name: 'Session expiring' })).toBeInTheDocument();
        const titleEl = screen.getByText('Session expiring');
        expect(titleEl).toHaveClass('srOnly');
        expect(titleEl).not.toHaveClass('title');
    });

    it('names a content-led dialog via aria-label when there is no title', () => {
        render(
            <EdDialog open aria-label="Idle timeout warning">
                <p>You will be signed out soon.</p>
            </EdDialog>,
        );
        expect(screen.getByRole('dialog', { name: 'Idle timeout warning' })).toBeInTheDocument();
    });

    it('composed layout renders EdDialogBody / EdDialogActions with a custom header', () => {
        render(
            <EdDialog open title="Validate model" titleVisuallyHidden layout="composed">
                <div>Custom title bar</div>
                <EdDialogBody>Validation results go here.</EdDialogBody>
                <EdDialogActions meta="3 checks">
                    <button>Run</button>
                </EdDialogActions>
            </EdDialog>,
        );
        expect(screen.getByRole('dialog', { name: 'Validate model' })).toBeInTheDocument();
        expect(screen.getByText('Custom title bar')).toBeInTheDocument();
        expect(screen.getByText('Validation results go here.')).toBeInTheDocument();
        expect(screen.getByText('3 checks')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Run' })).toBeInTheDocument();
    });
});

describe('EdConfirmation', () => {
    it('renders title + body and fallback action buttons', () => {
        render(
            <EdConfirmation open title="Delete?" onConfirm={() => {}} confirmLabel="Delete">
                This cannot be undone.
            </EdConfirmation>,
        );
        expect(screen.getByRole('dialog', { name: 'Delete?' })).toBeInTheDocument();
        expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('calls onConfirm then closes on confirm', async () => {
        const onConfirm = vi.fn();
        const onOpenChange = vi.fn();
        render(
            <EdConfirmation
                open
                onOpenChange={onOpenChange}
                title="Delete?"
                confirmLabel="Delete"
                onConfirm={onConfirm}
            >
                body
            </EdConfirmation>,
        );
        await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
        expect(onConfirm).toHaveBeenCalledOnce();
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('cancel closes without confirming', async () => {
        const onConfirm = vi.fn();
        const onOpenChange = vi.fn();
        render(
            <EdConfirmation
                open
                onOpenChange={onOpenChange}
                title="Delete?"
                onConfirm={onConfirm}
            >
                body
            </EdConfirmation>,
        );
        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onConfirm).not.toHaveBeenCalled();
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('uses renderActions when provided', () => {
        render(
            <EdConfirmation
                open
                title="Delete?"
                onConfirm={() => {}}
                renderActions={() => <button>Custom confirm</button>}
            >
                body
            </EdConfirmation>,
        );
        expect(screen.getByRole('button', { name: 'Custom confirm' })).toBeInTheDocument();
    });
});
