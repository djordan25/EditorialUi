import type { Meta, StoryObj } from '@storybook/react';
import { EdAppBar, EdAppBarNav, EdAppBarNavItem, EdAppBarNavMenu } from './EdAppBar';
import { EdAvatar } from '../EdAvatar';
import { EdStatusDot } from '../EdStatusDot';

const meta: Meta<typeof EdAppBar> = {
    title: 'EditorialUI/Navigation/EdAppBar',
    component: EdAppBar,
    parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof EdAppBar>;

const mark = (
    <span
        aria-hidden="true"
        style={{ width: 18, height: 18, background: 'var(--ed-color-text-primary)', borderRadius: 1, display: 'inline-block' }}
    />
);

export const Default: Story = {
    render: () => (
        <EdAppBar
            brand={<>{mark} Cerynto</>}
            version="v0.51"
            nav={
                <EdAppBarNav aria-label="Main">
                    <EdAppBarNavItem href="#" active>Models</EdAppBarNavItem>
                    <EdAppBarNavItem href="#">Components</EdAppBarNavItem>
                    <EdAppBarNavItem href="#">Iterators</EdAppBarNavItem>
                    <EdAppBarNavItem href="#">Runs</EdAppBarNavItem>
                    <EdAppBarNavMenu
                        label="Governance"
                        items={[
                            { id: 'settings', label: 'Settings', onSelect: () => {} },
                            { id: 'exceptions', label: 'Exceptions', onSelect: () => {} },
                        ]}
                    />
                </EdAppBarNav>
            }
            end={
                <>
                    <span><EdStatusDot tone="success" /> all systems nominal</span>
                    <span>DEV · 14:32 UTC</span>
                    <EdAvatar name="Henrik Lindqvist" />
                </>
            }
        />
    ),
};
