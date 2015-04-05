var gobble = require( 'gobble' );
var sander = require( 'sander' );
var compileTutorials = require( './gobble/compile-tutorials' );

var prod = gobble.env() === 'production';

var common = gobble( 'node_modules/ractive-www' );
var components = gobble([ common.grab( 'components' ), 'src/app/components' ]).moveTo( 'components' );

var babelWhitelist = [
	'es6.arrowFunctions',
	'es6.blockScoping',
	'es6.classes',
	'es6.constants',
	'es6.destructuring',
	'es6.parameters.default',
	'es6.parameters.rest',
	'es6.properties.shorthand',
	'es6.spread',
	'es6.templateLiterals'
];

var assets = gobble([ common.grab( 'assets' ).moveTo( 'assets' ), 'src/assets' ]);

var app = (function () {
	var app = gobble([ 'src/app', components ])
		.transform( 'ractive', { type: 'es6' })
		.transform( 'babel', { whitelist: babelWhitelist })
		.transform( 'esperanto-bundle', {
			entry: 'app',
			type: 'cjs'
		})
		.transform( 'derequire' )
		.transform( 'browserify', {
			entries: [ './app' ],
			dest: 'app.js',
			debug: true,
			standalone: 'app'
		});

	return prod ? app.transform( 'uglifyjs' ) : app;
}());

var bundle = gobble([
	gobble( 'vendor', { static: true }),
	gobble( 'node_modules', { static: true })
])
	.transform( 'concat', {
		files: [
			// from node_modules
			'codemirror/lib/codemirror.js',
			'codemirror/mode/javascript/javascript.js',
			'codemirror/mode/xml/xml.js',
			'codemirror/mode/htmlmixed/htmlmixed.js',
			'codemirror/keymap/sublime.js',
			'codemirror/addon/search/search.js',
			'codemirror/addon/search/searchcursor.js',

			// from vendor. TODO replace with hljs?
			'google-code-prettify/src/prettify.js'
		],
		dest: 'bundle.js'
	});

if ( prod ) {
	bundle = bundle.map( 'uglifyjs' );
}

var css = gobble([ 'src/styles', common.grab( 'scss' ).moveTo( 'common' ) ])
	.transform( 'sass', {
		src: 'main.scss',
		dest: 'main.css',
		outputStyle: 'compressed'
	});

var tutorials = gobble([
	components.transform( 'ractive', { type: 'cjs' }),
	gobble( 'src/templates' ).moveTo( 'templates' ),
	gobble( 'src/tutorials' ).moveTo( 'tutorials' )
])
.transform( copy )
.transform( compileTutorials );

function copy ( inputdir, outputdir, options ) {
	// this is super hacky, but we need physical copies of the files
	// on disk, not symlinks, because of how node's module resolver works
	return sander.copydir( inputdir ).to( outputdir );
}

module.exports = gobble([ assets, app, bundle, css, tutorials ]);
