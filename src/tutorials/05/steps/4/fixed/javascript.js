var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    superheroes: xmen,
    sort: function ( array, column ) {
      array = array.slice(); // clone, so we don't modify the underlying data

      return array.sort( function ( a, b ) {
        return a[ column ] < b[ column ] ? -1 : 1;
      });
    },
    sortColumn: 'name'
  }
});

ractive.on( 'sort', function ( event, column ) {
  this.set( 'sortColumn', column );
});
