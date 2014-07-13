var ractive = new Ractive({
  el: output,
  template: template,
  data: { greeting: 'Hello', recipient: 'world' }
});

/* [hint] ---- //
Throughout this tutorial, you can use the variables `output` and `template` to refer to the panel on the left, and the contents of the panel above, respectively
// --- [/hint] */