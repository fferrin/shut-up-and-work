
function saveSettings(hoursWorked, monthlySalary, showAsTime) {
    chrome.storage.local.set({
        hoursWorked,
        monthlySalary,
        hourlyRate: monthlySalary / hoursWorked,
        showAsTime,
    });
}

function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.local.get(
            ["hoursWorked", "monthlySalary", "hourlyRate", "showAsTime"],
            function (result) {
                resolve({
                    hoursWorked: result.hoursWorked,
                    monthlySalary: result.monthlySalary,
                    hourlyRate: result.hourlyRate,
    });
            },
        );
    });
}

export { saveSettings, loadSettings };