/*jslint emptyblock: true, unparam: true*/
/*global baredom*/

/**
 * @constructor
 * @implements NodeList
 */
baredom.impl.w3c.NodeList = function Node() {
    "use strict";
};
baredom.impl.w3c.NodeList.prototype = {
    get length() {
        "use strict";
        return 0;
    },
    item: function (index) {
        return null;
    }
};
Object.freeze(baredom.impl.w3c.NodeList);
Object.freeze(baredom.impl.w3c.NodeList.prototype);
