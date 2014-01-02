/*jslint emptyblock: true, unparam: true*/
/*global baredom*/
/**
 * Interface to a QName dictionary.
 * This dictionary maps QNames to numbers and numbers to QNames.
 * A QName is an optional namespace with a local name. They are used for element
 * tags and attributes.
 *
 * @class
 * @interface
 */
baredom.core.QName = function () {"use strict"; };
/**
 * Get the QName number for the namespace and local-name.
 * This value is always larger than 0.
 *
 * @param {string|null} ns
 * @param {string} name
 * @return {number}
 */
baredom.core.QName.prototype.getQName = function (ns, name) {"use strict"; };
/**
 * Return the namespace for the given QName number.
 * If no QName was added to this instance, the result is undefined.
 *
 * @param {number} qname
 * @return {string}
 */
baredom.core.QName.prototype.getNamespace = function (qname) {"use strict"; };
/**
 * Return the local-name for the given QName number.
 * If no QName was added to this instance, the result is undefined.
 *
 * @param {number} qname
 * @return {string}
 */
baredom.core.QName.prototype.getLocalName = function (qname) {"use strict"; };
