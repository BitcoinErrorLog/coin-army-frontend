'use strict';
define([], function () {
    return {
        normalizeClass: function (labelClass) {
            var classes = ['transparent', 'gray', 'dark-gray', 'light-gray', 'blue', 'light-blue', 'dark-blue', 'green', 'light-green',
                    'dark-green', 'red', 'light-red', 'dark-red', 'yellow', 'canary', 'olive', 'magenta', 'fuchsia',
                    'dark-magenta', 'cyan', 'dark-cyan'],

                defaultClass = 'gray';

            return 'label-' + (classes.indexOf(labelClass) != -1 ? labelClass : defaultClass);
        },

        abbreviate: function (text) {
            if (!angular.isString(text)) {
                return '';
            }
            if (text.length < 30) {
                return text;
            }
            return text ? (text.substring(0, 15) + '...' + text.slice(-10)) : '';
        },

        byteSize: function (base64String) {
            if (!angular.isString(base64String)) {
                return '';
            }

            function endsWith(suffix, str) {
                return str.indexOf(suffix, str.length - suffix.length) !== -1;
            }

            function paddingSize(base64String) {
                if (endsWith('==', base64String)) {
                    return 2;
                }
                if (endsWith('=', base64String)) {
                    return 1;
                }
                return 0;
            }

            function size(base64String) {
                return base64String.length / 4 * 3 - paddingSize(base64String);
            }

            function formatAsBytes(size) {
                return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' bytes';
            }

            return formatAsBytes(size(base64String));
        },

        openFile: function (type, data) {
            $window.open('data:' + type + ';base64,' + data, '_blank', 'height=300,width=400');
        },

        toBase64: function (file, cb) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function (e) {
                var base64Data = e.target.result.substr(e.target.result.indexOf('base64,') + 'base64,'.length);
                cb(base64Data);
            };
        }
    };

});