import { loadSettings, saveSettings } from "./storage.js";

const messageTypes = {
    FETCH_DATA: "FETCH_DATA",
    SAVE_DATA: "SAVE_DATA",
}

function sendMessageToContent(eventName, payload) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { type: eventName, payload });
    }
  });
}

function sendMessageToPopup(eventName, payload) {
  chrome.runtime.sendMessage({ type: eventName, payload });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.debug(
    "service_worker - Message received in service_worker.js:",
    JSON.stringify(msg),
  );
  switch (msg.type) {
    case messageTypes.SAVE_DATA:
      saveSettings(
        parseFloat(msg.payload.hoursPerMonth),
        parseFloat(msg.payload.monthlySalary),
        msg.payload.showAsTime,
      ).then(() => {
        loadSettings()
          .then((result) => {
            sendMessageToPopup("FETCHED_DATA", result);
            sendMessageToContent("HOURLY_RATE_UPDATED", { hourlyRate: result.hourlyRate });
            sendMessageToContent("SHOW_PRICES_AS_TIME", { show: result.showAsTime });
          });
      });
      break;
    case messageTypes.FETCH_DATA:
      loadSettings().then((result) => {
        sendMessageToPopup("FETCHED_DATA", result);
        sendMessageToContent("HOURLY_RATE_UPDATED", { hourlyRate: result.hourlyRate });
        sendMessageToContent("SHOW_PRICES_AS_TIME", { show: result.showAsTime });
      });
      break;
  }
})
