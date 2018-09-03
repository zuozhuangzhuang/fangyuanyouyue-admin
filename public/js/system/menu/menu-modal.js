/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
"use strict";
(function (window, document, $) {
    var $iconSelected = $('.icp-dd'),
        $icon = $iconSelected.parent().find('[data-icon]');

    var topMenus = window.topMenus = {
        id: '',
        $topMenuModal: null,
        menuData: null,
        topMenuEdit: function (data) {
            var icon = data.icon;
            this.id = data.id;

            $icon.removeClass('fa-bars').addClass(icon).attr('data-icon', icon);
            $('input[name="menu_name"]').val(data.text);
        },
        authView: function () {
            return function (html) {
                var $select = $('select[name="menu_limit"]');

                $select.html(html);
                $select.selectpicker($.po('selectpicker'));
            };
        },
        hideModal: function ($el) {
            $el.modal('hide');
        }
    };

    $iconSelected
        .iconpicker($.po('iconpickerWb'))
        .on('iconpickerSelected', function (e) {
            $(this).prev('span').children('i[data-icon]').data('icon', e.iconpickerValue).attr('data-icon', e.iconpickerValue);
        });

    $.validator.addMethod('limitValid', function (value) {
        return value !== null;
    }, '至少选择一个系统权限');

    $('#controlMenu')
        .validate({
            rules: {
                menu_name: {
                    required: true
                },
                menu_limit: {
                    limitValid: true
                }
            },
            messages: {
                menu_name:{
                    required: '请填写菜单名称'
                }
            },
            submitHandler: function (form) {
                var $form = $(form);
                var topMenuId = topMenus.id;

                var auth = $form.find('[name="menu_limit"]').val(),
                    menuData = {
                        id: topMenuId,
                        text: $form.find('[name="menu_name"]').val(),
                        icon: $icon.data("icon")
                    };
                menuData.auth = [];

                for (var item in auth) {
                    menuData.auth.push({id: auth[item]});
                }

                if (topMenuId) {
                    menuData.type = 'update';
                } else {
                    menuData.type = 'add';
                }

                topMenus.menuData = menuData;

                $.ajax({
                    url: $.ctx + '/menu/save',
                    type: 'POST',
                    data: {menu: JSON.stringify(menuData)},
                    dataType: 'JSON',
                    success: function (data) {
                        if (data.success) {
                            delete menuData.type;

                            if (!topMenuId) {
                                topMenus.id = menuData.id = data.id;
                                menuData.layer = data.layer;
                                menuData.children = null;
                            }

                            toastr.info('重新登录可更新顶部菜单！');

                            topMenus.$topMenuModal.modal('hide');
                        } else {
                            toastr.error('出错了，请重试！');
                            topMenus.menuData = '';
                        }
                    },
                    error: function () {
                        toastr.error('服务器异常，请稍后再试！');
                    }
                });
            }
        });
})(window, document, jQuery);