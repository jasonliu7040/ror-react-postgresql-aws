var ophours = JSON.parse($('#shop_opening_hours').val());

formatter = {
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    weekday: function(day) {
        return formatter.weekdays[day];
    },
    pad: function(n) {
        return ('0' + n).slice(-2)
    },
    ampm: function(hhmm) {
        var ampm = [],
            hour = hhmm.hour,
            minute = hhmm.minute;

        ampm.push(formatter.pad(hour > 12 ? hour - 12 : hour));
        ampm.push(':');
        ampm.push(formatter.pad(minute));
        ampm.push(hour < 12 ? ' AM' : hour == 24 ? ' AM' : ' PM');
        return ampm.join('');
    },
    handleize: function(s) {
        return s.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
    }
};

var controller = {
    dirty: false,
    init: function() {
        var seasons = ophours.seasons;
        for (var i = seasons.length - 1; i >= 0; i--) {
            if (seasons[i].id == '') {
                seasons.splice(i, 1);
            }
        }
        ophours.seasons = seasons;

        $("#seasons-template").tmpl(ophours, formatter).appendTo($('#seasons'));
        $('#enforced').attr('checked', ophours.enforced);
        $('#seasons').tabs({
            activate: function(event, ui) {
                // disable delete for the first tab so that there is always at least one season
                var btn = $("button#btn-delete");
                $('#seasons').tabs("option", "active") > 0 ? btn.button("enable") : btn.button("disable");
            }
        });
        controller.initUI();
        controller.initHandlers();
        controller.checkRanges();

        $('#hours-wrap').fadeIn();
    },
    initUI: function() {
        $('.datepicker').datepicker({
            changeYear: false,
            changeMonth: true,
            dateFormat: 'MM d',
            onSelect: function(dateText, inst) {
                controller.checkRanges();
            }
        });
        $('.datepicker').each(function() {
            var data = $(this).attr('data-date'),
                date = moment(data).toDate();
            $(this).datepicker('setDate', date);
        });

        $('button, .check').button();

        $('button.btn-create-slots').button("option", {
            icons: { primary: "ui-icon-clock" }
        });

        $('button.btn-cancel-slots').button("option", {
            icons: { primary: "ui-icon-cancel" }
        });

        $('button.btn-delete').button("option", {
            icons: { primary: "ui-icon-trash" }
        });

        $('button.btn-remove').button("option", {
            icons: { primary: "ui-icon-minus" },
            text: false
        });

        $('.dow input:gt(0):lt(5)').attr('checked', 'checked');
        //$('.dow').buttonset();

        $('select.dyno').empty().each(function() {
            var $this = $(this),
                min = $this.attr('data-min'),
                max = $this.attr('data-max'),
                defaultVal = $this.attr('data-default'),
                s = [];

            for (n = min; n < max; n++) {
                s.push('<option value="');
                s.push(n);
                s.push('">');
                s.push(formatter.pad(n));
                s.push('</option>');
            }

            $this.append(s.join(''));

            if (defaultVal) {
                $this.val(defaultVal);
            }
        })
    },
    initHandlers: function() {
        $("button#btn-add").click(function() {
            controller.addTab();  // create a new season (tab)
            return false;
        });

        $('button#btn-delete').click(function() {
            controller.deleteTab();  // delete a season (tab)
            return false;
        });

        $('button#btn-save').click(function(e) {
            if (!controller.saveOpeningHours()) {
                e.preventDefault();
                return false;
            }
        });

        $('#enforced').change(function() {
            controller.checkRanges();
        });

        // panel event handlers
        $('#seasons').on('click', '.btn-add-slots', function() {
            var activeIndex = $( "#seasons" ).tabs("option", "active"),
                seasonDiv = $("#seasons .season")[activeIndex];

            controller.toggleAddSlots($(seasonDiv).find('div.season-details'));
            return false;
        });

        $('#seasons').on('click', 'button.btn-create-slots', function() {
            var parent = $(this).parents('div.season-details'),
                panel = parent.find('.add-slots'),
                errors = parent.find('ul.add-slots-errors').empty(),
                result = controller.addSlots(parent);

            errors.parents('.row').removeClass('hidden').hide();
            if (!result.success) {
                $.each(result.errors, function(i, e) {
                    errors.append("<li>" + e + "</li>");
                })
                errors.parents('.row').show();
            } else {
                controller.toggleAddSlots(parent);
            }


            return false;
        });

        $('#seasons').on('keyup, blur', '.season-name', function(e) {
            var id = $(this).parents('div.season').attr('id');
            $('#seasons a[href*="' + id + '"]').text($(this).val());
            controller.dirty = true;
        });

        $('#seasons').on('change', '.hours', function() {
            var btn = $(this).parent().find('button.btn-remove');
            btn.button($(this).find('option:selected').length > 0 ? "enable" : "disable");
        });

        $('#seasons').on('click', 'button.btn-remove', function() {
            $(this).parent().find('select.hours option:selected').remove();
            $(this).attr('disabled', 'disabled');
            controller.dirty = true;
        });
    },
    addTab: function() {
        var count = $("div#seasons ul li").length + 1,
            defaultSeason = {
                id: 'season-' + count,
                name: 'Season ' + count,
                start: '01/01',
                finish: '12/31',
                days: [
                    {day: 0, closed: true, hours: []},
                    {day: 1, closed: true, hours: []},
                    {day: 2, closed: true, hours: []},
                    {day: 3, closed: true, hours: []},
                    {day: 4, closed: true, hours: []},
                    {day: 5, closed: true, hours: []},
                    {day: 6, closed: true, hours: []}
                ]
            };

        ophours.seasons.push(defaultSeason);

        $("div#seasons ul").append("<li><a href='#season-" + count + "'>Season " + count + "</a></li>");
        $("#season-template").tmpl(defaultSeason).appendTo($('div#seasons'));
        var tab = $("div#seasons").tabs("refresh").tabs('option', 'active', count - 1);
        tab.find('.season-name').focus();
        controller.initUI();
        controller.dirty = true;
    },
    deleteTab: function() {
        $('#dialog-confirm-delete').dialog({
            resizable: false,
            modal: true,
            buttons: {
                "Delete": function() {
                    var t = $('div#seasons'),
                        selected = t.tabs('option', 'active');

                    ophours.seasons.slice(selected, 1); // remove selected season from model

                    // update DOM
                    var tab = t.find('.ui-tabs-nav li:eq(' + selected +')').remove();
                    $( "#" + tab.attr("aria-controls")).remove();
                    t.tabs('refresh');

                    $(this).dialog("close");

                    controller.dirty = true;
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            }
        });
    },
    toggleAddSlots: function(parent) {
        parent.find('.add-slots').toggle('blind');
    },
    addSlots: function(parent) {
        var result = {success:true, slots:[], errors:[]},
            panel = parent.find('.add-slots'),
            open = parent.parent().find('.opening-hours'),
            hours = [
                [parseInt(parent.find('.add-slot-start-time select.slot-hours').val(), 10),
                    parseInt(parent.find('.add-slot-start-time select.slot-minutes').val(), 10),
                    parent.find('.add-slot-start-time select.slot-ampm').val()],
                [parseInt(parent.find('.add-slot-finish-time select.slot-hours').val(), 10),
                    parseInt(parent.find('.add-slot-finish-time select.slot-minutes').val(), 10),
                    parent.find('.add-slot-finish-time select.slot-ampm').val()]
            ];

        // get from/to hours
        for (i = 0; i < hours.length; i++) {
            // convert to 24 hour clock
            if (hours[i][0] < 12 && hours[i][2] == "PM") {
                hours[i][0] += 12;
            } else if (hours[i][0] == 12 && hours[i][2] == "AM") {
                hours[i][0] = 24;
            }

            // capture datetime for comparison purposes
            hours[i].push(controller.createDateTime(hours[i][0], hours[i][1]));
        }

        var fromDt = hours[0][3],
            toDt = hours[1][3];

        if (fromDt.getTime() == toDt.getTime()) { // open and close time the same
            result.success = false;
            result.errors.push('Time stands still for nobody. Your opening and closing times need to be different.');
            return result;
        }

        if (fromDt.getTime() > toDt.getTime()) { // close time before open time - swap
            result.success = false;
            result.errors.push('Closing time is before opening time');
            return result;
        }

        // for each selected day
        panel.find('.dow input[type="checkbox"]').each(function(day, item) {
            if ($(item).is(':checked')) {
                // track new timeslots per day
                result.slots.push({
                    day: day,
                    from: {hour: hours[0][0], minute: hours[0][1]},
                    to: {hour: hours[1][0], minute: hours[1][1]}
                });

                // find existing slots
                var slots = $.map(open.find('select.day-' + day + ' option'), function(option, ndx) {
                    var val = $(option).val().split(':'),
                        from = val[0].split('.'),
                        fromDt = controller.createDateTime(parseInt(from[0], 10), parseInt(from[1], 10)),
                        to = val[1].split('.'),
                        toDt = controller.createDateTime(parseInt(to[0], 10), parseInt(to[1], 10));

                    return {from: fromDt, to: toDt};
                });

                for (n = 0; n < slots.length; n++) {
                    var slot = slots[n],
                        from = {hour: slot.from.getHours(), minute: slot.from.getMinutes()},
                        to = {hour: slot.to.getHours(), minute: slot.to.getMinutes()};

                    // check new slots don't overlap any existing slots
                    if (fromDt.getTime() <= slot.to.getTime() && toDt.getTime() >= slot.from.getTime()) {
                        result.success = false;
                        result.errors.push('New time conflicts with existing timeslot ' + formatter.weekday(day) + ' ' + formatter.ampm(from) + ' - ' + formatter.ampm(to));
                    }
                }
            }
        });

        if (result.success) {
            for (i = 0; i < result.slots.length; i++) {
                var slot = result.slots[i];
                $("#slot-template").tmpl(slot).appendTo(open.find('select.day-' + slot.day));
            }

            controller.dirty = true;
        }

        return result;
    },
    saveOpeningHours: function() {
        var seasons = [], valid = true;
        $('#seasons .season').each(function(ndx, el) {
            var panel = $(el),
                season = {
                    name: panel.find('.season-name').val(),
                    id: formatter.handleize(panel.find('.season-name').val()),
                    start: $.datepicker.formatDate("yy-mm-dd", panel.find('input.datepicker:first').datepicker('getDate')),
                    finish: $.datepicker.formatDate("yy-mm-dd", panel.find('input.datepicker:last').datepicker('getDate')),
                    days: []
                };

            if (season.name == '') {
                alert('Season name can not be blank');
                valid = false;
                $("div#seasons").tabs("refresh").tabs('option', 'active', ndx)
                return false;
            }

            panel.find('select.hours').each(function(day, hours) {
                var day = {day: day, hours: []};
                $(hours).find('option').each(function(n, slot) {
                    var ft = $(this).val().split(':'),
                        from = ft[0].split('.'), to = ft[1].split('.');

                    var hours = {
                        from: {hour: from[0], minute: from[1]}, to: {hour: to[0], minute: to[1]}
                    };

                    day.hours.push(hours);
                });

                season.days.push(day);
            });

            seasons.push(season);
        });

        ophours.seasons = seasons;
        ophours.enforced = $('#enforced').is(':checked');

        if (valid) {
            $('#shop_opening_hours').val(JSON.stringify(ophours));
            controller.dirty = false;
        }

        return valid;
    },
    checkRanges: function() {
        var min = new Date(),
            max = new Date(),
            enforced = $('#enforced').is(':checked');

        if (!enforced) {
            $('.season-range-warning').hide();
            return;
        }

        $('.datepicker').each(function() {
            var date = $(this).datepicker('getDate');
            if ($(this).hasClass('start-date')) {
                if (min > date) min = date;
            } else {
                if (max < date) max = date;
            }
        })

        if (min.getDate() == 1 && min.getMonth() == 0 && max.getDate() == 31 && max.getMonth() == 11) {
            $('.season-range-warning').fadeOut();
        } else {
            $('.season-range-warning').fadeIn();
        }
    },
    createDateTime: function(hh, mm) {
        var date = new Date();
        date.setHours(hh);
        date.setMinutes(mm);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }
}

controller.init();

$(window).bind('beforeunload', function() {
    if (controller.dirty) {
        return 'You have unsaved changes.';
    }
});
