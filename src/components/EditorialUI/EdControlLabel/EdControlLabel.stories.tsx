import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EdControlLabel } from './EdControlLabel';
import { EdCheckboxInput } from '../EdCheckboxInput';
import { EdSwitch } from '../EdSwitch';

const meta: Meta<typeof EdControlLabel> = {
    title: 'EditorialUI/Forms/EdControlLabel',
    component: EdControlLabel,
    parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof EdControlLabel>;

export const WithCheckbox: Story = {
    render: () => {
        const [on, setOn] = useState(false);
        return (
            <EdControlLabel
                label="Include superseded findings"
                control={<EdCheckboxInput checked={on} onChange={(e) => setOn(e.target.checked)} />}
            />
        );
    },
};

export const WithSwitch: Story = {
    render: () => {
        const [on, setOn] = useState(true);
        return (
            <EdControlLabel
                label="Notify on completion"
                labelPlacement="start"
                control={<EdSwitch checked={on} onCheckedChange={setOn} />}
            />
        );
    },
};

export const Placements: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <EdControlLabel label="Label after (default)" control={<EdCheckboxInput defaultChecked />} />
            <EdControlLabel
                label="Label before"
                labelPlacement="start"
                control={<EdCheckboxInput defaultChecked />}
            />
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <EdControlLabel disabled label="Disabled, unchecked" control={<EdCheckboxInput />} />
            <EdControlLabel disabled label="Disabled, checked" control={<EdCheckboxInput defaultChecked />} />
        </div>
    ),
};
