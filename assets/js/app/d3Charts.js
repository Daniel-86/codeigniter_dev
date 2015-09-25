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

    $scope.FillTypes = BAR_FILL_TYPE;

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
    var nBars = 8;
    for(var i=0;i<nBars;i++) {
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
        data: $scope.chartVals,
        fill: {
            type: BAR_FILL_TYPE.RANDOM.code,
            refreshTrigger: true
        }
    };
    //$scope.shown = {};

    function randomArrayFactory(size, upper, lower, withDecimals) {
        if(!size) return [];
        if(!upper) upper = 10;
        if(!lower) lower = 0;
        var array = Array.apply(null, Array(size)).map(function(_, i) {
            return Math.random() * (upper-lower) + lower;
        });
        if(!withDecimals) {
            return array.map(function(v) {
                return v.toFixed(0);
            });
        }
        return array;
    }

    function subDataFactory() {
        var lengths = randomArrayFactory(nBars, 10, 3);
        var data = [];
        lengths.map(function(l) {
            data.push(randomArrayFactory(parseInt(l), 30, 2));
        });
        return data;
    }

    function stringGen(len) {
        if(!len) len = 4;
        var text = " ";
        var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < len; i++ )
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        return text;
    }

    function subLabelsFactory() {
        var labelsArray = [];
        angular.forEach(subData, function(s) {
            var tempArr = [];
            angular.forEach(s, function(i) {
                tempArr.push(stringGen());
            });
            labelsArray.push(tempArr);
        });
        return labelsArray;
    }

    function testSubDataFactory() {
        var lengths = Array.apply(null, Array(nBars)).map(function() {return 5;});
        var data = [];
        lengths.map(function(l) {
            data.push([20, 4, 16, 23, 17, 6]);
        });
        return data;
    }

    var subData = testSubDataFactory();
    var subLabels = subLabelsFactory();

    $scope.subs = {data: subData, labels: subLabels};

    var debug = 'yeah';
});
