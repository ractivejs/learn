export default function throttle ( fn, options ) {
	var nextAllowed, scheduled;

	if ( typeof options !== 'object' ) {
		options = {
			delay: options
		};
	}

	if ( !options.delay ) {
		options.delay = 250; // default value is 250 milliseconds
	}

	return function () {
		var args, timeNow, call, context;

		args = arguments;
		timeNow = Date.now();

		context = options.context || this;

		call = function () {
			fn.apply( context, args );

			nextAllowed = Date.now() + options.delay;
			scheduled = false;
		};

		// if it's been less than [delay] since the last call...
		if ( timeNow < nextAllowed ) {
			// schedule a call, if one isn't already scheduled
			if ( !scheduled ) {
				setTimeout( call, nextAllowed - timeNow );
				scheduled = true;
			}
		}

		else {
			call();
		}
	};
}
