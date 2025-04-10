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

function createCalculatorInput(grades, weights) {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'grade-calculator';
    inputContainer.innerHTML = `
        <style>
            .grade-calculator {
                margin: 16px 0;
                padding: 16px;
                border-top: 1px solid #eee;
            }
            .grade-calculator .st-card-content {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }
            .grade-calculator .st-label {
                font-weight: bold;
            }
            .grade-calculator .st-input {
                padding: 8px;
                border-radius: 4px;
                width: 80px;
            }
            .grade-calculator .st-button {
                border: none;
                border-radius: 6px;
                padding: 8px 16px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            /* Dark mode styles */
            @media (prefers-color-scheme: dark) {
                .grade-calculator {
                    background: #333;
                    color: #eee;
                    border-top: 1px solid #555;
                }
                .grade-calculator .st-input {
                    background-color: #444;
                    color: #eee;
                    border: 1px solid #777;
                }
                .grade-calculator .st-button {
                    background: linear-gradient(to bottom, #444, #444);
                    color: #444;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                }
                .grade-calculator .st-button:hover {
                    background: linear-gradient(to bottom, #0088cc, #006699);
                }
            }
        </style>
        <div class="st-card-content">
            <label class="st-label">Gewenste gemiddelde:</label>
            <input type="number" class="st-input" id="desiredAverage" placeholder="8.0" min="1" max="10" step="0.1">
            <label class="st-label">Weging nieuwe cijfer:</label>
            <input type="number" class="st-input" id="newWeight" placeholder="10" min="1" max="100" step="1">
            <button class="st-button" id="calculateGrade">Bereken benodigd cijfer</button>
            <div id="neededGradeResult" style="margin-top: 10px;"></div>
        </div>
    `;

    const gradesContainer = document.querySelector('sl-voortgangsresultaten');
    if (gradesContainer) {
        gradesContainer.appendChild(inputContainer);

        document.getElementById('calculateGrade').addEventListener('click', () => {
            const desiredAverage = parseFloat(document.getElementById('desiredAverage').value);
            const newWeight = parseFloat(document.getElementById('newWeight').value);

            if (isNaN(desiredAverage) || isNaN(newWeight)) {
                document.getElementById('neededGradeResult').textContent = "Vul geldige nummers in.";
                return;
            }

            const neededGrade = calculateNeededGrade(grades, weights, desiredAverage, newWeight);
            document.getElementById('neededGradeResult').textContent = `Benodigd cijfer: ${neededGrade}`;
        });
    }
}

function extractGradesAndWeights() {
    const grades = [];
    const weights = [];

    // Target each grade item
    const gradeItems = document?.querySelectorAll('sl-vakresultaat-item');

    gradeItems.forEach(item => {
        // Extract grade
        const gradeElement = item.querySelector('.cijfer > span');
        const gradeText = gradeElement ? gradeElement.textContent.trim() : null;

        // Extract weight
        const weightElement = item.querySelector('.weging');
        const weightText = weightElement ? weightElement.textContent.replace('x', '').trim() : null;

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
    const { grades, weights } = extractGradesAndWeights();
    createCalculatorInput(grades, weights);
}



function findGradeTable() {
    return document.querySelector('sl-voortgangsresultaten');
}

function initialize() {
    if (document.querySelector("sl-voortgangsresultaten")) {
        createGradeInput();
    }
}

const observer = new MutationObserver(function (mutations) {
    if (document.querySelector("sl-examenresultaten")) {
        initialize();
      observer.disconnect(); // Stop observing after the table is found
    }
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, { childList: true, subtree: true });