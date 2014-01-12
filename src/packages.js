/**
 * @namespace
 * @type{!Object}
 */
var baredom = {};
/**
 * @namespace
 * @type{!Object}
 */
baredom.core = {};
/**
 * @namespace
 * @type{!Object}
 */
baredom.impl = {};
/**
 * @namespace
 * @type{!Object}
 */
baredom.impl.w3c = {};

/**
 * @param {boolean} value
 * @param {string} msg
 */
function assert(value, msg) {
    "use strict";
    if (!value) {
        throw msg;
    }
}
