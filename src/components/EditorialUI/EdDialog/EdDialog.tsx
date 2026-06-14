import {
    forwardRef,
    type ReactNode,
} from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import styles from './EdDialog.module.scss';

export type EdDialogSize = 'sm' | 'md' | 'lg' | 'xl';

export interface EdDialogProps {
    /** Controlled open state. */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Optional trigger — pass an element to wrap it as the dialog's trigger. */
    trigger?: ReactNode;

    /** Header title. Wired to aria-labelledby. Omit for a content-led dialog. */
    title?: ReactNode;
    /** Mono subtitle — IDs, timestamps. */
    subtitle?: ReactNode;
    /** Body content. Scrolls when it exceeds the available height. */
    children: ReactNode;
    /** Footer actions — right-aligned. Usually EdButtons. */
    footer?: ReactNode;
    /** Optional footer meta on the left (shortcut hint, doc link). */
    footerMeta?: ReactNode;

    size?: EdDialogSize;
    /** Danger styling — colors the title. Use for destructive confirmations. */
    danger?: boolean;
    /** Hide the close (×) button in the header. */
    hideClose?: boolean;
    /** Disable overlay-click + Esc to close — use for unsaved-form guards. */
    preventOutsideClose?: boolean;
    /** Accessible description id wiring — pass a short summary for screen readers. */
    description?: ReactNode;
    /** className on the dialog panel. */
    className?: string;
    /** Forwarded to the dialog element — e.g. aria-busy during a guarded operation. */
    'aria-busy'?: boolean;
}

const sizeClass: Record<EdDialogSize, string> = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
    xl: styles.xl,
};

/**
 * EdDialog — Radix-based modal surface. Overlay, focus trap, header/body/footer.
 * For the common confirm case, use EdConfirmation (below) which presets the layout.
 *
 *   <EdDialog
 *     open={open}
 *     onOpenChange={setOpen}
 *     title="Reopen finding"
 *     subtitle="F-2438 · CLOSED 2026-03-22"
 *     footer={<><EdButton variant="ghost">Cancel</EdButton><EdButton>Reopen</EdButton></>}
 *   >
 *     Re-attach to the active validation queue. Reviewer notes preserved.
 *   </EdDialog>
 */
export const EdDialog = forwardRef<HTMLDivElement, EdDialogProps>(function EdDialog(
    {
        open,
        defaultOpen,
        onOpenChange,
        trigger,
        title,
        subtitle,
        children,
        footer,
        footerMeta,
        size = 'md',
        danger = false,
        hideClose = false,
        preventOutsideClose = false,
        description,
        className,
        'aria-busy': ariaBusy,
    },
    ref,
) {
    return (
        <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
            {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
            <RadixDialog.Portal>
                <RadixDialog.Overlay className={styles.overlay} />
                <RadixDialog.Content
                    ref={ref}
                    className={[
                        styles.dialog,
                        sizeClass[size],
                        danger && styles.danger,
                        className,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    aria-busy={ariaBusy}
                    onInteractOutside={(e) => {
                        if (preventOutsideClose) e.preventDefault();
                    }}
                    onEscapeKeyDown={(e) => {
                        if (preventOutsideClose) e.preventDefault();
                    }}
                    aria-describedby={description ? undefined : undefined}
                >
                    {(title || !hideClose) && (
                        <div className={styles.header}>
                            <div className={styles.headerBody}>
                                {title && (
                                    <RadixDialog.Title className={styles.title}>
                                        {title}
                                    </RadixDialog.Title>
                                )}
                                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                            </div>
                            {!hideClose && (
                                <RadixDialog.Close asChild>
                                    <button type="button" className={styles.close} aria-label="Close">
                                        <X size={16} strokeWidth={2} aria-hidden />
                                    </button>
                                </RadixDialog.Close>
                            )}
                        </div>
                    )}

                    {description && (
                        <RadixDialog.Description className={styles.srOnly}>
                            {description}
                        </RadixDialog.Description>
                    )}

                    <div className={styles.body}>{children}</div>

                    {footer && (
                        <div
                            className={[styles.footer, footerMeta && styles.footerWithMeta]
                                .filter(Boolean)
                                .join(' ')}
                        >
                            {footerMeta && <span className={styles.footerMeta}>{footerMeta}</span>}
                            <div className={styles.footerActions}>{footer}</div>
                        </div>
                    )}
                </RadixDialog.Content>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
});

/* ------------------------------------------------------------------ */
/* EdConfirmation — preset for the destructive / confirm case.        */
/* ------------------------------------------------------------------ */

export interface EdConfirmationProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title: ReactNode;
    subtitle?: ReactNode;
    /** The body copy explaining the consequence. */
    children: ReactNode;
    /** Confirm button label. Default "Confirm". */
    confirmLabel?: string;
    /** Cancel button label. Default "Cancel". */
    cancelLabel?: string;
    /** Destructive styling + red confirm button. */
    danger?: boolean;
    /** Confirm handler. */
    onConfirm: () => void;
    /** Render-prop for the confirm/cancel buttons — pass your EdButton instances.
     *  When omitted, native fallback buttons are used (the handoff app should
     *  pass EdButtons to match the design system). */
    renderActions?: (api: {
        confirm: () => void;
        cancel: () => void;
        confirmLabel: string;
        cancelLabel: string;
        danger: boolean;
    }) => ReactNode;
}

/**
 * EdConfirmation — the 90% confirm/destructive case on top of EdDialog.
 *
 *   <EdConfirmation
 *     open={open}
 *     onOpenChange={setOpen}
 *     danger
 *     title="Delete audit period"
 *     subtitle="2025-Q4 · 312 findings"
 *     confirmLabel="Delete period"
 *     onConfirm={handleDelete}
 *     renderActions={({ confirm, cancel, confirmLabel, cancelLabel, danger }) => (
 *       <>
 *         <EdButton variant="ghost" onClick={cancel}>{cancelLabel}</EdButton>
 *         <EdButton variant={danger ? 'danger' : 'primary'} onClick={confirm}>{confirmLabel}</EdButton>
 *       </>
 *     )}
 *   >
 *     All findings, evidence, and audit log entries will be permanently removed.
 *   </EdConfirmation>
 */
export function EdConfirmation({
    open,
    onOpenChange,
    title,
    subtitle,
    children,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    danger = false,
    onConfirm,
    renderActions,
}: EdConfirmationProps) {
    const cancel = () => onOpenChange?.(false);
    const confirm = () => {
        onConfirm();
        onOpenChange?.(false);
    };

    const actions = renderActions ? (
        renderActions({ confirm, cancel, confirmLabel, cancelLabel, danger })
    ) : (
        <>
            <button type="button" className={styles.fallbackGhost} onClick={cancel}>
                {cancelLabel}
            </button>
            <button
                type="button"
                className={danger ? styles.fallbackDanger : styles.fallbackPrimary}
                onClick={confirm}
            >
                {confirmLabel}
            </button>
        </>
    );

    return (
        <EdDialog
            open={open}
            onOpenChange={onOpenChange}
            size="sm"
            danger={danger}
            title={title}
            subtitle={subtitle}
            footer={actions}
        >
            {children}
        </EdDialog>
    );
}
