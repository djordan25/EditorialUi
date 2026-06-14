import { forwardRef, type SVGAttributes } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import styles from './EdIcon.module.scss';

export type EdIconName = keyof typeof LucideIcons extends `${infer N}Icon` ? never : Exclude<keyof typeof LucideIcons, 'createLucideIcon' | 'default' | 'icons'>;
export type EdIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type EdIconColor = 'inherit' | 'primary' | 'muted' | 'faint' | 'brand' | 'success' | 'warning' | 'danger' | 'inverse';

export interface EdIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'color'> {
    /** lucide-react icon component name, e.g. "Search", "Check", "ChevronDown" */
    name: EdIconName;
    size?: EdIconSize;
    color?: EdIconColor;
    /**
     * Decorative icons are hidden from screen readers (default).
     * Pass a string label to make the icon meaningful — e.g. inside a link
     * that has no other text.
     */
    label?: string;
}

const sizeClass: Record<EdIconSize, string> = {
    xs: styles.sizeXs,
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
    xl: styles.sizeXl,
    '2xl': styles.size2xl,
};

const colorClass: Record<EdIconColor, string | undefined> = {
    inherit: undefined,
    primary: styles.colorPrimary,
    muted: styles.colorMuted,
    faint: styles.colorFaint,
    brand: styles.colorBrand,
    success: styles.colorSuccess,
    warning: styles.colorWarning,
    danger: styles.colorDanger,
    inverse: styles.colorInverse,
};

/**
 * EdIcon — the only sanctioned icon component in EditorialUI.
 * Wraps lucide-react with token-driven size + semantic color.
 *
 * Decorative (default):
 *   <EdIcon name="Search" />
 *
 * Meaningful (standalone, no surrounding label):
 *   <EdIcon name="AlertTriangle" label="Failed" />
 */
export const EdIcon = forwardRef<SVGSVGElement, EdIconProps>(function EdIcon(
    { name, size = 'sm', color = 'inherit', label, className, ...rest },
    ref,
) {
    const LucideComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<LucideProps> | undefined;

    if (!LucideComponent) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`EdIcon: unknown lucide-react icon "${String(name)}"`);
        }
        return null;
    }

    const classes = [styles.icon, sizeClass[size], colorClass[color], className].filter(Boolean).join(' ');

    return (
        <LucideComponent
            ref={ref}
            className={classes}
            aria-hidden={label ? undefined : true}
            aria-label={label}
            role={label ? 'img' : undefined}
            focusable={false}
            {...rest}
        />
    );
});
