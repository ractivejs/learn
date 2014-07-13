// You can attach multiple handlers to a single proxy event
ractive.on( 'activate', function () {
  alert( 'I am also activating!' );
});