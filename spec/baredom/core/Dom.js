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
            it("can get an element appended to it.", function () {
                var childNS = "http://child.com",
                    childLocalName = "c",
                    qname = c.qnames.getQName(childNS, childLocalName),
                    child;
                child = c.dom.insertElement(qname, c.documentElement, 0);
                expect(c.dom.getFirstChild(c.documentElement)).toBe(child);
                expect(c.dom.getLastChild(c.documentElement)).toBe(child);
                expect(c.dom.getQName(child)).toBe(qname);
                expect(c.dom.getText(child)).toBe(undefined);
            });
            it("can get a text node appended to it.", function () {
                var child, text = "hello";
                child = c.dom.insertText(text, c.documentElement, 0);
                expect(c.dom.getFirstChild(c.documentElement)).toBe(child);
                expect(c.dom.getLastChild(c.documentElement)).toBe(child);
                expect(c.dom.getText(child)).toBe(text);
            });
            it("can get two elements appended to it.", function () {
                var child1NS = "http://child1.com",
                    child2NS = "http://child2.com",
                    child1LocalName = "c",
                    child2LocalName = "d",
                    qname1 = c.qnames.getQName(child1NS, child1LocalName),
                    qname2 = c.qnames.getQName(child2NS, child2LocalName),
                    child1,
                    child2;
                child1 = c.dom.insertElement(qname1, c.documentElement, 0);
                child2 = c.dom.insertElement(qname2, c.documentElement, 0);
                expect(c.dom.getFirstChild(c.documentElement)).toBe(child1);
                expect(c.dom.getLastChild(c.documentElement)).toBe(child2);
                expect(c.dom.getQName(child1)).toBe(qname1);
                expect(c.dom.getQName(child2)).toBe(qname2);
            });
            it("is unchanged after an element has been added and removed.", function () {
                var childNS = "http://child.com",
                    childLocalName = "c",
                    qname = c.qnames.getQName(childNS, childLocalName),
                    child;
                child = c.dom.insertElement(qname, c.documentElement, 0);
                c.dom.removeNode(child);
                expect(c.dom.getFirstChild(c.documentElement)).toBe(0);
                expect(c.dom.getLastChild(c.documentElement)).toBe(0);
            });
            it("is unchanged after a text has been added and removed.", function () {
                var child, text = "hello";
                child = c.dom.insertText(text, c.documentElement, 0);
                c.dom.removeNode(child);
                expect(c.dom.getFirstChild(c.documentElement)).toBe(0);
                expect(c.dom.getLastChild(c.documentElement)).toBe(0);
            });
            it("can get a text node changed.", function () {
                var child, text1 = "hello", text2 = "hi";
                child = c.dom.insertText(text1, c.documentElement, 0);
                c.dom.setText(child, text2);
                expect(c.dom.getText(child)).toBe(text2);
            });
            it("can get a text element, an element and a text appended to it and removed.", function () {
                var childNS = "http://child1.com",
                    childLocalName = "c",
                    qname = c.qnames.getQName(childNS, childLocalName),
                    text1 = "hello",
                    text2 = "hi",
                    child1,
                    child2,
                    child3;
                child1 = c.dom.insertText(text1, c.documentElement, 0);
                child2 = c.dom.insertElement(qname, c.documentElement, 0);
                child3 = c.dom.insertText(text2, c.documentElement, 0);
                expect(c.dom.getFirstChild(c.documentElement)).toBe(child1);
                expect(c.dom.getLastChild(c.documentElement)).toBe(child3);
                expect(c.dom.getText(child1)).toBe(text1);
                expect(c.dom.getQName(child2)).toBe(qname);
                expect(c.dom.getText(child3)).toBe(text2);
            });
        });
        afterEach(function () {
            c = {};
            rootNS = rootLocalName = undefined;
        });
    });
}
