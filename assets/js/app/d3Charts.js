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

    $scope.xLabels = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
        'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte'];

    var etiquetas = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

    var xaxix = {};
    var bars = [];
    for(var i=0;i<8;i++) {
        bars.push({value: $scope.chartData[i], label: $scope.xLabels[i]});
        if(!xaxix.labels) xaxix.labels = [];
        xaxix.labels.push(etiquetas[i]);
    }
    xaxix.height = 40;
    $scope.chartVals = bars.map(function(b){return b.value});
    $scope.chartXLabels = bars.map(function(b){return b.label});

    $scope.barXAxis = xaxix;
    $scope.barYAxis = {width: 14};
    $scope.barXLegend = null;
    $scope.barYLegend = null;
    $scope.barTitleLabel = null;
    $scope.barBars = {
        padding: 8,
        data: $scope.chartVals
    }
});
