import Calendar  from './js/calendar.js';


//for mobile devices
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => console.log('Service Worker registered with scope:', registration.scope))
      .catch(error => console.error('Service Worker registration failed:', error));
  }


// Load the clockData from localStorage
function loadData() {
    const storedClockData = getClockData();
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

// Get the clockData from localStorage
function getClockData() {
    return localStorage.getItem('clockData');
}

// Create a new Calendar instance
const calendar = new Calendar(clockData, new Date());

// Update the calendar when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    calendar.updateCalendar();

    //************************ */
    // Main button event listeners
    //************************ */
    document.getElementById('previousWeekButton').addEventListener('click', function() {
        calendar.previousWeek();
        console.log(calendar.clockData)
    });

    document.getElementById('nextWeekButton').addEventListener('click', function() {
        calendar.nextWeek();
    });

    document.getElementById('clockButton').addEventListener('click', function() {
        // Store the updated clockData
        storeData(calendar.addClockInOrOut(new Date()));
    });


    //************************ */
    // Detail edit dialog event listeners
    //************************ */
    document.getElementById('editClocksButton').addEventListener('click', function() {
        // Get the selected line
        let selectedLine = document.querySelector('.calendar-line.selected');
    
        // If no line is selected, don't do anything
        if (!selectedLine) return;
    
        // Get the date from the selected line
        let date = selectedLine.querySelector('.date').textContent;
    
        // Find the clock data for the selected date
        let clockData = calendar.clockData.find(data => data.date === date);
    
        // Get the form and clear it
        let form = document.getElementById('editForm');
        form.innerHTML = '';
    
        // Create an input for each clock in/out time
        clockData.times.forEach((time, index) => {
            let labelIn = document.createElement('label');
            labelIn.textContent = `Clock In:`;
    
            let inputIn = document.createElement('input');
            inputIn.type = 'time';
            inputIn.value = time.clockIn;
    
            let labelOut = document.createElement('label');
            labelOut.textContent = `Clock Out:`;
    
            let inputOut = document.createElement('input');
            inputOut.type = 'time';
            inputOut.value = time.clockOut;
    
            form.appendChild(labelIn);
            form.appendChild(inputIn);
            form.appendChild(labelOut);
            form.appendChild(inputOut);
        });
    
        // Create buttons
        let cancelButton = document.createElement('button');
        cancelButton.id = 'cancelButton';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', function() {
            editDialog.close();
        });

        let saveButton = document.createElement('button');
        saveButton.id = 'saveButton';
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', function() {
            debugger;
            // Get all the input elements in the form
            let inputs = Array.from(form.querySelectorAll('input[type="time"]'));

            // Group the inputs by two (clock in and clock out)
            let times = [];
            for (let i = 0; i < inputs.length; i += 2) {
                times.push({
                    clockIn: inputs[i].value,
                    clockOut: inputs[i + 1].value
                });
            }
            
            // Convert the date string to a Date object
            let dateParts = date.split('/');
            let dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);


            // Use the calendar.overrideClockInOut function to save the new times
            calendar.overrideClockInOut(dateObject, times);

            // Close the dialog
            editDialog.close();
        });
    
        // Show the dialog
        let editDialog = document.getElementById('editDialog');
        editDialog.appendChild(form);
        editDialog.appendChild(cancelButton);
        editDialog.appendChild(saveButton);
        editDialog.showModal();
    });





    //************************ */
    // Calendar selection event listeners
    //************************ */

    // Get all the lines in the calendar
    let calendarLines = document.querySelectorAll('.calendar-line');

    // Add an event listener to each line
    calendarLines.forEach(line => {
        line.addEventListener('click', function() {
            // Remove the 'selected' class from all lines
            calendarLines.forEach(line => {
                line.classList.remove('selected');
            });

            // Add the 'selected' class to the clicked line
            this.classList.add('selected');
        });
    });

    

});




