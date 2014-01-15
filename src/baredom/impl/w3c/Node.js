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
        var n, doc,
            nodeid = this.impl_nodeid;
        if (nodeid === 0) {
            n = this.impl_firstChild;
        } else {
            doc = this.ownerDocument;
            n = doc.impl_getNode(doc.impl_dom.getFirstChild(nodeid));
        }
        return n;
    },
    /**@param {baredom.impl.w3c.Node} value*/
    set firstChild(value) {
        "use strict";
        throw "";
    },
    get lastChild() {
        "use strict";
        var n, doc,
            nodeid = this.impl_nodeid;
        if (nodeid === 0) {
            n = this.impl_lastChild;
        } else {
            doc = this.ownerDocument;
            n = doc.impl_getNode(doc.impl_dom.getLastChild(nodeid));
        }
        return n;
    },
    /**@param {baredom.impl.w3c.Node} value*/
    set lastChild(value) {
        "use strict";
        throw "";
    },
    get nextSibling() {
        "use strict";
        var n, doc,
            nodeid = this.impl_nodeid;
        if (nodeid === 0) {
            n = this.impl_nextSibling;
        } else {
            doc = this.ownerDocument;
            n = doc.impl_getNode(doc.impl_dom.getNextSibling(nodeid));
        }
        return n;
    },
    /**@param {baredom.impl.w3c.Node} value*/
    set nextSibling(value) {
        "use strict";
        throw "";
    },
    get previousSibling() {
        "use strict";
        var n, doc,
            nodeid = this.impl_nodeid;
        if (nodeid === 0) {
            n = this.impl_previousSibling;
        } else {
            doc = this.ownerDocument;
            n = doc.impl_getNode(doc.impl_dom.getPreviousSibling(nodeid));
        }
        return n;
    },
    /**@param {baredom.impl.w3c.Node} value*/
    set previousSibling(value) {
        "use strict";
        throw "";
    },
    get parentNode() {
        "use strict";
        var n, doc,
            nodeid = this.impl_nodeid;
        if (nodeid === 0) {
            n = this.impl_parentNode;
        } else {
            doc = this.ownerDocument;
            n = doc.impl_getNode(doc.impl_dom.getParentNode(nodeid));
        }
        return n;
    },
    /**@param {baredom.impl.w3c.Node} value*/
    set parentNode(value) {
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
 * @type {string}
 */
baredom.impl.w3c.Node.prototype.namespaceURI;
/**
 * @type {string}
 */
baredom.impl.w3c.Node.prototype.localName;
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
/**
 * @type {baredom.impl.w3c.Node|undefined}
 */
baredom.impl.w3c.Node.prototype.impl_parentNode;
Object.freeze(baredom.impl.w3c.Node);
Object.freeze(baredom.impl.w3c.Node.prototype);