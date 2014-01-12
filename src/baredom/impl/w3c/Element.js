/*jslint emptyblock: true, unparam: true*/
/*global baredom, console*/

/**
 * @constructor
 * @implements Element
 * @extends baredom.impl.w3c.Node
 * @param {number} nodeid
 * @param {!baredom.impl.w3c.Document} owner
 */
baredom.impl.w3c.Element = function Element(nodeid, owner) {
    "use strict";
    baredom.impl.w3c.Node.call(this, nodeid, owner);
    Object.seal(this);
};
baredom.impl.w3c.Element.prototype = Object.create(baredom.impl.w3c.Node.prototype, {
});
Object.freeze(baredom.impl.w3c.Element);
Object.freeze(baredom.impl.w3c.Element.prototype);
