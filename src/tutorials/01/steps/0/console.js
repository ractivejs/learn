// Once we've rendered our view, we can change the country info
ractive.set( 'country', {
  name: 'Australia',
  climate: { temperature: 'hot', rainfall: 'limited' },
  population: 22620600,
  capital: { name: 'Canberra', lat: -35.2828, lon: 149.1314 }
});