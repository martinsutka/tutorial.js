/*!
 * tutorial.js v1.0.0 (https://martinsutka.github.io/tutorial.js)
 * Copyright 2025 martinsutka
 */
(function (root, factory) {
    if ((typeof (define) === "function") && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } 
    else {
        // Browser globals
        root.tutorial = factory();
    }
}((typeof (self) !== "undefined") ? self : this, () => {
    //#region [ Fields ]
    
    const global = (function () { return this; })();
    const doc = global.document;
    const name = "tutorial";
    
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
            return;
        }

        el.className += " " + className;
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
            return;
        }
        
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }


    /**
     * Gets element height.
     * 
     * @param {HTMLElement} el Target element.
     */
    function _getHeight(el) {
        return parseInt(getComputedStyle(el).height);        
    }


    /**
     * Gets element width.
     * 
     * @param {HTMLElement} el Target element.
     */
    function _getWidth(el) {
        return parseInt(getComputedStyle(el).width);        
    }


    /**
     * Creates container element and appends it to the body.
     * 
     * @returns {HTMLElement} Container element.
     */
    function _createContainer() {
        const el = doc.createElement("div");
        el.className = name;

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
        const rect = el.getBoundingClientRect();
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
     * @param {object} step Current step.
     * @returns {HTMLElement} Pulse element.
     */
    function _createPulse(target, container, step) {
        const pos = _getPosition(target);
        
        // Create element
        const el = doc.createElement("div");
        el.className = `${name}__pulse`;
        el.setAttribute("data-tutorial-target", step.target);
        el.innerHTML = "<div></div><div></div><div></div><div></div>";

        // Set it's style
        el.style.width = `${pos.w}px`;
        el.style.height = `${pos.h}px`;
        el.style.top = `${pos.t}px`;
        el.style.left = `${pos.l}px`;

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
     * @param {object} step Current step.
     * @returns {HTMLElement} Pulse element.
     */    
    function _createTip(target, container, html, position, index, length, callback, step) {
        console.debug("tutorial.js : Creating tip for the step %d", index);
        const pos = _getPosition(target);

        // Create element
        const el = doc.createElement("div");
        el.className = `${name}__tip`;
        el.setAttribute("data-tutorial-target", step.target);
        el.setAttribute("data-tutorial-position", position);
        el.innerHTML = `<div class="${name}__tip-container">
                            ${html}
                            <div class="${name}__footer">
                                <span>${(index + 1)} / ${length}</span>
                                <button class="${name}__navigator">
                                    ${(index + 1) < length ? "<svg viewBox='0 0 24 24'><path fill='currentColor' d='M8,5.14V19.14L19,12.14L8,5.14Z' /></svg>" : "<svg viewBox='0 0 24 24'><path fill='currentColor' d='M18,18H6V6H18V18Z' /></svg>"}
                                </button>
                            </div>
                        </div>`;

        container.appendChild(el);

        // Attach the callback to the button
        el.querySelector(`.${name}__navigator`).addEventListener("click", callback);

        // Set the position
        switch (position) {
            case "top":
                el.style.top = `${(pos.t - _getHeight(el))}px`;
                el.style.left = `${(pos.l + (pos.w / 2))}px`;
                _addClass(el, `${name}__tip--top`);
                break;
            case "right":
                el.style.top = `${pos.t + (pos.h / 2)}px`;
                el.style.left = `${(pos.l + pos.w)}px`;
                _addClass(el, `${name}__tip--right`);
                break;
            case "bottom":
                el.style.top = `${(pos.t + pos.h)}px`;
                el.style.left = `${pos.l + (pos.w / 2)}px`;
                _addClass(el, `${name}__tip--bottom`);        
                break;
            case "left":
                el.style.top = `${pos.t + (pos.h / 2)}px`;
                el.style.left = `${(pos.l - _getWidth(el))}px`;
                _addClass(el, `${name}__tip--left`);        
                break;
        }

        // Show the tip on the screen, just after a little while
        setTimeout(() => _addClass(el, `${name}__tip--visible`), 100);

        return el;
    }


    /**
     * Scrolls the target element into the view.
     * 
     * @param {HTMLElement} element Target element.
     * @param {function} callback Callback function.
     */
    function _scrollToElement(element, callback) {
        console.debug("tutorial.js : Scrolling to element %o", element);
        element.scrollIntoView({ behavior: "instant", block: "center" });

        let lastPosition = window.scrollY;
        let sameCount = 0;

        function checkScrollStopped() {
            const current = global.scrollY;
            if (current === lastPosition) {
                sameCount++;
                
                if (sameCount > 7) {
                    setTimeout(() => callback(), 100);
                    return;
                }
            } 
            else {
                sameCount = 0;
                lastPosition = current;
            }
            requestAnimationFrame(checkScrollStopped);
        }
        requestAnimationFrame(checkScrollStopped);
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
        const step = steps[index];

        // Call the onCreate callback if specified
        if (typeof (step.onCreate) === "function") {
            step.onCreate.apply(scope, [index, step, result]);
        }

        const target = doc.querySelector(step.target);
        if(!target) {
            throw `Target for the step '${index}' was not found.`;
        }

        const html = step.html || "";
        const position = step.position || "right";
        const len = steps.length;
        const onNext = step.onNext || function(nextIndex, nextStep, r) { r(); };

        _scrollToElement(target, () => {
            console.debug("tutorial.js : Target has been scrolled into the view %o", target);
            // Create pulse element
            const pulse = _createPulse(target, scope.container, step);

            // Create tip an its promise
            let tip;
            let deferred = new Promise((resolve) => {
                tip = _createTip(target, scope.container, html, position, index, len, onNext.bind(scope, index + 1, steps[index + 1], resolve), step);
            });
            
            // Create handler for the next step creation
            const next = _createStep.bind(scope, index + 1, steps, resolve, scope);

            // When the promise is resolved go to next step
            deferred.then((r) => {
                const handler = function() {
                    tip.removeEventListener("transitionend", handler);
                    pulse.parentNode.removeChild(pulse);
                    tip.parentNode.removeChild(tip);
                    deferred = null;
                    next(r);
                };

                // It's based on the fact that the tip is displayed using transition
                tip.addEventListener("transitionend", handler); 
                _removeClass(tip, `${name}__tip--visible`);
            });
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


    /**
     * Handles the window scroll event and fixes the position of the tutorial pulse.
     */
    function _onPulseScroll() {
        const pulse = doc.querySelector(".tutorial__pulse[data-tutorial-target]");
        if (!pulse) {
            return;
        }
        const target = doc.querySelector(pulse.getAttribute("data-tutorial-target"));
        if (!target) {
            return;
        }

        const pos = _getPosition(target);
        pulse.style.width = `${pos.w}px`;
        pulse.style.height = `${pos.h}px`;
        pulse.style.top = `${pos.t}px`;
        pulse.style.left = `${pos.l}px`;
    }


    /**
     * Handles the window scroll event and fixes the position of the tutorial tip.
     */
    function _onTipScroll() {
        const tip = doc.querySelector(".tutorial__tip[data-tutorial-target]");
        if (!tip) {
            return;
        }
        const target = doc.querySelector(tip.getAttribute("data-tutorial-target"));
        if (!target) {
            return;
        }

        const pos = _getPosition(target);
        switch (tip.getAttribute("data-tutorial-position")) {
            case "top":
                tip.style.top = `${(pos.t - _getHeight(tip))}px`;
                tip.style.left = `${(pos.l + (pos.w / 2))}px`;
                break;
            case "right":
                tip.style.top = `${pos.t + (pos.h / 2)}px`;
                tip.style.left = `${(pos.l + pos.w)}px`;
                break;
            case "bottom":
                tip.style.top = `${(pos.t + pos.h)}px`;
                tip.style.left = `${pos.l + (pos.w / 2)}px`;
                break;
            case "left":
                tip.style.top = `${pos.t + (pos.h / 2)}px`;
                tip.style.left = `${(pos.l - _getWidth(tip))}px`;
                break;
        }
    }

    //#endregion


    //#region [ Constructor ]

    /**
     * Starts the tutorial.
     * 
     * @param {array} steps Tutorial steps.
     * @param {object} options Options.
     */
    const Tutorial = function(steps, options) {
        this.steps = steps || [];
        this.options = options || {};
        this.container = null;
        this.promise = null;

        this._onEscapeHandler = null;
        this._onPulseScrollHandler = null;
        this._onTipScrollHandler = null;
        
        if(!Array.isArray(this.steps) || (this.steps.length <= 0)) {
            console.error("Tutorial() : Unable to create empty tutorial.");
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
        // Create container
        this.container = _createContainer();

        // Disable events
        // this.container.addEventListener("wheel", e => e.preventDefault(), { passive: false });
        // this.container.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
        // this.container.addEventListener("mousedown", e => e.preventDefault());
        // this.container.addEventListener("mouseup", e => e.preventDefault());
        // this.container.addEventListener("click", e => e.preventDefault());

        // Disable keyboard events
        //document.body.style.overflow = 'hidden';

        // Create main promise
        this.promise = new Promise((resolve) => {
            this._onEscapeHandler = _onEscape.bind(this, resolve);
            this._onPulseScrollHandler = _onPulseScroll.bind(this);
            this._onTipScrollHandler = _onTipScroll.bind(this);

            doc.addEventListener("keydown", this._onEscapeHandler);
            global.addEventListener("scroll", this._onPulseScrollHandler);
            global.addEventListener("scroll", this._onTipScrollHandler);
            _createStep(0, this.steps, resolve, this);
        });

        // Clean things when the tutorial ends
        this.promise.then(() => {
            doc.removeEventListener("keydown", this._onEscapeHandler);
            global.removeEventListener("scroll", this._onPulseScrollHandler);
            global.removeEventListener("scroll", this._onTipScrollHandler);
            doc.body.removeChild(this.container);
        });

        return this.promise;
    };


    /**
     * Creates new intance of the Tutorial.
     * 
     * @returns {Tutorial} New tutorial.
     */
    const ctor = (...args) => new Tutorial(...args);

    //#endregion


    return ctor;
}));