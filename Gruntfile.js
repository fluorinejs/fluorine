module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['build/*']
        },

        eslint: {
            source: {
                src: ['src/{,*/}*.{js,jsx}', '!src/{,*/}__tests__/*.js'],
                options: {
                    configFile: '.eslintrc'
                }
            },
            tests: {
                src: ['src/{,*/}__tests__/*.{js,jsx}'],
                options: {
                    globals: ['jest'],
                    envs: ['jasmine', 'amd', 'node', 'browser']
                }
            },

            scripts: {
                src: ['Gruntfile.js']
            }
        },

        babel: {
            options: {
                sourceMap: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['{,*/}*.js{,x}'],
                    dest: 'build/',
                    ext: '.js'
                }],

                options: {
                    plugins: ['remove-console']
                }
            }

        }
    });

    grunt.registerTask('lint', [
        'eslint'
    ]);
};
