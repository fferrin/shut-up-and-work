import { addPriceTagElements, togglePrices, updatePrices } from './dom.js';

function sendMessageToServiceWorker(eventName, payload) {
  return chrome.runtime.sendMessage({ type: eventName, payload });
}

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

document.addEventListener("readystatechange", function () {
  addPriceTagElements();
  sendMessageToServiceWorker("FETCH_DATA")
})
