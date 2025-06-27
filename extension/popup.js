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

function checkInputs(salaryInput, hoursPerDayInput, daysPerWeekInput, saveButton) {
  const salary = salaryInput.value.trim();
  const hoursPerDay = hoursPerDayInput.value.trim();
  const daysPerWeek = daysPerWeekInput.value.trim();

  saveButton.disabled = salary === '' || hoursPerDay === '' || daysPerWeek === '';
}

function updateHourlyRate(salaryInput, hoursPerDayInput, daysPerWeekInput, rateValueSpan, hourlyRateDiv, updatePriceCallback) {
  const salary = parseFloat(salaryInput.value);
  const hoursPerDay = parseFloat(hoursPerDayInput.value);
  const daysPerWeek = parseFloat(daysPerWeekInput.value);

  if (!isNaN(salary) && !isNaN(hoursPerDay) && hoursPerDay > 0 && !isNaN(daysPerWeek) && daysPerWeek > 0) {
    const hourlyRate = salary / (hoursPerDay * daysPerWeek * 4);
    updatePriceCallback(hourlyRate);
    rateValueSpan.textContent = hourlyRate.toFixed(2);
    hourlyRateDiv.classList.remove('hidden');
  } else {
    hourlyRateDiv.classList.add('hidden');
  }
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  const monthlySalaryInput = document.getElementById("monthly-salary");
  // const hoursPerMonthInput = document.getElementById("hours-per-month");
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
        // hoursPerMonthInput.value = payload.hoursWorked;
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
  const hoursPerDayInput = document.getElementById('hours-per-day');
  const daysPerWeekInput = document.getElementById('days-per-week');
  const hourlyRateDiv = document.getElementById('hourly-rate');
  const rateValueSpan = document.getElementById('rate-value');
  const showAsTimeInput = document.getElementById('display-mode');
  const saveButton = document.getElementById("save-button");

  // sendMessageToServiceWorker("FETCH_DATA")

  showAsTimeInput.addEventListener('change', () => {
    showPricesAsTime(showAsTimeInput.checked);
  });

  saveButton.addEventListener('click', () => {
    const monthlySalary = parseFloat(salaryInput.value);
    const hoursPerMonth = parseFloat(hoursPerDayInput.value);
    const showAsTime = showAsTimeInput.checked;

    sendMessageToServiceWorker("SAVE_DATA", { monthlySalary, hoursPerMonth, showAsTime });
    const saveButtonText = saveButton.textContent;
    saveButton.textContent = 'Saved!';
    setTimeout(() => {
      saveButton.textContent = saveButtonText;
    }, 1000);
  });

  salaryInput.addEventListener('input', () => {
    updateHourlyRate(salaryInput, hoursPerDayInput, daysPerWeekInput,rateValueSpan, hourlyRateDiv, updatePrices);
    checkInputs(salaryInput, hoursPerDayInput, daysPerWeekInput, saveButton);
  });

  hoursPerDayInput.addEventListener('input', () => {
    const min = Number(hoursPerDayInput.min);
    const max = Number(hoursPerDayInput.max);
    hoursPerDayInput.value = Math.min(Math.max(hoursPerDayInput.value, min), max);
    updateHourlyRate(salaryInput, hoursPerDayInput, daysPerWeekInput,rateValueSpan, hourlyRateDiv, updatePrices);
    checkInputs(salaryInput, hoursPerDayInput, daysPerWeekInput, saveButton);
  });

  daysPerWeekInput.addEventListener('input', () => {
    const min = Number(daysPerWeekInput.min);
    const max = Number(daysPerWeekInput.max);
    daysPerWeekInput.value = Math.min(Math.max(daysPerWeekInput.value, min), max);
    updateHourlyRate(salaryInput, hoursPerDayInput, daysPerWeekInput,rateValueSpan, hourlyRateDiv, updatePrices);
    checkInputs(salaryInput, hoursPerDayInput, daysPerWeekInput, saveButton);
  });
});


export { toggleCurrencySymbol, checkInputs, updateHourlyRate };