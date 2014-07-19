var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    country: {
      name: 'The UK',
      climate: { temperature: 'cold', rainfall: 'excessive' },
      population: 63230000,
      capital: { name: 'London', lat: 51.5171, lon: -0.1062 }
    }
  }
});
