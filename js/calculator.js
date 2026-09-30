(function () {
    "use strict";

    /* ---------- 标准计算模式 ---------- */
    var expressionInput = document.getElementById("expression");
    var resultElement = document.getElementById("result");
    var previousCommand = document.getElementById("previous-command");
    var keys = document.getElementById("keys");

    /* ---------- 科学计算模式 ---------- */
    var sciExpressionInput = document.getElementById("sci-expression");
    var sciResultElement = document.getElementById("sci-result");
    var sciPreviousCommand = document.getElementById("sci-previous-command");
    var sciKeys = document.getElementById("sci-keys");

    /* ---------- 进制转换模式 ---------- */
    var baseValueInput = document.getElementById("base-value");
    var fromBaseSelect = document.getElementById("from-base");
    var toBaseSelect = document.getElementById("to-base");
    var baseConvertButton = document.getElementById("base-convert");
    var baseResult = document.getElementById("base-result");

    /* ---------- 历史记录 ---------- */
    var historyList = document.getElementById("history-list");
    var refreshHistoryButton = document.getElementById("refresh-history");
    var clearHistoryButton = document.getElementById("clear-history");

    /* ---------- 模式切换 ---------- */
    var modeTabs = document.querySelectorAll(".mode-tab");
    var standardPanel = document.getElementById("standard-panel");
    var basePanel = document.getElementById("base-panel");
    var scientificPanel = document.getElementById("scientific-panel");
    var activeMode = "standard";

    var standardJustCalculated = false;
    var sciJustCalculated = false;

    function setResultOn(element, text, isError) {
        element.textContent = text;
        element.classList.toggle("error", Boolean(isError));
    }

    function setResult(text, isError) {
        setResultOn(resultElement, text, isError);
    }

    function setSciResult(text, isError) {
        setResultOn(sciResultElement, text, isError);
    }

    function setBaseResult(text, isError) {
        setResultOn(baseResult, text, isError);
    }

    var ALLOWED_IDENTIFIER_LETTERS = "abcegilnopqrst";

    function isOperatorChar(char) {
        return "+-×÷*/^".includes(char);
    }

    function isUnarySignAllowed(previous, value) {
        if (value !== "-" && value !== "+") {
            return false;
        }
        if (previous === "" || previous === "(") {
            return true;
        }
        return "×÷*/^".includes(previous);
    }

    function sanitizeInput(input) {
        var value = input.value;

        // 去掉不支持的字符，只保留数字、运算符、括号、π 和函数名需要的字母
        value = value.replace(/[^0-9.+\-*/^()×÷πa-zA-Z]/g, "");
        value = value.split("").filter(function (char) {
            if (/[0-9.+\-*/^()×÷π]/.test(char)) {
                return true;
            }
            return ALLOWED_IDENTIFIER_LETTERS.includes(char.toLowerCase());
        }).join("");

        if (value.length > 80) {
            value = value.slice(0, 80);
        }

        input.value = value;
        updateInputFontSize(input);
    }

    function updateInputFontSize(input) {
        var length = input.value.length;
        var size = "";

        if (length > 20) {
            size = "18px";
        } else if (length > 15) {
            size = "22px";
        } else if (length > 12) {
            size = "28px";
        } else if (length > 9) {
            size = "34px";
        }

        input.style.fontSize = size;
    }

    function appendInputValue(input, value) {
        var current = input.value;

        // 连续按运算符时，替换掉最后一个运算符
        if (value.length === 1 && isOperatorChar(value) && current.length > 0) {
            var last = current.slice(-1);

            if (isOperatorChar(last) && !isUnarySignAllowed(last, value)) {
                input.value = current.slice(0, -1) + value;
                updateInputFontSize(input);
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
                return;
            }
        }

        if (current === "0" && /[0-9.]/.test(value)) {
            current = "";
        }

        input.value = current + value;
        updateInputFontSize(input);
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }

    function backspaceInput(input) {
        input.value = input.value.slice(0, -1);
        updateInputFontSize(input);
        input.focus();
    }

    /* ---------- 标准计算 ---------- */
    function appendValue(value) {
        if (standardJustCalculated) {
            if (/[0-9.]/.test(value)) {
                expressionInput.value = "";
            }
            standardJustCalculated = false;
        }
        appendInputValue(expressionInput, value);
    }

    function backspace() {
        standardJustCalculated = false;
        backspaceInput(expressionInput);
    }

    function clearAll() {
        expressionInput.value = "";
        previousCommand.textContent = "";
        standardJustCalculated = false;
        updateInputFontSize(expressionInput);
        setResult("0", false);
        expressionInput.focus();
    }

    function calculate() {
        performCalculate(
            expressionInput,
            setResult,
            previousCommand,
            function (value) {
                standardJustCalculated = value;
            }
        );
    }

    /* ---------- 科学计算 ---------- */
    function appendSciValue(value) {
        if (sciJustCalculated) {
            if (/[0-9.]/.test(value)) {
                sciExpressionInput.value = "";
            }
            sciJustCalculated = false;
        }
        appendInputValue(sciExpressionInput, value);
    }

    function sciBackspace() {
        sciJustCalculated = false;
        backspaceInput(sciExpressionInput);
    }

    function sciClearAll() {
        sciExpressionInput.value = "";
        sciPreviousCommand.textContent = "";
        sciJustCalculated = false;
        updateInputFontSize(sciExpressionInput);
        setSciResult("0", false);
        sciExpressionInput.focus();
    }

    function calculateSci() {
        performCalculate(
            sciExpressionInput,
            setSciResult,
            sciPreviousCommand,
            function (value) {
                sciJustCalculated = value;
            }
        );
    }

    /* ---------- 通用计算流程 ---------- */
    function performCalculate(input, resultSetter, previousElement, setJustCalculated) {
        var expression = input.value.trim();

        if (!expression) {
            resultSetter("请输入表达式", true);
            return;
        }

        resultSetter("计算中...", false);

        window.CalculatorApi.calculate(expression)
            .then(function (data) {
                if (data.success) {
                    previousElement.textContent = expression + " =";
                    input.value = String(data.result);
                    updateInputFontSize(input);
                    resultSetter("", false);
                    setJustCalculated(true);
                    input.focus();
                    loadHistory();
                } else {
                    resultSetter(data.message || "计算失败", true);
                }
            })
            .catch(function (error) {
                resultSetter(error.message, true);
            });
    }

    /* ---------- 模式切换 ---------- */
    function switchMode(mode) {
        activeMode = mode;

        modeTabs.forEach(function (tab) {
            tab.classList.toggle("active", tab.dataset.mode === mode);
        });

        standardPanel.classList.toggle("hidden", mode !== "standard");
        basePanel.classList.toggle("hidden", mode !== "base");
        scientificPanel.classList.toggle("hidden", mode !== "scientific");

        if (mode === "base") {
            baseValueInput.focus();
        } else if (mode === "scientific") {
            sciExpressionInput.focus();
        } else {
            expressionInput.focus();
        }
    }

    /* ---------- 进制转换 ---------- */
    function convertBaseNumber() {
        var value = baseValueInput.value.trim();

        if (!value) {
            setBaseResult("请输入数字", true);
            return;
        }

        setBaseResult("转换中...", false);

        window.CalculatorApi.convertBase(value, fromBaseSelect.value, toBaseSelect.value)
            .then(function (data) {
                if (data.success) {
                    setBaseResult(data.result, false);
                } else {
                    setBaseResult(data.message || "转换失败", true);
                }
            })
            .catch(function (error) {
                setBaseResult(error.message, true);
            });
    }

    /* ---------- 历史记录 ---------- */
    function createHistoryItem(item) {
        var li = document.createElement("li");
        li.className = "history-item";
        li.dataset.result = item.result;
        li.title = "点击后，如果计算栏为空或末尾是运算符，就把结果放进去";

        var expressionDiv = document.createElement("div");
        expressionDiv.className = "history-expression";
        expressionDiv.textContent = item.expression + " = " + item.result;

        var metaDiv = document.createElement("div");
        metaDiv.className = "history-meta";
        metaDiv.textContent = item.createdAt;

        var deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "history-delete";
        deleteButton.dataset.id = item.id;
        deleteButton.textContent = "删除";

        li.appendChild(expressionDiv);
        li.appendChild(metaDiv);
        li.appendChild(deleteButton);
        return li;
    }

    function renderHistory(items) {
        historyList.innerHTML = "";

        if (!items || items.length === 0) {
            var emptyLi = document.createElement("li");
            emptyLi.className = "history-empty";
            emptyLi.textContent = "暂无历史记录";
            historyList.appendChild(emptyLi);
            return;
        }

        items.forEach(function (item) {
            historyList.appendChild(createHistoryItem(item));
        });
    }

    function loadHistory() {
        window.CalculatorApi.getHistory()
            .then(function (data) {
                if (data.success) {
                    renderHistory(data.data);
                } else {
                    renderHistory([]);
                }
            })
            .catch(function () {
                renderHistory([]);
            });
    }

    function getHistoryTargetInput() {
        if (activeMode === "scientific") {
            return sciExpressionInput;
        }
        if (activeMode === "standard") {
            return expressionInput;
        }
        return null;
    }

    function useHistoryResult(item) {
        var input = getHistoryTargetInput();
        if (!input) {
            return;
        }

        var result = item.dataset.result;
        var current = input.value;

        if (current === "") {
            input.value = result;
        } else if (/[+\-×÷*/^]$/.test(current)) {
            input.value = current + result;
        } else {
            return;
        }

        if (activeMode === "scientific") {
            sciJustCalculated = false;
        } else {
            standardJustCalculated = false;
        }

        updateInputFontSize(input);
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }

    /* ---------- 事件绑定：标准计算 ---------- */
    keys.addEventListener("click", function (event) {
        var button = event.target.closest("button");
        if (!button) {
            return;
        }

        var action = button.dataset.action;
        var value = button.dataset.value;

        if (action === "clear") {
            clearAll();
        } else if (action === "backspace") {
            backspace();
        } else if (action === "calculate") {
            calculate();
        } else if (value) {
            appendValue(value);
        }
    });

    expressionInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            calculate();
        }

        if (event.key === "Escape") {
            event.preventDefault();
            clearAll();
        }
    });

    expressionInput.addEventListener("input", function () {
        sanitizeInput(expressionInput);
    });

    /* ---------- 事件绑定：科学计算 ---------- */
    sciKeys.addEventListener("click", function (event) {
        var button = event.target.closest("button");
        if (!button) {
            return;
        }

        var action = button.dataset.sciAction;
        var value = button.dataset.sciValue;

        if (action === "sci-clear") {
            sciClearAll();
        } else if (action === "sci-backspace") {
            sciBackspace();
        } else if (action === "sci-calculate") {
            calculateSci();
        } else if (value) {
            appendSciValue(value);
        }
    });

    sciExpressionInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            calculateSci();
        }

        if (event.key === "Escape") {
            event.preventDefault();
            sciClearAll();
        }
    });

    sciExpressionInput.addEventListener("input", function () {
        sanitizeInput(sciExpressionInput);
    });

    /* ---------- 事件绑定：模式切换 ---------- */
    modeTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            switchMode(tab.dataset.mode);
        });
    });

    /* ---------- 事件绑定：进制转换 ---------- */
    baseConvertButton.addEventListener("click", convertBaseNumber);

    baseValueInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            convertBaseNumber();
        }
    });

    /* ---------- 事件绑定：历史记录 ---------- */
    historyList.addEventListener("click", function (event) {
        var deleteButton = event.target.closest(".history-delete");

        if (deleteButton) {
            var id = deleteButton.dataset.id;

            window.CalculatorApi.deleteHistory(id)
                .then(function () {
                    loadHistory();
                })
                .catch(function (error) {
                    setResult(error.message, true);
                });
            return;
        }

        var historyItem = event.target.closest(".history-item");
        if (historyItem) {
            useHistoryResult(historyItem);
        }
    });

    refreshHistoryButton.addEventListener("click", function () {
        loadHistory();
    });

    clearHistoryButton.addEventListener("click", function () {
        if (!window.confirm("确定要清空所有历史记录吗？")) {
            return;
        }

        window.CalculatorApi.clearHistory()
            .then(function () {
                loadHistory();
            })
            .catch(function (error) {
                setResult(error.message, true);
            });
    });

    /* ---------- 初始化 ---------- */
    loadHistory();
    updateInputFontSize(expressionInput);
    updateInputFontSize(sciExpressionInput);
    expressionInput.focus();
}());
