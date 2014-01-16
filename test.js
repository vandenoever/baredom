/*global baredom, document, window, console, Simple*/
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

// trigger for modifying the bare dom
/**
 * @param {!Element} div
 */
function baredomSetup(div, loops, change) {
    "use strict";
    var qnames = new baredom.impl.QName(),
        qname = qnames.getQName(document.body.namespaceURI, "div"),
        vdom = new baredom.impl.Dom(qnames, qname),
        bridge = new baredom.impl.DomBridge(vdom, div);
    return {bridge: bridge, nodes: [], divQName: qname, loops: loops, change: change};
}
/**
 * @param {!Element} div
 */
function w3baredomSetup(div, loops, change) {
    "use strict";
    var bridge = baredomSetup(div).bridge,
        doc = new baredom.impl.w3c.Document(bridge.getVirtualDom()),
        documentElement = doc.documentElement;
    return {bridge: bridge, root: documentElement, loops: loops, change: change, nodes: []};
}
/**
 * @param {!Element} div
 */
function domSetup(div, loops, change) {
    "use strict";
    return {root: div, loops: loops, change: change, nodes: []};
}
/**
 * @param {!Element} div
 */
function cloneSetup(div, loops, change) {
    "use strict";
    return {root: div.cloneNode(true), loops: loops, change: change, nodes: [], live: div};
}
/**
 * @param {!Element} div
 */
function importSetup(div, loops, change) {
    "use strict";
    var ns = div.namespaceURI,
        doc = div.ownerDocument.implementation.createDocument(ns, "", div.ownerDocument.docType),
        root = doc.createElementNS(div.namespaceURI, div.localName);
    return {root: root, loops: loops, change: change, nodes: [], live: div};
}
function simpleSetup(div, loops, change) {
    "use strict";
    var root = new Simple(div);
    return {root: root.documentElement, loops: loops, change: change, nodes: []};
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
function domTrigger(state) {
    "use strict";
    var root = state.root,
        ns = root.namespaceURI,
        doc = root.ownerDocument,
        nodes = state.nodes,
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
            n.parentNode.removeChild(n);
        }
        if (j % 5) {
            n = doc.createTextNode(r + " ");
        } else {
            n = doc.createElementNS(ns, "div");
        }
        nodes[j] = n;
        root.insertBefore(n, nodes[j + 1]);
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
        infoDiv = document.createElement("div");
    infoDiv.appendChild(document.createTextNode(""));
    function updateInfo() {
        var duration = new Date().getTime() - runStart;
        infoDiv.firstChild.data = "trigger: "
            + Math.round(triggerCallDuration / triggerCalls) + " ms, render: "
            + Math.round(renderCallDuration / renderCalls) + " ms, "
            + Math.round(100 * (triggerCallDuration + renderCallDuration) / duration) + "% cpu, "
            + Math.round(triggerCalls * 1000 / duration) + " triggers per second, "
            + Math.round(renderCalls * 1000 / duration) + " renders per second.";
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
        time = new Date().getTime() - time;
        renderCalls += 1;
        renderCallDuration += time;
        updateInfo();
        if (!options.renderInterval && window.requestAnimationFrame) {
            animationFrame = window.requestAnimationFrame(render);
        }
    }
    function stop() {
        window.clearInterval(triggerInterval);
        window.clearInterval(renderInterval);
        if (window.cancelAnimationFrame) {
            window.cancelAnimationFrame(animationFrame);
        }
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
        div.removeChild(div.lastChild);
        div.appendChild(root);
    }
    function restart() {
        stop();
        runStart = new Date().getTime();
        triggerCalls = triggerCallDuration = 0;
        renderCalls = renderCallDuration = 0;
        if (engine.name === "stop") {
            return;
        }
        engineObject = engine.setup(root, options.loops, options.change);
        triggerInterval = window.setInterval(trigger, options.triggerInterval);
        if (options.renderInterval || !window.requestAnimationFrame) {
            renderInterval = window.setInterval(render, options.renderInterval);
        } else {
            animationFrame = window.requestAnimationFrame(render);
        }
    }
    function load(e) {
        engine = e;
        restart();
    }
    div.appendChild(document.createTextNode("% change per trigger: "));
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach(function (n) {
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
            render: function () {}
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
