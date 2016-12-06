'use strict';

/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'angular-ui-router',
    'angular-resource',
    'angular-bootstrap',
    'ngStorage',
    'ngFileUpload',
    'infinite-scroll',
    'google-analytics',

    'rxjs',

    'bootstrapjs',

    'common/controllers',
    'common/directives',
    'common/filters',
    'common/services',
    'common/factories',
    'common/routeResolver'
], function (ng) {

    var app = ng.module('app', [
        'app.controllers',
        'app.directives',
        'app.filters',
        'app.services',
        'app.factories',

        'ui.router',
        'ngStorage',
        'ngResource',
        'ngFileUpload',
        'infinite-scroll',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'angular-google-analytics'
    ]);

    var app_cached_providers = {};

    app.config(['$controllerProvider',
        function(controllerProvider) {
            app_cached_providers.$controllerProvider = controllerProvider;
        }
    ]);

    app.config(['$stateProvider', '$urlRouterProvider', 'routeResolverProvider',
        function($stateProvider, $urlRouterProvider, routeResolverProvider) {

            var route = routeResolverProvider.route;

            $urlRouterProvider
                .otherwise("/home");

            $stateProvider
                .state("home", route.resolve({
                    url: '/home',
                    baseName: 'Home'
                }))
                .state('group-new', {
                    parent: 'home',
                    url: '/new',
                    baseName: 'Add group',
                    onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                        $uibModal.open({
                            templateUrl: 'views/groupDialog.html',
                            controller: 'GroupDialogController',
                            controllerAs: 'vm',
                            backdrop: 'static',
                            size: 'lg',
                            resolve: {
                                entity: function () {
                                    return {
                                        name: null,
                                        owner: null,
                                        telegram: null,
                                        description: null,
                                        descriptionContentType: 'text/plain',
                                        logo: null,
                                        logoContentType: null,
                                        language: null,
                                        members: null,
                                        id: null
                                    };
                                }
                            }
                        }).result.then(function() {
                                $state.go('home', null, { reload: true });
                            }, function() {
                                $state.go('home');
                            });
                    }]
                })
                .state("profile", route.resolve({
                    url: '/profile/:identifier',
                    baseName: 'Profile'
                }))
                .state("category", route.resolve({
                    url: '/category/:categoryCode',
                    baseName: 'Home'
                }))
                .state("label", route.resolve({
                    url: '/label/:labelCode',
                    baseName: 'Home'
                }))
                .state("language", route.resolve({
                    url: '/language/:languageCode',
                    baseName: 'Home'
                }));

        }
    ]);

    app.config(['AnalyticsProvider', function (AnalyticsProvider) {
        AnalyticsProvider
            .setAccount('UA-80387313-1')
            .logAllCalls(true)
            .setHybridMobileSupport(true)
        //    .enterDebugMode(true)
        ;

    }]);

    app.controller('DummyController', ['Analytics', function(Analytics){}]);

    return app;
});