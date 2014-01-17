/*global baredom, document, window, console, Simple, SimpleBridge*/
/*jslint emptyblock: true*/
/**
Compare different speeds of dom operations.
A collection of dom operations will be performed. The operations are triggered by frequent timers (e.g. at 1 ms intervals.
The rendering has a number of options:

method: 0) normal browser DOM
        1) bare DOM
        2) w3 dom on top of bare DOM
        3) periodic clone from shadow browser dom document
setup: function that receives a div element and returns an object that can be
       passed to the trigger function
trigger: function that modifies the dom (chosen based on method)
triggerinterval: ms between trigger calls
renderinterval: if applicable, this 
**/

function baredomInitialize(state) {
    "use strict";
    var vdom = state.bridge.getVirtualDom(),
        root = vdom.getDocumentElement(),
        nodes = state.nodes,
        qname = state.divQName,
        loops = state.loops,
        i,
        r;
    for (i = 0; i < loops; i += 1) {
        r = Math.random();
        if (i % 5) {
            nodes[i] = vdom.insertText(r + " ", root, 0);
        } else {
            nodes[i] = vdom.insertElement(qname, root, 0);
        }
    }
}
function addNode(doc, ns, nodes, max, root, pos) {
    "use strict";
    var r, j, n, m;
    r = Math.random();
    j = pos || Math.floor(r * max);
    n = nodes[j];
    if (n) {
        while (n.firstChild) {
            n.parentNode.insertBefore(n.firstChild, n);
        }
        n.parentNode.removeChild(n);
    }
    if (j % 40 === 0) {
        n = doc.createElementNS(ns, "div");
    } else if (j % 2) {
        n = doc.createElementNS(ns, "span");
    } else {
        n = doc.createTextNode(r + " ");
    }
    nodes[j] = n;
    m = nodes[(j + 1) % max];
    m = (m && m !== n) ? m : root;
    if (m.data) {
        m.parentNode.insertBefore(n, m);
    } else {
        m.appendChild(n);
    }
}
function domInitialize(state) {
    "use strict";
    var root = state.root,
        ns = root.namespaceURI,
        doc = root.ownerDocument,
        nodes = state.nodes,
        loops = state.loops,
        i;
    for (i = 0; i < loops; i += 1) {
        addNode(doc, ns, nodes, i, root, i);
    }
}
function addBareNode(doc, ns, nodes, max, root) {
    "use strict";
    var r, j, n, m;
    r = Math.random();
    j = Math.floor(r * max);
    n = nodes[j];
    if (n) {
        while (n.firstChild) {
            n.parentNode.insertBefore(n.firstChild, n);
        }
        n.parentNode.removeChild(n);
    }
    if (j % 40 === 0) {
        n = doc.createElementNS(ns, "div");
    } else if (j % 2) {
        n = doc.createElementNS(ns, "span");
    } else {
        n = doc.createTextNode(r + " ");
    }
    nodes[j] = n;
    m = nodes[(j + 1) % max];
    m = (m && m !== n) ? m : root;
    if (m.data) {
        m.parentNode.insertBefore(n, m);
    } else {
        m.appendChild(n);
    }
}
function baredomTrigger(state) {
    "use strict";
    var vdom = state.bridge.getVirtualDom(),
        root = vdom.getDocumentElement(),
        nodes = state.nodes,
        qname = state.divQName,
        loops = state.loops,
        change = Math.round(loops * state.change / 100),
        i,
        j,
        n,
        r;
    for (i = 0; i < change; i += 1) {
        r = Math.random();
        j = Math.floor(r * loops);
        n = nodes[j];
        if (n) {
            vdom.removeNode(n);
        }
        n = nodes[j + 1] || 0;
        if (j % 5) {
            nodes[j] = vdom.insertText(r + " ", root, n);
        } else {
            nodes[j] = vdom.insertElement(qname, root, n);
        }
    }
}
/**
 * return true if a is contained in b
 */
function contains(a, b) {
    "use strict";
    while (a !== b && a.parentNode) {
        a = a.parentNode;
    }
    return a === b;
}
function domTrigger(state) {
    "use strict";
    var root = state.root,
        ns = root.namespaceURI,
        doc = root.ownerDocument,
        nodes = state.nodes,
        loops = state.loops,
        change = Math.round(loops * state.change / 100) || 1,
        i;
    for (i = 0; i < change; i += 1) {
        addNode(doc, ns, nodes, loops, root);
    }
}
function detachedDomTrigger(state) {
    "use strict";
    var root = state.root,
        parent = root.parentNode,
        next = root.nextSibling;
    parent.removeChild(root);
    domTrigger(state);
    parent.insertBefore(root, next);
}
// trigger for modifying the bare dom
/**
 * @param {!Element} div
 */
function baredomSetup(div, loops, change) {
    "use strict";
    var qnames = new baredom.impl.QName(),
        qname = qnames.getQName(document.body.namespaceURI, "div"),
        vdom = new baredom.impl.Dom(qnames, qname),
        bridge = new baredom.impl.DomBridge(vdom, div),
        state = {bridge: bridge, nodes: [], divQName: qname, loops: loops, change: change};
    baredomInitialize(state);
    return state;
}
/**
 * @param {!Element} div
 */
