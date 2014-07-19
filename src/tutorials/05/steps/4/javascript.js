var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    superheroes: xmen,
    sort: function ( array, sortColumn ) {
      // add sorting logic here
      return array;
    }
  }
});

ractive.on( 'sort', function ( event, column ) {
  alert( 'Sorting by ' + column );
});
