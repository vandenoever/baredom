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
        eventProxy = dom.getEventProxy();
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
                textCache.push(liveNodes[j]);
                liveNodes[j] = null;
            } else if (shadowValue > 0 && shadowValue !== value) {
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
                }
                liveNodes[j] = node;
            }
        }
    }
    /**
     * @param {number} nodeid
     * @param {!Element} element
     */
    function updateAttributes(nodeid, element) {
        // stupid implementation updates all attributes
        var atts = element.attributes, value, i, l, qname, a, toRemove = [];
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
     * @param {number} parent
     * @param {!Element} parentNode
     * @param {!Array.<number>} vdom
     */
    function updateNode(parent, parentNode, vdom) {
        var child = vdom[parent + LAST],
            value,
            childNode,
            nextChild = null,
            text;
        updateAttributes(parent, parentNode);
        while (child !== 0) {
            childNode = liveNodes[child / NODESSTEP];
            value = vdom[child + VALUE];
            if (value > 0) {
                updateNode(child, /**@type{!Element}*/(childNode), vdom);
            } else {
                text = dom.getText(child);
                childNode.data = text;
                shadow[child + VALUE] = value;
            }
            parentNode.insertBefore(childNode, nextChild);
            nextChild = childNode;
            child = vdom[child + PREV];
        }
        while (parentNode.firstChild !== nextChild) {
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
        updateNode(dom.getDocumentElement(), documentElement, vdom);
        updateEventListening();
    };
};
