import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdToaster, type EdToasterPosition } from './EdToaster';
import { toast } from './toastStore';

const meta: Meta<typeof EdToaster> = {
    title: 'EditorialUI/Feedback/EdToaster',
    component: EdToaster,
    parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof EdToaster>;

const btn: React.CSSProperties = {
    height: 32,
    padding: '0 14px',
    borderRadius: 'var(--ed-radius-sm)',
    border: '1px solid var(--ed-color-hairline-strong)',
    background: 'var(--ed-color-surface-1)',
    color: 'var(--ed-color-text-primary)',
    fontFamily: 'var(--ed-font-sans)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
};

export const Playground: Story = {
    render: () => {
        const [position, setPosition] = useState<EdToasterPosition>('top-center');
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 420 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <button style={btn} onClick={() => toast.info('Sync started', { description: 'Fetching the latest model inventory.' })}>
                        info
                    </button>
                    <button style={btn} onClick={() => toast.success('Finding reopened')}>success</button>
                    <button style={btn} onClick={() => toast.warning('Evidence due in 3 days')}>warning</button>
                    <button style={btn} onClick={() => toast.danger('Upload failed', { description: 'Retry in a moment.' })}>danger</button>
                    <button
                        style={btn}
                        onClick={() => {
                            const id = toast.info('Saving…', { duration: null });
                            setTimeout(() => toast.success('Saved', { id }), 1200);
                        }}
                    >
                        promise (update in place)
                    </button>
                    <button style={btn} onClick={() => toast.clear()}>clear all</button>
                </div>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--ed-font-mono)', fontSize: 12 }}>
                    position:
                    <select value={position} onChange={(e) => setPosition(e.target.value as EdToasterPosition)}>
                        {(['top-center', 'top-right', 'top-left', 'bottom-center', 'bottom-right', 'bottom-left'] as const).map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </label>
                <EdToaster position={position} />
            </div>
        );
    },
};
