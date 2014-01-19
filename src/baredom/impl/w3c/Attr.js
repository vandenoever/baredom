/*jslint emptyblock: true, unparam: true*/
/*global baredom, console*/

/**
 * @constructor
 * @implements Attr
 * @extends baredom.impl.w3c.Node
 * @param {!baredom.impl.w3c.Document} owner
 * @param {string} namespaceURI
 * @param {string} localName
 */
baredom.impl.w3c.Attr = function Attr(owner, namespaceURI, localName) {
    "use strict";
    baredom.impl.w3c.Node.call(this, 0, 2, owner, namespaceURI, localName);
    Object_seal(this);
};
baredom.impl.w3c.Attr.prototype = Object.create(baredom.impl.w3c.Node.prototype, {
    parentNode: {
        value: null
    },
    previousSibling: {
        value: null
    },
    nextSibling: {
        value: null
    },
    name: {
        /**@this{baredom.impl.w3c.Node}*/
        get: function () {
            "use strict";
            return this.nodeName;
        }
    },
    specified: {
        value: false
    },
    value: {
        /**@this{baredom.impl.w3c.Node}*/
        get: function () {
            "use strict";
            return this.nodeValue;
        }
    },
    ownerElement: {
        value: null
    }
});
if (baredom.impl.w3c.Attr === undefined) {
    /**@type{string}*/
    baredom.impl.w3c.Attr.prototype.name;
    /**@type{boolean}*/
    baredom.impl.w3c.Attr.prototype.specified;
    /**@type{string}*/
    baredom.impl.w3c.Attr.prototype.value;
}
Object_freeze(baredom.impl.w3c.Attr);
Object_freeze(baredom.impl.w3c.Attr.prototype);
