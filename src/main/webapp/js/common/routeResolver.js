'use strict';
/*
 http://weblogs.asp.net/dwahlin/dynamically-loading-controllers-and-views-with-angularjs-and-requirejs
 https://github.com/DanWahlin/CustomerManager
 */
define(['angular', 'common/services'], function (ng, services) {

    var routeResolver = function () {

        this.$get = function () {
            return this;
        };

        this.routeConfig = function () {
            var viewsDirectory = 'views',
                controllersDirectory = 'controllers/',

                setBaseDirectories = function (viewsDir, controllersDir) {
                    viewsDirectory = viewsDir;
                    controllersDirectory = controllersDir;
                },

                getViewsDirectory = function () {
                    return viewsDirectory;
                },

                getControllersDirectory = function () {
                    return controllersDirectory;
                };

            return {
                setBaseDirectories: setBaseDirectories,
                getControllersDirectory: getControllersDirectory,
                getViewsDirectory: getViewsDirectory
            };
        }();

        this.route = function (routeConfig) {


            var resolve = function (cfg) {
                    var o = {
                        module: '',
                        url: '',
                        baseName: '',
                        controllerAs: '',
                        secure: false,
                        controllerUrl: function () {
                            var baseFileName = this.$get('baseFileName'),
                                module = this.$get('module');
                            return routeConfig.getControllersDirectory() + module + ( baseFileName ? '/' + baseFileName : '' ) + 'Ctrl';
                        },
                        controller: function () {
                            return this.$get('baseName') + 'Controller';
                        },
                        baseFileName: function () {
                            var baseName = this.$get('baseName');
                            return baseName ? baseName.charAt(0).toLowerCase() + baseName.substr(1) : '';
                        },
                        templateUrl: function () {
                            var baseFileName = this.$get('baseFileName'),
								module = this.$get('module');
                            return routeConfig.getViewsDirectory() + 
								( module ? '/' + module : '' ) +
								( baseFileName ? '/' + baseFileName : '' ) + '.html';
                        },
                        $get: function (attr) {
                            var attr_ = this[attr];
                            if (angular.isFunction(attr_)) {
                                return attr_.call(this);
                            }
                            return attr_;
                        }
                    };
                    jQuery.extend(o, cfg);

                    var routeDef = {};
                    var baseFileName = o.$get('baseFileName');

                    routeDef.url = o.$get('url');

                    routeDef.templateUrl = o.$get('templateUrl');

                    if (o.$get('baseName')) routeDef.controller = o.$get('controller');
                    if (o.$get('controllerAs')) routeDef.controllerAs = o.$get('controllerAs');
                    routeDef.secure = o.$get('secure') ? o.$get('secure') : false;
                    if (o.$get('baseName')) routeDef.resolve = {
                        load: ['$q', '$rootScope', function ($q, $rootScope) {
                            var dependencies = [o.$get('controllerUrl')];
                            return resolveDependencies($q, $rootScope, dependencies);
                        }]
                    };

                    return routeDef;
                },

                resolveOld = function (module, url, baseName, controllerAs, secure) {
                    if (!module) module = '';
                    if (!url) url = '';

                    var routeDef = {};
                    var baseFileName = baseName ? baseName.charAt(0).toLowerCase() + baseName.substr(1) : '';
                    routeDef.url = url;
                    routeDef.templateUrl = routeConfig.getViewsDirectory() + module + ( baseFileName ? '/' + baseFileName : '' ) + '.html';
                    if (baseName) routeDef.controller = baseName + 'Controller';
                    if (controllerAs) routeDef.controllerAs = controllerAs;
                    routeDef.secure = (secure) ? secure : false;
                    if (baseName) routeDef.resolve = {
                        load: ['$q', '$rootScope', function ($q, $rootScope) {
                            var dependencies = [];
                            return resolveDependencies($q, $rootScope, dependencies);
                        }]
                    };

                    return routeDef;
                },

                resolveDependencies = function ($q, $rootScope, dependencies) {
                    var defer = $q.defer();
                    require(dependencies, function () {
                        defer.resolve();
                        $rootScope.$apply()
                    });

                    return defer.promise;
                };

            return {
                resolve: resolve
            }
        }(this.routeConfig);

    };

    //Must be a provider since it will be injected into module.config()
    services.provider('routeResolver', routeResolver);
});