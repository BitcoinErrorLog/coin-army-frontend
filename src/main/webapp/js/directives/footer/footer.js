'use strict';

define([
    'common/directives'
], function (directives) {

    directives.directive('footer', function () {
        return {
            templateUrl: 'views/directives/footer/footer.html',
            restrict: 'E',
            replace: true,
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
            }]
        }
    });
});