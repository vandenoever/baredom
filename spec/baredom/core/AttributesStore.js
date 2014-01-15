/*global describe, beforeEach, afterEach, it, expect*/
function sharedBehaviorForAttributesStoreOf(storeCreator) {
    "use strict";
    describe("An AttributesStore", function () {
        var c = {};
        beforeEach(function () {
            c.store = storeCreator();
        });
        it("can register an empty attributes object", function () {
            var atts = c.store.addEmptyAttributes();
            expect(atts).toBeGreaterThan(0);
            expect(c.store.getAttributeCount(atts)).toBe(0);
            c.store.removeAttributes(atts);
        });
        it("gives the same identifier for all empty attribute sets", function () {
            var atts1 = c.store.addEmptyAttributes(),
                atts2 = c.store.addEmptyAttributes();
            expect(atts1).toBeGreaterThan(0);
            expect(atts2).toBeGreaterThan(0);
            expect(c.store.getAttributeCount(atts1)).toBe(0);
            expect(c.store.getAttributeCount(atts2)).toBe(0);
            expect(atts1).toBe(atts2);
            c.store.removeAttributes(atts1);
            c.store.removeAttributes(atts2);
        });
        it("gives the same identifier for equal attribute sets", function () {
            var atts1 = c.store.addEmptyAttributes(),
                atts2 = c.store.addEmptyAttributes();
            atts1 = c.store.setAttribute(atts1, 1, "");
            atts2 = c.store.setAttribute(atts2, 1, "");
            expect(atts1).toBe(atts2);
            c.store.removeAttributes(atts1);
            c.store.removeAttributes(atts2);
        });
        it("gives the same identifier for equal attribute sets", function () {
            var atts1 = c.store.addEmptyAttributes(),
                atts2 = c.store.addEmptyAttributes();
            atts1 = c.store.setAttribute(atts1, 1, "");
            atts2 = c.store.setAttribute(atts2, 2, "a");
            atts1 = c.store.setAttribute(atts1, 2, "a");
            atts2 = c.store.setAttribute(atts2, 1, "");
            expect(atts1).toBe(atts2);
            expect(c.store.getAttribute(atts1, 2)).toBe("a");
            expect(c.store.getAttribute(atts1, 1)).toBe("");
            atts1 = c.store.setAttribute(atts1, 1, undefined);
            atts2 = c.store.setAttribute(atts2, 1, undefined);
            expect(atts1).toBe(atts2);
            c.store.removeAttributes(atts1);
            c.store.removeAttributes(atts2);
        });
        it("gives different identifiers for different attribute sets", function () {
            var atts1 = c.store.addEmptyAttributes(),
                atts2 = c.store.addEmptyAttributes();
            atts1 = c.store.setAttribute(atts1, 1, "");
            expect(atts1).not.toBe(atts2);
            c.store.removeAttributes(atts1);
            c.store.removeAttributes(atts2);
        });
        it("gives different identifiers for different attribute sets", function () {
            var atts1 = c.store.addEmptyAttributes(),
                atts2 = c.store.addEmptyAttributes();
            atts1 = c.store.setAttribute(atts1, 1, "");
            atts2 = c.store.setAttribute(atts2, 1, "a");
            expect(atts1).not.toBe(atts2);
            c.store.removeAttributes(atts1);
            c.store.removeAttributes(atts2);
        });
        it("can have an attribute removed", function () {
            var atts = c.store.addEmptyAttributes();
            atts = c.store.setAttribute(atts, 1, "");
            atts = c.store.setAttribute(atts, 1, undefined);
            expect(c.store.getAttributeCount(atts)).toBe(0);
            c.store.removeAttributes(atts);
        });
        it("can have an attribute changed", function () {
            var atts = c.store.addEmptyAttributes();
            atts = c.store.setAttribute(atts, 1, "");
            atts = c.store.setAttribute(atts, 1, "a");
            expect(c.store.getAttributeCount(atts)).toBe(1);
            expect(c.store.getAttribute(atts, 1)).toBe("a");
            c.store.removeAttributes(atts);
        });
        it("can have an attribute set twice", function () {
            var atts = c.store.addEmptyAttributes(), a;
            a = atts = c.store.setAttribute(atts, 1, "a");
            atts = c.store.setAttribute(atts, 1, "a");
            expect(atts).toBe(a);
            expect(c.store.getAttributeCount(atts)).toBe(1);
            expect(c.store.getAttribute(atts, 1)).toBe("a");
            c.store.removeAttributes(atts);
        });
        afterEach(function () {
            c = {};
        });
    });
}
