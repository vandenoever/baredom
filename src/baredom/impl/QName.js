/*global baredom, assert*/
/**
 * @constructor
 * @implements baredom.core.QName
 */
baredom.impl.QName = function () {
    "use strict";
    var /**@type{!Object.<(string|null),!Object.<string,number>>}*/
        qnames = {},
        /**@type{!Array.<(string)>}*/
        namespaces = [],
        /**@type{!Array.<(string)>}*/
        names = [];
    /**
     * @param {string|null} ns
     * @param {string} name
     * @return {number}
     */
    this.getQName = function (ns, name) {
        var /**@type{!Object.<string,number>}*/
            n,
            /**@type{number}*/
            qname = 0;
        if (qnames.hasOwnProperty(ns)) {
            n = qnames[ns];
        } else {
            qnames[ns] = n = {};
        }
        if (n.hasOwnProperty(name)) {
            qname = /**@type{number}*/(n[name]);
        } else {
            namespaces.push(ns);
            names.push(name);
            qname = namespaces.length;
        }
        return qname;
    };
    /**
     * @param {number} qname
     * @return {string}
     */
    this.getNamespace = function (qname) {
        qname -= 1;
        assert(qname >= 0 && qname < namespaces.length, "QName out of range.");
        return namespaces[qname];
    };
    /**
     * @param {number} qname
     * @return {string}
     */
    this.getLocalName = function (qname) {
        qname -= 1;
        assert(qname >= 0 && qname < namespaces.length, "QName out of range.");
        return names[qname];
    };
};
