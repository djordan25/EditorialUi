import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { EdControlledContextMenu } from './EdControlledContextMenu';

const meta: Meta<typeof EdControlledContextMenu> = {
    title: 'EditorialUI/Navigation/EdControlledContextMenu',
    component: EdControlledContextMenu,
    parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof EdControlledContextMenu>;

interface MenuState {
    position: { top: number; left: number };
    id: string;
}

export const CoordinateAnchored: Story = {
    render: () => {
        const [menu, setMenu] = useState<MenuState | null>(null);
        const cells = ['BVN-41', 'BVN-42', 'BVN-43', 'BVN-44'];
        return (
            <>
                <p style={{ font: '13px var(--ed-font-sans)', color: 'var(--ed-color-text-muted)' }}>
                    Right-click a cell to open one shared, coordinate-anchored menu.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {cells.map((id) => (
                        <div
                            key={id}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setMenu({ position: { top: e.clientY, left: e.clientX }, id });
                            }}
                            style={{
                                padding: '20px 28px',
                                border: '1px solid var(--ed-color-hairline)',
                                borderRadius: 'var(--ed-radius-sm)',
                                font: '13px var(--ed-font-mono)',
                                cursor: 'context-menu',
                            }}
                        >
                            {id}
                        </div>
                    ))}
                </div>
                <EdControlledContextMenu
                    open={menu !== null}
                    position={menu?.position ?? null}
                    onClose={() => setMenu(null)}
                    ariaLabel="Cell actions"
                    items={[
                        {
                            kind: 'info',
                            rows: [
                                { label: 'BVN', value: menu?.id ?? '—' },
                                { label: 'Status', value: 'Open' },
                            ],
                        },
                        { kind: 'separator' },
                        {
                            id: 'inspect',
                            label: 'Open in inspector',
                            icon: <Eye size={14} strokeWidth={1.8} />,
                            onSelect: () => setMenu(null),
                        },
                        {
                            id: 'delete',
                            label: 'Delete',
                            danger: true,
                            ariaLabel: `Delete ${menu?.id ?? ''}`,
                            icon: <Trash2 size={14} strokeWidth={1.8} />,
                            onSelect: () => setMenu(null),
                        },
                    ]}
                />
            </>
        );
    },
};
