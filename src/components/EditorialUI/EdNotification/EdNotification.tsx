import {
    forwardRef,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import styles from './EdNotification.module.scss';

export type EdNotificationSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface EdNotificationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Severity drives color, icon, and the implicit ARIA role / live politeness. */
    severity?: EdNotificationSeverity;
    /** Banner title — sentence case, no trailing period. */
    title: ReactNode;
    /** Optional supporting text below the title. */
    description?: ReactNode;
    /** 0–2 action buttons (use EdButton ghost / secondary — never primary). */
    actions?: ReactNode;
    /** Fires the dismiss flow. When provided, renders the close button. */
    onDismiss?: () => void;
    /** Override the dismiss button aria-label. */
    dismissLabel?: string;
    /** Override the leading icon. Defaults to the severity icon. */
    icon?: ReactNode;
    /**
     * `rail` (default) — 3px colored left stripe on surface-1.
     * `subtle` — no rail, surface-2 background. Use inside cards.
     * `compact` — single line, title only, reduced padding.
     */
    variant?: 'rail' | 'subtle' | 'compact';
    /**
     * Force the ARIA role. Defaults: info/success → "status" (aria-live polite),
     * warning/danger → "alert" (assertive). Set "none" to opt out (e.g. a banner
     * that's always present on load, not announced).
     */
    role?: 'status' | 'alert' | 'none';
}

const severityIcon: Record<EdNotificationSeverity, ReactNode> = {
    info: <Info size={18} strokeWidth={1.8} aria-hidden />,
    success: <CheckCircle2 size={18} strokeWidth={1.8} aria-hidden />,
    warning: <AlertTriangle size={18} strokeWidth={1.8} aria-hidden />,
    danger: <XCircle size={18} strokeWidth={1.8} aria-hidden />,
};

const severityClass: Record<EdNotificationSeverity, string> = {
    info: styles.info,
    success: styles.success,
    warning: styles.warning,
    danger: styles.danger,
};

/**
 * EdNotification — inline banner for page- or section-level state that persists
 * until acknowledged or the condition resolves. NOT for transient confirmations
 * (use a toast). NOT in place of content (use EdEmptyState).
 *
 *   <EdNotification severity="warning" title="Evidence required within 14 days"
 *     description="Findings without evidence by April 18 will reopen."
 *     actions={<EdButton size="sm" variant="secondary">Upload evidence</EdButton>} />
 */
export const EdNotification = forwardRef<HTMLDivElement, EdNotificationProps>(
    function EdNotification(
        {
            severity = 'info',
            title,
            description,
            actions,
            onDismiss,
            dismissLabel = 'Dismiss notification',
            icon,
            variant = 'rail',
            role,
            className,
            ...rest
        },
        ref,
    ) {
        const resolvedRole =
            role === 'none'
                ? undefined
                : role ?? (severity === 'warning' || severity === 'danger' ? 'alert' : 'status');
        const ariaLive =
            resolvedRole === 'alert'
                ? 'assertive'
                : resolvedRole === 'status'
                ? 'polite'
                : undefined;

        return (
            <div
                ref={ref}
                role={resolvedRole}
                aria-live={ariaLive}
                className={[
                    styles.root,
                    severityClass[severity],
                    variant === 'subtle' && styles.subtle,
                    variant === 'compact' && styles.compact,
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
                {...rest}
            >
                <span className={styles.icon}>{icon ?? severityIcon[severity]}</span>
                <div className={styles.body}>
                    <p className={styles.title}>{title}</p>
                    {description && variant !== 'compact' && (
                        <p className={styles.desc}>{description}</p>
                    )}
                    {actions && variant !== 'compact' && (
                        <div className={styles.actions}>{actions}</div>
                    )}
                </div>
                {onDismiss && (
                    <button
                        type="button"
                        className={styles.close}
                        aria-label={dismissLabel}
                        onClick={onDismiss}
                    >
                        <X size={14} strokeWidth={2} aria-hidden />
                    </button>
                )}
            </div>
        );
    },
);
