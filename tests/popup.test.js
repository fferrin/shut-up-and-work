import { beforeEach, describe, test, expect, vi } from 'vitest';
import { toggleCurrencySymbol, checkInputs, updateHourlyRate } from '../extension/popup.js';

describe('toggleCurrencySymbol', () => {
  let salaryInput, currencyDiv;

  beforeEach(() => {
    global.chrome = {
        storage: {
            local: {
                set: vi.fn(),
                get: vi.fn(),
            },
        },
    };
    salaryInput = document.createElement('input');
    currencyDiv = document.createElement('div');
  });

  test('adds classes when salary input has value', () => {
    salaryInput.value = '5000';
    toggleCurrencySymbol(salaryInput, currencyDiv);
    expect(currencyDiv.classList.contains('visible')).toBe(true);
    expect(salaryInput.classList.contains('with-currency')).toBe(true);
  });

  test('removes classes when salary input is empty', () => {
    salaryInput.value = '';
    currencyDiv.classList.add('visible');
    salaryInput.classList.add('with-currency');

    toggleCurrencySymbol(salaryInput, currencyDiv);
    expect(currencyDiv.classList.contains('visible')).toBe(false);
    expect(salaryInput.classList.contains('with-currency')).toBe(false);
  });
});

describe('checkInputs', () => {
  let salaryInput, hoursInput, saveButton;

  beforeEach(() => {
    global.chrome = {
        storage: {
            local: {
                set: vi.fn(),
                get: vi.fn(),
            },
        },
    };
    salaryInput = document.createElement('input');
    hoursInput = document.createElement('input');
    saveButton = document.createElement('button');
  });

  test('enables save button when both inputs have values', () => {
    salaryInput.value = '5000';
    hoursInput.value = '160';
    checkInputs(salaryInput, hoursInput, saveButton);
    expect(saveButton.disabled).toBe(false);
  });

  test('disables save button if salary is empty', () => {
    salaryInput.value = '';
    hoursInput.value = '160';
    checkInputs(salaryInput, hoursInput, saveButton);
    expect(saveButton.disabled).toBe(true);
  });

  test('disables save button if hours is empty', () => {
    salaryInput.value = '5000';
    hoursInput.value = '';
    checkInputs(salaryInput, hoursInput, saveButton);
    expect(saveButton.disabled).toBe(true);
  });

  test('disables save button if both inputs are empty', () => {
    salaryInput.value = '';
    hoursInput.value = '';
    checkInputs(salaryInput, hoursInput, saveButton);
    expect(saveButton.disabled).toBe(true);
  });
});


describe('updateHourlyRate', () => {
  let salaryInput, hoursInput, rateValueSpan, hourlyRateDiv, updatePriceCallback;

  beforeEach(() => {
    salaryInput = document.createElement('input');
    hoursInput = document.createElement('input');
    rateValueSpan = document.createElement('span');
    hourlyRateDiv = document.createElement('div');
    hourlyRateDiv.classList.add('hidden');
    updatePriceCallback = vi.fn();
  });

  test('calculates and displays hourly rate when inputs are valid', () => {
    salaryInput.value = '4000';
    hoursInput.value = '160';

    updateHourlyRate(salaryInput, hoursInput, rateValueSpan, hourlyRateDiv, updatePriceCallback);

    expect(rateValueSpan.textContent).toBe('25.00');
    expect(hourlyRateDiv.classList.contains('hidden')).toBe(false);
    expect(updatePriceCallback).toHaveBeenCalledWith(25);
  });

  test('hides hourlyRateDiv when salary is invalid', () => {
    salaryInput.value = 'abc';
    hoursInput.value = '160';

    updateHourlyRate(salaryInput, hoursInput, rateValueSpan, hourlyRateDiv, updatePriceCallback);

    expect(hourlyRateDiv.classList.contains('hidden')).toBe(true);
    expect(updatePriceCallback).not.toHaveBeenCalled();
  });

  test('hides hourlyRateDiv when hours is invalid', () => {
    salaryInput.value = '4000';
    hoursInput.value = 'abc';

    updateHourlyRate(salaryInput, hoursInput, rateValueSpan, hourlyRateDiv, updatePriceCallback);

    expect(hourlyRateDiv.classList.contains('hidden')).toBe(true);
    expect(updatePriceCallback).not.toHaveBeenCalled();
  });

  test('hides hourlyRateDiv when hours is zero', () => {
    salaryInput.value = '4000';
    hoursInput.value = '0';

    updateHourlyRate(salaryInput, hoursInput, rateValueSpan, hourlyRateDiv, updatePriceCallback);

    expect(hourlyRateDiv.classList.contains('hidden')).toBe(true);
    expect(updatePriceCallback).not.toHaveBeenCalled();
  });
});