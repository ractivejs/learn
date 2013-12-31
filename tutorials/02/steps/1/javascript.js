var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    item: 'pint of milk',
    price: 0.49,
    quantity: 5
  }
});