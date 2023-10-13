import React from 'react';
import FormSelect from '../common/form_select.js.jsx';
import FormCheckbox from '../common/form_checkbox.js.jsx';
import CalendarEvent from './calendar_event.js.jsx';
import moment from 'moment';
import { renderToString } from 'react-dom/server'

var $ = require('jquery');
require('fullcalendar');
require('fullcalendar-scheduler');

const Calendar = React.createClass({
    eventIcons: {1: 'fa-clock-o', 2: 'fa-calendar', 3: 'fa-flag'},
    componentDidUpdate(prevProps, prevState) {
        this.refreshEvents();
        if (prevProps.filter.productId != this.props.filter.productId) {
            $('#calendar').fullCalendar('refetchResources');
        }
    },
    fetchEvents: function(start, end, timezone, callback ) {
        var self = this;
        var filter = {
            product: this.props.filter.productId,
            booking: this.props.filter.bookingsSelected,
            blackout: this.props.filter.blackoutsSelected,
            start: start.format(),
            end: end.format()
        };

        window.$.getJSON("/events", filter).success(function (data) {
            callback(self.map(data.events));
        }).done(function() {
            $('#loading').hide();
        });

    },
    fetchResources: function(callback) {

        window.$.getJSON("/admin/events/resources",
            {
                product_id: this.props.filter.productId
            }
        ).success(function (data) {
            callback(data.resources);
        }).done(function() {
            $('#loading').hide();
        }).fail(function() {
            callback([]);
        })
    },
    map: function(events) {
        var self = this;
        return $.map(events, function(item, n) {
            var event = $.extend(item, {
                allDay: item.all_day == 1,
                start: self.convertFromDateArray(item.start),
                end: self.convertFromDateArray(item.end),
                resourceId: item.resource_id,
                tooltip: 'This is a cool event'
            });

            if (event.all_day) {
                var adjustedEnd = new Date(event.end.getTime());
                adjustedEnd.setSeconds(event.end.getSeconds() + 1);
                event.end = adjustedEnd;
            }

            event.formattedDateRange = self.formatDateRange(item);

            return event;
        })
    },
    convertFromDateArray: function(a) {
        return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
    },
    id: function(event) {
        return parseInt(event.id.substr(event.id.lastIndexOf('-') + 1),10);
    },
    formatDateRange: function(event) {
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
    },
    refreshEvents: function() {
        $('#loading').show();
        $('#calendar').fullCalendar('refetchEvents');
    },
    hideTooltip: function() {
        $('.jGrowl-close').triggerHandler('click');
    },
    loadState: function() {
        var product = this.gup('product') || '';
        var booking = (this.gup('booking') == 'true');
        var blackout = (this.gup('blackout') == 'true');
        var month = new Date().getMonth();
        this.props.actions.onFilterSet(product, booking, blackout, month);
    },
    gup: function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

        var results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(location.href);

        return results == null ? null : results[1];
    },
    eventRender: function(event, element) {
        var view = $('#calendar').fullCalendar('getView');

        if (view.type == 'timelineDay') {
            if (event.event_type != 'blackout') {
                $(element).find(".fc-title").text(event.name + ', email: ' + event.email);
            } else {
                $(element).find( ".fc-title" ).text(event.title);
            }
            var duration = moment.duration(event.end.diff(event.start));
            var hours = duration.asHours();
            if (hours > 8) {
                $(element).find( ".fc-title" ).append(', time: ' + event.formattedDateRange);
            }

        } else {
            $(element).find( ".fc-title" ).text(event.title);
        }

        var iconSpan = $('<i>', {
            class: 'fa ' + this.eventIcons[event.status],
            icon: this.eventIcons[event.status],
            style: 'width: 15px'
        });


        if (element.hasClass('fc-day-grid-event')) { // calendar view
            element.find('.fc-content').prepend(iconSpan);
        } else {
            element.find('.fc-title').prepend(iconSpan);
        }

    },
    updateState: function() {

        var state = {
            product: this.props.filter.productId,
            booking: this.props.filter.bookingsSelected,
            blackout: this.props.filter.blackoutsSelected,
            date: moment($('#calendar').fullCalendar('getDate')).format('YYYY-MM-DD'),
            view: $('#calendar').fullCalendar('getView').name
        };
        var url =  [location.protocol, '//', location.host, '/events?', $.param(state)].join('');
        if (url != location.href) {
            history.pushState(state, '', url);
        }
    },
    init: function() {
        var self = this;
        var calendar = $('#calendar').fullCalendar({
            timeFormat: 'HH:mm',
            aspectRatio: 1.8,
            scrollTime: '00:00',
            schedulerLicenseKey: '0420864900-fcs-1468225623',
            defaultDate: this.gup('date') || new Date(),
            views: {
                month: { eventLimit: 11, eventLimitClick: "day" },
                timelineDay: {
                    type: 'agenda',
                    duration: { days: 1 },
                    buttonText: 'Schedule'
                }
            },
            ignoreTimezone: true, // all dates are sent as utc
            header: {
                left: 'today prev,next',
                center: 'title',
                right: 'timelineDay,agendaWeek,month'
            },
            defaultView:  this.gup('view') || 'timelineDay',
            events: this.fetchEvents,
            resourceGroupField: 'location',
            resourceLabelText: 'Products',
            resources: this.fetchResources,
            eventRender: this.eventRender,
            eventMouseover: function (calEvent, jsEvent, view) {
                $(this).find('i.fa').removeClass().addClass('fa fa-pencil');

                if (view.name != "timelineDay") {
                    var tooltip = renderToString(<CalendarEvent event={calEvent}/>);
                    $("body").append(tooltip);
                    $(this).mouseover(function (e) {
                        $(this).css('z-index', 10000);
                        $('.tooltipevent').fadeIn('500');
                        $('.tooltipevent').fadeTo('10', 1.9);
                    }).mousemove(function (e) {
                        $('.tooltipevent').css('top', e.pageY + 10);
                        $('.tooltipevent').css('left', e.pageX + 20);
                    });
                }

            },
            eventMouseout: function (/* event, jsEvent, view */) {
                var icon = $(this).find('i.fa');
                icon.removeClass().addClass('fa ' + icon.attr('icon'));
                $(this).css('z-index', 8);
                $('.tooltipevent').remove();
            },
            dayClick: function(date, jsEvent, view) {
                if (view.name === "month") {
                    var cal = $('#calendar');
                    cal.fullCalendar('gotoDate', date);
                    cal.fullCalendar('changeView', 'timelineDay');
                }
            },
            eventAfterAllRender: function () {
                self.updateState();
            }

        });

        this.loadState();

        window.onpopstate = function(/* event */) {
            $('#calendar').fullCalendar('gotoDate', self.gup('date') || new Date());
            $('#calendar').fullCalendar('changeView', self.gup('view') || 'timelineDay');

            self.loadState();
        }

    },
    onProductChange: function(value) {
        this.props.actions.onProductFilterSet(value);
    },
    onBookingSelect: function(value) {
        this.props.actions.onBookingsFilterSet(value);
    },
    onBlackoutSelect: function(value) {
        this.props.actions.onBlackoutsFilterSet(value);
    },
    onMonthChange: function(value) {
        this.props.actions.onMonthFilterSet(value);
        var date = new Date();
        if (value < date.getMonth()) {
            date.setFullYear(date.getFullYear() + 1);
        }
        date.setMonth(value, 1);
        $('#calendar').fullCalendar('gotoDate', date);
    },
    getProducts: function() {
        return this.props.products.map(function(product) {
            return [product.product_title, product.id];
        })
    },
    getMonths: function() {
        return [['January', 0],
            ['February', 1],
            ['March', 2],
            ['April', 3],
            ['May', 4],
            ['June', 5],
            ['July', 6],
            ['August', 7],
            ['September', 8],
            ['October', 9],
            ['November', 10],
            ['December', 11]];
    },
    componentDidMount() {
        this.init();
    },
    render: function() {
        var products = this.getProducts();
        var months = this.getMonths();
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="form-inline">
                            <div className='form-group'>
                                <label className='m-r-sm'>Product: </label>
                                <FormSelect name='product'
                                    value={this.props.filter.productId.toString()}
                                    options={products}
                                    includeBlank={true}
                                    onChange={this.onProductChange} />
                                <label className='m-l-lg'>
                                    <FormCheckbox name='isBookingsSelected'
                                        value={this.props.filter.bookingsSelected}
                                        onChange={this.onBookingSelect} />
                                    <span className="m-l-sm">Bookings</span>
                                </label>
                                <label className='m-l-lg'>
                                    <FormCheckbox name='isBlackoutsSelected'
                                        value={this.props.filter.blackoutsSelected}
                                        onChange={this.onBlackoutSelect} />
                                    <span className="m-l-sm">Blackouts</span>
                                </label>
                            </div>
                            <div className='form-group pull-right'>
                                <label className='m-r-sm'>Jump to: </label>
                                <FormSelect name='month'
                                    value={this.props.filter.month}
                                    options={months}
                                    onChange={this.onMonthChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div id="calendar"></div>
        </div>
        );
    }
});

export default Calendar;