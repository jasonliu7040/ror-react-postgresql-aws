var booking = {};

var current_state = 1,
    panel = $('.panel.wizard'),
    progress_bar = $('.progress-bar'),
    progress_wrap = $('.progress-wrap'),
    wizard_content = $('.wizard-content'),
    panels = $('ul'),
    wizard_text = $('.wizard-text'),
    prev_button = $('button.wiz-prev', panel),
    next_button = $('button.wiz-next', panel);

var PROGRESS_WIDTH = 105;

function initialize() {
    for (var i = 1; i <= steps.length; i++) {
        var step = steps[i-1];
        progress_wrap.append($('<div>', {class:"off step-" + i}).text(i));
        progress_bar.append($('<div>', {class:"label"}).html(step.title).append($('<span>').text(step.desc)));
    }

    $('div.step-1', progress_wrap).removeClass('off').addClass('selected');
    $('div.label:first', progress_bar).addClass('selected');
    $('h2', wizard_text).text(steps[0].title);
    $('.subtext', wizard_text).text(steps[0].desc);

    prev_button.button({disabled: true, icons:{primary:"ui-icon-triangle-1-w"}});
    next_button.button({disabled: true, icons:{secondary:"ui-icon-triangle-1-e"}});

    var width = $('div:last-child', progress_wrap).not('div.done').css('left');
    $('.wizard .progress-bar .pbar').css('width', width);
}
initialize();

function getDate(inst, dateText) {
    // ~20 ms faster than $(inst.input).datepicker('getDate');
    return $.datepicker.parseDate(inst.settings.dateFormat || $.datepicker._defaults.dateFormat, dateText, inst.settings );
}

function enableButton(button) {
    button.button("option", "disabled", false);
}

function disableButton(button) {
    button.button("option", "disabled", true);
}

function setButtonText(button, text) {
    button.button("option", "label", text);
}

function summary() {
    $('.dates-container').hide();
    if (booking.start) {
        $('.dates-container').show();
        $('.start-date', wizard_text).html(booking.start.toLocaleDateString());
        if (booking.finish) {
            $('.finish-date', wizard_text).html(booking.finish.toLocaleDateString());
        }
    }

    $('.product-container').hide();
    if (booking.product) {
        $('.product-container').show();
        $('.product', wizard_text).text(booking.product.product_title);
        if (booking.variant) {
            $('.option', wizard_text).text(booking.variant.title);
        }
    }
}

function changeWizardStep(page, panel) {
	if ($( '.wizard-content li.wizard-panel').length < (page - 1)) {return false;}

    var step = steps[page - 1];
	$('.wizard-content li.wizard-panel:visible', panel).fadeOut(150, function() {
        $('.label', panel).removeClass('selected');
        $('.label:eq(' + (page -1) + ')', panel).addClass('selected');
		$('.wizard-content li.wizard-panel:eq(' + (page - 1) + ')', panel).fadeIn(150);
        $('.numbering', wizard_text).text(page);
        $('h2', wizard_text).html(step.title);
        $('.subtext', wizard_text).html(step.desc);

        if (page > 1) {
            enableButton(prev_button);
        }

        setButtonText(next_button, "Next");

        switch (page) {
            case 1:
                dateStep();
                break;

            case 2:
                collectionStep();
                break;

            case 3:
                productStep();
                break;

            case 4:
                confirmStep();
                break;
        }

        summary();
	});

    return true;
}

var selectCallback = function(variant, selector) {
    booking.variant = variant;

    if (variant) { // selected a valid variant
        enableButton(next_button);
        if (variant.price < variant.compare_at_price) {
            $('.price').html(Shopify.formatMoney(variant.price, Shopify.money_format) + " <span>was " + Shopify.formatMoney(variant.compare_at_price, Shopify.money_format) + "</span>");
        } else {
            $('.price').html(Shopify.formatMoney(variant.price, Shopify.money_format));
        }
    } else {
        disableButton(next_button);
        $('.price').text(variant ? "Sold Out" : "Unavailable");
    }

    summary();
};

