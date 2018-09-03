/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    'use strict';

    App.extend({
        handleFullcalendar: function () {
            var my_events = [{
                title: '每天',
                start: '2016-10-01'
            }, {
                title: '长事件',
                start: '2016-10-07',
                end: '2016-10-10',
                backgroundColor: $.colors("cyan", 600),
                borderColor: $.colors("cyan", 600)
            }, {
                id: 999,
                title: '重复事件',
                start: '2016-10-09T16:00:00',
                backgroundColor: $.colors("red", 600),
                borderColor: $.colors("red", 600)
            }, {
                title: '会议',
                start: '2016-10-11',
                end: '2016-10-13'
            }, {
                title: '开会',
                start: '2016-10-12T10:30:00',
                end: '2016-10-12T12:30:00'
            }, {
                title: '午餐',
                start: '2016-10-12T12:00:00'
            }, {
                title: '开会',
                start: '2016-10-12T14:30:00'
            }, {
                title: '休息',
                start: '2016-10-12T17:30:00'
            }, {
                title: '活动',
                start: '2016-10-12T20:00:00'
            }, {
                title: '生日会',
                start: '2016-10-13T07:00:00'
            }];

            var actionBtn = $('.site-action').actionBtn().data('actionBtn');
            var my_options = {
                header: {
                    left: null,
                    center: 'prev,title,next',
                    right: 'month,agendaWeek,agendaDay'
                },
                defaultDate: '2016-10-12',
                selectable: true,
                selectHelper: true,
                select: function () {
                    $('#addNewEvent').modal('show');
                },
                editable: true,
                eventLimit: true,
                windowResize: function (view) {
                    var width = $(window).outerWidth();
                    var options = $.extend({}, my_options);
                    options.events = view.calendar.getEventCache();
                    options.aspectRatio = width < 667 ? 0.5 : 1.35;

                    $('#calendar').fullCalendar('destroy');
                    $('#calendar').fullCalendar(options);
                },
                eventClick: function (event) {
                    $('#editNewEvent')
                        .modal('show')
                        .one('shown.bs.modal', function () {
                            $(this).find('iframe').prop('contentWindow').calendarEvent.shownModal(event);
                        })
                        .one('hide.bs.modal', function () {
                            $(this).find('iframe').prop('contentWindow').calendarEvent.hidenModal(event, function(data){
                                $('#calendar').fullCalendar('updateEvent', data);
                            });
                        });
                },
                eventDragStart: function () {
                    actionBtn.show();
                },
                eventDragStop: function () {
                    actionBtn.hide();
                },
                events: my_events,
                droppable: true
            };

            var _options;
            var my_options_mobile = $.extend({}, my_options);

            my_options_mobile.aspectRatio = 0.5;
            _options = $(window).outerWidth() < 667 ? my_options_mobile : my_options;

            $('#calendar').fullCalendar(_options);
        },
        handleEventList: function () {
            $('#addNewEventBtn').on('click', function () {
                $('#addNewEvent').modal('show');
            });

            $('.calendar-list .calendar-event').each(function () {
                var $this = $(this),
                    color = $this.data('color').split('-');
                $this.data('event', {
                    title: $this.data('title'),
                    stick: $this.data('stick'),
                    backgroundColor: $.colors(color[0], color[1]),
                    borderColor: $.colors(color[0], color[1])
                });
                $this.draggable({
                    zIndex: 999,
                    revert: true,
                    revertDuration: 0,
                    helper: function () {
                        return '<a class="fc-day-grid-event fc-event fc-start fc-end" style="background-color:' + $.colors(color[0], color[1]) + ';border-color:' + $.colors(color[0], color[1]) + '">' +
                            '<div class="fc-content">' +
                            '<span class="fc-title">' + $this.data('title') + '</span>' +
                            '</div>' +
                            '</a>';
                    }
                });
            });
        },
        handleListItem: function () {
            $('.site-action').on('click', function (e) {
                $('#addNewCalendar').modal('show');
                e.stopPropagation();
            });

            $(document).on('click', '[data-tag=list-delete]', function () {
                parent.layer.alert("你想删除这个日历吗?", {icon: 4}, function (index) {
                    // $(e.target).closest('.list-group-item').remove();
                    parent.layer.close(index);
                });
            });
        },
        handleAction: function () {
            //var actionBtn = $('.site-action').actionBtn().data('actionBtn');
        },
        run: function (next) {
            $('#addNewCalendar').modal({
                show: false,
                pageHeight: 340,
                page: $.ctx + '/examples/pages/team/calendar/_add-calendar.html'
            });

            $('#addNewEvent').modal({
                show: false,
                pageHeight: 560,
                page: $.ctx + '/examples/pages/team/calendar/_add-event.html'
            });

            $('#editNewEvent').modal({
                show: false,
                pageHeight: 560,
                page: $.ctx + '/examples/pages/team/calendar/_edit-event.html'
            });

            this.handleFullcalendar();
            this.handleEventList();
            this.handleListItem();
            this.handleAction();

            next();
        }
    });

    App.run();

})(document, window, jQuery);