var datepickeroptions = {
    changeMonth: true,
    changeYear: true,
    dateFormat: "yy-mm-dd",
    beforeShow:function (input, inst) {
        $(input).addClass('openDatepicker');
    },
    onClose:function (dateText, inst) {
        $(inst.input).removeClass('openDatepicker');
    }
},
datetimepickeroptions = $.extend(datepickeroptions, {});

setDefaultFinishTime = function(startTime) {
    var elm = $('.all_day_toggle'),
        finish = elm.data('finish_element'),
        config = $('.product-picker-variant option:selected').attr('data-metafield-config');

    if (config) {
        var duration = bta.config(config, 'duration'),
            finishDate = new Date(startTime.getTime() + duration * 60000);

        finish.datepicker('setDate', finishDate);
    }
};

saveDates = function() {
    var elm = $('.all_day_toggle'),
        start = elm.data('start_element'),
        finish = elm.data('finish_element');

    elm.data('start_time', start.datepicker('getDate').getTime());
    elm.data('finish_time', finish.datepicker('getDate').getTime());
};

toggleAllDay = function(all_day_elm, all_day) {
    var start = all_day_elm.data('start_element'),
        finish = all_day_elm.data('finish_element');

    if (all_day) {
        start.datetimepicker("destroy");
        finish.datetimepicker("destroy");

        start.datepicker($.extend(datepickeroptions, {
            onSelect: function(selectedDate) {
                finish.datepicker("option", "minDate", selectedDate);
                setDefaultFinishTime(start.datepicker('getDate'));
                saveDates();
            }
        }));

        finish.datepicker($.extend(datepickeroptions, {
            onSelect: function(selectedDate) {
                start.datepicker("option", "maxDate", selectedDate);
                saveDates();
            }
        }));

        $('#ui-datepicker-div').css('clip', 'auto');
    } else {
        start.datepicker("destroy");
        finish.datepicker("destroy");

        start.datetimepicker($.extend(datetimepickeroptions, {
            onClose: function(dateText, inst) {
               $(inst.input).removeClass('openDatepicker');
               if (finish.val() != '') {
                    var testStartDate = new Date(dateText);
                    var testEndDate = new Date(finish.val());
                    if (testStartDate > testEndDate)
                        finish.val(dateText);
                } else {
                    finish.val(dateText);
                }
            },
            onSelect: function (selectedDateTime){
                var time = start.datetimepicker('getDate');
                finish.datetimepicker('option', 'minDate', new Date(time.getTime()));
                setDefaultFinishTime(time);
                saveDates();
            }
        }));

        finish.datetimepicker($.extend(datetimepickeroptions, {
            onClose: function(dateText, inst) {
                $(inst.input).removeClass('openDatepicker');
                if (start.val() != '') {
                    var testStartDate = new Date(start.val());
                    var testEndDate = new Date(dateText);
                    if (testStartDate > testEndDate)
                        start.val(dateText);
                } else {
                    start.val(dateText);
                }
            },
            onSelect: function (selectedDateTime){
                var time = $(this).datetimepicker('getDate');
                start.datetimepicker('option', 'maxDate', new Date(time.getTime()));
                saveDates();
            }
        }));
    }

    var startTime = all_day_elm.data('start_time'),
        finishTime = all_day_elm.data('finish_time');

    start.datepicker('setDate', new Date(startTime));
    finish.datepicker('setDate', new Date(finishTime));
};

$('.all_day_toggle').change(function() {
    toggleAllDay($(this), $(this).is(':checked'));
    return false;
});

var variants = $('.product-picker-variant').change(function() {
    var selected = variants.find('option:selected');
    $('.bta').attr('data-variant', selected.attr('data-external-id'));
});

$(document).ready(function() {
    var elm = $('.all_day_toggle'),
        allDay = elm.is(':checked'),
        startTime = new Date(elm.data('start_time')),
        finishTime = new Date(elm.data('finish_time')),
        offset = startTime.getTimezoneOffset()*60*1000; // (*minutes*millis)

    // fix up times to remove timezone offset - http://stackoverflow.com/questions/2771609/how-to-ignore-users-time-zone-and-force-date-use-specific-time-zone
    elm.data('start_time', new Date(startTime.getTime() + offset).getTime());
    elm.data('finish_time', new Date(finishTime.getTime() + offset).getTime());

    toggleAllDay($('.all_day_toggle'), allDay);
    $('.bta').addClass(allDay ? 'datepicker' : 'datetimepicker');
});
