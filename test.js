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

function getTime() {
    "use strict";
    return new Date().getTime();
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
        nodeCount = state.nodeCount,
        i;
    for (i = 0; i < nodeCount; i += 1) {
        addNode(doc, ns, nodes, i, root, i);
    }
}
function addBareNode(dom, divQName, spanQName, nodes, max, root) {
    "use strict";
    var r, j, n, m, p;
    r = Math.random();
    j = Math.floor(r * max);
    n = nodes[j];
    if (n) {
        p = dom.getParentNode(n);
        m = dom.getFirstChild(n);
        while (m) {
            dom.moveNode(m, p, n);
            m = dom.getFirstChild(n);
        }
        dom.removeNode(n);
    }
    m = nodes[(j + 1) % max];
    m = (m && m !== n) ? m : root;
    if (dom.getText(m) !== undefined) {
        p = dom.getParentNode(m);
    } else {
        p = m;
        m = 0;
    }
    if (j % 40 === 0) {
        n = dom.insertElement(divQName, p, m);
    } else if (j % 2) {
        n = dom.insertElement(spanQName, p, m);
    } else {
        n = dom.insertText(r + " ", p, m);
    }
    nodes[j] = n;
}
function baredomInitialize(state) {
    "use strict";
    var vdom = state.bridge.getVirtualDom(),
        root = vdom.getDocumentElement(),
        nodes = state.nodes,
        divQName = state.divQName,
        spanQName = state.spanQName,
        nodeCount = state.nodeCount,
        i;
    for (i = 0; i < nodeCount; i += 1) {
        addBareNode(vdom, divQName, spanQName, nodes, nodeCount, root);
    }
}
function baredomTrigger(state, timeLeft) {
    "use strict";
    var vdom = state.bridge.getVirtualDom(),
        root = vdom.getDocumentElement(),
        nodes = state.nodes,
        divQName = state.divQName,
        spanQName = state.spanQName,
        nodeCount = state.nodeCount,
        end = getTime() + timeLeft,
        count = 0;
    while (getTime() < end) {
        addBareNode(vdom, divQName, spanQName, nodes, nodeCount, root);
        count += 1;
    }
    return count;
}
function domTrigger(state, timeLeft) {
    "use strict";
    var root = state.root,
        ns = root.namespaceURI,
        doc = root.ownerDocument,
        nodes = state.nodes,
        nodeCount = state.nodeCount,
        end = getTime() + timeLeft,
        count = 0;
    while (getTime() < end) {
        addNode(doc, ns, nodes, nodeCount, root);
        count += 1;
    }
    return count;
}
function detachedDomTrigger(state, timeLeft) {
    "use strict";
    var root = state.root,
        parent = root.parentNode,
        next = root.nextSibling,
        count;
    parent.removeChild(root);
    count = domTrigger(state, timeLeft);
    parent.insertBefore(root, next);
    return count;
}
// trigger for modifying the bare dom
/**
 * @param {!Element} div
 */
function baredomSetup(div, nodeCount) {
    "use strict";
    var qnames = new baredom.impl.QName(),
        divQName = qnames.getQName(document.body.namespaceURI, "div"),
        spanQName = qnames.getQName(document.body.namespaceURI, "span"),
        vdom = new baredom.impl.Dom(qnames, divQName),
        bridge = new baredom.impl.DomBridge(vdom, div),
        state = {bridge: bridge, nodes: [], divQName: divQName, spanQName: spanQName, nodeCount: nodeCount};
    baredomInitialize(state);
    return state;
}
/**
 * @param {!Element} div
 */
function w3baredomSetup(div, nodeCount) {
    "use strict";
    var state = baredomSetup(div),
        bridge = state.bridge,
        doc = new baredom.impl.w3c.Document(bridge.getVirtualDom()),
        documentElement = doc.documentElement;
    state = {bridge: bridge, root: documentElement, nodeCount: nodeCount, nodes: []};
    domInitialize(state);
    return state;
}
/**
 * @param {!Element} div
 */
function domSetup(div, nodeCount) {
    "use strict";
    var state = {root: div, nodeCount: nodeCount, nodes: []};
    domInitialize(state);
    return state;
}
/**
 * @param {!Element} div
 */
function cloneSetup(div, nodeCount) {
    "use strict";
    var state = {root: div.cloneNode(true), nodeCount: nodeCount, nodes: [], live: div};
    domInitialize(state);
    return state;
}
/**
 * @param {!Element} div
 */
