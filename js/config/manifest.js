define([
	'helpers/slugify'
], function (
	slugify
) {

	'use strict';

	var manifest = window.tutorialManifest;

	manifest.tutorials.forEach( function ( tutorial, i ) {
		tutorial.slug = slugify( tutorial.title );
		tutorial.index = i;
	});

	return manifest;

});