import {
    forwardRef,
    type ReactNode,
} from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import styles from './EdTooltip.module.scss';

export type EdTooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface EdTooltipProps {
    /** The trigger. Must be a single focusable element (button, link, etc.). */
    children: ReactNode;
    /**
     * Simple label content. Ignored when `title` + `body` are provided (rich variant).
     * For icon-only buttons, this MUST match the trigger's aria-label.
     */
    label?: ReactNode;
    /** Rich variant — heading. Pairs with `body`. */
    title?: ReactNode;
    /** Rich variant — description text. */
    body?: ReactNode;
    /** Optional keyboard-shortcut chip rendered after a simple label. */
    kbd?: ReactNode;
    /** Placement. Auto-flips when it would clip the viewport. Default "top". */
    side?: EdTooltipSide;
    /** Open delay in ms. Default 500 (Radix groups subsequent hovers via the Provider). */
    delayDuration?: number;
    /** Disable the tooltip (renders the trigger bare). */
    disabled?: boolean;
    /** Controlled open. */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Distance from the trigger in px. Default 6. */
    sideOffset?: number;
}

/**
 * EdTooltip — anchored, transient label on hover / focus. Read-only hints only.
 * For interactive content use EdPopover.
 *
 * Wrap your app (or a subtree) once in <EdTooltipProvider> so grouped hovers
 * skip the open delay; the component also lazily provides its own if absent.
 *
 *   <EdTooltip label="Filters">
 *     <EdIconButton aria-label="Filters" icon={<EdIcon name="Filter" />} />
 *   </EdTooltip>
 *
 *   <EdTooltip label="Save draft" kbd="⌘S">
 *     <EdButton variant="secondary">Save draft</EdButton>
 *   </EdTooltip>
 *
 *   <EdTooltip
 *     title="MRIA"
 *     body="Matter Requiring Immediate Attention. Highest severity."
 *   >
 *     <span tabIndex={0} className="dotted">MRIA</span>
 *   </EdTooltip>
 */
export const EdTooltip = forwardRef<HTMLButtonElement, EdTooltipProps>(function EdTooltip(
    {
        children,
        label,
        title,
        body,
        kbd,
        side = 'top',
        delayDuration = 500,
        disabled = false,
        open,
        defaultOpen,
        onOpenChange,
        sideOffset = 6,
    },
    _ref,
) {
    if (disabled) {
        return <>{children}</>;
    }

    const isRich = title != null || body != null;

    return (
        <RadixTooltip.Root
            delayDuration={delayDuration}
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
        >
            <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
            <RadixTooltip.Portal>
                <RadixTooltip.Content
                    data-ed-tooltip-content
                    side={side}
                    sideOffset={sideOffset}
                    collisionPadding={8}
                    className={[styles.content, isRich && styles.rich].filter(Boolean).join(' ')}
                >
                    {isRich ? (
                        <>
                            {title && <p className={styles.title}>{title}</p>}
                            {body && <p className={styles.body}>{body}</p>}
                        </>
                    ) : (
                        <span className={styles.labelRow}>
                            <span className={styles.label}>{label}</span>
                            {kbd && <span className={styles.kbd}>{kbd}</span>}
                        </span>
                    )}
                    <RadixTooltip.Arrow className={styles.arrow} width={10} height={5} />
                </RadixTooltip.Content>
            </RadixTooltip.Portal>
        </RadixTooltip.Root>
    );
});

/**
 * EdTooltipProvider — wrap once near the app root. Sets the shared delay and the
 * "skipDelayDuration" window so moving between adjacent tooltips is instant.
 */
export const EdTooltipProvider = RadixTooltip.Provider;
