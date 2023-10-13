// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//

//= require mousetrap
//= require mousetrap/global
//= require excanvas
//= require guiders-1.2.3
//= require h5f.min
//= require highlight.pack
//= require jquery.cookie.min
//= require jquery.datatables
//= require jquery.form-repeater
//= require jquery.idtabs
//= require jquery.jeditable
//= require jquery.jgrowl
//= require jquery.tmpl
//= require jquery.uniform.min
//= require jquery-ui-timepicker-addon
//= require keybindings
//= require nested_form
//= require option_selection
//= require product-picker
//= require reports-helper
//= require script
//= require webtoolkit.md5.compressed
//= require_self

window.jsyaml = require('js-yaml');
jQuery.ajaxSetup({
    'beforeSend': function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
//        xhr.setRequestHeader("Accept", "text/javascript")
    }
});

jQuery.fn.submitWithAjax = function(){
    this.submit(function() {
        $.jGrowl('Saving...');
        $.post(this.action, $(this).serialize(), null, "script")
            .done(function() {
                $.jGrowl('Saved');
            })
            .fail(function(xhr) {
                $.jGrowl(xhr.responseText);
            });
        return false;
    })
    return this;
};

jQuery('select:required, input:required').each(function() {
    $('label[for="' + $(this).attr('id') + '"]').addClass('required');
})

jQuery('.ui-state-default').hover(function () {
    jQuery(this).addClass('ui-state-hover');
}, function () {
    jQuery(this).removeClass('ui-state-hover');
})

$.jGrowl.defaults.position = 'top-right';
$.jGrowl.defaults.pool = 1;
$.jGrowl.defaults.openDuration = 0;
$.jGrowl.defaults.closeDuration = 0;

hljs.initHighlightingOnLoad();

$(document).on('nested:fieldRemoved', function(e){
    $(e.target).find('input[required="required"]').removeAttr('required');
});

var Util = {};

Util.log = function(obj, consoleMethod) {
    if (window.console && window.console.firebug) {
        if (typeof consoleMethod === "string" && typeof console[consoleMethod] === "function") {
            console[consoleMethod](obj);
        } else {
            console.log(obj);
        }
    }
};

$('a.ajax-delete').click(function (e) {
    e.preventDefault();

    var parent = $(this).closest('tr');

    if (!confirm($(this).attr('data-confirm'))) {
        return false;
    }

    $.ajax({
        type: 'POST',
        url: this.href,
        data: {_method: 'delete', "authenticity_token": $('meta[name="csrf-token"]').attr('content')},
        beforeSend: function () {
            parent.animate({'backgroundColor': '#fb6c6c'}, 500).find('span.ui-icon-trash').removeClass('ui-icon-trash').addClass('loading');
        },
        success: function () {
            parent.slideUp(500, function () {
                parent.remove();
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Util.log(errorThrown, "error");
        }
    });
});

$('button').button().click(function () {
    var href = this.getAttribute('data-href');

    if (href) {
        document.location.href = href;
    }
});

$('button[data-icon]').each(function (i, e) {
    var icon = e.getAttribute('data-icon');

    if (icon) {
        $(this).button("option", {
            icons: {primary: icon}
        });
    }
});

$('.button-bar input[type=submit]').click(function (e) {
    var prompt = $(this).attr('data-confirm');
    if (prompt && !confirm(prompt)) {
        e.preventDefault();
        return false;
    }
});


$('[data-tooltip!=""]').qtip({
    content: {
        attr: 'data-tooltip' // Tell qTip2 to look inside this attr for its content
    }
});

/* BTA Admin */
window.btaa = {
};

/*
Send reminder button - used on runsheet and booking form
 */
$('#send_reminders').click(function () {
    if ($(this).hasClass('disabled')) {
        return false;
    }

    $.jGrowl($(this).text().replace('Send', 'Sending'));

    var template_id = $('#reminder_template').val(),
        bookings_ids = window.btaa.reminderBookingIds();

    $.ajax({
        url: $(this).attr('href'),
        data: { reminders: { template_id: template_id, booking_ids: bookings_ids } },
        method: 'POST',
        error: function (request, textStatus, errorThrown) {
            $.jGrowl('Send Failure: ' + request.responseText);
        }
    });

    return false;
});

function initDateTimePickers(content) {
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
}
initDateTimePickers();

