var pick = require( 'broccoli-static-compiler' ),
	merge = require( 'broccoli-merge-trees' ),

	// filters
	transpileES6 = require( 'broccoli-es6-transpiler' ),
	transpileES6Modules = require( 'broccoli-es6-module-transpiler' ),
	clean = require( './broccoli/clean-transpiled' ),
	compileTutorials = require( './broccoli/compile-tutorials' ),

	app, tutorials, tree;

	app = (function () {

	}());

	tutorials = (function () {
		var templates, data;

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

		return compileTutorials( merge([ templates, data ]) );
	}());

module.exports = merge([ tutorials ]);
