import {
    forwardRef,
    type AnchorHTMLAttributes,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { EdMenu, type EdMenuEntry } from '../EdMenu';
import styles from './EdAppBar.module.scss';

export interface EdAppBarProps extends HTMLAttributes<HTMLElement> {
    /** Product mark and name. */
    brand: ReactNode;
    /** Shown in a small chip after the brand ("v2.6"). */
    version?: ReactNode;
    /** Primary navigation — an EdAppBarNav. */
    nav?: ReactNode;
    /** Right-hand slot: status, clock, tenant switcher, theme, notifications, account. */
    end?: ReactNode;
}

/**
 * EdAppBar — the single 48px application bar: brand and version, primary
 * navigation, and a right-hand slot for status and account controls.
 *
 *   <EdAppBar
 *     brand={<><Logo /> Cerynto</>}
 *     version="v0.51"
 *     nav={<EdAppBarNav aria-label="Main">
 *       <EdAppBarNavItem asChild active><Link to="/models">Models</Link></EdAppBarNavItem>
 *       <EdAppBarNavMenu label="Governance" items={…} />
 *     </EdAppBarNav>}
 *     end={<>…</>}
 *   />
 */
export const EdAppBar = forwardRef<HTMLElement, EdAppBarProps>(function EdAppBar(
    { brand, version, nav, end, className, ...rest },
    ref,
) {
    return (
        <header ref={ref} className={[styles.root, className].filter(Boolean).join(' ')} {...rest}>
            <div className={styles.brand}>
                {brand}
                {version && <span className={styles.version}>{version}</span>}
            </div>
            {nav}
            <div className={styles.spacer} />
            {end && <div className={styles.end}>{end}</div>}
        </header>
    );
});

export type EdAppBarNavProps = HTMLAttributes<HTMLElement>;

/** The bar's primary navigation. Give it an aria-label ("Main"). */
export const EdAppBarNav = forwardRef<HTMLElement, EdAppBarNavProps>(function EdAppBarNav(
    { className, children, ...rest },
    ref,
) {
    return (
        <nav ref={ref} className={[styles.nav, className].filter(Boolean).join(' ')} {...rest}>
            {children}
        </nav>
    );
});

export interface EdAppBarNavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /** The current section: highlighted, and aria-current="page". */
    active?: boolean;
    /** Render the child element (a router Link) with the item's styling. */
    asChild?: boolean;
}

export const EdAppBarNavItem = forwardRef<HTMLAnchorElement, EdAppBarNavItemProps>(function EdAppBarNavItem(
    { active = false, asChild = false, className, children, ...rest },
    ref,
) {
    const Comp = asChild ? Slot : 'a';
    return (
        <Comp
            ref={ref}
            aria-current={active ? 'page' : undefined}
            className={[styles.item, active && styles.active, className].filter(Boolean).join(' ')}
            {...rest}
        >
            {children}
        </Comp>
    );
});

export interface EdAppBarNavMenuProps {
    label: ReactNode;
    items: EdMenuEntry[];
    /** One of the menu's pages is the current one. */
    active?: boolean;
    /** Accessible name when `label` is not plain text. */
    ariaLabel?: string;
}

/** A nav item that opens a menu ("Governance ▾"). */
export function EdAppBarNavMenu({ label, items, active = false, ariaLabel }: EdAppBarNavMenuProps) {
    return (
        <EdMenu
            align="start"
            items={items}
            trigger={
                <button
                    type="button"
                    aria-label={ariaLabel}
                    className={[styles.item, styles.menuTrigger, active && styles.active].filter(Boolean).join(' ')}
                >
                    {label}
                    <span className={styles.caret} aria-hidden="true">▾</span>
                </button>
            }
        />
    );
}
