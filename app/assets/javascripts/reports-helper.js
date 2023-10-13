$(document).ready(function() {
    $('.reports-runsheet .datepicker, .reports-enrollments .datepicker, .reports-gantt .datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd'
    });

    $('#start').datepicker('option', 'onSelect', function (selectedDate) {
        var start = $('#start').datepicker('getDate'), finish = $('#finish').datepicker('getDate');
        if (finish && start > finish) {
            finish.setFullYear(start.getFullYear());
            finish.setMonth(start.getMonth() + 1);
            finish.setDate(start.getDate());
            $('#finish').datepicker('setDate', finish);
        }
    });

    $('#finish').datepicker('option', 'onSelect', function (selectedDate) {
        var start = $('#start').datepicker('getDate'), finish = $('#finish').datepicker('getDate');
        if (start && start > finish) {
            start.setFullYear(finish.getFullYear());
            start.setMonth(finish.getMonth() - 1);
            start.setDate(finish.getDate());
            $('#start').datepicker('setDate', start);
        }
    });

    $('#products').productVariantPicker({
        variantElement: $('#variants')
    });

    $('#ui-datepicker-div').addClass('no-print');

    $('#order_by').change(function () {
        if ($(this).val() === 'name' || $(this).val() === 'products.product_title') {
            $('#order_type option[value="ASC"]').text('A - Z');
            $('#order_type option[value="DESC"]').text('Z - A');
        } else {
            $('#order_type option[value="ASC"]').text('Earlier First');
            $('#order_type option[value="DESC"]').text('Later First');
        }
    });

    $("#order_by").trigger('change');
});
