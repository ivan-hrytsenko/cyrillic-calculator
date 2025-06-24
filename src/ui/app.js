import { convertCyrillicToArabic, convertArabicToCyrillic } from '../core/converter.js';
import { calculate } from '../core/calculator.js';
import { EventEmitter } from '../core/eventEmitter.js';

const calculatorDisplay = document.getElementById('calculator-display');
const buttonsContainer = document.querySelector('.buttons');

const calculatorEvents = new EventEmitter();

let currentInput = '';
let firstOperand = null;
let operator = null;
let waitingForNextOperand = false;
let resultDisplayed = false;

const updateDisplay = (value) => {
    const displayValue = value || 'Empty';
    calculatorDisplay.textContent = displayValue;
    calculatorEvents.emit('displayUpdated', displayValue);
};

const resetCalculator = () => {
    currentInput = '';
    firstOperand = null;
    operator = null;
    waitingForNextOperand = false;
    resultDisplayed = false;
    updateDisplay('');
    calculatorEvents.emit('calculatorReset');
};

const handleError = (errorMessage = 'Error') => {
    updateDisplay(errorMessage);
    calculatorEvents.emit('calculatorError', errorMessage);
    setTimeout(resetCalculator, 2000);
};

const handleDigitInput = (digitCyrillic) => {
    const oldInput = currentInput;
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
    calculatorEvents.emit('digitInput', { digit: digitCyrillic, oldInput: oldInput, newInput: currentInput });
};

const handleOperation = (nextOperator) => {
    const inputValue = convertCyrillicToArabic(currentInput);

    if (isNaN(inputValue)) {
        handleError('Invalid number');
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator !== null && !waitingForNextOperand) {
        const calculatedResult = calculate(firstOperand, inputValue, operator);
        if (Number.isNaN(calculatedResult)) {
            handleError('Calculation error');
            return;
        }
        const roundedResult = Math.round(calculatedResult);
        updateDisplay(convertArabicToCyrillic(roundedResult));
        firstOperand = roundedResult;
        calculatorEvents.emit('operationPerformed', {
            operand1: firstOperand,
            operand2: inputValue,
            operator: operator,
            result: roundedResult
        });
    }

    currentInput = '';
    operator = nextOperator;
    waitingForNextOperand = true;
    calculatorEvents.emit('operatorSelected', nextOperator);
};

const handleEquals = () => {
    if (firstOperand === null || operator === null || waitingForNextOperand) {
        return;
    }

    const inputValue = convertCyrillicToArabic(currentInput);
    if (isNaN(inputValue)) {
        handleError('Invalid number');
        return;
    }

    const calculatedResult = calculate(firstOperand, inputValue, operator);
    if (Number.isNaN(calculatedResult)) {
        handleError('Calculation error');
        return;
    }
    const roundedResult = Math.round(calculatedResult);
    if (roundedResult === 0) {
        updateDisplay('');
    } else {
        updateDisplay(convertArabicToCyrillic(roundedResult));
    }

    firstOperand = roundedResult;
    operator = null;
    waitingForNextOperand = false;
    resultDisplayed = true;
    calculatorEvents.emit('equalsPressed', roundedResult);
};

const handleButtonClick = (event) => {
    const target = event.target;
    if (!target.classList.contains('button')) {
        return;
    }
    const { type, value } = target.dataset

    calculatorEvents.emit('buttonClicked', { type, value });

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

calculatorEvents.on('displayUpdated', (displayValue) => {
    console.log(`[EVENT] Display updated: "${displayValue}"`);
});

calculatorEvents.on('calculatorReset', () => {
    console.log('[EVENT] Calculator reset.');
});

calculatorEvents.on('digitInput', ({ digit, oldInput, newInput }) => {
    console.log(`[EVENT] Digit entered: "${digit}". Input changed: "${oldInput}" -> "${newInput}".`);
});

calculatorEvents.on('operationPerformed', ({ operand1, operand2, operator, result }) => {
    console.log(`[EVENT] Operation performed: ${operand1} ${operator} ${operand2} = ${result}`);
});

calculatorEvents.on('calculatorError', (msg) => {
    console.error(`[EVENT] CALCULATOR ERROR: ${msg}`);
});

calculatorEvents.on('buttonClicked', ({ type, value }) => {
    console.log(`[EVENT] Button clicked: Type="${type}", Value="${value}"`);
});

const temporaryListener = (result) => {
    console.log(`[EVENT - Temporary] "=" pressed, result: ${result}`);
};
const unsubscribeTemp = calculatorEvents.on('equalsPressed', temporaryListener);

setTimeout(() => {
    unsubscribeTemp();
    console.log('[EVENT] Temporary "equalsPressed" listener unsubscribed.');
}, 5000);