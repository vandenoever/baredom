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
/**
 * @param {!Object} obj
 */
function Object_freeze(obj) {
    "use strict";
    // freezing is nice for debugging, but slows down the code
//    Object.freeze(obj);
}
/**
 * @param {!Object} obj
 */
function Object_seal(obj) {
    "use strict";
    // sealing is nice for debugging, but slows down the code
//    Object.seal(obj);
}
