/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    $.components.register("filterable", {
        mode: "init",
        defaults: {
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        },
        init: function (context, iframe) {
            var iframe$ = iframe ? iframe.$ : $,
                _window = iframe ? iframe : window, defaults, callback;

            if (typeof iframe$.fn.isotope === "undefined") {
                return;
            }

            defaults = $.components.getDefaults('filterable');

            callback = function () {
                $('[data-filterable]', context).each(function () {
                    var $this = iframe$(this);

                    var options = $.extend(true, {}, defaults, $this.data(), {
                        filter: '*'
                    });

                    $this.isotope(options);
                });

                $('[data-filter]', context).click(function (e) {
                    var $this = $(this),
                        target = $this.data('target', iframe$),
                        $li = $this.parent('li'), $list, filter;

                    if (!target) {
                        target = $this.attr('href');
                        target = target && target.replace(/.*(?=#[^\s]*$)/, '');
                    }

                    $li.siblings('.active').each(function () {
                        $(this).find('a').attr('aria-expanded', false);
                        $(this).removeClass('active');
                    });

                    $li.addClass('active');
                    $this.attr('aria-expanded', true);

                    $list = iframe$(target, context);
                    filter = $this.attr('data-filter');

                    if (filter !== '*') {
                        filter = '[data-type="' + filter + '"]';
                    }

                    $list.isotope({
                        filter: filter
                    });

                    e.preventDefault();
                });
            };

            if (context !== document) {
                callback();
            } else {
                $(_window).on('load', function () {
                    callback();
                });
            }
        }
    });
})(window, document, jQuery);