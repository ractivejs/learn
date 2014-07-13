var Slideshow = Ractive.extend({
  template: template,

  // method for changing the currently displayed image
  goto: function ( imageNum ) {
    // make sure the image number is between 0...
    while ( imageNum < 0 ) {
      imageNum += this.images.length;
    }

    // and the maximum
    imageNum = imageNum % this.images.length;

    // update the view
    this.set( 'image', this.images[ imageNum ] );
    this.currentImage = imageNum;
  },

  // initialisation code
  init: function ( options ) {
    var self = this;

    this.images = options.images;

    this.on({
      prev: function () { self.goto( self.currentImage - 1 ); },
      next: function () { self.goto( self.currentImage + 1 ); }
    });

    this.goto( 0 ); // start with the first image
  }
});

var slideshow = new Slideshow({
  el: output,
  images: [
    { src: '../../gifs/problem.gif', caption: 'Trying to work out a problem after the 5th hour' },
    { src: '../../gifs/css.gif',     caption: 'Trying to fix someone else\'s CSS' },
    { src: '../../gifs/ie.gif',      caption: 'Testing interface on Internet Explorer' },
    { src: '../../gifs/w3c.gif',     caption: 'Trying to code to W3C standards' },
    { src: '../../gifs/build.gif',   caption: 'Visiting the guy that wrote the build scripts' },
    { src: '../../gifs/test.gif',    caption: 'I don\'t need to test that. What can possibly go wrong?' }
  ]
});