import { convertTime } from './utils.js';


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.debug(
    "content.js - Message received in content.js:",
    JSON.stringify(msg),
  );

  switch (msg.type) {
    case "toggleDisplayMode":
      togglePrices(msg.payload);
      break;
  }
})

function addHiddenTimeElement(priceElement, hourlyRate) {
  const aPrice = priceElement.querySelector('span[aria-hidden="true"]')

  if (aPrice) {
    const whole = aPrice.querySelector('.a-price-whole')?.textContent.replace('.', '') || '';
    const fraction = aPrice.querySelector('.a-price-fraction')?.textContent || '';
    const price = `${whole}.${fraction}`;
    const original = priceElement.querySelector('.a-offscreen')?.textContent.replace('$', '') || '';
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
    timeValue.setAttribute("data-original-price", price);
    timeValue.setAttribute("data-original-offscreen-price", original);
    timeValue.textContent = convertTime(finalPrice / hourlyRate);
    timeValue.style.fontSize = '24px';
    timeValue.style.fontWeight = 'bold';
    timeValue.style.color = '#16a34a';

    hiddenElement.appendChild(label);
    hiddenElement.appendChild(timeValue);

    priceElement.appendChild(hiddenElement);
  }
}

// Function to toggle text
function togglePrices(showAsTime) {
  const prices = document.querySelectorAll('.a-price');

  prices.forEach((p, i) => {
    if (showAsTime) {
      p.querySelectorAll('span[aria-hidden="true"][data-shut-up-and-work]').forEach((el) => {
        el.style.display = 'block';
      })
      p.querySelector('span[aria-hidden="true"]:not([data-shut-up-and-work])').style.display = 'none';
    } else {
      p.querySelectorAll('span[aria-hidden="true"]:not([data-shut-up-and-work])').forEach((el) => {
        el.style.display = 'block';
      })
      p.querySelector('span[aria-hidden="true"][data-shut-up-and-work]').style.display = 'none';
    }
  });
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
})
