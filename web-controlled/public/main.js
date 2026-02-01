
let currentColor = "#DD0000"

function main() {
    resetCanvas()
    reloadCanvasFromServer()
    readColorHistory()

    const colorPicker = document.getElementById("colorpicker")
    colorPicker.addEventListener('change', (d) => {
        currentColor = d.target.value;
    })

    const historyEl = document.getElementById("colorHistory")
    colorPicker.addEventListener('change', (d) => {
        const newHistory = document.createElement("div");
        newHistory.style.backgroundColor = currentColor;
        newHistory.className = 'historyColor';
        newHistory.addEventListener('click', () => {
            currentColor = newHistory.style.backgroundColor
        })
        historyEl.appendChild(newHistory)
        const currentData = load()
        currentData["colors"] = [currentColor, ...(currentData["colors"] || [])]
        store(currentData)
    })


    // Re-fetch button
    const refetchBtn = document.getElementById("re-fetch")
    refetchBtn.addEventListener('click', reloadCanvasFromServer)

    // Clear button
    const clearBtn = document.getElementById("clear")
    clearBtn.addEventListener('click', (d) => {
        const data = []
        Array.from({ length: 8 }, (_, x) =>
            Array.from({ length: 8 }, (_, y) => {
                data.push({ x, y, color: [0, 0, 0] })
            })
        );
        postApi(data)
        resetCanvas()
    })
}

const STORE_KEY = "pixel"
function store(new_data) {
    const current_data = load()
    const new_value = { ...current_data, ...new_data }
    window.localStorage.setItem(STORE_KEY, JSON.stringify(new_value))
}
function load() {
    return JSON.parse(window.localStorage.getItem(STORE_KEY) || "{}")
}

function reloadCanvasFromServer() {
    const tableBody = document.getElementById("canvas").firstChild

    fetch("/api/board", { method: "GET" }).then(res => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
    }).then(data => {
        data.forEach((row, rowIndex) => {
            row.forEach((cellRgb, colIndex) => {
                const cellEl = tableBody.childNodes[colIndex].childNodes[rowIndex]
                cellEl.style.backgroundColor = rgbToHex(cellRgb)
            })
        })
    })
}

function readColorHistory() {
    const data = load()
    const historyEl = document.getElementById("colorHistory")
    historyEl.innerText = ''
    data?.colors?.forEach((storedColor) => {
        const newHistory = document.createElement("div");
        newHistory.style.backgroundColor = storedColor;
        newHistory.className = 'historyColor';
        newHistory.addEventListener('click', () => {
            currentColor = storedColor
        })
        historyEl.appendChild(newHistory)
    })
}

function resetCanvas() {
    const table = document.getElementById("canvas")
    table.innerText = ""
    const tbody = document.createElement("tbody")
    const row = document.createElement("tr")

    Array.from({ length: 8 }, (_, y) => {
        const newRow = row.cloneNode()
        Array.from({ length: 8 }, (_, x) => {
            newRow.appendChild(generateCell(x, y));
        });
        tbody.appendChild(newRow);
    });

    table.appendChild(tbody);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(rgb) {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

const cellTemplate = document.createElement("td")
function generateCell(x, y) {
    const newCell = cellTemplate.cloneNode()
    newCell.addEventListener('click', () => {
        newCell.style.backgroundColor = currentColor;
        postApi([{
            x, y: y, color: hexToRgb(currentColor),
        }])
    })
    return newCell
}

function postApi(data) {
    fetch("/api/board", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }),
    }).then(res => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
    }).then(data => {
        if (data.status != "OK") {
            throw Error(data.message)
        }
    })
        .catch(err => {
            console.error("Error:", err);
        });
}


window.addEventListener('load', main)
