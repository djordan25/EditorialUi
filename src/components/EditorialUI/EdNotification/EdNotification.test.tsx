import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdNotification } from './EdNotification';

describe('EdNotification', () => {
    it('renders the title and description', () => {
        render(<EdNotification severity="info" title="Read-only" description="Preview mode." />);
        expect(screen.getByText('Read-only')).toBeInTheDocument();
        expect(screen.getByText('Preview mode.')).toBeInTheDocument();
    });

    it('info/success use role="status" with aria-live=polite', () => {
        render(<EdNotification severity="info" title="X" />);
        const el = screen.getByRole('status');
        expect(el).toHaveAttribute('aria-live', 'polite');
    });

    it('warning/danger use role="alert" with aria-live=assertive', () => {
        render(<EdNotification severity="danger" title="Sync failed" />);
        const el = screen.getByRole('alert');
        expect(el).toHaveAttribute('aria-live', 'assertive');
    });

    it('role="none" opts out of an ARIA role', () => {
        render(<EdNotification severity="info" title="Always present" role="none" />);
        expect(screen.queryByRole('status')).toBeNull();
        expect(screen.queryByRole('alert')).toBeNull();
        expect(screen.getByText('Always present')).toBeInTheDocument();
    });

    it('renders a dismiss button with the default aria-label when onDismiss is provided', () => {
        render(<EdNotification severity="success" title="Done" onDismiss={() => {}} />);
        expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument();
    });

    it('does not render a dismiss button without onDismiss', () => {
        render(<EdNotification severity="info" title="X" />);
        expect(screen.queryByRole('button', { name: /dismiss/i })).toBeNull();
    });

    it('fires onDismiss when the close button is clicked', async () => {
        const onDismiss = vi.fn();
        render(<EdNotification severity="info" title="X" onDismiss={onDismiss} />);
        await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
        expect(onDismiss).toHaveBeenCalledOnce();
    });

    it('compact variant hides description and actions', () => {
        render(
            <EdNotification
                severity="info"
                variant="compact"
                title="Synced"
                description="should not show"
                actions={<button>nope</button>}
            />,
        );
        expect(screen.getByText('Synced')).toBeInTheDocument();
        expect(screen.queryByText('should not show')).toBeNull();
        expect(screen.queryByRole('button', { name: 'nope' })).toBeNull();
    });

    it('renders provided actions in the default variant', () => {
        render(
            <EdNotification severity="warning" title="X" actions={<button>Upload</button>} />,
        );
        expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
    });
});
