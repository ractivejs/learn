var ractive = new Ractive({
  el: output,
  template: template,
  data: { superheroes: xmen }
});

var newSuperhero = {
  name: 'Storm',
  realname: 'Monroe, Ororo',
  power: 'Controlling the weather',
  info: 'http://www.superherodb.com/Storm/10-135/'
};

xmen.push( newSuperhero );
