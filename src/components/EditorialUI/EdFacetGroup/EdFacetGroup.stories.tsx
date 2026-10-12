import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EdFacetGroup, EdFacetRow } from './EdFacetGroup';
import { EdTierBadge } from '../EdTierBadge';
import { EdStatusDot } from '../EdStatusDot';

const meta: Meta<typeof EdFacetGroup> = {
    title: 'EditorialUI/Composites/EdFacetGroup',
    component: EdFacetGroup,
    parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof EdFacetGroup>;

function Rail() {
    const [tiers, setTiers] = useState(new Set([1, 2, 3]));
    const [health, setHealth] = useState(new Set(['ok', 'warn', 'bad']));
    const toggle = <T,>(set: Set<T>, v: T, setter: (s: Set<T>) => void) => {
        const next = new Set(set);
        if (next.has(v)) next.delete(v); else next.add(v);
        setter(next);
    };
    return (
        <aside style={{ width: 248, padding: 18, background: 'var(--ed-color-surface-1)' }}>
            <EdFacetGroup label="Tier">
                {([1, 2, 3] as const).map(t => (
                    <EdFacetRow
                        key={t}
                        checked={tiers.has(t)}
                        onCheckedChange={() => toggle(tiers, t, setTiers)}
                        label={<><EdTierBadge tier={t} /> Tier {['I', 'II', 'III'][t - 1]}</>}
                        count={[7, 6, 3][t - 1]}
                    />
                ))}
            </EdFacetGroup>
            <EdFacetGroup label="Validation">
                {([['ok', 'success', 'all clear', 9], ['warn', 'warning', 'in review', 5], ['bad', 'danger', 'failing', 2]] as const).map(
                    ([key, tone, label, count]) => (
                        <EdFacetRow
                            key={key}
                            checked={health.has(key)}
                            onCheckedChange={() => toggle(health, key, setHealth)}
                            label={<><EdStatusDot tone={tone} /> {label}</>}
                            count={count}
                        />
                    ),
                )}
            </EdFacetGroup>
        </aside>
    );
}

export const FilterRail: Story = { render: () => <Rail /> };
