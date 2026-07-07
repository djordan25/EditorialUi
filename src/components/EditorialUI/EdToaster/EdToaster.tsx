import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { EdNotification } from '../EdNotification';
import {
    dismissToast,
    getServerToasts,
    getToasts,
    subscribeToasts,
    type EdToastRecord,
} from './toastStore';
import styles from './EdToaster.module.scss';

export type EdToasterPosition =
    | 'top-center'
    | 'top-right'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'bottom-left';

export interface EdToasterProps {
    /** Where the stack anchors. Default `top-center`. */
    position?: EdToasterPosition;
    /** Default auto-dismiss (ms). Per-toast `duration` overrides; `null` = sticky. Default 7000. */
    duration?: number | null;
    /** Max visible toasts; extra (oldest) are hidden until they expire or dismiss. */
    max?: number;
    /** Accessible name for the toast region. Default "Notifications". */
    ariaLabel?: string;
}

const positionClass: Record<EdToasterPosition, string> = {
    'top-center': styles.topCenter,
    'top-right': styles.topRight,
    'top-left': styles.topLeft,
    'bottom-center': styles.bottomCenter,
    'bottom-right': styles.bottomRight,
    'bottom-left': styles.bottomLeft,
};

const EXIT_MS = 160;

/**
 * EdToaster — the toast host. Mount ONE near the app root; then call the imperative
 * `toast.*()` API from anywhere to show transient, auto-dismissing notifications.
 * Each toast reuses EdNotification for its visuals + ARIA live-region politeness.
 *
 *   // app root:
 *   <EdToaster position="top-center" />
 *   // anywhere:
 *   toast.success('Saved');
 */
export function EdToaster({
    position = 'top-center',
    duration = 7000,
    max,
    ariaLabel = 'Notifications',
}: EdToasterProps) {
    const toasts = useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);

    if (typeof document === 'undefined') return null;

    const visible = max != null && max >= 0 ? toasts.slice(-max) : toasts;

    return createPortal(
        <div className={[styles.viewport, positionClass[position]].join(' ')} role="region" aria-label={ariaLabel}>
            {visible.map((t) => (
                <EdToastItem key={t.id} toast={t} defaultDuration={duration} />
            ))}
        </div>,
        document.body,
    );
}

interface EdToastItemProps {
    toast: EdToastRecord;
    defaultDuration: number | null;
}

function EdToastItem({ toast: t, defaultDuration }: EdToastItemProps) {
    const [leaving, setLeaving] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const duration = t.duration !== undefined ? t.duration : defaultDuration;

    const clearTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = undefined;
    }, []);

    const close = useCallback(() => {
        clearTimer();
        setLeaving(true);
        setTimeout(() => dismissToast(t.id), EXIT_MS);
    }, [clearTimer, t.id]);

    const startTimer = useCallback(() => {
        clearTimer();
        if (duration == null) return;
        timerRef.current = setTimeout(close, duration);
    }, [clearTimer, close, duration]);

    useEffect(() => {
        startTimer();
        return clearTimer;
    }, [startTimer, clearTimer]);

    return (
        <div
            className={[styles.item, leaving && styles.leaving].filter(Boolean).join(' ')}
            onMouseEnter={clearTimer}
            onMouseLeave={startTimer}
        >
            <EdNotification
                severity={t.severity}
                title={t.title}
                description={t.description}
                actions={t.actions}
                icon={t.icon}
                dismissLabel={t.dismissLabel}
                onDismiss={close}
            />
        </div>
    );
}
