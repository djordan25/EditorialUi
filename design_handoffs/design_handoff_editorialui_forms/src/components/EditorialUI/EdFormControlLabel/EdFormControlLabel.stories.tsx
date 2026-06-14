import type { Meta, StoryObj } from '@storybook/react';
import { EdFormControlLabel } from './EdFormControlLabel';
import { EdTextField } from '../EdTextField';
import { EdSwitch } from '../EdSwitch';

const meta: Meta<typeof EdFormControlLabel> = {
    title: 'EditorialUI/Inputs/EdFormControlLabel',
    component: EdFormControlLabel,
    parameters: { layout: 'centered' },
    argTypes: {
        layout: { control: 'radio', options: ['stack', 'row'] },
        required: { control: 'boolean' },
        visuallyHidden: { control: 'boolean' },
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

type Story = StoryObj<typeof EdFormControlLabel>;

/** Most forms should use EdTextField directly — it already bundles the label.
 *  EdFormControlLabel is the escape hatch for arbitrary controls. */
export const WithTextField: Story = {
    render: () => (
        <EdFormControlLabel
            label="Owner"
            required
            hint="Tier-1 models require a designated owner."
        >
            {({ id, 'aria-describedby': db, 'aria-required': req }) => (
                <EdTextField
                    label=""
                    visuallyHidden
                    id={id}
                    placeholder="Search users…"
                    aria-describedby={db}
                    required={!!req}
                    fullWidth
                />
            )}
        </EdFormControlLabel>
    ),
};

/** Stand-in for EdSelect (Bundle 3). Demonstrates wrapping a non-text-field control. */
export const WithSelect: Story = {
    render: () => (
        <EdFormControlLabel label="Severity">
            <select
                style={{
                    height: 'var(--ed-control-h-md)',
                    padding: '0 var(--ed-space-3)',
                    border: '1px solid var(--ed-color-hairline-strong)',
                    borderRadius: 'var(--ed-radius-sm)',
                    background: 'var(--ed-color-surface-input)',
                    fontFamily: 'var(--ed-font-sans)',
                    fontSize: 'var(--ed-font-size-md)',
                    color: 'var(--ed-color-text-primary)',
                }}
                defaultValue=""
            >
                <option value="" disabled>Select severity…</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>MRA</option>
                <option>MRIA</option>
            </select>
        </EdFormControlLabel>
    ),
};

export const WithSwitchRow: Story = {
    name: 'WithSwitch (row)',
    render: () => (
        <EdFormControlLabel
            layout="row"
            label="Notify on completion"
            hint="Goes to your default workspace channel."
        >
            {({ id }) => <EdSwitch label="" id={id} defaultChecked />}
        </EdFormControlLabel>
    ),
};

export const WithCustomControl: Story = {
    render: () => (
        <EdFormControlLabel label="Theme" hint="Affects this window only.">
            {({ id }) => (
                <div
                    id={id}
                    role="group"
                    aria-label="Theme"
                    style={{
                        display: 'flex',
                        border: '1px solid var(--ed-color-hairline-strong)',
                        borderRadius: 'var(--ed-radius-sm)',
                        overflow: 'hidden',
                        height: 36,
                    }}
                >
                    {['Light', 'Dark'].map((label, i) => (
                        <button
                            key={label}
                            type="button"
                            style={{
                                flex: 1,
                                background:
                                    i === 0 ? 'var(--ed-color-brand-bg)' : 'transparent',
                                color:
                                    i === 0
                                        ? 'var(--ed-color-brand)'
                                        : 'var(--ed-color-text-primary)',
                                border: 'none',
                                borderRight:
                                    i === 0 ? '1px solid var(--ed-color-hairline)' : 'none',
                                fontFamily: 'var(--ed-font-sans)',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </EdFormControlLabel>
    ),
};

export const Required: Story = {
    args: {
        label: 'Model name',
        required: true,
        children: (
            <input
                style={{
                    width: '100%',
                    height: 36,
                    padding: '0 12px',
                    border: '1px solid var(--ed-color-hairline-strong)',
                    borderRadius: 'var(--ed-radius-sm)',
                }}
            />
        ) as React.ReactElement,
    },
};

export const Error: Story = {
    args: {
        label: 'Model name',
        required: true,
        error: 'Use only letters, numbers, and dashes.',
        children: (
            <input
                defaultValue="pd_wholesale!2026"
                style={{
                    width: '100%',
                    height: 36,
                    padding: '0 12px',
                    border: '1px solid var(--ed-color-status-danger)',
                    borderRadius: 'var(--ed-radius-sm)',
                }}
            />
        ) as React.ReactElement,
    },
};

export const HintAndError: Story = {
    name: 'Hint replaced by Error',
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <EdFormControlLabel label="Name" hint="A unique handle.">
                {({ id }) => (
                    <input
                        id={id}
                        style={{
                            width: '100%',
                            height: 36,
                            padding: '0 12px',
                            border: '1px solid var(--ed-color-hairline-strong)',
                            borderRadius: 'var(--ed-radius-sm)',
                        }}
                    />
                )}
            </EdFormControlLabel>
            <EdFormControlLabel label="Name" hint="A unique handle." error="Already taken.">
                {({ id }) => (
                    <input
                        id={id}
                        defaultValue="hlindqvist"
                        style={{
                            width: '100%',
                            height: 36,
                            padding: '0 12px',
                            border: '1px solid var(--ed-color-status-danger)',
                            borderRadius: 'var(--ed-radius-sm)',
                        }}
                    />
                )}
            </EdFormControlLabel>
        </div>
    ),
};
