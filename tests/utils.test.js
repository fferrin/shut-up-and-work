import { convertTime, parsePrice } from '../extension/src/utils';
import { describe, it, expect } from 'vitest';

describe('convertTime2', () => {
    it.each([
        // Test cases to match the original function's behavior
        [8760, 24, 7, '1 year'],
        [4380, 24, 7, '6 months'],
        [168, 24, 7, '1 week'],
        [48, 24, 7, '2 days'],
        [5.99938, 24, 7, '6 hours'],
        [6.00001, 24, 7, '6 hours'],
        [1, 24, 7, '1 hour'],
        [0.5, 24, 7, '30 minutes'],
        [0.0001, 24, 7, 'less than a second'],
        [0, 24, 7, 'less than a second'],
        // Additional test cases with different hoursPerDay and daysPerWeek
        [16, 8, 7, '2 days'],
        [40, 8, 5, '1 week'],
        [40, 4, 5, '2 weeks'],
        [2085, 8, 5, '1 year'],
    ])('converts %p hours to %p', (hours, hoursPerDay, daysPerWeek, expected) => {
        expect(convertTime(hours, hoursPerDay, daysPerWeek)).toBe(expected);
    });

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
    ])('backwards compatibility: Converts %p hours to %p', (input, expected) => {
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