/*jslint emptyblock: true, unparam: true*/
/*global baredom*/
/**
 * @interface
 * @extends {EventTarget}
 */
function Node() {"use strict"; }
/**
 * @type {NamedNodeMap}
 */
Node.prototype.attributes;
/**
 * @type {!NodeList}
 */
Node.prototype.childNodes;
/**
 * @type {Node?}
 */
Node.prototype.firstChild;
/**
 * @type {Node?}
 */
Node.prototype.lastChild;
/**
 * @type {Node?}
 */
Node.prototype.nextSibling;
/**
 * @type {string}
 */
Node.prototype.nodeName;
/**
 * @type {?string}
 */
Node.prototype.nodeValue;
/**
 * @type {number}
 */
Node.prototype.nodeType;
/**
 * @type {Document}
 */
Node.prototype.ownerDocument;
/**
 * @type {Node}
 */
Node.prototype.parentNode;
/**
 * @type {Node?}
 */
Node.prototype.previousSibling;
/**
 * @type {string}
 */
Node.prototype.namespaceURI;
/**
 * @type {string}
 */
Node.prototype.localName;
/**
 * @param {!Node} newChild
 * @return {!Node}
 */
Node.prototype.appendChild = function (newChild) {"use strict"; };
/**
 * @param {boolean} deep
 * @return {Node}
 */
Node.prototype.cloneNode = function (deep) {"use strict"; };
/**
 * @return {boolean}
 */
Node.prototype.hasChildNodes = function () {"use strict"; };
/**
 * @param {!Node} newChild
 * @param {?Node} refChild
 * @return {!Node}
 */
Node.prototype.insertBefore = function (newChild, refChild) {"use strict"; };
/**
 * @param {Node} oldChild
 * @return {Node}
 */
Node.prototype.removeChild = function (oldChild) {"use strict"; };
/**
 * @param {Node} newChild
 * @param {Node} oldChild
 * @return {Node}
 */
Node.prototype.replaceChild = function (newChild, oldChild) {"use strict"; };
