var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    item: 'pint of milk',
    price: 0.49,
    quantity: 5,
    format: function ( num ) {
      if ( num < 1 ) return ( 100 * num ) + 'p';
      return '£' + num.toFixed( 2 );
    }
  }
});