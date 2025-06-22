import { loadSettings, saveSettings } from "./storage.js";
import { sendMessageToContent, sendMessageToPopup } from "./messaging.js";

const messageTypes = {
    FETCH_DATA: "FETCH_DATA",
    SAVE_DATA: "SAVE_DATA",
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
