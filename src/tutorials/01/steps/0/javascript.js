var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    country: {} // <-- replace the {} with country data
  }
});