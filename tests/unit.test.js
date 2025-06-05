const { convertTime } = require('../extension/utils');

describe('convertTime', () => {
    test.each([
        [8760, '1 year'],
        [4380, '6 months'],
        [168, '1 week'],
        [48, '2 days'],
        [1, '1 hour'],
        [0.5, '30 minutes'],
        [0.0001, 'less than a second'],
        [0, 'less than a second']
    ])('converts %p hours to %p', (input, expected) => {
        expect(convertTime(input)).toBe(expected);
    });
});