import Ractive from 'ractive';

let teardownQueue = [];

function teardownExistingInstances () {
	teardownQueue.forEach( ractive => {
		ractive.transitionsEnabled = false; // otherwise outros will mess things up!
		ractive.teardown();
	});
}

function FakeRactive () {
	// we need to override the constructor so we can keep track of
	// which views need to be torn down during the tutorial
	Ractive.apply( this, arguments );
	teardownQueue.push( this );
}

// copy static methods and properties from the real Ractive to the fake one
let prop;
for ( prop in Ractive ) {
	if ( Ractive.hasOwnProperty( prop ) ) {
		FakeRactive[ prop ] = Ractive[ prop ];
	}
}

// Ditto for the non-enumerable ones
[ 'prototype', 'partials', 'adaptors', 'components', 'decorators', 'easing', 'events', 'interpolators', 'transitions', 'extend', 'svg', 'VERSION', 'Promise' ].forEach( prop => {
	const descriptor = Object.getOwnPropertyDescriptor( Ractive, prop );
	Object.defineProperty( FakeRactive, prop, descriptor );
});

FakeRactive.prototype.constructor = FakeRactive;

// override teardown method...
const teardown = Ractive.prototype.teardown;
FakeRactive.prototype.teardown = function () {
	const index = teardownQueue.indexOf( this );

	if ( ~index ) {
		teardownQueue.splice( index, 1 );
	}

	teardown.call( this );
};


// setTimeout and clearTimeout
const _setTimeout = window.setTimeout;
const _clearTimeout = window.clearTimeout;
let timeouts = [];

const setTimeout = function () { // not arrow function, we need arguments
	const timeout = _setTimeout.apply( window, arguments );
	timeouts.push( timeout );
};

const clearTimeout = timeout => {
	var index = timeouts.indexOf( timeout );
	if ( index !== -1 ) {
		timeouts.splice( index, 1 );
	}

	_clearTimeout( timeout );
};


// have to use default export because components can't yet
// use ES6 modules...
export default { FakeRactive, teardownExistingInstances, setTimeout, clearTimeout };