/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    $.components.register("toastr", {
        mode: "api",
        defaults: {},
        api: function (context, iframe) {
            var toastr = (iframe && iframe.toastr) ? iframe.toastr : window.toastr,
                iframe$ = iframe ? iframe.$ : $, defaults;

            if (typeof toastr === "undefined") {
                return;
            }
            defaults = $.components.getDefaults("toastr");

            $(context).on('click.site.toastr', '[data-plugin="toastr"]', function (e) {
                e.preventDefault();
                
                var $this = $(this),
                    options = $.extend(true, {}, defaults, $this.data(iframe$)),
                    message = options.message || '',
                    type = options.type || "info",
                    title = options.title || undefined;

                switch (type) {
                    case "success":
                        toastr.success(message, title, options);
                        break;
                    case "warning":
                        toastr.warning(message, title, options);
                        break;
                    case "error":
                        toastr.error(message, title, options);
                        break;
                    case "info":
                        toastr.info(message, title, options);
                        break;
                    default:
                        toastr.info(message, title, options);
                }
            });
        }
    });
})(window, document, jQuery);