'use strict';

define([
    'common/controllers',
    'common/util',
    'services/messageGroup',
    'services/category',
    'services/label',
    'services/region',
    'services/country',
    'services/city'

], function (controllers, util) {

    var injectParams = ['$scope', '$window', '$stateParams', '$timeout', '$uibModalInstance', 'entity',
        'messageGroupResource', 'categoryResource', 'labelResource', 'regionResource', 'countryResource', 'cityResource'];

    var controller = function ($scope, $window, $stateParams, $timeout, $uibModalInstance, entity,
        messageGroupResource, categoryResource, labelResource, regionResource, countryResource, cityResource) {

        var vm = this;

        vm.messageGroup = entity;
        vm.clear = clear;
        vm.byteSize = util.byteSize;
        vm.openFile = util.openFile;
        vm.save = save;
        vm.categories = categoryResource.query();
        vm.labels = labelResource.query();
        vm.regions = regionResource.query();
        vm.countries = countryResource.query();
        //vm.cities = cityResource.query();

        /*$timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });*/

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;

            if (vm.messageGroup.category) {
                vm.messageGroup.categories = [vm.messageGroup.category];
            }

            if (vm.messageGroup.id !== null) {
                messageGroupResource.update(vm.messageGroup, onSaveSuccess, onSaveError);
            } else {
                messageGroupResource.save(vm.messageGroup, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('messageGroupUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


        vm.setLogo = function ($file, messageGroup) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                util.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        messageGroup.logo = base64Data;
                        messageGroup.logoContentType = $file.type;
                    });
                });
            }
        };

    };

    controller.$inject = injectParams;

    controllers.register('GroupDialogController', controller);
});
