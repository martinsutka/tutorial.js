(function (root, factory) {
    if (typeof (define) === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } 
    else {
        // Browser globals
        root.tutorial = factory(root.jQuery);
    }
}(typeof (self) !== "undefined" ? self : this, function ($) {
    return function() {
        console.info("tutorial.js");
    };
}));