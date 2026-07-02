const display =document.getElementById('display');
const buttons = document.getElementById('buttons');

const add = (a, b) => a + b;

const subtract = (a, b) => a - b;

const multiply = (a, b) => a * b;

function divide(a, b) {
  if (b === 0) {
    return 'Error';
  }
  return a / b;
}

