/*global describe, beforeEach, afterEach, it, expect*/
function checkDocumentElement(c) {
    "use strict";
    var dom, documentElement;
    beforeEach(function () {
        dom = c.dom;
        documentElement = c.documentElement;
    });
    describe("", function () {
        it("has a document element without parent node.", function () {
            expect(dom.getParentNode(documentElement)).toBe(0);
        });
        it("has a document element without siblings.", function () {
            expect(dom.getPreviousSibling(documentElement)).toBe(0);
            expect(dom.getNextSibling(documentElement)).toBe(0);
        });
    });
}
function sharedBehaviorForDomOf(domCreator) {
    "use strict";
    describe("A DOM document", function () {
        var c = {},
            rootNS = "http://example.com",
            rootLocalName = "a";
        beforeEach(function () {
            c.dom = domCreator(rootNS, rootLocalName);
            c.qnames = c.dom.getQNames();
            c.documentElement = c.dom.getDocumentElement();
        });
        describe("wich is unaltered", function () {
            checkDocumentElement(c);
            it("has the initial root element.", function () {
                var qname = c.dom.getQName(c.documentElement);
                expect(c.qnames.getNamespace(qname)).toBe(rootNS);
                expect(c.qnames.getLocalName(qname)).toBe(rootLocalName);
            });
            it("has no children.", function () {
                expect(c.dom.getFirstChild(c.documentElement)).toBe(0);
                expect(c.dom.getLastChild(c.documentElement)).toBe(0);
            });
        });
        afterEach(function () {
            c = {};
            rootNS = rootLocalName = undefined;
        });
    });
}
