console.log("Schedule time modification script loaded.");
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve) => { // Simplified resolve/reject
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Set a timeout to avoid waiting indefinitely
        setTimeout(() => {
            observer.disconnect();
            resolve(null); // Resolve with null after timeout if element not found
        }, timeout);
    });
}

function modifyScheduleTimes() {
  // Updated selector to target the element containing the time
  const timeElements = document.querySelectorAll('hmy-pill[type="darker"] span span:nth-child(2)');
console.log(timeElements);  console.log(timeElements);
  timeElements.forEach(timeElement => {
    let timeText = timeElement.textContent.trim();

    // Check if the time is already in the desired format
    if (!timeText.match(/^\d{2}:\d{2} - \d{2}:\d{2}$/)) {
      // Attempt to extract the start time
      const match = timeText.match(/(\d{1,2}:\d{2})/);

      if (match) {
        const startTime = match[1].padStart(5, '0'); // Ensure leading zero for hours
        const lessonDuration = isSecondElement() ? 40 : 50;
        const endTime = calculateEndTime(startTime, lessonDuration);

        timeElement.textContent = `${startTime} - ${endTime}`;
      }
    }
  });
}

function calculateEndTime(startTime, lessonDuration) {
  const [hours, minutes] = startTime.split(':').map(Number);
  let endHours = hours;
  let endMinutes = minutes + lessonDuration;

  if (endMinutes >= 60) {
    endHours += 1;
    endMinutes -= 60;
  }

  endHours = endHours % 24;

  const endHoursPadded = String(endHours).padStart(2, '0');
  const endMinutesPadded = String(endMinutes).padStart(2, '0');

  return `${endHoursPadded}:${endMinutesPadded}`;
}

let isSecond = false;

async function getSecondElement() {
  const slRoosterWeek = await waitForElement('sl-rooster-week', 10000);

  if (!slRoosterWeek) {
    console.log("sl-rooster-week not found");
    isSecond = false;
    return null;
  }

  // Get all sl-rooster-dag elements within the slRoosterWeek
  const slRoosterDags = slRoosterWeek.querySelectorAll('sl-rooster-dag');

  // Check if there are at least two elements
  if (slRoosterDags.length < 2) {
    console.log("Less than two sl-rooster-dag elements found");
    isSecond = false;
    return null;
  }

  // Return the second element
  isSecond = true;
  return slRoosterDags[1];
}

function isSecondElement() {
  return isSecond;
}

function isDinsdag() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 2 = Tuesday
  return dayOfWeek === 2; // Check if it's Tuesday
}

// --- Main execution logic ---
async function initializeScheduleModification() {
    // Wait for the main schedule container element to be present
    // Use a selector specific to the schedule container, e.g., '.rooster-container' or a more stable one if available
    const scheduleContainer = await waitForElement('sl-rooster-week', 10000); // Wait up to 10 seconds
    console.log("Schedule container found:", scheduleContainer);

    const secondElement = await getSecondElement();
    console.log("Second element:", secondElement);

    if (scheduleContainer) {
        console.log("Schedule container found. Initializing time modification and observer.");
        // Run the modification once initially in case the content is already there
        modifyScheduleTimes();

        // Create a MutationObserver to watch for changes in the schedule
        const observer_time = new MutationObserver(modifyScheduleTimes);

        // Configure the observer to watch the found schedule container
        const config = { childList: true, subtree: true };

        // Start the observer
        observer_time.observe(scheduleContainer, config);
    } else {
        console.log("Schedule container not found after timeout.");
    }
}

// Start the initialization process
initializeScheduleModification();