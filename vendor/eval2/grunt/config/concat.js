module.exports = {
	amd: {
		src: 'src/eval2.js',
		dest: 'tmp/eval2.amd.js',
		options: {
			banner: '<%= intro_amd %>',
			footer: '<%= outro_amd %>'
		}
	},
	node: {
		src: 'src/eval2.js',
		dest: 'tmp/eval2.node.js',
		options: {
			banner: '<%= intro_node %>',
			footer: '<%= outro_node %>'
		}
	},
	es6: {
		src: 'src/eval2.js',
		dest: 'eval2.es6.js',
		options: {
			process: true,
			banner: '<%= banner %>',
			footer: '\nexport default eval2;'
		}
	},
	umd: {
		src: 'src/eval2.js',
		dest: 'tmp/eval2.umd.js',
		options: {
			banner: '<%= intro %>',
			footer: '<%= outro %>'
		}
	},
	banner: {
		files: [{
			expand: true,
			cwd: 'tmp/',
			src: ['eval2.*.js'],
			rename: function ( dest, name ) {
				if ( name === 'eval2.umd.js' ) {
					return 'eval2.js';
				}
				return name;
			},
			dest: ''
		}],
		options: {
			process: true,
			banner: '<%= banner %>'
		}
	}
};
