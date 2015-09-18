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
        var xLabels = scope.xLabels;

        var xPadding = 20;
        var yPadding = 90;
        //var xScale = d3.scale.linear()
        //    .domain([0, d3.max(data, function(d) { return d;})])
        //    .range([padding, w - padding*2]);
        var xScale = d3.scale.ordinal()
            .domain(xLabels)
            .rangeBands([xPadding, w]);
        var yScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d;})])
            .range([h - yPadding, yPadding]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(4);

        var svg = d3.select(el)
            .append('svg')
            .attr('width', w)
            .attr('height', h);

        //svg.selectAll('line.x')
        //    .data();
        var yGrid = svg.selectAll('line.y')
            .data(yScale.ticks(4))
            .enter().append('line')
            .attr('class', 'grid')
            .attr('x1', xPadding)
            .attr('x2', w)
            .attr('y1', yScale)
            .attr('y2', yScale)
            .style('stroke', '#ccc');

        var rects = svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('fill', function(d) {
                return "rgb(0, 0, " + (d * 10) + ")";
            });
        //var texts = svg.selectAll('text')
        //    .data(data)
        //    .enter()
        //    .append('text')
        //    .text(function(d){
        //        return d;
        //    })
        //    .attr("font-family", "sans-serif")
        //    .attr("font-size", "11px")
        //    .attr("fill", "white")
        //    .attr("text-anchor", "middle");

        var drawnAxis = svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,'+(h-yPadding)+')')
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '-.45em')
            .attr('transform', 'rotate(-90)');
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate('+xPadding+',0)')
            .call(yAxis);

        scope.$watch(function () {
            return el.clientWidth * el.clientHeight;
        }, function() {
            w = el.clientWidth;
            h = el.clientHeight;

            svg.attr('width', w)
                .attr('height', h);

            rects.attr('x', function(d, i) {
                return i * ((w-xPadding)/data.length) + xPadding;
            })
                .attr('y', function(d) {
                    //return h - d*15;
                    return yScale(d);
                })
                .attr('width', (w-xPadding)/data.length - barPadding)
                .attr('height', function(d) {
                    //return (d)*40;
                    return (h-yPadding)-yScale(d);
                });

            //texts.attr('x', function(d, i) {
            //    return i * ((w-padding)/data.length) + (w-padding)/(2*data.length) - barPadding + padding;
            //})
            //    .attr('y', function(d, i) {
            //        //return h - (d*15) + 15;
            //        return yScale(d) + 15;
            //    });

            xScale.rangeBands([xPadding, w]);
            yScale.range([h - yPadding, yPadding]);
            yGrid.attr('x2', w);
            //drawnAxis.attr('transform', 'translate(0,'+(h-yPadding)+')');
        });
    }


    return {
        restrict: 'AE',
        link: function(scope, element) {barChartSVG(scope, element);},
        scope: {chartData: '=', xLabels: '='}
    }
});
