/*jslint emptyblock: true, unparam: true*/
/*global baredom, console*/

/**
 * @constructor
 * @implements Text
 * @extends baredom.impl.w3c.Node
 * @param {number} nodeid
 * @param {!baredom.impl.w3c.Document} owner
 */
baredom.impl.w3c.Text = function Text(nodeid, owner) {
    "use strict";
    baredom.impl.w3c.Node.call(this, nodeid, 3, owner, null, null);
    Object_seal(this);
};
baredom.impl.w3c.Text.prototype = Object.create(baredom.impl.w3c.Node.prototype, {
});
Object_freeze(baredom.impl.w3c.Text);
Object_freeze(baredom.impl.w3c.Text.prototype);
