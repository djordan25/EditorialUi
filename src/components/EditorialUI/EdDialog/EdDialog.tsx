import {
    forwardRef,
    type CSSProperties,
    type ReactNode,
} from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import styles from './EdDialog.module.scss';

export type EdDialogSize = 'sm' | 'md' | 'lg' | 'xl';
export type EdDialogLayout = 'default' | 'composed';

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
    /**
     * Fine-grained close control. When set, overrides `preventOutsideClose` for
     * that vector — e.g. `dismissOnOutsideClick={false}` with `dismissOnEscape`
     * left unset gives "Escape closes, click-away doesn't". Leave both unset to
     * fall back to `preventOutsideClose`.
     */
    dismissOnOutsideClick?: boolean;
    dismissOnEscape?: boolean;
    /**
     * Render `title` into a visually-hidden node instead of the visible header.
     * The dialog keeps its accessible name (and a Radix Title, so no dev warning)
     * while you supply your own visible header/title bar in the body.
     */
    titleVisuallyHidden?: boolean;
    /**
     * 'default' wraps `children` in the scrolling body and renders the `footer`
     * prop as a pinned footer. 'composed' renders children raw so you can compose
     * <EdDialogBody> / <EdDialogActions> as direct children (with a custom header
     * or title bar between them).
     */
    layout?: EdDialogLayout;
    /** Accessible description id wiring — pass a short summary for screen readers. */
    description?: ReactNode;
    /** className on the dialog panel. */
    className?: string;
    /** Forwarded to the dialog element — e.g. aria-busy during a guarded operation. */
    'aria-busy'?: boolean;
    /** Accessible-name passthrough for a content-led dialog with no visible title. */
    'aria-label'?: string;
    /** Point the accessible name at your own heading node (advanced). */
    'aria-labelledby'?: string;
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
        dismissOnOutsideClick,
        dismissOnEscape,
        titleVisuallyHidden = false,
        layout = 'default',
        description,
        className,
        'aria-busy': ariaBusy,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
    },
    ref,
) {
    // Per-vector close control: an explicit dismissOn* wins for its vector;
    // otherwise both fall back to the combined preventOutsideClose flag.
    const blockOutsideClose =
        dismissOnOutsideClick !== undefined ? !dismissOnOutsideClick : preventOutsideClose;
    const blockEscapeClose =
        dismissOnEscape !== undefined ? !dismissOnEscape : preventOutsideClose;

    const showVisibleTitle = Boolean(title) && !titleVisuallyHidden;
    const showHeader =
        showVisibleTitle || (Boolean(subtitle) && !titleVisuallyHidden) || !hideClose;
    // Keep an accessible name (and a Radix Title, so no dev warning) when the
    // visible title is suppressed — unless the caller points aria-labelledby at
    // their own node.
    const srTitleText = title ?? ariaLabel;
    const renderSrTitle = !showVisibleTitle && ariaLabelledby == null && srTitleText != null;

    // Only override Radix's aria-* when explicitly provided — passing `undefined`
    // through would blow away Radix's own aria-labelledby (the title wiring).
    const ariaOverrides: { 'aria-label'?: string; 'aria-labelledby'?: string } = {};
    if (ariaLabel != null) ariaOverrides['aria-label'] = ariaLabel;
    if (ariaLabelledby != null) ariaOverrides['aria-labelledby'] = ariaLabelledby;

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
                    {...ariaOverrides}
                    onPointerDownOutside={(e) => {
                        if (blockOutsideClose) e.preventDefault();
                    }}
                    onInteractOutside={(e) => {
                        if (blockOutsideClose) e.preventDefault();
                    }}
                    onEscapeKeyDown={(e) => {
                        if (blockEscapeClose) e.preventDefault();
                    }}
                >
                    {showHeader && (
                        <div className={styles.header}>
                            <div className={styles.headerBody}>
                                {showVisibleTitle && (
                                    <RadixDialog.Title className={styles.title}>
                                        {title}
                                    </RadixDialog.Title>
                                )}
                                {subtitle && !titleVisuallyHidden && (
                                    <p className={styles.subtitle}>{subtitle}</p>
                                )}
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

                    {layout === 'composed' ? (
                        children
                    ) : (
                        <div className={styles.body}>{children}</div>
                    )}

                    {layout === 'default' && footer && (
                        <div
                            className={[styles.footer, footerMeta && styles.footerWithMeta]
                                .filter(Boolean)
                                .join(' ')}
                        >
                            {footerMeta && <span className={styles.footerMeta}>{footerMeta}</span>}
                            <div className={styles.footerActions}>{footer}</div>
                        </div>
                    )}

                    {/* Rendered last so it never displaces the `.body:first-child`
                        top-padding rule when there's no visible header. */}
                    {renderSrTitle && (
                        <RadixDialog.Title className={styles.srOnly}>
                            {srTitleText}
                        </RadixDialog.Title>
                    )}
                </RadixDialog.Content>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
});

/* ------------------------------------------------------------------ */
/* Compound slots — for layout="composed" (custom header / title bar). */
/* ------------------------------------------------------------------ */

export interface EdDialogBodyProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

/** The scrolling body region. Place inside an <EdDialog layout="composed">. */
export function EdDialogBody({ children, className, style }: EdDialogBodyProps) {
    return (
        <div className={[styles.body, className].filter(Boolean).join(' ')} style={style}>
            {children}
        </div>
    );
}

export interface EdDialogActionsProps {
    children: ReactNode;
    /** Left-aligned footer meta (shortcut hint, autosave status). */
    meta?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

/** The pinned footer region. Place inside an <EdDialog layout="composed">. */
export function EdDialogActions({ children, meta, className, style }: EdDialogActionsProps) {
    return (
        <div
            className={[styles.footer, meta && styles.footerWithMeta, className]
                .filter(Boolean)
                .join(' ')}
            style={style}
        >
            {meta && <span className={styles.footerMeta}>{meta}</span>}
            <div className={styles.footerActions}>{children}</div>
        </div>
    );
}

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
