/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    'use strict';

    App.extend({
        handleArrangement: function () {
            $(document).on('click', '#arrangement-grid', function () {
                var $this = $(this);
                if ($this.hasClass('active')) {
                    return;
                }
                $('#arrangement-list').removeClass('active');
                $this.addClass('active');
                $('.media-list').removeClass('is-list').addClass('is-grid');
                $('.media-list>ul>li').removeClass('animation-fade').addClass('animation-scale-up');

            });

            $(document).on('click', '#arrangement-list', function () {
                var $this = $(this);
                if ($this.hasClass('active')) {
                    return;
                }
                $('#arrangement-grid').removeClass('active');
                $this.addClass('active');
                $('.media-list').removeClass('is-grid').addClass('is-list');
                $('.media-list>ul>li').removeClass('animation-scale-up').addClass('animation-fade');
            });
        },
        handleActive: function () {
            $.po('selectable').rowSelector = '.media-item';
        },
        handleAction: function () {
            var actionBtn = $('.site-action').actionBtn().data('actionBtn');
            var $selectable = $('[data-selectable]');

            $('.site-action-toggle').on('click', function (e) {
                var $selected = $selectable.asSelectable('getSelected');

                if ($selected.length === 0) {
                    $('#fileupload').trigger('click');
                    e.stopPropagation();
                }
            });

            $(document).on('click', '[data-action="trash"]', '.site-action', function () {
                toastr.info('删除所选文件');
            });

            $(document).on('click', '[data-action="download"]', '.site-action', function () {
                toastr.info('下载所选文件');
            });

            $(document).on('asSelectable::change', '[data-selectable]', function (e, api, checked) {
                if (checked) {
                    actionBtn.show();
                } else {
                    actionBtn.hide();
                }
            });
        },
        handleDropdownAction: function () {
            $(document).on('show.bs.dropdown', '.info-wrap>.dropdown', function () {
                $(this).closest('.media-item').toggleClass('item-active');
            }).on('hidden.bs.dropdown', '.info-wrap>.dropdown', function () {
                $(this).closest('.media-item').toggleClass('item-active');
            });
            $(document).on('click', '.info-wrap .dropdown-menu', function (e) {
                e.stopPropagation();
            });

        },
        run: function (next) {
            $(document).on('click', '.media-item-actions', function (e) {
                e.stopPropagation();
            });

            this.handleArrangement();
            this.handleAction();
            this.handleActive();
            this.handleDropdownAction();

            next();
        }
    });

    App.run();

})(document, window, jQuery);
