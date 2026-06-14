import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { EdPasswordInput, type EdPasswordStrengthInfo } from './EdPasswordInput';

const meta: Meta<typeof EdPasswordInput> = {
    title: 'EditorialUI/Inputs/EdPasswordInput',
    component: EdPasswordInput,
    parameters: { layout: 'centered' },
    argTypes: {
        revealable: { control: 'boolean' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    decorators: [
        (Story) => (
            <div style={{ width: 360 }}>
                <Story />
            </div>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof EdPasswordInput>;

export const Default: Story = {
    args: {
        label: 'Password',
        defaultValue: 'modelriskiq',
        autoComplete: 'current-password',
        fullWidth: true,
    },
};

export const Revealable: Story = {
    args: {
        label: 'Password',
        defaultValue: 'modelriskiq',
        revealable: true,
        autoComplete: 'current-password',
        fullWidth: true,
    },
};

export const Error: Story = {
    args: {
        label: 'Password',
        required: true,
        defaultValue: 'wrong',
        error: 'Incorrect password.',
        revealable: true,
        fullWidth: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Password',
        defaultValue: 'modelriskiq',
        disabled: true,
        fullWidth: true,
    },
};

/* ----- Strength meter ----- */

const STRENGTHS: Record<string, EdPasswordStrengthInfo> = {
    weak:   { band: 'weak',   caption: 'Weak · add a number and a symbol' },
    fair:   { band: 'fair',   caption: 'Fair · 12+ characters recommended' },
    good:   { band: 'good',   caption: 'Good' },
    strong: { band: 'strong', caption: 'Strong' },
};

export const WithStrengthMeterWeak: Story = {
    name: 'WithStrengthMeter / weak',
    args: { label: 'New password', defaultValue: 'abc12', strength: STRENGTHS.weak, fullWidth: true },
};
export const WithStrengthMeterFair: Story = {
    name: 'WithStrengthMeter / fair',
    args: { label: 'New password', defaultValue: 'abcd1234', strength: STRENGTHS.fair, fullWidth: true },
};
export const WithStrengthMeterGood: Story = {
    name: 'WithStrengthMeter / good',
    args: { label: 'New password', defaultValue: 'Abcd1234!ef', strength: STRENGTHS.good, fullWidth: true },
};
export const WithStrengthMeterStrong: Story = {
    name: 'WithStrengthMeter / strong',
    args: { label: 'New password', defaultValue: 'C0rrect-Horse-Battery!', strength: STRENGTHS.strong, fullWidth: true },
};

/** Live demo — derives band from raw length as a placeholder for zxcvbn. */
export const ChangePasswordExample: Story = {
    render: () => {
        const [v, setV] = useState('');
        const strength = useMemo<EdPasswordStrengthInfo | undefined>(() => {
            if (!v) return undefined;
            const len = v.length;
            if (len < 6)  return STRENGTHS.weak;
            if (len < 10) return STRENGTHS.fair;
            if (len < 14) return STRENGTHS.good;
            return STRENGTHS.strong;
        }, [v]);

        return (
            <EdPasswordInput
                label="New password"
                placeholder="At least 12 characters"
                value={v}
                onChange={(e) => setV(e.target.value)}
                revealable
                strength={strength}
                autoComplete="new-password"
                fullWidth
            />
        );
    },
};
