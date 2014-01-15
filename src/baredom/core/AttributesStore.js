/*jslint emptyblock: true, unparam: true*/
/*global baredom*/
/**
 * @class
 * @interface
 */
baredom.core.AttributesStore = function () {"use strict"; };
/**
 * @return {number}
 */
baredom.core.AttributesStore.prototype.addEmptyAttributes = function () {"use strict"; };
/**
 * Register another copy of the given attributes set.
 * @param {number} attributesId
 */
baredom.core.AttributesStore.prototype.addAttributes = function (attributesId) {"use strict"; };
/**
 * @param {number} attributesId
 */
baredom.core.AttributesStore.prototype.removeAttributes = function (attributesId) {"use strict"; };
/**
 * Add a new value to the attribute. This will result in a new attributesId.
 * If value is undefined, the attribute will be removed from the attributes.
 * @param {number} attributesId
 * @param {number} qname
 * @param {string|undefined} value
 * @return {number}
 */
baredom.core.AttributesStore.prototype.setAttribute = function (attributesId, qname, value) {"use strict"; };
/**
 * @param {number} attributesId
 * @param {number} qname
 * @return {string|undefined}
 */
baredom.core.AttributesStore.prototype.getAttribute = function (attributesId, qname) {"use strict"; };
/**
 * @param {number} attributesId
 * @return {number}
 */
baredom.core.AttributesStore.prototype.getAttributeCount = function (attributesId) {"use strict"; };
/**
 * @param {number} attributesId
 * @param {number} attributeId
 * @return {number}
 */
baredom.core.AttributesStore.prototype.getQName = function (attributesId, attributeId) {"use strict"; };
/**
 * @param {number} attributesId
 * @param {number} attributeId
 * @return {string}
 */
baredom.core.AttributesStore.prototype.getValue = function (attributesId, attributeId) {"use strict"; };
