/*jslint emptyblock: true, unparam: true*/
/*global baredom, ModificationListener, assert*/

/**
 * @constructor
 * @implements Document
 * @implements ModificationListener
 * @extends baredom.impl.w3c.Node
 * @param {!baredom.core.ObservableDom} dom
 */
baredom.impl.w3c.Document = function Document(dom) {
    "use strict";
    this.impl_dom = dom;
    var documentElement = dom.getDocumentElement(),
        qnames = dom.getQNames(),
        qname = dom.getQName(documentElement);
    dom.addModificationListener(this);
    this.documentElement = new baredom.impl.w3c.Element(documentElement, this,
            qnames.getNamespace(qname), qnames.getLocalName(qname));
    this.impl_idToNodeMap[documentElement] = this.documentElement;
};
baredom.impl.w3c.Document.prototype = Object.create(baredom.impl.w3c.Node.prototype, {
    doctype: {
        value: null
    }
});
/**@type{DocumentType}*/
baredom.impl.w3c.Document.prototype.doctype;
/**@type{Element}*/
baredom.impl.w3c.Document.prototype.documentElement;
/**
 * Map that points from node id to Nodes that are present in the document.
 * @type{!Object.<number,!baredom.impl.w3c.Node>}
 */
baredom.impl.w3c.Document.prototype.impl_idToNodeMap = {};
/**@type{DOMImplementation}*/
baredom.impl.w3c.Document.prototype.implementation;
baredom.impl.w3c.Document.prototype.createAttribute = function (name) {
    "use strict";
    return new baredom.impl.w3c.Attr(this, "", name);
};
baredom.impl.w3c.Document.prototype.createCDATASection = function (name) {
    "use strict";
    throw "TODO";
};
baredom.impl.w3c.Document.prototype.createComment = function (name) {
    "use strict";
    throw "TODO";
};
baredom.impl.w3c.Document.prototype.createDocumentFragment = function () {
    "use strict";
    throw "TODO";
};
baredom.impl.w3c.Document.prototype.createElement = function (name) {
    "use strict";
    throw "TODO";
};
baredom.impl.w3c.Document.prototype.createElementNS = function (namespaceURI, qualifiedName) {
    "use strict";
    var n = new baredom.impl.w3c.Element(0, this, namespaceURI, qualifiedName);
    return n;
};
baredom.impl.w3c.Document.prototype.createEntityReference = function (name) {
    "use strict";
    throw "TODO";
};
baredom.impl.w3c.Document.prototype.createProcessingInstruction = function (name) {
    "use strict";
    throw "TODO";
};
/**
 * @param {string} text
 * @return {!baredom.impl.w3c.Text}
 */
baredom.impl.w3c.Document.prototype.createTextNode = function (text) {
    "use strict";
    var n = new baredom.impl.w3c.Text(0, this);
    n.impl_nodeValue = text;
    return n;
};
baredom.impl.w3c.Document.prototype.getElementsByTagName = function (name) {
    "use strict";
    throw "TODO";
};
/**
 * @param {!baredom.core.Dom} dom
 * @param {number} node
 * @return {undefined}
 */
baredom.impl.w3c.Document.prototype.aboutToRemoveNode = function (dom, node) {
    "use strict";
    var map = this.impl_idToNodeMap;
    /**
     * @param {number} nodeid
     * @param {baredom.impl.w3c.Node} node
     * @param {baredom.impl.w3c.Node} parent
     */
    function removeNode(nodeid, node, parent) {
        var c;
        node.impl_firstChild = node.firstChild;
        node.impl_lastChild = node.lastChild;
        node.impl_parentNode = parent;
        if (parent) {
            node.impl_previousSibling = node.previousSibling;
            node.impl_nextSibling = node.nextSibling;
        }
        // TODO: attributes and text
        node.impl_nodeid = 0;
        delete map[nodeid];
        c = node.impl_firstChild;
        while (c) {
            removeNode(c.impl_nodeid, c, node);
            c = c.impl_nextSibling;
        }
    }
    removeNode(node, this.impl_getNode(node), null);
};
/**
 * @param {!baredom.impl.w3c.Node} node
 * @return {string}
 */
baredom.impl.w3c.Document.prototype.impl_getText = function (node) {
    "use strict";
    var n,
        nodeid = node.impl_nodeid;
    if (nodeid === 0) {
        n = this.impl_nodeValue;
    } else {
        n = this.impl_dom.getText(nodeid);
    }
    return /**@type{string}*/(n);
};
/**
 * @param {!baredom.impl.w3c.Node} node
 * @param {string} value
 */
baredom.impl.w3c.Document.prototype.impl_setText = function (node, value) {
    "use strict";
    if (node.nodeType !== 3) {
        throw "Cannot set text on this node.";
    }
    var nodeid = node.impl_nodeid;
    if (nodeid === 0) {
        this.impl_nodeValue = value;
    } else {
        this.impl_dom.setText(nodeid, value);
    }
};
/**
 * @param {number} node
 * @return {baredom.impl.w3c.Node}
 */
baredom.impl.w3c.Document.prototype.impl_getNode = function (node) {
    "use strict";
    if (node === 0) {
        return null;
    }
    var n = this.impl_idToNodeMap[node],
        text,
        dom = this.impl_dom,
        qnames,
        qname;
    if (n === undefined) {
        text = dom.getText(node);
        if (text === undefined) {
            qnames = dom.getQNames();
            qname = dom.getQName(node);
            n = new baredom.impl.w3c.Element(node, this,
                qnames.getNamespace(qname), qnames.getLocalName(qname));
        } else {
            n = new baredom.impl.w3c.Text(node, this);
        }
        this.impl_idToNodeMap[node] = n;
    }
    return n;
};
/**
 * @type {!baredom.core.Dom}
 */
baredom.impl.w3c.Document.prototype.impl_dom;
Object_freeze(baredom.impl.w3c.Document);
Object_freeze(baredom.impl.w3c.Document.prototype);
