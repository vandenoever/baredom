/*jslint emptyblock: true, unparam: true*/
/*global baredom*/
/**
 * Read-only interface to an XML document.
 * @class
 * @interface
 */
baredom.core.ReadOnlyDom = function () {"use strict"; };
/**
 * @return {number}
 */
baredom.core.ReadOnlyDom.prototype.getDocumentElement = function () {"use strict"; };
/**
 * @return {!baredom.core.QName}
 */
baredom.core.ReadOnlyDom.prototype.getQNames = function () {"use strict"; };
/**
 * Get the text of the node.
 * If the element is not a text node, null is returned.
 *
 * @param {number} node
 * @return {string|undefined}
 */
baredom.core.ReadOnlyDom.prototype.getText = function (node) {"use strict"; };
/**
 * Get the QName of node.
 * If the node does not exist, 0 is returned.
 *
 * @param {number} node
 * @return {number}
 */
baredom.core.ReadOnlyDom.prototype.getQName = function (node) {"use strict"; };
/**
 * Get the number of attributes of node.
 * If the node does not exist, 0 is returned.
 *
 * @param {number} node
 * @return {number}
 */
baredom.core.ReadOnlyDom.prototype.getAttributeCount = function (node) {"use strict"; };
/**
 * Get the QName for a particular attribute.
 * If the node or the attribute does not exist, 0 is returned.
 *
 * @param {number} node
 * @param {number} attr
 * @return {number}
 */
baredom.core.ReadOnlyDom.prototype.getAttributeQName = function (node, attr) {"use strict"; };
/**
 * Get the value of a particular attribute.
 *
 * @param {number} node
 * @param {number} attr
 * @return {string}
 */
baredom.core.ReadOnlyDom.prototype.getAttributeValue = function (node, attr) {"use strict"; };
/**
 * Get the value of a particular attribute.
 * If there is no attribute for the given QName, undefined is returned.
 *
 * @param {number} node
 * @param {number} attrQName
 * @return {string|undefined}
 */
baredom.core.ReadOnlyDom.prototype.getAttribute = function (node, attrQName) {"use strict"; };
/**
 * Get the number of children of node.
 * If the node does not exist, 0 is returned.
 *
 * @param {number} node
 * @return {number}
 */
baredom.core.ReadOnlyDom.prototype.getChildCount = function (node) {"use strict"; };
/**
 * Get the parent node.
 * If the node does not exist or is the document element, 0 is returned.
 *
 * @param {number} node
 * @return {number}
 */
baredom.core.ReadOnlyDom.prototype.getParentNode = function (node) {"use strict"; };
/**
 * Get the previous sibling.
 * If the node does not exist, 0 is returned.
 *
 * @param {number} node
 * @return {number}
 */
baredom.core.ReadOnlyDom.prototype.getPreviousSibling = function (node) {"use strict"; };
/**
 * Get the next sibling.
 * If the node does not exist, 0 is returned.
 *
 * @param {number} node
 * @return {number}
 */
baredom.core.ReadOnlyDom.prototype.getNextSibling = function (node) {"use strict"; };
/**
 * Get the first child
 * If the node does not exist, 0 is returned.
 *
 * @param {number} node
 * @return {number}
 */
baredom.core.ReadOnlyDom.prototype.getFirstChild = function (node) {"use strict"; };
/**
 * Get the last child
 * If the node does not exist, 0 is returned.
 *
 * @param {number} node
 * @return {number}
 */
baredom.core.ReadOnlyDom.prototype.getLastChild = function (node) {"use strict"; };
/**
 * Get the version number of the node.
 * TODO: specify what make the version change.
 * If the node does not exist, 0 is returned.
 *
 * @param {number} node
 * @return {number}
 */
baredom.core.ReadOnlyDom.prototype.getVersion = function (node) {"use strict"; };
