define(['angular'], function (ng) {
    'use strict';
    var directives = ng.module('app.directives', []);

    directives.config(['$compileProvider', function($compileProvider){
        directives.directive = $compileProvider.directive;
    }]);

    return directives;
});