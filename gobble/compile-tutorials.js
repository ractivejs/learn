var promo = require( 'promo' ),
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
};

module.exports = function compileTutorials ( inputdir, outputdir, options, callback, errback ) {
	spelunk( path.join( inputdir, 'tutorials' ) ).then( function ( tutorialData ) {
		var promises = [
			tutorialPromise(),
			redirectPromise()
		];

		return Promise.all( promises );

		function tutorialPromise () {
			var partials, partialPromise;

			partialPromise = spelunk( path.join( inputdir, 'partials' ) ).then( function ( result ) {
				partials = {};

				for ( key in result ) {
					if ( result.hasOwnProperty( key ) ) {
						partials[ key ] = _.template( result[ key ], config );
					}
				}
			});

			return partialPromise.then( function () {
				return readFile( path.join( inputdir, 'templates', 'tutorial.html' ) ).then( function ( template ) {
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

							if ( tutorial.setup && !step.setup ) {
								step.setup = tutorial.setup;
							}

							if ( tutorial.cleanup && !step.cleanup ) {
								step.cleanup = tutorial.cleanup;
							}

							dirname = path.join( outputdir, slugify( tutorial.title ), '' + ( stepIndex + 1 ) );
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

				dirname = path.join( outputdir, slugify( tutorial.title ) );
				filename = path.join( dirname, 'index.html' );
				content = redirectContent( '1' );

				return mkdirp( dirname ).then( function () {
					writeFile( filename, content );
				});
			});

			promises.push(
				// `/index.html` should redirect to the first tutorial
				writeFile( path.join( outputdir, 'index.html' ), redirectContent( slugify( tutorialData[0].title ) + '/1' ) )
			);

			return Promise.all( promises );

			function redirectContent ( destination ) {
				return '<script>window.location.href = \'' + destination + '\';</script>';
			}
		}
	}).then( callback, errback );
};

function slugify ( str ) {
	if ( !str ) {
		return '';
	}
	return str.toLowerCase().replace( /[^a-z]/g, '-' ).replace( /-{2,}/g, '-' ).replace( /^-/, '' ).replace( /-$/, '' );
}
