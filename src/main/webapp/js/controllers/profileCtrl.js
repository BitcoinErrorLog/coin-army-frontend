'use strict';

define([
    'common/controllers',
    'common/util',

    'services/messageGroup',
    'services/groupProfile',
    'directives/header/header',
    'directives/footer/footer'
], function (controllers, util) {

    var injectParams = ['$scope', 'messageGroupResource', 'groupProfileResource', '$state', 'Analytics'];

    var controller = function($scope, messageGroupResource, groupProfileResource, $stateParams, Analytics){
        $scope.vm = this;
        this.scope = $scope;

        $scope.profile = {};
        $scope.group = {};

        $scope.profile = groupProfileResource.getByGroupIdentifier({identifier:$stateParams.params.identifier},
            function (result) {
                $scope.group = result.messageGroup;

                $scope.group.ownerLink = null;
                if (!angular.isUndefined($scope.group.owner) && $scope.group.owner.indexOf('@') == 0) {
                    $scope.group.ownerLink = 'https://telegram.me/' + $scope.group.owner.substring(1);
                }

                if($scope.group.labels) Rx.Observable.fromArray($scope.group.labels)
                    .subscribe(function(label){
                        label.elementClass = util.normalizeClass(label.color);
                    });

                if($scope.group.categories) Rx.Observable.fromArray($scope.group.categories)
                    .subscribe(function(category){
                        category.elementClass = util.normalizeClass(category.color);
                    });

            });
    };

    controller.$inject = injectParams;

    controllers.register('ProfileController', controller);
});