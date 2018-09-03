/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function(window, document, $){
    "use strict";

    $.components.register("verticalTab", {
        mode: "init",
        init: function (context, iframe) {
            var iframe$ = iframe ? iframe.$ : $;

            if (!iframe$.fn.matchHeight) {
                return;
            }

            $('.nav-tabs-vertical', context).each(function () {
                iframe$(this).children().matchHeight();
            });
        }
    });

    $.components.register("horizontalTab", {
        mode: "init",
        init: function (context,iframe) {
            var iframe$ = iframe ? iframe.$ : $, $nav;

            if (!iframe$.fn.responsiveHorizontalTabs) {
                return;
            }

            $nav = $('[data-approve="nav-tabs"]', context);
            $nav.each(function () {
                var $item = iframe$(this),
                    options = $.extend(true, {}, $item.data());

                $item.responsiveHorizontalTabs(options);
            });
        }
    });
})(window, document, jQuery);