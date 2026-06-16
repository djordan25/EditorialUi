import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { EdAutocomplete, type EdAutocompleteOption } from './EdAutocomplete';

const meta: Meta<typeof EdAutocomplete> = {
    title: 'EditorialUI/Selection/EdAutocomplete',
    component: EdAutocomplete,
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div style={{ width: 380 }}>
                <Story />
            </div>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof EdAutocomplete>;

const findings: EdAutocompleteOption[] = [
    {
        value: 'f-2438',
        label: 'Stale model documentation — PD model',
        secondary: 'F-2438 · OPEN · MEDIUM',
    },
    {
        value: 'f-2199',
        label: 'Stale model documents missing v2.3 update',
        secondary: 'F-2199 · CLOSED · LOW',
    },
    {
        value: 'f-1872',
        label: 'Documents reference stale model outputs',
        secondary: 'F-1872 · OPEN · HIGH',
    },
    {
        value: 'f-1655',
        label: 'Validation cadence below SR 11-7 baseline',
        secondary: 'F-1655 · OPEN · MRA',
    },
];

const tags: EdAutocompleteOption[] = [
    { value: 'credit-risk', label: 'credit-risk' },
    { value: 'market-risk', label: 'market-risk' },
    { value: 'operational', label: 'operational' },
    { value: 'retail', label: 'retail' },
    { value: 'wholesale', label: 'wholesale' },
];

export const FindOrCreate: Story = {
    name: 'Find or create — finding title',
    render: () => {
        const [v, setV] = useState('');
        return (
            <EdAutocomplete
                label="Finding title"
                placeholder="Search existing or describe a new one…"
                options={findings}
                suggestionsLabel="Existing findings"
                value={v}
                onValueChange={setV}
                allowCreate
                onCreate={(q) => alert(`Create new finding: "${q}"`)}
                fullWidth
            />
        );
    },
};

export const NoMatch: Story = {
    name: 'No match — only Create',
    render: () => {
        const [v, setV] = useState('Brand-new finding title');
        return (
            <EdAutocomplete
                label="Finding title"
                placeholder="Search…"
                options={findings}
                value={v}
                onValueChange={setV}
                allowCreate
                onCreate={(q) => alert(`Create: "${q}"`)}
                fullWidth
            />
        );
    },
};

export const CellEdit: Story = {
    name: 'Cell — type-or-pick',
    render: () => {
        const [v, setV] = useState('Operational Risk');
        return (
            <EdAutocomplete
                label="Risk category"
                size="sm"
                options={[
                    { value: 'credit', label: 'Credit Risk' },
                    { value: 'market', label: 'Market Risk' },
                    { value: 'operational', label: 'Operational Risk' },
                    { value: 'liquidity', label: 'Liquidity Risk' },
                    { value: 'compliance', label: 'Compliance Risk' },
                ]}
                value={v}
                onValueChange={setV}
                fullWidth
            />
        );
    },
};

export const TagsInput: Story = {
    name: 'Tags input (free + suggested)',
    render: () => {
        const [picked, setPicked] = useState<string[]>(['credit-risk', 'retail']);
        const [input, setInput] = useState('');

        const remaining = tags.filter((t) => !picked.includes(t.value));

        return (
            <div>
                <label
                    style={{
                        fontFamily: 'var(--ed-font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--ed-color-text-secondary)',
                        display: 'block',
                        marginBottom: 6,
                    }}
                >
                    Tags
                </label>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 6,
                        alignItems: 'center',
                        padding: '6px 8px',
                        minHeight: 36,
                        border: '1px solid var(--ed-color-hairline-strong)',
                        borderRadius: 'var(--ed-radius-sm)',
                        background: 'var(--ed-color-surface-input)',
                    }}
                >
                    {picked.map((p) => (
                        <span
                            key={p}
                            style={{
                                background: 'var(--ed-color-brand-bg)',
                                color: 'var(--ed-color-brand)',
                                padding: '2px 8px',
                                borderRadius: 'var(--ed-radius-sm)',
                                fontSize: 12,
                            }}
                        >
                            {p}
                        </span>
                    ))}
                    <div style={{ flex: 1, minWidth: 140 }}>
                        <EdAutocomplete
                            label=""
                            placeholder="Add tag…"
                            options={remaining}
                            value={input}
                            onValueChange={setInput}
                            onSuggestionSelect={(opt) => {
                                setPicked((p) => [...p, opt.value]);
                                setInput('');
                            }}
                            allowCreate
                            onCreate={(q) => {
                                setPicked((p) => [...p, q.trim()]);
                                setInput('');
                            }}
                            wrapperClassName=""
                            // Override the field shell for inline use.
                            style={{ border: 'none', background: 'transparent' }}
                            fullWidth
                        />
                    </div>
                </div>
            </div>
        );
    },
};

export const AsyncSuggestions: Story = {
    name: 'Async (debounced)',
    render: () => {
        const [v, setV] = useState('');
        const onSearch = useMemo(
            () => async (query: string) => {
                await new Promise((r) => setTimeout(r, 400));
                if (!query.trim()) return [];
                const q = query.toLowerCase();
                return findings.filter((f) => f.label.toLowerCase().includes(q));
            },
            [],
        );
        return (
            <EdAutocomplete
                label="Finding title"
                placeholder="Start typing…"
                onSearch={onSearch}
                suggestionsLabel="Suggestions"
                value={v}
                onValueChange={setV}
                allowCreate
                onCreate={(q) => alert(`Create: "${q}"`)}
                fullWidth
            />
        );
    },
};

export const Error: Story = {
    args: {
        label: 'Finding title',
        required: true,
        placeholder: 'Search…',
        options: findings,
        error: 'Title required.',
        fullWidth: true,
    },
};
