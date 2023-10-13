(function($){
    if(!$.conciergify){
        $.conciergify = new Object();
    };
    
    $.conciergify.productChooser = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("conciergify.productChooser", base);
        
        base.init = function(){
            base.options = $.extend({}, $.conciergify.productChooser.defaultOptions, options);

            $('#product_chooser').on({
                click: function() {
                    if (!$(this).hasClass('ui-state-disabled')) {
                        base.selectCallback($(this).attr('data-product-id'));
                    }
                },
                mouseenter: function () {
                    $(this).removeClass('ui-state-default').addClass('ui-state-hover');
                },
                mouseleave: function () {
                    $(this).removeClass('ui-state-hover').addClass('ui-state-default');
                }
            }, "a.product-chooser-href");

			$.get(base.options.url, {page: 1}, function(data) {
                try {
                    base.$el.html(data);
                    base.options.loaded(true);
                } catch(e) {
                    alert(e.message)
                }
			})
        };
        
        base.selectCallback = function(product){
			base.options.selected(product);
        };
        
        // Run initializer
        base.init();
    };
    
    $.conciergify.productChooser.defaultOptions = {
		loaded: function() {},
		selected: function() {},
		url: '/chooser/products'
    };
    
    $.fn.productChooser = function(options){
        return this.each(function(){
            (new $.conciergify.productChooser(this, options));
        });
    };
    
    // This function breaks the chain, but returns
    // the conciergify.productChooser if it has been attached to the object.
    $.fn.getProductChooser = function(){
        this.data("conciergify.productChooser");
    };
    
})(jQuery);
