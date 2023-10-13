

jQuery.ajaxSetup({
    'beforeSend': function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
//        xhr.setRequestHeader("Accept", "text/javascript")
    }
})


jQuery.fn.submitWithAjax = function(){
    this.submit(function() {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "400",
            "hideDuration": "1000",
            "timeOut": "7000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        toastr.info('Saving...');
        $.post(this.action, $(this).serialize(), null, "script")
            .done(function() {
                toastr.clear();
                toastr.success('Saved');
            })
            .fail(function(xhr) {
                toastr.clear();
                toastr.error(xhr.responseText);
            });
        return false;
    });
    return this;
};


/* BTA Admin */
var btaa = {
};

$(document).ready(function() {
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
                    toastr.success('Deleted');
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Util.log(errorThrown, "error");
                toastr.error(textStatus);
            }
        });
    });

    /*
     Send reminder button - used on runsheet and booking form
     */
    $('#send_reminders').click(function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }

        toastr.success('Sending');

        var template_id = $('#reminder_template').val(),
            bookings_ids = window.btaa.reminderBookingIds();

        $.ajax({
            url: $(this).attr('href'),
            data: { reminders: { template_id: template_id, booking_ids: bookings_ids } },
            method: 'POST'
        }).done(function (data) {
            toastr.clear();
            toastr.success(data.message);
        }).fail(function (jqXHR, textStatus) {
            var responseText = jQuery.parseJSON(jqXHR.responseText);
            toastr.clear();
            toastr.error(responseText.message);
        });

        return false;
    });

});

