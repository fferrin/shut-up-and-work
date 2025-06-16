import { convertTime } from './utils.js';
import { addHiddenTimeElement } from './dom.js';

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.debug(
    "content.js - Message received in content.js:",
    JSON.stringify(msg),
  );

  switch (msg.type) {
    case "HOURLY_RATE_UPDATED":
      updatePrices(msg.payload.hourlyRate);
      break;
    case "SHOW_PRICES_AS_TIME":
      togglePrices(msg.payload.show);
      break;
  }
})

function updatePrices(hourlyRate) {
  const prices = document.querySelectorAll('span[data-original-final-price]');

  prices.forEach((p) => {
    const finalPrice = p.getAttribute('data-original-final-price')
    p.textContent = convertTime(finalPrice / hourlyRate)
  });
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

function addPriceTagElements() {
  const prices = document.querySelectorAll('.a-price');

  prices.forEach((p) => {
    p.setAttribute('data-custom-toggle', 'false');
    addHiddenTimeElement(p);
  });
}

document.addEventListener("readystatechange", function () {
  if (document.readyState === "complete") {
    addPriceTagElements();
  }
})
