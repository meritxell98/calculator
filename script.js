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

buttons.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;

  const value = target.dataset.value;
  const op = target.dataset.operator;
  const action = target.dataset.action;

