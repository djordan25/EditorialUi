import {
    Children,
    cloneElement,
    createContext,
    forwardRef,
    isValidElement,
    useCallback,
    useContext,
    useRef,
    type HTMLAttributes,
    type KeyboardEvent,
    type MouseEvent,
    type MutableRefObject,
    type ReactElement,
    type ReactNode,
    type SyntheticEvent,
} from 'react';
import styles from './EdTabList.module.scss';

export type EdTabValue = string | number;
export type EdTabListOrientation = 'horizontal' | 'vertical';
export type EdTabListVariant = 'underline' | 'segmented';

/** Deterministic id for a tab button — pair with `edTabPanelId` on the external panel. */
export const edTabId = (value: EdTabValue, base = 'ed'): string => `${base}-tab-${String(value)}`;
/** Deterministic id callers set on the matching `role="tabpanel"` container. */
export const edTabPanelId = (value: EdTabValue, base = 'ed'): string =>
    `${base}-tabpanel-${String(value)}`;

interface TabListContext {
    selectedValue: EdTabValue;
    onSelect: (value: EdTabValue, event: SyntheticEvent) => void;
    idBase: string | undefined;
}
const TabListCtx = createContext<TabListContext | null>(null);

export interface EdTabListProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    /** Selected tab value (number or string). Must match one tab's value (explicit or positional). */
    value: EdTabValue;
    /** Fired with the newly selected value and the originating event. */
    onValueChange: (value: EdTabValue, event: SyntheticEvent) => void;
    /** Layout + keyboard axis. Default `horizontal`. */
    orientation?: EdTabListOrientation;
    /** `underline` (page-level, default) or `segmented` (inline toolbars). */
    variant?: EdTabListVariant;
    /**
     * Namespace for the generated tab/panel ids (default `ed`). If you render more than one
     * EdTabList on a page — especially with external panels — give each a distinct `idBase`
     * and pass the same base to `edTabPanelId`/`edTabId` so ids stay unique and in sync.
     */
    idBase?: string;
    /** `<EdTab>` children. */
    children: ReactNode;
}

export interface EdTabProps {
    /**
     * Identifies the tab for selection and id generation. Falls back to the child index
     * when omitted. Tab values must be UNIQUE within a list: either give every tab an
     * explicit value, or let them all fall back to their index — do not mix explicit
     * integer values with positional ones, and pass explicit values for
     * conditionally-rendered tabs (whose index would otherwise shift).
     */
    value?: EdTabValue;
    /** Visible label. */
    label: ReactNode;
    /** Optional leading icon. */
    icon?: ReactNode;
    /** Optional count pill — folded into the accessible name. */
    count?: number;
    disabled?: boolean;
    className?: string;
}

type EnumeratedTab = ReactElement<EdTabProps & { __index?: number }>;

/**
 * EdTabList — a strip-only, compound tab bar. Renders ONLY the `role="tablist"`
 * of tabs; you render the panels yourself (anywhere) and wire them with
 * `edTabPanelId(value)` / `edTabId(value)`. Supports numeric or string values
 * (with positional fallback), horizontal/vertical orientation, and roving-tabindex
 * keyboard nav. For self-contained tabs + internal panels, use EdTabs instead.
 *
 *   <EdTabList value={tab} onValueChange={(v) => setTab(v)} aria-label="Model views">
 *     <EdTab value="overview" label="Overview" />
 *     <EdTab value="findings" label="Findings" count={23} />
 *   </EdTabList>
 *   <div role="tabpanel" id={edTabPanelId(tab)} aria-labelledby={edTabId(tab)}>…</div>
 */
