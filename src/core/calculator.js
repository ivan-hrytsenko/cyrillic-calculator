import { memoize } from './memoize.js';

const OPERATION_ADD = '+';
const OPERATION_SUBTRACT = '-';
const OPERATION_MULTIPLY = '*';
const OPERATION_DIVIDE = '/';

const calculate = (firstOperand, secondOperand, operation) => {
    let result;

    switch (operation) {
        case OPERATION_ADD:
            result = firstOperand + secondOperand;
            break;
        case OPERATION_SUBTRACT:
            result = firstOperand - secondOperand;
            break;
        case OPERATION_MULTIPLY:
            result = firstOperand * secondOperand;
            break;
        case OPERATION_DIVIDE:
            /*if (secondOperand === 0) {
                return NaN;
            }*/
            result = firstOperand / secondOperand;
            break;
        default:
            return NaN;
    }
    return result;
};

const memoizedCalculate = memoize(calculate)

export { memoizedCalculate };