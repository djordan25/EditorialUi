import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdModal } from './EdModal';

describe('EdModal', () => {
    it('renders title, body, and footer when open', () => {
        render(
            <EdModal open title="Reopen finding F-2438?" footer={<button>Reopen</button>}>
                Closure timestamp will be cleared.
            </EdModal>,
        );
        expect(screen.getByRole('dialog', { name: 'Reopen finding F-2438?' })).toBeInTheDocument();
        expect(screen.getByText('Closure timestamp will be cleared.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reopen' })).toBeInTheDocument();
    });

    it('is closed when open is false', () => {
        render(<EdModal open={false} title="X">body</EdModal>);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('renders subtitle and footer meta', () => {
        render(
            <EdModal open title="New finding" subtitle="PD model" footerMeta="Autosaves" footer={<button>Open</button>}>
                body
            </EdModal>,
        );
        expect(screen.getByText('PD model')).toBeInTheDocument();
        expect(screen.getByText('Autosaves')).toBeInTheDocument();
    });

    it('busy sets aria-busy and hides the close button', () => {
        render(
            <EdModal open title="Importing" busy busyStatus="Stage 2 of 4" footer={<button>Cancel</button>}>
                body
            </EdModal>,
        );
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-busy', 'true');
        expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    });

    it('busy announces the status via a live region', () => {
        render(
            <EdModal open title="Importing" busy busyStatus="Stage 2 of 4 — validating columns" footer={<button>Cancel</button>}>
                body
            </EdModal>,
        );
        expect(screen.getByRole('status')).toHaveTextContent('Stage 2 of 4 — validating columns');
    });

    it('busy keeps footer actions interactive (cancel still works)', async () => {
        const onCancel = vi.fn();
        render(
            <EdModal open title="Importing" busy footer={<button onClick={onCancel}>Cancel import</button>}>
                body
            </EdModal>,
        );
        await userEvent.click(screen.getByRole('button', { name: 'Cancel import' }));
        expect(onCancel).toHaveBeenCalledOnce();
    });

    it('Escape closes by default (non-busy)', async () => {
        const onOpenChange = vi.fn();
        render(<EdModal open title="X" onOpenChange={onOpenChange} footer={<button>OK</button>}>body</EdModal>);
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('busy blocks Escape (acts as a guarded form)', async () => {
        const onOpenChange = vi.fn();
        render(
            <EdModal open title="Importing" busy onOpenChange={onOpenChange} footer={<button>Cancel</button>}>
                body
            </EdModal>,
        );
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('forwards dismissOnEscape={false} to block Escape while non-busy', async () => {
        const onOpenChange = vi.fn();
        render(
            <EdModal open title="X" onOpenChange={onOpenChange} dismissOnEscape={false} footer={<button>OK</button>}>
                body
            </EdModal>,
        );
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('forwards dismissOnOutsideClick={false} but keeps Escape working (decoupled)', async () => {
        const onOpenChange = vi.fn();
        render(
            <EdModal open title="X" onOpenChange={onOpenChange} dismissOnOutsideClick={false} footer={<button>OK</button>}>
                body
            </EdModal>,
        );
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('titleVisuallyHidden keeps the modal accessible name', () => {
        render(
            <EdModal open title="Importing data" titleVisuallyHidden footer={<button>Cancel</button>}>
                body
            </EdModal>,
        );
        expect(screen.getByRole('dialog', { name: 'Importing data' })).toBeInTheDocument();
    });
});
