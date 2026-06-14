import type { Meta, StoryObj } from '@storybook/react';
import { EdIcon, type EdIconSize, type EdIconColor } from './EdIcon';

const meta: Meta<typeof EdIcon> = {
    title: 'EditorialUI/Display/EdIcon',
    component: EdIcon,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Thin wrapper around lucide-react. Constrains size to the token scale and color to semantic tokens.',
            },
        },
    },
    argTypes: {
        name: { control: 'text' },
        size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] satisfies EdIconSize[] },
        color: { control: 'select', options: ['inherit', 'primary', 'muted', 'faint', 'brand', 'success', 'warning', 'danger', 'inverse'] satisfies EdIconColor[] },
        label: { control: 'text' },
    },
};
export default meta;

type Story = StoryObj<typeof EdIcon>;

export const Default: Story = {
    args: { name: 'Search', size: 'md' },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
                <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <EdIcon name="Check" size={size} />
                    <code style={{ fontSize: 11, color: 'var(--ed-color-text-muted)' }}>{size}</code>
                </div>
            ))}
        </div>
    ),
};

export const SemanticColors: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {(['inherit', 'primary', 'muted', 'brand', 'success', 'warning', 'danger'] as const).map((color) => (
                <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <EdIcon name="AlertCircle" size="lg" color={color} />
                    <code style={{ fontSize: 11, color: 'var(--ed-color-text-muted)' }}>{color}</code>
                </div>
            ))}
        </div>
    ),
};

export const WithLabel: Story = {
    args: { name: 'AlertTriangle', size: 'md', color: 'danger', label: 'Failed validation' },
    parameters: {
        docs: {
            description: {
                story: 'When an icon stands alone (no surrounding text), pass `label` to make it meaningful to assistive tech.',
            },
        },
    },
};

export const CanonicalSample: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                gap: 1,
                background: 'var(--ed-color-hairline)',
                border: '1px solid var(--ed-color-hairline)',
                borderRadius: 4,
                overflow: 'hidden',
                width: 720,
            }}
        >
            {(['Search','Filter','Trash2','Edit','Plus','X','Check','Info','Settings','ChevronDown','MoreHorizontal','RefreshCw','Users','Calendar','Lock','Download'] as const).map((name) => (
                <div
                    key={name}
                    style={{
                        background: 'var(--ed-color-surface-1)',
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        fontFamily: 'var(--ed-font-mono)',
                        fontSize: 10,
                        color: 'var(--ed-color-text-muted)',
                    }}
                >
                    <EdIcon name={name} size="md" />
                    {name}
                </div>
            ))}
        </div>
    ),
};
