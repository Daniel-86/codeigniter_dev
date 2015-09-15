'use strict';

var inputFileModule = angular.module('inputFileBootstrap', []);

inputFileModule.directive('fileBootstrap', function() {
    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
            element.on('change', function(e) {
                var inputFile = element;
                var label = inputFile.val().replace(/\\/g, '/').replace(/.*\//, '');
                angular.element(document.querySelector('#btn-file-text')).val(label);
            });
        }
    };
});
