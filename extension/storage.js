
function saveSettings(hoursWorked, monthlySalary, showAsTime) {
    chrome.storage.sync.set({
        hoursWorked: hoursWorked,
        monthlySalary: monthlySalary,
        showAsTime: showAsTime,
    });
}

function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(
            ["hoursWorked", "monthlySalary", "showAsTime"],
            function (result) {
                resolve({
                    hoursWorked: result.hoursWorked || "",
                    monthlySalary: result.monthlySalary || "",
                    showAsTime: result.showAsTime !== undefined ? result.showAsTime : false,
                });
            },
        );
    });
}

export { saveSettings, loadSettings };