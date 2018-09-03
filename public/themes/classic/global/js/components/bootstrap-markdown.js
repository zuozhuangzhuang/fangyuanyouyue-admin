/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    $.components.register("markdown", {
        mode: "init",
        defaults: {
            autofocus: false,
            savable: false,
            language: 'zh'
        },
        init: function (context, iframe) {
            var iframe$ = iframe ? iframe.$ : $, defaults;

            if (!iframe$.fn.markdown) {
                return;
            }

            defaults = this.defaults;

            $('textarea[data-plugin="markdown"]', context).each(function () {
                var options = $.extend(true, {}, defaults, $(this).data(iframe$));

                iframe$(this).markdown(options);
            });
        }
    });
})(window, document, jQuery);