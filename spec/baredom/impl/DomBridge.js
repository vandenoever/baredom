/*global describe, baredom, sharedBehaviorForDomBridgeOf, document*/
describe("impl/DomBridge", function () {
    "use strict";
    function domBridgeCreator(namespace, localName) {
        var qnames = new baredom.impl.QName(),
            qname = qnames.getQName(namespace, localName),
            dom = new baredom.impl.Dom(qnames, qname),
            element = document.createElementNS(namespace, localName),
            bridge = new baredom.impl.DomBridge(dom, element);
        return bridge;
    }
    sharedBehaviorForDomBridgeOf(domBridgeCreator);
});
