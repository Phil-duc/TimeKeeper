import Calendar  from './js/calendar.js';


//for mobile devices
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => console.log('Service Worker registered with scope:', registration.scope))
      .catch(error => console.error('Service Worker registration failed:', error));
  }


// Load the clockData from localStorage
function loadData() {
    const storedClockData = localStorage.getItem('clockData');
    if (storedClockData) {
        return JSON.parse(storedClockData);
    } else {
        return []; // Return an empty array when there's no stored data
    }
}

// Store the clockData in localStorage
function storeData(clockData) {
    localStorage.setItem('clockData', JSON.stringify(clockData));
}

// Load the clockData or use the default data if there's no stored data
const clockData = loadData()

// Create a new Calendar instance
const calendar = new Calendar(clockData, new Date());

// Update the calendar when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    calendar.updateCalendar();

    // Add event listeners for your buttons here, for example:
    document.getElementById('previousWeekButton').addEventListener('click', function() {
        calendar.previousWeek();
    });

    document.getElementById('nextWeekButton').addEventListener('click', function() {
        calendar.nextWeek();
    });

    document.getElementById('clockButton').addEventListener('click', function() {
        calendar.addClockInOrOut(new Date());
        // Store the updated clockData
        storeData(calendar.clockData);
    });
});