import { convertTime } from './utils.js';


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.debug(
    "content.js - Message received in content.js:",
    JSON.stringify(msg),
  );
})

function addHiddenTimeElement(priceElement, hourlyRate) {
  const hiddenElement = document.createElement('span');
  const aPrice = priceElement.querySelector('span[aria-hidden="true"]')
  if (aPrice) {
    const whole = aPrice.querySelector('.a-price-whole')?.textContent.replace('.', '') || '';
    const fraction = aPrice.querySelector('.a-price-fraction')?.textContent || '';
    const price = `${whole}.${fraction}`;

    hiddenElement.setAttribute('aria-hidden', true);
    hiddenElement.setAttribute('data-shut-up-and-work', true);
    hiddenElement.style.display = 'none'
    hiddenElement.textContent = convertTime(price / hourlyRate);
    priceElement.appendChild(hiddenElement);
  }
}

document.addEventListener("readystatechange", function () {
  const hourlyRate = 25.0;
  const prices = document.querySelectorAll('.a-price');

  let showOriginal = true;

  const originalPrices = Array.from(prices).map(el => el.textContent);

  prices.forEach((p) => {
    p.setAttribute('data-custom-toggle', 'false');
    addHiddenTimeElement(p, hourlyRate);
  });

  // Function to toggle text
  function togglePrices() {
    prices.forEach((p, i) => {
      if (!showOriginal) {
        p.querySelectorAll('span[aria-hidden="true"]:not([data-shut-up-and-work])').forEach((el) => {
          el.style.display = 'block';
        })
        p.querySelector('span[aria-hidden="true"][data-shut-up-and-work]').style.display = 'none';
      } else {
        p.querySelectorAll('span[aria-hidden="true"][data-shut-up-and-work]').forEach((el) => {
          el.style.display = 'block';
        })
        p.querySelector('span[aria-hidden="true"]:not([data-shut-up-and-work])').style.display = 'none';
      }
    });
    showOriginal = !showOriginal;
  }

  togglePrices()
})
