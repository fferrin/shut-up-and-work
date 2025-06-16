function convertTime(hours) {
    const units = [
        { label: 'year', value: 24 * 365, noDecimal: true },
        { label: 'month', value: 24 * 30, noDecimal: true },
        { label: 'week', value: 24 * 7, noDecimal: true },
        { label: 'day', value: 24 },
        { label: 'hour', value: 1 },
        { label: 'minute', value: 1 / 60 },
        { label: 'second', value: 1 / 3600 },
    ];

    for (const unit of units) {
        if (hours >= unit.value) {
            const amount = hours / unit.value;
            const display = unit.noDecimal ? Math.round(amount) : (amount % 1 === 0 ? amount : Number(amount.toFixed(2)));
            return `${display} ${unit.label}${display !== 1 ? 's' : ''}`;
        }
    }

    return 'less than a second';
}

export { convertTime };