import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdInlineSelect, type EdInlineSelectOption } from './EdInlineSelect';

const meta: Meta<typeof EdInlineSelect> = {
    title: 'EditorialUI/Selection/EdInlineSelect',
    component: EdInlineSelect as never,
    parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof EdInlineSelect>;

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

const USERS: EdInlineSelectOption<User>[] = [
    { value: { id: 'u1', name: 'Marcus Chen', email: 'marcus.chen@prodicus.io', role: 'Reviewer' }, label: 'Marcus Chen', secondary: 'marcus.chen@prodicus.io' },
    { value: { id: 'u2', name: 'Aisha Patel', email: 'aisha.patel@prodicus.io', role: 'Owner' }, label: 'Aisha Patel', secondary: 'aisha.patel@prodicus.io' },
    { value: { id: 'u3', name: 'Liam Novak', email: 'liam.novak@prodicus.io', role: 'Approver' }, label: 'Liam Novak', secondary: 'liam.novak@prodicus.io' },
    { value: { id: 'u4', name: 'Sara Kim', email: 'sara.kim@prodicus.io', role: 'Reviewer' }, label: 'Sara Kim', secondary: 'sara.kim@prodicus.io' },
];

export const Basic: Story = {
    render: () => {
        const [owner, setOwner] = useState<EdInlineSelectOption<User> | null>(null);
        return (
            <div style={{ width: 280 }}>
                <EdInlineSelect<User>
                    label="Owner"
                    options={USERS}
                    value={owner}
                    onChange={setOwner}
                    getOptionValue={(o) => o.value.id}
                    placeholder="Assign an owner…"
                    fullWidth
                />
                <p style={{ marginTop: 12, fontFamily: 'var(--ed-font-mono)', fontSize: 12, color: 'var(--ed-color-text-muted)' }}>
                    selected: {owner ? owner.value.id : '—'}
                </p>
            </div>
        );
    },
};

export const CustomOptionRow: Story = {
    render: () => {
        const [owner, setOwner] = useState<EdInlineSelectOption<User> | null>(USERS[1]);
        return (
            <div style={{ width: 320 }}>
                <EdInlineSelect<User>
                    label="Assignee"
                    options={USERS}
                    value={owner}
                    onChange={setOwner}
                    getOptionValue={(o) => o.value.id}
                    fullWidth
                    renderOption={(o, { query }) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <span
                                style={{
                                    width: 26,
                                    height: 26,
                                    flexShrink: 0,
                                    borderRadius: '50%',
                                    background: 'var(--ed-color-brand)',
                                    color: '#fff',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 11,
                                    fontWeight: 600,
                                }}
                            >
                                {o.value.name.split(' ').map((p) => p[0]).join('')}
                            </span>
                            <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                <span style={{ fontSize: 14 }}>{highlight(o.value.name, query)}</span>
                                <span style={{ fontSize: 12, color: 'var(--ed-color-text-muted)' }}>
                                    {o.value.email} · {o.value.role}
                                </span>
                            </span>
                        </div>
                    )}
                />
            </div>
        );
    },
};

export const Compact: Story = {
    render: () => {
        const [owner, setOwner] = useState<EdInlineSelectOption<User> | null>(null);
        return (
            <div style={{ width: 200 }}>
                <EdInlineSelect<User>
                    label="Owner"
                    size="sm"
                    options={USERS}
                    value={owner}
                    onChange={setOwner}
                    getOptionValue={(o) => o.value.id}
                    placeholder="Pick…"
                    fullWidth
                />
            </div>
        );
    },
};

function highlight(text: string, query: string) {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i < 0) return text;
    return (
        <>
            {text.slice(0, i)}
            <mark style={{ background: 'var(--ed-color-brand-bg)', color: 'inherit' }}>
                {text.slice(i, i + query.length)}
            </mark>
            {text.slice(i + query.length)}
        </>
    );
}
