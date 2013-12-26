var baredom = {
    core: {},
    impl: {}
};

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
