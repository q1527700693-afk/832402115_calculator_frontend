(function () {
    "use strict";

    var API_BASE = "http://localhost:8080";

    function request(url, options) {
        return fetch(url, options)
            .then(function (response) {
                return response.json();
            })
            .catch(function () {
                throw new Error("无法连接后端服务，请确认 Node 后端已启动");
            });
    }

    function calculate(expression) {
        return request(API_BASE + "/api/calculate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                expression: expression
            })
        });
    }

    function getHistory() {
        return request(API_BASE + "/api/history", {
            method: "GET"
        });
    }

    function deleteHistory(id) {
        return request(API_BASE + "/api/history/" + id, {
            method: "DELETE"
        });
    }

    function clearHistory() {
        return request(API_BASE + "/api/history", {
            method: "DELETE"
        });
    }

    function convertBase(value, fromBase, toBase) {
        return request(API_BASE + "/api/convert/base", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                value: value,
                fromBase: Number(fromBase),
                toBase: Number(toBase)
            })
        });
    }

    window.CalculatorApi = {
        calculate: calculate,
        getHistory: getHistory,
        deleteHistory: deleteHistory,
        clearHistory: clearHistory,
        convertBase: convertBase
    };
}());