function w3baredomSetup(div, loops, change) {
    "use strict";
    var bridge = baredomSetup(div).bridge,
        doc = new baredom.impl.w3c.Document(bridge.getVirtualDom()),
        documentElement = doc.documentElement,
        state = {bridge: bridge, root: documentElement, loops: loops, change: change, nodes: []};
    baredomInitialize(state);
    return state;
}
/**
 * @param {!Element} div
 */
function domSetup(div, loops, change) {
    "use strict";
    var state = {root: div, loops: loops, change: change, nodes: []};
    domInitialize(state);
    return state;
}
/**
 * @param {!Element} div
 */
function cloneSetup(div, loops, change) {
    "use strict";
    var state = {root: div.cloneNode(true), loops: loops, change: change, nodes: [], live: div};
    domInitialize(state);
    return state;
}
/**
 * @param {!Element} div
 */
function importSetup(div, loops, change) {
    "use strict";
    var ns = div.namespaceURI,
        doc = div.ownerDocument.implementation.createDocument(ns, "", div.ownerDocument.docType),
        root = doc.createElementNS(div.namespaceURI, div.localName),
        state = {root: root, loops: loops, change: change, nodes: [], live: div};
    domInitialize(state);
    return state;
}
function simpleSetup(div, loops, change) {
    "use strict";
    var root = new Simple(div.namespaceURI, div.localName),
        bridge = new SimpleBridge(root.documentElement, div),
        state = {bridge: bridge, root: root.documentElement, loops: loops, change: change, nodes: []};
    domInitialize(state);
    return state;
}
function dummySetup(div, loops, change) {
    "use strict";
    var root = {};
    root.createTextNode = function () { return root; };
    root.createElementNS = function () { return root; };
    root.removeChild = function () {};
    root.insertBefore = function () {};
    root.parentNode = root;
    root.ownerDocument = root || div;
    return {root: root, loops: loops, change: change, nodes: []};
}
function baredomRender(state) {
    "use strict";
    state.bridge.render();
}
function cloneRender(state) {
    "use strict";
    var div = state.live,
        clone = state.root.cloneNode(true);
    div.parentNode.replaceChild(clone, div);
    state.live = clone;
}
function importRender(state) {
    "use strict";
    var div = state.live,
        doc = div.ownerDocument,
        clone = doc.importNode(state.root, true);
    div.parentNode.replaceChild(clone, div);
    state.live = clone;
}
function simpleRender(state) {
    "use strict";
    state.bridge.render();
}

function setupForm(body, options) {
    "use strict";
    var div = document.createElement("div"),
        runStart,
        triggerCalls,
        triggerCallDuration,
        renderCalls,
        renderCallDuration,
        root = document.createElement("div"),
        engineObject,
        engine,
        triggerInterval,
        renderInterval,
        animationFrame,
        stopped = true,
        infoDiv = document.createElement("div");
    options.loops = options.loops || 5000;
    options.change = options.change || 10;
    infoDiv.appendChild(document.createTextNode(""));
    function updateInfo() {
        var duration = new Date().getTime() - runStart;
        infoDiv.firstChild.data = "nodes: " + options.loops + ", % change: "
            + options.change + ", trigger: "
            + Math.round(triggerCallDuration / triggerCalls) + " ms, render: "
            + Math.round(renderCallDuration / renderCalls) + " ms, "
            + Math.round(100 * (triggerCallDuration + renderCallDuration) / duration) + "% cpu, "
            + Math.round(triggerCalls * 1000 / duration) + " triggers per second, "
            + Math.round(renderCalls * 1000 / duration) + " renders per second.";
    }
    function stop() {
        stopped = true;
        window.clearInterval(triggerInterval);
        window.clearInterval(renderInterval);
        if (window.cancelAnimationFrame) {
            window.cancelAnimationFrame(animationFrame);
        }
    }
    function trigger() {
        var time = new Date().getTime();
        engine.trigger(engineObject);
        time = new Date().getTime() - time;
        triggerCalls += 1;
        triggerCallDuration += time;
    }
    function render() {
        var time = new Date().getTime();
        engine.render(engineObject);
        if (countDeepChildren(root) !== options.loops) {
console.log(countDeepChildren(root));
console.log(root);
            stop();
        }
        time = new Date().getTime() - time;
        renderCalls += 1;
        renderCallDuration += time;
        updateInfo();
        if (!options.renderInterval && window.requestAnimationFrame && !stopped) {
            animationFrame = window.requestAnimationFrame(render);
        }
        root = div.lastChild;
    }
    function restart() {
        stop();
        if (engine.name === "stop") {
            return;
        }
        stopped = false;
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
        engineObject = engine.setup(root, options.loops, options.change);
        render();
/*
        if (root.childNodes.length !== options.loops) {
console.log(root.childNodes.length);
console.log(root);
            return stop();
        }
*/
        runStart = new Date().getTime();
        triggerCalls = triggerCallDuration = 0;
        renderCalls = renderCallDuration = 0;
        triggerInterval = window.setInterval(trigger, options.triggerInterval);
        if (options.renderInterval || !window.requestAnimationFrame) {
            renderInterval = window.setInterval(render, options.renderInterval);
        }
    }
    function load(e) {
        engine = e;
        restart();
    }
    div.appendChild(document.createTextNode("% change per trigger: "));
    [0, 1, 2, 5, 10, 20, 50, 100].forEach(function (n) {
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(n + " "));
        span.onclick = function () {
            options.change = n;
            if (engine) {
                load(engine);
            }
        };
        div.appendChild(span);
    });
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createTextNode("loops: "));
    [0, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000].forEach(function (n) {
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(n + " "));
        span.onclick = function () {
            options.loops = n;
            if (engine) {
                load(engine);
            }
        };
        div.appendChild(span);
    });
    div.appendChild(document.createElement("br"));
    options.engines.forEach(function (engine) {
        var input = document.createElement("input"),
            span = document.createElement("span");
        input.type = "radio";
        input.name = "engine";
        input.value = engine.name;
        input.appendChild(document.createTextNode(engine.name));
        span.appendChild(input);
        span.appendChild(document.createTextNode(engine.name));
        span.onclick = function () {
            input.checked = true;
            load(engine);
        };
        div.appendChild(span);
    });
    div.appendChild(infoDiv);
    div.appendChild(root);
    body.appendChild(div);
    // debug
    options.loops = 5;
    options.change = 1;
