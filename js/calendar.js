export default class Calendar {
    constructor(clockData, date) {
        this.clockData = clockData;
        this.displayedWeekStart = this.getStartOfWeek(date) ||this.getStartOfWeek(new Date());
        this.updateCalendar(this.displayedWeekStart, this.clockData);
    }

    updateCalendar(date) {
        const calendarBody = document.getElementById('calendarBody');
        calendarBody.innerHTML = '';

        const displayedDate = date || this.displayedWeekStart;
        const currentWeekEnd = new Date(this.displayedWeekStart);
        currentWeekEnd.setDate(this.displayedWeekStart.getDate() + 6);

        const weekDays = this.generateWeekDays(this.displayedWeekStart);

        // Calculate and display the week number
        const weekNumber = this.getWeekNumber(this.displayedWeekStart);
        // Calculate and display the week number
        const year = this.displayedWeekStart.getFullYear();

        document.getElementById('weekTitle').textContent = `Week ${weekNumber} of ${year}`;

        this.populateCalendarBody(calendarBody, weekDays);
    }

    addClockInOrOut(date) {
        // Format the date as a string in the format "DD/MM/YYYY"
        const formattedDate = this.formatDateEuropean(date);
    
        // Find the entry for the given date
        let entry = this.clockData.find(entry => entry.date === formattedDate);
    
        // If there's no entry for the given date, create a new one
        if (!entry) {
            entry = { date: formattedDate, times: [] };
            this.clockData.push(entry);
        }
    
        // Get the time as a string in the format "HH:MM"
        const currentTime = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    
        // Find the last time entry without a clock-out time
        const timeEntry = entry.times.find(time => !time.clockOut);
    
        if (timeEntry) {
            // If there's a time entry without a clock-out time, set its clock-out time to the current time
            timeEntry.clockOut = currentTime;
        } else {
            // If all time entries have a clock-out time, add a new time entry with the current time as the clock-in time
            entry.times.push({ clockIn: currentTime });
        }
    
        // Update the calendar and the clockDataDisplay
        this.updateCalendar(this.displayedWeekStart);

        // Update the clockDataDisplay for the current date
        const day = { date: this.formatDateEuropean(date) };
        const dateClockData = this.clockData.find(data => data.date === day.date);
        this.updateClockDataDisplay(day, dateClockData);
    }

    updateClockDataDisplay(day, dateClockData) {
        // Create a table and populate it with the clock data
        const clockDataTable = document.createElement('table');
        const headerRow = document.createElement('tr');
        ['Clock In', 'Clock Out', 'Status'].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        clockDataTable.appendChild(headerRow);
    
        if (dateClockData) {
            dateClockData.times.forEach(time => {
                const timeRow = document.createElement('tr');
                let status = 'Working';
                if (time.clockOut) {
                    const diff = this.calculateTimeDifference(time.clockIn, time.clockOut);
                    status = this.formatTime(diff);
                }
                [time.clockIn, time.clockOut || '', status].forEach(cellData => {
                    const td = document.createElement('td');
                    td.textContent = cellData;
                    timeRow.appendChild(td);
                });
                clockDataTable.appendChild(timeRow);
            });
        } else {
            const noDataRow = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.textContent = 'No data for this date.';
            noDataCell.colSpan = 3;
            noDataRow.appendChild(noDataCell);
            clockDataTable.appendChild(noDataRow);
        }
    
        // Display the clockData under the calendar
        const clockDataDisplay = document.getElementById('clockDataDisplay');
        while (clockDataDisplay.firstChild) {
            clockDataDisplay.removeChild(clockDataDisplay.firstChild);
        }
        clockDataDisplay.appendChild(clockDataTable);
    }


    generateWeekDays(displayedWeekStart) {
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(displayedWeekStart);
            day.setDate(displayedWeekStart.getDate() + i);
            weekDays.push({ date: this.formatDateEuropean(day), dayName: day.toLocaleDateString('en-US', { weekday: 'long' }) });
        }
        return weekDays;
    }

    populateCalendarBody(calendarBody, weekDays) {
    weekDays.forEach(day => {
        const row = document.createElement('tr');

         // Add a click event listener to the row
        row.addEventListener('click', () => {
            // Retrieve the clockData for this date
            const dateClockData = this.clockData.find(data => data.date === day.date);

            // Create a table and populate it with the clock data
            const clockDataTable = document.createElement('table');
            const headerRow = document.createElement('tr');
            ['Clock In', 'Clock Out', 'Status'].forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            clockDataTable.appendChild(headerRow);

            if (dateClockData) {
                dateClockData.times.forEach(time => {
                    const timeRow = document.createElement('tr');
                    let status = 'Working';
                    if (time.clockOut) {
                        const diff = this.calculateTimeDifference(time.clockIn, time.clockOut);
                        status = this.formatTime(diff);
                    }
                    [time.clockIn, time.clockOut || '', status].forEach(cellData => {
                        const td = document.createElement('td');
                        td.textContent = cellData;
                        timeRow.appendChild(td);
                    });
                    clockDataTable.appendChild(timeRow);
                });
            } else {
                const noDataRow = document.createElement('tr');
                const noDataCell = document.createElement('td');
                noDataCell.textContent = 'No data for this date.';
                noDataCell.colSpan = 3;
                noDataRow.appendChild(noDataCell);
                clockDataTable.appendChild(noDataRow);
            }

            // Display the clockData under the calendar
            const clockDataDisplay = document.getElementById('clockDataDisplay');
            while (clockDataDisplay.firstChild) {
                clockDataDisplay.removeChild(clockDataDisplay.firstChild);
            }
            clockDataDisplay.appendChild(clockDataTable);
        });


        const dateCell = document.createElement('td');
        const dayNameCell = document.createElement('td');
        const timeSpentCell = document.createElement('td');

        dateCell.textContent = day.date;
        dayNameCell.textContent = day.dayName;

        let timeSpentInMinutes = 0;

        const entry = this.clockData.find(entry => entry.date === day.date);
        if (entry) {
            timeSpentInMinutes = entry.times.reduce((total, current) => total + this.calculateTimeDifference(current.clockIn, current.clockOut), 0);
        }
        timeSpentCell.textContent = this.formatTime(timeSpentInMinutes);

        row.appendChild(dateCell);
        row.appendChild(dayNameCell);
        row.appendChild(timeSpentCell);
        calendarBody.appendChild(row);
    });
}

    nextWeek() {
        const nextWeekStart = new Date(this.displayedWeekStart.getTime());
        nextWeekStart.setDate(nextWeekStart.getDate() + 7);
        this.displayedWeekStart = nextWeekStart;
        this.updateCalendar(this.displayedWeekStart);
    }

    previousWeek() {
        const previousWeekStart = new Date(this.displayedWeekStart.getTime());
        previousWeekStart.setDate(previousWeekStart.getDate() - 7);
        this.displayedWeekStart = previousWeekStart;
        this.updateCalendar(this.displayedWeekStart);
    }

    formatDateEuropean(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1; // Month is zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    getStartOfWeek(date, startDay = 2) {
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === startDay ? 0 : (dayOfWeek < startDay ? -6 : 1));
        return new Date(date.setDate(diff));
    }

    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} hours, ${remainingMinutes} minutes`;
    }

    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    calculateTimeDifference(clockIn, clockOut) {
        if (!clockIn || !clockOut) {
            return 0;
        }
    
        const [clockInHour, clockInMinutes] = clockIn.split(':').map(Number);
        const [clockOutHour, clockOutMinutes] = clockOut.split(':').map(Number);
    
        const clockInDate = new Date();
        clockInDate.setHours(clockInHour, clockInMinutes);
    
        const clockOutDate = new Date();
        clockOutDate.setHours(clockOutHour, clockOutMinutes);
    
        const difference = clockOutDate - clockInDate;
        const minutes = Math.floor(difference / 1000 / 60);
    
        return minutes;
    }
}
