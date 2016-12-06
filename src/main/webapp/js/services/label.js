'use strict';

define([
    'common/factories',
    'common/config'
], function (factories, config) {

    var injectParams = ['$resource'];

    var factory = function ($resource) {
        return $resource(config.API_SERVER + 'api/labels/:id', {id: '@id'}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        })
    };

    factory.$inject = injectParams;

    factories.factory('labelResource', factory);
});