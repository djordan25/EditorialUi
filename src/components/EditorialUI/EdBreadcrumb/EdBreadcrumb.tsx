import {
    forwardRef,
    Fragment,
    useState,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import styles from './EdBreadcrumb.module.scss';

export interface EdBreadcrumbCrumb {
    /** Visible label. */
    label: ReactNode;
    /** Link target. Omit on the current (last) crumb. */
    href?: string;
    /** Click handler — alternative to href for SPA routers. */
    onClick?: () => void;
}

export type EdBreadcrumbSeparator = 'slash' | 'chevron';

export interface EdBreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
    /** Ordered crumbs, root first. The last is treated as the current page. */
    crumbs: EdBreadcrumbCrumb[];
    /** Separator style. */
    separator?: EdBreadcrumbSeparator;
    /**
     * Collapse the middle when there are more than this many crumbs, showing
     * first + … + last. The "…" expands inline on click. Default 4. Set 0 to disable.
     */
    maxItems?: number;
    /** Render a custom link element (e.g. a router <Link>). Receives href + children. */
    renderLink?: (props: { href?: string; onClick?: () => void; children: ReactNode; className: string }) => ReactNode;
}

/**
 * EdBreadcrumb — path-back trail showing location in a hierarchy. The last crumb
 * is the current page (plain text, aria-current). Never on flat top-level routes;
 * never include the brand/Home crumb (the TopBar covers that).
 *
 *   <EdBreadcrumb crumbs={[
 *     { label: 'Findings', href: '/findings' },
 *     { label: '2026-Q1 audit', href: '/findings/2026-q1' },
 *     { label: 'F-2438 · Stale documentation' },
 *   ]} />
 */
export const EdBreadcrumb = forwardRef<HTMLElement, EdBreadcrumbProps>(function EdBreadcrumb(
    { crumbs, separator = 'slash', maxItems = 4, renderLink, className, ...rest },
    ref,
) {
    const [expanded, setExpanded] = useState(false);

    const sep = (
        <span className={styles.separator} aria-hidden="true">
            {separator === 'chevron' ? <ChevronRight size={12} strokeWidth={1.8} /> : '/'}
        </span>
    );

    const shouldCollapse = maxItems > 0 && !expanded && crumbs.length > maxItems;

    // When collapsing: keep first crumb + last two, hide the middle behind "…".
    const visible: (EdBreadcrumbCrumb | 'ellipsis')[] = shouldCollapse
        ? [crumbs[0], 'ellipsis', ...crumbs.slice(-2)]
        : crumbs;

    const renderCrumb = (crumb: EdBreadcrumbCrumb, isCurrent: boolean) => {
        if (isCurrent) {
            return (
                <span
                    className={`${styles.item} ${styles.current}`}
                    aria-current="page"
                    title={typeof crumb.label === 'string' ? crumb.label : undefined}
                >
                    {crumb.label}
                </span>
            );
        }
        const linkClass = styles.item;
        if (renderLink) {
            return renderLink({ href: crumb.href, onClick: crumb.onClick, children: crumb.label, className: linkClass });
        }
        return (
            <a className={linkClass} href={crumb.href} onClick={crumb.onClick}>
                {crumb.label}
            </a>
        );
    };

    return (
        <nav
            ref={ref}
            aria-label="Breadcrumb"
            className={[styles.root, className].filter(Boolean).join(' ')}
            {...rest}
        >
            <ol className={styles.list}>
                {visible.map((entry, i) => {
                    const isLast = i === visible.length - 1;
                    return (
                        <Fragment key={i}>
                            <li className={styles.li}>
                                {entry === 'ellipsis' ? (
                                    <button
                                        type="button"
                                        className={styles.overflow}
                                        aria-label="Show hidden breadcrumbs"
                                        onClick={() => setExpanded(true)}
                                    >
                                        <MoreHorizontal size={14} strokeWidth={1.8} aria-hidden />
                                    </button>
                                ) : (
                                    renderCrumb(entry, isLast && !entry.href && !entry.onClick)
                                )}
                            </li>
                            {!isLast && <li className={styles.liSep}>{sep}</li>}
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
});
