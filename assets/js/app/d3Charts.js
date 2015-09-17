'use strict';

var d3ChartsModule = angular.module('d3Charts', []);

d3ChartsModule.controller('D3ChartsCtrl', function($scope, $window) {
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

    $scope.chartData = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
        11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

    $scope.charts = d3.range(10).map(function() {
        return d3.range(10).map(Math.random);
    });

    angular.element($window).on('resize', function() {
        $scope.$apply();
    });

    $scope.scatterChartData = [
        [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
        [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
    ];
});
