/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    $.components.register("layer", {
        mode: 'init',
        defaults: {
            target: 'parent',
            confirmBtn: ['确认', '取消'],
            prompt:1
        },
        init: function (context, iframe) {
            var result = (iframe && iframe.layer),
                layer = result ? iframe.layer : window.layer, iframe$, defaults;

            if (typeof layer === 'undefined') {
                return;
            }

            iframe$ = iframe ? iframe.$ : $;
            defaults = this.defaults;

            $(context).on('click.site.layer', '[data-plugin="layer"]', function () {
                var $this = iframe$(this),
                    options = $.extend(true, {}, defaults, $this.data());

                if(options.target === 'self'){
                    if(!result){
                        return console.error('您在当前页面还没有引入layer插件');
                    }
                    layer = iframe.layer;
                }else{
                    layer = result ? window.layer : layer;
                }

                switch (options.type) {
                    case "alert":
                        layer.alert(options.message);
                        break;
                    case "msg":
                        layer.msg(options.message);
                        break;
                    case "confirm":
                        layer.confirm(options.title, {
                            btn: options.confirmBtn
                        },function () {
                            layer.msg(options.successMessage);
                        }, function () {
                            layer.msg(options.cancelMessage);
                        });
                        break;
                    case "prompt":
                        layer.prompt({title:options.title, formType: options.prompt}, function (text, index) {
                            layer.close(index);
                            layer.msg(options.message);
                        });
                        break;
                    case "tips":
                        layer.tips(options.message, $this);
                        break;
                    case "load":
                        layer.load(options.style, {time:options.time});
                        break;
                }
            });
        }
    });
})(window, document, jQuery);