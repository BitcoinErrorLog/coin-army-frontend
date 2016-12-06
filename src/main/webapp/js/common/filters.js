define(['angular'], function (ng) {
    'use strict';
    var filters = ng.module('app.filters', []);

    filters.config(['$filterProvider', function($filterProvider){
        filters.register = $filterProvider.register;
    }])

        .filter('trust', ['$sce', function ($sce) {
            return function(value, type) {
                // Defaults to treating trusted text as `html`
                return $sce.trustAs(type || 'html', value);
            }
        }])

        .filter('extractShortDescription', ['$sce', function ($sce) {
            return function(value) {
                if (!value) {
                    return value;
                }

                var start = value.indexOf('<p>');
                var end = value.indexOf('</p>');
                if (start < 0 || end < 0) {

                } else {
                    value = value.substring(3, end);
                }

                //value = '<div>' + value + '</div>';
                return $sce.trustAs('html', value);
            }
        }]);

    return filters;
});