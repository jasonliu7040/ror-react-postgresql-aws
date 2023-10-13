var BookingModule = (function (config) {
    var bookingForm = null,
        products = null,
        productSelect = $('#products'),
        variantSelect = $('#variants'),
        datepicker = $('#date'),
        timepicker = $('#time');

    var _lookupProduct = function(id) {
        for (var i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                return products[i];
            }
        }
    };

    var _loadVariant = function() {
        var variantId = variantSelect.val(),
            product = _lookupProduct(productSelect.val());

        for (var i = 0; i < product.variants.length; i++) {
            if (product.variants[i].id == variantId) {
                var eid = product.variants[i].external_id;
                datepicker.attr('data-variant', eid);
                bookingForm.setSelectedVariantId(eid);
                break;
            }
        }
    }

    var _loadProduct = function (variantId) {
        var product = _lookupProduct(productSelect.val());

        datepicker.attr('data-handle', product.handle);
        datepicker.attr('data-bta-product-config', product.config);

        // find variants for this product and populate select
        variants = product.variants;

        var variantConfigs = [];
        variantSelect.empty();
        for (var n = 0; n < variants.length; n++) {
            variantSelect.append(new Option(variants[n].title, variants[n].id));
            variantConfigs.push(variants[n].config);
        }
        datepicker.attr('data-bta-variant-config', variantConfigs.join(','));

        if (variantId) {
            variantSelect.val(variantId);
        }

        _loadVariant();

        bookingForm.reset();
    };

    var _filteredProducts = function() {
        var result = [],
            filter = productSelect.attr('data-filter-profile');

        for (var i = 0; i < products.length; i++) {
            if (products[i].profile == filter) {
                result.push(products[i]);
            }
        }

        return result;
    };

    var _loadProducts = function() {
        if (productSelect.hasClass('products-loaded')) return;

        // load products
        var products = _filteredProducts();

        for (var i = 0; i < products.length; i++) {
            productSelect.append(new Option(products[i].title, products[i].id));
        }

        if (productSelect.find('option').length > 0) {
            productSelect.val(productSelect.attr('data-selected'));
            _loadProduct(variantSelect.attr('data-selected'));
        } else {
            alert('No products found that match profile filter: ' + productSelect.attr('data-filter-profile'));
        }

        productSelect.addClass('products-loaded');
    };

    var _chooseSelectedDateTime = function() {
        var selectedDate = datepicker.attr('data-selected');
        if (selectedDate) {
            var date = moment(selectedDate).toDate();
            bookingForm.setStartDate(date);
            bookingForm.selectStartDate(date);
        }

        var selectedTime = timepicker.attr('data-selected');
        if (selectedTime) {
            timepicker.val(selectedTime);
        }
    };

    var btaLoaded = function() {
        bookingForm = $('form.bta-standalone-form').data('bta.bookingForm');
        _loadProducts();
        _chooseSelectedDateTime();
    };

    var _initEventBindings = function() {
        productSelect.change(function() {
            _loadProduct();
        });

        variantSelect.change(function() {
            _loadVariant();
        });

        $('#datepicker-icon').click(function() {
            datepicker.datepicker().focus();
        });

        $('form.bta-standalone-form').on('bta.dataLoaded', function() {
            btaLoaded();
        });
    };

    var _initBtaProductIds = function() {
        var productIds = [],
            products = _filteredProducts();

        for (var i = 0; i < products.length; i++) {
            productIds.push(products[i].external_id);
        }

        bta.productId = productIds.join(',');
    }

    var init = function(config) {
        products = config.products;
        _initEventBindings();
        _initBtaProductIds();
    };

    return {
        init: init
    };
})();