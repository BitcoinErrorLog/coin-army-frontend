module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-angular-templates');

	grunt.random = function(){
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			  .toString(16)
			  .substring(1);
		}
		return s4() + s4() + s4() + s4() +
			s4() + s4() + s4() + s4();
	}
	var random = grunt.random();
    grunt.initConfig({
		dir: random,
        copy: {
            fonts: {
                files: [
                    {expand: true, cwd: 'src/main/webapp/vendor/bootstrap-sass/assets', src: [
                        'fonts/**'
                    ], dest: 'src/main/webapp/', filter: 'isFile'},
                ]
            },
            main: {
                files: [
                    {expand: true, cwd: 'src/main/webapp', src: [
                        'css/**',
                        'fonts/**',
                        'img/**',
                        '*'
                    ], dest: 'temp/', filter: 'isFile'},
					{expand: true, cwd: 'src/main/webapp/js', src: [
                        '**/*'
                    ], dest: 'temp/<%= dir %>', filter: 'isFile'},
                    {expand: true, cwd: 'src/main/webapp/vendor/', src: [
                        'requirejs-domready/domReady.js',
                        'requirejs/require.js',

                        'angular/angular.js',
                        'angular-resource/angular-resource.js',
                        'angular-ui-router/release/angular-ui-router.js',
                        'angular-bootstrap/ui-bootstrap.js',
                        'angular-bootstrap/ui-bootstrap-tpls.js',
                        'ngstorage/ngStorage.js',
                        'ng-file-upload/ng-file-upload.js',
                        'ngInfiniteScroll/build/ng-infinite-scroll.js',
                        'jquery/dist/jquery.js',
                        'rxjs/dist/rx.lite.js',
                        'bootstrap-sass/assets/javascripts/bootstrap.min.js',
                        'angular-google-analytics/dist/angular-google-analytics.js'
                    ], dest: 'temp/vendor/', filter: 'isFile'},
                    {expand: true, cwd: 'src/main/webapp/vendor/angular-bootstrap', src: [
                        'ui-bootstrap-csp.css'
                    ], dest: 'temp/css', filter: 'isFile'}
                ]
            },
            webinf: {
                files: [
                    {expand: true, cwd: 'src/main/webapp', src: [
                        'WEB-INF'
                    ], dest: 'dist/'}
                ]
            }
        },
        requirejs: {
            copy: {
                options: {
                    appDir: 'temp',
                    mainConfigFile: 'temp/<%= dir %>/main.js',
                    dir: 'dist',
                    error: function(done, err) {
                        grunt.log.warn(err);
                        done();
                    }
                }
            },
            compile: {
                options: {
                    mainConfigFile: 'dist/<%= dir %>/main.js',
                    out: 'dist/<%= dir %>/main.js',
                    include: 'main',
                    error: function(done, err) {
                        grunt.log.warn(err);
                        done();
                    }
                }
            }
        },
        replace: {
            index: {
                src: ['dist/index.html'],
                dest: 'dist/index.html',
                replacements: [{
                    from: /(<link.*")([^"]+)(\/[^"]+\.css)/ig,
                    to: '$1css$3'
                },{
					from: /(<script.*data-main=")([^"]+)/ig,
					to: '$1<%= dir %>/main.js'
				}]
            },
			templatesApp: {
				src: ['temp/<%= dir %>/app.js'],
				dest: 'temp/<%= dir %>/app.js',
				replacements: [{
					from: 'return app;',
					to: function(){
						return grunt.file.read('temp/templates.js') +
							"\n\nreturn app;"
					}
				}]
			}
        },
        clean: {
            pre: ['temp', 'dist'],
            post: [
                'temp',
                'dist/vendor/angular',
                'dist/vendor/angular-resource',
                'dist/vendor/angular-ui-router',
                'dist/vendor/jquery',
                'dist/vendor/bootstrap',
                'dist/vendor/ngstorage',
                'dist/vendor/ng-file-upload',
                'dist/vendor/ngInfiniteScroll'
            ]
        },
        sass: {
            dist: {
                options: {
                    loadPath: [
                        'src/main/webapp/vendor/bootstrap-sass/assets/stylesheets/'
                    ],
                    style: 'expanded'
                },
                files: {
                    'src/main/webapp/css/style.css' : 'src/main/sass/css/style.scss'
                }
            }
        },
        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass']
            }
        },
		ngtemplates: {
			app: {
				cwd: 'src/main/webapp',
				src: 'views/**/*.html',
				dest: 'temp/templates.js'
			}
		}
    });


    grunt.registerTask('default', [
        'clean:pre',
        'sass:dist',
        'copy:fonts',
        'copy:main',
		'ngtemplates:app',
		'replace:templatesApp',
        'requirejs:copy',
        'requirejs:compile',
        'replace:index',
        'copy:webinf',
        'clean:post'
    ]);
};