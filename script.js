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