export const EdTabList = forwardRef<HTMLDivElement, EdTabListProps>(function EdTabList(
    {
        value,
        onValueChange,
        orientation = 'horizontal',
        variant = 'underline',
        idBase,
        className,
        children,
        ...rest
    },
    ref,
) {
    const listRef = useRef<HTMLDivElement | null>(null);
    const setRefs = useCallback(
        (node: HTMLDivElement | null) => {
            listRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as MutableRefObject<HTMLDivElement | null>).current = node;
        },
        [ref],
    );

    const childArray = Children.toArray(children).filter(isValidElement) as EnumeratedTab[];

    // Ordered values of enabled tabs, aligned 1:1 with the enabled tab buttons in the DOM.
    const enabledValues = childArray
        .map((child, index) => ({
            value: child.props.value !== undefined ? child.props.value : index,
            disabled: Boolean(child.props.disabled),
        }))
        .filter((t) => !t.disabled)
        .map((t) => t.value);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
        const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
        if (![nextKey, prevKey, 'Home', 'End'].includes(event.key)) return;

        // Enabled tab buttons of THIS tablist only (scoped — never another instance's).
        const tabs = listRef.current
            ? Array.from(
                  listRef.current.querySelectorAll<HTMLButtonElement>(
                      '[role="tab"]:not([disabled])',
                  ),
              )
            : [];
        if (tabs.length === 0) return;
        event.preventDefault();

        // Navigate relative to the FOCUSED tab; fall back to the selected value, then to a boundary.
        let currentIndex = tabs.findIndex((t) => t === document.activeElement);
        if (currentIndex === -1) {
            currentIndex = tabs.findIndex((t) => t.dataset.value === String(value));
        }

        let nextIndex: number;
        if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = tabs.length - 1;
        } else {
            const dir = event.key === nextKey ? 1 : -1;
            nextIndex =
                currentIndex === -1
                    ? dir === 1
                        ? 0
                        : tabs.length - 1
                    : (currentIndex + dir + tabs.length) % tabs.length;
        }

        tabs[nextIndex].focus();
        onValueChange(enabledValues[nextIndex], event);
    };

    const context: TabListContext = {
        selectedValue: value,
        onSelect: onValueChange,
        idBase,
    };

    return (
        <TabListCtx.Provider value={context}>
            <div
                ref={setRefs}
                role="tablist"
                aria-orientation={orientation}
                className={[
                    styles.list,
                    variant === 'segmented' ? styles.segmented : styles.underline,
                    orientation === 'vertical' && styles.vertical,
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
                onKeyDown={handleKeyDown}
                {...rest}
            >
                {childArray.map((child, index) =>
                    cloneElement(child, { __index: index, key: child.key ?? index }),
                )}
            </div>
        </TabListCtx.Provider>
    );
});

/** A single tab inside an EdTabList. */
export const EdTab = forwardRef<HTMLButtonElement, EdTabProps>(function EdTab(props, ref) {
    const ctx = useContext(TabListCtx);
    const index = (props as EdTabProps & { __index?: number }).__index ?? 0;
    const ownValue = props.value !== undefined ? props.value : index;
    const selected = ctx?.selectedValue === ownValue;

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        ctx?.onSelect(ownValue, event);
    };

    return (
        <button
            ref={ref}
            type="button"
            role="tab"
            id={edTabId(ownValue, ctx?.idBase)}
            aria-controls={edTabPanelId(ownValue, ctx?.idBase)}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={props.disabled}
            data-state={selected ? 'active' : 'inactive'}
            data-value={String(ownValue)}
            className={[styles.trigger, props.className].filter(Boolean).join(' ')}
            onClick={handleClick}
        >
            {props.icon && (
                <span className={styles.icon} aria-hidden>
                    {props.icon}
                </span>
            )}
            <span className={styles.label}>{props.label}</span>
            {typeof props.count === 'number' && (
                <>
                    <span className={styles.count} aria-hidden>
                        {props.count}
                    </span>
                    {/* Fold the count into the accessible name for any label type. */}
                    <span className={styles.srOnly}>, {props.count}</span>
                </>
            )}
        </button>
    );
});
