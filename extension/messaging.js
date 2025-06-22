
function sendMessageToServiceWorker(eventName, payload) {
  return chrome.runtime.sendMessage({ type: eventName, payload });
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

export { sendMessageToServiceWorker, sendMessageToContent, sendMessageToPopup };