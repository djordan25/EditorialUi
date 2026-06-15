/**
 * EditorialUI · inline-open stories for portal components
 * ──────────────────────────────────────────────────────────────────────────
 * The six portal components — EdDialog, EdModal, EdDrawer, EdTooltip, EdMenu,
 * EdContextMenu — show their actual design only when OPEN, and Radix renders the
 * open panel into a portal on document.body. A normal (closed) story verifies
 * nothing meaningful, which is why they were dropped from the visual gate.
 *
 * Add ONE dedicated "verify-open" story per component, using the pattern below.
 * It must do two things:
 *   1. Open by default (`open`/`defaultOpen`, or force the open state).
 *   2. Render the panel INLINE — into a story-local container, not document.body —
 *      so (a) the Tier-2 screenshot captures it and (b) it sits in a predictable
 *      place. (The harness also has a document-wide anchor fallback, so Tier-1
 *      computed-style still works even if a panel does escape to a portal — but
 *      inline is required for the pixel advisory to mean anything.)
 *
 * Then the matching entries in component-map.mjs (already added) anchor the
 * STORY side on the ARIA role (stable across CSS-module hashing) and the SPEC
 * side on the literal spec class (.ed-dialog / .ed-menu / .ed-tooltip / …).
 *
 * Story id convention used by the map: `…--verify-open`. Keep the export named
 * `VerifyOpen` so it sanitizes to that id.
 *
 * NOTE: these are REFERENCE snippets — adapt prop names to each component's real
 * API. They assume the Bundle-3/5/6/7 components expose the usual Radix-style
 * controlled `open` + `container`/`portalProps` escape hatches. If a component
 * doesn't accept a portal container, render its open story with the panel's
 * sub-component directly (e.g. <EdMenu.Content> in a static wrapper).
 */
import { useRef, useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

/* A story-local element that captures the portal so nothing escapes to body. */
function InlinePortalHost({ children }: { children: (container: HTMLElement | null) => React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [, force] = useState(0);
    useEffect(() => { force((n) => n + 1); }, []); // re-render once ref is attached
    return (
        <div style={{ position: 'relative', minHeight: 240, minWidth: 360, display: 'grid', placeItems: 'center' }}>
            <div ref={ref} />
            {children(ref.current)}
        </div>
    );
}

/* ───────────────────────── EdDialog / EdModal ─────────────────────────────
 * import { EdDialog } from '../EdDialog';
 *
 * export const VerifyOpen: StoryObj = {
 *   render: () => (
 *     <InlinePortalHost>
 *       {(container) => (
 *         <EdDialog
 *           open
 *           size="md"
 *           title="Reopen finding"
 *           subtitle="F-2438 · CLOSED 2026-03-22"
 *           container={container ?? undefined}   // Radix Dialog.Portal container
 *           onOpenChange={() => {}}
 *           footer={<><button>Cancel</button><button>Reopen</button></>}
 *         >
 *           This will reopen the finding and re-attach it to the active queue.
 *         </EdDialog>
 *       )}
 *     </InlinePortalHost>
 *   ),
 * };
 * // EdModal: identical, but size + content matching the modal.html "form" cell.
 */

/* ─────────────────────────────── EdDrawer ─────────────────────────────────
 * export const VerifyOpen: StoryObj = {
 *   render: () => (
 *     <InlinePortalHost>
 *       {(container) => (
 *         <EdDrawer open mode="modal" size="md" container={container ?? undefined}
 *                   title="Stale model documentation" crumb="FINDING · F-2438"
 *                   onOpenChange={() => {}}>
 *           <EdDrawerSection label="Status">…</EdDrawerSection>
 *         </EdDrawer>
 *       )}
 *     </InlinePortalHost>
 *   ),
 * };
 */

/* ────────────────────────────── EdTooltip ─────────────────────────────────
 * Tooltip must be open AND positioned; render inline so the bubble is in-flow.
 *
 * export const VerifyOpen: StoryObj = {
 *   render: () => (
 *     <InlinePortalHost>
 *       {(container) => (
 *         <EdTooltipProvider>
 *           <EdTooltip open content={<>Save draft <kbd>⌘S</kbd></>}
 *                      container={container ?? undefined}>
 *             <button>Save draft</button>
 *           </EdTooltip>
 *         </EdTooltipProvider>
 *       )}
 *     </InlinePortalHost>
 *   ),
 * };
 */

/* ──────────────────────── EdMenu / EdContextMenu ──────────────────────────
 * export const VerifyOpen: StoryObj = {
 *   render: () => (
 *     <InlinePortalHost>
 *       {(container) => (
 *         <EdMenu open container={container ?? undefined}
 *                 trigger={<button>Actions</button>}
 *                 items={[
 *                   { type: 'item', icon: 'check',  label: 'Close finding', shortcut: '⌘↩' },
 *                   { type: 'item', icon: 'edit',   label: 'Edit',          shortcut: '⌘E' },
 *                   { type: 'item', icon: 'copy',   label: 'Duplicate' },
 *                   { type: 'separator' },
 *                   { type: 'group-label', label: 'Export' },
 *                   { type: 'item', label: 'Copy ID', shortcut: '⌘⇧C' },
 *                   { type: 'separator' },
 *                   { type: 'item', tone: 'danger', icon: 'trash', label: 'Delete finding' },
 *                 ]}
 *         />
 *       )}
 *     </InlinePortalHost>
 *   ),
 * };
 * // EdContextMenu: same items; open it programmatically (or render its Content
 * // directly) since it has no click trigger — right-click can't be scripted in a
 * // static story.
 */

export {};
