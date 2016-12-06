define(['angular'], function (ng) {
    'use strict';
    var factories = ng.module('app.factories', []);

    factories.config(['$provide', function($provide){
        factories.factory = $provide.factory;
    }]);

    return factories;
});