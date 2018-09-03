/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    'use strict';

    App.extend({
        run: function (next) {
            $('.markdown-edit').markdown({
                language: 'zh',
                iconlibrary: 'fa'
            });

            next();
        }
    });

    App.run();

})(document, window, jQuery);
