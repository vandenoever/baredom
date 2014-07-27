/*jslint emptyblock: true, unparam: true*/
/*global baredom*/
/**
 * @class
 * @interface
 */
baredom.core.StringStore = function () {"use strict"; };
/**
 * Register a new string. Each string gets an id that is larger than 0.
 * @param {string} string
 * @return {number}
 */
baredom.core.StringStore.prototype.addString = function (string) {"use strict"; };
/**
 * Register another copy of an already registered string.
 * @param {number} stringId
 */
baredom.core.StringStore.prototype.addStringId = function (stringId) {"use strict"; };
/**
 * Convenience function to remove a string instance and add a new one.
 * This returns a new id for the new string.
 * The code is equivalent to
 *   store.removeString(stringId);
 *   stringId = store.addString(string);
 *
 * @param {number} stringId
 * @param {string} string
 * @return {number}
 */
baredom.core.StringStore.prototype.updateString = function (stringId, string) {"use strict"; };
/**
 * @param {number} stringId
 */
baredom.core.StringStore.prototype.removeString = function (stringId) {"use strict"; };
/**
 * @param {number} stringId
 * @return {string}
 */
baredom.core.StringStore.prototype.getString = function (stringId) {"use strict"; };
