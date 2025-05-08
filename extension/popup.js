document.addEventListener("DOMContentLoaded", function () {
  const salaryInput = document.getElementById("monthly-salary");
  const currencySymbol = document.getElementById("currency-symbol");

  if (salaryInput.value && salaryInput.value.trim() !== "") {
    currencySymbol.classList.add("visible");
  }

  salaryInput.addEventListener("input", function () {
    if (this.value && this.value.trim() !== "") {
      currencySymbol.classList.add("visible");
    } else {
      currencySymbol.classList.remove("visible");
    }
  });

  salaryInput.addEventListener("focus", function () {
    if (this.value && this.value.trim() !== "") {
      currencySymbol.classList.add("visible");
    }
  });

  chrome.storage.sync.get(
    ["hoursWorked", "monthlySalary", "showAsTime"],
    function (result) {
      if (result.hoursWorked)
        document.getElementById("hours-worked").value = result.hoursWorked;
      if (result.monthlySalary) {
        document.getElementById("monthly-salary").value = result.monthlySalary;
        if (result.monthlySalary.toString().trim() !== "") {
          document.getElementById("currency-symbol").classList.add("visible");
        }
      }
      if (result.showAsTime !== undefined)
        document.getElementById("show-as-time").checked = result.showAsTime;

      updateCalculation();
    },
  );

  document.getElementById("save-button").addEventListener("click", function () {
    const hoursWorked = document.getElementById("hours-worked").value;
    const monthlySalary = document.getElementById("monthly-salary").value;
    const showAsTime = document.getElementById("show-as-time").checked;

    chrome.storage.sync.set(
      {
        hoursWorked: hoursWorked,
        monthlySalary: monthlySalary,
        showAsTime: showAsTime,
      },
      function () {
        updateCalculation();

        const button = document.getElementById("save-button");
        const originalText = button.textContent;
        button.textContent = "Saved!";
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      },
    );
  });

  document
    .getElementById("show-as-time")
    .addEventListener("change", updateCalculation);

  document
    .getElementById("hours-worked")
    .addEventListener("input", updateCalculation);
  document
    .getElementById("monthly-salary")
    .addEventListener("input", updateCalculation);

  function updateCalculation() {
    const hoursWorked =
      parseFloat(document.getElementById("hours-worked").value) || 0;
    const monthlySalary =
      parseFloat(document.getElementById("monthly-salary").value) || 0;
    const showAsTime = document.getElementById("show-as-time").checked;

    const resultElement = document.getElementById("calculation-result");

    if (hoursWorked > 0 && monthlySalary > 0) {
      const hourlyRate = monthlySalary / (hoursWorked * 4); // Assuming 4 weeks per month

      if (showAsTime) {
        resultElement.textContent = `Your time is worth approximately $${hourlyRate.toFixed(2)} per hour`;
      } else {
        resultElement.textContent = `You earn approximately $${hourlyRate.toFixed(2)} per hour`;
      }
    } else {
      resultElement.textContent = "Enter your details to see calculations";
    }
  }
});
