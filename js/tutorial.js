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
    //#region [ Fields ]
    
    var doc = (function () { return this; })().document;
    
    //#endregion


    //#region [ Methods : Private ]

    /**
     * Creates container element and appends it to the body.
     * 
     * @returns {HTMLElement} Container element.
     */
    function _createContainer() {
        var el = doc.createElement("div");
        el.className = "tutorial";

        doc.body.appendChild(el);

        return el;
    }

    //#endregion

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
        
        // var dfr = $.Deferred();
        // var handler = $this._onEscape.bind($this, dfr);
        var container = _createContainer();
        
        // $(doc).on("keydown", handler);

        // $this._createStep(0, t.steps, dfr, t.scope);

        // dfr.promise().then(function () {
        //     $(doc).off("keydown", handler);
        //     container.remove();
        // }); 
    }

    //#endregion

    return tutorial;
}));