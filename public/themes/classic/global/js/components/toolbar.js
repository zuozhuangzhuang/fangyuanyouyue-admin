/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function(window, document, $){
    "use strict";

    $.components.register("toolbar", {
        mode: "init",
        defaults: {
            adjustment: 15,
            zIndex:1900
        },
        init: function (context, iframe) {
            var iframe$ = iframe ? iframe.$ : $, defaults;

            if (!iframe$.fn.toolbar) {
                return;
            }

            defaults = $.components.getDefaults("toolbar");

            $('[data-plugin="toolbar"]', context).each(function () {
                var $this = iframe$(this);
                var content = $this.data("toolbar");

                var options = $.extend(true, {}, defaults);

                if (content) {
                    options.content = content;
                }

                $this.toolbar(options);
            });
        }
    });
})(window, document, jQuery);