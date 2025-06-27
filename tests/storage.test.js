import { saveSettings, loadSettings } from '../extension/storage';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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
        saveSettings(3200, 8, 5, true);

        expect(chrome.storage.local.set).toHaveBeenCalledWith({
            monthlySalary: 3200,
            hourlyRate: 3200 / (8 * 5 * 4), // Assuming 4 weeks in a month
            hoursPerDay: 8,
            daysPerWeek: 5,
            showAsTime: true,
        });
    });

    it('loadSettings retrieves and resolves settings', async () => {
        chrome.storage.local.get.mockImplementation((keys, callback) => {
            callback({
                hourlyRate: 20,
                monthlySalary: 3200,
                hoursPerDay: 8,
                daysPerWeek: 5,
                showAsTime: true,
            });
        });

        const settings = await loadSettings();

        expect(settings).toEqual({
            hourlyRate: 20,
            monthlySalary: 3200,
            hoursPerDay: 8,
            daysPerWeek: 5,
            showAsTime: true,
        });
    });
});
