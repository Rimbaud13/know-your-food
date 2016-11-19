module.exports = grunt => {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    babel: {
      build: {
        files: {
          'build/app.js': 'src/app.js'
        }
      }
    },
    express: {
      build: {
        options: {
          script: 'build/app.js'
        }
      }
    },
    clean: 'build',
    watch: {
      options: {
        livereload: true
      },
      babel: {
        files: 'src/**/*.js',
        tasks: ['babel', 'express'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.registerTask('default', ['clean', 'babel', 'express']);
  grunt.registerTask('dev', ['default', 'watch']);

};
