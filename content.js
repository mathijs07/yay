console.log("Extension activated on SomToday page!");

function findGradeTable() {
    return document.querySelector('table[aria-label*="cijfer"]') || 
           document.querySelector('table.grade-table') ||
           document.querySelector('table');
}

function replaceGrades(newValue) {
    const table = findGradeTable();
    if (!table) return;

    const cells = table.getElementsByTagName('td');
    let replacementCount = 0;
    
    for (let cell of cells) {
        if (cell.textContent.match(/\b([1-9]|10)([,.]\d)?\b/)) {
            cell.textContent = newValue;
            replacementCount++;
        }
    }
    
    console.log(`Replaced ${replacementCount} grades with ${newValue}`);
}

function createGradeInput() {
    if (document.querySelector('.grade-modifier')) return;

    const inputContainer = document.createElement('div');
    inputContainer.className = 'grade-modifier';
    inputContainer.innerHTML = `
        <div class="st-card-content">
            <input type="text" class="st-input" id="gradeValue" placeholder="Voer een cijfer in">
            <button class="st-button" id="applyGrade">Toepassen</button>
        </div>
    `;

    // Find the heading that contains "Cijferoverzicht"
    const heading = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .find(h => h.textContent.includes('Cijferoverzicht'));

    if (heading) {
        // Create a wrapper to hold both the heading and our input
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '16px';
        
        // Move the heading into our wrapper and add our input
        heading.parentNode.insertBefore(wrapper, heading);
        wrapper.appendChild(heading);
        wrapper.appendChild(inputContainer);
    }
}

// Update the styles
const styles = document.createElement('style');
styles.textContent = `
    .grade-modifier {
        display: inline-flex;
        align-items: center;
        gap: 16px;
    }
    .grade-modifier .st-card-content {
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .grade-modifier .st-input {
        padding: 8px;
        border: 2px solid #ff0000;
        border-radius: 4px;
        width: 100px;
        background-color: #fff0f0;
        color: #ff0000;
    }
    .grade-modifier .st-input::placeholder {
        color: #ff9999;
    }
    .grade-modifier .st-button {
        background: #ff0000;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        white-space: nowrap;
    }
    .grade-modifier .st-button:hover {
        background: #cc0000;
    }
`;

// ...rest of the existing code...

// Initialize observer for dynamic content
const observer = new MutationObserver((mutations) => {
    const table = findGradeTable();
    if (table) {
        const cells = table.getElementsByTagName('td');
        if (cells.length > 0) {
            // Table has content, stop observing
            observer.disconnect();
            createGradeInput();
        }
    }
});

// Start observing when page loads
function init() {
    document.head.appendChild(styles);
    const table = findGradeTable();
    if (table) {
        createGradeInput();
    } else {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Execute initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}