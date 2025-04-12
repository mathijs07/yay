console.log("Extension activated on SomToday page!");

function calculateNeededGrade(grades, weights, desiredAverage, newWeight) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (let i = 0; i < grades.length; i++) {
        weightedSum += grades[i] * weights[i];
        totalWeight += weights[i];
    }

    const neededGrade = (desiredAverage * (totalWeight + newWeight) - weightedSum) / newWeight;
    return neededGrade.toFixed(2);
}

function calculateAverageGrade(grades, weights) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (let i = 0; i < grades.length; i++) {
        weightedSum += grades[i] * weights[i];
        totalWeight += weights[i];
    }

    if (totalWeight === 0) {
        return 0;
    }

    const averageGrade = weightedSum / totalWeight;
    return averageGrade.toFixed(2);
}

function createCalculatorInput() {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'grade-calculator';

    const { grades: initialGrades, weights: initialWeights } = extractGradesAndWeights();
    const gradesArray = [...initialGrades];
    const weightsArray = [...initialWeights];

    inputContainer.innerHTML = `
        <style>
            .grade-calculator {
                margin: 20px 0;
                padding: 20px;
                border-top: 2px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                display: flex; /* Use flexbox */
            }
            .grade-calculator .calculator-section {
                flex: 1; /* Each calculator takes up equal space */
                padding: 10px;
            }
            .grade-calculator .st-card-content {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }
            .grade-calculator .st-label {
                font-weight: 600;
                color: #555;
            }
            .grade-calculator .st-input {
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 6px;
                width: 100px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            .grade-calculator .st-input:focus {
                border-color: #888;
                outline: none;
            }
            .grade-calculator .st-button {
                background: #007bff;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 1rem;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s ease;
            }
            .grade-calculator .st-button:hover {
                background: #0056b3;
            }
            /* Dark mode styles */
            @media (prefers-color-scheme: dark) {
                .grade-calculator {
                    background: #333;
                    color: #eee;
                    border-top: 2px solid #555;
                    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.05);
                }
                .grade-calculator .st-label {
                    color: #ddd;
                }
                .grade-calculator .st-input {
                    background-color: #444;
                    color: #eee;
                    border: 1px solid #777;
                }
                .grade-calculator .st-input:focus {
                    border-color: #aaa;
                }
                .grade-calculator .st-button {
                    background: linear-gradient(to bottom, #3498db, #2980b9);
                    color: #ecf0f1;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                }
                .grade-calculator .st-button:hover {
                    background: linear-gradient(to bottom, #2980b9, #34495e);
                }
            }
        </style>
        <div class="st-card-content calculator-section">
            <h3>Benodigd cijfer calculator</h3>
            <label class="st-label">Gewenste gemiddelde:</label>
            <input type="number" class="st-input" id="desiredAverage" placeholder="8.0" min="1" max="10" step="0.1">
            <label class="st-label">Weging nieuwe cijfer:</label>
            <input type="number" class="st-input" id="newWeight" placeholder="10" min="1" max="100" step="1">
            <button class="st-button" id="calculateGrade">Bereken benodigd cijfer</button>
            <div id="neededGradeResult" style="margin-top: 10px;"></div>
        </div>
        <div class="st-card-content calculator-section">
            <h3>Gemiddelde cijfer calculator</h3>
            <label class="st-label">Nieuw cijfer:</label>
            <input type="number" class="st-input" id="newGrade" placeholder="8.0" min="1" max="10" step="0.1">
            <label class="st-label">Weging cijfer:</label>
            <input type="number" class="st-input" id="gradeWeight" placeholder="10" min="1" max="100" step="1">
            <button class="st-button" id="addGrade">Voeg cijfer toe</button>
            <div id="averageGradeResult" style="margin-top: 10px; "></div>
        </div>
    `;

    const gradesContainer = document.querySelector('sl-examenresultaten');
    if (gradesContainer) {
        gradesContainer.appendChild(inputContainer);

        function attachListeners() {
            document.getElementById('calculateGrade').addEventListener('click', () => {
                const desiredAverage = parseFloat(document.getElementById('desiredAverage').value);
                const newWeight = parseFloat(document.getElementById('newWeight').value);

                if (isNaN(desiredAverage) || isNaN(newWeight)) {
                    document.getElementById('neededGradeResult').textContent = "Vul geldige nummers in.";
                    return;
                }

                const neededGrade = calculateNeededGrade(gradesArray, weightsArray, desiredAverage, newWeight);
                document.getElementById('neededGradeResult').textContent = `Benodigd cijfer: ${neededGrade}`;
            });

            document.getElementById('addGrade').addEventListener('click', () => {
                const newGrade = parseFloat(document.getElementById('newGrade').value);
                const gradeWeight = parseFloat(document.getElementById('gradeWeight').value);

                if (isNaN(newGrade) || isNaN(gradeWeight)) {
                    document.getElementById('averageGradeResult').textContent = "Vul geldige nummers in.";
                    return;
                }

                gradesArray.push(newGrade);
                weightsArray.push(gradeWeight);

                const averageGrade = calculateAverageGrade(gradesArray, weightsArray);
                document.getElementById('averageGradeResult').textContent = `Gemiddelde: ${averageGrade}`;
            });
        }

        // Attach listeners after a short delay to ensure elements are loaded
        setTimeout(attachListeners, 200);
    }
}

