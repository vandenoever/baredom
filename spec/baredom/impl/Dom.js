/*global describe, baredom, expect, it, sharedBehaviorForDomOf*/
describe("impl/Dom", function () {
    "use strict";
    function domCreator(namespace, localName) {
        var qnames = new baredom.impl.QName(),
            qname = qnames.getQName(namespace, localName),
            dom = new baredom.impl.Dom(qnames, qname);
        return dom;
    }
    sharedBehaviorForDomOf(domCreator);
});
