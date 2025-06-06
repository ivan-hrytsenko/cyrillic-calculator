import { convertCyrillicToArabic, convertArabicToCyrillic } from '../core/converter.js';
import { calculate } from '../core/calculator.js';

const calculatorDisplay = document.getElementById('calculator-display');
const buttonsContainer = document.querySelector('.buttons');

let currentInput = '';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let resultDisplayed = false;

const updateDisplay = (value) => {
    calculatorDisplay.textContent = value || 'Пусто';
};

const resetCalculator = () => {
    currentInput = '';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    resultDisplayed = false;
    updateDisplay('Пусто');
};

const handleDigitInput = (digitCyrillic) => {
    if (resultDisplayed) {
        currentInput = '';
        resultDisplayed = false;
    }
    
    if (currentInput === 'Пусто') {
        currentInput = '';
    }

    if (waitingForSecondOperand) {
        currentInput = digitCyrillic;
        waitingForSecondOperand = false;
    } else {
        currentInput += digitCyrillic;
    }
    updateDisplay(currentInput);
};

const handleOperation = (nextOperator) => {
    const inputValue = convertCyrillicToArabic(currentInput);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        updateDisplay('Пусто');
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        if (Number.isNaN(result)) {
            updateDisplay('Помилка');
            resetCalculator();
            return;
        }
        firstOperand = result;
        resultDisplayed = true;
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
    updateDisplay('Пусто');
};

const handleEquals = () => {
    const inputValue = convertCyrillicToArabic(currentInput);

    if (firstOperand === null || operator === null || waitingForSecondOperand) {
        return;
    }

    const result = calculate(firstOperand, inputValue, operator);
    if (Number.isNaN(result)) {
        updateDisplay('Помилка');
    } else {
        if (result === 0) {
            updateDisplay('Пусто');
        } else {
            updateDisplay(convertArabicToCyrillic(result));
        }
    }
    
    firstOperand = result;
    operator = null;
    waitingForSecondOperand = false;
    resultDisplayed = true;
};

const handleButtonClick = (event) => {
    const target = event.target;
    if (!target.classList.contains('button')) {
        return;
    }

    const type = target.dataset.type;
    const value = target.dataset.value;

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