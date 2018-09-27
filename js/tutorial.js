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


    //#region [ Event Handlers ]

    /**
     * Handles 'Escape' keydown event.
     * 
     * @param {function} resolve Function to resolve the main promise.
     * @param {obejt} e Event arguments.
     */
    function _onEscape(resolve, e) {
        var kc = (e.which ? e.which : e.keyCode);

        if (kc === 27) {
            resolve();
            return false;
        }

        return true;
    }

    //#endregion


    //#region [ Constructor ]

    /**
     * Starts the tutorial.
     * 
     * @param {array} steps Tutorial steps.
     * @param {object} options Options.
     */
    var Tutorial = function(steps, options) {
        this.steps = steps || [];
        this.options = options || {};
        this.container = null;
        this.promise = null;

        this._onEscapeHandler = null;

        if(!(this.steps instanceof Array) || (this.steps.length <= 0)) {
            console.error("Unable to create empty tutorial.");
            return;
        }
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Starts the tutorial.
     * 
     * @returns {Promise} Promise which is resolved when the tutorial ends.
     */
    Tutorial.prototype.start = function() {
        var $this = this;

        // Create container
        this.container = _createContainer();

        // Create main promise
        this.promise = new Promise(function(resolve) {
            $this._onEscapeHandler = _onEscape.bind($this, resolve);
            doc.addEventListener("keydown", $this._onEscapeHandler);
            // $this._createStep(0, t.steps, dfr, t.scope);
        });

        // Clean things when the tutorial ends
        this.promise.then(function() {
            doc.removeEventListener("keydown", $this._onEscapeHandler);
            doc.body.removeChild($this.container);
        });

        return this.promise;
    };


    /**
     * Creates new intance of the Tutorial.
     * 
     * @returns {Tutorial} New tutorial.
     */
    function ctor() {
        var args = Array.prototype.slice.call(arguments);
        return new Tutorial(args[0], args[1]);
    }

    //#endregion


    return ctor;
}));