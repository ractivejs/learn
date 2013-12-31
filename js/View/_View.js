/*global define, document */

define( [ 'Ractive', 'Divvy', 'rv!View/template', 'lib/Ractive-adaptors-Statesman' ], function ( Ractive, Divvy, template ) {

	'use strict';

	return Ractive.extend({
		template: template,
		adaptors: [ 'Statesman' ],

		init: function () {
			var view = this;

			this.divvy = new Divvy({
				el: document.getElementById( 'content' ),
				columns: [
					{
						size: 45,
						children: [{ id: 'copy-block', size: 3 }, { id: 'output-block', size: 2 }]
					},
					{
						size: 55,
						children: [{ id: 'template', size: 3 }, { id: 'javascript', size: 5 }, { id: 'console', size: 2 }]
					}
				]
			});

			this.divvy.restore();

			this.divvy.on( 'resize', function ( changed ) {
				this.save();

				if ( !changed[ 'output-block' ] ) {
					return;
				}

				view.fire( 'resize' );
			});

			this.copy = this.find( '.copy' );
			this.output = this.find( '.output' );

			this.observe( 'currentStep.copy', function () {
				prettyPrint( null, view.copy );
			}, { defer: true });
		},

		reset: function () {
			// scroll all blocks back to top - TODO
			this.copy.scrollTop = 0;
			this.output.scrollTop = 0;
		}
	});

});