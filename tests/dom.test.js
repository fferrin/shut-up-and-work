import { beforeEach, describe, it, expect } from 'vitest';
import { addHiddenTimeElement, togglePrices, updatePrices, addPriceTagElements } from '../extension/src/dom';

describe('Amazon website', () => {
  const hourlyRate = 60;
  const expectedPrices = [
    { price: '120.00', asTime: '2 hours' },
    { price: '60.00', asTime: '1 hour' },
    { price: '1.00', asTime: '1 minute' },
    { price: '0.50', asTime: '30 seconds' }
  ];

  beforeEach(() => {
    document.body.innerHTML = expectedPrices.map(p => {
      const [whole, fraction] = p.price.split('.');
      return `
      <div class="a-price">
        <span aria-hidden="true" test-id="original-price">
          <span class="a-price-whole">${whole}</span>
          <span class="a-price-fraction">${fraction}</span>
        </span>
        <span class="a-offscreen">$${p.price}</span>
      </div>
    `;
    }).join('');
  });

  describe('addHiddenTimeElement', () => {
    it('with correct attributes', () => {
      const priceElement = document.querySelectorAll('.a-price');
      priceElement.forEach((p) => {
        addHiddenTimeElement(p);
      });

      priceElement.forEach((p, i) => {
        const hiddenElement = p.querySelector('[data-shut-up-and-work]');
        expect(hiddenElement).not.toBeNull();
        const timeValue = hiddenElement.querySelector('[data-price-as-time]');
        expect(timeValue).not.toBeNull();
        expect(timeValue.getAttribute('data-original-price')).toBe(expectedPrices[i].price);
        expect(timeValue.getAttribute('data-original-offscreen-price')).toBe(expectedPrices[i].price);
        expect(timeValue.getAttribute('data-original-final-price')).toBe(expectedPrices[i].price);
      });
    });
  });

  describe('togglePrices', () => {
    beforeEach(() => {
      addPriceTagElements();
    });

    it('shows time prices and hides originals when showAsTime is true', () => {
      togglePrices(true);
      document.querySelectorAll('[test-id="original-price"]').forEach((el) => {
        expect(el.style.display).toBe('none');
      });
      document.querySelectorAll('[data-shut-up-and-work]').forEach((el) => {
        expect(el.style.display).toBe('block');
      });
    });

    it('shows original prices and hides time prices when showAsTime is false', () => {
      togglePrices(false);
      document.querySelectorAll('[test-id="original-price"]').forEach((el) => {
        expect(el.style.display).toBe('block');
      });
      document.querySelectorAll('[data-shut-up-and-work]').forEach((el) => {
        expect(el.style.display).toBe('none');
      });
    });
  });

  describe('updatePrices', () => {
    beforeEach(() => {
      addPriceTagElements();
    });

    it('updates text content based on hourlyRate', () => {
      updatePrices(hourlyRate);

      document.querySelectorAll('span[data-original-final-price]').forEach((el, i) => {
        expect(el.textContent).toBe(expectedPrices[i].asTime);
      });
    });
  });

  describe('addPriceTagElements', () => {
    it('sets data-custom-toggle and adds hidden time element', () => {
      addPriceTagElements();
      const prices = document.querySelectorAll('.a-price');

      prices.forEach(p => {
        expect(p.getAttribute('data-custom-toggle')).toBe('false');

        const hidden = p.querySelector('[data-shut-up-and-work]');
        expect(hidden).not.toBeNull();
        const timeValue = hidden.querySelector('[data-price-as-time]');
        expect(timeValue).not.toBeNull();
        expect(timeValue.getAttribute('data-original-price')).toBeTruthy();
        expect(timeValue.getAttribute('data-original-final-price')).toBeTruthy();
      });
    });
  });
})