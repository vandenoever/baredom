/*global describe, beforeEach, afterEach, it, expect, baredom, Element*/
function sharedBehaviorForDomBridgeOf(domBridgeCreator) {
    "use strict";
    describe("A DOM bridge", function () {
        var c = {},
            rootNS = "http://example.com",
            rootLocalName = "a";
        beforeEach(function () {
            c.bridge = domBridgeCreator(rootNS, rootLocalName);
            c.vdom = c.bridge.getVirtualDom();
            c.qnames = c.vdom.getQNames();
            c.documentElement = c.vdom.getDocumentElement();
            c.root = c.bridge.getDocumentElement();
        });
        it("has a virtual dom", function () {
            expect(c.vdom).not.toBe(null);
        });
        it("has a real document element", function () {
            expect(c.root).not.toBe(null);
            expect(c.root instanceof Element).toBe(true);
            expect(c.root.namespaceURI).toBe(rootNS);
            expect(c.root.localName).toBe(rootLocalName);
        });
        it("can render an added element", function () {
            var childNS = "http://child.com",
                childLocalName = "c",
                qname = c.qnames.getQName(childNS, childLocalName),
                child;
            c.vdom.insertElement(qname, c.documentElement, 0);
            c.bridge.render();
            child = c.root.firstChild;
            expect(child).not.toBe(null);
            expect(child.localName).toBe(childLocalName);
            expect(child.namespaceURI).toBe(childNS);
        });
        it("can render a removed element", function () {
            var childNS = "http://child.com",
                childLocalName = "c",
                qname = c.qnames.getQName(childNS, childLocalName),
                child;
            child = c.vdom.insertElement(qname, c.documentElement, 0);
            c.bridge.render();
            c.vdom.removeNode(child);
            c.bridge.render();
            expect(c.root.firstChild).toBe(null);
        });
        it("can render an added text", function () {
            var value = "hello";
            c.vdom.insertText(value, c.documentElement, 0);
            c.bridge.render();
            expect(c.root.firstChild.data).toBe(value);
        });
        it("can render a removed text", function () {
            var value = "hello",
                child;
            child = c.vdom.insertText(value, c.documentElement, 0);
            c.bridge.render();
            c.vdom.removeNode(child);
            c.bridge.render();
            expect(c.root.firstChild).toBe(null);
        });
        it("can render a changed text", function () {
            var value1 = "hello",
                value2 = "hi",
                node,
                child;
            child = c.vdom.insertText(value1, c.documentElement, 0);
            c.bridge.render();
            node = c.root.firstChild;
            c.vdom.setText(child, value2);
            c.bridge.render();
            expect(c.root.firstChild).toBe(node);
            expect(c.root.childNodes.length).toBe(1);
            expect(node.data).toBe(value2);
        });
        it("can render swapped nodes", function () {
            var childNS = "http://child.com",
                childLocalName = "c1",
                node1,
                node2,
                qname = c.qnames.getQName(childNS, childLocalName),
                child1;
            child1 = c.vdom.insertElement(qname, c.documentElement, 0);
            c.vdom.insertText("hello", c.documentElement, 0);
            c.bridge.render();
            node1 = c.root.firstChild;
            node2 = c.root.lastChild;
            c.vdom.moveNode(child1, c.documentElement, 0); // move to the end
            c.bridge.render();
            expect(c.root.firstChild).toBe(node2);
            expect(c.root.lastChild).toBe(node1);
        });
        it("can render swapped elements", function () {
            var childNS = "http://child.com",
                childLocalName1 = "c1",
                childLocalName2 = "c2",
                node1,
                node2,
                qname = c.qnames.getQName(childNS, childLocalName1),
                child1;
            child1 = c.vdom.insertElement(qname, c.documentElement, 0);
            qname = c.qnames.getQName(childNS, childLocalName2);
            c.vdom.insertElement(qname, c.documentElement, 0);
            c.bridge.render();
            node1 = c.root.firstChild;
            node2 = c.root.lastChild;
            c.vdom.moveNode(child1, c.documentElement, 0); // move to the end
            c.bridge.render();
            expect(c.root.firstChild).toBe(node2);
            expect(c.root.lastChild).toBe(node1);
        });
        it("can render moved elements", function () {
            var childNS = "http://child.com",
                childLocalName1 = "c1",
                childLocalName2 = "c2",
                node1,
                node2,
                qname = c.qnames.getQName(childNS, childLocalName1),
                child1,
                child2;
            child1 = c.vdom.insertElement(qname, c.documentElement, 0);
            qname = c.qnames.getQName(childNS, childLocalName2);
            child2 = c.vdom.insertElement(qname, c.documentElement, 0);
            c.bridge.render();
            node1 = c.root.firstChild;
            node2 = c.root.lastChild;
            c.vdom.moveNode(child1, child2, 0); // move to the end
            c.bridge.render();
            expect(c.root.firstChild).toBe(node2);
            expect(node2.lastChild).toBe(node1);
        });
        it("can render a new attribute", function () {
            var attNS = "http://att.com",
                attLocalName = "a",
                value = "hi",
                qname = c.qnames.getQName(attNS, attLocalName);
            c.vdom.setAttribute(c.documentElement, qname, value);
            expect(c.root.attributes.length).toBe(0);
            c.bridge.render();
            expect(c.root.attributes.length).toBe(1);
        });
        it("can pass on events", function () {
            var type = "click",
                evt = c.root.ownerDocument.createEvent("MouseEvents"),
                handled = false;
            function handler(e) {
                handled = true;
                expect(e.type).toBe(type);
                expect(e.target).toBe(c.documentElement);
            }
            c.vdom.addEventListener(c.documentElement, type, handler);
            c.bridge.render();
            evt.initMouseEvent(type, true, true, null, 1, 0, 0, 0, 0,
                false, false, false, false, 0, null);
            c.root.dispatchEvent(evt);
            expect(handled).toBe(true);
        });
    });
}
