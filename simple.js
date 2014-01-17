/*global console*/
function log(msg) {
//    console.log(msg);
}
function countSiblings(n) {
    "use strict";
    var c = 0;
    do {
        n = n.nextSibling;
        c += 1;
    } while (n);
    return c;
}
function countDeepChildren(n) {
    "use strict";
    var c = 1;
    n = n.firstChild;
    while (n) {
        c += 1 + countDeepChildren(n);
        n = n.nextSibling;
    }
    return c - 1;
}
function print(node, depth) {
    "use strict";
    depth = depth || 0;
    var i, s = "";
    for (i = 0; i < depth; i += 1) {
        s += " ";
    }
    s += node.localName || node.data;
    log(s);
    i = node.firstChild;
    while (i) {
        print(i, depth + 1);
        i = i.nextSibling;
    }
}
function checkNode(node) {
    "use strict";
/*
    var nodes = [],
        c = node.firstChild;
    while (c) {
        checkNode(c);
        nodes.push(c);
        c = c.nextSibling;
    }
    if (nodes.length > 1 && node.firstChild === node.lastChild) {
        throw "Invalid node!";
    }
    c = node.lastChild;
    while (c) {
        if (c !== nodes.pop()) {
            throw "Invalid node!";
        }
        c = c.previousSibling;
    }
*/
}
function Simple(rootNamespaceURI, rootLocalName) {
    "use strict";
    var self = this;

    function Element(doc, namespaceURI, localName) {
        this.nodeType = 1;
        this.namespaceURI = namespaceURI;
        this.localName = localName;
        this.ownerDocument = doc;
        this.firstChild = null;
        this.lastChild = null;
        this.previousSibling = null;
        this.nextSibling = null;
        this.parentNode = null;
        this.markDirty = function () {
            var n = this;
            while (n && !n.dirty) {
                n.dirty = true;
                n = n.parentNode;
            }
        };
        this.removeChild = function (node) {
//console.log("> removeChild " + countDeepChildren(doc.documentElement));
            // assume node.parentNode === this
            if (node.parentNode !== this) {
                throw "Removing from non-parent node.";
            }
            if (node.nextSibling) {
                node.nextSibling.previousSibling = node.previousSibling;
            } else {
                this.lastChild = node.previousSibling;
            }
            if (node.previousSibling) {
                node.previousSibling.nextSibling = node.nextSibling;
            } else {
                this.firstChild = node.nextSibling;
            }
            node.parentNode = null;
            node.nextSibling = null;
            node.previousSibling = null;
            this.markDirty();
            checkNode(this);
//console.log("< removeChild " + countDeepChildren(doc.documentElement));
        };
        this.insertBefore = function (node, ref) {
//console.log("> insertBefore " + countDeepChildren(doc.documentElement));
            var p = node.parentNode;
            if (p) {
                p.removeChild(node);
            }
            node.parentNode = this;
            if (ref) {
                p = ref.previousSibling;
                if (p) {
                    node.previousSibling = p;
                    p.nextSibling = node;
                } else {
                    this.firstChild = node;
                }
                ref.previousSibling = node;
                node.nextSibling = ref;
            } else {
                if (!this.firstChild) {
                    this.firstChild = node;
                }
                node.previousSibling = this.lastChild;
                if (this.lastChild) {
                    this.lastChild.nextSibling = node;
                }
                node.nextSibling = null;
                this.lastChild = node;
            }
            this.markDirty();
            checkNode(this);
//console.log("< insertBefore " + countDeepChildren(doc.documentElement));
        };
        this.appendChild = function (node) {
//console.log("> appendChild " + countDeepChildren(doc.documentElement));
            var p = node.parentNode;
            if (p) {
                p.removeChild(node);
            }
            node.parentNode = this;
            if (!this.firstChild) {
                this.firstChild = node;
            }
            node.previousSibling = this.lastChild;
            if (this.lastChild) {
                this.lastChild.nextSibling = node;
            }
            node.nextSibling = null;
            this.lastChild = node;
            this.markDirty();
            checkNode(this);
//console.log("< appendChild " + countDeepChildren(doc.documentElement));
        };
    }
    function TextNode(doc, text) {
        this.nodeType = 3;
        this.data = text;
        this.ownerDocument = doc;
        this.firstChild = null;
        this.lastChild = null;
        this.previousSibling = null;
        this.nextSibling = null;
        this.parentNode = null;
    }
    this.createTextNode = function (text) {
        return new TextNode(self, text);
    };
    this.createElementNS = function (namespaceURI, localName) {
        return new Element(self, namespaceURI, localName);
    };
    this.documentElement = this.createElementNS(rootNamespaceURI, rootLocalName);
}
function SimpleBridge(vroot, root) {
    "use strict";
    var doc = root.ownerDocument;

    function createShadow(vn) {
        var n;
        if (vn.localName) {
            n = doc.createElementNS(vn.namespaceURI, vn.localName);
        } else {
            n = doc.createTextNode(vn.data);
        }
        return n;
    }
    function removeChildren(node) {
        // remove starting from last to, perhaps, have less layout overhead
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    }
    function removeNextSiblings(node) {
        var p = node.parentNode;
        while (p.lastChild !== node) {
            p.removeChild(p.lastChild);
        }
    }
    /**
     * Update the live dom nodes with information from the virtual dom.
     * The layout happens depth first along the first child node.
     * Subsequenctly, it updates the siblings from top to bottom.
     * Going in this direction should minimize layout overhead.
     */
    function renderSiblings(vn, depth) {
        var n, s;

        do {
            s = vn.shadow;
            if (vn.nodeType === 3) {
                // update the text
                if (vn.shadowData !== vn.data) {
                    s.data = vn.shadowData = vn.data;
                }
            } else { // nodeType === 1
                // check if the first child is up to date
                n = vn.firstChild;
                if (n) {
                    if (!n.shadow) {
                        // create a shadow node
                        n.shadow = createShadow(n);
                    }
                    if (s.firstChild !== n.shadow) {
                        // replace the first child shadow with the new one
                        s.insertBefore(n.shadow, s.firstChild);
                        renderSiblings(n, depth + 1);
                    } else {
                        renderSiblings(n, depth + 1);
                    }
                } else if (s.firstChild) {
                    removeChildren(s);
                }
            }
            // check if the next sibling is up to date
            n = vn.nextSibling;
            if (n) {
                if (!n.shadow) {
                    n.shadow = createShadow(n);
                }
                if (s.nextSibling !== n.shadow) {
                    s.parentNode.insertBefore(n.shadow, s.nextSibling);
                }
            } else if (s.nextSibling) {
                removeNextSiblings(s);
            }
            vn = n;
        } while (vn);
    }

    this.render = function render() {
log("render");
        var a, b;
        vroot.shadow = root;
        print(vroot);
        print(root);
        renderSiblings(vroot, 0);
        a = countDeepChildren(vroot);
        b = countDeepChildren(root);
log(">>>>>");
            print(vroot);
            print(root);
log("<<<<<");
        if (a !== b) {
            console.log("Unequal amounts of nodes: " + a + " " + b + ".");
            //throw "Unequal amounts of nodes: " + a + " " + b + ".";
        }
    };
}
