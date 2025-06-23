import { convertTime, parsePrice } from '../extension/src/utils';
import { describe, it, expect } from 'vitest';

describe('convertTime', () => {
    it.each([
        [8760, '1 year'],
        [4380, '6 months'],
        [168, '1 week'],
        [48, '2 days'],
        [5.99938, '6 hours'],
        [6.00001, '6 hours'],
        [1, '1 hour'],
        [0.5, '30 minutes'],
        [0.0001, 'less than a second'],
        [0, 'less than a second']
    ])('converts %p hours to %p', (input, expected) => {
        expect(convertTime(input)).toBe(expected);
    });
});

describe('parsePrice', () => {
    it.each([
        [10, 10],
        ['10', 10],
        ['10.00', 10],
        [10.00, 10],
        ['1,999.00', 1999],
    ])('converts %p to %p', (input, expected) => {
        expect(parsePrice(input)).toBe(expected);
    });
});