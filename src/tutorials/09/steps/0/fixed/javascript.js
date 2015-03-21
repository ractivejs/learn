var item = "<li class='{{ done ? \"done\" : \"pending\" }}'>" +
             "<input type='checkbox' checked='{{done}}'>" +
             "<span class='description' on-tap='edit'>" +
               "{{description}}" +

               "{{#if editing}}" +
                 "<input class='edit' " +
                        "value='{{description}}' " +
                        "on-blur='stop_editing'>" +
               "{{/if}}" +
             "</span>" +
             "<a class='button' on-tap='remove'>x</a>" +
           "</li>";

var TodoList = Ractive.extend({
  template: template,

  partials: { item: item },

  addItem: function ( description ) {
    this.push( 'items', {
      description: description,
      done: false
    });
  },

  removeItem: function ( index ) {
    this.splice( 'items', index, 1 );
  },

  editItem: function ( index ) {
    var self = this, keydownHandler, blurHandler, input, currentDescription;

    currentDescription = this.get( 'items.' + index + '.description' );
    this.set( 'items.' + index + '.editing', true );

    input = this.find( '.edit' );
    input.select();

    window.addEventListener( 'keydown', keydownHandler = function ( event ) {
      switch ( event.which ) {
        case 13: // ENTER
        input.blur();
        break;

        case 27: // ESCAPE
        input.value = currentDescription;
        self.set( 'items.' + index + '.description', currentDescription );
        input.blur();
        break;

        case 9: // TAB
        event.preventDefault();
        input.blur();
        self.editItem( ( index + 1 ) % self.get( 'items' ).length );
        break;
      }
    });

    input.addEventListener( 'blur', blurHandler = function () {
      window.removeEventListener( 'keydown', keydownHandler );
      input.removeEventListener( 'blur', blurHandler );
    });

    this.set( 'items.' + index + '.editing', true );
  },

  init: function ( options ) {
    var self = this;

    // proxy event handlers
    this.on({
      remove: function ( event ) {
        this.removeItem( event.index.i );
      },
      newTodo: function ( event ) {
        this.addItem( event.node.value );
        event.node.value = '';
        setTimeout( function () {
          event.node.focus();
        }, 0 );
      },
      edit: function ( event ) {
        this.editItem( event.index.i );
      },
      stop_editing: function ( event ) {
        this.set( event.keypath + '.editing', false );
      },
      blur: function ( event ) {
        event.node.blur();
      }
    });
  },

  // sadly this is necessary for IE - other browsers fire the change event
  // when you hit enter
  events: {
    enter: function ( node, fire ) {
      var keydownHandler = function ( event ) {
        var which = event.which || event.keyCode;
        which === 13 && fire({ node: node, original: event });
      };

      node.addEventListener( 'keydown', keydownHandler );

      return {
        teardown: function () {
          node.removeEventListener( 'keydown', keydownHandler );
        }
      };
    }
  }
});

var ractive = new TodoList({
  el: output,
  data: {
    items: [
      { done: true,  description: 'Add a todo item' },
      { done: false, description: 'Add some more todo items' },
      { done: false, description: 'Complete all the Ractive tutorials' }
    ]
  }
});
