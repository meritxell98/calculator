const display =document.getElementById('display');
const buttons = document.getElementById('buttons');

var displayValue = '0';
var firstValue = null;
var operator = null;
var waitingForSecondValue = false;

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

function operate (number1, number2, operator) {
    return operations[operator](number1, number2);
}

function updateDisplay() {
  display.value = displayValue;
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
    const result = operate(firstValue,parseFloat(displayValue), operator );
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
    const result = operate(firstValue, parseFloat(displayValue), operator);
    displayValue = String(result);
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    updateDisplay();
    return;
  }
}

});
