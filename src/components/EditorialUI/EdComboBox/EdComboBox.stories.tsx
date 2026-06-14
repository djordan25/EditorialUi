import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { EdComboBox, type EdComboBoxOption, type EdComboBoxSingleProps } from './EdComboBox';

const meta: Meta<typeof EdComboBox> = {
    title: 'EditorialUI/Selection/EdComboBox',
    component: EdComboBox,
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div style={{ width: 320 }}>
                <Story />
            </div>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof EdComboBox>;

const owners: EdComboBoxOption[] = [
    { value: 'hl', label: 'Hanna Lindqvist', meta: 'Risk Ops' },
    { value: 'mc', label: 'Marcus Chen', meta: 'Validation' },
    { value: 'pr', label: 'Priya Rao', meta: 'Validation' },
    { value: 'av', label: 'Ada Voss', meta: 'Risk Ops' },
    { value: 'bp', label: 'Boris Petrov', meta: 'Validation' },
    { value: 'cl', label: 'Cara Liu', meta: 'Risk Ops' },
    { value: 'my', label: 'Margaret Yu', meta: 'Risk Ops' },
    { value: 'hp', label: 'Hanman Patel', meta: 'Validation' },
    { value: 'ex', label: 'Examiner (read-only)', disabled: true },
];

const regulations: EdComboBoxOption[] = [
    { value: 'pra', label: 'PRA SS3/21' },
    { value: 'ccar', label: 'CCAR 2025' },
    { value: 'ifrs9', label: 'IFRS 9' },
    { value: 'sr11-7', label: 'SR 11-7' },
    { value: 'basel4', label: 'Basel IV' },
    { value: 'lcr', label: 'LCR / NSFR' },
    { value: 'dfast', label: 'DFAST' },
];

export const Default: Story = {
    args: {
        label: 'Owner',
        options: owners,
        placeholder: 'Select owner…',
        fullWidth: true,
    },
};

export const Filtering: Story = {
    name: 'Filtering (default-open)',
    args: {
        label: 'Owner',
        options: owners,
        placeholder: 'Select owner…',
        fullWidth: true,
    },
    render: (args) => {
        const [v, setV] = useState<string | null>(null);
        return <EdComboBox {...(args as EdComboBoxSingleProps)} value={v} onValueChange={setV} />;
    },
};

export const EmptyResults: Story = {
    args: {
        label: 'Owner',
        options: [],
        emptyText: (q) => (q ? `No owners match "${q}"` : 'No owners available.'),
        fullWidth: true,
    },
};

export const Error: Story = {
    args: {
        label: 'Owner',
        required: true,
        options: owners,
        placeholder: 'Select owner…',
        error: 'Required.',
        fullWidth: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Owner',
        options: owners,
        defaultValue: 'mc',
        disabled: true,
        fullWidth: true,
    },
};

export const Multi: Story = {
    args: {
        multiple: true,
        label: 'Regulations',
        options: regulations,
        placeholder: 'Pick regulations…',
        defaultValues: ['pra', 'ccar', 'ifrs9'],
        fullWidth: true,
    },
};

export const MultiOverflow: Story = {
    name: 'Multi (with overflow)',
    args: {
        multiple: true,
        label: 'Regulations',
        options: regulations,
        defaultValues: ['pra', 'ccar', 'ifrs9', 'sr11-7', 'basel4'],
        fullWidth: true,
    },
};

/* ----- Async stories ----- */

function mockAsyncOwners() {
    return async (query: string): Promise<EdComboBoxOption[]> => {
        await new Promise((r) => setTimeout(r, 350));
        if (!query.trim()) return owners.filter((o) => !o.disabled);
        const q = query.toLowerCase();
        return owners.filter((o) => o.label.toLowerCase().includes(q));
    };
}

export const AsyncOwners: Story = {
    name: 'Async — owners (35) w/ recents',
    render: () => {
        const onSearch = useMemo(mockAsyncOwners, []);
        const [v, setV] = useState<string | null>(null);
        return (
            <EdComboBox
                label="Owner"
                onSearch={onSearch}
                recents={[
                    { value: 'mc', label: 'Marcus Chen', meta: 'Validation' },
                    { value: 'pr', label: 'Priya Rao', meta: 'Validation' },
                    { value: 'hl', label: 'Hanna Lindqvist', meta: 'Risk Ops' },
                ]}
                placeholder="Select owner…"
                value={v}
                onValueChange={setV}
                fullWidth
            />
        );
    },
};

export const AsyncRegulations: Story = {
    name: 'Async — regulations (200+)',
    render: () => {
        const fullList = useMemo<EdComboBoxOption[]>(() => {
            const base = regulations;
            const more: EdComboBoxOption[] = Array.from({ length: 200 }, (_, i) => ({
                value: `reg-${i}`,
                label: `Regulation ${(i + 1).toString().padStart(3, '0')}`,
            }));
            return [...base, ...more];
        }, []);
        const onSearch = useMemo(
            () => async (query: string) => {
                await new Promise((r) => setTimeout(r, 250));
                if (!query.trim()) return fullList.slice(0, 8);
                const q = query.toLowerCase();
                return fullList.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 50);
            },
            [fullList],
        );
        const [picked, setPicked] = useState<string[]>([]);
        return (
            <EdComboBox
                multiple
                label="Regulations"
                onSearch={onSearch}
                values={picked}
                onValuesChange={setPicked}
                placeholder="Pick regulations…"
                fullWidth
            />
        );
    },
};
