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
    //#region [ Methods : Public ]

    /**
     * Starts the tutorial.
     * 
     * @param {array} steps Tutorial steps.
     * @param {object} options Options.
     */
    function tutorial(steps, options) {
        steps = steps || [];
        options = options || {};

        if(!(steps instanceof Array) || (steps.length <= 0)) {
            console.error("Unable to start empty tutorial.");
            return;
        }
    }

    //#endregion

    return tutorial;
}));