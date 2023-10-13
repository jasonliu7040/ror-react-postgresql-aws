scheduler = {
    initializing: true, initialized: false,
    dtp_options: {
        controlType: 'select', pickerTimeFormat: 'hh:mm tt',
        dateFormat:'yy-mm-dd', timeFormat:'HH:mm',
        stepMinute:5,
        onSelect: function(day) {
            scheduler.update_yaml();
            $("#calendar").fullCalendar('refetchEvents');
        }
    },
    init: function() {
        $(document).ready(function() {
            window.NestedFormEvents.prototype.insertFields = function(content, assoc, link) {
                $content = $(content);
                $tr = $(link).parents('.nested-form-table').find('tbody tr:last');
                $content.find('.datetimepicker').datetimepicker(scheduler.dtp_options);
                scheduler.initDateTimePickers($content);
                return $content.insertBefore($tr);
            }
        });

        $('.color').change(function(){
            $("#calendar").fullCalendar('refetchEvents');
        });

        $('.datetimepicker').datetimepicker(scheduler.dtp_options);

        // repeating rules stuff
        var div = $('#rule-template').tmpl({type:"rrule"}).appendTo($('#recurrences'));

        scheduler.initDatetimepicker(div);

        $('#recurrences').repeater({
            btnAddClass:'rrule-btnAdd',
            btnRemoveClass:'rrule-btnRemove',
            groupClass:'rrule-group',
            animation: 'fade',
            minItems: 1,
            afterAdd: scheduler.recurrence_add,
            afterDelete: scheduler.update_yaml
        });

        $('#recurrences').on('change', '.recurrence_hour', function() {
            if ($(this).val() !== "") {
                $(this).next().val('0');
            } else {
                $(this).next().val('');
            }
        });

        $('#recurrences').on('change', '.rule_type', function() {
            $(this).parents('.form-field').find('span').text(scheduler.rule_type_prompt($(this).val()));
        });

        /*
         $('#rule-template').tmpl({type:"exrule"}).appendTo($('#exceptions'));
         $('#exceptions').repeater({
         btnAddClass:'exrule-btnAdd',
         btnRemoveClass:'exrule-btnRemove',
         groupClass:'exrule-group',
         minItems: 0,
         afterAdd: scheduler.recurrence_add,
         afterDelete: scheduler.update_yaml
         });
         */
        scheduler.sync_with_yaml();

        $('#schedule-form').on('change', 'input, select', function() {
            scheduler.update_yaml();
        });

        $('#product_schedule_yaml').change(function() {
            scheduler.sync_with_yaml();
        });

        scheduler.calendar = $('#calendar').fullCalendar({
            theme: true, timeFormat: 'HH:mm',
            header: {left: 'month,basicWeek,basicDay', center: 'title', right: 'today prev,next'},
            events: scheduler.preview,
            eventRender: function(event, element) {
                element.addClass('ui-state-active');
            }
        });

        $('#repeating').click(function() {
//            var target = $('#recurrences').closest('fieldset');
            var target = $('#recurring-schedule');
            if ($(this).is(':checked')) {
                target.fadeIn();
                //$('#finish-div').hide().find('input').val("");
            } else {
                $('#product_schedule_yaml').val('');
                target.hide();
                //$('#finish-div').fadeIn();
            }
        });

        scheduler.initializing = false;
        scheduler.initialized = true;
    },
    sync_with_yaml: function() {
            //console.log('sync_yaml');

        var config = $('#product_schedule_yaml').val(), yaml = window.jsyaml.load(config);
        if (config.length == 0) {
            return;
        }

        var startDateStr = /:start_date:.*\n/.exec(config);
        if (!startDateStr) {
            startDateStr = /:start_time:.*\n/.exec(config);
        }
        var start = startDateStr[0].substr(13).trim();

        var startDate = scheduler.parseYamlDate(start),
            duration = yaml[':duration'],
            rrules = yaml[':rrules'];

        $('#start-date').datetimepicker('setDate', startDate);

        var end = /:end_time:.*\n/.exec(config);
        if (end) {
            var finishDate = scheduler.parseYamlDate(end[0].substr(11).trim());
            $('#finish-date').datetimepicker('setDate', finishDate);
        }

        if (duration) {
            if (duration < 3600) {
                $('#duration-units').val('Minutes');
                $('#duration').val(duration/60);
            } else if (duration < 86400) {
                $('#duration-units').val('Hours');
                $('#duration').val(duration/60/60);
            } else if (duration < 12960000) {
                $('#duration-units').val('Days');
                $('#duration').val(duration/60/60/24);
            } else {
                $('#duration-units').val('Weeks');
                $('#duration').val(duration/60/60/24/7);
            }
        }

        if (rrules.length > 0) {
            $('#repeating').prop('checked', true);
            $('#recurring-schedule').show();
            $('#recurrences .rrule-group button.rrule-btnRemove').not(':first').trigger('click'); // reset
            $(rrules).each(function(rule_ndx, rule) {
                if (rule_ndx > 0) {
                    $('#add-recurrence').trigger('click');
                }
                scheduler.sync_rule(rule_ndx, rule);
            })
        }
    },
    rule_type_prompt: function(rule_type) {
        switch(rule_type) {
            case "IceCube::MinutelyRule": return "Minutes";
            case "IceCube::HourlyRule": return "Hours";
            case "IceCube::DailyRule": return "Days";
            case "IceCube::WeeklyRule": return "Weeks";
            case "IceCube::MonthlyRule": return "Months";
            case "IceCube::YearlyRule": return "Years";
        }
    },
    sync_rule: function(rule_ndx, rule) {
        $('#rrule_' + rule_ndx + '_interval').val(rule[":interval"]);
        $('#rrule_' + rule_ndx + '_rule_type').val(rule[":rule_type"]);
        $('#rrule_' + rule_ndx + '_interval_prompt').text(this.rule_type_prompt(rule[":rule_type"]));

        // until
        if (rule[":until"]) {
            var untilDate = new Date(rule[":until"].getUTCFullYear(), rule[":until"].getUTCMonth(), rule[":until"].getUTCDate(),  rule[":until"].getUTCHours(), rule[":until"].getUTCMinutes(), rule[":until"].getUTCSeconds());
            $('#rrule_' + rule_ndx + '_until').datetimepicker('setDate', untilDate);
        }

        var validation = rule[":validations"];
        if (validation) {
            // months
            $("input[name='rrule[" + rule_ndx + "][moy]']").prop('checked', false);
            $(validation[":month_of_year"]).each(function(ndx, month) {
                $("input[name='rrule[" + rule_ndx + "][moy]'][value='" + month + "']").prop('checked', true);
            });

            // days
            $("input[name='rrule[" + rule_ndx + "][dow]']").prop('checked', false);
            $(validation[":day"]).each(function(day_ndx, day) {
                $("input[name='rrule[" + rule_ndx + "][dow]'][value='" + day + "']").prop('checked', true);
            });

            // time
            if (validation[":hour_of_day"]) {
                $('#rrule_' + rule_ndx + '_hour').val(validation[":hour_of_day"][0]);
            }
            if (validation[":minute_of_hour"]) {
                $('#rrule_' + rule_ndx + '_minute').val(validation[":minute_of_hour"][0]);
            }
        }
    },
    update_yaml: function() {
        if (scheduler.initializing) return false;
        if (!$('#start-date').is(':valid')) return false;

        // console.log('update_yaml');

        var yaml = $('#product_schedule_yaml'), config = [],
            sdate = $('#start-date').val(),
            duration = scheduler.repeatingScheduleDuration();

        if (!$('#repeating').is(':checked')) {
            $("#calendar").fullCalendar('refetchEvents');
            return;
        }

        // start date
        if (sdate == '') {
            start = new Date();
        } else {
            start = moment(sdate.replace(' ','T')).toDate();
        }

        config.push([":start_date:", scheduler.makeYamlDate(start)].join(" "));

        // finish date
//        var finish = moment($('#finish-date').val().replace(' ','T')).toDate();
//        if (finish) {
//            config.push([":end_time:", scheduler.makeYamlDate(finish)].join(" "));
//        }

        // duration
        if (duration > 0) {
            config.push(":duration: " + duration);
        }

        // validations
        if (!$('#repeating').is(':checked')) {
            config.push(":rrules: []");
        } else {
            config.push(":rrules:");
            $('#recurrences .rrule-group').each(function(ndx, div) {
                config.push("- :validations:");
                var moy = $("input[name='rrule[" + ndx + "][moy]']:checked"),
                    dow = $("input[name='rrule[" + ndx + "][dow]']:checked"),
                    hour = $('#rrule_' + ndx + '_hour').val(),
                    until = $('#rrule_' + ndx + '_until').datetimepicker('getDate');

                if (moy.length > 0) {
                    config.push("    :month_of_year:");
                    config.push(moy.map(function () {
                        return "    - " + this.value;
                    }).get().join('\n'));
                }

                if (dow.length > 0) {
                    config.push("    :day:");
                    config.push(dow.map(function () {
                        return "    - " + this.value;
                    }).get().join('\n'));
                }
                if (hour && hour.length > 0) {
                    config.push("    :hour_of_day:");
                    config.push("    - " + hour);
                    config.push("    :minute_of_hour:");
                    config.push("    - " + $('#rrule_' + ndx + '_minute').val());
                }
                config.push("  :rule_type: " + $('#rrule_' + ndx + '_rule_type').val());
                config.push("  :interval: " + $('#rrule_' + ndx + '_interval').val());

                if (until) {
                    config.push(["  :until:", scheduler.makeYamlDate(until)].join(" "));
                }
            });
        }
        config.push(":exrules: []");

        yaml.val(config.join('\n'));

        $("#calendar").fullCalendar('refetchEvents');
    },
    repeatingScheduleDuration: function() {
        var val = parseInt($('#duration').val(), 10),
            units = $('#duration-units').val(),
            ordinal = "0"; // minutes

        switch(units) {
            case "Minutes": ordinal = "0"; break;
            case "Hours": ordinal = "1"; break;
            case "Days": ordinal = "2"; break;
            case "Weeks": ordinal = "3"; break;
        }

        return scheduler.calculateDuration(val, ordinal);
    },
    calculateDuration: function(val, units) {
        var duration = 0;

        if (!isNaN(val)) {
            switch(units) {
                case "0": duration = val * 60; break;
                case "1": duration = val * 60 * 60; break;
                case "2": duration = val * 60 * 60 * 24; break;
                case "3": duration = val * 60 * 60 * 24 * 7; break;
            }
        }

        return duration;
    },
    initDateTimePickers: function(content) {
        var datetimepickers = $(".datetimepickers");
        if (content) {
            datetimepickers = content.find('.datetimepickers');
        }
        datetimepickers.datetimepicker({
            controlType: 'select', pickerTimeFormat: 'hh:mm tt',
            dateFormat:'yy-mm-dd', timeFormat:'HH:mm', stepMinute:5
        });
        datetimepickers.each(function() {
            $(this).datetimepicker('setDate', $(this).val());
        });
    },
    recurrence_add: function(div) {
        div.find('button').button();
        div.find('input[name*="interval"]').val(1);
        div.find('select[name*="rule_type"]').val("IceCube::DailyRule");
        div.find('select[name*="hour"]').val(9);
        div.find('select[name*="minute"]').val(0);
        div.css('border-top', '1px dashed');
        scheduler.initDatetimepicker(div);

        scheduler.update_yaml();
    },
    preview: function(start, end, timezone, callback) {
        var oneoffDates = [];
        $('#oneoff-dates-table .datetimepicker').each(function(i, field) {
            var parent = $(field).closest('tr')[0];
            if(parent.style.display != 'none') {
                var val = $(field).val();
                if (val) {
                    oneoffDates.push(moment(val).format("YYYY-MM-DD HH:mm"));
                }
            }
        });

        var repeating = !$('#repeating').is(':checked'),
            duration = 0;

        if (oneoffDates.length > 0) {
            // get duration of first variant
            var durationValue = parseFloat($('#product_variants_attributes_0_duration').val(), 10),
                durationUnits = $('#product_variants_attributes_0_duration_units').val();

            duration = scheduler.calculateDuration(durationValue, durationUnits);
        } else {
            duration = scheduler.repeatingScheduleDuration();
        }

        $.ajax({
            url: "/availability/preview.json",
            dataType: 'json',
            data: {
                start: moment(start).format("YYYY-MM-DD"), end: moment(end).format("YYYY-MM-DD"),
                duration: duration,
                dates: oneoffDates.join(','),
                schedule: $('#product_schedule_yaml').val(),
                title: $('#product_product_title').val()
            }
        }).success(function (data) {
            $('#schedule-summary').text(data.summary);

            var colors = {},
                textColor = $('#product_text_color').val(),
                borderColor = $('#product_border_color').val(),
                backgroundColor = $('#product_background_color').val();


            if (textColor && textColor.length > 0) {
                colors.textColor = textColor;
            }

            if (borderColor && borderColor.length > 0) {
                colors.borderColor = borderColor;
            }

            if (backgroundColor && backgroundColor.length > 0) {
                colors.backgroundColor = backgroundColor;
            }

            callback($.map(data.schedule, function (item, n) {
                    var dates = {
                        start: new Date(item.start[0], item.start[1] - 1, item.start[2], item.start[3], item.start[4], item.start[5]),
                        end: new Date(item.end[0], item.end[1] - 1, item.end[2], item.end[3], item.end[4], item.end[5])
                    };

                    return $.extend($.extend(item, dates), colors);
                }
            ));

        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert('Unable to retrieve schedule');
            callback([]);
        });
    },
    initDatetimepicker: function(div) {
        div.find('.datetimepicker').removeClass("hasDatepicker").datetimepicker("destroy").datetimepicker(scheduler.dtp_options);
    },
    makeYamlDate: function(d) {
        return moment(d).format("YYYY-MM-DD HH:mm:ss") + ' Z';
    },
    parseYamlDate: function(yamlDateString) {
        var parts = yamlDateString.split(' '),
            isoDate = [parts[0], parts[1]].join('T');

        return moment(isoDate).toDate();
    }
};

