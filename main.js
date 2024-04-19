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



// Function to set up event listeners for calendar lines
function setupCalendarLineListeners() {
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
}




// Create a new Calendar instance
const calendar = new Calendar(clockData, new Date());

// Update the calendar when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    calendar.updateCalendar();
    setupCalendarLineListeners()

    //************************ */
    // Main button event listeners
    //************************ */
    document.getElementById('previousWeekButton').addEventListener('click', function() {
        calendar.previousWeek();
        setupCalendarLineListeners(); // Set up event listeners for the new calendar lines
    });

    document.getElementById('nextWeekButton').addEventListener('click', function() {
        calendar.nextWeek();
        setupCalendarLineListeners(); // Set up event listeners for the new calendar lines
    });

    document.getElementById('clockButton').addEventListener('click', function() {
        // Store the updated clockData
        storeData(calendar.addClockInOrOut(new Date()));
        setupCalendarLineListeners(); // Set up event listeners for the new calendar lines
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

        // If there's no clock data for the selected date, create a default input
        if (!clockData) {
            clockData = {
                times: [{
                    clockIn: '',
                    clockOut: ''
                }]
            };
        }
    
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
        
            // Only append the clockOut input if it's not the last one or if it's not empty
            if (index !== clockData.times.length - 1 || time.clockOut) {
                form.appendChild(labelOut);
                form.appendChild(inputOut);
            }
        });

        // Create an 'Add Clock In/Out' button
        // Get the number of inputs in the form
        let inputCount = form.querySelectorAll('input[type="time"]').length;

        let addClockInOutButton = document.createElement('button');
        addClockInOutButton.textContent = 'Add Clock In/Out';
        addClockInOutButton.classList.add('add-button')
        addClockInOutButton.addEventListener('click', function(event) {
            // Prevent the form from being submitted
            event.preventDefault();

            // Create new clock in/out input
            let label = document.createElement('label');
            let input = document.createElement('input');
            input.type = 'time';

            // Check if the input is for clock in or clock out
            if (inputCount % 2 === 0) {
                label.textContent = `Clock In:`;
            } else {
                label.textContent = `Clock Out:`;
            }

            // Insert the new input before the 'Add Clock In/Out' button
            form.insertBefore(label, addClockInOutButton);
            form.insertBefore(input, addClockInOutButton);

            // Increase the input count
            inputCount++;
        });

        // Append the 'Add Clock In/Out' button to the form
        form.appendChild(addClockInOutButton);
    
        // Create buttons
        let cancelButton = document.createElement('button');
        cancelButton.id = 'cancelButton';
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('cancel-button');
        cancelButton.addEventListener('click', function() {
            setupCalendarLineListeners(); // Set up event listeners for the new calendar lines
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
                    clockOut: inputs[i + 1] ? inputs[i + 1].value : undefined
                });
            }
            
            // Convert the date string to a Date object
            let dateParts = date.split('/');
            let dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);


            // Use the calendar.overrideClockInOut function to save the new times
            calendar.overrideClockInOut(dateObject, times);

            setupCalendarLineListeners(); // Set up event listeners for the new calendar lines
            // Close the dialog
            editDialog.close();
        });
    
        // Show the dialog
        let editDialog = document.getElementById('editDialog');
        // Clear the dialog before appending new elements
        editDialog.innerHTML = '';

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




