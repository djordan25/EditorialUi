import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ElementRef,
    type ReactNode,
} from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import styles from './EdTabs.module.scss';

export type EdTabsVariant = 'underline' | 'segmented';

export interface EdTabItem {
    /** Unique value — also the URL ?tab= token. */
    value: string;
    /** Visible label. */
    label: ReactNode;
    /** Optional count pill — folded into the accessible name. */
    count?: number;
    /** Optional leading icon. */
    icon?: ReactNode;
    /** Optional trailing status dot — pass a CSS color. */
    statusDot?: string;
    disabled?: boolean;
    /** Panel content. Omit if you render panels yourself elsewhere. */
    content?: ReactNode;
}

type RadixRootProps = ComponentPropsWithoutRef<typeof RadixTabs.Root>;

export interface EdTabsProps extends Omit<RadixRootProps, 'orientation'> {
    items: EdTabItem[];
    /** underline (page-level, default) or segmented (inline toolbars, 2–4 short labels). */
    variant?: EdTabsVariant;
    /**
     * Activation mode. "automatic" (default) selects on focus; "manual" requires
     * Enter/Space — use for async panels so arrowing doesn't fire fetches.
     */
    activationMode?: 'automatic' | 'manual';
    /** className on the tablist. */
    listClassName?: string;
}

/**
 * EdTabs — mutually-exclusive sibling views under one heading. Radix-backed.
 * Always pair with content; never tabs that just jump-scroll. >7 tabs → sidebar nav.
 * Encode the active tab in ?tab=<value> at the call site for shareable URLs.
 *
 *   <EdTabs
 *     defaultValue="overview"
 *     items={[
 *       { value: 'overview', label: 'Overview', content: <Overview/> },
 *       { value: 'findings', label: 'Findings', count: 23, content: <Findings/> },
 *     ]}
 *   />
 */
export const EdTabs = forwardRef<ElementRef<typeof RadixTabs.Root>, EdTabsProps>(
    function EdTabs(
        { items, variant = 'underline', activationMode = 'automatic', className, listClassName, ...rest },
        ref,
    ) {
        const hasPanels = items.some((it) => it.content !== undefined);

        return (
            <RadixTabs.Root
                ref={ref}
                activationMode={activationMode}
                className={[styles.root, className].filter(Boolean).join(' ')}
                {...rest}
            >
                <RadixTabs.List
                    className={[
                        styles.list,
                        variant === 'segmented' ? styles.segmented : styles.underline,
                        listClassName,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {items.map((item) => {
                        const ariaLabel =
                            typeof item.label === 'string' && typeof item.count === 'number'
                                ? `${item.label}, ${item.count}`
                                : undefined;
                        return (
                            <RadixTabs.Trigger
                                key={item.value}
                                value={item.value}
                                disabled={item.disabled}
                                aria-label={ariaLabel}
                                className={styles.trigger}
                            >
                                {item.icon && (
                                    <span className={styles.icon} aria-hidden>
                                        {item.icon}
                                    </span>
                                )}
                                <span className={styles.label}>{item.label}</span>
                                {typeof item.count === 'number' && (
                                    <span className={styles.count} aria-hidden>
                                        {item.count}
                                    </span>
                                )}
                                {item.statusDot && (
                                    <span
                                        className={styles.statusDot}
                                        style={{ background: item.statusDot }}
                                        aria-hidden
                                    />
                                )}
                            </RadixTabs.Trigger>
                        );
                    })}
                </RadixTabs.List>
                {hasPanels &&
                    items.map((item) =>
                        item.content !== undefined ? (
                            <RadixTabs.Content key={item.value} value={item.value} className={styles.panel}>
                                {item.content}
                            </RadixTabs.Content>
                        ) : null,
                    )}
            </RadixTabs.Root>
        );
    },
);
