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
        saveSettings(160, 3200, true, 8, 5);

        expect(chrome.storage.local.set).toHaveBeenCalledWith({
            hoursWorked: 160,
            monthlySalary: 3200,
            hourlyRate: 3200 / 160,
            showAsTime: true,
            hoursPerDay: 8,
            daysPerWeek: 5,
        });
    });

    it('Backward compatibility: saveSettings stores correct values', () => {
        saveSettings(160, 3200, true);

        expect(chrome.storage.local.set).toHaveBeenCalledWith({
            hoursWorked: 160,
            monthlySalary: 3200,
            hourlyRate: 3200 / 160,
            showAsTime: true,
            hoursPerDay: undefined,
            daysPerWeek: undefined,
        });
    });

    it('loadSettings retrieves and resolves settings', async () => {
        chrome.storage.local.get.mockImplementation((keys, callback) => {
            callback({
                hoursWorked: 160,
                monthlySalary: 3200,
                hourlyRate: 20,
                hoursPerDay: 8,
                daysPerWeek: 5,
                showAsTime: true,
            });
        });

        const settings = await loadSettings();

        expect(settings).toEqual({
            hoursWorked: 160,
            monthlySalary: 3200,
            hourlyRate: 20,
            hoursPerDay: 8,
            daysPerWeek: 5,
            showAsTime: true,
        });
    });

    it('Backward compatibility: loadSettings retrieves and resolves settings', async () => {
        chrome.storage.local.get.mockImplementation((keys, callback) => {
            callback({
                hoursWorked: 160,
                monthlySalary: 3200,
                hourlyRate: 20,
                showAsTime: true,
                hoursPerDay: undefined,
                daysPerWeek: undefined,
            });
        });

        const settings = await loadSettings();

        expect(settings).toEqual({
            hoursWorked: 160,
            monthlySalary: 3200,
            hourlyRate: 20,
            showAsTime: true,
            hoursPerDay: undefined,
            daysPerWeek: undefined,
        });
    });
});
