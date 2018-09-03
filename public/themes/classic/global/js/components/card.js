/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    $.components.register("card", {
        mode: "init",
        defaults: {},
        init: function (context, iframe) {
            var iframe$ = iframe ? iframe.$ : $, defaults;

            if (!iframe$.fn.card) {
                return;
            }

            defaults = $.components.getDefaults("card");

            $('[data-plugin="card"]', context).each(function () {
                var options = $.extend({}, defaults, $(this).data(iframe$));

                if (options.target) {
                    options.container = iframe$(options.target);
                }

                iframe$(this).card(options);
            });
        }
    });
})(window, document, jQuery);