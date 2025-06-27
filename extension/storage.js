
async function saveSettings(monthlySalary, hoursPerDay, daysPerWeek, showAsTime) {
    chrome.storage.local.set({
        monthlySalary,
        hourlyRate: monthlySalary / (hoursPerDay * daysPerWeek * 4),
        hoursPerDay,
        daysPerWeek,
        showAsTime,
    });
}

async function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.local.get(
            ["hourlyRate", "monthlySalary", "hoursPerDay", "daysPerWeek", "showAsTime"],
            function (result) {
                resolve({
                    hourlyRate: result.hourlyRate,
                    monthlySalary: result.monthlySalary,
                    hoursPerDay: result.hoursPerDay,
                    daysPerWeek: result.daysPerWeek,
                    showAsTime: result.showAsTime,
                });
            },
        );
    });
}

export { saveSettings, loadSettings };