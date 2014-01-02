/*global baredom, assert*/
/**
 * @constructor
 * @implements baredom.core.DomBridge
 * @param {!baredom.core.Dom} dom
 * @param {!Element} documentElement
 */
baredom.impl.DomBridge = function (dom, documentElement) {
    "use strict";
    var self = this;
    /**
     * @return {!baredom.core.Dom}
     */
    this.getVirtualDom = function () {
        return dom;
    };
    /**
     * @return {!Element}
     */
    this.getDocumentElement = function () {
        return documentElement;
    };
    this.render = function () {
    };
};
