var colors = [ 'red', 'green', 'blue' ];

var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    colors: colors,
    color: colors[1]
  }
});