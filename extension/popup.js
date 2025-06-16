function sendMessageToServiceWorker(eventName, payload) {
  return chrome.runtime.sendMessage({ type: eventName, payload });
}

function sendMessageToContentScript(eventName, payload) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { type: eventName, payload });
    }
  });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  switch (msg.type) {
    case "FETCHED_DATA":
      const payload = msg.payload;
      if (payload.hourlyRate) {
        document.getElementById("monthly-salary").value = payload.monthlySalary;
        document.getElementById("hours-per-month").value = payload.hoursWorked;
        document.getElementById("rate-value").textContent = payload.hourlyRate.toFixed(2);
        document.getElementById("hourly-rate").classList.remove("hidden");
        document.getElementById("display-mode").checked = payload.showAsTime;
        document.getElementById('save-button').disabled = payload.hourlyRate === '';
        showPricesAsTime(payload.showAsTime);
        updatePrices(payload.hourlyRate);
      }
      break;
  }
})

function showPricesAsTime(show) {
    sendMessageToContentScript("SHOW_PRICES_AS_TIME", { show });
}

function updatePrices(hourlyRate) {
    sendMessageToContentScript("HOURLY_RATE_UPDATED", { hourlyRate });
}

document.addEventListener("DOMContentLoaded", function () {
  sendMessageToServiceWorker("FETCH_DATA")
  const salaryInput = document.getElementById("monthly-salary");
  // const currencySymbol = document.getElementById("currency-symbol");

  // if (salaryInput.value && salaryInput.value.trim() !== "") {
  //   currencySymbol.classList.add("visible");
  // }

  // salaryInput.addEventListener("input", function () {
  //   if (this.value && this.value.trim() !== "") {
  //     currencySymbol.classList.add("visible");
  //   } else {
  //     currencySymbol.classList.remove("visible");
  //   }
  // });

  // salaryInput.addEventListener("focus", function () {
  //   if (this.value && this.value.trim() !== "") {
  //     currencySymbol.classList.add("visible");
  //   }
  // });

  document.getElementById("save-button").addEventListener("click", function () {
    const hoursPerMonth = document.getElementById("hours-per-month").value;
    const monthlySalary = document.getElementById("monthly-salary").value;
    const showAsTime = document.getElementById("display-mode").checked;
    sendMessageToServiceWorker("SAVE_DATA", { hoursPerMonth, monthlySalary, showAsTime })
  });

  const hoursInput = document.getElementById('hours-per-month');
  const hourlyRateDiv = document.getElementById('hourly-rate');
  const rateValueSpan = document.getElementById('rate-value');
  const showAsTime = document.getElementById('display-mode');

  showAsTime.addEventListener('change', () => {
    console.log('showAsTime', showAsTime.checked);
    showPricesAsTime(showAsTime.checked);
  });

  function updateHourlyRate() {
    const salary = parseFloat(salaryInput.value);
    const hours = parseFloat(hoursInput.value);

    if (!isNaN(salary) && !isNaN(hours) && hours > 0) {
      const hourlyRate = salary / hours;
      updatePrices(hourlyRate);
      rateValueSpan.textContent = hourlyRate.toFixed(2);
      hourlyRateDiv.classList.remove('hidden');
    } else {
      hourlyRateDiv.classList.add('hidden');
    }
  }

  salaryInput.addEventListener('input', updateHourlyRate);
  hoursInput.addEventListener('input', updateHourlyRate);
  const saveButton = document.getElementById('save-button');

  saveButton.addEventListener('click', () => {
    const monthlySalary = parseFloat(salaryInput.value);
    const hoursPerMonth = parseFloat(hoursInput.value);
    const showAsTime = document.getElementById('display-mode').checked;

    sendMessageToServiceWorker("SAVE_DATA", { monthlySalary, hoursPerMonth, showAsTime });
  });
  function checkInputs() {
    const salary = salaryInput.value.trim();
    const hours = hoursInput.value.trim();
    console.log("CHECKING INPUTS", salary, hours);

    saveButton.disabled = salary === '' || hours === '';
  }

  checkInputs();
  salaryInput.addEventListener('input', () => {
    updateHourlyRate();
    checkInputs();
  });

  hoursInput.addEventListener('input', () => {
    updateHourlyRate();
    checkInputs();
  });
});
