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
        it("can exchange two nodes.", function () {
            var childNS = "http://child1.com",
                childLocalName = "c",
                qname = c.qnames.getQName(childNS, childLocalName),
                text1 = "hello",
                child1,
                child2;
            child1 = c.dom.insertText(text1, c.documentElement, 0);
            child2 = c.dom.insertElement(qname, c.documentElement, 0);
            c.dom.moveNode(child1, c.documentElement, child2);
            expect(c.dom.getFirstChild(c.documentElement)).toBe(child1);
            expect(c.dom.getLastChild(c.documentElement)).toBe(child2);
            c.dom.moveNode(child2, c.documentElement, child1);
            expect(c.dom.getFirstChild(c.documentElement)).toBe(child2);
            expect(c.dom.getLastChild(c.documentElement)).toBe(child1);
        });
        it("can move a child out of a node.", function () {
            var childNS = "http://child1.com",
                childLocalName = "c",
                qname = c.qnames.getQName(childNS, childLocalName),
                text1 = "hello",
                child1,
                child2;
            child1 = c.dom.insertElement(qname, c.documentElement, 0);
            child2 = c.dom.insertText(text1, child1, 0);
            c.dom.moveNode(child2, c.documentElement, child1);
            expect(c.dom.getFirstChild(c.documentElement)).toBe(child2);
            expect(c.dom.getLastChild(c.documentElement)).toBe(child1);
        });
        it("can clone a node.", function () {
            var childNS = "http://child1.com",
                childLocalName = "c",
                qname = c.qnames.getQName(childNS, childLocalName),
                text1 = "hello",
                child1,
                child2,
                child3;
            child1 = c.dom.insertElement(qname, c.documentElement, 0);
            c.dom.insertText(text1, child1, 0);
            child2 = c.dom.cloneNode(child1, c.documentElement, child1);
            child3 = c.dom.getFirstChild(child2);
            expect(c.dom.getText(child3)).toBe(text1);
        });
        it("cannot add a child to a text.", function () {
            var childNS = "http://child1.com",
                childLocalName = "c",
                qname = c.qnames.getQName(childNS, childLocalName),
                text1 = "hello",
                child1,
                threw;
            child1 = c.dom.insertText(text1, c.documentElement, 0);
            try {
                c.dom.insertElement(qname, child1, 0);
            } catch (e) {
                threw = true;
            }
            expect(threw).toBe(true);
        });
        it("can remove a node and its children.", function () {
            var childNS = "http://child1.com",
                childLocalName = "c",
                qname = c.qnames.getQName(childNS, childLocalName),
                text1 = "hello",
                child1;
            child1 = c.dom.insertElement(qname, c.documentElement, 0);
            c.dom.insertText(text1, child1, 0);
            c.dom.insertElement(qname, child1, 0);
            c.dom.removeNode(child1);
            expect(c.dom.getFirstChild(c.documentElement)).toBe(0);
            expect(c.dom.getLastChild(c.documentElement)).toBe(0);
        });
        it("can change the QName on an element.", function () {
            var childNS1 = "http://child1.com",
                childNS2 = "http://child2.com",
                childLocalName1 = "c",
                childLocalName2 = "c",
                qname1 = c.qnames.getQName(childNS1, childLocalName1),
                qname2 = c.qnames.getQName(childNS2, childLocalName2),
                child;
            child = c.dom.insertElement(qname1, c.documentElement, 0);
            c.dom.setQName(child, qname2);
            expect(c.dom.getQName(child)).toBe(qname2);
        });
        it("can get an attribute set on the document element.", function () {
            var attNS = "http://att.com",
                attLocalName = "att",
                attValue = "hello",
                qname = c.qnames.getQName(attNS, attLocalName);
            expect(c.dom.getAttributeCount(c.documentElement)).toBe(0);
            c.dom.setAttribute(c.documentElement, qname, attValue);
            expect(c.dom.getAttributeQName(c.documentElement, 0)).toBe(qname);
            expect(c.dom.getAttributeValue(c.documentElement, 0)).toBe(attValue);
            expect(c.dom.getAttribute(c.documentElement, qname)).toBe(attValue);
            expect(c.dom.getAttributeCount(c.documentElement)).toBe(1);
            c.dom.setAttribute(c.documentElement, qname, undefined);
            expect(c.dom.getAttribute(c.documentElement, qname)).toBe(undefined);
            expect(c.dom.getAttributeCount(c.documentElement)).toBe(0);
        });
        it("can get two attributes set on the document element.", function () {
            var att1NS = "http://att1.com",
                att2NS = "http://att2.com",
                att1LocalName = "att1",
                att2LocalName = "att2",
                att1Value = "hello",
                att2Value = "hi",
                qname1 = c.qnames.getQName(att1NS, att1LocalName),
                qname2 = c.qnames.getQName(att2NS, att2LocalName);
            c.dom.setAttribute(c.documentElement, qname1, att1Value);
            c.dom.setAttribute(c.documentElement, qname2, att2Value);
            expect(c.dom.getAttributeCount(c.documentElement)).toBe(2);
            c.dom.setAttribute(c.documentElement, qname1, undefined);
            expect(c.dom.getAttributeCount(c.documentElement)).toBe(1);
        });
        afterEach(function () {
            c = {};
            rootNS = rootLocalName = undefined;
        });
    });
}
