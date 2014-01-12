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
    baredom.impl.w3c.Node.call(this, nodeid, owner);
    Object.seal(this);
};
baredom.impl.w3c.Text.prototype = Object.create(baredom.impl.w3c.Node.prototype, {
});
Object.freeze(baredom.impl.w3c.Text);
Object.freeze(baredom.impl.w3c.Text.prototype);
