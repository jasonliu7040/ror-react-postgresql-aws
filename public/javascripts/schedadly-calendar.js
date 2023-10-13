"use strict";

var schedadly = {
    today: new Date(),
    eventIcons: {1: 'ui-icon-clock', 2: 'ui-icon-calendar', 3: 'ui-icon-flag'}
};

(function() {
    this.fetchEvents = function(start, end, timezone, callback ) {
        var state = $.extend(schedadly.currentState(), {
            start: start.format(),
            end: end.format()
        });

        delete state.date;
        delete state.view;

        $.getJSON("/events", state).error(function(/* jqXHR, textStatus, errorThrown */) {
            //console.log('Error retrieving events');
        }).success(function (data) {
            callback(schedadly.map(data.events));
        }).done(function() {
            $('#loading').hide();
        });
    };

    // convert booking to fc event
    this.map = function(events) {
        return $.map(events, function(item, n) {
            var event = $.extend(item, {
                allDay: item.all_day == 1,
                start: schedadly.convertFromDateArray(item.start),
                end: schedadly.convertFromDateArray(item.end)
            });

            if (event.all_day) {
                var adjustedEnd = new Date(event.end.getTime());
                adjustedEnd.setSeconds(event.end.getSeconds() + 1);
                event.end = adjustedEnd;
            }

            event.formattedDateRange = schedadly.formatDateRange(item);

            return event;
        })
    };

    this.convertFromDateArray = function(a) {
        return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
    };

    this.id = function(event) {
        return parseInt(event.id.substr(event.id.lastIndexOf('-') + 1),10);
    };

    this.gup = function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

        var results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(location.href);

        return results == null ? null : results[1];
    };

    this.formatDateRange = function(event) {
        var formatSpec = "YYYY-MM-DD HH:mm",
            result = [];

        if (event.allDay) {
            formatSpec = "YYYY-MM-DD";
        }

        result.push(moment(event.start).format(formatSpec));
        result.push('-');

        // if same day skip date part
        if (event.start.getYear() == event.end.getYear() &&
            event.start.getMonth() == event.end.getMonth() &&
            event.start.getDay() == event.end.getDay()) {
            result.push(moment(event.end).format("HH:mm"));
        } else {
            var adjustedEnd = new Date(event.end.getTime());
            if (event.all_day) {
                adjustedEnd.setSeconds(event.end.getSeconds() - 1);
            }
            result.push(moment(adjustedEnd).format(formatSpec));
        }

        return result.join(' ');
    };

    this.currentState = function() {
        var cal = $('#calendar');

        return {
            product: $('#filter-products').val(),
            booking: $('input[name="type[]"][value="booking"]').is(':checked'),
            blackout: $('input[name="type[]"][value="blackout"]').is(':checked'),
            date: moment(cal.fullCalendar('getDate')).format('YYYY-MM-DD'),
            view: cal.fullCalendar('getView').name
        };
    };

    this.updateState = function() {
        var state = schedadly.currentState();

        var url =  [location.protocol, '//', location.host, '/events?', $.param(state)].join('');
        if (url != location.href) {
            history.pushState(state, '', url);
        }
    };

    this.refreshEvents = function() {
        $('#loading').show();
        $('#calendar').fullCalendar('refetchEvents');
    };

    this.hideTooltip = function() {
        $('.jGrowl-close').triggerHandler('click');
    };

    this.loadState = function() {
        $('#filter-products').val(schedadly.gup('product') || '');

        $('input[name="type[]"]').each(function() {
            $(this).prop('checked', schedadly.gup(this.value) == 'true');
        });

        $('#select-month').val(schedadly.today.getMonth());

        $('#calendar').fullCalendar('changeView', schedadly.gup('view') || 'month')
    };

    this.init = function() {
        //$(".create_booking_button").button("option", {
        //    icons: { primary: "ui-icon-calendar" }
        //});
        //
        //$(".create_blackout_button").button("option", {
        //    icons: { primary: "ui-icon-flag" }
        //});

        $('#filter-products').change(function () {
            schedadly.refreshEvents();
        });

        $('#select-month').change(function () {
            var date = new Date(), month = parseInt($('#select-month').val(), 10);
            if (month < date.getMonth()) {
                date.setFullYear(date.getFullYear() + 1);
            }
            date.setMonth(month, 1);
            $('#calendar').fullCalendar('gotoDate', date);
        });

        $('input[name="type[]"]').change(function() {
            schedadly.refreshEvents();
        });

        var calendar = $('#calendar').fullCalendar({
            theme: true,
            timeFormat: 'HH:mm',
            views: {month: {eventLimit: 11, eventLimitClick: "day"}},
            defaultDate: moment(schedadly.gup('date') || schedadly.today),
            ignoreTimezone: true, // all dates are sent as utc
            header: {left: 'month,agendaWeek,agendaDay', center: 'title', right: 'today prev,next'},
            events: schedadly.fetchEvents,
            eventRender: function (event, element) {
                var iconSpan = $('<span>', {
                    class: 'ui-icon ' + schedadly.eventIcons[event.status],
                    icon: schedadly.eventIcons[event.status]
                });

                if (element.hasClass('fc-day-grid-event')) { // calendar view
                    element.find('.fc-content').prepend(iconSpan);
                } else {
                    element.find('.fc-title').prepend(iconSpan);
                }

                var template = '',
                    headline = '';

                if (event.status == 3) { // blackout
                    template = '#blackout-tooltip-template';
                    headline = 'Blackout';
                } else {
                    template = '#booking-tooltip-template';
                    headline = 'Booking';
                }

                var notification = $(template).tmpl(event);
                element.qtip({
                    content: {
                        title: headline,
                        text: notification
                    },
                    position: {
                        viewport: calendar
                    },
                    style: {
                        classes: 'qtip-blue qtip-shadow  qtip-rounded'
                    }
                });

            },
            eventMouseover: function (event /*, jsEvent, view */) {
                $(this).find('span.ui-icon').removeClass().addClass('ui-icon ui-icon-pencil');
            },
            eventMouseout: function (/* event, jsEvent, view */) {
                var icon = $(this).find('span.ui-icon');
                icon.removeClass().addClass('ui-icon ' + icon.attr('icon'));

                schedadly.hideTooltip();
            },
            eventAfterAllRender: function () {
                schedadly.updateState();
            },
            dayClick: function(date, jsEvent, view) {
                if (view.name === "month") {
                    var cal = $('#calendar');
                    cal.fullCalendar('gotoDate', date);
                    cal.fullCalendar('changeView', 'agendaDay');
                }
            }
        });

        $('.fc-toolbar').after($('#bta-fc-toolbar'));

        schedadly.loadState();

        window.onpopstate = function(/* event */) {
            schedadly.loadState();
            schedadly.refreshEvents();
        }
    };
}).apply(schedadly);
