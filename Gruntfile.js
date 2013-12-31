module.exports = function ( grunt ) {

	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),

		watch: {
			tutorials: {
				files: [ 'tutorials/**/*', 'root/**/*', 'templates/**/*' ],
				tasks: 'build'
			},
			sass: {
				files: [ 'scss/**/*.scss' ],
				tasks: 'sass:main'
			}
		},

		jshint: {
			files: [
				'js/**/*.js',
				'!js/bundle/**/*.js',
				'!js/lib/**/*.js',
				'!js/require.js',
				'!js/text.js',
				'!js/domReady.js'
			],
			options: {
				undef: true,
				unused: true,
				globals: {
					define: true,
					window: true,
					XMLHttpRequest: true,
					document: true,
					prettyPrint: true,
					CodeMirror: true,
					ga: true,
					setTimeout: true
				}
			}
		},

		clean: {
			build: [ 'build' ]
		},

		copy: {
			root: {
				files: [{
					cwd: 'root',
					src: '**/*',
					expand: true,
					dest: 'build'
				}]
			},

			js: {
				files: [{
					cwd: 'js',
					src: '**/*',
					expand: true,
					dest: 'build/js'
				}]
			}
		},

		concat: {
			bundle: {
				src: 'js/bundle/**/*.js',
				dest: 'build/js/bundle.js'
			}
		},

		uglify: {
			bundle: {
				src: 'build/js/bundle.js',
				dest: 'build/js/bundle.js'
			},
			app: {
				src: 'build/js/app.js',
				dest: 'build/js/app.js'
			}
		},

		dir2json: {
			tutorials: {
				root: 'tutorials',
				dest: 'tmp/tutorials.json'
			}
		},

		sass: {
			main: {
				files: {
					'build/styles/min.css': 'scss/main.scss'
				}
			}
		},

		requirejs: {
			compile: {
				options: {
					baseUrl: 'js/',
					out: 'build/js/app.js',
					name: 'almond',
					include: 'app',
					wrap: true,
					optimize: 'none',
					stubModules: [ 'text.js', 'rv.js' ],
					insertRequire: [ 'app' ],

					paths: {
						Ractive: 'lib/Ractive-legacy',
						Statesman: 'lib/Statesman',
						Divvy: 'lib/Divvy'
					}
				}
			}
		},

		cssmin: {
			styles: {
				src: 'build/styles/min.css',
				dest: 'build/styles/min.css'
			}
		}
	});



	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-dir2json' );

	grunt.registerTask( 'render', function () {
		var Ractive, template, tutorials, redirect, ractive, rendered, manifest;

		Ractive = require( 'ractive' );

		template = grunt.file.read( 'templates/tutorial.html' );
		redirect = grunt.file.read( 'templates/redirect.html' );

		// Gather tutorial data
		tutorials = grunt.file.readJSON( grunt.config( 'dir2json.tutorials.dest' ) );

		// Create a manifest - need to know what tutorials we've got
		// and how many steps there are
		manifest = {};
		manifest.tutorials = tutorials.map( function ( tutorial ) {
			return {
				title: tutorial.title,
				length: tutorial.steps.length
			};
		});

		// Render index.html
		ractive = new Ractive({
			template: redirect,
			data: {
				destination: slugify( tutorials[0].title ) + '/1'
			},
			preserveWhitespace: true,
			delimiters: [ '[[', ']]' ],
			tripleDelimiters: [ '[[[', ']]]' ]
		});

		rendered = ractive.toHTML();
		grunt.file.write( 'build/index.html', rendered );


		// Render tutorial pages
		tutorials.forEach( function ( tutorial, i ) {
			var rendered = new Ractive({
				template: redirect,
				data: { destination: '1' },
				delimiters: [ '[[', ']]' ],
				tripleDelimiters: [ '[[[', ']]]' ]
			}).toHTML();

			grunt.file.write( 'build/' + slugify( tutorial.title ) + '/index.html', rendered );

			tutorial.steps.forEach( function ( step, j ) {
				var rendered;

				manifest.tutorialIndex = i;
				manifest.stepIndex = j;
				manifest.step = step;

				if ( tutorial.styles ) {
					step.styles = ( step.styles ? step.styles + tutorial.styles : tutorial.styles );
				}

				rendered = new Ractive({
					template: template,
					data: {
						title: tutorial.title + ' (' + ( j + 1 ) + '/' + tutorial.steps.length + ') | Learn Ractive.js',
						manifest: JSON.stringify( manifest ),
						prod: grunt.config( 'prod' )
					},
					preserveWhitespace: true,
					delimiters: [ '[[', ']]' ],
					tripleDelimiters: [ '[[[', ']]]' ]
				}).toHTML();

				grunt.file.write( 'build/' + slugify( tutorial.title ) + '/' + ( j + 1 ) + '/index.html', rendered );
				grunt.file.write( 'build/data/' + i + '/' + j + '.json', JSON.stringify( step ) );
			});
		});
	});

	grunt.registerTask( 'setProdFlag', function () {
		grunt.config( 'prod', true );
	});

	grunt.registerTask( 'build:prod', [
		'setProdFlag',
		'build',
		'requirejs',
		'uglify',
		'cssmin'
	]);

	grunt.registerTask( 'build', [
		'jshint',
		'clean:build',
		'copy:root',
		'sass:main',
		'concat',
		'dir2json:tutorials',
		'render'
	]);

	grunt.registerTask( 'default', [
		'build',
		'watch'
	]);

};

function slugify ( str ) {
	if ( !str ) {
		return '';
	}
	return str.toLowerCase().replace( /[^a-z]/g, '-' ).replace( /-{2,}/g, '-' ).replace( /^-/, '' ).replace( /-$/, '' );
};