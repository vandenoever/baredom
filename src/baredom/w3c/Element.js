/*jslint emptyblock: true, unparam: true*/
/*global baredom*/
/**
 * @interface
 * @extends {Node}
 */
function Element() {"use strict"; }
/**
 * @param {!Attr} attr
 * @return {!Attr}
 */
Element.prototype.removeAttributeNode = function (attr) {"use strict"; };
/**
 * @param {string} namespaceURI
 * @param {string} qualifiedName
 * @param {string} value
 * @return {undefined}
 */
Element.prototype.setAttributeNS = function (namespaceURI, qualifiedName, value) {"use strict"; };
/**
 * @param {string} type
 * @param {function(Event):(boolean|undefined)} listener
 * @param {boolean=} useCapture
 */
Element.prototype.addEventListener = function (type, listener, useCapture) {"use strict"; };