/*
    //options.triggerInterval = 1000;
    //options.renderInterval = 1000;
*/
    load(options.engines[5]);
}

function addRandomTexts(bridge) {
    "use strict";
    var vdom = bridge.getVirtualDom(),
        qname = vdom.getQNames().getQName(document.body.namespaceURI, "div"),
        nodes = [],
        n = 0,
        interval;
    function changeTexts() {
        var i, j;
        for (i = 0; i < 1000; i += 1) {
            j = Math.floor(Math.random() * 1000);
            if (nodes[j]) {
                vdom.removeNode(nodes[j]);
            }
            if (j % 5) {
                nodes[j] = vdom.insertText(Math.random() + " ", vdom.getDocumentElement(), 0);
            } else {
                nodes[j] = vdom.insertElement(qname, vdom.getDocumentElement(), 0);
            }
        }
        n += 1;
        if (n > 1000) {
            window.clearInterval(interval);
        }
    }
    interval = window.setInterval(changeTexts, 10);
    window.setInterval(function () {
        bridge.render();
    }, 40);
}
function initVDom(vdom) {
    "use strict";
    var qname = vdom.getQNames().getQName(document.body.namespaceURI, "span"),
        span1 = vdom.insertElement(qname, vdom.getDocumentElement(), 0),
        span2 = vdom.insertElement(qname, span1, 0);
    vdom.insertText("HELLO", span2, 0);
    vdom.addEventListener(span1, "click", function (e) {
        //console.log("span1 " + e.target);
        //console.log(e);
    });
    vdom.addEventListener(span2, "click", function (e) {
        //console.log("span2 " + e.target);
        //console.log(e);
    });
}
function textTest() {
    "use strict";
    var text = document.createTextNode("click me!"),
        div1 = document.createElement("div"),
        div2 = document.createElement("div");
    document.body.appendChild(div1);
    div1.appendChild(div2);
    div2.appendChild(text);
    text.addEventListener("click", function (e) {
        //console.log(e.target);
    });
    div1.addEventListener("click", function (e) {
        //console.log(e);
    });
}
function init() {
    "use strict";
//    textTest();
    var qnames = new baredom.impl.QName(),
        qname = qnames.getQName(document.body.namespaceURI, "div"),
        vdom = new baredom.impl.Dom(qnames, qname),
        div = document.createElementNS(document.body.namespaceURI, "div"),
        bridge = new baredom.impl.DomBridge(vdom, div);
    initVDom(vdom);
    bridge.render();
    document.body.appendChild(div);
    // addRandomTexts(bridge);

    setupForm(div, {
        engines: [{
            name: "Baredom",
            setup: baredomSetup,
            trigger: baredomTrigger,
            render: baredomRender
        }, {
/*
            name: "W3 on Baredom",
            setup: w3baredomSetup,
            trigger: domTrigger,
            render: baredomRender
        }, {
*/
            name: "Browser DOM",
            setup: domSetup,
            trigger: domTrigger,
            render: function () {}
        }, {
            name: "Detached DOM",
            setup: domSetup,
            trigger: detachedDomTrigger,
            render: function () {}
        }, {
            name: "Clone DOM",
            setup: cloneSetup,
            trigger: domTrigger,
            render: cloneRender
        }, {
            name: "Import DOM",
            setup: importSetup,
            trigger: domTrigger,
            render: importRender
        }, {
            name: "Simple",
            setup: simpleSetup,
            trigger: domTrigger,
            render: simpleRender
        }, {
            name: "Dummy",
            setup: dummySetup,
            trigger: domTrigger,
            render: function () {}
        }, {
            name: "stop",
            setup: function () {},
            trigger: function () {},
            render: function () {}
        }],
        triggerInterval: 0,
        renderInterval: 0
    });
}
