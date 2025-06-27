
async function saveSettings(hoursWorked, monthlySalary, showAsTime, hoursPerDay, daysPerWeek) {
    chrome.storage.local.set({
        hoursWorked,
        monthlySalary,
        hourlyRate: monthlySalary / hoursWorked,
        showAsTime,
        hoursPerDay,
        daysPerWeek,
    });
}

async function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.local.get(
            ["hoursWorked", "monthlySalary", "hourlyRate", "hoursPerDay", "daysPerWeek", "showAsTime"],
            function (result) {
                resolve({
                    hoursWorked: result.hoursWorked,
                    monthlySalary: result.monthlySalary,
                    hourlyRate: result.hourlyRate,
                    hoursPerDay: result.hoursPerDay,
                    daysPerWeek: result.daysPerWeek,
                    showAsTime: result.showAsTime,
                });
            },
        );
    });
}

export { saveSettings, loadSettings };