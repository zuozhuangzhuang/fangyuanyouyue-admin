/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    'use strict';

    var $addModal = $('#addtodoItemForm'),
        $editMdal = $('#edittodoItemForm');

    var team = {
        chartExample: function () { // 折线图提示
            var options = {
                showArea: true,
                low: 0,
                high: 1000,
                height: 453,
                fullWidth: true,
                axisX: {
                    offset: 30
                },
                axisY: {
                    offset: 30,
                    labelInterpolationFnc: function (value) {
                        if (value === 0) {
                            return null;
                        }
                        return value;
                    },
                    scaleMinSpace: 50
                },
                chartPadding: {
                    bottom: 12,
                    left: 10
                },
                plugins: [
                    Chartist.plugins.tooltip()
                ]
            };

            var labelList = ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月'];
            var series1List = {
                name: 'series-1',
                data: [0, 180, 600, 980, 850, 600, 300, 350, 600, 200, 630, 350]
            };
            var series2List = {
                name: 'series-2',
                data: [0, 100, 520, 810, 620, 500, 630, 400, 380, 405, 210, 220]

            };

            var newScoreLineChart = function (chartId, labelList, series1List, series2List, options) {

                var lineChart = new Chartist.Line(chartId, {
                    labels: labelList,
                    series: [series1List, series2List]
                }, options);

                lineChart.on('draw', function (data) {
                    var elem, parent;
                    if (data.type === 'point') {
                        elem = data.element;
                        parent = new Chartist.Svg(elem._node.parentNode);

                        parent.elem('line', {
                            x1: data.x,
                            y1: data.y,
                            x2: data.x + 0.01,
                            y2: data.y,
                            "class": 'ct-point-content'
                        });
                    }
                });
            };

            newScoreLineChart("#teamCompletedWidget .ct-chart", labelList,
                series1List, series2List, options);
        },
        waitingThing: function () { // 待办事项
            var self = this;

            $('#addNewItemBtn').on('click', function () {
                $addModal.modal('show');
            });

            $("#toDoListWidget .list-group-item input").on('click', function (e) {
                e.stopPropagation();
            });

            $('#toDoListWidget .list-group-item').on('click', function () {
                var dueDate = $(this).find(".item-due-date > span").text();
                self.title = $(this).find(".item-title").text();

                $editMdal
                    .modal('show')
                    .on('shown.bs.modal', function () {
                        $(this).find('iframe').prop('contentWindow').teamModal.editDraw(self.title, self.date);
                    });

                if (dueDate === "No due date") {
                    self.date = null;
                } else {
                    self.date = "8/25/2015";
                }
            });
        },
        run: function () {
            this.chartExample();

            $addModal.modal({
                show: false,
                pageHeight: 370,
                page: $.ctx + '/examples/pages/home/team/_add-todo.html'
            });

            $editMdal.modal({
                show: false,
                pageHeight: 370,
                page: $.ctx + '/examples/pages/home/team/_edit-todo.html'
            });

            this.waitingThing();
        }
    };

    team.run();

})(document, window, jQuery);