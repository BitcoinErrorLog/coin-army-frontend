require.config({

    paths: {
        'angular': '../vendor/angular/angular',
        'angular-ui-router': '../vendor/angular-ui-router/release/angular-ui-router',
        'angular-resource': '../vendor/angular-resource/angular-resource',
        'angular-bootstrap': '../vendor/angular-bootstrap/ui-bootstrap',
        'angular-bootstrap-tpls': '../vendor/angular-bootstrap/ui-bootstrap-tpls',
        'ngStorage': '../vendor/ngstorage/ngStorage',
        'ngFileUpload': '../vendor/ng-file-upload/ng-file-upload',
        'infinite-scroll': '../vendor/ngInfiniteScroll/build/ng-infinite-scroll',
        'jquery': '../vendor/jquery/dist/jquery',
        'bootstrapjs': '../vendor/bootstrap-sass/assets/javascripts/bootstrap.min',
        'google-analytics': '../vendor/angular-google-analytics/dist/angular-google-analytics',
        'rxjs': '../vendor/rxjs/dist/rx.lite',
        'domReady': '../vendor/requirejs-domready/domReady'
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'angular-resource': {
            deps: ['angular']
        },
        'angular-bootstrap': {
            deps: ['angular-bootstrap-tpls', 'bootstrapjs']
        },
        'angular-bootstrap-tpls': {
            deps: ['angular', 'bootstrapjs']
        },
        'ngStorage': {
            deps: ['angular']
        },
        'ngFileUpload': {
            deps: ['angular']
        },
        'bootstrapjs' : {
            deps: ['jquery']
        },
        'infinite-scroll' : {
            deps: ['angular']
        },
        'google-analytics': {
            deps: ['angular']
        }
    },

    deps: [
        // kick start application... see bootstrap.js
        './bootstrap'
    ]
});