function updateEventDisplay() {
    const todayEventsEl = document.getElementById('today-events');
    const tomorrowEventsEl = document.getElementById('tomorrow-events');

    const events = JSON.parse(localStorage.getItem('events')) || [];
    console.log('Events:', events);  // Output storage data

    const today = new Date().toLocaleDateString('en-CA'); // Local date string in YYYY-MM-DD format
    const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('en-CA'); // Local date string for tomorrow
    console.log('Today:', today, 'Tomorrow:', tomorrow);  // Debugging log

    const todayEvents = events.filter(event => {
        const eventDate = new Date(event.start).toLocaleDateString('en-CA');  // Extract date part from start
        console.log('Checking event:', event, 'Event Date:', eventDate);
        return eventDate === today;
    });
    const tomorrowEvents = events.filter(event => {
        const eventDate = new Date(event.start).toLocaleDateString('en-CA');  // Extract date part from start
        return eventDate === tomorrow;
    });

    console.log('Today Events:', todayEvents);  // Debugging log
    console.log('Tomorrow Events:', tomorrowEvents);  // Debugging log

    todayEventsEl.innerHTML = todayEvents.length ? todayEvents.map(e => `${e.title} at ${new Date(e.start).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`).join('<br>') : 'No events today';
    tomorrowEventsEl.innerHTML = tomorrowEvents.length ? tomorrowEvents.map(e => `${e.title} at ${new Date(e.start).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`).join('<br>') : 'No events tomorrow';
}

document.addEventListener('DOMContentLoaded', function () {
    updateEventDisplay();
    setInterval(updateEventDisplay, 86400000); // Re-check every 24 hours
});
