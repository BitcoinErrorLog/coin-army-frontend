'use strict';

define([
    'common/directives'
], function (directives) {

    directives.directive('header', function () {
        return {
            templateUrl: 'views/directives/header/header.html',
            restrict: 'E',
            replace: true,
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
            }]
        }
    });
});