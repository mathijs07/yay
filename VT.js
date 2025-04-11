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

function createCalculatorInput_VT() {

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

    const gradesContainer = document.querySelector('sl-voortgangsresultaten');
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

function findGradeTable() {
    return document.querySelector('sl-voortgangsresultaten');
}

let isInitialized = false;
let currentUrl = document.URL;

async function initialize() {
    if (isInitialized) return; // Prevent re-initialization

    const urlPattern = "https://leerling.somtoday.nl/cijfers/vakresultaten?vak";
    const urlPatternEnd = "Examen";
    if (document.URL.startsWith(urlPattern) && !document.URL.endsWith(urlPatternEnd)) {
        await waitForElement('sl-voortgangsresultaten', 5000)
        const gradeTable = document.querySelector("sl-voortgangsresultaten");
        if (gradeTable) {
            createCalculatorInput_VT();
            isInitialized = true;
        }
    }
}

const filterPopupObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length) {
            let filterPopup = null;
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // Element node
                    if (node.matches && node.matches('.filter-options')) {
                        filterPopup = node;
                        break;
                    } else if (node.querySelector) {
                        filterPopup = node.querySelector('.filter-options');
                        if (filterPopup) break;
                    }
                }
            }



            if (filterPopup && !filterPopup.querySelector("#editGrades")) {
                // --- START: Inject Checkbox ---

                // Create the container div
                const filterItem = document.createElement("div");
                filterItem.className = "filter-item";
                filterItem.setAttribute("tabindex", "0");
                filterItem.style.display = 'flex';
                filterItem.style.alignItems = 'center';
                filterItem.style.gap = 'var(--spacing-8, 8px)';
                filterItem.style.padding = 'var(--spacing-8, 8px) 0';
                filterItem.style.paddingTop = '0px';


                // --- CSS Definitions ---
                const checkboxStyles = `
                    /* ... (keep existing CSS styles) ... */
                    .edit-grades-checkbox .checkmark { /* Target the div directly */
                        display: grid;
                        box-sizing: border-box;
                        width: 20px;
                        height: 20px;
                        background-color: var(--bg-neutral-none, transparent);
                        border: var(--thin-solid-neutral-strong, 1px solid #576275);
                        border-radius: var(--border-radius-normal, 6px);
                        place-items: center;
                        transition: background-color 0.2s ease, border-color 0.2s ease;
                        cursor: pointer;
                        flex-shrink: 0;
                    }
                    .edit-grades-checkbox .input-checkbox {
                        position: absolute;
                        opacity: 0;
                        cursor: pointer;
                        height: 0;
                        width: 0;
                        margin: 0;
                    }
                    .edit-grades-checkbox .checkmark svg {
                        display: none;
                        width: 16px;
                        height: 16px;
                        fill: var(--fg-on-primary-normal, var(--grey-150, #181c20));
                    }
                    .edit-grades-checkbox .input-checkbox:checked ~ .checkmark {
                        background-color: var(--active-color);
                        border-color: transparent;
                    }
                    .edit-grades-checkbox .input-checkbox:checked ~ .checkmark svg {
                        display: block;
                    }
                    @media (hover: hover) {
                        .edit-grades-checkbox .checkbox-container:hover .input-checkbox:not(:checked) ~ .checkmark:not(.disabled) {
                            border-color: var(--active-color);
                        }
                        .edit-grades-checkbox .checkbox-container:hover .input-checkbox:checked ~ .checkmark:not(.disabled) {
                            background-color: var(--active-hover-color);
                            border-color: var(--active-hover-color);
                        }
                    }
                    .edit-grades-label-text {
                        color: var(--text-moderate, #e2e6e9);
                        font-family: var(--font-family-content, "Open Sans", sans-serif);
                        font-size: var(--font-size-normal, 16px);
                        line-height: 1.4;
                        user-select: none;
                        cursor: pointer;
                    }
                `;

                // Add the styles to the document head
                if (!document.getElementById('edit-grades-checkbox-styles')) {
                   const styleElement = document.createElement("style");
                   styleElement.id = 'edit-grades-checkbox-styles';
                   styleElement.textContent = checkboxStyles;
                   document.head.appendChild(styleElement);
                }

                // Create the HTML structure
                filterItem.innerHTML = `
                  <hmy-checkbox class="edit-grades-checkbox" aria-label="Cijfers bewerken" style="display: contents; --active-color: var(--action-primary-normal, #66b4ff); --active-hover-color: var(--action-primary-strong, #339bff);">
                    <label class="checkbox-container" style="display: contents;">
                      <input class="input-checkbox" id="editGrades" type="checkbox" tabindex="-1">
                      <div class="checkmark">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" display="block">
                                <path fill-rule="evenodd" d="m9.706 21.576 13.876-14.05c.538-.55.56-1.43.044-1.998l-2.769-3.06a1.41 1.41 0 0 0-2.076-.025L9.83 11.858a1.41 1.41 0 0 1-2.06-.01L5.424 9.342a1.414 1.414 0 0 0-2.041-.032l-2.96 2.982a1.45 1.45 0 0 0 .003 2.052l7.27 7.242c.56.555 1.455.552 2.01-.01"></path>
                           </svg>
                      </div>
                    </label>
                    <!---->
                  </hmy-checkbox>
                  <span class="edit-grades-label-text">Cijfers bewerken</span>
                `;

                // Add the complete item to the popup
                filterPopup.appendChild(filterItem);

                // --- Event Listener & State Management ---
                const checkboxInput = filterItem.querySelector("#editGrades");
                const labelTextSpan = filterItem.querySelector('.edit-grades-label-text');
                const storageKey = 'magisterGradeEditEnabled'; // Key for localStorage

                if (checkboxInput) {
                    // Load initial state from localStorage
                    const savedState = localStorage.getItem(storageKey);
                    if (savedState === 'true') {
                        checkboxInput.checked = true;
                        // IMPORTANT: Call toggleEditGrades if needed when popup opens and state is true
                        // We need to ensure grades are loaded first. A slight delay might work,
                        // or ideally, call this after extractGradesAndWeights confirms completion.
                        // For simplicity, let's try calling it directly here. If it fails
                        // because grades aren't ready, we might need a more robust solution.
                        if (typeof toggleEditGrades === 'function') {
                           // Use a small timeout to allow the DOM and potentially grades to settle
                           setTimeout(() => toggleEditGrades(), 100);
                        }
                    } else {
                        checkboxInput.checked = false;
                    }

                    // Add change listener to save state and toggle
                    checkboxInput.addEventListener("change", (event) => {
                        const isChecked = event.target.checked;
                        console.log("Checkbox 'Cijfers bewerken' changed:", isChecked);
                        // Save state to localStorage
                        localStorage.setItem(storageKey, isChecked);
                        // Call your toggle function
                        if (typeof toggleEditGrades === 'function') {
                            toggleEditGrades(event);
                        }
                    });

                    // Make text clickable
                    if (labelTextSpan) {
                         labelTextSpan.addEventListener('click', () => {
                            checkboxInput.click();
                         });
                     }
                }
                // --- END: Inject Checkbox ---
            }
        }
    });
});

filterPopupObserver.observe(document.body, { childList: true, subtree: true });


const observer = new MutationObserver(function (mutations) {
    if (document.URL !== currentUrl) {
        currentUrl = document.URL;
        const urlPattern = "https://leerling.somtoday.nl/cijfers/vakresultaten?vak";
        const urlPatternEnd = "Examen";
        if (document.URL.startsWith(urlPattern) && !document.URL.endsWith(urlPatternEnd)) {
            isInitialized = false;
            initialize();
        }
    }
})
    ;

// Start observing the document body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initialize);
// Add this function somewhere in your code

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Set a timeout to avoid waiting indefinitely
        setTimeout(() => {
            observer.disconnect();
            resolve(null); // Resolve with null after timeout
        }, timeout);
    });
}

const observer_reload = new MutationObserver(function (mutations) {
    if (document.querySelector("sl-vakresultaten")) {
        initialize();
        observer_reload.disconnect(); // Stop observing after the table is found
    }
});

// Start observing the document body for changes
observer_reload.observe(document.body, { childList: true, subtree: true });
