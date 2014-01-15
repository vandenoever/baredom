/*global baredom, assert*/
/**
 * @constructor
 * @implements baredom.core.StringStore
 */
baredom.impl.StringStore = function () {
    "use strict";
    var /**@type{!Object.<string,number>}*/
        stringToNumber = {},
        /**@type{!Array.<string>}*/
        numberToString = [""],
        /**@type{!Array.<number>}*/
        instanceCount = [],
        /**@type{!Array.<number>}*/
        emptySlots = [];
    /**
     * Register a new string. Each string gets an id that is larger than 0.
     * @param {string} string
     * @return {number}
     */
    this.addString = function (string) {
        var stringId = stringToNumber[string];
        if (stringId === undefined) {
            if (emptySlots.length > 0) {
                stringId = emptySlots.pop();
            } else {
                stringId = numberToString.length;
            }
            stringToNumber[string] = stringId;
            numberToString[stringId] = string;
            instanceCount[stringId] = 1;
        } else {
            instanceCount[stringId] += 1;
        }
        return stringId;
    };
    /**
     * @param {number} stringId
     */
    this.addStringId = function (stringId) {
        instanceCount[stringId] += 1;
    };
    /**
     * @param {number} stringId
     * @param {string} string
     * @return {number}
     */
    this.updateString = function (stringId, string) {
        var oldString = numberToString[stringId];
        if (oldString !== string) {
            this.removeString(stringId);
            stringId = this.addString(string);
        }
        return stringId;
    };
    /**
     * @param {number} stringId
     */
    this.removeString = function (stringId) {
        var count = instanceCount[stringId],
            string;
        if (count === 1) {
            string = numberToString[stringId];
            delete stringToNumber[string];
            emptySlots.push(stringId);
        } else if (count > 0) {
            instanceCount[stringId] = count - 1;
        }
    };
    /**
     * @param {number} stringId
     * @return {string}
     */
    this.getString = function (stringId) {
        return numberToString[stringId];
    };
};
