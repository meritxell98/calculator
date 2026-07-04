const display = document.getElementById('display');
const buttons = document.getElementById('buttons');

let displayValue = '0';
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

const add = (a, b) => a + b;

const subtract = (a, b) => a - b;

const multiply = (a, b) => a * b;

const divide = (a, b) => {
  if (b === 0) {
    return 'Error';
  }
  return a / b;
};

const operations = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
};

function formatDisplay(value) {
  if (value === 'Error') return value;

  const num = Number(value);

  const formatted = parseFloat(num.toFixed(3)).toString();

  if (formatted.length > 12 && !formatted.includes('e')) {
    return num.toExponential(8);
  }

  return formatted;
}

function operate(number1, number2, operator) {
  if (!operations[operator]) {
    return 'Error';
  }
  return operations[operator](number1, number2);
}

function updateDisplay() {
  display.value = formatDisplay(displayValue);
}

function handleError() {
  displayValue = 'Error';
  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
  updateDisplay();
}

function calculate(num1, num2, op) {
  const result = operate(num1, num2, op);

  if (result === 'Error') {
    handleError();
    return null;
  }

  if (!Number.isFinite(result)) {
    handleError();
    return null;
  }

  return result;
}

buttons.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const value = btn.dataset.value;
  const op = btn.dataset.operator;
  const action = btn.dataset.action;

  if (value !== undefined) {
    if (waitingForSecondValue) {
      displayValue = value === '.' ? '0.' : value;
      waitingForSecondValue = false;
    } else if (value === '.') {
      if (!displayValue.includes('.')) {
        displayValue += '.';
      }
    } else {
      displayValue = displayValue === '0' ? value : displayValue + value;
    }
    updateDisplay();
    return;
  }

  if (op !== undefined) {
    if (firstValue === null) {
      firstValue = parseFloat(displayValue);
    } else if (operator) {
      const result = calculate(firstValue, parseFloat(displayValue), operator);
      if (result === null) {
        return;
      }
      displayValue = String(result);
      firstValue = result;
      updateDisplay();
    }
    operator = op;
    waitingForSecondValue = true;
    return;
  }

  if (action === 'AC') {
    displayValue = '0';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    updateDisplay();
    return;
  }
  if (action === '=') {
    if (firstValue !== null && operator) {
      const result = calculate(firstValue, parseFloat(displayValue), operator);
      if (result === null) {
        return;
      }
      displayValue = String(result);
      firstValue = null;
      operator = null;
      waitingForSecondValue = false;
      updateDisplay();
      return;
    }
  }
});

window.addEventListener('load', () => {
  updateDisplay();
});
