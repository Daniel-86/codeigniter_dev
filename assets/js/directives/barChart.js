'use strict';

var barChartModule = angular.module('barCharts', []);

barChartModule.directive('barChart', function() {

    function bbc(scope, element) {
        var el = element[0];
        var w = el.clientWidth,
            h = el.clientHeight;

        var data = [4, 8, 15, 16, 23, 42];
        var width = 420,
            barHeight = 20;

        var x = d3.scale.linear()
            .domain([0, d3.max(data)])
            .range([0, width]);

        var chart = d3.select(el)
            .attr("width", width)
            .attr("height", barHeight * data.length);

        var bar = chart.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

        bar.append("rect")
            .attr("width", x)
            .attr("height", barHeight - 1);

        bar.append("text")
            .attr("x", function(d) { return x(d) - 3; })
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function(d) { return d; });
    }

    function barChartDivs(scope, element) {
        var data = scope.chartData;
        d3.select(element)
            .selectAll('div')
            .data(data)
            .enter()
            .append('div')
            .attr('class', 'bar')
            .style('height', function(d) {
                var barHeight = d * 5;
                return barHeight + 'px';
            });
    }

    function barChartSVG(scope, element) {
        var el = element[0];
        var w = el.clientWidth,
            h = el.clientHeight,
            barPadding = 1;
        var data = scope.chartData;
        //var data = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
        //    11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
        //var data = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13 ];

        var svg = d3.select(el)
            .append('svg')
            .attr('width', w)
            .attr('height', h);
        var rects = svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('fill', function(d) {
                return "rgb(0, 0, " + (d * 10) + ")";
            });
        var texts = svg.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .text(function(d){
                return d;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "white")
            .attr("text-anchor", "middle");

        scope.$watch(function () {
            return el.clientWidth * el.clientHeight;
        }, function() {
            w = el.clientWidth;
            h = el.clientHeight;

            svg.attr('width', w)
                .attr('height', h);

            rects.attr('x', function(d, i) {
                return i * (w/data.length);
            })
                .attr('y', function(d) {
                    return h - d*15;
                })
                .attr('width', w/data.length - barPadding)
                .attr('height', function(d) {
                    return (d/h)*40;
                });

            texts.attr('x', function(d, i) {
                return i * (w/data.length) + w/(2*data.length) - barPadding;
            })
                .attr('y', function(d, i) {
                    return h - (d*15) + 15;
                });
        });
    }


    return {
        restrict: 'AE',
        link: function(scope, element) {barChartSVG(scope, element);},
        scope: {chartData: '='}
    }
});
