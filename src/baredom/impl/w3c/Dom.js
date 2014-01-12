/*global baredom, assert*/
/**
 * @constructor
 * @implements baredom.core.Dom
 * @param {!baredom.core.QName} qnames
 * @param {number} initialRootQName
 */
baredom.impl.Dom = function (qnames, initialRootQName) {
    "use strict";
    var self = this,
