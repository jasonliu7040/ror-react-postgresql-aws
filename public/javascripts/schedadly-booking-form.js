var datepickeroptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy-mm-dd",
        beforeShow: function (input, inst) {
            $(input).addClass('openDatepicker');
        },
        onClose: function (dateText, inst) {
            $(inst.input).removeClass('openDatepicker');
        }
    },
    datetimepickeroptions = $.extend(datepickeroptions, {
        controlType: 'select', pickerTimeFormat: 'hh:mm tt'
    });

addDuration = function(date, duration) {
    return new Date(date.getTime() + duration * 60000);
};

currentDuration = function(container) {
    var variantPicker = container.find('.product-picker-variant'),
        variantOption = variantPicker.find('option:selected'),
        config = variantOption.attr('data-metafield-config');

    return parseInt(bta.config(config, 'duration'), 10);
};

setDefaultFinishTime = function(container) {
    var start = container.find('.range-start'),
        startTime = start.datepicker('getDate'),
        finish = container.find('.range-finish');

    finish.datepicker('setDate', addDuration(startTime, currentDuration(container)));
};

initDate = function (str, def) {
    if (str != "") {
        return moment(str, "YYYY-MM-DD HH:mm").toDate();
    } else {
        if (def) {
            return def;
        } else {
            return moment().add(1, 'hours').startOf('hour').toDate();
        }
    }
};

installDatePicker = function(container) {
    var start = container.find('.range-start'),
        finish = container.find('.range-finish'),
        startField = $('#booking_item_builder input.hasDatepicker:first'),
        startDate = startField.datepicker('getDate'),
        finishField = $('#booking_item_builder input.hasDatepicker:last'),
        finishDate = finishField.datepicker('getDate');

    // on initialization, grab the value from the text fields since the datepicker doesn't exist yet
    if (start.datepicker('getDate') == undefined) {
        startDate = initDate(start.val());
        finishDate = initDate(finish.val(), addDuration(startDate, currentDuration(container)));
    }

    uninstallPickers(container);

    start.datepicker($.extend(datepickeroptions, {
        onSelect: function(selectedDate) {
            finish.datepicker("option", "minDate", selectedDate);
            setDefaultFinishTime(container);
        }
    }));
    start.datepicker('setDate', startDate);

    finish.datepicker($.extend(datepickeroptions, {
        onSelect: function(selectedDate) {
            start.datepicker("option", "maxDate", selectedDate);
        }
    }));
    finish.datepicker('setDate', finishDate);
};

installDatetimePicker = function(container) {
    var start = container.find('.range-start'),
        finish = container.find('.range-finish'),
        startField = $('#booking_item_builder input.hasDatepicker:first'),
        startDate = startField.datepicker('getDate'),
        finishField = $('#booking_item_builder input.hasDatepicker:last'),
        finishDate = finishField.datepicker('getDate');

    // on initialization, grab the value from the text fields since the datepicker doesn't exist yet
    if (start.datepicker('getDate') == undefined) {
        startDate = initDate(start.val());
        finishDate = initDate(finish.val(), addDuration(startDate, currentDuration(container)));
    }

    uninstallPickers(container);

    start.datetimepicker($.extend(datetimepickeroptions, {
        onSelect: function (selectedDateTime){
            var time = start.datepicker('getDate');
            finish.datepicker('option', 'minDate', new Date(time.getTime()));
            setDefaultFinishTime(container);
        }
    }));
    start.datetimepicker('setDate', startDate);

    finish.datetimepicker($.extend(datetimepickeroptions, {
        onSelect: function (selectedDateTime){
            var time = $(this).datetimepicker('getDate');
            start.datetimepicker('option', 'maxDate', new Date(time.getTime()));
        }
    }));
    finish.datetimepicker('setDate', finishDate);
};

function uninstallPickers(container) {
    container.find('.hasDatepicker').datepicker('destroy');
}

function enableResourceField(container) {
    var productOption = $('.product-picker option:selected', container),
        resourceSelect = $('.resource-picker', container),
        resourceCount = parseInt(productOption.attr('data-resource-count'), 10);

    if (resourceCount > 0) {
        resourceSelect.show();
    } else {
        resourceSelect.hide();
    }
}

function enableLocationField(container) {
    var productOption = $('.product-picker option:selected', container),
        locationSelect = $('.location-picker', container),
        locationCount = parseInt(productOption.attr('data-location-count'), 10);

    if (locationCount > 0) {
        locationSelect.show();
    } else {
        locationSelect.hide();
    }
}

