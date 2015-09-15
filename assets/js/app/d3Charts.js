'use strict';

var d3ChartsModule = angular.module('d3Charts', ['angularCharts']);

d3ChartsModule.controller('D3ChartsCtrl', function($scope) {
    $scope.d3Config = {
        title: 'Algún título',
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
            display: true,
            position: 'left'
        },
        innerRadius: 0,
        lineLegend: 'lineEnd'
    };

    $scope.d3Data = {
        'series': [
            'Ventas',
            'Ingresos',
            'Gastos'
        ],
        'data': {
            'x': 'Computadoras',
            'y': [
                54,
                0,
                876
            ],
            'tooltip': 'Esto es un tooltip'
        }
    };
});
