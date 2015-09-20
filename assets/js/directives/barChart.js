'use strict';

var barChartModule = angular.module('barCharts', []);

/**
 * @ngdoc directive
 * @name barChart
 * @restrict AE
 * @description
 * A configurable and responsive bar chart.
 *
 * @param {Array} chart-data data source for the chart.
 * @param {Array=} data-x-labels Array containing labels for x axis.
 */
barChartModule.directive('barChart', function() {

    function barChartSVG(scope, element) {
        var el = element[0];

        var data = scope.chartData;
        var xLabels = scope.xLabels;

        var w = el.clientWidth,
            h = el.clientHeight,
            barPadding = 1;
        var yAxis = {
            width: 20
        };
        var xAxis = {
            height: 90
        };
        var padding = {
            top: 10,
            right: 5,
            bottom: 5,
            left: 5
        };
        var xLegend = {
            height: 20,
            text: 'X - LEGEND'
        };
        var yLegend = {
            width: 20,
            text: 'Y - LEGEND'
        };
        var titleLabel = {
            height: 50,
            text: 'GRÁFICO'
        };
        var chart = {};

        var svg = d3.select(el)
            .append('svg')
            .attr('width', w)
            .attr('height', h);

        var xScale = d3.scale.ordinal()
            .domain(xLabels);
        var yScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d;})]);

        var xFn = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
        var yFn = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(4);

        svg.append('g')
            .attr('class', 'ygrid')
            .selectAll('line.y')
            .data(yScale.ticks(4))
            .enter().append('line')
            .attr('class', 'grid')
            .attr('y1', yScale)
            .attr('y2', yScale)
            .style('stroke', '#ccc');

        var rects = svg.append('g')
            .attr('class', 'chart-body')
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('fill', function(d) {
                return "rgb(0, 0, " + (d * 10) + ")";
            });

        //svg.append('g')
        //    .attr('class', 'x axis')
        //    .attr('transform', 'translate(0,'+(h-xAxis.height)+')')
        //    .call(xFn)
        //    .selectAll('text')
        //    .style('text-anchor', 'end')
        //    .attr('dx', '-.8em')
        //    .attr('dy', '-.45em')
        //    .attr('transform', 'rotate(-85)');
        //svg.append('g')
        //    .attr('class', 'y axis')
        //    .attr('transform', 'translate('+yAxis.width+',0)')
        //    .call(yFn);

        svg.append('g')
            .attr('class', 'x-legend')
            .append('text')
            .text(xLegend.text)
            .style('font-size', (xLegend.height-4))
            .attr('class', 'claseTExto');
        svg.append('g')
            .attr('class', 'y-legend')
            .append('text')
            .text(yLegend.text)
            .attr('transform', 'rotate(-90)')
            .style('font-size', (yLegend.width-4))
            .attr('class', 'claseTExto');
        svg.append('g')
            .attr('class', 'chart-title')
            .append('text')
            .text(titleLabel.text)
            .style('font-size', (titleLabel.height-4))
            .attr('class', 'claseTExto');

        scope.$watch(function () {
            return el.clientWidth * el.clientHeight;
        }, function() {
            w = el.clientWidth;
            h = el.clientHeight;

            //titleLabel.width = w;
            titleLabel.width = w-yAxis.width;
            titleLabel.x = titleLabel.width/2;
            titleLabel.y = titleLabel.height;

            //xLegend.width = w-yAxis.width;
            xLegend.width = w;
            xLegend.x = xLegend.width/2 + yLegend.width+yAxis.width;
            xLegend.y = h-xLegend.height;

            yLegend.height = h-xLegend.height-xAxis.height-3*titleLabel.height/3;
            yLegend.x = yLegend.width;
            yLegend.y = (h-3*titleLabel.height/2-xLegend.height-xAxis.height)/2 + 3*titleLabel.height/2;

            yAxis.height= h-xAxis.height-xLegend.height;
            //yAxis.x = w-yAxis.width-yLegend.width;

            chart.width = w-yAxis.width-3*yLegend.width/2;
            chart.height= h-xLegend.height-xAxis.height-3*titleLabel.height/2;
            chart.x = w-chart.width;

            yAxis.x = chart.x;
            chart.y = 3*titleLabel.height/2;
            xAxis.y = chart.y+chart.height;

            xScale.rangeBands([chart.x, chart.x+chart.width]);
            yScale.range([chart.y+chart.height, chart.y]);

            svg.attr('width', w)
                .attr('height', h);

            rects.attr('x', function(d, i) {
                return i * (chart.width/data.length) + chart.x;
            })
                .attr('y', function(d) {
                    //return h - d*15;
                    return yScale(d);
                })
                .attr('width', chart.width/data.length - barPadding)
                .attr('height', function(d) {
                    //return (d)*40;
                    return chart.y+chart.height-yScale(d);
                });

            svg.select('.ygrid')
                .selectAll('line')
                .attr('x1', chart.x)
                .attr('x2', w)
                .attr('y1', yScale)
                .attr('y2', yScale);

            svg.select('.x.axis').remove();
            xFn = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');
            svg.select('.y.axis').remove();
            yFn = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .ticks(4);

            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,'+xAxis.y+')')
                .call(xFn)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '-.45em')
                .attr('transform', 'rotate(-85)');
            svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate('+yAxis.x+',0)')
                .call(yFn);

            //xLegend.width = w-yAxis.width;
            //xLegend.x = xLegend.width/2;
            //xLegend.y = h-xLegend.height;
            //chart = {
            //    width: w-yAxis.width,
            //    height: h-xLegend.height-xAxis.height
            //};
            svg.select('.y-legend').attr('transform', 'translate('+yLegend.x+','+yLegend.y+')');
            svg.select('.x-legend').attr('transform', 'translate('+xLegend.x+','+xLegend.y+')');
            svg.select('.chart-title').attr('transform', 'translate('+titleLabel.x+','+titleLabel.y+')');
            //svg.select('.chart-title').attr('transform', 'translate('+xLegend.x+','+titleLabel.y+')');
            //svg.select('.x-legend').attr('transform', 'translate('+titleLabel.x+','+xLegend.y+')');




            //svg.append('g')
            //    .attr('class', 'axis')
            //    .attr('transform', 'translate('+xPadding+',0)')
            //    .call(yAxis);
        });
    }


    return {
        restrict: 'AE',
        link: function(scope, element) {barChartSVG(scope, element);},
        scope: {chartData: '=', xLabels: '='}
    }
});
