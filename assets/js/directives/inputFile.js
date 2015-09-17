'use strict';

var inputFileModule = angular.module('inputFileBootstrap', []);

inputFileModule.directive('fileBootstrap', function() {
    return {
        restrict: 'AE',
        link: function(scope, element) {
            element.on('change', function() {
                var label = element.val().replace(/\\/g, '/').replace(/.*\//, '');
                angular.element(document.querySelector('#btn-file-text')).val(label);
            });
        }
    };
});
