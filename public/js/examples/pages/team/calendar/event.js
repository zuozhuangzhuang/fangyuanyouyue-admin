/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    'use strict';

    window.calendarEvent ={
        shownModal: function (event) {
            var color = event.backgroundColor ? event.backgroundColor : $.colors('blue', 600);

            $('#editEname').val(event.title);

            if (event.start) {
                $('#starts').datepicker('update', event.start._d);
            } else {
                $('#starts').datepicker('update', '');
            }
            if (event.end) {
                $('#ends').datepicker('update', event.end._d);
            } else {
                $('#ends').datepicker('update', '');
            }

            $('#editColor [type=radio]').each(function () {
                var $this = $(this),
                    value = $this.data('color').split('|');
                value = $.colors(value[0], value[1]);

                if (value === color) {
                    $this.prop('checked', true);
                } else {
                    $this.prop('checked', false);
                }
            });
            $('#editColor [value="' + event.backgroundColor + '"]').prop('checked', true);
        },
        hidenModal: function (event, callback) {
            event.title = $('#editEname').val();

            var color = $('#editColor [type=radio]:checked').data('color').split('|');
            color = $.colors(color[0], color[1]);
            event.backgroundColor = color;
            event.borderColor = color;


            event.start = new Date($('#starts').data('datepicker').getDate());
            event.end = new Date($('#ends').data('datepicker').getDate());

            callback(event);
        }
    };

    App.extend({
        handleDate: function () {
            $('#starts, #ends').datepicker($.po('datepicker', {
                language: 'zh-CN'
            }));
        },
        run: function (next) {
            window.calendar.handleSelective();
            this.handleDate();

            next();
        }
    });

    App.run();

})(document, window, jQuery);