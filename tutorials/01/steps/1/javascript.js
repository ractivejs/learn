var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    country: {
      name: 'The UK',
      climate: { temperature: 'cold', rainfall: 'excessive' },
      population: 62641000,
      capital: { name: 'London', lat: 51.5171, lon: -0.1062 }
    }
  }
});