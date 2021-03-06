module.exports = (grunt) ->
	grunt.initConfig {
		clean :
			compiled : './lib/*'
			options :
				force : true

		watch :
			compileCoffee :
				files : ['./src/**/*.coffee']
				tasks : ['coffee:compile']

		coffee :
			compile :
				expand : true,
				cwd : './src/'
				src: ['*.coffee']
				dest : './lib/'
				ext : '.js'
	}

	require('load-grunt-tasks')(grunt, { scope: 'devDependencies' })

	grunt.registerTask 'compile', ['clean:compiled', 'coffee:compile']
	grunt.registerTask 'default', ['compile']