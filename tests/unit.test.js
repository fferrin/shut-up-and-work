import { convertTime } from '../extension/src/utils';
import { saveSettings, loadSettings } from '../extension/storage';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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

describe('storage', () => {
    beforeEach(() => {
        global.chrome = {
            storage: {
                local: {
                    set: vi.fn(),
                    get: vi.fn(),
                },
            },
        };
    });

    it('saveSettings stores correct values', () => {
        saveSettings(160, 3200, true);

        expect(chrome.storage.local.set).toHaveBeenCalledWith({
            hoursWorked: 160,
            monthlySalary: 3200,
            hourlyRate: 3200 / 160,
            showAsTime: true,
        });
    });

    it('loadSettings retrieves and resolves settings', async () => {
        chrome.storage.local.get.mockImplementation((keys, callback) => {
            callback({
                hoursWorked: 160,
                monthlySalary: 3200,
                hourlyRate: 20,
                showAsTime: true,
            });
        });

        const settings = await loadSettings();

        expect(settings).toEqual({
            hoursWorked: 160,
            monthlySalary: 3200,
            hourlyRate: 20,
            showAsTime: true,
        });
    });
});