// variant schedule
function updateVariantScheduleYaml(element) {
    var yaml = [],
        td = element.parents('td.hours-available'),
        scheduleElement = td.parents('tr.variant-fields').find('td:first input[name*="settings_yaml"]'),
        schedule = scheduleElement.val(),
        startDate = schedule.match(/^.*$/m)[0], // regex matches first line
        days = td.find('input[type=checkbox]:checked');

    if (days.length > 0) {
        if (startDate.length == 0) {
            startDate = ":start_date: " + new Date().toISOString();
        }
        yaml.push(startDate);

        yaml.push(":rrules:");
        yaml.push("- :validations:");
        yaml.push("    :day:");
        days.each(function(i, e) {
            yaml.push('    - '+ $(e).val());
        });

        yaml.push("  :rule_type: IceCube::WeeklyRule");
        yaml.push("  :interval: 1");
        yaml.push(":exrules: []");
    }

    scheduleElement.val(yaml.join('\n'));
}

function loadVariantSchedule() {
    $('tr.variant-fields').each(function() {
        var row = $(this),
            scheduleElement = row.find('td:first input[name*="settings_yaml"]'),
            schedule = scheduleElement.val(),
            yaml = window.jsyaml.load(schedule);

        if (schedule.length > 0 && yaml[':rrules'].length > 0) {
            row.find('.variant-dow').show();
            $.each(yaml[':rrules'][0][':validations'][':day'], function(ndx, day) {
                row.find('td.hours-available input[value="' + day + '"]').prop('checked', true)
            })
        }
    })
}