function importSetup(div, nodeCount) {
    "use strict";
    var ns = div.namespaceURI,
        doc = div.ownerDocument.implementation.createDocument(ns, "", div.ownerDocument.docType),
        root = doc.createElementNS(div.namespaceURI, div.localName),
        state = {root: root, nodeCount: nodeCount, nodes: [], live: div};
    domInitialize(state);
    return state;
}
function simpleSetup(div, nodeCount) {
    "use strict";
    var root = new Simple(div.namespaceURI, div.localName),
        bridge = new SimpleBridge(root.documentElement, div),
        state = {bridge: bridge, root: root.documentElement, nodeCount: nodeCount, nodes: []};
    domInitialize(state);
    return state;
}
function dummySetup(div, nodeCount) {
    "use strict";
    var root = {};
    root.createTextNode = function () { return root; };
    root.createElementNS = function () { return root; };
    root.removeChild = function () {};
    root.insertBefore = function () {};
    root.appendChild = function () {};
    root.parentNode = root;
    root.ownerDocument = root || div;
    return {root: root, nodeCount: nodeCount, nodes: []};
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
        runStartTime,
        lastRenderDuration,
        totalModificationDuration,
        totalRenderDuration,
        domModificationCount,
        root = document.createElement("div"),
        engineObject,
        engine,
        renderInterval,
        stopped = true,
        infoDiv = document.createElement("div");
    options.nodeCount = options.nodeCount || 5000;
    infoDiv.appendChild(document.createTextNode(""));
    function updateInfo() {
        var duration = getTime() - runStartTime,
            browserTime = duration - totalRenderDuration - totalModificationDuration;
        infoDiv.firstChild.data = "nodes: " + options.nodeCount
            + ", dom changes: "
            + Math.round(100 * totalModificationDuration / duration)
            + " % of time, render: "
            + Math.round(100 * totalRenderDuration / duration)
            + " % of time, browser: "
            + Math.round(100 * browserTime / duration) + " % of time, "
            + Math.round(domModificationCount / duration)
            + "k modifications per second";
    }
    function stop() {
        stopped = true;
        window.clearInterval(renderInterval);
        if (window.cancelAnimationFrame) {
            window.cancelAnimationFrame(renderInterval);
        }
    }
    function render() {
        var time = getTime();
        engine.render(engineObject);
        lastRenderDuration = getTime() - time;
        totalRenderDuration += lastRenderDuration;
        //root = div.lastChild;
    }
    function trigger() {
        var timeLeft = options.renderInterval - lastRenderDuration,
            time = getTime();
        domModificationCount += engine.trigger(engineObject, timeLeft);
        totalModificationDuration += getTime() - time;
        if (options.render) {
            render();
        }
        updateInfo();
        if (!options.renderInterval && window.requestAnimationFrame && !stopped) {
            renderInterval = window.requestAnimationFrame(render);
        }
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
        engineObject = engine.setup(root, options.nodeCount, options.change);
        render();
        runStartTime = getTime();
        totalModificationDuration = 0;
        totalRenderDuration = 0;
        domModificationCount = 0;
        if (options.render) {
            render();
        }
        if (options.renderInterval || !window.requestAnimationFrame) {
            renderInterval = window.setInterval(trigger, options.renderInterval);
        }
    }
    function load(e) {
        engine = e;
        restart();
    }
    div.appendChild(document.createTextNode("renderInterval (ms): "));
    [0, 20, 40, 100, 200, 500, 1000].forEach(function (n) {
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(n + " "));
        span.onclick = function () {
            options.renderInterval = n;
            if (engine) {
                load(engine);
            }
        };
        div.appendChild(span);
    });
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createTextNode("nodes: "));
    [0, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000].forEach(function (n) {
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(n + " "));
        span.onclick = function () {
            options.nodeCount = n;
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
    options.nodeCount = 6;
/*
    //options.triggerInterval = 1000;
*/
    options.renderInterval = 100;
    options.render = true;
    //load(options.engines[1]);
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
    var div = document.createElementNS(document.body.namespaceURI, "div");
    document.body.appendChild(div);

    setupForm(div, {
        engines: [{
            name: "Baredom",
            setup: baredomSetup,
            trigger: baredomTrigger,
            render: baredomRender
        }, {
            name: "W3 on Baredom",
            setup: w3baredomSetup,
            trigger: domTrigger,
            render: baredomRender
        }, {
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
