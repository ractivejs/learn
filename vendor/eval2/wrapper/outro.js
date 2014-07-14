
// export as AMD module...
if ( typeof define === "function" && define.amd ) {
	define( function () {
		return eval2;
	});
}

// ...or as Common JS module...
if ( typeof module !== "undefined" && module.exports ) {
	module.exports = eval2;
}

// ...or as browser global
global.eval2 = eval2;

}( typeof window !== 'undefined' ? window : this ));
