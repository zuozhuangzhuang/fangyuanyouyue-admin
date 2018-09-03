/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function(window, document, $){
    "use strict";

    $.components.register("appear", {
        defaults: {},
        api: function (context, iframe) {
            var iframe$ = iframe ? iframe.$ : $;

            if (!iframe$.fn.appear) {
                return;
            }

            iframe$(context).on("appear", '[data-plugin="appear"]', function () {
                var $item = $(this),
                    animate = $item.data("animate", iframe$);

                if ($item.hasClass('appear-no-repeat')) {
                    return;
                }
                $item.removeClass("invisible").addClass('animation-' + animate);

                if ($item.data("repeat") === false) {
                    $item.addClass('appear-no-repeat');
                }
            });

            iframe$(context).on("disappear", '[data-plugin="appear"]', function () {
                var $item = $(this),
                    animate = $item.data("animate", iframe$);

                if ($item.hasClass('appear-no-repeat')) {
                    return;
                }

                $item.addClass("invisible").removeClass('animation-' + animate);
            });
        },

        init: function (context, iframe) {
            var iframe$ = iframe ? iframe.$ : $;

            if (!iframe$.fn.appear) {
                return;
            }
            var defaults = $.components.getDefaults("appear");

            iframe$('[data-plugin="appear"]', context).appear(defaults);
            iframe$('[data-plugin="appear"]', context).not(':appeared').addClass("invisible");
        }
    });
})(window, document, jQuery);