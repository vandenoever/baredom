compiled.js: src/baredom/core/QName.js src/baredom/core/ReadOnlyDom.js src/baredom/impl/QName.js src/baredom/impl/Dom.js src/baredom/impl/DomBridge.js src/baredom/core/DomBridge.js
	/usr/bin/java -jar /home/oever/work/webodf/build/ClosureCompiler-prefix/src/ClosureCompiler/compiler.jar \
  --warning_level VERBOSE --jscomp_error accessControls --jscomp_error ambiguousFunctionDecl --jscomp_error checkEventfulObjectDisposal --jscomp_error checkRegExp --jscomp_error checkStructDictInheritance --jscomp_error checkTypes --jscomp_error checkVars --jscomp_error const --jscomp_error constantProperty --jscomp_error deprecated --jscomp_error duplicateMessage --jscomp_error es3 --jscomp_error es5Strict --jscomp_error externsValidation --jscomp_error fileoverviewTags --jscomp_error globalThis --jscomp_error invalidCasts --jscomp_error misplacedTypeAnnotation --jscomp_error missingProperties --jscomp_error missingProvide --jscomp_error missingRequire --jscomp_error missingReturn --jscomp_off nonStandardJsDocs --jscomp_error suspiciousCode --jscomp_error strictModuleDepCheck --jscomp_error typeInvalidation --jscomp_error undefinedNames --jscomp_error undefinedVars --jscomp_error unknownDefines --jscomp_error uselessCode --jscomp_error visibility --summary_detail_level 3 \
	--jscomp_error reportUnknownTypes \
	--js src/packages.js \
	--js src/baredom/core/QName.js \
	--js src/baredom/core/ReadOnlyDom.js \
	--js src/baredom/core/Dom.js \
	--js src/baredom/core/DomBridge.js \
	--js src/baredom/impl/QName.js \
	--js src/baredom/impl/Dom.js \
	--js src/baredom/impl/DomBridge.js \
	--compilation_level ADVANCED_OPTIMIZATIONS --js_output_file compiled.js

jslint:
	node ~/work/webodf/webodf/webodf/lib/runtime.js ~/work/webodf/webodf/webodf/tools/runjslint.js p.js
