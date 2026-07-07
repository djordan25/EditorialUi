import type { Meta, StoryObj } from '@storybook/react';
import {
    EdTable,
    EdTableBody,
    EdTableCell,
    EdTableContainer,
    EdTableHead,
    EdTableRow,
} from './EdTable';

const meta: Meta<typeof EdTable> = {
    title: 'EditorialUI/Data/EdTable',
    component: EdTable,
    parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof EdTable>;

export const Basic: Story = {
    render: () => (
        <EdTable>
            <EdTableHead>
                <EdTableRow>
                    <EdTableCell>Validator</EdTableCell>
                    <EdTableCell align="right">Open</EdTableCell>
                    <EdTableCell align="right">Closed</EdTableCell>
                </EdTableRow>
            </EdTableHead>
            <EdTableBody>
                <EdTableRow>
                    <EdTableCell component="th" scope="row">
                        A. Okoro
                    </EdTableCell>
                    <EdTableCell align="right">12</EdTableCell>
                    <EdTableCell align="right">140</EdTableCell>
                </EdTableRow>
                <EdTableRow>
                    <EdTableCell component="th" scope="row">
                        M. Adeyemi
                    </EdTableCell>
                    <EdTableCell align="right">3</EdTableCell>
                    <EdTableCell align="right">88</EdTableCell>
                </EdTableRow>
            </EdTableBody>
        </EdTable>
    ),
};

export const ColSpan: Story = {
    render: () => (
        <EdTable>
            <EdTableHead>
                <EdTableRow>
                    <EdTableCell colSpan={2} align="center">
                        Q2 wholesale
                    </EdTableCell>
                    <EdTableCell align="right">Total</EdTableCell>
                </EdTableRow>
            </EdTableHead>
            <EdTableBody>
                <EdTableRow>
                    <EdTableCell>PD</EdTableCell>
                    <EdTableCell>LGD</EdTableCell>
                    <EdTableCell align="right">0.42</EdTableCell>
                </EdTableRow>
            </EdTableBody>
        </EdTable>
    ),
};

export const StickyHeaderScroll: Story = {
    render: () => (
        <EdTableContainer style={{ maxHeight: 200 }}>
            <EdTable stickyHeader>
                <EdTableHead>
                    <EdTableRow>
                        <EdTableCell>Row</EdTableCell>
                        <EdTableCell align="right">Value</EdTableCell>
                    </EdTableRow>
                </EdTableHead>
                <EdTableBody>
                    {Array.from({ length: 20 }, (_, i) => (
                        <EdTableRow key={i}>
                            <EdTableCell component="th" scope="row">
                                Item {i + 1}
                            </EdTableCell>
                            <EdTableCell align="right">{(i * 7) % 100}</EdTableCell>
                        </EdTableRow>
                    ))}
                </EdTableBody>
            </EdTable>
        </EdTableContainer>
    ),
};
