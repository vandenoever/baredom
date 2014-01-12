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
    var documentElement = dom.getDocumentElement();
    dom.addModificationListener(this);
    this.documentElement = new baredom.impl.w3c.Element(documentElement, this);
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
    return new baredom.impl.w3c.Attr(this);
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
baredom.impl.w3c.Document.prototype.createEntityReference = function (name) {
    "use strict";
    throw "TODO";
};
baredom.impl.w3c.Document.prototype.createProcessingInstruction = function (name) {
    "use strict";
    throw "TODO";
};
baredom.impl.w3c.Document.prototype.createTextNode = function (name) {
    "use strict";
    throw "TODO";
};
baredom.impl.w3c.Document.prototype.getElementsByTagName = function (name) {
    "use strict";
    throw "TODO";
};
/**
 * @param {!baredom.core.Dom} dom
 * @param {!ModificationListener.Type} type
 * @param {number} node
 * @return {undefined}
 */
baredom.impl.w3c.Document.prototype.handleEvent = function (dom, type, node) {
    "use strict";
    var self = this;
    /**
     * @param {!baredom.impl.w3c.Node} node
     */
    function removeNode(node) {
        var prev = node.impl_previousSibling,
            next = node.impl_nextSibling;
        if (prev) {
            prev.impl_nextSibling = next;
        }
        if (next) {
            next.impl_previousSibling = prev;
        }
    }
    /**
     * @param {!baredom.impl.w3c.Node} node
     * @param {!baredom.impl.w3c.Node} parentNode
     */
    function insertNode(node, parentNode) {
    }
    /**
     * @param {!baredom.impl.w3c.Node} parentNode
     */
    function insertNewNode(parentNode) {
        var n, text = dom.getText(node);
        if (text === undefined) {
            n = new baredom.impl.w3c.Element(node, self);
        } else {
            n = new baredom.impl.w3c.Text(node, self);
        }
        self.impl_idToNodeMap[node] = n;
        insertNode(n, parentNode);
console.log("text " + text);
    }
    /**
     * @param {number} nodeid
     * @return {!baredom.impl.w3c.Node}
     */
    function getParentNode(nodeid) {
        var parentId = dom.getParentNode(nodeid),
            parentNode = self.impl_idToNodeMap[parentId];
        if (parentNode === undefined) {
            parentNode = new baredom.impl.w3c.Element(parentId, self);
            insertNode(parentNode, getParentNode(parentId));
            self.impl_idToNodeMap[parentId] = parentNode;
        }
        return parentNode;
    }
    function handle() {
        assert(dom === self.impl_dom, "reporting to wrong document.");
        var parentId, parentNode, n;
        if (type === ModificationListener.Type.INSERTELEMENT
                || type === ModificationListener.Type.INSERTTEXT) {
//only add node if any if is first or last in parent or if one of the neighbors 
            parentId = dom.getParentNode(node);
            parentNode = self.impl_idToNodeMap[parentId];
            if (parentNode !== undefined && parentNode.impl_firstChild) {
                insertNewNode(parentNode);
            }
        } else if (type === ModificationListener.Type.REMOVENODE) {
            n = self.impl_idToNodeMap[node];
            if (n !== undefined) {
                removeNode(n);
                delete self.impl_idToNodeMap[node];
            }
        } else if (type === ModificationListener.Type.MOVENODE) {
            n = self.impl_idToNodeMap[node];
            if (n !== undefined) {
                removeNode(n);
                parentNode = getParentNode(node);
                insertNode(n, parentNode);
            }
        }
    }
    handle();
};
/**
 * @param {!baredom.impl.w3c.Node} node
 * @return {string}
 */
baredom.impl.w3c.Document.prototype.impl_getText = function (node) {
    "use strict";
    return "todo " + node.impl_nodeid;
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
    var n = this.impl_idToNodeMap[node];
    return n;
};
/**
 * @type {!baredom.core.Dom}
 */
baredom.impl.w3c.Document.prototype.impl_dom;
Object.freeze(baredom.impl.w3c.Document);
Object.freeze(baredom.impl.w3c.Document.prototype);
