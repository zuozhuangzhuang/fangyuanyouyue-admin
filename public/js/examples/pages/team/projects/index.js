/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    'use strict';

    App.extend({
        handleProject: function () {
            $(document).on('click', '[data-tag=project-delete]', function (e) {
                var $target = $(e.target);

                parent.layer.alert("您确定要删除这个项目吗？", {icon: 4}, function (index) {
                    $target.closest('.list-group-item').remove();
                    parent.layer.close(index);
                });
            });
        },
        run: function (next) {
            this.handleProject();

            next();
        }
    });

    App.run();

})(document, window, jQuery);
