/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function ($) {

	"use strict";


	var WeekLabelList = [];
	var WeekSeries1List = {
		name: "series-1",
		data: []
	};
	var MonthLabelList = [];
	var MonthSeries1List = {
		name: "series-1",
		data: []
	};

    var ecommerce = {
        run: function () {
            this.barChart();
            this.scoreChart();
        },
        scoreChart: function () {
            var scoreChart = function (id, labelList, series1List) {

                var scoreChart = new Chartist.Line('#' + id, {
                    labels: labelList,
                    series: [series1List]
                }, {
                    lineSmooth: Chartist.Interpolation.simple({
                        divisor: 2
                    }),
                    fullWidth: true,
                    chartPadding: {
                        right: 25
                    },
                    series: {
                        "series-1": {
                            showArea: true
                        }
                    },
                    axisX: {
                        showGrid: false
                    },
                    axisY: {
                        labelInterpolationFnc: function (value) {
							//return (value / 1000) + 'K';
							return value;
                        },
                        scaleMinSpace: 40
                    },
                    plugins: [
                        Chartist.plugins.tooltip()
                    ],
                    low: 0,
                    height: 300
                });
                scoreChart.on('created', function (data) {
                    var defs = data.svg.querySelector('defs') || data.svg.elem('defs');

                    var filter = defs
                        .elem('filter', {
                            x: 0,
                            y: "-10%",
                            id: 'shadow' + id
                        }, '', true);

                    filter.elem('feBlend', {
                        in: "SourceGraphic",
                        mode: "multiply"
                    });

                    return defs;
                }).on('draw', function (data) {
                    if (data.type === 'line') {
                        data.element.attr({
                            filter: 'url(#shadow' + id + ')'
                        });

                    } else if (data.type === 'point') {

                        var parent = new Chartist.Svg(data.element._node.parentNode);
                        parent.elem('line', {
                            x1: data.x,
                            y1: data.y,
                            x2: data.x + 0.01,
                            y2: data.y,
                            "class": 'ct-point-content'
                        });
                    }
                    if (data.type === 'line' || data.type === 'area') {
                        data.element.animate({
                            d: {
                                begin: 1000 * data.index,
                                dur: 1000,
                                from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                                to: data.path.clone().stringify(),
                                easing: Chartist.Svg.Easing.easeOutQuint
                            }
                        });
                    }

                });

            };

           

            var createChart = function (button) {
                var btn = button || $("#ecommerceChartView .chart-action").children(".active");

                var chartId = btn.children("a").attr("href");
                switch (chartId) {
                    case "#scoreLineToWeek":
                        scoreChart("scoreLineToWeek", WeekLabelList, WeekSeries1List);
                        break;
                    case "#scoreLineToMonth":
                        scoreChart("scoreLineToMonth", MonthLabelList, MonthSeries1List);
                        break;
                }

            };

            createChart();
            $(".chart-action li").on("click", function () {
				
                createChart($(this));
            });
        },
        barChart: function () {
            var barChart = new Chartist.Bar('.barChart', {
                labels: ['2月', '3月', '4月', '5月', '6月'],
                series: [
                    [630, 700, 500, 400, 780],
                    [400, 800, 700, 500, 700]
                ]
            }, {
                axisX: {
                    showGrid: false
                },
                axisY: {
                    showGrid: false,
                    scaleMinSpace: 30
                },
                height: 220,
                seriesBarDistance: 24
            });

            barChart.on('draw', function (data) {
                if (data.type === 'bar') {

                    // $("#ecommerceRevenue .ct-labels").attr('transform', 'translate(0 15)');
                    var parent = new Chartist.Svg(data.element._node.parentNode);
                    parent.elem('line', {
                        x1: data.x1,
                        x2: data.x2,
                        y1: data.y2,
                        y2: 0,
                        "class": 'ct-bar-fill'
                    });
                }
            });
        }
    };


	function loadWeek(){
		$.ajax({
			url: SERVER_PATH+"/user/system/getProcessList",
			type: 'POST',
			data: {count:7},
			dataType: 'JSON',
			success: function (data) {
				if (data.code==0) {
					console.log(data);
					var datas = data.data;
					for(var index in datas){
						WeekLabelList.push(datas[index].date)
						WeekSeries1List.data.push(datas[index].orderCount);
					}
					WeekLabelList.push('');
					WeekSeries1List.name="series-1";
					ecommerce.run();
				} else {
					if(data.report){
						toastr.error(data.report,"获取数据出错");
					}else{
						 toastr.error('出错了，请重试！',"获取数据出错",{"positionClass":"toast-bottom-right"});
					}
				}
			},
			error: function () {
				toastr.error('服务器异常，请稍后再试！',{"positionClass":"toast-bottom-right"});
			}
	 	});
	
	}
	loadWeek();

	function loadMonth(){
		$.ajax({
			url: SERVER_PATH+"/user/system/getProcessList",
			type: 'POST',
			data: {count:30},
			dataType: 'JSON',
			success: function (data) {
				if (data.code==0) {
					console.log(data);
					var datas = data.data;
					for(var index in datas){
						MonthLabelList.push(datas[index].date)
						MonthSeries1List.data.push(datas[index].orderCount);
					}
					MonthLabelList.push('');
					MonthSeries1List.name="series-1";
				} else {
					if(data.report){
						toastr.error(data.report,"获取数据出错");
					}else{
						 toastr.error('出错了，请重试！',"获取数据出错",{"positionClass":"toast-bottom-right"});
					}
				}
			},
			error: function () {
				toastr.error('服务器异常，请稍后再试！',{"positionClass":"toast-bottom-right"});
			}
	 	});
	}

	loadMonth();
    function loadCount(){
		$.ajax({
			url: SERVER_PATH+"/user/system/getProcess",
			type: 'POST',
			data: {},
			dataType: 'JSON',
			success: function (data) {
				if (data.code==0) {
						$("#todayOrder").text(data.data.todayOrder)
						$("#allOrder").text(data.data.allOrder)
						$("#allGoods").text(data.data.allGoods)
						$("#todayGoods").text(data.data.todayGoods)
						
						$("#allForum").text(data.data.allForum)
						$("#todayForum").text(data.data.todayForum)
						$("#allUser").text(data.data.allUser)
						$("#todayUser").text(data.data.todayUser)
				} else {
					if(data.report){
						toastr.error(data.report,"获取数据出错");
					}else{
						 toastr.error('出错了，请重试！',"获取数据出错",{"positionClass":"toast-bottom-right"});
					}
				}
			},
			error: function () {
				toastr.error('服务器异常，请稍后再试！',{"positionClass":"toast-bottom-right"});
			}
	 	});
	}

	loadCount();
			
    
    	
})(jQuery);
