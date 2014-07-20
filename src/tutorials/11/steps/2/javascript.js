var ractive;

get( '/illustration.html' ).then( function ( template ) {
  var viewBoxes = {
    normal: { x: 0, y: 0, width: 819.18, height: 596.441 },
    neuron: { x: 0, y: 100, width: 560, height: 407.451 },
    axon: { x: 289, y: 195, width: 530, height: 385.623 },
    synapse: { x: 190, y: 0, width: 525, height: 381.985 }
  };

  ractive = new Ractive({
    el: output,
    template: template,
    data: {
      viewBox: viewBoxes.normal,
      detail: detail
    }
  });

  // after the view renders, fade in hotspots
  setTimeout( function () {
    ractive.set( 'showLabels', true );
  }, 1000 );

  ractive.on({
    resetView: function () {
      this.set({ info: null, closeup: null });
    },

    moreInfo: function ( event, info ) {
      this.set( 'info', info );
    },

    showCloseUp: function ( event, closeup ) {
      this.set( 'closeup', closeup );
    }
  });

  ractive.observe({
    closeup: function ( newCloseup, oldCloseup ) {
      var viewBox;

      // previous
      if ( oldCloseup ) {
        this.set( oldCloseup + 'Visible', false );
        this.set( 'showLabels', false );
      }

      // new
      viewBox = ( newCloseup ? viewBoxes[ newCloseup ] : viewBoxes.normal );

      this.animate( 'viewBox', viewBox, {
        duration: 300,
        easing: 'easeInOut',
        complete: function () {
          if ( newCloseup ) {
            ractive.set( newCloseup + 'Visible', true );
            ractive.set( 'showLabels', false );
          } else {
            ractive.set( 'showLabels', true );
          }
       }
      });
    }
  });
});
