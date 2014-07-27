W3JS = src/baredom/w3c/EventTarget.js \
    src/baredom/w3c/Attr.js \
    src/baredom/w3c/Comment.js \
    src/baredom/w3c/CDATASection.js \
    src/baredom/w3c/Document.js \
    src/baredom/w3c/DocumentFragment.js \
    src/baredom/w3c/DocumentType.js \
    src/baredom/w3c/DOMImplementation.js \
    src/baredom/w3c/Element.js \
    src/baredom/w3c/EntityReference.js \
    src/baredom/w3c/NamedNodeMap.js \
    src/baredom/w3c/Node.js \
    src/baredom/w3c/NodeList.js \
    src/baredom/w3c/ProcessingInstruction.js \
    src/baredom/w3c/Text.js \
    src/baredom/w3c/Event.js
JS =  src/packages.js \
    $(W3JS) \
    src/baredom/core/QName.js \
    src/baredom/core/StringStore.js \
    src/baredom/core/AttributesStore.js \
    src/baredom/core/ReadOnlyDom.js \
    src/baredom/core/Dom.js \
    src/baredom/core/ObservableDom.js \
    src/baredom/core/EventTargetDom.js \
    src/baredom/core/DomBridge.js \
    src/baredom/impl/EventProxy.js \
    src/baredom/impl/StringStore.js \
    src/baredom/impl/AttributesStore.js \
    src/baredom/impl/Dom.js \
    src/baredom/impl/DomBridge.js \
    src/baredom/impl/QName.js \
    src/baredom/impl/w3c/NodeList.js \
    src/baredom/impl/w3c/Node.js \
    src/baredom/impl/w3c/Attr.js \
    src/baredom/impl/w3c/Element.js \
    src/baredom/impl/w3c/Text.js \
    src/baredom/impl/w3c/Document.js \

CCJS = $(foreach var,$(JS), --js $(var))

CCOPTS = --warning_level VERBOSE --jscomp_error accessControls --jscomp_error ambiguousFunctionDecl --jscomp_error checkEventfulObjectDisposal --jscomp_error checkRegExp --jscomp_error checkStructDictInheritance --jscomp_error checkTypes --jscomp_error checkVars --jscomp_error const --jscomp_error constantProperty --jscomp_error deprecated --jscomp_error duplicateMessage --jscomp_error es3 --jscomp_error es5Strict --jscomp_error externsValidation --jscomp_error fileoverviewTags --jscomp_error globalThis --jscomp_error invalidCasts --jscomp_error misplacedTypeAnnotation --jscomp_error missingProperties --jscomp_error missingProvide --jscomp_error missingRequire --jscomp_error missingReturn --jscomp_off nonStandardJsDocs --jscomp_error suspiciousCode --jscomp_error strictModuleDepCheck --jscomp_error typeInvalidation --jscomp_error undefinedNames --jscomp_error undefinedVars --jscomp_error unknownDefines --jscomp_error uselessCode --jscomp_error visibility --summary_detail_level 3 \
	--jscomp_error reportUnknownTypes \
    --language_in ECMASCRIPT5_STRICT

#all: compiled.js compiledtest.js

compiled.js: externs.js $(JS)
	java -jar /home/oever/work/webodf/build/ClosureCompiler-prefix/src/ClosureCompiler/compiler.jar \
    $(CCOPTS) \
	$(CCJS) \
    --use_only_custom_externs \
	--externs es3.js --externs es5.js --externs externs.js \
	--compilation_level ADVANCED_OPTIMIZATIONS --js_output_file compiled.js_
	mv compiled.js_ compiled.js

compiledtest.js: externs.js $(JS) test.js
	/usr/bin/java -jar /home/oever/work/webodf/build/ClosureCompiler-prefix/src/ClosureCompiler/compiler.jar \
    $(CCOPTS) \
	$(CCJS) --js test.js \
    --use_only_custom_externs \
	--externs es3.js --externs es5.js --externs externs.js \
	--compilation_level SIMPLE_OPTIMIZATIONS --js_output_file compiledtest.js_
	mv compiled.js_ compiledtest.js

jslint:
	node ~/work/webodf/webodf/webodf/lib/runtime.js ~/work/webodf/webodf/webodf/tools/runjslint.js p.js
