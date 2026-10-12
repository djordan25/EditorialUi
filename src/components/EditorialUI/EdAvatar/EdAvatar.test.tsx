import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EdAvatar, initialsOf } from './EdAvatar';

describe('EdAvatar', () => {
    it('shows initials and names the person for assistive technology', () => {
        render(<EdAvatar name="Anika Rao" />);
        const avatar = screen.getByRole('img', { name: 'Anika Rao' });
        expect(avatar).toHaveTextContent('AR');
    });

    it('takes first and last initials, and copes with one name or none', () => {
        expect(initialsOf('Henrik Lindqvist')).toBe('HL');
        expect(initialsOf('Priya van der Berg')).toBe('PB');
        expect(initialsOf('Priya')).toBe('P');
        expect(initialsOf('  ')).toBe('?');
    });

    it('uses explicit initials, at most two characters', () => {
        render(<EdAvatar name="System" initials="SYS" />);
        expect(screen.getByRole('img', { name: 'System' })).toHaveTextContent('SY');
    });
});
