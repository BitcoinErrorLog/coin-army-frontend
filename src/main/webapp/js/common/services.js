define(['angular'], function (ng) {
    'use strict';
    var services = ng.module('app.services', []);

    services.config(['$provide', function($provide){
        services.service = $provide.service;
    }]);

    return services;
});