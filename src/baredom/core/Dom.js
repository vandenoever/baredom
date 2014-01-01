/*jslint emptyblock: true, unparam: true*/
/*global baredom*/
/**
 * Interface to an XML document.
 * @class
 * @interface
 * @extends baredom.core.ReadOnlyDom
 */
baredom.core.Dom = function () {"use strict"; };
/**
 * Set the qname of the element.
 *
 * @param {number} node
 * @param {number} qname
 */
baredom.core.Dom.prototype.setQName = function (node, qname) {"use strict"; };
/**
 * Set the text of a text node.
 *
 * @param {number} node
 * @param {string} text
 */
baredom.core.Dom.prototype.setText = function (node, text) {"use strict"; };
/**
 * Append a new element to another node and return it.
 *
 * @param {number} qname
 * @param {number} parent
 * @param {number} ref    node before which to put the new one, 0 appends at end
 * @return {number}
 */
baredom.core.Dom.prototype.insertElement = function (qname, parent, ref) {"use strict"; };
/**
 * Append a new text to another node and return it.
 *
 * @param {string} text
 * @param {number} parent
 * @param {number} ref    node before which to put the new one, 0 appends at end
 * @return {number}
 */
baredom.core.Dom.prototype.insertText = function (text, parent, ref) {"use strict"; };
/**
 * Remove node.
 *
 * @param {number} node
 */
baredom.core.Dom.prototype.removeNode = function (node) {"use strict"; };
/**
 * Move node to new position.
 *
 * @param {number} node
 * @param {number} parent
 * @param {number} ref    node before which to put the new one, 0 appends at end
 */
baredom.core.Dom.prototype.moveNode = function (node, parent, ref) {"use strict"; };
/**
 * Clone node to new position.
 *
 * @param {number} node
 * @param {number} parent
 * @param {number} ref    node before which to put the new one, 0 appends at end
 * @return {number}
 */
baredom.core.Dom.prototype.cloneNode = function (node, parent, ref) {"use strict"; };
/**
 * Set attribute.
 *
 * @param {number} node
 * @param {number} attqname qname for the attribute
 * @param {string} value
 */
baredom.core.Dom.prototype.setAttribute = function (node, attqname, value) {"use strict"; };
