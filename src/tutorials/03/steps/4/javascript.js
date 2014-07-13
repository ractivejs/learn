var ractive = new Ractive({
  el: output,
  template: template
});

var selected;

ractive.on( 'select', function ( event ) {
  var node, gif, caption;

  node = event.node;
  gif = node.src.replace( 'jpg', 'gif' );
  caption = node.getAttribute( 'data-caption' );

  this.set({
    gif: gif,
    caption: caption
  });

  // deselect previous selection
  if ( node !== selected && selected && selected.classList ) {
  	selected.classList.remove( 'selected' );
  }

  // select new selection (unless you're in IE
  // in which case no classList for you. Sucka)
  if ( node.classList ) {
    node.classList.add( 'selected' );
    selected = node;
  }
});