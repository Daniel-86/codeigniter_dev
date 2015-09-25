/**
 * Created by daniel.jimenez on 24/09/2015.
 */

'use strict';

var rgbcolorsModule = angular.module('rgbcolors', []);

rgbcolorsModule.directive('rgbColors', function() {

    var rgbPattern = /rgb\((.*?)\)/g;
    var match;
    var matchedValues = [];

    function linkFn(scope, element, attrs, ctrl) {
        ctrl.$formatters.unshift(function (value) {
            matchedValues = [];
            value = value.toString();
            while(match = rgbPattern.exec(value)) {
                var color = match[1].split(',');
                color[0] = parseInt(color[0]).toString(16);
                color[0] = "00".substr(color[0].length)+color[0];
                color[1] = parseInt(color[1]).toString(16);
                color[1] = "00".substr(color[1].length)+color[1];
                color[2] = parseInt(color[2]).toString(16);
                color[2] = "00".substr(color[2].length)+color[2];
                matchedValues.push('#'+color[0]+color[1]+color[2]);
            }
            return matchedValues.join('\n');

            //value.replace(/[rgb()]/, '');
            //var rgbAsArray = value.split(',');
            //return '#'+rgbAsArray[0].toString(16)+rgbAsArray[1].toString(16)+rgbAsArray[2].toString(16);
        });
    }

    return {
        restrict: 'A',
        link: linkFn,
        require: 'ngModel'
    }
});