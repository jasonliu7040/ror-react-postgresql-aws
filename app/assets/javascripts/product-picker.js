(function($){
    $.productVariantPicker = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("productVariantPicker", base);

        base.init = function(){
            base.options = $.extend({}, $.productVariantPicker.defaultOptions, options);
            base.$el.change(function() {
                base.lookup();
            });
            base.lookup();
        };

        base.resetVariantElement = function() {
            var variantField = base.variantElement();
            variantField.empty();
            if (base.options.promptSelect) {
                variantField.append($("<option></option>").attr("value", "").text("Select Variant..."));
            }
        };

        base.variantElement = function() {
            if (typeof(base.options.variantElement) == 'function') {
                return base.options.variantElement(base.$el);
            } else {
                return base.options.variantElement;
            }
        };

        base.lookup = function() {
            var productId = base.$el.val();
            if (productId === '') {
                base.resetVariantElement();
            } else {
                base.variantElement().attr('disabled', 'disabled');
                base.variantElement().empty();
                base.variantElement().append($("<option></option>").text("Loading Variants..."));

                $.getJSON("/chooser/variant_options", {product_id: productId}, function(data) {
                    base.resetVariantElement();
                    $.each(data.variants, function(n, variant) {
                        if (variant.hidden) {
                            // skip this deleted variant unless it was previously used
                            if (base.variantElement().attr('data_variant_id') != variant.id) return true;
                        }

                        var o = $("<option></option>")
                            .attr("value", variant.id)
                            .attr('data-external-id', variant.external_id)
                            .attr('data-metafield-config', variant.metafield_config)
                            .text(variant.title);
                        base.variantElement().append(o);
                    });
                    base.variantElement().removeAttr('disabled');
                    base.options.productSelectedCallback({id: productId, handle: data.handle, profile: data.profile, variants: data.variants});
                });
            }
        }

        // Run initializer
        base.init();
    };

    $.productVariantPicker.defaultOptions = {
        variantElement: $('.product-picker-variant'),
        productSelectedCallback: function(variants) {},
        promptSelect: true
    };

    $.fn.productVariantPicker = function(options){
        return this.each(function(){
            (new $.productVariantPicker(this, options));
        });
    };
})(jQuery);
