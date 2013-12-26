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
        /**
         * @type{!Array.<number>}
         */
        atts = [],
        /**@type{!Array.<(string|undefined)>}*/
        texts = [];

    /**
     * @param {string} text
     * @return {number}
     */
    function addText(text) {
        var l = texts.length,
            i = 0;
        while (i < l && texts[i] === undefined) {
            i += 1;
        }
        if (i === l) {
            texts.push(text);
        } else {
            texts[i] = text;
        }
        return i;
    }

    /**
     * @return {number}
     */
    this.getDocumentElement = function () {
        return NODESSTEP;
    };

    /**
     * @param {number} position
     * @return {string}
     */
    function getText(position) {
        var text = texts[position];
        assert(text !== undefined, "No text as position " + position + ".");
        return /**@type{string}*/(text);
    }

    /**
     * @param {number} position
     */
    function removeText(position) {
        texts[position] = undefined;
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
            v = texts[-pos];
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
    }
    /**
     * @param {number} qname
     * @param {number} parent
     * @param {number} ref
     * @return {number}
     */
    this.insertElement = function (qname, parent, ref) {
    }
    /**
     * @param {number} text
     * @param {number} parent
     * @param {number} ref
     * @return {number}
     */
    this.insertText = function (text, parent, ref) {
    }
    /**
     * @param {number} node
     */
    this.removeNode = function (node) {
    }
    /**
     * @param {number} node
     * @param {number} parent
     * @param {number} ref
     */
    this.moveNode = function (node, parent, ref) {
    }
    function init() {
        nodes.length = 2 * NODESSTEP;
        var pos = NODESSTEP;
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
