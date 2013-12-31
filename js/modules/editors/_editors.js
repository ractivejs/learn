define([

], function (

) {

	'use strict';

	return function ( app ) {
		var config, computed, editors;

		config = {
			template: {
				mode: 'htmlmixed'
			},
			javascript: {
				mode: 'javascript',
				extraKeys: { 'Shift-Enter': function () { app.fire( 'execute:javascript' ); } }
			},
			console: {
				mode: 'javascript',
				extraKeys: { 'Shift-Enter': function () { app.fire( 'execute:console' ); } }
			}
		};

		editors = [ 'template', 'javascript', 'console' ];

		computed = {};
		editors.forEach( function ( editorName ) {
			var editor, options;

			options = config[ editorName ];

			editor = new CodeMirror( document.getElementById( editorName + '-editor' ), {
				mode: options.mode,
				theme: 'ractive',
				lineNumbers: true,
				extraKeys: options.extraKeys
			});

			app.compute( editorName, {
				get: function () {
					return editor.getValue();
				},
				set: function ( value ) {
					editor.setValue( value || '' );
				}
			});

			// When we reset for the next step, scroll to the top
			app.on( 'reset', function () {
				editor.scrollTo( 0, 0 );
			});
		});
	};

});