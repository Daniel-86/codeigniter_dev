/**
 * Created by daniel.jimenez on 21/09/2015.
 */

'use strict';

var makeitarrayModule = angular.module('makeitarray', []);

makeitarrayModule.directive('makeItArray', function() {

    function linkFn(scope, element, attrs, ctrl) {
        //var viewValue = ctrl.$viewValue;
        //if(!viewValue) return;
        ctrl.$parsers.unshift(function(value) {
            if(!value) return;
            return value.split(/\s*[,\n]\s*/);
        });

        //ctrl.$formatters.pust(function(value) {
        //    return value.join('\n');
        //});
    }

    return {
        restrict: 'A',
        link: linkFn,
        require: 'ngModel'
    }
});