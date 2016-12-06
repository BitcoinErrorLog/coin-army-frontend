'use strict';

define([
    'common/factories',
    'common/config'
], function (factories, config) {

    var injectParams = ['$resource'];

    var factory = function ($resource) {
        return $resource(config.API_SERVER + 'api/group-profiles/:id', {id: '@id'}, {
            getByGroupIdentifier: {
                method: 'GET',
                url: config.API_SERVER + 'api/group-profiles/group/identifier/:identifier',
                params: {identifier: '@identifier'}
            }
        })
    };

    factory.$inject = injectParams;

    factories.factory('groupProfileResource', factory);
});