function updateEventDisplay() {
    const todayEventsEl = document.getElementById('today-events');
    const tomorrowEventsEl = document.getElementById('tomorrow-events');

    const events = JSON.parse(localStorage.getItem('events')) || [];


    const today = new Date().toLocaleDateString('en-CA'); 
    const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('en-CA'); 
  

    const todayEvents = events.filter(event => {
        const eventDate = new Date(event.start).toLocaleDateString('en-CA'); 
        console.log('Checking event:', event, 'Event Date:', eventDate);
        return eventDate === today;
    });
    const tomorrowEvents = events.filter(event => {
        const eventDate = new Date(event.start).toLocaleDateString('en-CA');  
        return eventDate === tomorrow;
    });


    todayEventsEl.innerHTML = todayEvents.length ? todayEvents.map(e => `${e.title} at ${new Date(e.start).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`).join('<br>') : 'No events today';
    tomorrowEventsEl.innerHTML = tomorrowEvents.length ? tomorrowEvents.map(e => `${e.title} at ${new Date(e.start).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`).join('<br>') : 'No events tomorrow';
}

document.addEventListener('DOMContentLoaded', function () {
    updateEventDisplay();
    setInterval(updateEventDisplay, 86400000); 
});
