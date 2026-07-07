import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EdToaster } from './EdToaster';
import { clearToasts, getToasts, toast } from './toastStore';

afterEach(() => {
    act(() => clearToasts());
});

describe('toast store', () => {
    it('toast.* returns an id and records severity + title', () => {
        const id = toast.success('Saved', { duration: null });
        const rec = getToasts().find((t) => t.id === id);
        expect(rec?.severity).toBe('success');
        expect(rec?.title).toBe('Saved');
    });

    it('error is an alias for danger', () => {
        const id = toast.error('Boom', { duration: null });
        expect(getToasts().find((t) => t.id === id)?.severity).toBe('danger');
    });

    it('reusing an id updates the toast in place', () => {
        toast.info('Loading…', { id: 'job', duration: null });
        toast.success('Done', { id: 'job', duration: null });
        const matching = getToasts().filter((t) => t.id === 'job');
        expect(matching).toHaveLength(1);
        expect(matching[0].severity).toBe('success');
    });
});

describe('EdToaster', () => {
    it('renders a toast pushed via the imperative API', () => {
        render(<EdToaster />);
        act(() => {
            toast.success('Finding reopened', { duration: null });
        });
        expect(screen.getByText('Finding reopened')).toBeInTheDocument();
    });

    it('renders danger toasts with an assertive alert role', () => {
        render(<EdToaster />);
        act(() => {
            toast.danger('Upload failed', { duration: null });
        });
        expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
    });

    it('exposes a labeled toast region', () => {
        render(<EdToaster ariaLabel="App notifications" />);
        expect(screen.getByRole('region', { name: 'App notifications' })).toBeInTheDocument();
    });

    it('dismisses via the close button', async () => {
        render(<EdToaster />);
        act(() => {
            toast.info('Heads up', { duration: null });
        });
        await userEvent.click(screen.getByRole('button', { name: /dismiss/i }));
        await waitFor(() => expect(screen.queryByText('Heads up')).toBeNull());
    });

    it('toast.dismiss(id) removes a specific toast', () => {
        render(<EdToaster />);
        let id = '';
        act(() => {
            id = toast.info('A', { duration: null });
            toast.info('B', { duration: null });
        });
        expect(screen.getByText('A')).toBeInTheDocument();
        act(() => toast.dismiss(id));
        expect(screen.queryByText('A')).toBeNull();
        expect(screen.getByText('B')).toBeInTheDocument();
    });

    it('caps the visible stack with max (oldest hidden)', () => {
        render(<EdToaster max={2} />);
        act(() => {
            toast.info('one', { duration: null });
            toast.info('two', { duration: null });
            toast.info('three', { duration: null });
        });
        expect(screen.queryByText('one')).toBeNull();
        expect(screen.getByText('two')).toBeInTheDocument();
        expect(screen.getByText('three')).toBeInTheDocument();
    });

    it('auto-dismisses after the duration elapses', () => {
        vi.useFakeTimers();
        try {
            render(<EdToaster duration={1000} />);
            act(() => {
                toast.info('Transient');
            });
            expect(screen.getByText('Transient')).toBeInTheDocument();
            act(() => vi.advanceTimersByTime(1000)); // fires the auto-dismiss → exit animation
            act(() => vi.advanceTimersByTime(300)); // fires the exit-delay removal
            expect(screen.queryByText('Transient')).toBeNull();
        } finally {
            vi.useRealTimers();
        }
    });

    it('keeps a sticky toast (duration null) past the default delay', () => {
        vi.useFakeTimers();
        try {
            render(<EdToaster duration={1000} />);
            act(() => {
                toast.warning('Stays', { duration: null });
            });
            act(() => vi.advanceTimersByTime(5000));
            expect(screen.getByText('Stays')).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });
});
