module.exports = {
	files: [ 'src/**/*.js' ],
	options: {
		strict: false,
		undef: true,
		unused: true,
		sub: true,
		globals: {
			define: true,
			module: true,
			require: true,
			__dirname: true,
			global: true,
			window: true,
			document: true,
			console: true
		}
	}
};
