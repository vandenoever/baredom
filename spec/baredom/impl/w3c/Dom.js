/*global describe, it, expect, beforeEach, baredom, sharedBehaviorForDomOf*/
describe("impl/w3c/Dom", function () {
    "use strict";
    function domCreator(namespace, localName) {
        var qnames = new baredom.impl.QName(),
            qname = qnames.getQName(namespace, localName),
            dom = new baredom.impl.Dom(qnames, qname);
        return dom;
    }
    var qnames, dom, doc, documentElement;
    beforeEach(function () {
        dom = domCreator("urn:a", "a");
        qnames = dom.getQNames();
        doc = new baredom.impl.w3c.Document(dom);
        documentElement = dom.getDocumentElement();
    });
    describe("synchronizes", function () {
        it("from dom to doc.", function () {
            var root = doc.documentElement,
                childNS = "http://child.com",
                childLocalName = "c",
                qname = qnames.getQName(childNS, childLocalName),
                child;
            expect(dom.getFirstChild(documentElement)).toBe(0);
            expect(root instanceof baredom.impl.w3c.Node).toBe(true);
            expect(root instanceof baredom.impl.w3c.Element).toBe(true);
            expect(root.firstChild).toBe(null);
            child = dom.insertElement(qname, documentElement, 0);
            expect(dom.getFirstChild(documentElement)).toBe(child);
            expect(root.firstChild).not.toBe(null);
            expect(root.firstChild).not.toBe(undefined);
            expect(root.firstChild).toBe(root.lastChild);
        });
        it("from doc to dom.", function () {
            var root = doc.documentElement;
            expect(root).not.toBe(null);
            
        });
    });
    describe("has attributes", function () {
        it("that can be instantiated.", function () {
            var att = doc.createAttribute("a");
            expect(att instanceof baredom.impl.w3c.Node).toBe(true);
            expect(att instanceof baredom.impl.w3c.Attr).toBe(true);
            expect(att.ownerDocument).toBe(doc);
            //expect(typeof att.name).toBe("string");
            expect(typeof att.specified).toBe("boolean");
            //expect(typeof att.value).toBe("string");
            expect(att.parentNode).toBe(null);
            expect(att.nextSibling).toBe(null);
            expect(att.previousSibling).toBe(null);
        });
    });
    describe("can add", function () {
        it("an element.", function () {
            var childNS = "http://child.com",
                childLocalName = "c",
                e = doc.createElementNS(childNS, childLocalName);
            expect(e.namespaceURI).toBe(childNS);
            expect(e.localName).toBe(childLocalName);
            doc.documentElement.appendChild(e);
            expect(doc.documentElement.firstChild).toBe(e);
            expect(doc.documentElement.lastChild).toBe(e);
            expect(e.namespaceURI).toBe(childNS);
            expect(e.localName).toBe(childLocalName);
        });
        it("an text.", function () {
            var text = "hello",
                t = doc.createTextNode(text);
            doc.documentElement.appendChild(t);
            expect(doc.documentElement.firstChild).toBe(t);
            expect(doc.documentElement.lastChild).toBe(t);
        });
    });
});
