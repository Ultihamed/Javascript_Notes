// <reference path="vendor.js"/>

const DEFAULT_RESULT = 0;
let currentResult = DEFAULT_RESULT;
let calculationDescription = "(0 + 10) * 3 / 2 - 1";
let logEntries = [];

// Gets input from input field
function getUserNumberInput() {
    return parseInt(userInput.value);
}

// Generates and writes calculation log
function createAndWriteOutput(operator, resultBeforeCalc, calcNumber) {
    const calcDescription = `${resultBeforeCalc} ${operator} ${calcNumber}`;
    outputResult(currentResult, calcDescription);
}

function writeToLog(operationIdentifier, prevResult, operationNumber, newResult) {
    const logEntry = {
        operation: operationIdentifier,
        prevResult: prevResult,
        number: operationNumber,
        result: newResult
    }
    logEntries.push(logEntry);
    console.log(logEntries);
}

function calculateResult(calculationType) {
    const enteredNumber = getUserNumberInput();
    if (
        calculationType !== "ADD" &&
        calculationType !== "SUBTRACT" &&
        calculationType !== "MULTIPLY" &&
        calculationType !== "DIVIDE" ||
        !enteredNumber
    ) {
        return;
    }

    if (
        calculationType === "ADD" ||
        calculationType === "SUBTRACT" ||
        calculationType === "MULTIPLY" ||
        calculationType === "DIVIDE"
    ) {
        const initialResult = currentResult;
        let mathOperator;
        if (calculationType === "ADD") {
            currentResult += enteredNumber;
            mathOperator = "+";
        }
        else if (calculationType === "SUBTRACT") {
            currentResult -= enteredNumber;
            mathOperator = "-";
        }
        else if (calculationType === "MULTIPLY") {
            currentResult *= enteredNumber;
            mathOperator = "*";
        }
        else {
            currentResult /= enteredNumber;
            mathOperator = "/";
        }
        createAndWriteOutput(mathOperator, initialResult, enteredNumber);
        writeToLog(calculationType, initialResult, enteredNumber, currentResult);
    }
}

function add() {
    calculateResult("ADD");
}

function subtract() {
    calculateResult("SUBTRACT");
}

function multiply() {
    calculateResult("MULTIPLY");
}

function divide() {
    calculateResult("DIVIDE");
}

addBtn.addEventListener("click", add);
subtractBtn.addEventListener("click", subtract);
multiplyBtn.addEventListener("click", multiply);
divideBtn.addEventListener("click", divide);
