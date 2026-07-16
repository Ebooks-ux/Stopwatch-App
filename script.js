// Select main display element
const display = document.getElementById("display");

// Timer state variables
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let lapCounter = 1; // Counter for lap numbers

// Start the stopwatch
function start() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update, 10);
        isRunning = true;
    }
}

// Stop the stopwatch
function stop() {
    if (isRunning) {
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
    }
}

// Reset the stopwatch and clear the display
function reset() {
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    display.textContent = "00:00:00:00";
}

// Update the display with the calculated time
function update() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds = Math.floor(elapsedTime / 1000 % 60);
    let milliseconds = Math.floor(elapsedTime % 1000 / 10);

    // Format time components to be 2 digits
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    display.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

// Record a lap time and save to localStorage
function recordLap() {
    const lapTime = display.textContent;
    const lapList = document.getElementById("lapList");

    // Create a new list item for the lap
    const lap = document.createElement("li");
    lap.textContent = `Lap ${lapCounter}: ${lapTime}`;
    lapList.appendChild(lap);

    // Get existing laps from localStorage
    let laps = JSON.parse(localStorage.getItem("laps")) || [];

    // Add new lap to the array
    laps.push({
        number: lapCounter,
        time: lapTime
    });

    // Save updated array back to localStorage
    localStorage.setItem("laps", JSON.stringify(laps));
    
    lapCounter++;
}

// Load saved data and theme on window load
window.onload = function() {
    const lapList = document.getElementById("lapList");
    const savedLaps = JSON.parse(localStorage.getItem("laps")) || [];

    // Render saved laps
    savedLaps.forEach(lap => {
        const li = document.createElement("li");
        li.textContent = `Lap ${lap.number}: ${lap.time}`;
        lapList.appendChild(li);
        
        // Update lap counter based on saved laps to continue sequentially
        lapCounter = lap.number + 1;
    });

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.className = savedTheme;
    }
};

// Toggle Dark/Light Theme
const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    
    // Save the updated theme class to localStorage
    localStorage.setItem("theme", document.body.className);
});

// Keyboard shortcuts for quick control
document.addEventListener("keydown", (event) => {
    switch(event.key.toLowerCase()) {
        case "s":
            start();
            break;
        case "x":
            stop(); // Assuming x was meant to be stop, not start
            break;
        case "r":
            reset(); // Changed from start() to reset()
            break;
        case "l":
            recordLap(); // Changed from start() to recordLap()
            break;
    }
});

// Export lap times as CSV
function exportCSV() {
    const laps = JSON.parse(localStorage.getItem("laps")) || [];
    
    // CSV Header
    let csv = "Lap Number,Lap Time\n";

    // Append each lap to the CSV string
    laps.forEach(lap => {
        csv += `${lap.number},${lap.time}\n`;
    });

    // Create a Blob from the CSV string
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    // Create an invisible anchor element to trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "lap-times.csv";
    
    // Trigger the download and cleanup
    a.click();
    URL.revokeObjectURL(url);
}
