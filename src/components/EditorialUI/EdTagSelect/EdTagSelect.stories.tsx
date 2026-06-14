import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdTagSelect, type EdTagOption } from './EdTagSelect';

const meta: Meta<typeof EdTagSelect> = {
    title: 'EditorialUI/Display/EdTagSelect',
    component: EdTagSelect,
    parameters: { layout: 'padded' },
    decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof EdTagSelect>;

const regulations: EdTagOption[] = [
    { value: 'pra', label: 'PRA SS3/21' },
    { value: 'ccar', label: 'CCAR 2025' },
    { value: 'ifrs9', label: 'IFRS 9' },
    { value: 'sr11-7', label: 'SR 11-7' },
    { value: 'basel4', label: 'Basel IV' },
    { value: 'lcr', label: 'LCR / NSFR' },
    { value: 'dfast', label: 'DFAST' },
];

export const Empty: Story = {
    args: { label: 'Regulatory scope', options: regulations, placeholder: 'Select tags…', fullWidth: true },
};

export const Populated: Story = {
    render: () => {
        const [v, setV] = useState(['pra', 'ccar', 'ifrs9']);
        return (
            <EdTagSelect
                label="Regulatory scope"
                options={regulations}
                values={v}
                onValuesChange={setV}
                hint="Type to search regulations, press Enter to add."
                fullWidth
            />
        );
    },
};

export const AllowCreate: Story = {
    render: () => {
        const [opts, setOpts] = useState<EdTagOption[]>(regulations);
        const [v, setV] = useState<string[]>(['pra']);
        return (
            <EdTagSelect
                label="Tags"
                options={opts}
                values={v}
                onValuesChange={(next) => {
                    // Register any freshly-created values as options.
                    const known = new Set(opts.map((o) => o.value));
                    const added = next.filter((x) => !known.has(x));
                    if (added.length) setOpts([...opts, ...added.map((a) => ({ value: a, label: a }))]);
                    setV(next);
                }}
                allowCreate
                hint="Pick from the list or type a new tag and press Enter."
                fullWidth
            />
        );
    },
};

export const Disabled: Story = {
    args: { label: 'Regulatory scope', options: regulations, defaultValues: ['pra', 'ccar'], disabled: true, fullWidth: true },
};

export const Error: Story = {
    args: {
        label: 'Regulatory scope',
        required: true,
        options: regulations,
        placeholder: 'Select tags…',
        error: 'At least one regulation required.',
        fullWidth: true,
    },
};

export const Overflowing: Story = {
    args: {
        label: 'Regulatory scope',
        options: regulations,
        defaultValues: ['pra', 'ccar', 'ifrs9', 'sr11-7', 'basel4', 'lcr'],
        fullWidth: true,
    },
};
