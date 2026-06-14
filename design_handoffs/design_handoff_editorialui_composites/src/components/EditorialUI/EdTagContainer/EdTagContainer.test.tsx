import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdTagContainer } from './EdTagContainer';

const Tag = ({ children }: { children: React.ReactNode }) => <span>{children}</span>;

describe('EdTagContainer', () => {
    it('renders all tags in wrap mode', () => {
        render(
            <EdTagContainer>
                <Tag>a</Tag><Tag>b</Tag><Tag>c</Tag>
            </EdTagContainer>,
        );
        expect(screen.getByText('a')).toBeInTheDocument();
        expect(screen.getByText('c')).toBeInTheDocument();
    });

    it('collapses to +N more in single-row mode', () => {
        render(
            <EdTagContainer mode="single-row" maxVisible={2}>
                <Tag>a</Tag><Tag>b</Tag><Tag>c</Tag><Tag>d</Tag>
            </EdTagContainer>,
        );
        expect(screen.getByText('a')).toBeInTheDocument();
        expect(screen.getByText('b')).toBeInTheDocument();
        expect(screen.queryByText('c')).toBeNull();
        expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('does not show overflow when within maxVisible', () => {
        render(
            <EdTagContainer mode="single-row" maxVisible={3}>
                <Tag>a</Tag><Tag>b</Tag>
            </EdTagContainer>,
        );
        expect(screen.queryByText(/more/)).toBeNull();
    });

    it('uses renderOverflow when provided', () => {
        render(
            <EdTagContainer
                mode="single-row"
                maxVisible={1}
                renderOverflow={(_, n) => <button>show {n}</button>}
            >
                <Tag>a</Tag><Tag>b</Tag><Tag>c</Tag>
            </EdTagContainer>,
        );
        expect(screen.getByRole('button', { name: 'show 2' })).toBeInTheDocument();
    });

    it('renders the empty state when no children', () => {
        render(<EdTagContainer>{[]}</EdTagContainer>);
        expect(screen.getByText('No tags assigned')).toBeInTheDocument();
    });

    it('renders a custom empty node', () => {
        render(<EdTagContainer empty={<span>nothing here</span>}>{[]}</EdTagContainer>);
        expect(screen.getByText('nothing here')).toBeInTheDocument();
    });
});
