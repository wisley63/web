document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: true,
        events: JSON.parse(localStorage.getItem('events')) || [],
        dateClick: function (info) {
            var title = prompt('Enter Event Title:');

            var timeWrapper = document.createElement('div');
            var timeLabel = document.createElement('label');
            timeLabel.textContent = 'Select Event Time:';
            var timeInput = document.createElement('input');
            timeInput.type = 'text';
            timeInput.id = 'timePicker';
            timeWrapper.appendChild(timeLabel);
            timeWrapper.appendChild(timeInput);
            document.body.appendChild(timeWrapper);

            flatpickr(timeInput, {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                defaultHour: 12,
                defaultMinute: 0,
                onClose: function (selectedDates, dateStr, instance) {
                    var time = dateStr;
                    document.body.removeChild(timeWrapper);
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
                }
            });

            timeInput.focus();
        },
        eventClick: function (info) {
            var action = prompt('Enter "e" to edit or "d" to delete the event.');
            if (action === 'd') {
                info.event.remove();
                saveEvents(calendar.getEvents());
                updateEventDisplay();
            } else if (action === 'e') {
                var newTitle = prompt('Enter new title:', info.event.title);

                var timeWrapper = document.createElement('div');
                var timeLabel = document.createElement('label');
                timeLabel.textContent = 'Select Event Time:';
                var newTimeInput = document.createElement('input');
                newTimeInput.type = 'text';
                newTimeInput.id = 'timePickerEdit';
                newTimeInput.value = info.event.start.toISOString().substring(11, 16);
                timeWrapper.appendChild(timeLabel);
                timeWrapper.appendChild(newTimeInput);
                document.body.appendChild(timeWrapper);

                flatpickr(newTimeInput, {
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                    defaultHour: 12,
                    defaultMinute: 0,
                    onClose: function (selectedDates, dateStr, instance) {
                        var newTime = dateStr;
                        document.body.removeChild(timeWrapper);
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
                });

                newTimeInput.focus();
            }
        }
    });

    calendar.render();

    function saveEvents(events) {
        var eventArray = events.map(function (event) {
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
            setTimeout(function () {
                showNotification(eventData.title + ' is in one hour');
            }, oneHourBefore - new Date());

            setTimeout(function () {
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

    document.getElementById('add-weekly-event').addEventListener('click', function () {
        addRecurringEvent('weekly');
    });

    function addRecurringEvent(frequency) {
        var title = prompt('Enter Event Title:');

        var timeWrapper = document.createElement('div');
        var timeLabel = document.createElement('label');
        timeLabel.textContent = 'Select Event Time:';
        var timeInput = document.createElement('input');
        timeInput.type = 'text';
        timeInput.id = 'timePickerRecurring';
        timeWrapper.appendChild(timeLabel);
        timeWrapper.appendChild(timeInput);
        document.body.appendChild(timeWrapper);

        flatpickr(timeInput, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            defaultHour: 12,
            defaultMinute: 0,
            onClose: function (selectedDates, dateStr, instance) {
                var time = dateStr;
                document.body.removeChild(timeWrapper);
                var recurringDay;

                if (frequency === 'weekly') {
                    recurringDay = prompt('Enter day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday):');
                    recurringDay = parseInt(recurringDay);
                }

                if (title && time && recurringDay !== null) {
                    var start = new Date();
                    var end = new Date();
                    if (frequency === 'weekly') {
                        end.setMonth(end.getMonth() + 3);
                    }
                    var current = new Date(start);

                    while (current <= end) {
                        if (frequency === 'weekly' && current.getDay() === recurringDay) {
                            var eventData = {
                                title: title,
                                start: current.toISOString().split('T')[0] + 'T' + time,
                                allDay: false
                            };
                            calendar.addEvent(eventData);
                        }
                        current.setDate(current.getDate() + 1);
                    }
                    saveEvents(calendar.getEvents());
                    updateEventDisplay();
                }
            }
        });

        timeInput.focus();
    }

    function updateEventDisplay() {
        var todayEventsEl = document.getElementById('today-events');
        var tomorrowEventsEl = document.getElementById('tomorrow-events');

        var events = calendar.getEvents();
        var today = new Date().toISOString().split('T')[0];
        var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        var todayEvents = events.filter(event => event.start.toISOString().split('T')[0] === today);
        var tomorrowEvents = events.filter(event => event.start.toISOString().split('T')[0] === tomorrow);

        if (todayEventsEl) {
            todayEventsEl.innerHTML = 'Today: ' + (todayEvents.length ? todayEvents.map(e => `${e.title} at ${e.start.toISOString().substring(11, 16)}`).join('<br>') : 'No events today');
        }
        if (tomorrowEventsEl) {
            tomorrowEventsEl.innerHTML = 'Tomorrow: ' + (tomorrowEvents.length ? tomorrowEvents.map(e => `${e.title} at ${e.start.toISOString().substring(11, 16)}`).join('<br>') : 'No events tomorrow');
        }
    }

    document.getElementById('tool').addEventListener('mouseover', function () {
        document.querySelector('.tool-options').style.display = 'flex';
    });

    document.querySelector('.tool-options').addEventListener('mouseleave', function () {
        document.querySelector('.tool-options').style.display = 'none';
    });

    // Search Event
    document.getElementById('search-event').addEventListener('click', function () {
        var searchTitle = prompt('Enter the title of the event to search:');
        if (searchTitle) {
            var events = calendar.getEvents();
            var now = new Date();
            var closestEvent = null;
            var minTimeDiff = Infinity;

            events.forEach(event => {
                if (event.title === searchTitle) {
                    var timeDiff = new Date(event.start) - now;
                    if (timeDiff >= 0 && timeDiff < minTimeDiff) {
                        closestEvent = event;
                        minTimeDiff = timeDiff;
                    }
                }
            });

            if (closestEvent) {
                var eventDate = closestEvent.start;
                calendar.gotoDate(eventDate);

                var eventEls = document.querySelectorAll('.fc-event-title');
                eventEls.forEach(function (el) {
                    if (el.innerText === searchTitle) {
                        el.parentElement.style.backgroundColor = 'red';
                        setTimeout(function () {
                            el.parentElement.style.backgroundColor = '';
                        }, 2000);
                    }
                });
            } else {
                alert('No upcoming event found with that title.');
            }
        }
    });



    // Delete Event
    document.getElementById('delete-event').addEventListener('click', function () {
        var deleteTitle = prompt('Enter the title of the event to delete:');
        if (deleteTitle) {
            var events = calendar.getEvents();
            events.forEach(event => {
                if (event.title === deleteTitle) {
                    event.remove();
                }
            });
            saveEvents(calendar.getEvents());
            updateEventDisplay();
        }
    });
});
