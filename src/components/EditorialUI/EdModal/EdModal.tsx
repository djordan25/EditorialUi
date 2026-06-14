import {
    forwardRef,
    type ReactNode,
} from 'react';
import { EdDialog, type EdDialogSize } from '../EdDialog';
import styles from './EdModal.module.scss';

export type EdModalSize = EdDialogSize;

export interface EdModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: ReactNode;

    /** Title — verb-led question for confirmations, statement for forms. */
    title: ReactNode;
    /** Mono subtitle — context (model, period, ID). */
    subtitle?: ReactNode;
    /** Body content. */
    children: ReactNode;
    /** Footer actions — right-aligned. Compose EdButtons. */
    footer?: ReactNode;
    /** Left-aligned footer meta (shortcut hint, autosave status). */
    footerMeta?: ReactNode;

    size?: EdModalSize;
    danger?: boolean;
    preventOutsideClose?: boolean;

    /**
     * Busy state — sets aria-busy, dims + disables the body, and renders an
     * optional progress region above the footer. The footer itself stays
     * interactive so the user can cancel.
     */
    busy?: boolean;
    /** Optional node rendered in the busy progress region (e.g. an EdProgressMeter). */
    busyContent?: ReactNode;
    /** Live-region message announced when busy stage changes. */
    busyStatus?: string;
}

/**
 * EdModal — the convention layer over EdDialog. Use this for almost every modal;
 * it bakes in title/subtitle/body/footer + a busy state so the auth, finding,
 * and exam flows stay consistent.
 *
 *   <EdModal
 *     open={open} onOpenChange={setOpen}
 *     title="Reopen finding F-2438?"
 *     footer={<>
 *       <EdButton variant="ghost" onClick={cancel}>Cancel</EdButton>
 *       <EdButton onClick={reopen}>Reopen</EdButton>
 *     </>}
 *   >
 *     Closure timestamp will be cleared and the finding will re-enter the queue.
 *   </EdModal>
 *
 * Copy: title is a verb-led question (confirmation) or statement (form); the
 * primary action echoes the title verb ("Reopen", "Delete period") — never "OK".
 */
export const EdModal = forwardRef<HTMLDivElement, EdModalProps>(function EdModal(
    {
        open,
        onOpenChange,
        trigger,
        title,
        subtitle,
        children,
        footer,
        footerMeta,
        size = 'md',
        danger = false,
        preventOutsideClose = false,
        busy = false,
        busyContent,
        busyStatus,
    },
    ref,
) {
    return (
        <EdDialog
            ref={ref}
            open={open}
            onOpenChange={onOpenChange}
            trigger={trigger}
            title={title}
            subtitle={subtitle}
            size={size}
            danger={danger}
            // While busy, treat as a guarded form — don't let a stray click cancel work.
            preventOutsideClose={preventOutsideClose || busy}
            hideClose={busy}
            footer={footer}
            footerMeta={footerMeta}
            className={busy ? styles.busyDialog : undefined}
            aria-busy={busy || undefined}
        >
            <div className={busy ? styles.bodyBusy : undefined} aria-hidden={busy || undefined}>
                {children}
            </div>
            {busy && (busyContent || busyStatus) && (
                <div className={styles.busyRegion}>
                    {busyContent}
                    {busyStatus && (
                        <p className={styles.busyStatus} role="status" aria-live="polite">
                            {busyStatus}
                        </p>
                    )}
                </div>
            )}
        </EdDialog>
    );
});
