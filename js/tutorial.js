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
     * Adds className to the element class list.
     * 
     * @param {HTMLElement} el Target element.
     * @param {string} className Css class name.
     */
    function _addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        }
        else {
            el.className += " " + className;
        }
    }


    /**
     * Removes className from the element class list.
     * 
     * @param {HTMLElement} el Target element.
     * @param {string} className Css class name.
     */
    function _removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        }
        else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }


    /**
     * Gets element height.
     * 
     * @param {HTMLElement} el Target element.
     */
    function _getHeight(el) {
        var style = getComputedStyle(el);
        return parseInt(style.height);        
    }

    /**
     * Gets element width.
     * 
     * @param {HTMLElement} el Target element.
     */
    function _getWidth(el) {
        var style = getComputedStyle(el);
        return parseInt(style.width);        
    }


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
     * Gets the element position and size.
     * 
     * @param {HTMLElement} el Target element.
     * @returns {object} Element's position and size.
     */
    function _getPosition(el) {
        var rect = el.getBoundingClientRect();
        return {
            t: rect.top + doc.body.scrollTop,
            l: rect.left + doc.body.scrollLeft,
            w: el.offsetWidth,
            h: el.offsetHeight
        };
    }


    /**
     * Creates pulse element.
     * 
     * @param {HTMLElement} target Target html element.
     * @param {HTMLElement} container Tutorial container element.
     * @returns {HTMLElement} Pulse element.
     */
    function _createPulse(target, container) {
        var pos = _getPosition(target);
        
        // Create element
        var el = doc.createElement("div");
        el.className = "tutorial__pulse";
        el.innerHTML = "<div></div><div></div><div></div><div></div>";

        // Set it's style
        el.style.width = pos.w + "px";
        el.style.height = pos.h + "px";
        el.style.top = pos.t + "px";
        el.style.left = pos.l + "px";

        container.appendChild(el);

        return el;
    }    


    /**
     * Creates tip element.
     * 
     * @param {HTMLElement} target Target html element.
     * @param {HTMLElement} container Tutorial container element.
     * @param {string} position Position of the tooltip.
     * @param {number} index Index of the current step.
     * @param {number} length Number of steps.
     * @param {function} callback Callback which initialised.
     * @returns {HTMLElement} Pulse element.
     */    
    function _createTip(target, container, html, position, index, length, callback) {
        var pos = _getPosition(target);

        // Create element
        var el = doc.createElement("div");
        el.className = "tutorial__tip";
        el.innerHTML = "<div>" +
                            html +
                            "<div class='tutorial__footer'>" +
                                "<span>" + (index + 1) + " / " + length + "</span>" +
                                "<button>" +
                                    ((index + 1) < length ? "<svg style='width:24px;height:24px' viewBox='0 0 24 24'><path fill='#fff' d='M8,5.14V19.14L19,12.14L8,5.14Z' /></svg>" : "<svg style='width:24px;height:24px' viewBox='0 0 24 24'><path fill='#fff' d='M18,18H6V6H18V18Z' /></svg>") +
                                "</button>" +                            
                            "</div>" +
                       "</div>";

        container.appendChild(el);

        // Attach the callback to the button
        el.querySelector(".tutorial__footer > button").addEventListener("click", callback);

        // Set the position
        switch (position) {
            case "top":
                el.style.top = (pos.t - _getHeight(el)) + "px";
                el.style.left = (pos.l + (pos.w / 2)) + "px";
                _addClass(el, "tutorial__tip--top");
                break;
            case "right":
                el.style.top = pos.t + (pos.h / 2) + "px";
                el.style.left = (pos.l + pos.w) + "px";
                _addClass(el, "tutorial__tip--right");
                break;
            case "bottom":
                el.style.top = (pos.t + pos.h) + "px";
                el.style.left = pos.l + (pos.w / 2) + "px";
                _addClass(el, "tutorial__tip--bottom");        
                break;
            case "left":
                el.style.top = pos.t + (pos.h / 2) + "px";
                el.style.left = (pos.l - _getWidth(el)) + "px";
                _addClass(el, "tutorial__tip--left");        
                break;
        }

        // Show the tip on the screen, just after a little while
        setTimeout(function () {
            _addClass(el, "tutorial__tip--visible");
        }, 100);

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

        // var target = $(step.target);
        var target = doc.querySelector(step.target);
        if(!target) {
            throw "Target for the step '" + index + "' was not found.";
        }
        
        var html = step.html || "";
        var position = step.position || "right";
        var len = steps.length;
        var onNext = step.onNext || function(nextStep, r) { r(); };

        // Create pulse element
        var pulse = _createPulse(target, scope.container);

        // Create tip an its promise
        var tip;
        var deferred = new Promise(function(resolve) {
            tip = _createTip(target, scope.container, html, position, index, len, onNext.bind(scope, steps[index + 1], resolve));
        });
        
        // Create handler for the next step creation
        var next = _createStep.bind(scope, index + 1, steps, resolve, scope);

        // When the promise is resolved go to next step
        deferred.then(function(r) {
            var handler = function() {
                tip.removeEventListener("transitionend", handler);
                pulse.parentNode.removeChild(pulse);
                tip.parentNode.removeChild(tip);
                deferred = null;
                next(r);
            };
            // It's based on the fact that the tip is displayed using transition
            tip.addEventListener("transitionend", handler); 
            _removeClass(tip, "tutorial__tip--visible");
        });
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