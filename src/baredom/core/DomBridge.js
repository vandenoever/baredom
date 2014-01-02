/*jslint emptyblock: true, unparam: true*/
/*global baredom*/
/**
 * Bridge between virtual and a real dom.
 * A virtual dom can be rendered to a real dom.
 * Actions are performed on the virtual dom and applied in batch to the real
 * dom.
 * @class
 * @interface
 */
baredom.core.DomBridge = function () {"use strict"; };
/**
 * The virtual dom.
 * @return {!baredom.core.Dom}
 */
baredom.core.DomBridge.prototype.getVirtualDom = function () {"use strict"; };
/**
 * The element in the real dom that corresponds to the document element in the
 * virtual dom.
 * @return {!Element}
 */
baredom.core.DomBridge.prototype.getDocumentElement = function () {"use strict"; };
baredom.core.DomBridge.prototype.render = function () {"use strict"; };
