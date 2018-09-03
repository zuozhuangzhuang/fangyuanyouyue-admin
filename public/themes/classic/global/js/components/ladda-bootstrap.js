/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    $.components.register("ladda", {
        mode: "init",
        defaults: {
            timeout: 2000
        },
        init: function (context, iframe) {
            var Ladda = (iframe && iframe.Ladda) ? iframe.Ladda : window.Ladda, defaults;

            if (typeof Ladda === "undefined") {
                return;
            }

            defaults = $.components.getDefaults("ladda");

            Ladda.bind('[data-plugin="ladda"]', defaults);
        }
    });

    $.components.register("laddaProgress", {
        mode: "init",
        defaults: {},
        init: function (context, iframe) {
            var Ladda = (iframe && iframe.Ladda) ? iframe.Ladda : window.Ladda, defaults, options;

            if (typeof Ladda === 'undefined') {
                return;
            }

            defaults = $.components.getDefaults("laddaProgress");
            options = $.extend({}, defaults, {
                callback: function (instance) {
                    var progress = 0;
                    var interval = setInterval(function () {
                        progress = Math.min(progress + Math.random() * 0.1, 1);
                        instance.setProgress(progress);

                        if (progress === 1) {
                            instance.stop();
                            clearInterval(interval);
                        }
                    }, 300);
                }
            });
            Ladda.bind('[data-plugin="laddaProgress"]', options);
        }
    });
})(window, document, jQuery);