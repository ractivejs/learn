var Slideshow = Ractive.extend({
  template: template,

  // method for changing the currently displayed image
  goto: function ( imageNum ) {
    var images = this.get( 'images' );

    // Make sure the image number is between 0...
    while ( imageNum < 0 ) {
      imageNum += images.length;
    }

    // ...and the maximum
    imageNum %= images.length;

    // Then, update the view
    this.set({
      image: images[ imageNum ],
      current: imageNum
    });
  },

  // initialisation code
  oninit: function ( options ) {
    this.on( 'goto', function ( event, index ) {
      this.goto( index );
    });

    // start with the first image
    this.goto( 0 );
  }
});

var slideshow = new Slideshow({
  el: output,
  data: { images: images }
});
