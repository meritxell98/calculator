const display = document.getElementById('display');
const buttons = document.getElementById('buttons');

let displayValue = '0';
let firstValue = null;
let operator = null;
let lastValue = null;
let lastOperator = null;
let waitingForSecondValue = false;
let justCalculated = false;

const operations = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => (b === 0 ? 'Error' : a / b),
};

function formatDisplay(value) {
  if (value === 'Error') return value;

  const num = Number(value);
  const formatted = parseFloat(num.toFixed(10)).toString();

  return formatted.length > 12 && !formatted.includes('e')
    ? num.toExponential(8)
    : formatted;
}

function updateDisplay() {
  display.value = formatDisplay(displayValue);
}

function parseDisplayValue() {
  const value = Number(displayValue);
  return Number.isFinite(value) ? value : null;
}

function resetCalculator() {
  displayValue = '0';
  firstValue = null;
  operator = null;
  lastValue = null;
  lastOperator = null;
  waitingForSecondValue = false;
  justCalculated = false;
  updateDisplay();
}

function handleError() {
  displayValue = 'Error';
  firstValue = null;
  operator = null;
  lastValue = null;
  lastOperator = null;
  waitingForSecondValue = false;
  justCalculated = false;
  updateDisplay();
}

function operate(number1, number2, op) {
  const calc = operations[op];
  if (!calc) return 'Error';
  return calc(number1, number2);
}

function calculate(num1, num2, op) {
  const result = operate(num1, num2, op);
  if (result === 'Error' || !Number.isFinite(result)) {
    handleError();
    return null;
  }
  return result;
}

function enterDigit(value) {
  if (displayValue === 'Error') {
    displayValue = '0';
  }

  if (waitingForSecondValue || justCalculated) {
    displayValue = value === '.' ? '0.' : value;
    waitingForSecondValue = false;
    justCalculated = false;
    return;
  }

  if (value === '.') {
    if (!displayValue.includes('.')) {
      displayValue += '.';
    }
    return;
  }

  displayValue = displayValue === '0' ? value : displayValue + value;
}

function setOperator(nextOperator) {
  const inputValue = parseDisplayValue();
  if (inputValue === null) {
    handleError();
    return;
  }

  if (operator && waitingForSecondValue) {
    operator = nextOperator;
    return;
  }

  if (firstValue === null) {
    firstValue = inputValue;
  } else if (operator) {
    const result = calculate(firstValue, inputValue, operator);
    if (result === null) return;
    displayValue = String(result);
    firstValue = result;
  }

  operator = nextOperator;
  waitingForSecondValue = true;
  justCalculated = false;
}

function applyEquals() {
  const currentValue = parseDisplayValue();
  if (currentValue === null) {
    handleError();
    return;
  }

  if (firstValue !== null && operator) {
    const result = calculate(firstValue, currentValue, operator);
    if (result === null) return;
    displayValue = String(result);
    lastValue = currentValue;
    lastOperator = operator;
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    justCalculated = true;
    return;
  }

  if (lastValue !== null && lastOperator) {
    const result = calculate(currentValue, lastValue, lastOperator);
    if (result === null) return;
    displayValue = String(result);
    justCalculated = true;
  }
}

function handleKeyboardInput(event) {
  const key = event.key || '';
  const code = event.code || '';
  const keyMap = {
    NumpadEnter: 'Enter',
    NumpadAdd: '+',
    NumpadSubtract: '-',
    NumpadMultiply: '*',
    NumpadDivide: '/',
    NumpadDecimal: '.',
  };

  let normalizedKey = key;

  if (keyMap[code]) {
    normalizedKey = keyMap[code];
  } else if (code.startsWith('Digit')) {
    normalizedKey = code.replace('Digit', '');
  } else if (code.startsWith('Numpad')) {
    normalizedKey = code.replace('Numpad', '');
  }

  switch (normalizedKey) {
    case 'Enter':
      event.preventDefault();
      applyEquals();
      updateDisplay();
      return;
    case 'Escape':
      event.preventDefault();
      resetCalculator();
      return;
    default:
      if (/^[0-9.]$/.test(normalizedKey)) {
        event.preventDefault();
        enterDigit(normalizedKey);
        updateDisplay();
        return;
      }

      if (['+', '-', '*', '/'].includes(normalizedKey)) {
        event.preventDefault();
        setOperator(normalizedKey);
        updateDisplay();
      }
  }
}

buttons.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const value = btn.dataset.value;
  const op = btn.dataset.operator;
  const action = btn.dataset.action;

  if (value !== undefined) {
    enterDigit(value);
    updateDisplay();
    return;
  }

  if (op !== undefined) {
    setOperator(op);
    updateDisplay();
    return;
  }

  if (action === 'AC') {
    resetCalculator();
    return;
  }

  if (action === '=') {
    applyEquals();
    updateDisplay();
  }
});

window.addEventListener('keydown', handleKeyboardInput);
window.addEventListener('load', updateDisplay);
