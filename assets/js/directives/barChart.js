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
 * @param {Array} bars data source for the chart.
 * @param {Array=} data-x-labels Array containing labels for x axis.
 * @param {Object} data-x-axis Array containing x axis configurations: height, labels.
 * @param {Object} data-y-axis Array containing y axis configurations: width.
 * @param {Object} data-y-legend Array containing y legend configurations: width, text and padding.
 * @param {Object} data-x-legend Array containing x legend configurations: height, text and padding.
 * @param {Object} data-title-label Array containing chart title configurations: height, text and padding.
 * @param {Object} shown Array indicating which components are gonna be rendered, all of them can be hide except the
 * @param {Object} subs Array containing expanded info for each bar (or something).
 * @param {boolean} go-back is displaying innner data?.
 *
 */
barChartModule.directive('barChart', function() {

    function barChartSVG(scope, element) {
        if(!scope.bars) throw Error(new CustomException('You must specify data for the chart.', 'DIRECTIVE' +
            ' (bar-chart)'));

        //var colorScale = d3.scale.category20();

        var paddingDefault = {
            top: 4,
            bottom: 4,
            left: 4,
            right: 4
        };

        var backups = {};
        var rootContext = {};

        if(!scope.xAxis) scope.xAxis = {};
        if(!scope.yAxis) scope.yAxis = {};
        if(!scope.yLegend) scope.yLegend = {width: 20, text: 'Y - LEGEND', padding: paddingDefault};
        if(!scope.xLegend) scope.xLegend = {height: 20, text: 'X - LEGEND', padding: paddingDefault};
        if(!scope.titleLabel) scope.titleLabel = {height: 50, text: 'GRÁFICO', padding: paddingDefault};
        if(!scope.bars.padding) scope.bars.padding = 5;
        if(!scope.bars.fill || (scope.bars.fill && !scope.bars.fill.colors)) {
            if(!scope.bars.fill) scope.bars.fill = {};
            scope.bars.fill.type = BAR_FILL_TYPE.RANDOM.code;
            scope.bars.fill.colors = randomColorArray(scope.bars.data.length);
            scope.bars.fill.refreshTrigger = true;
            scope.bars.fill.baseColor = '#0000ff';
        }
        if(!scope.shown) {scope.shown = {};}
        if(!scope.shown.xAxis) {scope.shown.xAxis = true;}
        if(!scope.shown.yAxis) {scope.shown.yAxis = true;}
        if(!scope.shown.xLegend) {scope.shown.xLegend = true;}
        if(!scope.shown.yLegend) {scope.shown.yLegend = true;}
        if(!scope.shown.titleLabel) {scope.shown.titleLabel = true;}
        if(!scope.shown.grid) {scope.shown.grid = true;}

        var el = element[0];

        scope.currentSel = {};

        var w = el.clientWidth,
            h = el.clientHeight;
        var yAxis = {
            width: scope.yAxis.width || 20
        };
        scope.yAxis = yAxis;
        var xAxis = {
            height: scope.xAxis.height || 90,
            labels: scope.xAxis.labels || scope.xLabels
        };
        scope.xAxis = xAxis;
        var padding = {
            top: 10,
            right: 5,
            bottom: 5,
            left: 25
        };
        var xLegend = {
            height: scope.xLegend.height || 20,
            text: scope.xLegend.text || 'X - LEGEND',
            padding: scope.xLegend.padding || {
                top: 4
            }
        };
        scope.xLegend = xLegend;
        var yLegend = {
            width: scope.yLegend.width || 20,
            text: scope.yLegend.text || 'Y - LEGEND',
            padding: scope.yLegend.padding || {
                left: 5
            }
        };
        scope.yLegend = yLegend;
        var titleLabel = {
            height: scope.titleLabel.height || 50,
            text: scope.titleLabel.text || 'GRÁFICO',
            padding: scope.titleLabel.padding || {
                bottom: 6
            }
        };
        scope.titleLabel = titleLabel;
        var chart = {};
        var bars = {
            padding: scope.bars.padding || 5,
            data: scope.bars.data,
            fill: {
                type: scope.bars.fill.type,
                colors: scope.bars.fill.colors,
                refreshTrigger: scope.bars.fill.refreshTrigger,
                baseColor: scope.bars.fill.baseColor
            }
        };



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

        bars.width = (chart.width-(bars.data.length-1)*bars.padding)/bars.data.length;


        var svg = d3.select(el)
            .append('svg');
        var chartGraph = svg.append('g')
            .attr('class', 'graph');
        svg.attr('width', w)
            .attr('height', h);

        chartGraph.append('g')
            .attr('class', 'chart-title titleLabel')
            .append('text')
            .text(titleLabel.text)
            .style('font-size', (titleLabel.height-titleLabel.padding.bottom))
            .attr('class', 'claseTExto');
        chartGraph.select('.chart-title').attr('transform', 'translate('+titleLabel.x+','+(titleLabel.y+titleLabel.height-titleLabel.padding.bottom)+')');

        var xScale = d3.scale.ordinal()
            .domain(xAxis.labels);
        var yScale = d3.scale.linear()
            .domain([0, d3.max(bars.data, function(d) { return d;})]);
        xScale.rangeRoundBands([0, chart.width], bars.padding/bars.width, 0);
        yScale.range([chart.height, 0]);

        var xFn = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
        var yFn = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(4);

        chartGraph.append('g')
            .attr('class', 'x-legend xLegend')
            .append('text')
            .text(xLegend.text)
            .style('font-size', (xLegend.height-xLegend.padding.top))
            .attr('class', 'claseTExto');
        chartGraph.select('.x-legend').attr('transform', 'translate('+xLegend.x+','+(xLegend.y-xLegend.padding.top)+')');

        chartGraph.append('g')
            .attr('class', 'x axis xAxis')
            .call(xFn)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '-.45em')
            .attr('transform', 'rotate(-85)');
        chartGraph.select('.x.axis')
            .attr('transform', 'translate('+xAxis.x+','+xAxis.y+')');

        chartGraph.append('g')
            .attr('class', 'y-legend yLegend')
            .append('text')
            .text(yLegend.text)
            .attr('transform', 'rotate(-90)')
            .style('font-size', (yLegend.width-yLegend.padding.left))
            .attr('class', 'claseTExto');
        chartGraph.select('.y-legend')
            .attr('transform', 'translate('+(yLegend.x+yLegend.width-yLegend.padding.left)+','+yLegend.y+')');

        chartGraph.append('g')
            .attr('class', 'y axis yAxis')
            .call(yFn);
        chartGraph.select('.y.axis')
            .attr('transform', 'translate('+(yAxis.x+yAxis.width)+','+yAxis.y+')');

        chartGraph.append('g')
            .attr('class', 'ygrid grid')
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
        var rectsJoins = chartGraph
            .select('.chart-body')
            .selectAll('rect')
            .data(bars.data);
        var rects = rectsJoins.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('height', 0)
            .attr('fill', function(d, i) {
                return bars.fill.colors[i];
            })
            .on('dblclick', function(d, i) {
                console.log('doble click en :'+i);
                rootContext.xAxis = angular.copy(xAxis);
                rootContext.bars = angular.copy(bars);
                xAxis.labels = scope.subs.labels[i];
                bars.data = scope.subs.data[i];
                //if(!bars.fill) bars.fill = {};
                bars.fill.colors = scope.subs.colors? scope.subs.colors[i]: null;
                redrawGraphWithNewData();
                if(!bars.fill.colors) {
                    colorFactory();
                    if(!scope.subs.colors) scope.subs.colors = [];
                    scope.subs.colors[i] = bars.fill.colors;
                }
                //bars.fill.colors = scope.bars.fill.colors;
                updateBarColors();
                scope.xAxis = xAxis;
                scope.bars = bars;
                scope.goBack = true;
                updateExpandEvents();
                scope.$apply();
                var asf = 1;
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
        },
            function() {
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

            bars.width = (chart.width-(bars.data.length-1)*bars.padding)/bars.data.length;

            svg.attr('width', w)
                .attr('height', h);

            chartGraph.select('.chart-title').attr('transform', 'translate('+titleLabel.x+','+(titleLabel.y+titleLabel.height-titleLabel.padding.bottom)+')');

            xScale.rangeRoundBands([0, chart.width], bars.padding/bars.width, 0);
            yScale.range([chart.height, 0]);

            updateXLegendWidth();
            updateXAxisWidth();

            updateYLegendHeight();
            updateYAxisHeight();

                updateYGridWidth();
                updateYGridHeight();
                updateYGridPosition();


                updateChartPosition();
                updateChartWidth();
                updateChartHeight();

                manageTooltipVisibility();

                setBarMouseEnter(svg.select('.chart-body').selectAll('rect'));
                setBarMouseLeave(svg.select('.chart-body').selectAll('rect'));
        });

        scope.$watch('goBack', function(newVal) {
            if(!newVal && rootContext && rootContext.bars && rootContext.xAxis) {
                if(rootContext.xAxis) xAxis = angular.copy(rootContext.xAxis);
                if(rootContext.bars) bars = angular.copy(rootContext.bars);
                delete rootContext.xAxis;
                delete rootContext.bars;
                redrawGraphWithNewData();
                //colorFactory();
                //bars.fill.colors = scope.bars.fill.colors;
                updateBarColors();
                scope.xAxis = xAxis;
                scope.bars = bars;
                updateExpandEvents();
                //scope.$apply();
            }
        });

        scope.$watch('xAxis.height', function(newVal) {
            console.log('xAxis height modified');
            xAxis.height = newVal;
            updatexAxisHeight();
        });

        scope.$watch('yAxis.width', function(newVal) {
            yAxis.width = newVal;
            updateYAxisWidth();
        });

        scope.$watch('yLegend.text', function(newVal) {
            yLegend.text = newVal;

            chartGraph.select('.y-legend')
                .select('text')
                .text(yLegend.text);
        });

        scope.$watch('xLegend.text', function(newVal) {
            xLegend.text = newVal;

            chartGraph.select('.x-legend')
                .select('text')
                .text(xLegend.text);
        });

        scope.$watch('titleLabel.text', function(newVal) {
            titleLabel.text = newVal;

            chartGraph.select('.chart-title')
                .select('text')
                .text(titleLabel.text);
        });

        scope.$watch('yLegend.width', function(newVal) {
            console.log('yLegend.width modified');
            yLegend.width = newVal;
            yAxis.x = yLegend.x+yLegend.width;
            svg.select('.y-legend')
                .select('text')
                .style('font-size', (yLegend.width-yLegend.padding.left));
            chartGraph.select('.x-legend').attr('transform', 'translate('+xLegend.x+','+(xLegend.y-xLegend.padding.top)+')');
            chartGraph.select('.y-legend')
                .attr('transform', 'translate('+(yLegend.x+yLegend.width-yLegend.padding.left)+','+yLegend.y+')');
            updateYAxisWidth();
        });

        scope.$watch('xLegend.height', function(newVal) {
            xLegend.height = newVal;
            xLegend.y = h - xLegend.height - padding.bottom;
            svg.select('.x-legend')
                .select('text')
                .style('font-size', (xLegend.height-xLegend.padding.top));
            //chartGraph.select('.x-legend').attr('transform', 'translate('+xLegend.x+','+(xLegend.y-xLegend.padding.top)+')');
            updatexAxisHeight();
        });

        scope.$watch('titleLabel.height', function(newVal) {
            titleLabel.height = newVal;
            xLegend.y = h - xLegend.height - padding.bottom;
            svg.select('.chart-title')
                .select('text')
                .style('font-size', (titleLabel.height-titleLabel.padding.bottom));
            chartGraph.select('.y-legend')
                .attr('transform', 'translate('+(yLegend.x+yLegend.width-yLegend.padding.left)+','+yLegend.y+')');
            redrawGraph();
            updatexAxisHeight();
        });

        scope.$watchCollection('xAxis.labels', function (newVal) {
            if(!angular.isArray(newVal)) return;
            svg.select('.x.axis')
                .selectAll('text')
                .text(function(d, i) {
                    return newVal[i]? newVal[i]: 'NOHAYNADA';
                });
        });

        scope.$watch('bars.padding', function(newVal) {
            bars.padding = newVal;
            chart.width = w - (yLegend.x+yLegend.width) - yAxis.width - padding.left;
            xScale.rangeRoundBands([0, chart.width], bars.padding/bars.width, 0);
            redrawChart();
            redrawXAxis();
        });

        scope.$watch('bars.fill.type', function(newVal) {
            colorFactory(newVal);
        });

        scope.$watch('bars.fill.refreshTrigger', function() {/*console.log('random color refreshment externally' +
            ' triggered');*/
            refreshRandomColors();
        });

        scope.$watch('bars.fill.colors', function() {/*console.log('watcher update bar colors');*/
            bars.fill.colors = scope.bars.fill.colors;
            updateBarColors();
        });

        scope.$watch('bars.fill.baseColor', function(newVal) {
            if(bars.fill.type !== BAR_FILL_TYPE.UNIFORM_SCALE.code) return;
            bars.fill.baseColor = newVal;
            refreshUniformScaledColors();
        });

        scope.$watchCollection('shown', function(newVal) {
            console.log('hide some');
            var allComponents = ['xAxis', 'yAxis', 'xLegend', 'yLegend', 'titleLabel', 'grid'];
            angular.forEach(allComponents, function(c) {
                if(!newVal[c]) {
                    var targetObj = eval(c);
                    backups[c] = angular.copy(targetObj);
                    targetObj.height = 0;
                    targetObj.width = 0;
                    svg.select('.'+c)
                        .style('display', 'none');
                }
                if(newVal[c] && backups[c]) {
                    var restoreObj = angular.copy(backups[c]);
                    var targetObj2 = eval(c);
                    targetObj2.height = restoreObj.height;
                    targetObj2.width = restoreObj.width;
                    delete backups[c];
                    svg.select('.'+c)
                        .style('display', '');
                }
            });
        });


        function colorFactory(newVal) {
            //if(!bars.fill) bars.fill = {};
            bars.fill.type = newVal;
            if(bars.fill.type === BAR_FILL_TYPE.RANDOM.code) {
                refreshRandomColors();
                //updateBarColors();
            }
            else if(bars.fill.type === BAR_FILL_TYPE.UNIFORM_SCALE.code) {
                refreshUniformScaledColors();
            }
        }

        function updateBarColors() {/*console.log('update bar colors');*/
            svg.select('.chart-body').selectAll('rect').attr('fill', function(d, i) {
                return bars.fill.colors[i];
            });
        }

        function refreshRandomColors() {/*console.log('refresh random colors');*/
            bars.fill.colors = randomColorArray(bars.data.length);
            scope.bars.fill.colors = bars.fill.colors;
        }

        function randomColorArray(size) {
            var colorArray = [];
            //for(var i=0; i<size; i++) colorArray.push(colorScale(i));
            //for(var i=0; i<size; i++) colorArray.push("hsl("+Math.random()*360+",100%,50%)");
            for(var i=0; i<size; i++) colorArray.push("rgb("+(Math.random()*255).toFixed(0)+","+(Math.random()*255).toFixed(0)+","+(Math.random()*255).toFixed(0)+")");
            return colorArray;
        }

        function refreshUniformScaledColors() {
            bars.fill.colors = colorShader(bars.data.length);
            scope.bars.fill.colors = bars.fill.colors;
        }

        function colorShader(size) {
            var shades = [];
            var minD = Math.min.apply(null, bars.data);
            var maxD = Math.max.apply(null, bars.data);
            for(var i=0; i<size; i++) {
                var stringColor = bars.fill.baseColor.toString().replace('#', '');
                var r = parseInt('0x'+stringColor.slice(0,2));
                var g = parseInt('0x'+stringColor.slice(2,4));
                var b = parseInt('0x'+stringColor.slice(4,6));
                r = bars.data[i]*r/maxD;
                g = bars.data[i]*g/maxD;
                b = bars.data[i]*b/maxD;
                shades.push('rgb('+ r.toFixed(0)+','+g.toFixed(0)+','+b.toFixed(0)+')');
                //shades.push(d3.rgb(bars.fill.baseColor).darker());
            }
            return shades;
        }


        function updatexAxisHeight() {
            chart.height = xLegend.y - xAxis.height - chart.y;
            yLegend.y = chart.y + chart.height/2;
            yLegend.height = chart.height;
            yAxis.height = chart.height;
            xAxis.y = chart.y + chart.height;

            yScale.domain([0, Math.max.apply(null, bars.data)]).range([chart.height, 0]);

            chartGraph.select('.x.axis')
                .attr('transform', 'translate('+xAxis.x+','+xAxis.y+')')
                .call(xFn)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '-.45em');
            chartGraph.select('.y.axis')
                .call(yFn);
            chartGraph.select('.y-legend')
                .attr('transform', 'translate('+(yLegend.x+yLegend.width-yLegend.padding.left)+','+yLegend.y+')');

            chartGraph.select('.ygrid')
                .selectAll('line')
                .attr('x1', 0)
                .attr('x2', chart.width)
                .attr('y1', yScale)
                .attr('y2', yScale);

            rects.attr('width', xScale.rangeBand())
                .attr('x', function(d, i) {
                    return xScale(xAxis.labels[i]);
                })
                .transition()
                .duration(500)
                .attr('y', function(d) {return yScale(d);})
                .attr('height', function(d) {return chart.height-yScale(d);});
        }

        function updateXAxisWidth() {
            chartGraph.select('.x.axis')
                .attr('transform', 'translate('+xAxis.x+','+xAxis.y+')')
                .call(xFn)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '-.45em');
        }

        function updateXLegendWidth() {
            chartGraph.select('.x-legend').attr('transform', 'translate('+xLegend.x+','+(xLegend.y-xLegend.padding.top)+')');
        }

        function updateYLegendHeight() {
            chartGraph.select('.y-legend')
                .attr('transform', 'translate('+(yLegend.x+yLegend.width-yLegend.padding.left)+','+yLegend.y+')');
        }

        function updateYAxisHeight() {
            chartGraph.select('.y.axis')
                .attr('transform', 'translate('+(yAxis.x+yAxis.width)+','+yAxis.y+')');
        }

        function updateYAxisWidth() {
            chart.x = yLegend.x+yLegend.width + yAxis.width;
            chart.width = w - (yLegend.x+yLegend.width) - yAxis.width - padding.left;
            xLegend.x = chart.x + chart.width/2;
            xLegend.width = chart.width;
            xAxis.x = chart.x;
            xAxis.width = chart.width;

            xScale.rangeRoundBands([0, chart.width], bars.padding/bars.width, 0);

            chartGraph.select('.x-legend').attr('transform', 'translate('+xLegend.x+','+(xLegend.y-xLegend.padding.top)+')');
            chartGraph.select('.x.axis')
                .attr('transform', 'translate('+xAxis.x+','+xAxis.y+')')
                .call(xFn)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '-.45em');

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

            tooltipContainer.attr('transform', 'translate('+(chart.x)+','+chart.y+')');
            //dataTooltip.attr('transform', 'translate('+(xScale(xAxis.labels[i])+xScale.rangeBand()/2-tooltipWidth/2)+','+(yScale(d)-tooltipHeight-2)+')');
        }

        function updateYGridWidth() {
            chartGraph.select('.ygrid')
                .selectAll('line')
                .attr('x1', 0)
                .attr('x2', chart.width);
        }

        function updateYGridHeight() {
            chartGraph.select('.ygrid')
                .selectAll('line')
                .attr('y1', yScale)
                .attr('y2', yScale);
        }

        function updateYGridPosition() {
            chartGraph.select('.ygrid')
                .attr('transform', 'translate('+chart.x+','+chart.y+')');
        }

        function updateChartPosition() {
            svg.select('.chart-body')
                .attr('transform', 'translate('+(chart.x)+','+chart.y+')');
        }

        function updateChartWidth() {
            var width = xScale.rangeBand();
            svg.select('.chart-body')
                .selectAll('rect')
                .attr('width', xScale.rangeBand())
                .attr('x', function(d, i) {
                    return xScale(xAxis.labels[i]);
                });
        }

        function updateChartHeight() {
            svg.select('.chart-body')
                .selectAll('rect')
                .transition()
                .duration(500)
                .attr('y', function(d) {return yScale(d);})
                .attr('height', function(d) {return chart.height-yScale(d);});
        }

        function manageTooltipVisibility() {
            if(scope.currentSel.nodo){
                scope.currentSel.nodo.on('mouseleave').apply(this);
            }
        }

        function setBarMouseEnter(selection) {
            selection.on('mouseenter', function(d, i) {
                //console.log('mouse enter');
                updateTooltipPosition(d, i);
                setTooltipVisibility(true, d);

                scope.currentSel.nodo = d3.select(this);
                var barHoverData = extractBarDataFrom(d3.select(this));
                barHoverData.visibility = true;
                fullUpdateBarHover(chart.select('.bar-selected'), barHoverData);
            });
        }

        function setBarMouseLeave(selection) {
            setTooltipVisibility(false);
            setBarHoverVisibility(selection, {isVisible: false});
            scope.currentSel.nodo = null;
        }

        function extractBarDataFrom(owner) {
            return {
                width: owner.attr('width'),
                height: owner.attr('height'),
                x: owner.attr('x'),
                y: owner.attr('y'),
                fill: owner.attr('fill')
            };
        }

        function fullUpdateBarHover(selection, data) {
            setBarHoverPosition(selection, data);
            setBarHoverHeight(selection, data);
            setBarHoverWidth(selection, data);
            setBarHoverFill(selection, data);
            setBarHoverVisibility(selection, data);
        }

        function updateTooltipPosition(d, i) {
            dataTooltip.attr('transform', 'translate('+(xScale(xAxis.labels[i])+xScale.rangeBand()/2-tooltipWidth/2)+','+(yScale(d)-tooltipHeight-2)+')');
            dataTooltipText.attr('transform', 'translate('+(xScale(xAxis.labels[i])+xScale.rangeBand()/2)+','+(yScale(d)-tooltipHeight-2)+')');
        }

        function setTooltipVisibility(isVisible, d) {
            if(isVisible) {
                tooltipContainer.style('display', 'block');
                dataTooltipText.select('text')
                    .text(d);
            } else {
                tooltipContainer.style('display', 'none');
            }
        }

        function setTooltipText(selection, data) {
            selection.text(data.text);
        }

        function setBarHoverPosition(selection, data) {
            selection
                .attr('x', data.x)
                .attr('y', data.y);
        }

        function setBarHoverWidth(selection, data) {
            selection
                .attr('width', data.width);
        }

        function setBarHoverHeight(selection, data) {
            selection
                .attr('height', data.height);
        }

        function setBarHoverVisibility(selection, data) {
            selection
                .style('display', data.isVisible);
        }

        function setBarHoverFill(selection, data) {
            selection
                .attr('fill', data.fill);
        }


        function redrawGraph() {
            yLegend.x = padding.right;
            xLegend.y = h - xLegend.height - padding.bottom;
            yAxis.y = titleLabel.y + titleLabel.height;
            chart.y = yAxis.y;
            chart.x = yLegend.x + yLegend.width + yAxis.width;
            chart.height = xLegend.y - xAxis.height - chart.y;
            chart.width = w - (yLegend.x + yLegend.width) - yAxis.width - padding.left;
            yLegend.y = chart.y + chart.height / 2;
            yLegend.height = chart.height;
            yAxis.x = yLegend.x + yLegend.width;
            yAxis.height = chart.height;
            xLegend.x = chart.x + chart.width / 2;
            xLegend.width = chart.width;
            xAxis.x = chart.x;
            xAxis.y = chart.y + chart.height;
            xAxis.width = chart.width;

            bars.width = (chart.width - (bars.data.length - 1) * bars.padding) / bars.data.length;

            svg.attr('width', w)
                .attr('height', h);

            chartGraph.select('.chart-title').attr('transform', 'translate(' + titleLabel.x + ',' + (titleLabel.y + titleLabel.height - titleLabel.padding.bottom) + ')');

            xScale.domain(xAxis.labels).rangeRoundBands([0, chart.width], bars.padding / bars.width, 0);
            yScale.domain([0, Math.max.apply(null, bars.data)]).range([chart.height, 0]);

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
                //console.log('mouse enter');
                var newX = xScale(xAxis.labels[i]);
                if(!isNaN(newX)) dataTooltip.attr('transform', 'translate('+(xScale(xAxis.labels[i])+xScale.rangeBand()/2-tooltipWidth/2)+','+(yScale(d)-tooltipHeight-2)+')');
                if(!isNaN(newX)) dataTooltipText.attr('transform', 'translate('+(xScale(xAxis.labels[i])+xScale.rangeBand()/2)+','+(yScale(d)-tooltipHeight-2)+')');




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
                //console.log('mouse leave');
                tooltipContainer.style('display', 'none');
                svg.select('.bar-selected')
                    .style('display', 'none');
                scope.currentSel = {};
            });
        }

        function redrawChart() {
            rects.attr('width', xScale.rangeBand())
                .attr('x', function(d, i) {
                    return xScale(xAxis.labels[i]);
                })
                .transition()
                .duration(500)
                .attr('y', function(d) {return yScale(d);})
                .attr('height', function(d) {return chart.height-yScale(d);});
        }

        function redrawXAxis() {
            chartGraph.select('.x.axis')
                .attr('transform', 'translate('+xAxis.x+','+xAxis.y+')')
                .call(xFn)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '-.45em');
        }

        function updateExpandEvents() {
            if(scope.goBack) {
                rectsJoins.on('dblclick', null);
            }
            else {
                svg.select('.chart-body')
                    .selectAll('rect')
                    .on('dblclick', function(d, i) {
                        console.log('doble click en :'+i);
                        rootContext.xAxis = angular.copy(xAxis);
                        rootContext.bars = angular.copy(bars);
                        xAxis.labels = scope.subs.labels[i];
                        bars.data = scope.subs.data[i];
                        //if(!bars.fill) bars.fill = {};
                        bars.fill.colors = scope.subs.colors? scope.subs.colors[i]: null;
                        redrawGraphWithNewData();
                        if(!bars.fill.colors) {
                            colorFactory();
                            if(!scope.subs.colors) scope.subs.colors = [];
                            scope.subs.colors[i] = bars.fill.colors;
                        }
                        //bars.fill.colors = scope.bars.fill.colors;
                        updateBarColors();
                        scope.xAxis = xAxis;
                        scope.bars = bars;
                        scope.goBack = true;
                        updateExpandEvents();
                        scope.$apply();
                        var asf = 1;
                    });
            }
        }

        function redrawGraphWithNewData() {
            bars.width = (chart.width - (bars.data.length - 1) * bars.padding) / bars.data.length;

            xScale.domain(xAxis.labels);
            var maxY = Math.max.apply(null, bars.data);
            yScale.domain([0, Math.max.apply(null, bars.data)]);

            chartGraph.select('.x.axis')
                .call(xFn)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '-.45em')
                .attr('transform', 'rotate(-85)');;

            chartGraph.select('.y.axis').call(yFn);





            //chartGraph.select('.ygrid').remove();
            var auxGrid = chartGraph.select('.ygrid')
                .selectAll('line.y')
                .data(yScale.ticks(4));
            auxGrid.exit().remove();
            auxGrid.enter().append('line')
                .selectAll('line')
                .attr('x1', 0)
                .attr('x2', chart.width)
                .attr('y1', yScale)
                .attr('y2', yScale);
            //chartGraph.select('.ygrid')
            //    .selectAll('line')
            //    .attr('x1', 0)
            //    .attr('x2', chart.width)
            //    .attr('y1', yScale)
            //    .attr('y2', yScale);
            //chartGraph.select('.ygrid')
            //    .attr('transform', 'translate('+chart.x+','+chart.y+')');
            //chartGraph.select('.ygrid')
            //    .selectAll('line')
            //    .attr('x1', 0)
            //    .attr('x2', chart.width)
            //    .attr('y1', yScale)
            //    .attr('y2', yScale);




            rectsJoins = chartGraph
                .select('.chart-body')
                .selectAll('rect')
                .data(bars.data);
            rectsJoins.exit().remove();
            rects = rectsJoins
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('height', 0);

            //rects.remove();
            //rects = chartGraph
            //    .select('.chart-body')
            //    .selectAll('rect')
            //    .data(bars.data)
            //    .enter()
            //    .append('rect')
            //    .attr('class', 'bar')
            //    .attr('height', 0)
            //    .attr('fill', function(d, i) {
            //        return bars.fill.colors[i];
            //    });
            rects.attr('width', xScale.rangeBand())
                .attr('x', function(d, i) {
                    return xScale(xAxis.labels[i]);
                })
                .transition()
                .duration(500)
                .attr('y', function(d) {return yScale(d);})
                .attr('height', function(d) {return chart.height-yScale(d);});

            rectsJoins.attr('width', xScale.rangeBand())
                .attr('x', function(d, i) {
                    return xScale(xAxis.labels[i]);
                })
                .transition()
                .duration(500)
                .attr('y', function(d) {return yScale(d);})
                .attr('height', function(d) {return chart.height-yScale(d);});


            if(scope.currentSel.nodo){
                scope.currentSel.nodo.on('mouseleave').apply(this);
            }

            rects.on('mouseenter', function(d, i) {
                //console.log('mouse enter');
                var newX = xScale(xAxis.labels[i]);
                if(!isNaN(newX)) dataTooltip.attr('transform', 'translate('+(xScale(xAxis.labels[i])+xScale.rangeBand()/2-tooltipWidth/2)+','+(yScale(d)-tooltipHeight-2)+')');
                if(!isNaN(newX)) dataTooltipText.attr('transform', 'translate('+(xScale(xAxis.labels[i])+xScale.rangeBand()/2)+','+(yScale(d)-tooltipHeight-2)+')');




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
                //console.log('mouse leave');
                tooltipContainer.style('display', 'none');
                svg.select('.bar-selected')
                    .style('display', 'none');
                scope.currentSel = {};
            });
        }
    }


    return {
        restrict: 'AE',
        link: function(scope, element) {barChartSVG(scope, element);},
        scope: {chartData: '=',
            xLabels: '=',
            bars: '=',
            xAxis: '=',
            yAxis: '=',
            xLegend: '=',
            yLegend: '=',
            titleLabel: '=',
            shown: '=',
            subs: '=',
            goBack: '='}
    }
});


function CustomException(message, name) {
    this.message = message;
    this.name = name || 'CustomException';
    this.toString = function() {
        return this.name + ': ' + this.message;
    }
}


