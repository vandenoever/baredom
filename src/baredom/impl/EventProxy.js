/*global baredom, assert, ModificationListener*/
/**
 * @constructor
 * @param {!baredom.core.Dom} dom
 */
baredom.impl.EventProxy = function (dom) {
    "use strict";
    var /**@type{!Object.<number,!Object.<string,!Array.<function(*):(boolean|undefined)>>>}*/
        handlers = {},
        /**@type{!Object.<string,number>}*/
        observedEvents = {};
    /**
     * @param {string} eventType
     */
    function increaseEventCount(eventType) {
        if (observedEvents.hasOwnProperty(eventType)) {
            observedEvents[eventType] += 1;
        } else {
            observedEvents[eventType] = 1;
        }
    }
    /**
     * @param {string} eventType
     * @param {number} amount
     */
    function reduceEventCount(eventType, amount) {
        observedEvents[eventType] -= amount;
        if (observedEvents[eventType] <= 0) {
            delete observedEvents[eventType];
        }
    }
    /**
     * @param {number} target
     * @param {string} eventType
     * @param {function(number)} handler
     */
    this.addEventListener = function (target, eventType, handler) {
        var h = handlers[target], hs, i;
        if (h === undefined) {
            h = handlers[target] = {};
        }
        hs = /**@type{!Array.<function(*):(boolean|undefined)>|undefined}*/(h[eventType]);
        if (hs === undefined) {
            hs = h[eventType] = [];
        }
        i = hs.indexOf(handler);
        if (i === -1) {
            hs.push(handler);
            increaseEventCount(eventType);
        }
    };
    /**
     * @param {number} target
     * @param {string} eventType
     * @param {function(number)} handler
     */
    this.removeEventListener = function (target, eventType, handler) {
        var h = handlers[target], hs, i;
        if (h !== undefined) {
            hs = h[eventType];
            if (hs !== undefined) {
                i = hs.indexOf(handler);
                if (i !== -1) {
                    if (hs.length === 1) {
                        delete h[eventType];
                    } else {
                        hs.splice(i, 1);
                    }
                    reduceEventCount(eventType, 1);
                }
            }
        }
    };
    /**
     * @param {number} target
     */
    this.removeEventListeners = function (target) {
        var h = handlers[target], hs,
            /**@type{string}*/
            eventType;
        if (h !== undefined) {
            for (eventType in h) {
                if (h.hasOwnProperty(eventType)) {
                    hs = h[eventType];
                    reduceEventCount(eventType, hs.length);
                }
            }
            delete handlers[target];
        }
    };
    /**
     * @param {number} target
     * @param {string} eventType
     * @param {*} event
     */
    function handleEvent(target, eventType, event) {
        var h = handlers[target], handler, i, l;
        if (h !== undefined) {
            handler = h[eventType];
            if (handler !== undefined) {
                l = handler.length;
                for (i = 0; i < l; i += 1) {
                    handler[i](event);
                }
            }
        }
    }
    /**
     * @param {number} target
     * @param {string} eventType
     * @param {*} event
     */
    this.handleEvent = function (target, eventType, event) {
        // TODO: bubble properly
        while (target !== 0) {
            handleEvent(target, eventType, event);
            target = dom.getParentNode(target);
        }
    };
    /**
     * @return {!Array.<string>}
     */
    this.getObservedEvents = function () {
        return Object.keys(observedEvents);
    };
};
