/*global baredom, assert*/
/**
 * @constructor
 * @implements baredom.core.Dom
 * @param {!baredom.core.QName} qnames
 * @param {number} initialRootQName
 */
baredom.impl.Dom = function (qnames, initialRootQName) {
    "use strict";
    var /**
         * Array with nodes. Each node node occupies 8 positions:
         *   value: negative values point to strings, positive ones to qname
         *   parent: position of the parent node, -1 means this node is not a
         *           node
         *   prev: position of the previous sibling or 0 if there is none
         *   next: position of the next sibling or 0 if there is none
         *   first: position of the first child or 0 if there is none
         *   last: position of the last child or 0 if there is none
         *   atts: position of the attributes or 0 if there are none
         * @type{!Array.<number>}
         */
        nodes = [],
        NODESSTEP = 8,
        VALUE = 0,
        PARENT = 1,
        PREV = 2,
        NEXT = 3,
        FIRST = 4,
        LAST = 5,
        ATTS = 6,
        /**
         * @type{!Array.<number>}
         */
        atts = [],
        /**@type{!Array.<(string|undefined)>}*/
        texts = [];

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
        var l = texts.length,
            i = 0;
        while (i < l && texts[i] !== undefined) {
            i += 1;
        }
        if (i === l) {
            texts.push(text);
        } else {
            texts[i] = text;
        }
        return i + 1;
    }

    /**
     * @param {number} position
     * @param {string} text
     */
    function setText(position, text) {
        texts[position - 1] = text;
    }

    /**
     * @param {number} position
     * @return {string}
     */
    function getText(position) {
        var text = texts[position - 1];
        assert(text !== undefined, "No text at position " + position + ".");
        return /**@type{string}*/(text);
    }

    /**
     * @param {number} position
     */
    function removeText(position) {
        var text = texts[position - 1];
        assert(text !== undefined, "No text at position " + position + ".");
        texts[position - 1] = undefined;
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
        var v = nodes[node];
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
        var pos = nodes[node],
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
        var pos = nodes[node],
            attCount = 0;
        if (pos > 1) {
            attCount = nodes[pos + 1];
        }
        return attCount;
    };

    /**
     * @param {number} node
     * @param {number} attr
     * @return {number|undefined}
     */
    function getAttPos(node, attr) {
        var pos = nodes[node],
            attCount = 0,
            attPos;
        if (pos > 1) {
            attCount = nodes[pos + 1];
            if (attCount > attr) {
                attPos = pos + 2 + attr * 2;
            }
        }
        return attPos;
    }

    /**
     * @param {number} node
     * @param {number} attr
     * @return {number}
     */
    this.getAttributeQName = function (node, attr) {
        var attPos = getAttPos(node, attr);
        return (attPos === undefined) ? 0 : nodes[attPos];
    };

    /**
     * @param {number} node
     * @param {number} attr
     * @return {string|undefined}
     */
    this.getAttributeValue = function (node, attr) {
        var attPos = getAttPos(node, attr);
        return (attPos === undefined) ? undefined : getText(nodes[attPos]);
    };
 
    /**
     * @param {number} node
     * @return {number}
     */
    this.getChildCount = function (node) {
        var pos = nodes[node],
            childCount = 0;
        if (pos > 0) {
            pos = nodes[pos + 3];
            while (pos > 0) {
                pos = nodes[pos + 2];
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
        return nodes[node + 1] || 0;
    };
    /**
     * @param {number} node
     * @return {number}
     */
    this.getPreviousSibling = function (node) {
        return nodes[node + 2] || 0;
    };
    /**
     * @param {number} node
     * @return {number}
     */
    this.getNextSibling = function (node) {
        return nodes[node + 3] || 0;
    };
    /**
     * @param {number} node
     * @return {number}
     */
    this.getFirstChild = function (node) {
        return nodes[node + 4] || 0;
    };
    /**
     * @param {number} node
     * @return {number}
     */
    this.getLastChild = function (node) {
        return nodes[node + 5] || 0;
    };
    /**
     * @param {number} node
     * @param {number} qname
     */
    this.setQName = function (node, qname) {
        var pos = nodes[node];
        if (pos > 0) {
            nodes[pos] = qname;
        }
    };
    /**
     * @param {number} node
     * @param {string} text
     */
    this.setText = function (node, text) {
        var pos = nodes[node];
        if (pos < 0) {
            setText(-pos, text);
        }
    };
    /**
     * @return {number}
     */
    function getEmptyNodePosition() {
        var l = nodes.length,
            i = 2 * NODESSTEP;
        while (i < l && nodes[i + PARENT] !== -1) {
            i += NODESSTEP;
        }
        if (i === l) {
            nodes.length = i + NODESSTEP;
        }
        return i;
    }
    /**
     * @param {number} node
     * @param {number} parent
     * @param {number} ref
     */
    function insertIntoTree(node, parent, ref) {
        var next = ref || 0,
            prev = (next === 0) ? nodes[parent + LAST] : nodes[next + PREV];
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
        var prev = nodes[node + PREV],
            next = nodes[node + NEXT],
            parent = nodes[node + PARENT];
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
     * @param {number} qname
     * @param {number} parent
     * @param {number} ref
     * @return {number}
     */
    this.insertElement = function (qname, parent, ref) {
        var pos = createEmptyNode(qname, parent, ref);
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
        var child = nodes[node + FIRST],
            pos;
        while (child !== 0) {
            removeChildren(child);
            nodes[node + PARENT] = -1;
            pos = nodes[node];
            if (pos < 0) { // text
                removeText(-pos);
            }
            child = nodes[child + NEXT];
        }
    }
    /**
     * @param {number} node
     */
    this.removeNode = function (node) {
        assert(node > NODESSTEP, "Invalid node.");
        assert(node % NODESSTEP === 0, "Invalid node.");
        removeChildren(node);
        removeFromTree(node);
        var pos = nodes[node];
        if (pos < 0) { // text
            removeText(-pos);
        }
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
            p = nodes[parent + PARENT];
        }
        insertIntoTree(node, parent, ref);
    };
    /**
     * @param {number} node
     * @param {number} parent
     * @param {number} ref
     * @return {number}
     */
    this.cloneNode = function (node, parent, ref) {
        return 0;
    };
    function init() {
        nodes.length = 2 * NODESSTEP;
        nodes[NODESSTEP] = initialRootQName;
        nodes[NODESSTEP + 1] = 0;
        nodes[NODESSTEP + 2] = 0;
        nodes[NODESSTEP + 3] = 0;
        nodes[NODESSTEP + 4] = 0;
        nodes[NODESSTEP + 5] = 0;
        nodes[NODESSTEP + 6] = 0;
        nodes[NODESSTEP + 7] = 0;
    }
    init();
};
