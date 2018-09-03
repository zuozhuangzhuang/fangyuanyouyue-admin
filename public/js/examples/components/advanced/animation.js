/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    'use strict';

    $(document).on('click', '.select-loader', function () {
        var type = $(this).data('type'),
            curr = $('.example-loading .loader').data('type');

        if (type === curr) {
            return;
        }
        $('.example-loading .loader').removeClass('loader-' + curr).addClass('loader-' + type).data('type', type);

    });

    // NProgress
    // -----------------
    $(document).on('click', '.btn', function (e) {
        var $target = $(e.target);
        var id = $target.attr('id');

        parent.NProgress.configure($.po('nprogress'));

        switch (id) {
            case 'exampleNProgressStart':
                parent.NProgress.start();
                break;
            case 'exampleNProgressSet':
                parent.NProgress.set(0.50);
                break;
            case 'exampleNProgressInc':
                parent.NProgress.inc();
                break;
            case 'exampleNProgressDone':
                parent.NProgress.done(true);
                break;

            case 'exampleNProgressDefault':
                parent.NProgress.done(true);
                parent.NProgress.configure($.po('nprogress', {
                    template: '<div class="bar" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                }));
                parent.NProgress.start();
                break;
            case 'exampleNProgressHeader':
                parent.NProgress.done(true);
                parent.NProgress.configure($.po('nprogress', {
                    template: '<div class="bar nprogress-bar-header" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                }));
                parent.NProgress.start();
                break;
            case 'exampleNProgressBottom':
                parent.NProgress.done(true);
                parent.NProgress.configure($.po('nprogress', {
                    template: '<div class="bar nprogress-bar-bottom" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                }));
                parent.NProgress.start();
                break;

            case 'exampleNProgressPrimary':
                parent.NProgress.done(true);
                parent.NProgress.configure($.po('nprogress', {
                    template: '<div class="bar nprogress-bar-primary" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                }));
                parent.NProgress.start();
                break;
            case 'exampleNProgressSuccess':
                parent.NProgress.done(true);
                parent.NProgress.configure($.po('nprogress', {
                    template: '<div class="bar nprogress-bar-success" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                }));
                parent.NProgress.start();
                break;
            case 'exampleNProgressInfo':
                parent.NProgress.done(true);
                parent.NProgress.configure($.po('nprogress', {
                    template: '<div class="bar nprogress-bar-info" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                }));
                parent.NProgress.start();
                break;
            case 'exampleNProgressWarning':
                parent.NProgress.done(true);
                parent.NProgress.configure($.po('nprogress', {
                    template: '<div class="bar nprogress-bar-warning" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                }));
                parent.NProgress.start();
                break;
            case 'exampleNProgressDanger':
                parent.NProgress.done(true);
                parent.NProgress.configure($.po('nprogress', {
                    template: '<div class="bar nprogress-bar-danger" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                }));
                parent.NProgress.start();
                break;
            case 'exampleNProgressDark':
                parent.NProgress.done(true);
                parent.NProgress.configure($.po('nprogress', {
                    template: '<div class="bar nprogress-bar-dark" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                }));
                parent.NProgress.start();
                break;
            case 'exampleNProgressLight':
                parent.NProgress.done(true);
                parent.NProgress.configure($.po('nprogress', {
                    template: '<div class="bar nprogress-bar-light" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                }));
                parent.NProgress.start();
                break;
        }
    });

})(document, window, jQuery);