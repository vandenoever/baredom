/*jslint emptyblock: true, unparam: true*/
/*global baredom*/
/**
 * @interface
 */
function ModificationListener() {"use strict"; }
/**
 * Enum for ModificationListener types.
 * @enum {number}
 */
ModificationListener.Type = {
    INSERTELEMENT: 0,
    INSERTTEXT: 1,
    REMOVENODE: 2,
    MOVENODE: 3
};
/**
 * @param {!baredom.core.Dom} dom
 * @param {number} node
 * @return {undefined}
 */
ModificationListener.prototype.nodeInserted = function (dom, node) {"use strict"; };
/**
 * @param {!baredom.core.Dom} dom
 * @param {number} node
 * @param {number} oldParent
 * @param {number} oldPrev
 * @param {number} oldNext
 * @return {undefined}
 */
ModificationListener.prototype.nodeRemoved = function (dom, node, oldParent, oldPrev, oldNext) {"use strict"; };
/**
 * @param {!baredom.core.Dom} dom
 * @param {number} node
 * @param {number} oldParent
 * @param {number} oldPrev
 * @param {number} oldNext
 * @return {undefined}
 */
ModificationListener.prototype.nodeMoved = function (dom, node, oldParent, oldPrev, oldNext) {"use strict"; };
/**
 * @param {!baredom.core.Dom} dom
 * @param {!ModificationListener.Type} type
 * @param {number} node
 * @return {undefined}
 */
ModificationListener.prototype.handleEvent = function (dom, type, node) {"use strict"; };
/**
 * @class
 * @interface
 * @extends baredom.core.Dom
 */
baredom.core.ObservableDom = function ObservableDom() {"use strict"; };
/**
 * Add a listener for dom modifications.
 * @param {ModificationListener} listener
 */
baredom.core.ObservableDom.prototype.addModificationListener = function (listener) {"use strict"; };
/**
 * Add a listener for dom modifications.
 * @param {ModificationListener} listener
 */
baredom.core.ObservableDom.prototype.removeModificationListener = function (listener) {"use strict"; };
