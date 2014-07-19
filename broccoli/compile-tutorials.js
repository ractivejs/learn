var Writer = require( 'broccoli-writer' ),
	promo = require( 'promo' ),
	Promise = promo.Promise,
	fs = require( 'fs' ),
	path = require( 'path' ),
	_ = require( 'lodash' ),
	mkdirp = promo( require( 'mkdirp' ) ),
	spelunk = promo( require( 'spelunk' ) ),

	readFile = promo( fs.readFile ),
	writeFile = promo( fs.writeFile ),

	config;

config = {
	gaTrackingId: 'UA-5602942-2',
	gaProperty: 'learn.ractivejs.org',
	id: 'learn'
}

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
				var partials, partialPromise;

				partialPromise = spelunk( path.join( srcDir, 'partials' ) ).then( function ( result ) {
					partials = {};

					for ( key in result ) {
						if ( result.hasOwnProperty( key ) ) {
							partials[ key ] = _.template( result[ key ], config );
						}
					}
				});

				return partialPromise.then( function () {
					return readFile( path.join( srcDir, 'templates', 'tutorial.html' ) ).then( function ( template ) {
						var compiledTemplate, promises;

						compiledTemplate = _.template( template );

						promises = tutorialData.map( function ( tutorial, tutorialIndex ) {
							var promises = tutorial.steps.map( function ( step, stepIndex ) {
								var dirname, htmlFilename, jsonFilename, content;

								step = _.extend( {}, step, {
									index: stepIndex,
									numSiblings: tutorial.steps.length,
									tutorialTitle: tutorial.title,
									tutorialIndex: tutorialIndex
								});

								if ( tutorial.styles && !step.styles ) {
									step.styles = tutorial.styles;
								}

								dirname = path.join( destDir, slugify( tutorial.title ), '' + ( stepIndex + 1 ) );
								htmlFilename = path.join( dirname, 'index.html' );
								jsonFilename = path.join( dirname, 'index.json' );
								content = generateTutorial( tutorial, step );

								return mkdirp( dirname ).then( function () {
									return Promise.all([
										writeFile( htmlFilename, content ),
										writeFile( jsonFilename, JSON.stringify( step ) )
									]);
								});

								function generateTutorial () {
									return compiledTemplate({
										partials: partials,
										tutorialData: tutorialData,
										tutorialIndex: tutorialIndex,
										stepIndex: stepIndex,
										step: step
									});
								}
							});

							return Promise.all( promises );
						});

						return Promise.all( promises );
					});
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
