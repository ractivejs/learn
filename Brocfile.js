var pick = require( 'broccoli-static-compiler' ),
	merge = require( 'broccoli-merge-trees' ),

	// filters
	transpileES6 = require( 'broccoli-es6-transpiler' ),
	transpileES6Modules = require( 'broccoli-es6-module-transpiler' ),
	compileSass = require( 'broccoli-sass' ),
	requirejs = require( 'broccoli-requirejs' ),
	concat = require( 'broccoli-concat' ),
	cleanTranspiled = require( './broccoli/clean-transpiled' ),
	compileTutorials = require( './broccoli/compile-tutorials' ),
	compileRactive = require( 'broccoli-ractive' ),

	globals = {
		define: true,
		CodeMirror: true,
		prettyPrint: true,
		JSHINT: true
	},

	shared, assets, app, bundle, css, tutorials, tree;

	shared = pick( 'shared', {
		srcDir: '/',
		files: [ '**/*.*' ],
		destDir: '/'
	});

	assets = pick( 'src/assets', {
		srcDir: '/',
		files: [ '**/*.*' ],
		destDir: '/'
	});

	app = (function () {
		var app, ractive_components, vendor;

		app = pick( 'src/app', {
			srcDir: '/',
			files: [ '**/*.js' ],
			destDir: '/'
		});

		ractive_components = compileRactive( 'src/ractive_components', {
			files: [ '**/*.html' ],
			destDir: '/ractive_components',
			type: 'amd'
		});
		ractive_components = transpileES6( ractive_components, { globals: globals });

		//app = merge([ app, ractive_components ]);
		app = transpileES6Modules( app, { type: 'amd' });
		app = cleanTranspiled( app );
		app = transpileES6( app, { globals: globals });

		// external libs
		vendor = pick( 'vendor', {
			srcDir: '/',
			files: [ '**/*.*' ],
			destDir: '/vendor/'
		});

		app = requirejs( merge([ app, ractive_components, vendor ]), {
			requirejs: {
				name: 'app',
				out: 'app.js',
				optimize: 'none',

				paths: {
					'ractive': 'vendor/ractive/ractive-legacy',
					'ractive-events-tap': 'vendor/ractive-events-tap/ractive-events-tap',
					'ractive-transitions-fade': 'vendor/ractive-transitions-fade/ractive-transitions-fade',
					'ractive-transitions-fly': 'vendor/ractive-transitions-fly/ractive-transitions-fly',
					'ractive-transitions-slide': 'vendor/ractive-transitions-slide/ractive-transitions-slide',
					'divvy': 'vendor/divvy/divvy'
				},

				onModuleBundleComplete: function ( data ) {
					var fs, amdclean, outputFile, prod, paths, cdnPaths, cdnDependencies, names, aliases;

					fs = require( 'fs' );
					amdclean = require( 'amdclean' );

					outputFile = data.path;

					fs.writeFileSync( outputFile, amdclean.clean({
						filePath: outputFile,
						wrap: {
							start: '(function(){',
							end: '}());'
						}
					}));
				}
			}
		});

		return app;
	}());

	bundle = concat( 'vendor', {
		inputFiles: [
			'codemirror/lib/codemirror.js',
			'codemirror/mode/javascript/javascript.js',
			'codemirror/mode/xml/xml.js',
			'codemirror/mode/htmlmixed/htmlmixed.js',
			'codemirror/keymap/sublime.js',
			'codemirror/addon/search/search.js',
			'jshint/dist/jshint.js',
			'google-code-prettify/src/prettify.js'
		],
		outputFile: '/bundle.js'
	});

	css = compileSass( [ 'src/styles', shared ], 'main.scss', 'min.css', {
		outputStyle: 'compressed'
	});

	tutorials = (function () {
		var templates, data, partials;

		templates = pick( 'src/', {
			srcDir: '/templates',
			files: [ '**/*.*' ],
			destDir: '/templates'
		});

		data = pick( 'src/', {
			srcDir: '/tutorials',
			files: [ '**/*.*' ],
			destDir: '/tutorials'
		});

		partials = pick( shared, {
			srcDir: '/partials',
			files: [ '**/*.html' ],
			destDir: '/partials'
		});

		return compileTutorials( merge([ templates, data, shared ]) );
	}());

module.exports = merge([ assets, app, bundle, css, shared, tutorials ]);
