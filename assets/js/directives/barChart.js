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

        scope.currentSel = {};

        var data = scope.chartData;

        var w = el.clientWidth,
            h = el.clientHeight;
        var yAxis = {
            width: 20
        };
        var xAxis = {
            height: 90,
            labels: scope.xLabels
        };
        var padding = {
            top: 10,
            right: 5,
            bottom: 5,
            left: 25
        };
        var xLegend = {
            height: 20,
            text: 'X - LEGEND',
            padding: {
                top: 4
            }
        };
        var yLegend = {
            width: 20,
            text: 'Y - LEGEND',
            padding: {
                left: 5
            }
        };
        var titleLabel = {
            height: 50,
            text: 'GRÁFICO',
            padding: {
                bottom: 6
            }
        };
        var chart = {};
        var bar = {padding: 5};



        titleLabel.width = w;
        titleLabel.x = titleLabel.width/2;
        titleLabel.y = padding.top;

        yLegend.x = padding.right;
        xLegend.y = h - xLegend.height - padding.bottom;
        yAxis.y = titleLabel.y+titleLabel.height;
        chart.y = yAxis.y;
        chart.x = yLegend.x+yLegend.width + yAxis.width;
        chart.height = xLegend.y - xAxis.height - chart.y;
        chart.width = w - (yLegend.x+yLegend.width) - yAxis.width - padding.left;
        yLegend.y = chart.y + chart.height/2;
        yLegend.height = chart.height;
        yAxis.x = yLegend.x+yLegend.width;
        yAxis.height = chart.height;
        xLegend.x = chart.x + chart.width/2;
        xLegend.width = chart.width;
        xAxis.x = chart.x;
        xAxis.y = chart.y + chart.height;
        xAxis.width = chart.width;

        bar.width = (chart.width-(data.length-1)*bar.padding)/data.length;


        var svg = d3.select(el)
            .append('svg');
        var chartGraph = svg.append('g')
            .attr('class', 'graph');
        svg.attr('width', w)
            .attr('height', h);

        chartGraph.append('g')
            .attr('class', 'chart-title')
            .append('text')
            .text(titleLabel.text)
            .style('font-size', (titleLabel.height-titleLabel.padding.bottom))
            .attr('class', 'claseTExto');
        chartGraph.select('.chart-title').attr('transform', 'translate('+titleLabel.x+','+(titleLabel.y+titleLabel.height-titleLabel.padding.bottom)+')');

        var xScale = d3.scale.ordinal()
            .domain(xAxis.labels);
        var yScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d;})]);
        xScale.rangeRoundBands([0, chart.width], bar.padding/bar.width, 0);
        yScale.range([chart.height, 0]);

        var xFn = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
        var yFn = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(4);

        chartGraph.append('g')
            .attr('class', 'x-legend')
            .append('text')
            .text(xLegend.text)
            .style('font-size', (xLegend.height-xLegend.padding.top))
            .attr('class', 'claseTExto');
        chartGraph.select('.x-legend').attr('transform', 'translate('+xLegend.x+','+(xLegend.y-xLegend.padding.top)+')');

        chartGraph.append('g')
            .attr('class', 'x axis')
            .call(xFn)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '-.45em')
            .attr('transform', 'rotate(-85)');
        chartGraph.select('.x.axis')
            .attr('transform', 'translate('+xAxis.x+','+xAxis.y+')');

        chartGraph.append('g')
            .attr('class', 'y-legend')
            .append('text')
            .text(yLegend.text)
            .attr('transform', 'rotate(-90)')
            .style('font-size', (yLegend.width-yLegend.padding.left))
            .attr('class', 'claseTExto');
        chartGraph.select('.y-legend')
            .attr('transform', 'translate('+(yLegend.x+yLegend.width-yLegend.padding.left)+','+yLegend.y+')');

        chartGraph.append('g')
            .attr('class', 'y axis')
            .call(yFn);
        chartGraph.select('.y.axis')
            .attr('transform', 'translate('+(yAxis.x+yAxis.width)+','+yAxis.y+')');

        chartGraph.append('g')
            .attr('class', 'ygrid')
            .selectAll('line.y')
            .data(yScale.ticks(4))
            .enter().append('line')
            .attr('class', 'grid')
            .attr('y1', yScale)
            .attr('y2', yScale)
            .style('stroke', '#ccc');
        chartGraph.select('.ygrid')
            .selectAll('line')
            .attr('x1', 0)
            .attr('x2', chart.width)
            .attr('y1', yScale)
            .attr('y2', yScale);
        chartGraph.select('.ygrid')
            .attr('transform', 'translate('+chart.x+','+chart.y+')');

        chartGraph.append('g')
            .attr('class', 'chart-body');
        chartGraph.select('.chart-body')
            .attr('transform', 'translate('+(chart.x)+','+chart.y+')');
        var rects = chartGraph
            .select('.chart-body')
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('height', 0)
            .attr('fill', function(d) {
                return "rgb(0, 0, " + (d * 10) + ")";
            });
        rects.attr('width', xScale.rangeBand())
            .attr('x', function(d, i) {
                return xScale(xAxis.labels[i]);
            })
            .transition()
            .duration(500)
            .attr('y', function(d) {return yScale(d);})
            .attr('height', function(d) {return chart.height-yScale(d);});


        //var shadowFilter = chartGraph.select('.chart-body').append('defs')
        //    .append('filter')
        //    .attr('id', 'shadow')
        //    .attr('x', 0)
        //    .attr('y', 0)
        //    .attr('width', '150%');
        //shadowFilter.append('feOffset')
        //    .attr('result', 'offOut')
        //    .attr('in', 'sourceAlpha');
        //shadowFilter.append('feGaussianBlur')
        //    .attr('result', 'blurOut')
        //    .attr('in', 'offOut')
        //    .attr('stdDeviation', 50);
        //shadowFilter.append('feBlend')
        //    .attr('in2', 'sourceGraphic')
        //    .attr('in', 'blurOut');
        //
        //
        //
        var tooltipWidth = 60,
            tooltipHeight = 30;
        var tooltipContainer = chartGraph.append('g')
            .attr('transform', 'translate('+(chart.x)+','+chart.y+')');
        var dataTooltip = tooltipContainer.append('g')
            .attr('class', 'data-tooltip');
        dataTooltip.append('rect')
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('width', tooltipWidth)
            .attr('height', tooltipHeight);
        //dataTooltip.append('text')
        //    .attr('y', 0);
        tooltipContainer.style('display', 'none');
        var dataTooltipText = tooltipContainer.append('g')
            .attr('class', 'data-tooltip-text');
        dataTooltipText.append('text')
            .attr('y', (tooltipHeight / 2));

        chartGraph.select('.chart-body')
            .append('rect')
            .attr('class', 'bar-selected')
            .style('display', 'none');

        scope.$watch(function () {
            return el.clientWidth * el.clientHeight;
        }, function() {
            w = el.clientWidth;
            h = el.clientHeight;

            titleLabel.width = w;
            titleLabel.x = titleLabel.width/2;
            titleLabel.y = padding.top;

            yLegend.x = padding.right;
            xLegend.y = h - xLegend.height - padding.bottom;
            yAxis.y = titleLabel.y+titleLabel.height;
            chart.y = yAxis.y;
            chart.x = yLegend.x+yLegend.width + yAxis.width;
            chart.height = xLegend.y - xAxis.height - chart.y;
            chart.width = w - (yLegend.x+yLegend.width) - yAxis.width - padding.left;
            yLegend.y = chart.y + chart.height/2;
            yLegend.height = chart.height;
            yAxis.x = yLegend.x+yLegend.width;
            yAxis.height = chart.height;
            xLegend.x = chart.x + chart.width/2;
            xLegend.width = chart.width;
            xAxis.x = chart.x;
            xAxis.y = chart.y + chart.height;
            xAxis.width = chart.width;

            bar.width = (chart.width-(data.length-1)*bar.padding)/data.length;

            svg.attr('width', w)
                .attr('height', h);

            chartGraph.select('.chart-title').attr('transform', 'translate('+titleLabel.x+','+(titleLabel.y+titleLabel.height-titleLabel.padding.bottom)+')');

            xScale.rangeRoundBands([0, chart.width], bar.padding/bar.width, 0);
            yScale.range([chart.height, 0]);

            chartGraph.select('.x-legend').attr('transform', 'translate('+xLegend.x+','+(xLegend.y-xLegend.padding.top)+')');
            chartGraph.select('.x.axis')
                .attr('transform', 'translate('+xAxis.x+','+xAxis.y+')')
                .call(xFn)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '-.45em');

            chartGraph.select('.y-legend')
                .attr('transform', 'translate('+(yLegend.x+yLegend.width-yLegend.padding.left)+','+yLegend.y+')');
            chartGraph.select('.y.axis')
                .attr('transform', 'translate('+(yAxis.x+yAxis.width)+','+yAxis.y+')');

            chartGraph.select('.ygrid')
                .selectAll('line')
                .attr('x1', 0)
                .attr('x2', chart.width)
                .attr('y1', yScale)
                .attr('y2', yScale);
            chartGraph.select('.ygrid')
                .attr('transform', 'translate('+chart.x+','+chart.y+')');

            chartGraph.select('.chart-body')
                .attr('transform', 'translate('+(chart.x)+','+chart.y+')');
            rects.attr('width', xScale.rangeBand())
                .attr('x', function(d, i) {
                    return xScale(xAxis.labels[i]);
                })
                .transition()
                .duration(500)
                .attr('y', function(d) {return yScale(d);})
                .attr('height', function(d) {return chart.height-yScale(d);});
            //if(scope.currentSel.x) {
            //    svg.select('.bar-selected')
            //        .attr('x', scope.currentSel.x - (xScale.rangeBand()) * .3 / 2)
            //        .attr('y', scope.currentSel.y)
            //        .transition()
            //        .duration(500)
            //        .attr('width', scope.currentSel.width * 1.3)
            //        .attr('height', scope.currentSel.height);
            //}
            //svg.select('.bar-selected')
            //    .style('display', 'none');
            //tooltipContainer.style('display', 'none');
            if(scope.currentSel.nodo){
                scope.currentSel.nodo.on('mouseleave').apply(this);
            }
            //scope.currentSel = {};

            rects.on('mouseenter', function(d, i) {
                console.log('mouse enter');
                dataTooltip.attr('transform', 'translate('+(xScale(xAxis.labels[i])+xScale.rangeBand()/2-tooltipWidth/2)+','+(yScale(d)-tooltipHeight-2)+')');
                dataTooltipText.attr('transform', 'translate('+(xScale(xAxis.labels[i])+xScale.rangeBand()/2)+','+(yScale(d)-tooltipHeight-2)+')');




                var x = xScale(xAxis.labels[i]),
                    y = d3.select(this).attr('y'),
                    width = d3.select(this).attr('width');
                tooltipContainer.style('display', 'block');
                dataTooltipText.select('text')
                    .text(d);

                scope.currentSel.nodo = d3.select(this);
                scope.currentSel.width = d3.select(this).attr('width');
                scope.currentSel.x = d3.select(this).attr('x');
                scope.currentSel.y = d3.select(this).attr('y');
                scope.currentSel.height = d3.select(this).attr('height');
                scope.currentSel.fill = d3.select(this).attr('fill');
                chartGraph.select('.bar-selected')
                    .style('display', '')
                    .attr('x', scope.currentSel.x-(xScale.rangeBand())*.3/2)
                    .attr('y', scope.currentSel.y)
                    .attr('width', scope.currentSel.width*1.3)
                    .attr('height', scope.currentSel.height)
                    .attr('fill', scope.currentSel.fill);
            });
            rects.on('mouseleave', function() {
                console.log('mouse leave');
                tooltipContainer.style('display', 'none');
                svg.select('.bar-selected')
                    .style('display', 'none');
                scope.currentSel = {};
            });

        });
    }


    return {
        restrict: 'AE',
        link: function(scope, element) {barChartSVG(scope, element);},
        scope: {chartData: '=', xLabels: '='}
    }
});
