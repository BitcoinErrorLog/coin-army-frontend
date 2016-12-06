'use strict';

define([
    'common/factories',
    'common/config'
], function (factories, config) {

    var injectParams = ['$resource'];

    var factory = function ($resource) {
        var transformResponse = function (data, headers) {
            var response = {};
            response.data = angular.fromJson(data);
            response.headers = headers();
            return response;
        };

        return $resource(config.API_SERVER + 'api/message-groups/:messageGroupId', {messageGroupId: '@id'}, {
            query: {
                method: 'GET',
                transformResponse: transformResponse
            },
            queryByCategory: {
                method: 'GET',
                url: config.API_SERVER + 'api/message-groups/category/:code',
                params: {code: '@code'},
                transformResponse: transformResponse
            },
            queryByLabel: {
                method: 'GET',
                url: config.API_SERVER + 'api/message-groups/label/:code',
                params: {code: '@code'},
                transformResponse: transformResponse
            },
            queryByLanguage: {
                method: 'GET',
                url: config.API_SERVER + 'api/message-groups/language/:code',
                params: {code: '@code'},
                transformResponse: transformResponse
            },
            'update': {method: 'PUT'}
        });
    };

    factory.$inject = injectParams;

    factories.factory('messageGroupResource', factory);
});