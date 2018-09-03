/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    'use strict';

    var article = {
        affixHandle: function () {
            $('#articleAffix').affix({
                offset: {
                    top: 210
                }
            });
        },
        scrollHandle: function () {
            $('body').scrollspy({
                target: '#articleAffix'
            });
        },
        run: function () {
            this.scrollHandle();
            this.affixHandle();

        }
    };

    article.run();

})(document, window, jQuery);
