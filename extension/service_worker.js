const messageTypes = {
    INIT: "INIT",
    FETCH_DATA: "FETCH_DATA",
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
    case messageTypes.INIT:
      sendMessageToContent("LOGGED_IN");
    case messageTypes.FETCH_DATA:
      sendMessageToContent("FETCHED_DATA", { hourlySalary: 1234 });
  }
})
