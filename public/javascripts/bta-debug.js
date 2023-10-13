btaDebug = {
    template: jQuery("<div id='bta-debug'>"),

    init: function() {
        bta.debug = true;
        bta.callbacks = {'available': this.dataAvailable};

        this.createTab();
        this.initEvents();
    },

    createTab: function() {
        var form = $('form[action="/cart/add"]').data('bta.bookingForm'),
            header = jQuery("<img src='" + bta.base + "/images/bta-debug.png' alt='' />"),
            panel = jQuery("<div id='bta-debug-panel'></div>");

        if (form) {
            $('form[action="/cart/add"]').on('bta.datetimeChange', function(event, form) {
                bta.log([form.getStartDate(), form.getFinishDate(), form.getDuration()]);
            });

            var pageType = "<p><span>Page:</span> ";

            if (form.isProductPage()) {
                pageType += "Product";
            }

            if (form.isCartPage()) {
                pageType += "Cart";
            }

            pageType += "</p>";

            panel.prepend(jQuery(pageType));

            // add table for events
            panel.append(jQuery("<h4>Events</h4><table><tr><td class='loading'>Loading...</td></tr></table>"))
        } else {
            panel.prepend(jQuery("<p><span class='error'>Booking Form not found</span>: The BTA booking form was not found. This is most likely because the booking-form snippet wasn't included inside the &lt;form> element</p>"));
        }

        this.template.append(header);
        this.template.append(panel);

        $(document.body).append(this.template);
    },

    initEvents: function() {
        this.template.on('mouseenter', function() {
            $(this).stop().animate({
                'right':'0px'
            }, 200);
        }).on('mouseleave', function() {
            $(this).stop().animate({
                'right':'-534px'
            }, 200);
        });
    },

    dataAvailable: function() {
        var form = $('form[action="/cart/add"]').data('bta.bookingForm'),
            start = form.datepicker("start"),
            startDate = form.getStartDate() || new Date(),
            table = $('#bta-debug-panel table');

        table.empty();

        if (start) {
            var data = bta.cached(startDate),
                handle = start.attr('data-handle'),
                product = bta.product(data, handle),
                variant = bta.variant(product, start.attr('data-variant')),
                capacity = bta.capacity(product, variant),
                bookings = product.bookings,
                blackouts = data.blackouts;

            for (var i = 0; i < blackouts.length; i++) {
                table.append(jQuery("<tr><td class='blackout'>Blackout:</td><td>" + btaDebug.formatEvent(blackouts[i]) + "</td></tr>"));
            }

            for (var i = 0; i < bookings.length; i++) {
                table.append(jQuery("<tr><td class='booking'>Booking:</td><td>" + btaDebug.formatEvent(bookings[i]) + "</td></tr>"));
            }
        } else {
            table.append(jQuery("<tr><td>No start date input field found</td></tr>"));
        }
    },

    formatEvent: function(event) {
        var result = [];

        result.push('<td>');
        result.push(event.start.toLocaleDateString());
        result.push('</td>');

        result.push('<td>');
        result.push(event.start.toLocaleTimeString());
        result.push('</td>');

        result.push('<td>');
        result.push(' - ');
        result.push('</td>');

        result.push('<td>');
        result.push(event.end.toLocaleDateString());
        result.push('</td>');

        result.push('<td>');
        result.push(event.end.toLocaleTimeString());
        result.push('</td>');

        result.push('<td>');
        if (event.partySize) {
            result.push(event.partySize);
        }
        result.push('</td>');

        result.push('<td>');
        if (event.all_day) {
            result.push('(all day)');
        }
        result.push('</td>');

        return result.join('');
    }


}

btaDebug.init();