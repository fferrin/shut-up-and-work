import { convertTime, parsePrice } from './utils.js';

function addHiddenTimeElement(priceElement) {
  const aPrice = priceElement.querySelector('span[aria-hidden="true"]');

  if (aPrice) {
    const whole =
      aPrice.querySelector('.a-price-whole')?.textContent.replace('.', '') ||
      '';
    const fraction =
      aPrice.querySelector('.a-price-fraction')?.textContent || '';
    const price = `${whole}.${fraction}`;
    const original =
      priceElement
        .querySelector('.a-offscreen')
        ?.textContent.replace('$', '') || '';
    const finalPrice = original.trim() || price.trim();

    const hiddenElement = document.createElement('span');
    hiddenElement.setAttribute('aria-hidden', true);
    hiddenElement.setAttribute('data-shut-up-and-work', true);
    hiddenElement.style.display = 'none';

    const label = document.createElement('span');
    label.textContent = 'Work for ';
    label.style.fontSize = '12px';
    label.style.color = '#16a34a';

    const timeValue = document.createElement('span');
    timeValue.setAttribute('data-price-as-time', '');
    timeValue.setAttribute('data-original-price', price);
    timeValue.setAttribute('data-original-offscreen-price', original);
    timeValue.setAttribute('data-original-final-price', finalPrice);
    timeValue.style.fontSize = '24px';
    timeValue.style.fontWeight = 'bold';
    timeValue.style.color = '#16a34a';

    hiddenElement.appendChild(label);
    hiddenElement.appendChild(timeValue);

    priceElement.appendChild(hiddenElement);
  }
}

function togglePrices(showAsTime) {
  const prices = document.querySelectorAll('.a-price');

  prices.forEach((p, i) => {
    if (showAsTime) {
      p.querySelectorAll(
        'span[aria-hidden="true"][data-shut-up-and-work]',
      ).forEach((el) => {
        el.style.display = 'block';
      });
      p.querySelector(
        'span[aria-hidden="true"]:not([data-shut-up-and-work])',
      ).style.display = 'none';
    } else {
      p.querySelectorAll(
        'span[aria-hidden="true"]:not([data-shut-up-and-work])',
      ).forEach((el) => {
        el.style.display = 'block';
      });
      p.querySelector(
        'span[aria-hidden="true"][data-shut-up-and-work]',
      ).style.display = 'none';
    }
  });
}

function updatePrices(hourlyRate, hoursPerDay = 24, daysPerWeek = 7) {
  const prices = document.querySelectorAll('span[data-original-final-price]');

  prices.forEach((p) => {
    const finalPrice = p.getAttribute('data-original-final-price');
    p.textContent = convertTime(parsePrice(finalPrice) / hourlyRate, hoursPerDay, daysPerWeek);
  });
}

function addPriceTagElements() {
  const prices = document.querySelectorAll('.a-price');

  prices.forEach((p) => {
    p.setAttribute('data-custom-toggle', 'false');
    addHiddenTimeElement(p);
  });
}

export {
  addHiddenTimeElement,
  togglePrices,
  updatePrices,
  addPriceTagElements,
};