function variantSelected(container) {
    var variantPicker = container.find('.product-picker-variant'),
        variantOption = variantPicker.find('option:selected'),
        start = container.find('.range-start');

    start.attr('data-variant', variantOption.attr('data-external-id'));

    if (variantOption.attr('data-all-day') == '1') {
        installDatePicker(container);
    } else {
        installDatetimePicker(container);
    }

    enableResourceField(container);
    enableLocationField(container);
}

function populateVariants(variantSelect, variants) {
    variantSelect.empty().removeAttr('disabled');

    $.each(variants, function (n, variant) {
        if (variant.hidden) {
            // skip this deleted variant unless it was previously used in this booking item
            var variantId = variantSelect.attr('data_variant_id');
            if (variantId != variant.id) return true;
        }

        var o = $("<option></option>")
            .attr("value", variant.id)
            .attr('data-external-id', variant.external_id)
            .attr('data-metafield-config', variant.metafield_config)
            .attr('data-all-day', variant.all_day)
            .text(variant.title);
        variantSelect.append(o);
    });
}

function populateResources(resourceSelect, resources) {
    resourceSelect.empty().removeAttr('disabled');

    resourceSelect.append($("<option></option>").attr("value", "").text("Resource..."));
    $.each(resources, function (n, resource) {
        var o = $("<option></option>")
            .attr("value", resource.id)
            .text(resource.name);
        resourceSelect.append(o);
    });
}

function populateLocations(locationSelect, locations) {
    locationSelect.empty().removeAttr('disabled');

    locationSelect.append($("<option></option>").attr("value", "").text("Location..."));
    $.each(locations, function (n, location) {
        var o = $("<option></option>")
            .attr("value", location.id)
            .text(location.name);
        locationSelect.append(o);
    });
}

function bindProductChangeEvent() {
    $('.product-picker').off('change'); // reset

    $('.product-picker').on('change', function() {
        var container = $(this).parents('tr.nested-fields:first'),
            productId = $(this).val(),
            variantSelect = $('#' + $(this).attr('id').replace('product_id', 'variant_id')),
            currentVariantId = variantSelect.attr('data_variant_id'),
            resourceSelect = $('.resource-picker', container),
            currentResourceId = resourceSelect.attr('data_resource_id'),
            locationSelect = $('.location-picker', container),
            currentLocationId = locationSelect.attr('data_location_id');

        if (productId == "") {
            return; // new record
        }

        variantSelect.empty().append($("<option></option>").text("Loading..."));
        resourceSelect.empty().append($("<option></option>").text("Loading..."));
        $.getJSON("/chooser/variant_options", {product_id: productId}, function(data) { // {id: productId, handle: data.handle, profile: data.profile, variants: data.variants, resources: data.resources};
            populateVariants(variantSelect, data.variants);
            populateResources(resourceSelect, data.resources);
            populateLocations(locationSelect, data.locations);

            // select the current variant & resource when /edit
            if (variantSelect.find('option[value="' + currentVariantId + '"]').length > 0) {
                variantSelect.val(currentVariantId);
            }

            if (resourceSelect.find('option[value="' + currentResourceId + '"]').length > 0) {
                resourceSelect.val(currentResourceId);
            }

            if (locationSelect.find('option[value="' + currentLocationId + '"]').length > 0) {
                locationSelect.val(currentLocationId);
            }

            // choose datepicker or datetime picker depending on if the variant is set to all day bookings
            variantSelect.on('change', function () {
                variantSelect.attr('data_variant_id', variantSelect.val());
                variantSelected(container);
            });

            // init
            variantSelected(container);
        });
    })
}

function insertResourceAllocationFields(container) {
    var template = $('#booking_item_builder tr.nested-fields:first td.ra-col'),
        productPicker = $('.product-picker', container),
        productPickerId = productPicker.attr('id'),
        productPickerName = productPicker.attr('name'),
        newCol = $('td.ra-col', container).html(template.children().clone()),
        resourceSelector = newCol.find('.resource-picker'),
        idField = newCol.find('input[type=hidden]');

    resourceSelector.empty().hide();
    resourceSelector.attr('id', productPickerId.replace('_product_id', '_resource_allocations_attributes_0_resource_id'));
    resourceSelector.attr('name', productPickerName.replace('[product_id]', '[resource_allocations_attributes][0][resource_id]'));

    idField.val('');
    idField.attr('id', productPickerId.replace('_product_id', '_resource_allocations_attributes_0_id'));
    idField.attr('name', productPickerName.replace('[product_id]', '[resource_allocations_attributes][0][id]'));
}

$('#booking_item_builder').on('cocoon:after-insert', function(e, container) {
    insertResourceAllocationFields(container);
    bindProductChangeEvent();
});

// initialize
bindProductChangeEvent();
$('.product-picker').trigger('change'); // loads variants for each booking item line
$('.ui-timepicker-div').addClass('ui-widget');