function dateStep() {
    disableButton(prev_button);
    setButtonText(next_button, "Show Availability");
}

function collectionStep() {
    if (!booking.product) {
        disableButton(next_button);
    }
}

function productStep() {
    $('.product-view-detail h3').text(booking.product.product_title);
    var img = $('<img>', {src:booking.product_image, class:"small-image", alt:""});
    $('.product-view-detail div.image').empty().append(img);
    $('.product-view-detail div.excerpt').html(booking.product.excerpt);
    var product_select = $('<select>', {id:'product-select', name:'id'});
    $.each(booking.product.variants, function(i, variant) {
        var option = $('<option>>', {value:variant.external_id}).text(variant.title + " - " + Shopify.formatMoney(Number(variant.price * 100), Shopify.money_format))
        product_select.append(option);
    })
    $('.variants').empty().append(product_select);

    $.getJSON("http://" + Shopify.shop + "/products/" + booking.product.product_handle + ".json?callback=?", function(json) {
        new Shopify.OptionSelectors("product-select", { product: json.product, onVariantSelected: selectCallback });
    })
}

function confirmStep() {
    var confirm = $('.confirm');
    $('.date-start', confirm).html(booking.start.toLocaleDateString());
    if (booking.finish) {
        $('.date-finish', confirm).html(booking.finish.toLocaleDateString());
    }
    $('.product', confirm).text(booking.product.product_title);
    $('.option', confirm).text(booking.variant.title);
    $('.price', confirm).text(Shopify.formatMoney(booking.variant.price, Shopify.money_format));
    setButtonText(next_button, "Book It!");
}

prev_button.click(function(){
	var state = current_state;
	
	if (current_state > 1) {state--;}
	
	if (current_state != state) {
		var nt_width = ((state - 1) * PROGRESS_WIDTH) + 'px';
		$('.pbar .done',panel).animate({'width':nt_width}, 350 ,'easeInOutExpo', function () {
			$('.pbar', panel).removeClass('ct-step-' + current_state).addClass('ct-step-' + state);
			$('.progress-wrap >.step-' + state).addClass('selected').removeClass('on');
			$('.progress-wrap >.step-' + current_state).removeClass('selected').addClass('off').removeClass('on');
			current_state = state;
		});
		
		changeWizardStep(state, panel);
	}

	return false;
});

next_button.click(function(){
	var state = current_state;
	
	if (current_state < steps.length) {state++;}
	
	if (current_state != state) {
		var nt_width = ((state - 1) * PROGRESS_WIDTH) + 'px';
		$('.pbar .done',panel).animate( {'width':nt_width}, 350, 'easeInOutExpo', function() {
			$('.pbar', panel).removeClass('ct-step-' + current_state).addClass('ct-step-' + state);
            $('.progress-wrap > .step-' + state).addClass('selected').removeClass('off');
			$('.progress-wrap > .step-' + current_state).removeClass('selected').addClass('on').removeClass('off');
			current_state = state;
		});
		
		changeWizardStep(state, panel);
	}

	return false;
});

$('a.select').click(function() {
    $('li.product.selected').removeClass('selected');
    var parent = $(this).parents('li.product').addClass('selected');
    booking.product_image = parent.find('img').attr('src');
    booking.product = products[parent.attr('data-product-id')].product;
    enableButton(next_button);
    summary();
})

$(window).load(function () {
    start = $('#booking-start').datepicker({
        minDate: 0, changeMonth: true, changeYear: true,
        defaultDate: new Date(),
        onSelect: function(dateText, inst) {
            booking.start = getDate($(this).data( "datepicker" ), dateText);
            finish.datepicker("option", "minDate", booking.start);
            summary();
            enableButton(next_button);
        }
    });

    finish = $('#booking-finish').datepicker({
        minDate: 0, changeMonth: true, changeYear: true,
        onSelect: function(dateText, inst) {
            booking.finish = getDate($(this).data( "datepicker" ), dateText);
            start.datepicker("option", "maxDate", booking.finish);
            summary();
        }
    });
});
