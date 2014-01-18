/*jslint emptyblock: true, unparam: true*/
/*global baredom, console*/

/**
 * @constructor
 * @implements Element
 * @extends baredom.impl.w3c.Node
 * @param {number} nodeid
 * @param {!baredom.impl.w3c.Document} owner
 * @param {string} namespaceURI
 * @param {string} localName
 */
baredom.impl.w3c.Element = function Element(nodeid, owner, namespaceURI, localName) {
    "use strict";
    baredom.impl.w3c.Node.call(this, nodeid, 1, owner, namespaceURI, localName);
    Object.seal(this);
};
baredom.impl.w3c.Element.prototype = Object.create(baredom.impl.w3c.Node.prototype, {
});
/**
 * @param {!Attr} attr
 * @return {!Attr}
 */
baredom.impl.w3c.Element.prototype.removeAttributeNode = function (attr) {"use strict"; };
/**
 * @param {string} namespaceURI
 * @param {string} qualifiedName
 * @param {string} value
 * @return {undefined}
 */
baredom.impl.w3c.Element.prototype.setAttributeNS = function (namespaceURI, qualifiedName, value) {"use strict"; };
/**
 * @param {string} type
 * @param {function(Event):(boolean|undefined)} listener
 * @param {boolean=} useCapture
 */
baredom.impl.w3c.Element.prototype.addEventListener = function (type, listener, useCapture) {"use strict"; };
Object.freeze(baredom.impl.w3c.Element);
Object.freeze(baredom.impl.w3c.Element.prototype);
