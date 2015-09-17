/**
 * Created by daniel.jimenez on 17/09/2015.
 */

'use strict';

var scatterChartsModule = angular.module('scatterCharts', []);

scatterChartsModule.directive('scatterChart', function() {

    function scatterChartSVG(scope, element) {
        var el = element[0];
        var w = el.clientWidth,
            h = el.clientHeight;
        var data = scope.chartData;
        var padding = 30;

        var xScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d[0];})])
            .range([padding, w - padding*2]);
        var yScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d[1];})])
            .range([h - padding, padding]);
        var rScale = d3.scale.linear()
            .domain([0, d3.max(data, function (d) { return d[1]; })])
            .range([2, 5]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(5);
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(5);

        var svg = d3.select(el)
            .append('svg')
            .attr('width', w)
            .attr('height', h);

        var dots = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function(d) {
                return xScale(d[0]);
            })
            .attr('cy', function(d) {
                return yScale(d[1]);
            })
            .attr('r', function(d) {
                return rScale(d[1]);
            });

        var texts = svg.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .text(function(d){
                return d[0] + ', ' + d[1];
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "teal")
            .attr("text-anchor", "")
            .attr('x', function(d) {
                return xScale(d[0]);
            })
            .attr('y', function(d) {
                return yScale(d[1]);
            });

        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,'+(h-padding)+')')
            .call(xAxis);
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate('+padding+',0)')
            .call(yAxis);

        scope.$watch(function () {
            return el.clientWidth * el.clientHeight;
        }, function() {
            w = el.clientWidth;
            h = el.clientHeight;

            svg.attr('width', w)
                .attr('height', h);
        });
    }

    return {
        restrict: 'E',
        link: scatterChartSVG,
        scope: {chartData: '='}
    };
});