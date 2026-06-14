import {
    forwardRef,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import styles from './EdDrawer.module.scss';

export type EdDrawerSize = 'sm' | 'md' | 'lg' | 'xl';
export type EdDrawerSide = 'right' | 'left';

export interface EdDrawerProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: ReactNode;

    /** Entity-type + ID eyebrow above the title — e.g. "FINDING · F-2438". */
    crumb?: ReactNode;
    /** Drawer title — wired to aria-labelledby. */
    title?: ReactNode;
    /** Body content. Use EdDrawerSection to divide into labelled groups. */
    children: ReactNode;
    /** Footer actions — right-aligned. Optional for read-only drawers. */
    footer?: ReactNode;

    size?: EdDrawerSize;
    /** Edge to dock to. Default "right". */
    side?: EdDrawerSide;
    /**
     * `false` (default) — non-modal: the page stays interactive, no overlay.
     *   The drawer updates in place as the underlying list selection changes.
     * `true` — modal: focus trap + overlay, for dedicated edit workflows.
     */
    modal?: boolean;
    /** Disable Esc / overlay close — for unsaved-change guards. */
    preventClose?: boolean;
    /** Screen-reader description (also feeds the live-region open announcement). */
    description?: ReactNode;
    className?: string;
}

const sizeClass: Record<EdDrawerSize, string> = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
    xl: styles.xl,
};

/**
 * EdDrawer — right-edge sliding panel for row-contextual detail. Inspect a finding
 * while keeping the list visible; quick edits without leaving the page.
 *
 * Non-modal by default (page stays interactive). Set `modal` for focused edits.
 * Encode open state in the URL (?drawer=<id>) at the call site for deep-linking.
 *
 *   <EdDrawer open={!!sel} onOpenChange={(o) => !o && clearSel()}
 *     crumb="FINDING · F-2438" title="Stale model documentation"
 *     footer={<EdButton>Open finding</EdButton>}>
 *     <EdDrawerSection label="Status">…</EdDrawerSection>
 *   </EdDrawer>
 */
export const EdDrawer = forwardRef<HTMLDivElement, EdDrawerProps>(function EdDrawer(
    {
        open,
        defaultOpen,
        onOpenChange,
        trigger,
        crumb,
        title,
        children,
        footer,
        size = 'md',
        side = 'right',
        modal = false,
        preventClose = false,
        description,
        className,
    },
    ref,
) {
    return (
        <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
            {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
            <RadixDialog.Portal>
                {modal && <RadixDialog.Overlay className={styles.overlay} />}
                <RadixDialog.Content
                    ref={ref}
                    className={[
                        styles.drawer,
                        sizeClass[size],
                        side === 'left' ? styles.left : styles.right,
                        className,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    onInteractOutside={(e) => {
                        // Non-modal: never auto-close on outside interaction (page is live).
                        if (!modal || preventClose) e.preventDefault();
                    }}
                    onEscapeKeyDown={(e) => {
                        if (preventClose) e.preventDefault();
                    }}
                >
                    <div className={styles.header}>
                        <div className={styles.headerBody}>
                            {crumb && <span className={styles.crumb}>{crumb}</span>}
                            {title && (
                                <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
                            )}
                        </div>
                        <RadixDialog.Close asChild>
                            <button type="button" className={styles.close} aria-label="Close drawer">
                                <X size={16} strokeWidth={2} aria-hidden />
                            </button>
                        </RadixDialog.Close>
                    </div>

                    {description && (
                        <RadixDialog.Description className={styles.srOnly}>
                            {description}
                        </RadixDialog.Description>
                    )}

                    <div className={styles.body}>{children}</div>

                    {footer && <div className={styles.footer}>{footer}</div>}
                </RadixDialog.Content>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
});

/* ---- Body section ---- */

export interface EdDrawerSectionProps extends HTMLAttributes<HTMLDivElement> {
    /** Mono uppercase section label. */
    label?: ReactNode;
    children: ReactNode;
}

export const EdDrawerSection = forwardRef<HTMLDivElement, EdDrawerSectionProps>(
    function EdDrawerSection({ label, className, children, ...rest }, ref) {
        return (
            <div ref={ref} className={[styles.section, className].filter(Boolean).join(' ')} {...rest}>
                {label && <p className={styles.sectionLabel}>{label}</p>}
                {children}
            </div>
        );
    },
);

/** Alias — some surfaces refer to this as a side panel. Same component. */
export const EdSidePanel = EdDrawer;
