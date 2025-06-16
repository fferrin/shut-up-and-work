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
