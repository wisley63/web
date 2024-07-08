document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: true,
        events: JSON.parse(localStorage.getItem('events')) || [],
        dateClick: function(info) {
            var title = prompt('Enter Event Title:');
            var time = prompt('Enter Event Time (HH:mm):');
            if (title && time) {
                var eventData = {
                    title: title,
                    start: info.dateStr + 'T' + time,
                    allDay: false
                };
                calendar.addEvent(eventData);
                saveEvents(calendar.getEvents());
                setReminders(eventData);
                updateEventDisplay();
            }
        },
        eventClick: function(info) {
            var action = prompt('Enter "e" to edit or "d" to delete the event.');
            if (action === 'd') {
                info.event.remove();
                saveEvents(calendar.getEvents());
                updateEventDisplay();
            } else if (action === 'e') {
                var newTitle = prompt('Enter new title:', info.event.title);
                var newTime = prompt('Enter new time (HH:mm):', info.event.start.toISOString().substring(11, 16));
                if (newTitle) {
                    info.event.setProp('title', newTitle);
                }
                if (newTime) {
                    var dateStr = info.event.start.toISOString().substring(0, 10);
                    info.event.setStart(dateStr + 'T' + newTime);
                }
                saveEvents(calendar.getEvents());
                setReminders({
                    title: info.event.title,
                    start: info.event.start
                });
                updateEventDisplay();
            }
        }
    });

    calendar.render();

    function saveEvents(events) {
        var eventArray = events.map(function(event) {
            return {
                title: event.title,
                start: event.start,
                allDay: event.allDay
            };
        });
        localStorage.setItem('events', JSON.stringify(eventArray));
    }

    function setReminders(eventData) {
        var eventTime = new Date(eventData.start);
        var oneHourBefore = new Date(eventTime.getTime() - 60 * 60 * 1000);
        var midnightBefore = new Date(eventTime);
        midnightBefore.setHours(0, 0, 0, 0);

        if (eventTime > new Date()) {
            setTimeout(function() {
                showNotification(eventData.title + ' is in one hour');
            }, oneHourBefore - new Date());

            setTimeout(function() {
                showNotification(eventData.title + ' is tomorrow');
            }, midnightBefore - new Date());
        }
    }

    function showNotification(message) {
        if (Notification.permission === 'granted') {
            new Notification('Reminder', {
                body: message
            });
        }
    }

    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    var events = JSON.parse(localStorage.getItem('events')) || [];
    events.forEach(eventData => {
        setReminders(eventData);
    });
});
