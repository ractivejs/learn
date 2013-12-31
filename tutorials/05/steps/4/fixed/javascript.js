// define our superheroes
var xmen = [
  { name: 'Nightcrawler', realname: 'Wagner, Kurt',     power: 'Teleportation', info: 'http://www.superherodb.com/Nightcrawler/10-107/' },
  { name: 'Cyclops',      realname: 'Summers, Scott',   power: 'Optic blast',   info: 'http://www.superherodb.com/Cyclops/10-50/' },
  { name: 'Rogue',        realname: 'Marie, Anna',      power: 'Absorbing powers', info: 'http://www.superherodb.com/Rogue/10-831/' },
  { name: 'Wolverine',    realname: 'Howlett, James',   power: 'Regeneration',  info: 'http://www.superherodb.com/Wolverine/10-161/' }
];

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