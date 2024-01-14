import Calendar  from './js/calendar.js';


//for mobile devices
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => console.log('Service Worker registered with scope:', registration.scope))
      .catch(error => console.error('Service Worker registration failed:', error));
  }


  const clockData = [
    { date: '13/1/2022', times: [
        { clockIn: '08:00', clockOut: '10:00' },
        { clockIn: '10:10', clockOut: '12:00' },
        { clockIn: '12:46', clockOut: '14:20' },
        { clockIn: '14:30', clockOut: '17:00' },]},
    { date: '1/1/2023', times: [
        { clockIn: '08:00', clockOut: '10:00' },
        { clockIn: '10:10', clockOut: '12:00' },
        { clockIn: '12:46', clockOut: '14:20' },
        { clockIn: '14:30', clockOut: '17:00' },]},
    { date: '1/2/2023', times: [
        { clockIn: '08:00', clockOut: '10:00' },
        { clockIn: '10:10', clockOut: '12:00' },
        { clockIn: '12:46', clockOut: '14:20' },
        { clockIn: '14:30', clockOut: '17:00' },]},
    { date: '1/2/2024', times: [
        { clockIn: '08:00', clockOut: '10:00' },
        { clockIn: '10:10', clockOut: '12:00' },
        { clockIn: '12:46', clockOut: '14:20' },
        { clockIn: '14:30', clockOut: '17:00' },]},
    { date: '8/1/2024', times: [
        { clockIn: '08:00', clockOut: '10:00' },
        { clockIn: '10:10', clockOut: '12:00' },
        { clockIn: '12:46', clockOut: '14:20' },
        { clockIn: '14:30', clockOut: '17:00' },]},
];



const calendar = new Calendar(clockData, new Date());


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('previousWeekButton').addEventListener('click', function() {
        calendar.previousWeek();
    });

    document.getElementById('nextWeekButton').addEventListener('click', function() {
        calendar.nextWeek();
    });

    document.getElementById('clockButton').addEventListener('click', function() {
        calendar.addClockInOrOut(new Date());
        console.log(calendar.clockData);
    });


});