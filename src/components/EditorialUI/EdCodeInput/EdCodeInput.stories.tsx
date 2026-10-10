import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdCodeInput } from './EdCodeInput';

const meta: Meta<typeof EdCodeInput> = {
    title: 'EditorialUI/Forms/EdCodeInput',
    component: EdCodeInput,
    parameters: { layout: 'centered' },
    args: { label: 'Authentication code' },
};
export default meta;
type Story = StoryObj<typeof EdCodeInput>;

export const Default: Story = {
    render: (args) => {
        const [code, setCode] = useState('');
        return <EdCodeInput {...args} value={code} onChange={setCode} />;
    },
};

export const Filled: Story = {
    args: { defaultValue: '420314' },
};

export const PartlyFilled: Story = {
    args: { defaultValue: '42', autoFocus: true },
};

export const Large: Story = {
    args: { size: 'lg', hint: 'Enter the 6-digit code from your authenticator app.' },
};

export const WithError: Story = {
    args: {
        defaultValue: '420315',
        error: "That code didn't match. Codes refresh every 30 seconds.",
    },
};

export const Disabled: Story = {
    args: { defaultValue: '4203', disabled: true },
};

export const FourDigits: Story = {
    args: { length: 4, label: 'PIN' },
};

export const SubmitsWhenComplete: Story = {
    render: (args) => {
        const [code, setCode] = useState('');
        const [submitted, setSubmitted] = useState<string | null>(null);
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <EdCodeInput {...args} value={code} onChange={setCode} onComplete={setSubmitted} />
                <span style={{ font: '12px var(--ed-font-mono)', color: 'var(--ed-color-text-muted)' }}>
                    {submitted ? `onComplete("${submitted}")` : 'Type or paste six digits'}
                </span>
            </div>
        );
    },
};
