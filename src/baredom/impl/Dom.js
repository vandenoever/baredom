/*global baredom, assert, ModificationListener, ArrayBuffer, Int32Array*/
/**
 * @constructor
 * @implements baredom.core.Dom
 * @implements baredom.core.ObservableDom
 * @param {!baredom.core.QName} qnames
 * @param {number} initialRootQName
 */
baredom.impl.Dom = function (qnames, initialRootQName) {
    "use strict";
    /**
     * @param {!Int32Array=} old
     * @return {!Int32Array}
     */
    function increaseBuffer(old) {
        var length = 1024, array;
        if (old) {
            length = 16 * old.length;
        }
        array = new Int32Array(new ArrayBuffer(length));
        if (old) {
            array.set(old);
        }
        return array;
    }
    var self = this,
        eventProxy = new baredom.impl.EventProxy(this),
        /**
         * Array with nodes. Each node node occupies 8 positions:
         *   value: negative values point to strings, positive ones to qname
         *   parent: position of the parent node, -1 means this node is not a
         *           node
         *   prev: position of the previous sibling or 0 if there is none
         *   next: position of the next sibling or 0 if there is none
         *   first: position of the first child or 0 if there is none
         *   last: position of the last child or 0 if there is none
         *   atts: position of the attributes or 0 if there are none
         * @type{!Int32Array}
         */
        nodes = increaseBuffer(),
        /**@type{number}*/
        nodesLength = 0,
        NODESSTEP = 8,
        VALUE = 0,
        PARENT = 1,
        PREV = 2,
        NEXT = 3,
        FIRST = 4,
        LAST = 5,
        ATTS = 6,
        VERSION = 7,
        texts = new baredom.impl.StringStore(),
        atts = new baredom.impl.AttributesStore(texts),
        /**@type{!Array.<number>}*/
        emptySlots = [],
        /**@type{!Array.<!ModificationListener>}*/
        modificationListeners = [];

    /**
     * @param {number} index
     * @return {number}
     */
    function get(index) {
        return nodes[index];
    }

    /**
     * @return {number}
     */
    this.getDocumentElement = function () {
        return NODESSTEP;
    };

    /**
     * @param {string} text
     * @return {number}
     */
    function addText(text) {
        return texts.addString(text);
    }

    /**
     * @param {number} position
     * @param {string} text
     * @return {number}
     */
    function setText(position, text) {
        return texts.updateString(position, text);
    }

    /**
     * @param {number} position
     * @return {string}
     */
    function getText(position) {
        return texts.getString(position);
    }

    /**
     * @param {number} position
     */
    function removeText(position) {
        return texts.removeString(position);
    }

    /**
     * @return {!baredom.core.QName}
     */
    this.getQNames = function () {
        return qnames;
    };

    /**
     * Get the QName of node.
     * If the node does not exist, 0 is returned.
     *
     * @param {number} node
     * @return {number}
     */
    this.getQName = function (node) {
        var v = get(node);
        if (v < 0) { // node is text node
            v = 0;
        }
        return v;
    };

    /**
     * @param {number} node
     * @return {string|undefined}
     */
    this.getText = function (node) {
        var pos = get(node),
            v;
        if (pos < 0) {
            v = getText(-pos);
        }
        return v;
    };

    /**
     * @param {number} node
     * @return {number}
     */
    this.getAttributeCount = function (node) {
        return atts.getAttributeCount(get(node + ATTS));
    };

    /**
     * @param {number} node
     * @param {number} attr
     * @return {number}
     */
    this.getAttributeQName = function (node, attr) {
        return atts.getQName(get(node + ATTS), attr);
    };

    /**
     * @param {number} node
     * @param {number} attr
     * @return {string}
     */
    this.getAttributeValue = function (node, attr) {
        return atts.getValue(get(node + ATTS), attr);
    };
    /**
     * @param {number} node
     * @param {number} attqname qname for the attribute
     * @return {string|undefined}
     */
    this.getAttribute = function (node, attqname) {
        var a = get(node + ATTS);
        return atts.getAttribute(a, attqname);
    };
    /**
     * @param {number} node
     * @param {number} attqname qname for the attribute
     * @param {string|undefined} value
     */
    this.setAttribute = function (node, attqname, value) {
        var a = node + ATTS;
        nodes[a] = atts.setAttribute(nodes[a], attqname, value);
    };
 
    /**
     * @param {number} node
     * @return {number}
     */
    this.getChildCount = function (node) {
        var pos = get(node),
            childCount = 0;
        if (pos > 0) {
            pos = get(pos + 3);
            while (pos > 0) {
                pos = get(pos + 2);
                childCount += 1;
            }
        }
        return childCount;
    };
    /**
     * @param {number} node
     * @return {number}
     */
    this.getParentNode = function (node) {
        return get(node + 1) || 0;
    };
    /**
     * @param {number} node
     * @return {number}
     */
    this.getPreviousSibling = function (node) {
        return get(node + 2) || 0;
    };
    /**
     * @param {number} node
     * @return {number}
     */
    this.getNextSibling = function (node) {
        return get(node + 3) || 0;
    };
    /**
     * @param {number} node
     * @return {number}
     */
    this.getFirstChild = function (node) {
        return get(node + 4) || 0;
    };
    /**
     * @param {number} node
     * @return {number}
     */
    this.getLastChild = function (node) {
        return get(node + 5) || 0;
    };
    /**
     * @param {number} node
     * @param {number} qname
     */
    this.setQName = function (node, qname) {
        var pos = get(node);
        if (pos > 0) {
            nodes[node] = qname;
        }
    };
    /**
     * @param {number} node
     * @param {string} text
     */
    this.setText = function (node, text) {
        var pos = get(node);
        if (pos < 0) {
            nodes[node] = -setText(-pos, text);
        }
    };
    /**
     * @return {number}
     */
    function getEmptyNodePosition() {
        var n = emptySlots.pop();
        if (!n) {
            n = nodesLength;
            nodesLength += NODESSTEP;
            if (nodes.length < nodesLength) {
                nodes = increaseBuffer(nodes);
            }
        }
        return n;
    }
    /**
     * @param {number} node
     * @param {number} parent
     * @param {number} ref
     */
    function insertIntoTree(node, parent, ref) {
        var next = ref || 0,
            prev = (next === 0) ? get(parent + LAST) : get(next + PREV);
        nodes[node + PARENT] = parent;
        nodes[node + PREV] = prev;
        nodes[node + NEXT] = next;
        // adapt parent
        if (prev === 0) {
            nodes[parent + FIRST] = node;
        }
        if (next === 0) {
            nodes[parent + LAST] = node;
        }
        // adapt prev node
        if (prev !== 0) {
            nodes[prev + NEXT] = node;
        }
        // adapt next node
        if (next !== 0) {
            nodes[next + PREV] = node;
        }
    }
    /**
     * @param {number} node
     */
    function removeFromTree(node) {
        var prev = get(node + PREV),
            next = get(node + NEXT),
            parent = get(node + PARENT);
        if (prev !== 0) {
            nodes[prev + NEXT] = next;
        }
        if (next !== 0) {
            nodes[next + PREV] = prev;
        }
        if (nodes[parent + FIRST] === node) {
            nodes[parent + FIRST] = next;
        }
        if (nodes[parent + LAST] === node) {
            nodes[parent + LAST] = prev;
        }
    }
    /**
     * @param {number} value
     * @param {number} parent
     * @param {number} ref
     * @return {number}
     */
    function createEmptyNode(value, parent, ref) {
        assert(parent >= NODESSTEP, "Invalid parent.");
        assert(parent % NODESSTEP === 0, "Invalid parent.");
        assert(parent === NODESSTEP || nodes[parent + 1] >= NODESSTEP, "Invalid parent.");
        assert(nodes[parent] > 0, "Parent is not an element.");
        assert(ref > NODESSTEP || ref === 0, "Invalid reference.");
        assert(ref % NODESSTEP === 0, "Invalid reference.");
        assert(ref === 0 || nodes[ref + 1] === parent, "Invalid reference.");
        var pos = getEmptyNodePosition();
        // init new node
        nodes[pos] = value;
        nodes[pos + FIRST] = 0;
        nodes[pos + LAST] = 0;
        nodes[pos + ATTS] = 0;
        nodes[pos + 7] = 0;
        insertIntoTree(pos, parent, ref);
        return pos;
    }
    /**
     * @param {number} node
     */
    function signalAboutToRemoveNode(node) {
        modificationListeners.forEach(function (l) {
            l.aboutToRemoveNode(self, node);
        });
    }
    /**
     * @param {number} qname
     * @param {number} parent
     * @param {number} ref
     * @return {number}
     */
    this.insertElement = function (qname, parent, ref) {
        assert(qname > 0, "Invalide QName.");
        var pos = createEmptyNode(qname, parent, ref);
        nodes[pos + ATTS] = atts.addEmptyAttributes();
        return pos;
    };
    /**
     * @param {string} text
     * @param {number} parent
     * @param {number} ref
     * @return {number}
     */
    this.insertText = function (text, parent, ref) {
        var textPos = addText(text),
            pos = createEmptyNode(-textPos, parent, ref);
        return pos;
    };
    /**
     * @param {number} node
     */
    function removeChildren(node) {
        var child = get(node + FIRST),
            att = get(node + ATTS),
            pos;
        if (att > 0) {
            atts.removeAttributes(get(node + ATTS));
        }
        while (child !== 0) {
            removeChildren(child);
            nodes[child + PARENT] = -1;
            pos = get(child);
            if (pos < 0) { // text
                removeText(-pos);
            }
            child = get(child + NEXT);
        }
    }
    /**
     * @param {number} node
     */
    this.removeNode = function (node) {
        assert(node > NODESSTEP, "Invalid node.");
        assert(node % NODESSTEP === 0, "Invalid node.");
        signalAboutToRemoveNode(node);
        removeChildren(node);
        var pos = get(node);
        removeFromTree(node);
        if (pos < 0) { // text
            removeText(-pos);
        }
        nodes[node + PARENT] = -1;
        emptySlots.push(node);
    };
    /**
     * @param {number} node
     * @param {number} parent
     * @param {number} ref
     */
    this.moveNode = function (node, parent, ref) {
        assert(node > NODESSTEP, "Invalid node.");
        assert(node % NODESSTEP === 0, "Invalid node.");
        assert(ref === 0 || nodes[ref + PARENT] === parent,
                "Invalid reference.");
        // check that parent is not beneath node
        var p = parent;
        while (p !== 0) {
            assert(p !== node, "Parent is child of node.");
            p = get(p + PARENT);
        }
        removeFromTree(node);
        insertIntoTree(node, parent, ref);
    };
    /**
     * @param {number} fromNode
     * @param {number} toNode
     */
    function cloneChildren(fromNode, toNode) {
        var c = self.getFirstChild(fromNode);
        while (c !== 0) {
            self.cloneNode(c, toNode, 0);
            c = self.getNextSibling(c);
        }
    }
    /**
     * @param {number} node
     * @param {number} parent
     * @param {number} ref
     * @return {number}
     */
    this.cloneNode = function (node, parent, ref) {
        var text = self.getText(node),
            e;
        if (text !== undefined) {
            return self.insertText(text, parent, ref);
        }
        e = self.insertElement(self.getQName(node), parent, ref);
        atts.addAttributes(nodes[node + ATTS]);
        nodes[e + ATTS] = nodes[node + ATTS];
        cloneChildren(node, e);
        return e;
    };
    /**
     * @param {number} node
     * @return {number}
     */
    this.getVersion = function (node) {
        return get(node + VERSION) || 0;
    };
    /**
     * @param {ModificationListener} listener
     * @return {undefined}
     */
    this.addModificationListener = function (listener) {
        var i = modificationListeners.indexOf(listener);
        if (i === -1) {
            modificationListeners.push(listener);
        }
    };
    /**
     * @param {ModificationListener} listener
     * @return {undefined}
     */
    this.removeModificationListener = function (listener) {
        var i = modificationListeners.indexOf(listener);
        if (i !== -1) {
            modificationListeners.splice(i, 1);
        }
    };
    /**
     * @param {number} nodeid
     * @param {string} eventType
     * @param {function()} handler
     */
    this.addEventListener = function (nodeid, eventType, handler) {
        eventProxy.addEventListener(nodeid, eventType, handler);
    };
    /**
     * @return {!Int32Array}
     */
    this.getNodesArray = function () {
        return nodes;
    };
    /**
     * @return {number}
     */
    this.getNodesArrayLength = function () {
        return nodesLength;
    };
    /**
     * @return {!baredom.impl.EventProxy}
     */
    this.getEventProxy = function () {
        return eventProxy;
    };
    /**
     * @return {!baredom.impl.StringStore}
     */
    this.getStringStore = function () {
        return texts;
    };
    /**
     * @return {!baredom.impl.AttributesStore}
     */
    this.getAttributesStore = function () {
        return atts;
    };
    function init() {
        nodesLength = 2 * NODESSTEP;
        nodes[NODESSTEP] = initialRootQName;
        nodes[NODESSTEP + 1] = 0;
        nodes[NODESSTEP + 2] = 0;
        nodes[NODESSTEP + 3] = 0;
        nodes[NODESSTEP + 4] = 0;
        nodes[NODESSTEP + 5] = 0;
        nodes[NODESSTEP + 6] = 1;
        nodes[NODESSTEP + 7] = 0;
    }
    init();
};
