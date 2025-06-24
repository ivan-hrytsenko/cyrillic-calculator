import { convertCyrillicToArabic, convertArabicToCyrillic } from '../core/converter.js';
import { memoizedCalculate } from '../core/calculator.js';

const calculatorDisplay = document.getElementById('calculator-display');
const buttonsContainer = document.querySelector('.buttons');

let currentInput = '';
let firstOperand = null;
let operator = null;
let waitingForNextOperand = false;
let resultDisplayed = false;

const updateDisplay = (value) => {
    calculatorDisplay.textContent = value || 'Пусто';
};

const resetCalculator = () => {
    currentInput = '';
    firstOperand = null;
    operator = null;
    waitingForNextOperand = false;
    resultDisplayed = false;
    updateDisplay();
};

const handleError = () => {
    updateDisplay('Помилка');
    setTimeout(resetCalculator, 2000);
};

const handleDigitInput = (digitCyrillic) => {
    switch (true) {
        case waitingForNextOperand:
            currentInput = digitCyrillic;
            waitingForNextOperand = false;
            break;
        case resultDisplayed:
            currentInput = digitCyrillic;
            resultDisplayed = false;
            break;
        default:
            currentInput += digitCyrillic;
    }

    updateDisplay(currentInput);
};

const handleOperation = (nextOperator) => {
    const inputValue = convertCyrillicToArabic(currentInput);

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator !== null && !waitingForNextOperand) {
        const result = memoizedCalculate(firstOperand, inputValue, operator);
        if (Number.isNaN(result)) {
            handleError();
            return;
        }
        const roundedResult = Math.round(result);
        updateDisplay(convertArabicToCyrillic(roundedResult));
        firstOperand = roundedResult;
    }

    currentInput = '';
    operator = nextOperator;
    waitingForNextOperand = true;
};

const handleEquals = () => {
    if (firstOperand === null || operator === null || waitingForNextOperand) {
        return;
    }

    const inputValue = convertCyrillicToArabic(currentInput);
    const result = memoizedCalculate(firstOperand, inputValue, operator);
    if (Number.isNaN(result)) {
        handleError();
        return;
    }
    const roundedResult = Math.round(result);
    if (roundedResult === 0) {
        updateDisplay();
    } else {
        updateDisplay(convertArabicToCyrillic(roundedResult));
    }

    firstOperand = roundedResult;
    operator = null;
    waitingForNextOperand = false;
    resultDisplayed = true;
};

const handleButtonClick = (event) => {
    const target = event.target;
    if (!target.classList.contains('button')) {
        return;
    }
    const { type, value } = target.dataset

    switch (type) {
        case 'clear':
            resetCalculator();
            break;
        case 'cyrillic-digit':
            handleDigitInput(value);
            break;
        case 'operation':
            handleOperation(value);
            break;
        case 'equals':
            handleEquals();
            break;
    }
};

buttonsContainer.addEventListener('click', handleButtonClick);
resetCalculator();