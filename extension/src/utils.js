const AVG_HOURS_PER_DAY = 365 / 12 / 7;
const EPSILON = 0.01;

function parsePrice(price) {
  if (typeof price === 'string') {
    return parseFloat(price.replace(',', ''));
  }
  return price;
}

function convertTime(hours, hoursPerDay = 24, daysPerWeek = 7) {
  const daysPerMonth = daysPerWeek * AVG_HOURS_PER_DAY;
  const daysPerYear = daysPerMonth * 12;
  const units = [
    { label: 'year', value: hoursPerDay * daysPerYear, noDecimal: true },
    { label: 'month', value: hoursPerDay * daysPerMonth, noDecimal: true },
    { label: 'week', value: hoursPerDay * daysPerWeek, noDecimal: true },
    { label: 'day', value: hoursPerDay },
    { label: 'hour', value: 1 },
    { label: 'minute', value: 1 / 60 },
    { label: 'second', value: 1 / 3600 },
  ];

  for (const unit of units) {
    if (hours >= unit.value * (1 - EPSILON)) {
      const amount = hours / unit.value;
      const display = unit.noDecimal
        ? Math.round(amount)
        : amount % 1 === 0
          ? amount
          : Number(amount.toFixed(2));
      return `${display} ${unit.label}${display !== 1 ? 's' : ''}`;
    }
  }

  return 'less than a second';
}

export { convertTime, parsePrice };
