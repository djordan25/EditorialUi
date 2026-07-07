import type { ReactNode } from 'react';
import type { EdNotificationSeverity } from '../EdNotification';

export interface EdToastOptions {
    /** Provide to update an existing toast in place (same id replaces). */
    id?: string;
    /** Supporting text below the title. */
    description?: ReactNode;
    /** Auto-dismiss delay in ms. `null` keeps it until dismissed. Omit to use the EdToaster default. */
    duration?: number | null;
    /** 0–2 action buttons (EdButton ghost/secondary). */
    actions?: ReactNode;
    /** Override the leading severity icon. */
    icon?: ReactNode;
    /** Override the dismiss button aria-label. */
    dismissLabel?: string;
}

export interface EdToastRecord extends EdToastOptions {
    id: string;
    severity: EdNotificationSeverity;
    title: ReactNode;
}

const EMPTY: EdToastRecord[] = [];
let toasts: EdToastRecord[] = EMPTY;
const listeners = new Set<() => void>();
let counter = 0;

function emit() {
    for (const l of listeners) l();
}

/** Subscribe to store changes (for useSyncExternalStore). */
export function subscribeToasts(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

/** Current toasts — a stable reference between mutations. */
export function getToasts(): EdToastRecord[] {
    return toasts;
}

/** Server snapshot — always empty (toasts are client-only). */
export function getServerToasts(): EdToastRecord[] {
    return EMPTY;
}

function upsert(record: Omit<EdToastRecord, 'id'> & { id?: string }): string {
    const id = record.id ?? `ed-toast-${++counter}`;
    const next: EdToastRecord = { ...record, id };
    toasts = toasts.some((t) => t.id === id)
        ? toasts.map((t) => (t.id === id ? next : t))
        : [...toasts, next];
    emit();
    return id;
}

/** Remove a toast by id. No-op if it's already gone. */
export function dismissToast(id: string): void {
    if (!toasts.some((t) => t.id === id)) return;
    toasts = toasts.filter((t) => t.id !== id);
    emit();
}

/** Remove every toast. */
export function clearToasts(): void {
    if (toasts.length === 0) return;
    toasts = EMPTY;
    emit();
}

function make(severity: EdNotificationSeverity) {
    return (title: ReactNode, options: EdToastOptions = {}): string =>
        upsert({ severity, title, ...options });
}

/**
 * Imperative toast API. Call from anywhere (event handlers, Redux effects, etc.)
 * and mount a single `<EdToaster />` near the app root to display them.
 *
 *   toast.success('Finding reopened');
 *   toast.danger('Upload failed', { description: 'Retry in a moment.', duration: null });
 *   const id = toast.info('Saving…', { duration: null });
 *   toast.dismiss(id);
 */
export const toast = {
    /** Show a toast with an explicit severity (default `info`). */
    show(options: EdToastOptions & { title: ReactNode; severity?: EdNotificationSeverity }): string {
        const { severity = 'info', title, ...rest } = options;
        return upsert({ severity, title, ...rest });
    },
    info: make('info'),
    success: make('success'),
    warning: make('warning'),
    danger: make('danger'),
    /** Alias for `danger`. */
    error: make('danger'),
    dismiss: dismissToast,
    clear: clearToasts,
};
