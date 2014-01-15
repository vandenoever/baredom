/*jslint emptyblock: true, unparam: true*/
/*global baredom*/
/**
 * Interface to an XML document.
 * @class
 * @interface
 * @extends baredom.core.ReadOnlyDom
 */
baredom.core.EventTargetDom = function () {"use strict"; };
/**
 * @param {!Object} event
 * @return {undefined}
 */
baredom.core.EventTargetDom.prototype.getObservedEvents = function (event) {"use strict"; };
/**
 * @param {!Object} event
 * @return {undefined}
 */
baredom.core.EventTargetDom.prototype.handleEvent = function (event) {"use strict"; };
