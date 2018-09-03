/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function(window, document, $){
    "use strict";

    $.components.register("switchery", {
        mode: "init",
        defaults: {
            color: $.colors("purple", 600)
        },
        init: function (context, iframe) {
            var Switchery = (iframe && iframe.Switchery) ? iframe.Switchery : window.Switchery,
                iframe$ = iframe ? iframe.$ : $, defaults;

            if (typeof Switchery === "undefined") {
                return;
            }

            defaults = $.components.getDefaults("switchery");

            $('[data-plugin="switchery"]', context).each(function () {
                var options = $.extend({}, defaults, $(this).data(iframe$));

                new Switchery(this, options);
            });
        }
    });
})(window, document, jQuery);