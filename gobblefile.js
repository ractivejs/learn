var gobble = require( 'gobble' ),
	compileTutorials = require( './gobble/compile-tutorials' ),

	prod = gobble.env() === 'production',

	globals = {
		define: true,
		CodeMirror: true,
		prettyPrint: true,
		JSHINT: true
	},

	shared, assets, app, bundle, css, tutorials, tree;

shared = gobble( 'shared' );
assets = gobble( 'src/assets' );

app = (function () {
	var app, ractive_components, vendor;

	app = gobble( 'src/app' )
		.map( 'es6-transpiler', { globals: globals })
		.map( 'esperanto', { defaultOnly: true });

	ractive_components = gobble( 'src/ractive_components' )
		.map( 'ractive' )
		.map( 'es6-transpiler', { globals: globals })
		.moveTo( 'ractive_components' );

	// external libs
	vendor = gobble( 'vendor', { static: true }).moveTo( 'vendor' );

	app = gobble([ app, ractive_components, vendor ])
		.transform( 'requirejs', {
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
			}
		}).map( 'amdclean', {
			wrap: {
				start: '(function(){',
				end: '}());'
			}
		});

	return prod ? app.map( 'uglifyjs' ) : app;
}());

bundle = gobble( 'vendor' ).transform( 'concat', {
	files: [
		'codemirror/lib/codemirror.js',
		'codemirror/mode/javascript/javascript.js',
		'codemirror/mode/xml/xml.js',
		'codemirror/mode/htmlmixed/htmlmixed.js',
		'codemirror/keymap/sublime.js',
		'codemirror/addon/search/search.js',
		'jshint/dist/jshint.js',
		'google-code-prettify/src/prettify.js'
	],
	dest: 'bundle.js'
});

if ( prod ) {
	bundle = bundle.map( 'uglifyjs' );
}

css = gobble([ 'src/styles', shared ]).transform( 'sass', {
	src: 'main.scss',
	dest: 'min.css',
	outputStyle: 'compressed'
});

tutorials = (function () {
	var templates, tutorials, partials;

	templates = gobble( 'src/templates' ).moveTo( 'templates' );
	tutorials = gobble( 'src/tutorials' ).moveTo( 'tutorials' );
	partials = shared.include( 'partials/**' );

	return gobble([ templates, tutorials, partials ]).transform( compileTutorials );
}());

module.exports = gobble([ assets, app, bundle, css, shared, tutorials ]);
