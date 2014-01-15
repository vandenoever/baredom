/*jslint emptyblock: true, unparam: true*/
/**
 * @interface
 * @extends {Node}
 */
function Document() {"use strict"; }
/**
 * @type {DocumentType}
 */
Document.prototype.doctype;
/**
 * @type {!Element}
 */
Document.prototype.documentElement;
/**
 * @type {DOMImplementation}
 */
Document.prototype.implementation;
/**
 * @param {string} name
 * @return {!Attr}
 */
Document.prototype.createAttribute = function (name) {"use strict"; };
/**
 * @param {string} data
 * @return {!Comment}
 */
Document.prototype.createComment = function (data) {"use strict"; };
/**
 * @param {string} data
 * @return {!CDATASection}
 */
Document.prototype.createCDATASection = function (data) {"use strict"; };
/**
 * @return {!DocumentFragment}
 */
Document.prototype.createDocumentFragment = function () {"use strict"; };
/**
 * @param {string} tagName
 * @return {!Element}
 */
Document.prototype.createElement = function (tagName) {"use strict"; };
/**
 * @param {string} namespaceURI
 * @param {string} qualifiedName
 * @return {!Element}
 */
Document.prototype.createElementNS = function (namespaceURI, qualifiedName) {"use strict"; };
/**
 * @param {string} name
 * @return {!EntityReference}
 */
Document.prototype.createEntityReference = function (name) {"use strict"; };
/**
 * @param {string} target
 * @param {string} data
 * @return {!ProcessingInstruction}
 */
Document.prototype.createProcessingInstruction = function (target, data) {"use strict"; };
/**
 * @param {number|string} data
 * @return {!Text}
 */
Document.prototype.createTextNode = function (data) {"use strict"; };
/**
 * @param {string} tagname
 * @return {!NodeList}
 */
Document.prototype.getElementsByTagName = function (tagname) {"use strict"; };