function extractGradesAndWeights() {
    const grades = [];
    const weights = [];

    // Target each grade item
    const gradeItems = document?.querySelectorAll('sl-vakresultaat-item');

    if (!gradeItems) {
        console.warn('No grade items found.');
        return { grades, weights };
    }

    gradeItems.forEach(item => {
        // Extract grade
        const gradeElement = item.querySelector('.cijfer > span');
        const gradeText = gradeElement ? gradeElement.textContent.trim() : null;

        // Extract weight
        const weightElement = item.querySelector('.weging');
        let weightText = null;
        if (weightElement) {
            weightText = weightElement.textContent.replace('x', '').trim();
        }

        if (gradeText && weightText && gradeText !== '*') {
            const grade = parseFloat(gradeText.replace(',', '.'));
            const weight = parseInt(weightText);

            if (!isNaN(grade) && !isNaN(weight)) {
                grades.push(grade);
                weights.push(weight);
            }
        }
    });

    return { grades, weights };
}

function createGradeInput() {
    createCalculatorInput();
}

function findGradeTable() {
    return document.querySelector('sl-examenresultaten');
}

let isInitialized_SE = false;
let currentUrl_SE = document.URL;

async function initialize_SE() {
    if (isInitialized_SE) return; // Prevent re-initialization

    const urlPattern = "https://leerling.somtoday.nl/cijfers/vakresultaten?vak";
    const urlPatternend = "Examen";
    const urlPatternend_wiskD = "20D";
    const urlPatternend_gmf = "(maatschappijleer)";
    const urlPatternend_O_O = "20ontwerpen";
     if (document.URL.startsWith(urlPattern) && document.URL.endsWith(urlPatternend) || document.URL.endsWith(urlPatternend_wiskD) || document.URL.endsWith(urlPatternend_gmf) || document.URL.endsWith(urlPatternend_O_O)) {
        await waitForElement('sl-examenresultaten', 5000)
        const gradeTable = document.querySelector("sl-examenresultaten");
        console.log("Grade table found:", gradeTable);
        if (gradeTable) {
            createGradeInput();
            console.log("Grade table found and exicuted:");
            isInitialized_SE = true;
        }
    }
}

const observer_SE = new MutationObserver(function (mutations) {
    if (document.URL !== currentUrl_SE) {
        currentUrl_SE = document.URL;
        isInitialized_SE = false;
        console.log("Current URL:", currentUrl_SE);
        initialize_SE();
    }
});

// Start observing the document body for changes
observer_SE.observe(document.body, {
    childList: true,
    subtree: true
});

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initialize_SE);
// Add this function somewhere in your code

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer_SE = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer_SE.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer_SE.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Set a timeout to avoid waiting indefinitely
        setTimeout(() => {
            observer_SE.disconnect();
            resolve(null); // Resolve with null after timeout
        }, timeout);
    });
}

const observer_SE_reload = new MutationObserver(function (mutations) {
    if (document.querySelector("sl-vakresultaten")) {
        initialize_SE();
        observer_SE_reload.disconnect(); // Stop observing after the table is found
    }
});

// Start observing the document body for changes
observer_SE_reload.observe(document.body, { childList: true, subtree: true });
