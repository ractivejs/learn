var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    // placeholder image data
    image: {
      src: '../../gifs/problem.gif',
      caption: 'Trying to work out a problem after the 5th hour'
    }
  }
});