// For the sake of readability, the `xmen`
// variable has been pre-defined for the
// rest of this tutorial

var ractive = new Ractive({
  el: output,
  template: template,
  data: { superheroes: xmen }
});
