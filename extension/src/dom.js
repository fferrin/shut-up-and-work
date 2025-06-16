function addHiddenTimeElement(priceElement) {
  const aPrice = priceElement.querySelector('span[aria-hidden="true"]')

  if (aPrice) {
    const whole = aPrice.querySelector('.a-price-whole')?.textContent.replace('.', '') || '';
    const fraction = aPrice.querySelector('.a-price-fraction')?.textContent || '';
    const price = `${whole}.${fraction}`;
    const original = priceElement.querySelector('.a-offscreen')?.textContent.replace('$', '') || '';
    const finalPrice = original.trim() || price.trim();

    const hiddenElement = document.createElement('span');
    hiddenElement.setAttribute('aria-hidden', true);
    hiddenElement.setAttribute('data-shut-up-and-work', true);
    hiddenElement.style.display = 'none';

    const label = document.createElement('span');
    label.textContent = 'Work for ';
    label.style.fontSize = '12px';
    label.style.color = '#16a34a';

    const timeValue = document.createElement('span');
    timeValue.setAttribute("data-price-as-time", "");
    timeValue.setAttribute("data-original-price", price);
    timeValue.setAttribute("data-original-offscreen-price", original);
    timeValue.setAttribute("data-original-final-price", finalPrice);
    timeValue.style.fontSize = '24px';
    timeValue.style.fontWeight = 'bold';
    timeValue.style.color = '#16a34a';

    hiddenElement.appendChild(label);
    hiddenElement.appendChild(timeValue);

    priceElement.appendChild(hiddenElement);
  }
}

export { addHiddenTimeElement };