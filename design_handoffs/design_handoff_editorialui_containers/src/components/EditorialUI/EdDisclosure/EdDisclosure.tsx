import {
    forwardRef,
    useId,
    useState,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './EdDisclosure.module.scss';

export interface EdDisclosureProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onToggle'> {
    /** Trigger label — mono eyebrow style. */
    label: ReactNode;
    /** The hidden content. */
    children: ReactNode;
    /** Controlled open state. */
    open?: boolean;
    /** Uncontrolled initial open state. Default false. */
    defaultOpen?: boolean;
    /** Fires with the next open state on toggle. */
    onOpenChange?: (open: boolean) => void;
}

/**
 * EdDisclosure — inline show/hide for a single secondary block. Lighter than an
 * accordion (no border, no panel chrome). For 2+ related blocks use EdAccordion.
 * Don't hide default/common content — this is for the user who wants more.
 *
 *   <EdDisclosure label="Advanced metadata">
 *     <dl>…</dl>
 *   </EdDisclosure>
 */
export const EdDisclosure = forwardRef<HTMLDivElement, EdDisclosureProps>(function EdDisclosure(
    { label, children, open, defaultOpen = false, onOpenChange, className, ...rest },
    ref,
) {
    const autoId = useId();
    const panelId = `ed-disc-${autoId}`;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = open !== undefined ? open : internalOpen;

    const toggle = () => {
        const next = !isOpen;
        if (open === undefined) setInternalOpen(next);
        onOpenChange?.(next);
    };

    return (
        <div ref={ref} className={[styles.root, className].filter(Boolean).join(' ')} {...rest}>
            <button
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={toggle}
            >
                <ChevronRight
                    size={12}
                    strokeWidth={1.8}
                    className={[styles.chev, isOpen && styles.chevOpen].filter(Boolean).join(' ')}
                    aria-hidden
                />
                {label}
            </button>
            {isOpen && (
                <div id={panelId} className={styles.panel}>
                    {children}
                </div>
            )}
        </div>
    );
});
