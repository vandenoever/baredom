/*global baredom, assert*/
/**
 * @constructor
 * @implements baredom.core.DomBridge
 * @param {!baredom.impl.Dom} dom
 * @param {!Element} documentElement
 */
baredom.impl.DomBridge = function (dom, documentElement) {
    "use strict";
    var self = this,
        qnames = dom.getQNames(),
        /**@type{!Array.<number>}*/
        shadow = [],
        /**@type{!Array.<Node>}*/
        liveNodes = [null, documentElement],
        NODESSTEP = 8,
        VALUE = 0,
        PARENT = 1,
        PREV = 2,
        NEXT = 3,
        FIRST = 4,
        LAST = 5,
        ATTS = 6,
        VERSION = 7,
        eventProxy = dom.getEventProxy(),
        stringStore = dom.getStringStore(),
        attStore = dom.getAttributesStore();
    shadow[NODESSTEP + ATTS] = attStore.addEmptyAttributes();
    /**
     * @return {!baredom.core.Dom}
     */
    this.getVirtualDom = function () {
        return dom;
    };
    /**
     * @return {!Element}
     */
    this.getDocumentElement = function () {
        return documentElement;
    };
    /**
     * @param {!Array.<number>} vdom
     * @param {!Array.<Text>} textCache
     * @param {!Object.<number,!Array.<Element>>} elementCache
     */
    function removeUnused(vdom, textCache, elementCache) {
        // loop over items and remove unused ones
        var i, j, shadowValue, value, earray,
            l = liveNodes.length;
        for (j = 2; j < l; j += 1) {
            i = j * NODESSTEP;
            shadowValue = shadow[i + VALUE];
            value = vdom[i + VALUE];
            if (shadowValue < 0 && value > 0) {
                stringStore.removeString(-shadowValue);
                textCache.push(liveNodes[j]);
                liveNodes[j] = null;
            } else if (shadowValue > 0 && shadowValue !== value) {
                attStore.removeAttributes(shadow[i + ATTS]);
                earray = elementCache[shadowValue];
                if (earray === undefined) {
                    earray = elementCache[shadowValue] = [];
                }
                earray.push(liveNodes[j]);
                liveNodes[j] = null;
            }
        }
    }
    /**
     * @param {!Array.<number>} vdom
     * @param {!Array.<Text>} textCache
     * @param {!Object.<number,!Array.<Element>>} elementCache
     */
    function createNew(vdom, textCache, elementCache) {
        var i, j, shadowValue, value, earray,
            /**@type{Node}*/
            node,
            shadowl = shadow.length,
            l = vdom.length / NODESSTEP,
            texts = textCache.length,
            doc = documentElement.ownerDocument;
        liveNodes.length = l;
        // extend the shadow
        shadow.length = vdom.length;
        for (j = shadowl; j < vdom.length; j += 1) {
            shadow[j] = 0;
        }
        for (j = 2; j < l; j += 1) {
            i = j * NODESSTEP;
            shadowValue = shadow[i + VALUE];
            value = vdom[i + VALUE];
            if (value < 0 && shadowValue >= 0) {
                if (texts > 0) {
                    node = textCache.pop();
                    texts -= 1;
                } else {
                    node = doc.createTextNode(dom.getText(i) || "");
                    stringStore.addStringId(-value);
                    shadow[i + VALUE] = value;
                }
                liveNodes[j] = node;
            } else if (value > 0 && shadowValue !== value) {
                earray = elementCache[value];
                if (earray && earray.length > 0) {
                    node = earray.pop();
                } else {
                    node = doc.createElementNS(qnames.getNamespace(value),
                            qnames.getLocalName(value));
                    shadow[i + VALUE] = value;
                    shadow[i + ATTS] = attStore.addEmptyAttributes();
                }
                liveNodes[j] = node;
            }
        }
    }
    /**
     * @param {number} nodeid
     * @param {!Element} element
     */
    function updateAllAttributes(nodeid, element) {
        // stupid implementation updates all attributes
        var atts, value, i, l, qname, a, toRemove = [];
        atts = element.attributes;
        l = atts.length;
        for (i = 0; i < l; i += 1) {
            a = atts.item(i);
            qname = qnames.getQName(a.namespaceURI, a.localName);
            value = dom.getAttribute(nodeid, qname);
            if (value === undefined) {
                toRemove.push(a);
            }
        }
        l = toRemove.length;
        for (i = 0; i < l; i += 1) {
            element.removeAttributeNode(toRemove[i]);
        }
        l = dom.getAttributeCount(nodeid);
        for (i = 0; i < l; i += 1) {
            qname = dom.getAttributeQName(nodeid, i);
            element.setAttributeNS(qnames.getNamespace(qname),
                    qnames.getLocalName(qname), dom.getAttributeValue(nodeid, i));
        }
    }
    /**
     * @param {!Array.<number>} vdom
     * @param {number} nodeid
     * @param {!Element} element
     */
    function updateAttributes(vdom, nodeid, element) {
        var pos = nodeid + ATTS,
            newAtts = vdom[pos],
            oldAtts = shadow[pos];
        if (newAtts !== oldAtts) {
                attStore.removeAttributes(oldAtts);
            attStore.addAttributes(newAtts);
            shadow[pos] = newAtts;
            updateAllAttributes(nodeid, element);
        }
    }
    /**
     * @param {number} parent
     * @param {!Element} parentNode
     * @param {!Array.<number>} vdom
     */
    function updateElement(parent, parentNode, vdom) {
        var child = vdom[parent + LAST],
            value,
            childNode,
            nextChild = null,
            oldValue,
            text;
        updateAttributes(vdom, parent, parentNode);
        while (child !== 0) {
            childNode = liveNodes[child / NODESSTEP];
            value = vdom[child + VALUE];
            if (value > 0) {
                updateElement(child, /**@type{!Element}*/(childNode), vdom);
            } else {
                // value points to text
                oldValue = shadow[child + VALUE];
                if (oldValue !== value) {
                    text = dom.getText(child);
                    shadow[child + VALUE] = -stringStore.updateString(oldValue, /**@type{string}*/(text));
                    childNode.data = text;
                }
            }
            parentNode.insertBefore(childNode, nextChild);
            nextChild = childNode;
            child = vdom[child + PREV];
        }
        while (parentNode.firstChild && parentNode.firstChild !== nextChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
    }
    /**
     * @param {Event} e
     */
    function eventHandler(e) {
        var i = liveNodes.indexOf(e.target), target;
        if (i !== -1) {
            target = i * NODESSTEP;
            eventProxy.handleEvent(target, e.type, {
                type: e.type,
                target: target
            });
        }
    }
    function updateEventListening() {
        var list = eventProxy.getObservedEvents(), i, l = list.length;
        for (i = 0; i < l; i += 1) {
            documentElement.addEventListener(list[i], eventHandler);
        }
    }
    this.render = function () {
        var textCache = [],
            elementCache = {},
            vdom = dom.getNodesArray();
        removeUnused(vdom, textCache, elementCache);
        createNew(vdom, textCache, elementCache);
        updateElement(dom.getDocumentElement(), documentElement, vdom);
        updateEventListening();
    };
};
