/*jslint emptyblock: true, unparam: true*/
/*global baredom*/

/**
 * @constructor
 * @implements Node
 * @param {number} nodeid
 * @param {number} nodeType
 * @param {!baredom.impl.w3c.Document} owner
 * @param {?string} namespaceURI
 * @param {?string} localName
 */
baredom.impl.w3c.Node = function Node(nodeid, nodeType, owner, namespaceURI, localName) {
    "use strict";
    // set the constant values for this instance
    Object.defineProperties(this, {
        impl_nodeid: { value: nodeid, writable: true },
        impl_firstChild: { writable: true},
        impl_lastChild: { writable: true},
        impl_previousSibling: { writable: true},
        impl_nextSibling: { writable: true},
        impl_parentNode: { writable: true},
        impl_nodeValue: { writable: true},
        nodeType: { value: nodeType},
        ownerDocument: { value: owner },
        namespaceURI: { value: namespaceURI},
        localName: { value: localName}
    });
    Object_seal(this);
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
console.log("parentNode " + nodeid);
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
        return "";
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
        return this.ownerDocument.impl_setText(this, value);
    },
    get data() {
        "use strict";
        return this.ownerDocument.impl_getText(this);
    },
    /** @param {string} value */
    set data(value) {
        "use strict";
        return this.ownerDocument.impl_setText(this, value);
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
 * @param {!Node} newChild
 * @return {!Node}
 */
baredom.impl.w3c.Node.prototype.appendChild = function (newChild) {
    "use strict";
    this.insertBefore(newChild, null);
    return newChild;
};
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
 * @param {!Node} newChild
 * @param {?Node} refChild
 * @return {!Node}
 */
baredom.impl.w3c.Node.prototype.insertBefore = function (newChild, refChild) {
    "use strict";
    if (!this.impl_nodeid) {
        throw "TODO";
    }
    var implRef = /**@type{?baredom.impl.w3c.Node}*/(refChild),
        child = /**@type{?baredom.impl.w3c.Node}*/(newChild),
        doc = this.ownerDocument,
        dom = doc.impl_dom,
        childid = child.impl_nodeid,
        /**@type{number}*/
        ref = refChild ? implRef.impl_nodeid : 0,
        qname;
    if (childid !== 0) {
        dom.moveNode(childid, this.impl_nodeid, ref);
    } else if (child.nodeType === 1) {
        qname = dom.getQNames().getQName(child.namespaceURI, child.localName);
        childid = dom.insertElement(qname, this.impl_nodeid, ref);
    } else {
        childid = dom.insertText(/**@type{string}*/(child.impl_nodeValue),
                this.impl_nodeid, ref);
    }
    child.impl_nodeid = childid;
    doc.impl_idToNodeMap[childid] = child;
    return child;
};
/**
 * @param {Node} oldChild
 * @return {Node}
 */
baredom.impl.w3c.Node.prototype.removeChild = function (oldChild) {
    "use strict";
    var dom = this.ownerDocument.impl_dom,
        child = /**@type{?baredom.impl.w3c.Node}*/(oldChild);
    dom.removeNode(child.impl_nodeid);
    return oldChild;
};
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
/**
 * @type {?string}
 */
baredom.impl.w3c.Node.prototype.impl_nodeValue;
Object_freeze(baredom.impl.w3c.Node);
Object_freeze(baredom.impl.w3c.Node.prototype);
