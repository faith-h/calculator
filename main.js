// Display clicked/pressed number
// Made screen value a string for easy updating
function handleNumber(number) {
  if (screen.value === "0") {
    screen.value = number;
  } else if (screen.value.length <= 10) {
    screen.value += number;
  }
};

// Update clicked/pressed operand
function handleOperand(operand) {
  // check if chaining operations i.e. 2 + 2 + 2, combine by calculating
  if (firstNum) {
    handleCalculate(firstNum, screen.value);
  }
  // update operand to use
  currentOperand = operand;
  // save current value to calculate
  firstNum = screen.value;
  // prep screen for next value
  screen.value = "";
};

// Add or subtract from memory
function handleMemory(isAdd) {
  const memoryValue = parseFloat(localStorage.getItem("memoryValue"));
  const currentValue = parseFloat(screen.value);
  let result = 0;

  if (isAdd) {
    result = (memoryValue + currentValue);
  } else {
    result = (memoryValue - currentValue);
  }

  localStorage.setItem("memoryValue", result.toString());
};

// Calculate result of two numbers and update the screen
function handleCalculate(firstValue, currentValue) {
  // error handling for odd inputs
  if (firstValue && !currentValue) {
    screen.value = firstNum;
    return;
  } else if (!firstValue && currentValue) {
    return;
  }

  /* clean expected string props to ensure math is correct
  used parseFloat instead of parseInt to handle both integers and floats */
  let result = 0;
  const num1 = parseFloat(firstValue);
  const num2 = parseFloat(currentValue);

  /* .toFixed(10) * 1 to remove trailing zeros when dealing with floating point numbers
  wanted to be able to calculate any number of decimal points without screen overflow */
  switch (currentOperand) {
    case '+':
      result = (num1 + num2).toFixed(10) * 1;
      break;
    case '-':
      result = (num1 - num2).toFixed(10) * 1;
      break;
    case 'x':
      result = (num1 * num2).toFixed(10) * 1;
      break;
    case '/':
      result = (num1 / num2).toFixed(10) * 1;
      break;
  }

  firstNum = "";
  screen.value = result.toString();
};

// Define global variables and get all buttons
// firstNum used to track previous input / first number to calculate
let firstNum = "";
let currentOperand = "";
const numbers = document.querySelectorAll(".num");
const operands = document.querySelectorAll(".operand");
const memoryOptions = document.querySelectorAll(".memory");
const screen = document.querySelector("#screen");
const clear = document.querySelector("#clear");
const negative = document.querySelector("#negative");
const decimal = document.querySelector("#decimal");
const calculate = document.querySelector("#calculate");

// Hook up functions for each on click/press
numbers.forEach(num => {
  num.addEventListener("click", function () {
    handleNumber(num.innerHTML);
  })
});

operands.forEach(operand => {
  operand.addEventListener("click", function () {
    handleOperand(operand.innerHTML);
  })
});

memoryOptions.forEach(option => {
  option.addEventListener("click", function () {
    switch (option.innerHTML) {
      case ("m+"):
        handleMemory(true);
        break;
      case ("m-"):
        handleMemory(false);
        break;
      case ("mr"):
        screen.value = localStorage.getItem("memoryValue");
        break;
      case ("mc"):
        localStorage.setItem("memoryValue", "0");
        break;
    }
  })
});

calculate.addEventListener("click", function () {
  handleCalculate(firstNum, screen.value);
});

/* Multiply by -1 to switch positive/negative
Exit if input is NaN for error handling */
negative.addEventListener("click", function () {
  let currentValue = parseFloat(screen.value);

  if (isNaN(currentValue)) {
    return;
  }

  const switchValue = currentValue *= -1;
  screen.value = switchValue.toString();
});

// if/else block to prevent inifinite decimals and format correctly
decimal.addEventListener("click", function () {
  if (screen.value.includes(".")) {
    return;
  } else if (screen.value === "") {
    screen.value = "0.";
  } else {
    screen.value += ".";
  }
});

clear.addEventListener("click", function () {
  firstNum = "";
  currentOperand = "";
  screen.value = "0";
});

// Keyboard controls below
/* isNumber regex to check if key pressed is a valid number
availableOperands array to check for valid operands */
document.addEventListener("keyup", function (event) {
  const key = event.key;
  const isNumber = /^[0-9]$/i.test(key);
  const availableOperands = ["+", "-", "/", "x"];

  if (isNumber) {
    handleNumber(key);
  } else if (availableOperands.includes(key)) {
    handleOperand(key);
  } else if (key === "Enter") {
    calculate.click();
  } else if (key === "Backspace") {
    clear.click();
  } else if (key === ".") {
    decimal.click();
  }
});

// END Calculator

/* Light/dark theme toggler
Restore saved theme if exists, then add event listener to toggle class */
const toggler = document.querySelector(".toggler");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.toggle("dark");
  toggler.innerHTML = "&#9789;";
};

toggler.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark") {
    localStorage.setItem("theme", "light");
    toggler.innerHTML = "&#9788;";
  } else {
    localStorage.setItem("theme", "dark");
    toggler.innerHTML = "&#9789;";
  }
});