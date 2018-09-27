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


    /**
     * Creates pulse element.
     * 
     * @param {HTMLElement} target Target html element.
     * @param {HTMLElement} container Tutorial container element.
     * @returns {HTMLElement} Pulse element.
     */
    function _createPulse(target, container) {
        var rect = target.getBoundingClientRect();
        var t = rect.top + doc.body.scrollTop;
        var l = rect.left + doc.body.scrollLeft;
        var w = target.offsetWidth;
        var h = target.offsetHeight;
        
        // Create element
        var el = doc.createElement("div");
        el.className = "tutorial__pulse";
        el.innerHTML = "<div></div><div></div><div></div><div></div>";

        // Set it's style
        el.style.width = w + "px";
        el.style.height = h + "px";
        el.style.top = t + "px";
        el.style.left = l + "px";

        container.appendChild(el);

        return el;
    }    

    
    /**
     * Creates new step.
     * 
     * @param {number} index Index of the current tutorial step.
     * @param {array} steps Array of tutorial steps.
     * @param {function} resolve Function to resolve the main promise.
     * @param {object} scope Scope for the next callback function
     * @param {any} result Result of the previous step.
     */
    function _createStep(index, steps, resolve, scope, result) {
        // Finish with the last step
        if (index >= steps.length) {
            resolve();
            return;
        }

        // Get the current step
        var step = steps[index];

        // Call the onCreate callback if specified
        if (typeof (step.onCreate) === "function") {
            step.onCreate.apply(scope, [step, result]);
        }

        // var deferred = $.Deferred();
        // var target = $(step.target);
        var target = doc.querySelector(step.target);
        if(!target) {
            throw "Target for the step '" + index + "' was not found.";
        }
        // var pulse = $this._createPulse(target);
        var pulse = _createPulse(target, scope.container);
        // var tip = $this._createTip(target, step.html, step.position, i, steps.length, step.onNext.bind(scope, deferred));
        // var next = $this._createStep.bind(null, i + 1, steps, dfr, scope);

        // deferred.promise().then(function (r) {
        //     tip.removeClass("tutorial__tip--visible");
        //     setTimeout(function () {
        //         pulse.remove();
        //         tip.remove();
        //         next(r);
        //     }, 300);
        // });
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
            _createStep(0, $this.steps, resolve, $this);
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