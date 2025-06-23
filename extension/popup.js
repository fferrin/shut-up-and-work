import { sendMessageToServiceWorker, sendMessageToContent } from "./messaging.js";

function showPricesAsTime(show) {
    sendMessageToContent("SHOW_PRICES_AS_TIME", { show });
}

function updatePrices(hourlyRate) {
    sendMessageToContent("HOURLY_RATE_UPDATED", { hourlyRate });
}

function toggleCurrencySymbol(monthlySalaryInput, currencySymbolDiv) {
  if (monthlySalaryInput.value.trim() !== "") {
    currencySymbolDiv.classList.add("visible")
    monthlySalaryInput.classList.add("with-currency")
  } else {
    currencySymbolDiv.classList.remove("visible")
    monthlySalaryInput.classList.remove("with-currency")
  }
}

function checkInputs(salaryInput, hoursInput, saveButton) {
  const salary = salaryInput.value.trim();
  const hours = hoursInput.value.trim();

  saveButton.disabled = salary === '' || hours === '';
}

function updateHourlyRate(salaryInput, hoursInput, rateValueSpan, hourlyRateDiv, updatePriceCallback) {
  const salary = parseFloat(salaryInput.value);
  const hours = parseFloat(hoursInput.value);

  if (!isNaN(salary) && !isNaN(hours) && hours > 0) {
    const hourlyRate = salary / hours;
    updatePriceCallback(hourlyRate);
    rateValueSpan.textContent = hourlyRate.toFixed(2);
    hourlyRateDiv.classList.remove('hidden');
  } else {
    hourlyRateDiv.classList.add('hidden');
  }
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  const monthlySalaryInput = document.getElementById("monthly-salary");
  const hoursPerMonthInput = document.getElementById("hours-per-month");
  const displayModeInput = document.getElementById("display-mode");
  const saveButton = document.getElementById("save-button");
  const currencySymbol = document.getElementById("currency-symbol");
  const hourlyRateDiv = document.getElementById("hourly-rate");
  const rateValueSpan = document.getElementById("rate-value");

  switch (msg.type) {
    case "FETCHED_DATA":
      const payload = msg.payload;
      if (payload.hourlyRate) {
        monthlySalaryInput.value = payload.monthlySalary;
        hoursPerMonthInput.value = payload.hoursWorked;
        rateValueSpan.textContent = payload.hourlyRate.toFixed(2);
        hourlyRateDiv.classList.remove("hidden");
        displayModeInput.checked = payload.showAsTime;
        saveButton.disabled = payload.hourlyRate === '';

        showPricesAsTime(payload.showAsTime);
        updatePrices(payload.hourlyRate);
        toggleCurrencySymbol(monthlySalaryInput, currencySymbol);
      }
      break;
  }
})

document.addEventListener("DOMContentLoaded", function () {
  const salaryInput = document.getElementById("monthly-salary");
  const hoursInput = document.getElementById('hours-per-month');
  const hourlyRateDiv = document.getElementById('hourly-rate');
  const rateValueSpan = document.getElementById('rate-value');
  const showAsTimeInput = document.getElementById('display-mode');
  const saveButton = document.getElementById("save-button");

  sendMessageToServiceWorker("FETCH_DATA")

  showAsTimeInput.addEventListener('change', () => {
    showPricesAsTime(showAsTimeInput.checked);
  });

  saveButton.addEventListener('click', () => {
    const monthlySalary = parseFloat(salaryInput.value);
    const hoursPerMonth = parseFloat(hoursInput.value);
    const showAsTime = showAsTimeInput.checked;

    sendMessageToServiceWorker("SAVE_DATA", { monthlySalary, hoursPerMonth, showAsTime });
    const saveButtonText = saveButton.textContent;
    saveButton.textContent = 'Saved!';
    setTimeout(() => {
      saveButton.textContent = saveButtonText;
    }, 1000);
  });

  salaryInput.addEventListener('input', () => {
    updateHourlyRate(salaryInput, hoursInput, rateValueSpan, hourlyRateDiv, updatePrices);
    checkInputs(salaryInput, hoursInput, saveButton);
  });

  hoursInput.addEventListener('input', () => {
    updateHourlyRate(salaryInput, hoursInput, rateValueSpan, hourlyRateDiv, updatePrices);
    checkInputs(salaryInput, hoursInput, saveButton);
  });
});


export { toggleCurrencySymbol, checkInputs, updateHourlyRate };