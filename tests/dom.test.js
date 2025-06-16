import { it, expect } from 'vitest';
import { addHiddenTimeElement } from '../extension/src/dom';

it('addHiddenTimeElement adds hidden element with correct attributes', () => {
  document.body.innerHTML = `
    <div id="price">
      <span aria-hidden="true">
        <span class="a-price-whole">123</span>
        <span class="a-price-fraction">45</span>
      </span>
      <span class="a-offscreen">$123.45</span>
    </div>
  `;

  const priceElement = document.getElementById('price');
  addHiddenTimeElement(priceElement);

  const hiddenElement = priceElement.querySelector('[data-shut-up-and-work]');
  expect(hiddenElement).not.toBeNull();

  const timeValue = hiddenElement.querySelector('[data-price-as-time]');
  expect(timeValue).not.toBeNull();
  expect(timeValue.getAttribute('data-original-price')).toBe('123.45');
  expect(timeValue.getAttribute('data-original-offscreen-price')).toBe('123.45');
  expect(timeValue.getAttribute('data-original-final-price')).toBe('123.45');
});
