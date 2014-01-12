/*jslint emptyblock: true, unparam: true*/
/*global baredom*/

/**
 * @constructor
 * @implements Node
 * @param {number} nodeid
 * @param {!baredom.impl.w3c.Document} owner
 */
baredom.impl.w3c.Node = function Node(nodeid, owner) {
    "use strict";
    // set the constant values for this instance
    Object.defineProperties(this, {
        impl_nodeid: { value: nodeid },
        impl_firstChild: { writable: true},
        impl_lastChild: { writable: true},
        impl_previousSibling: { writable: true},
        impl_nextSibling: { writable: true},
        ownerDocument: { value: owner }
    });
    Object.seal(this);
};
baredom.impl.w3c.Node.prototype = {
    get firstChild() {
        "use strict";
        var doc = this.ownerDocument, childid;
        if (this.impl_firstChild === undefined) {
            childid = doc.impl_dom.getFirstChild(this.impl_nodeid);
            this.impl_firstChild = doc.impl_getNode(childid);
        }
        return this.impl_firstChild;
    },
    set firstChild(value) {
        "use strict";
        throw "";
    },
    get lastChild() {
        "use strict";
        return this.impl_lastChild;
    },
    set lastChild(value) {
        "use strict";
        throw "";
    },
    get nextSibling() {
        "use strict";
        return null;
    },
    set nextSibling(value) {
        "use strict";
        throw "";
    },
    get nodeName() {
        "use strict";
        return this.ownerDocument.impl_getText(this);
    },
    /** @param {string} value */
    set nodeName(value) {
        "use strict";
        throw "";
    },
    get nodeValue() {
        "use strict";
        return this.ownerDocument.impl_getText(this);
    },
    /** @param {string} value */
    set nodeValue(value) {
        "use strict";
        throw "";
    }
};
/**
 * @type {NamedNodeMap}
 */
baredom.impl.w3c.Node.prototype.attributes = null;
/**
 * @type {!NodeList}
 */
baredom.impl.w3c.Node.prototype.childNodes = new baredom.impl.w3c.NodeList();
if (baredom.impl.w3c.Node === undefined) {
    /**@type {string}*/
    baredom.impl.w3c.Node.prototype.nodeValue;
}
/**
 * @type {number}
 */
baredom.impl.w3c.Node.prototype.nodeType;
/**
 * @type {baredom.impl.w3c.Document}
 */
baredom.impl.w3c.Node.prototype.ownerDocument;
/**
 * @type {Node}
 */
baredom.impl.w3c.Node.prototype.parentNode;
/**
 * @type {Node?}
 */
baredom.impl.w3c.Node.prototype.previousSibling;
/**
 * @param {Node} newChild
 * @return {Node}
 */
baredom.impl.w3c.Node.prototype.appendChild = function (newChild) {"use strict"; };
/**
 * @param {boolean} deep
 * @return {Node}
 */
baredom.impl.w3c.Node.prototype.cloneNode = function (deep) {"use strict"; };
/**
 * @return {boolean}
 */
baredom.impl.w3c.Node.prototype.hasChildNodes = function () {"use strict"; };
/**
 * @param {Node} newChild
 * @param {Node?} refChild
 * @return {Node}
 */
baredom.impl.w3c.Node.prototype.insertBefore = function (newChild, refChild) {"use strict"; };
/**
 * @param {Node} oldChild
 * @return {Node}
 */
baredom.impl.w3c.Node.prototype.removeChild = function (oldChild) {"use strict"; };
/**
 * @param {Node} newChild
 * @param {Node} oldChild
 * @return {Node}
 */
baredom.impl.w3c.Node.prototype.replaceChild = function (newChild, oldChild) {"use strict"; };
/**
 * @type {number}
 */
baredom.impl.w3c.Node.prototype.impl_nodeid;
/**
 * @type {baredom.impl.w3c.Node|undefined}
 */
baredom.impl.w3c.Node.prototype.impl_firstChild;
/**
 * @type {baredom.impl.w3c.Node|undefined}
 */
baredom.impl.w3c.Node.prototype.impl_lastChild;
/**
 * @type {baredom.impl.w3c.Node|undefined}
 */
baredom.impl.w3c.Node.prototype.impl_previousSibling;
/**
 * @type {baredom.impl.w3c.Node|undefined}
 */
baredom.impl.w3c.Node.prototype.impl_nextSibling;
Object.freeze(baredom.impl.w3c.Node);
Object.freeze(baredom.impl.w3c.Node.prototype);
