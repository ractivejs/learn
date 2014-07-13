var Writer = require( 'broccoli-writer' ),
	promo = require( 'promo' ),
	Promise = promo.Promise,
	fs = require( 'fs' ),
	path = require( 'path' ),
	mkdirp = promo( require( 'mkdirp' ) ),
	spelunk = promo( require( 'spelunk' ) ),

	readFile = promo( fs.readFile ),
	writeFile = promo( fs.writeFile );

function TutorialCompiler ( inputTree, options ) {
	var key;

	if ( !( this instanceof TutorialCompiler ) ) {
		return new TutorialCompiler( inputTree, options );
	}

	this.inputTree = inputTree;

	for ( key in options ) {
		if ( options.hasOwnProperty( key ) ) {
			this[ key ] = options[ key ];
		}
	}
}

TutorialCompiler.prototype = Object.create( Writer.prototype );
TutorialCompiler.prototype.constructor = TutorialCompiler;

TutorialCompiler.prototype.write = function ( readTree, destDir ) {
	var self = this;

	return readTree( self.inputTree ).then( function ( srcDir ) {

		return spelunk( path.join( srcDir, 'tutorials' ) ).then( function ( tutorialData ) {
			var promises = [
				tutorialPromise(),
				redirectPromise()
			];

			return Promise.all( promises );

			function tutorialPromise () {
				return readFile( path.join( srcDir, 'templates', 'tutorial.html' ) ).then( function ( template ) {
					var promises;

					promises = tutorialData.map( function ( tutorial ) {
						var promises = tutorial.steps.map( function ( step, i ) {
							var dirname, filename, content;

							dirname = path.join( destDir, slugify( tutorial.title ), '' + ( i + 1 ) );
							filename = path.join( dirname, 'index.html' );
							content = generateTutorial( tutorial, step );

							return mkdirp( dirname ).then( function () {
								return writeFile( filename, content );
							});
						});

						return Promise.all( promises );
					});

					return Promise.all( promises );

					function generateTutorial ( tutorial, step ) {
						return template;
					}
				});
			}

			function redirectPromise () {
				var promises = tutorialData.map( function ( tutorial ) {
					var dirname, filename, content;

					dirname = path.join( destDir, slugify( tutorial.title ) );
					filename = path.join( dirname, 'index.html' );
					content = redirectContent( '1' );

					return mkdirp( dirname ).then( function () {
						writeFile( filename, content );
					});
				});

				promises.push(
					// `/index.html` should redirect to the first tutorial
					writeFile( path.join( destDir, 'index.html' ), redirectContent( slugify( tutorialData[0].title ) + '/1' ) )
				);

				return Promise.all( promises );

				function redirectContent ( destination ) {
					return '<script>window.location.href = \'' + destination + '\';</script>';
				}
			}
		});
	});
};

module.exports = TutorialCompiler;

function slugify ( str ) {
	if ( !str ) {
		return '';
	}
	return str.toLowerCase().replace( /[^a-z]/g, '-' ).replace( /-{2,}/g, '-' ).replace( /^-/, '' ).replace( /-$/, '' );
}
