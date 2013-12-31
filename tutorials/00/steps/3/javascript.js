var ractive = new Ractive({
  el: output,
  template: template,
  data: { greeting: 'Hello', recipient: 'world' }
});