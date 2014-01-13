/*jslint emptyblock: true, unparam: true*/
/*global baredom*/
/**
 * @interface
 */
function ModificationListener() {"use strict"; }
/**
 * @param {!baredom.core.Dom} dom
 * @param {number} node
 * @return {undefined}
 */
ModificationListener.prototype.aboutToRemoveNode = function (dom, node) {"use strict"; };
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
