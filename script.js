
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const displayLabel = document.getElementById("displayLabel");
const keypad = document.querySelector(".keypad");

let currentInput = "0";
let storedValue = null;
let operator = null;
let waitingForOperand = false;
let justCalculated = false;
let errorState = false;

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    // Avoid floating-point results such as 0.30000000000000004
    const rounded = Number(number.toPrecision(12));

    return rounded.toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: 10
    });
}

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;

        case "-":
            return a - b;

        case "*":
            return a * b;

        case "/":
            if (b === 0) {
                return null;
            }
            return a / b;

        default:
            return b;
    }
}

function showError() {
    currentInput = "0";
    storedValue = null;
    operator = null;
    waitingForOperand = false;
    justCalculated = false;
    errorState = true;

    expressionDisplay.textContent = "Invalid calculation";
    resultDisplay.textContent = "Error";
    displayLabel.textContent = "CHECK YOUR INPUT";
}

function updateDisplay() {
    if (errorState) {
        return;
    }

    resultDisplay.textContent = currentInput;

    if (operator !== null && storedValue !== null) {
        const symbol = {
            "+": "+",
            "-": "−",
            "*": "×",
            "/": "÷"
        }[operator];

        expressionDisplay.textContent =
            `${formatNumber(storedValue)} ${symbol}` +
            (waitingForOperand ? "" : ` ${currentInput}`);

        // Show a live result when the second number is entered
        if (!waitingForOperand) {
            const preview = calculate(
                storedValue,
                Number(currentInput),
                operator
            );

            if (preview === null || !Number.isFinite(preview)) {
                resultDisplay.textContent =
                    Number(currentInput) === 0 && operator === "/"
                        ? "Cannot divide by 0"
                        : "Error";
            } else {
                resultDisplay.textContent = formatNumber(preview);
            }
        }
    } else {
        expressionDisplay.textContent =
            justCalculated ? "Calculation complete" : "0";

        resultDisplay.textContent = currentInput;
    }

    displayLabel.textContent =
        justCalculated ? "FINAL RESULT" : "READY TO CALCULATE";
}

function inputNumber(number) {
    if (errorState) {
        clearCalculator();
    }

    if (justCalculated && operator === null) {
        currentInput = number;
        justCalculated = false;
        updateDisplay();
        return;
    }

    if (waitingForOperand) {
        currentInput = number;
        waitingForOperand = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput.replace("-", "").length < 15) {
        currentInput += number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (errorState) {
        clearCalculator();
    }

    if (justCalculated && operator === null) {
        currentInput = "0.";
        justCalculated = false;
    } else if (waitingForOperand) {
        currentInput = "0.";
        waitingForOperand = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (errorState) {
        return;
    }

    const inputValue = Number(currentInput);

    if (operator !== null && !waitingForOperand) {
        const answer = calculate(
            storedValue,
            inputValue,
            operator
        );

        if (answer === null || !Number.isFinite(answer)) {
            showError();
            return;
        }

        currentInput = String(Number(answer.toPrecision(12)));
        storedValue = Number(currentInput);
    } else if (storedValue === null || justCalculated) {
        storedValue = inputValue;
    }

    operator = nextOperator;
    waitingForOperand = true;
    justCalculated = false;

    updateDisplay();
}

function calculateResult() {
    if (errorState || operator === null || storedValue === null) {
        return;
    }

    const firstValue = storedValue;
    const secondValue = waitingForOperand
        ? storedValue
        : Number(currentInput);

    const activeOperator = operator;
    const answer = calculate(
        firstValue,
        secondValue,
        activeOperator
    );

    if (answer === null || !Number.isFinite(answer)) {
        showError();
        return;
    }

    const symbol = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    }[activeOperator];

    expressionDisplay.textContent =
        `${formatNumber(firstValue)} ${symbol} ` +
        `${formatNumber(secondValue)} =`;

    currentInput = String(Number(answer.toPrecision(12)));
    resultDisplay.textContent = formatNumber(answer);
    displayLabel.textContent = "FINAL RESULT";

    storedValue = null;
    operator = null;
    waitingForOperand = false;
    justCalculated = true;
}

function clearCalculator() {
    currentInput = "0";
    storedValue = null;
    operator = null;
    waitingForOperand = false;
    justCalculated = false;
    errorState = false;

    expressionDisplay.textContent = "0";
    resultDisplay.textContent = "0";
    displayLabel.textContent = "READY TO CALCULATE";
}

function deleteLastDigit() {
    if (errorState || justCalculated) {
        clearCalculator();
        return;
    }

    if (waitingForOperand) {
        return;
    }

    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);

        if (currentInput === "-") {
            currentInput = "0";
        }
    } else {
        currentInput = "0";
    }

    updateDisplay();
}

function calculatePercentage() {
    if (errorState) {
        return;
    }

    const value = Number(currentInput);

    // With a pending operator, calculate the percentage
    // of the first number. Example: 200 + 10% = 220.
    if (operator !== null && storedValue !== null) {
        currentInput = String(
            Number((storedValue * value / 100).toPrecision(12))
        );
    } else {
        currentInput = String(
            Number((value / 100).toPrecision(12))
        );
    }

    waitingForOperand = false;
    justCalculated = false;

    updateDisplay();
}


// HANDLE BUTTON CLICKS
keypad.addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteLastDigit();
            break;

        case "decimal":
            inputDecimal();
            break;

        case "percent":
            calculatePercentage();
            break;

        case "calculate":
            calculateResult();
            break;
    }
});


// KEYBOARD SUPPORT
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
        return;
    }

    if (key === ".") {
        inputDecimal();
        return;
    }

    if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
        return;
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
        return;
    }

    if (key === "Backspace") {
        deleteLastDigit();
        return;
    }

    if (key === "Escape") {
        clearCalculator();
        return;
    }

    if (key === "%") {
        calculatePercentage();
    }
});


// INITIAL DISPLAY
updateDisplay();
