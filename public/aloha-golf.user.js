// ==UserScript==
// @name        Hide BookThatApp product/variant details for additional products
// @namespace   http://www.shopifyconcierge.com/
// @include     https://*.myshopify.com/admin/*
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

// the guts of this userscript
function main() {
    // Note, jQ replaces $ to avoid conflicts.
    jQ('#order tr td:nth-child(2) span:contains("booking-product-")').each(function(){
        var span = jQ(this), text = span.text();
        span.text(text.split('|')[0]);
    })
}

// load jQuery and execute the main function
addJQuery(main);