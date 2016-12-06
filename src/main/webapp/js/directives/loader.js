'use strict';

define([
    'common/directives'
], function (directives) {

    directives.directive('loader', function () {
        return {
            templateUrl: 'views/directives/loader/loader.html',
            restrict: 'E',
            replace: true,
            controller: ['$scope', function ($scope) {
            }]
        }
    });
});