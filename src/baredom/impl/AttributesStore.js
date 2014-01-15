/*global baredom, assert*/
/**
 * @constructor
 * @implements baredom.core.AttributesStore
 * @param {!baredom.core.StringStore} stringStore
 */
baredom.impl.AttributesStore = function (stringStore) {
    "use strict";
    var /**@type{!Array.<number>}*/
        values = [0, 0],
        /**@type{!Array.<number>}*/
        qnames = [0, 0],
        /**@type{!Array.<number>}*/
        next = [0, 0],
        /**@type{!Array.<number>}*/
        instanceCount = [0, 0],
        /**@type{!Array.<number>}*/
        emptySlots = [];
    /**
     * @return {number}
     */
    this.addEmptyAttributes = function () {
        return 1;
    };
    /**
     * @param {number} attributesId
     */
    this.addAttributes = function (attributesId) {
        instanceCount[attributesId] += 1;
    };
    /**
     * @param {number} nodeId
     */
    function removeNode(nodeId) {
        assert(nodeId >= 1, "Invalid nodeId.");
        var count;
        if (nodeId > 1) {
            count = instanceCount[nodeId];
            assert(count > 0, "Invalid count.");
            if (count > 1) {
                instanceCount[nodeId] = count - 1;
            } else {
                emptySlots.push(nodeId);
                stringStore.removeString(values[nodeId]);
                removeNode(next[nodeId]);
            }
        }
    }
    /**
     * @param {number} attributesId
     */
    this.removeAttributes = function (attributesId) {
        removeNode(attributesId);
    };
    /**
     * @param {number} nextId
     * @param {number} qname
     * @param {number} valueid
     * @return {number}
     */
    function findAttribute(nextId, qname, valueid) {
        // there is no index, so iterate through all attributes
        var i, l = values.length, notfound = true;
        for (i = 2; notfound && i < l; i += 1) {
            notfound = next[i] !== nextId || qnames[i] !== qname
                    || values[i] !== valueid;
        }
        return notfound ? -1 : i - 1;
    }
    /**
     * @param {number} nextId
     * @param {number} qname
     * @param {string} value
     * @return {number} // nodeid for the new (or shared) attribute
     */
    function addAttribute(nextId, qname, value) {
        var valueid = stringStore.addString(value),
            nodeId = findAttribute(nextId, qname, valueid);
        if (nodeId !== -1) {
            instanceCount[nodeId] += 1;
            stringStore.removeString(valueid);
        } else {
            nodeId = emptySlots.pop() || values.length;
            qnames[nodeId] = qname;
            values[nodeId] = valueid;
            instanceCount[nodeId] = 1;
            next[nodeId] = nextId;
        }
        return nodeId;
    }
    /**
     * @param {number} oldId
     * @param {number} nextId
     * @param {number} qname
     * @param {string} value
     * @return {number} // nodeid for the new (or shared) attribute
     */
    function changeAttribute(oldId, nextId, qname, value) {
        var valueid = stringStore.addString(value),
            nodeId = oldId;
        if (valueid === values[oldId]) {
            // nothing changed!
            stringStore.removeString(valueid);
        } else if (instanceCount[oldId] === 1) {
            // reuse the slot
            stringStore.removeString(values[oldId]);
            values[oldId] = valueid;
        } else {
            instanceCount[oldId] -= 1;
            nodeId = addAttribute(nextId, qname, value);
            stringStore.removeString(valueid);
        }
        return nodeId;
    }
    /**
     * @param {number} nodeId
     */
    function releaseSlot(nodeId) {
        stringStore.removeString(values[nodeId]);
        emptySlots.push(nodeId);
        qnames[nodeId] = 0;
    }
    /**
     * @param {number} nodeId
     * @return {number}
     */
    function removeAttribute(nodeId) {
        var count = instanceCount[nodeId];
        if (count > 1) {
            instanceCount[nodeId] -= 1;
        } else {
            releaseSlot(nodeId);
        }
        return next[nodeId];
    }
    /**
     * @param {number} nodeId
     * @param {number} nextId
     * @param {number} qname
     * @return {number}
     */
    function reconnect(nodeId, nextId, qname) {
        var newNodeId = findAttribute(nextId, qname, values[nodeId]),
            v;
        if (newNodeId !== -1) {
            // reusing another entry
            releaseSlot(nodeId);
            nodeId = newNodeId;
            instanceCount[nodeId] += 1;
        } else if (instanceCount[nodeId] === 1) {
            // reuse the slot
            next[nodeId] = nextId;
        } else {
            instanceCount[nodeId] -= 1;
            // register another copy of the value
            v = values[nodeId];
            stringStore.addStringId(v);
            nodeId = emptySlots.pop() || values.length;
            values[nodeId] = v;
            qnames[nodeId] = qname;
            next[nodeId] = nextId;
            instanceCount[nodeId] = 1;
        }
        return nodeId;
    }
    /**
     * @param {number} nodeId
     * @param {number} qname
     * @param {string|undefined} value
     * @return {number} // the new parent
     */
    function setAttribute(nodeId, qname, value) {
        var newNodeId = nodeId,
            q = qnames[nodeId];
        if (nodeId === 1 || qname > q) {
            if (value !== undefined) {
                // add a new att
                newNodeId = addAttribute(nodeId, qname, value);
            }
        } else if (q === qname) {
            if (value === undefined) {
                newNodeId = removeAttribute(nodeId);
            } else {
                // att with this qname already present
                newNodeId = changeAttribute(nodeId, next[nodeId], qname, value);
            }
        } else {
            newNodeId = setAttribute(next[nodeId], qname, value);
            if (newNodeId === next[nodeId]) {
                newNodeId = nodeId;
            } else {
                newNodeId = reconnect(nodeId, newNodeId, q);
            }
        }
        return newNodeId;
    }
    /**
     * Add a new value to the attribute. This will result in a new attributesId.
     * If value is undefined, the attribute will be removed from the attributes.
     * @param {number} attributesId
     * @param {number} qname
     * @param {string|undefined} value
     * @return {number}
     */
    this.setAttribute = function (attributesId, qname, value) {
        return setAttribute(attributesId, qname, value);
    };
    /**
     * @param {number} attributesId
     * @param {number} qname
     * @return {string|undefined}
     */
    this.getAttribute = function (attributesId, qname) {
        assert(attributesId > 0, "Invalid attributesId.");
        assert(qname >= 1, "Invalid attributeId.");
        var nodeId = attributesId, value;
        while (nodeId !== 1 && qnames[nodeId] !== qname) {
            nodeId = next[nodeId];
        }
        if (nodeId !== 1) {
            value = stringStore.getString(values[nodeId]);
        }
        return value;
    };
    /**
     * @param {number} attributesId
     * @return {number}
     */
    this.getAttributeCount = function (attributesId) {
        assert(attributesId > 0, "Invalid attributesId.");
        var count = 0,
            nodeId = attributesId, n = 0;
        while (nodeId !== 1 && n++ < 100) {
            count += 1;
            nodeId = next[nodeId];
        }
        return count;
    };
    /**
     * @param {number} attributesId
     * @param {number} attributeId
     * @return {number}
     */
    this.getQName = function (attributesId, attributeId) {
        assert(attributesId > 1, "Invalid attributesId.");
        assert(attributeId >= 0, "Invalid attributeId.");
        var nodeId = attributesId;
        while (attributeId > 0) {
            attributeId -= 1;
            nodeId = next[nodeId];
        }
        return qnames[nodeId];
    };
    /**
     * @param {number} attributesId
     * @param {number} attributeId
     * @return {string}
     */
    this.getValue = function (attributesId, attributeId) {
        assert(attributesId > 1, "Invalid attributesId.");
        assert(attributeId >= 0, "Invalid attributeId.");
        var nodeId = attributesId;
        while (attributeId > 0) {
            attributeId -= 1;
            nodeId = next[nodeId];
        }
        return stringStore.getString(values[nodeId]);
    };
};
