define(['angular'], function (ng) {
    'use strict';
    var controllers = ng.module('app.controllers', []);

    controllers.config(['$controllerProvider', function($controllerProvider){
        controllers.register = $controllerProvider.register;
    }]);

    return controllers;
});