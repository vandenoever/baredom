/*global describe, beforeEach, afterEach, it, expect*/
function sharedBehaviorForDomBridgeOf(domBridgeCreator) {
    "use strict";
    describe("A DOM bridge", function () {
        var c = {},
            rootNS = "http://example.com",
            rootLocalName = "a";
        beforeEach(function () {
            c.bridge = domBridgeCreator(rootNS, rootLocalName);
        });
        it("has a virtual dom.", function () {
            var vdom = c.bridge.getVirtualDom();
            expect(vdom).not.toBe(null);
        });
        it("has a real document element.", function () {
            var element = c.bridge.getDocumentElement();
            expect(element).not.toBe(null);
        });
    });
}
