var colors = [ 'red', 'green', 'blue', 'purple' ];

var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    colors: colors,
    meta: /Mac/.test(navigator.appVersion) ? 'Cmd' : 'Ctrl'
  }
});