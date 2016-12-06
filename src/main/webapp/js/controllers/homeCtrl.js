'use strict';

define([
    'common/controllers',
    'common/util',

    'controllers/groupDialogCtrl',
    'services/messageGroup',

    'directives/header/header',
    'directives/footer/footer',
    'directives/loader',

    'rxjs'
], function (controllers, util) {

    var injectParams = ['$scope', '$window', '$stateParams', '$q', 'messageGroupResource', 'Analytics'];

    var controller = function ($scope, $window, $stateParams, $q, messageGroupResource, Analytics) {
        $scope.vm = this;
        this.scope = $scope;
        $scope.util = util;
        $scope.messageGroups = [];
        $scope.title = 'Groups';

        $scope.vm.loadPage = loadPage;
        $scope.vm.page = 0;
        $scope.vm.pageSize = 10;
        $scope.vm.sort = ['priority,desc', 'members,desc'];
        $scope.vm.links = {
            last: 0
        };

        var params = $stateParams,
            promise = null;

        loadAll();

        function loadAll() {

            if (!angular.isUndefined(params.categoryCode) && params.categoryCode != null) {
                promise = messageGroupResource.queryByCategory({
                    code: params.categoryCode,
                    page: $scope.vm.page,
                    size: $scope.vm.pageSize,
                    sort: $scope.vm.sort
                }).$promise;
            } else if (!angular.isUndefined(params.languageCode) && params.languageCode != null) {
                promise = messageGroupResource.queryByLanguage({
                    code: params.languageCode,
                    page: $scope.vm.page,
                    size: $scope.vm.pageSize,
                    sort: $scope.vm.sort
                }).$promise;
            } else if (!angular.isUndefined(params.labelCode) && params.labelCode != null) {
                promise = messageGroupResource.queryByLabel({
                    code: params.labelCode,
                    page: $scope.vm.page,
                    size: $scope.vm.pageSize,
                    sort: $scope.vm.sort
                }).$promise;
            } else {
                promise = messageGroupResource.query({
                    page: $scope.vm.page,
                    size: $scope.vm.pageSize,
                    sort: $scope.vm.sort
                }).$promise;
            }

            promise.then(function (response) {
                $scope.vm.links = parse(response.headers['link']);
                $scope.vm.totalItems = response.headers['X-Total-Count'];

                var deferred = $q.defer();
                deferred.resolve(response.data);

                processResponse(deferred.promise);
            });
        }

        function processResponse(promise) {
            Rx.Observable.fromPromise(promise)
                .flatMap(function (data) {
                    return Rx.Observable.fromArray(data);
                })
                .map(function (mg) {
                    mg.category = null;
                    if (!angular.isUndefined(mg.categories) && mg.categories != null && mg.categories.length > 0) {
                        mg.category = mg.categories[0];
                    }
                    return mg;
                })
                .map(function (mg) {
                    mg.label = null;
                    if (!angular.isUndefined(mg.labels) && mg.labels != null && mg.labels.length > 0) {
                        mg.label = mg.labels[0];
                    }
                    return mg;
                })
                .map(function (mg) {
                    if (mg.label != null) {
                        mg.label.elementClass = util.normalizeClass(mg.label.color);
                    }
                    if (mg.category != null) {
                        mg.category.elementClass = util.normalizeClass(mg.category.color);
                    }
                    return mg;
                })
                .map(function (mg) {
                    mg.ownerLink = null;
                    if (!angular.isUndefined(mg.owner) && mg.owner.indexOf('@') == 0) {
                        mg.ownerLink = 'https://telegram.me/' + mg.owner.substring(1);
                    }
                    return mg;
                })
                .subscribe(function (mg) {
                    $scope.messageGroups.push(mg);

                    $scope.$emit('page:ready');
                },
                function (err) {
                    $scope.loading = false;
                    console.log('Error: ' + err);
                    console.log('Stack: ' + err.stack);
                }, function () {
                    $scope.loading = false;
                    $scope.$apply();
                });
        }

        function parse(header) {
            if (header == null || angular.isUndefined(header)) {
                return null;
            }

            if (header.length === 0) {
                throw new Error('input must not be of zero length');
            }

            // Split parts by comma
            var parts = header.split(',');
            var links = {};
            // Parse each part into a named link
            angular.forEach(parts, function(p) {
                var section = p.split(';');
                if (section.length !== 2) {
                    throw new Error('section could not be split on ";"');
                }
                var url = section[0].replace(/<(.*)>/, '$1').trim();
                var queryString = {};
                url.replace(
                    new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
                    function($0, $1, $2, $3) { queryString[$1] = $3; }
                );
                var page = queryString.page;
                if (angular.isString(page)) {
                    page = parseInt(page);
                }
                var name = section[1].replace(/rel="(.*)"/, '$1').trim();
                links[name] = page;
            });
            return links;
        }


        function loadPage(page) {
            $scope.loading = true;
            console.log('load page ' + page);
            $scope.vm.page = page;
            loadAll();
        }
    };

    controller.$inject = injectParams;

    controllers.register('HomeController', controller);
});