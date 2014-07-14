# eval2.js

Sometimes you need to use generated code in your app. But sometimes that generated code has syntax errors in it, which causes an error to be thrown:

```js
code =
  'function add ( a, b ) {\n' +
  '  return a _ b;\n' +  // oops! fat finger. we meant `+`, not `_`
  '}';

add = eval( '(' + code + ')' ); // 'SyntaxError: Unexpected identifier'
```

But where is the syntax error? In this case it's obvious, but imagine the code has dozens of lines. Maybe it won't be so obvious then. The stack trace will include the call to `eval`, but *not* the line of code that contained the error.

The same is true of `new Function()`:

```js
var add = new Function( 'a', 'b', 'return a _ b' );
```

**eval2.js** fixes this problem. In modern **browsers**, the code is converted to a data URI and inserted via a `<script>` tag. In **node.js**, a temporary module is created. In both cases, any syntax errors that are thrown will include the offending code in the stack trace.



## Installation

Install with npm...

```
$ npm i eval2
```

...or bower...

```
bower i eval2
```

...or grab a copy of [eval2.js](https://raw.githubusercontent.com/Rich-Harris/eval2/master/eval2.js) and include it in your app (works as AMD or node.js module, or as browser global).


## Usage

```js
var eval2 = require( 'eval2' );

var code =
  'function add ( a, b ) {\n' +
  '  return a _ b;\n' +
  '}';

eval2( '(' + code + ')' );

// You can optionally pass in a sourceURL which will be used
// for debugging where possible
eval2( '(' + code + ')', {
  sourceURL: 'add.js'
});
```

In **browsers**, you'll get an `Uncaught SyntaxError` message printed to the console, with a link pointing to the offending line of code. Note that you can't capture this stack trace programmatically - the error will be thrown asynchronously (because code added via a dynamic `<script>` element always executes asynchronously), so you must inspect the code via the console.

In **node.js**, the code itself will be printed to the console, along with the error.

You can also create functions using `eval2.Function` - this behaves similarly to `new Function()`:

```js
// If the function body contains a syntax error, eval2 will
// reveal it:
var add = new eval2.Function( 'a', 'b', 'return a + b' );
```



## Notes

The line numbers in node.js error reports will be 1 greater than the actual line number; this is because the code is wrapped in an anonymous function.

Unlike the standard `eval`, code executed with `eval2` will always be executed in the global scope:

```js
(function () {
  // this works...
  var answer = 42;
  eval( 'alert(answer)' );

  // ...but this won't, because `answer` doesn't exist
  // in the global scope
  eval2( 'alert(answer)' );
}());
```


## Similar projects

[node-syntax-error](https://github.com/substack/node-syntax-error) by [substack](http://twitter.com/substack) finds syntax errors in node programs by attempting to parse them with [esprima](http://esprima.org/).


## Credits and feedback

Issues, pull requests and feedback welcome. I'm [@Rich_Harris](http://twitter.com/Rich_Harris) on Twitter.

[@martypdx](http://twitter.com/martypdx) figured out how to dynamically generate modules in node.js.


## License

MIT.
